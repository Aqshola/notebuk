package controller

import (
	"backend/src/constants"
	"backend/src/lib/common"
	"backend/src/lib/mail"
	"backend/src/repository/auth"
	"database/sql"
	"path/filepath"
	"time"

	"encoding/json"
	"fmt"
	"net/http"
)

type (
	RequestSignUp struct {
		Email    string `json:"email"`
		Password string `json:"password"`
		Name     string `json:"name"`
	}

	ResponseSignUpData struct {
		UserId int    `json:"userId"`
		Email  string `json:"email"`
		Name   string `json:"name"`
	}
)

func (inj *AppInjection) SignUp(w http.ResponseWriter, r *http.Request) {
	var requestData RequestSignUp
	err := json.NewDecoder(r.Body).Decode(&requestData)

	if err != nil {
		common.SendJSONResponse(w, http.StatusBadRequest, constants.ERROR_FAILED_DECODE_PAYLOOAD, nil, constants.RESPONSE_DECODE_PAYLOAD_ERROR)
		return
	}

	usersRepository := auth.NewUsersRepository(inj.DB)
	userCodeVerifRepository := auth.NewUserCodeVerifRepository(inj.DB)

	userExist, err := usersRepository.GetUserByEmail(requestData.Email)
	if err != nil {
		common.SendJSONResponse(w, http.StatusBadRequest, constants.ERROR_DATABASE_CALL, nil, constants.RESPONSE_AUTH_VALIDATION_ERROR)
		return
	}

	if userExist != nil {
		common.SendJSONResponse(w, http.StatusBadRequest, constants.ERROR_AUTH_USER_ALREADY_EXIST, nil, constants.RESPONSE_AUTH_USER_EXISTS_ERROR)
		return
	}
	insertedUser, err := usersRepository.InsertUser(requestData.Email, requestData.Password, requestData.Name)
	if err != nil {
		errMsg := fmt.Sprintf("FAILED CREATED USER: %s", err.Error())
		common.SendJSONResponse(w, http.StatusInternalServerError, constants.ERROR_DATABASE_CALL_INSERT, nil, errMsg)
		return
	}

	_, errCodeVerif := userCodeVerifRepository.InsertCodeVerification(insertedUser.Id)
	if errCodeVerif != nil {
		errMsg := fmt.Sprintf("FAILED CREATED VERIFICATION CODE: %s", err.Error())
		common.SendJSONResponse(w, http.StatusInternalServerError, constants.ERROR_DATABASE_CALL_INSERT, nil, errMsg)
		return
	}

	responseData := &ResponseSignUpData{
		UserId: insertedUser.Id,
		Email:  insertedUser.Email,
		Name:   insertedUser.Name,
	}

	// emailData := map[string]interface{}{
	// 	"Username": insertedUser.Name,
	// 	"Code":     verificationData.Code,
	// }

	// templatePath, _ := filepath.Abs("src/lib/mail/template/verif-mail.html")
	// err = mail.SendEmailHTML(insertedUser.Email, "Notebuk Verification Mail", emailData, templatePath)
	// if err != nil {
	// 	errMsg := fmt.Sprintf("FAILED SEND EMAIL: %s", err.Error())
	// 	common.SendJSONResponse(w, http.StatusInternalServerError, constants.ERROR_THRD_EMAIL_FAIL_SEND, nil, errMsg)
	// 	return
	// }
	common.SendJSONResponse(w, http.StatusOK, constants.NO_ERROR, responseData, constants.RESPONSE_AUTH_SIGNUP_SUCCESS)
}

type (
	RequestValidate struct {
		Email string `json:"email"`
		Code  string `json:"code"`
	}

	ResponseValidateData struct {
		Message string `json:"message"`
	}
)

func (inj *AppInjection) Validate(w http.ResponseWriter, r *http.Request) {

	var requestData RequestValidate

	err := json.NewDecoder(r.Body).Decode(&requestData)
	if err != nil {
		common.SendJSONResponse(w, http.StatusBadRequest, constants.ERROR_FAILED_DECODE_PAYLOOAD, nil, constants.RESPONSE_DECODE_PAYLOAD_ERROR)
		return
	}

	userRepository := auth.NewUsersRepository(inj.DB)
	codeVerifRepository := auth.NewUserCodeVerifRepository(inj.DB)
	accessTokenRepository := auth.NewUserAccessTokenRepository(inj.DB)
	refreshTokenRepository := auth.NewUserRefreshTokenRepository(inj.DB)

	userData, err := userRepository.GetUserByEmail(requestData.Email)
	if err != nil {
		common.SendJSONResponse(w, http.StatusBadRequest, constants.ERROR_DATABASE_CALL_GET, nil, constants.RESPONSE_AUTH_VERIFY_ERROR)
		return
	}

	if userData == nil {
		common.SendJSONResponse(w, http.StatusBadRequest, constants.ERROR_DATABASE_NOTFOUND, nil, constants.RESPONSE_AUTH_USER_NOT_FOUND_ERROR)
		return
	}

	verifData, err := codeVerifRepository.GetCodeVerificationByUserId(userData.Id)
	if err != nil {
		common.SendJSONResponse(w, http.StatusBadRequest, constants.ERROR_DATABASE_CALL_GET, nil, constants.RESPONSE_AUTH_VERIFY_ERROR)
		return
	}

	if verifData == nil {
		common.SendJSONResponse(w, http.StatusBadRequest, constants.ERROR_DATABASE_NOTFOUND, nil, constants.RESPONSE_AUTH_VERIFY_CODE_INVALID_ERROR)
		return
	}

	if verifData.Code != requestData.Code {
		common.SendJSONResponse(w, http.StatusBadRequest, constants.ERROR_AUTH_VERIFICATION_ERROR, nil, constants.RESPONSE_AUTH_VERIFY_CODE_INVALID_ERROR)
		return
	}

	if verifData.Code == requestData.Code && verifData.ExpiredAt.Before(time.Now()) {
		common.SendJSONResponse(w, http.StatusBadRequest, constants.ERROR_AUTH_VERIFICATION_ERROR, nil, constants.RESPONSE_AUTH_VERIFY_CODE_INVALID_ERROR)
		return
	}

	userToken, err := common.GenerateUserToken(userData.Id)
	if err != nil {
		common.SendJSONResponse(w, http.StatusBadRequest, constants.ERROR_THRD_JWT_GENERATE_TOKEN, nil, constants.RESPONSE_THIRD_PARTY_JWT_GENERATE_TOKEN_ERROR)
		return
	}

	//STORE DATA
	accessTokenData, err := accessTokenRepository.InsertUserAccessToken(userData.Id, userToken.AccessToken, userToken.ExpiredAccessToken)
	if err != nil {
		fmt.Println(err)
		common.SendJSONResponse(w, http.StatusBadRequest, constants.ERROR_DATABASE_CALL_INSERT, nil, constants.RESPONSE_THIRD_PARTY_JWT_GENERATE_TOKEN_ERROR)
		return
	}

	_, err = refreshTokenRepository.InsertUserRefreshToken(userData.Id, userToken.RefreshToken, userToken.ExpiredRefreshToken, accessTokenData.Id)
	if err != nil {
		fmt.Println(err)
		common.SendJSONResponse(w, http.StatusBadRequest, constants.ERROR_DATABASE_CALL_INSERT, nil, constants.RESPONSE_THIRD_PARTY_JWT_GENERATE_TOKEN_ERROR)
		return
	}

	err = codeVerifRepository.DeleteCodeVerificationById(verifData.Id)
	if err != nil {
		common.SendJSONResponse(w, http.StatusBadRequest, constants.ERROR_DATABASE_CALL_DELETE, nil, constants.RESPONSE_AUTH_VALIDATION_ERROR)
		return
	}

	responseData := ResponseValidateData{
		Message: "Success Login",
	}

	accessTokenCookie := http.Cookie{Name: "accessToken", Value: userToken.AccessToken, HttpOnly: true, SameSite: http.SameSiteNoneMode, Secure: true}
	refreshTokenCookie := http.Cookie{Name: "refreshToken", Value: userToken.RefreshToken, HttpOnly: true, SameSite: http.SameSiteNoneMode, Secure: true}
	http.SetCookie(w, &accessTokenCookie)
	http.SetCookie(w, &refreshTokenCookie)
	common.SendJSONResponse(w, http.StatusOK, constants.NO_ERROR, responseData, constants.RESPONSE_AUTH_VALIDATE_SUCCESS)
}

type (
	RequestRequestCode struct {
		Email string `json:"email"`
	}
)

func (inj *AppInjection) RequestCode(w http.ResponseWriter, r *http.Request) {
	var requestData RequestRequestCode

	err := json.NewDecoder(r.Body).Decode(&requestData)
	if err != nil {
		common.SendJSONResponse(w, http.StatusBadRequest, constants.ERROR_FAILED_DECODE_PAYLOOAD, nil, constants.RESPONSE_DECODE_PAYLOAD_ERROR)
		return
	}

	userRepository := auth.NewUsersRepository(inj.DB)
	codeVerifRepository := auth.NewUserCodeVerifRepository(inj.DB)

	userData, err := userRepository.GetUserByEmail(requestData.Email)
	if err != nil {
		common.SendJSONResponse(w, http.StatusBadRequest, constants.ERROR_DATABASE_CALL_GET, nil, constants.RESPONSE_AUTH_FAILED_REQUEST_CODE_ERROR)
		return
	}

	if userData == nil {
		common.SendJSONResponse(w, http.StatusBadRequest, constants.ERROR_DATABASE_NOTFOUND, nil, constants.RESPONSE_AUTH_USER_NOT_FOUND_ERROR)
		return
	}

	verifData, err := codeVerifRepository.GetCodeVerificationByUserId(userData.Id)
	if err != nil {
		common.SendJSONResponse(w, http.StatusBadRequest, constants.ERROR_DATABASE_CALL_GET, nil, constants.RESPONSE_AUTH_VERIFY_ERROR)
		return
	}

	if verifData != nil {
		err := codeVerifRepository.DeleteCodeVerificationById(verifData.Id)
		if err != nil {
			common.SendJSONResponse(w, http.StatusBadRequest, constants.ERROR_DATABASE_CALL_DELETE, nil, constants.RESPONSE_THIRD_PARTY_FAIL_GENERATE_CODE)
			return
		}
	}

	verificationData, err := codeVerifRepository.InsertCodeVerification(userData.Id)
	if err != nil {
		errMsg := fmt.Sprintf("FAILED CREATED VERIFICATION CODE: %s", err.Error())
		common.SendJSONResponse(w, http.StatusInternalServerError, constants.ERROR_DATABASE_CALL_INSERT, nil, errMsg)
		return
	}

	emailData := map[string]interface{}{
		"Username": userData.Name,
		"Code":     verificationData.Code,
	}

	templatePath, _ := filepath.Abs("src/lib/mail/template/verif-mail.html")
	err = mail.SendEmailHTML(userData.Email, "Notebuk Verification Mail", emailData, templatePath)
	if err != nil {
		errMsg := fmt.Sprintf("FAILED SEND EMAIL: %s", err.Error())
		common.SendJSONResponse(w, http.StatusInternalServerError, constants.ERROR_THRD_EMAIL_FAIL_SEND, nil, errMsg)
		return
	}
	common.SendJSONResponse(w, http.StatusOK, constants.NO_ERROR, nil, "SUCCESS REQUEST CODE")

}

type (
	RequestSignIn struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
)

func (inj *AppInjection) SignIn(w http.ResponseWriter, r *http.Request) {
	var requestData RequestSignIn

	err := json.NewDecoder(r.Body).Decode(&requestData)
	if err != nil {
		common.SendJSONResponse(w, http.StatusBadRequest, constants.ERROR_FAILED_DECODE_PAYLOOAD, nil, constants.RESPONSE_DECODE_PAYLOAD_ERROR)
		return
	}

	usersRepository := auth.NewUsersRepository(inj.DB)
	accessTokenRepository := auth.NewUserAccessTokenRepository(inj.DB)
	refreshTokenRepository := auth.NewUserRefreshTokenRepository(inj.DB)

	userData, err := usersRepository.GetUserByEmail(requestData.Email)
	if err != nil {
		common.SendJSONResponse(w, http.StatusBadRequest, constants.ERROR_DATABASE_CALL_GET, nil, constants.RESPONSE_AUTH_LOGIN_ERROR)
		return
	}

	if userData == nil {
		common.SendJSONResponse(w, http.StatusBadRequest, constants.ERROR_DATABASE_NOTFOUND, nil, constants.RESPONSE_AUTH_WRONG_AUTH_ERROR)
		return
	}

	passwordValid := common.ComparePassword(userData.Password, requestData.Password)
	if !passwordValid {
		common.SendJSONResponse(w, http.StatusBadRequest, constants.ERROR_AUTH_WRONG_AUTHENTICATION, nil, constants.RESPONSE_AUTH_WRONG_AUTH_ERROR)
		return
	}

	userToken, err := common.GenerateUserToken(userData.Id)
	if err != nil {
		fmt.Println(err)
		common.SendJSONResponse(w, http.StatusBadRequest, constants.ERROR_THRD_JWT_GENERATE_TOKEN, nil, constants.RESPONSE_THIRD_PARTY_JWT_GENERATE_TOKEN_ERROR)
		return
	}

	//STORE DATA
	accessTokenData, err := accessTokenRepository.InsertUserAccessToken(userData.Id, userToken.AccessToken, userToken.ExpiredAccessToken)
	if err != nil {
		common.SendJSONResponse(w, http.StatusBadRequest, constants.ERROR_DATABASE_CALL_INSERT, nil, constants.RESPONSE_THIRD_PARTY_JWT_GENERATE_TOKEN_ERROR)
		return
	}

	_, err = refreshTokenRepository.InsertUserRefreshToken(userData.Id, userToken.RefreshToken, userToken.ExpiredRefreshToken, accessTokenData.Id)
	if err != nil {
		common.SendJSONResponse(w, http.StatusBadRequest, constants.ERROR_DATABASE_CALL_INSERT, nil, constants.RESPONSE_THIRD_PARTY_JWT_GENERATE_TOKEN_ERROR)
		return
	}

	responseData := ResponseValidateData{
		Message: "Success Login",
	}

	common.SendJSONResponse(w, http.StatusOK, constants.NO_ERROR, responseData, constants.RESPONSE_AUTH_VALIDATE_SUCCESS)
}

func (inj *AppInjection) SignOut(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	tokenString, _ := ctx.Value("token").(string)

	userAccessTokenRepository := auth.NewUserAccessTokenRepository(inj.DB)
	userRefreshTokenRepository := auth.NewUserRefreshTokenRepository(inj.DB)

	dataAccessToken, err := userAccessTokenRepository.GetUserAccessTokenByToken(tokenString)
	if err != nil && err != sql.ErrNoRows {
		common.SendJSONResponse(w, http.StatusBadRequest, constants.ERROR_DATABASE_CALL_GET, nil, constants.RESPONSE_AUTH_LOGOUT_ERROR)
		return
	}

	if dataAccessToken == nil {
		common.SendJSONResponse(w, http.StatusOK, constants.ERROR_DATABASE_NOTFOUND, nil, constants.RESPONSE_AUTH_LOGOUT_SUCCESS)
		return
	}

	dataRefreshToken, err := userRefreshTokenRepository.GetUserRefreshTokenByUserAccessTokenId(dataAccessToken.Id)
	if err != nil && err != sql.ErrNoRows {
		common.SendJSONResponse(w, http.StatusBadRequest, constants.ERROR_DATABASE_CALL_GET, nil, constants.RESPONSE_AUTH_LOGOUT_ERROR)
		return
	}

	if dataAccessToken != nil {
		userRefreshTokenRepository.DeleteUserRefreshTokenByToken(dataRefreshToken.Token)
	}

	if dataRefreshToken != nil {
		userAccessTokenRepository.DeleteUserAccessTokenByToken(dataAccessToken.Token)
	}

	common.SendJSONResponse(w, http.StatusOK, constants.NO_ERROR, nil, constants.RESPONSE_AUTH_LOGOUT_SUCCESS)
}

type (
	RequestRequestToken struct {
		AccessToken  string `json:"accessToken"`
		RefreshToken string `json:"refreshToken"`
	}
	ResponseRequestToken struct {
		AccessToken  string `json:"accessToken"`
		RefreshToken string `json:"refreshToken"`
	}
)

func (inj *AppInjection) RequestToken(w http.ResponseWriter, r *http.Request) {
	var requestData RequestRequestToken

	err := json.NewDecoder(r.Body).Decode(&requestData)
	if err != nil {
		common.SendJSONResponse(w, http.StatusBadRequest, constants.ERROR_FAILED_DECODE_PAYLOOAD, nil, constants.RESPONSE_DECODE_PAYLOAD_ERROR)
		return
	}

	userAccessTokenRepository := auth.NewUserAccessTokenRepository(inj.DB)
	userRefreshTokenRepository := auth.NewUserRefreshTokenRepository(inj.DB)

	accessTokenData, err := userAccessTokenRepository.GetUserAccessTokenByToken(requestData.AccessToken)

	if err != nil && err != sql.ErrNoRows {
		common.SendJSONResponse(w, http.StatusBadRequest, constants.ERROR_DATABASE_CALL_GET, nil, constants.RESPONSE_AUTH_FAILED_REQUEST_TOKEN_ERROR)
		return
	}

	if accessTokenData == nil {
		common.SendJSONResponse(w, http.StatusBadRequest, constants.ERROR_DATABASE_NOTFOUND, nil, constants.RESPONSE_AUTH_INVALID_ACCESS_TOKEN_ERROR)
		return
	}

	refreshTokenData, err := userRefreshTokenRepository.GetUserRefreshTokenByToken(requestData.RefreshToken)

	if err != nil && err != sql.ErrNoRows {

		common.SendJSONResponse(w, http.StatusBadRequest, constants.ERROR_DATABASE_CALL_GET, nil, constants.RESPONSE_AUTH_FAILED_REQUEST_TOKEN_ERROR)
		return
	}

	if refreshTokenData == nil {
		common.SendJSONResponse(w, http.StatusBadRequest, constants.ERROR_DATABASE_NOTFOUND, nil, constants.RESPONSE_AUTH_INVALID_REFRESH_TOKEN_ERROR)
		return
	}

	if refreshTokenData.ExpiredAt.Before(time.Now()) {
		common.SendJSONResponse(w, http.StatusBadRequest, constants.ERROR_AUTH_TOKEN_EXPIRED, nil, constants.RESPONSE_AUTH_REFRESH_TOKEN_EXPIRED_ERROR)
		return
	}

	err = userRefreshTokenRepository.DeleteUserRefreshTokenByToken(requestData.RefreshToken)
	if err != nil && err != sql.ErrNoRows {
		common.SendJSONResponse(w, http.StatusBadRequest, constants.ERROR_DATABASE_CALL_DELETE, nil, constants.RESPONSE_AUTH_FAILED_REQUEST_TOKEN_ERROR)
		return
	}

	err = userAccessTokenRepository.DeleteUserAccessTokenByToken(requestData.AccessToken)
	if err != nil && err != sql.ErrNoRows {
		common.SendJSONResponse(w, http.StatusBadRequest, constants.ERROR_DATABASE_CALL_DELETE, nil, constants.RESPONSE_AUTH_FAILED_REQUEST_TOKEN_ERROR)
		return
	}

	userToken, err := common.GenerateUserToken(accessTokenData.UserId)
	if err != nil {
		common.SendJSONResponse(w, http.StatusBadRequest, constants.ERROR_THRD_JWT_GENERATE_TOKEN, nil, constants.RESPONSE_THIRD_PARTY_JWT_GENERATE_TOKEN_ERROR)
		return
	}

	newUserAccessToken, err := userAccessTokenRepository.InsertUserAccessToken(accessTokenData.UserId, userToken.AccessToken, userToken.ExpiredAccessToken)
	if err != nil {
		common.SendJSONResponse(w, http.StatusBadRequest, constants.ERROR_DATABASE_CALL_INSERT, nil, constants.RESPONSE_THIRD_PARTY_JWT_GENERATE_TOKEN_ERROR)
		return
	}
	userRefreshTokenRepository.InsertUserRefreshToken(refreshTokenData.UserId, userToken.RefreshToken, userToken.ExpiredRefreshToken, newUserAccessToken.Id)

	responseData := &ResponseRequestToken{
		AccessToken:  userToken.AccessToken,
		RefreshToken: userToken.RefreshToken,
	}

	common.SendJSONResponse(w, http.StatusOK, constants.NO_ERROR, responseData, constants.RESPONSE_AUTH_REQUEST_TOKEN_SUCCESS)
}
