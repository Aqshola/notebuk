package controller

import (
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

type RequestSignUp struct {
	Email    string `json:"email"`
	Password string `json:"password"`
	Name     string `json:"name"`
}

type ResponseSignUpData struct {
	UserId int    `json:"userId"`
	Email  string `json:"email"`
	Name   string `json:"name"`
}

func (inj *AppInjection) SignUp(w http.ResponseWriter, r *http.Request) {
	var requestData RequestSignUp
	err := json.NewDecoder(r.Body).Decode(&requestData)

	if err != nil {

		common.SendJSONResponse(w, http.StatusBadRequest, nil, "WRONG PAYLOAD")
		return
	}

	usersRepository := auth.NewUsersRepository(inj.DB)
	userCodeVerifRepository := auth.NewUserCodeVerifRepository(inj.DB)

	//check user
	userExist, err := usersRepository.GetUserByEmail(requestData.Email)
	if err != nil {
		common.SendJSONResponse(w, http.StatusBadRequest, nil, "FAILED VALIDATION USER")
		return
	}

	if userExist != nil {
		common.SendJSONResponse(w, http.StatusBadRequest, nil, "USER ALREADY EXIST")
		return
	}
	insertedUser, err := usersRepository.InsertUser(requestData.Email, requestData.Password, requestData.Name)
	if err != nil {
		errMsg := fmt.Sprintf("FAILED CREATED USER: %s", err.Error())
		common.SendJSONResponse(w, http.StatusInternalServerError, nil, errMsg)
		return
	}

	verificationData, err := userCodeVerifRepository.InsertCodeVerification(insertedUser.Id)
	if err != nil {
		errMsg := fmt.Sprintf("FAILED CREATED VERIFICATION CODE: %s", err.Error())
		common.SendJSONResponse(w, http.StatusInternalServerError, nil, errMsg)
		return
	}

	responseData := &ResponseSignUpData{
		UserId: insertedUser.Id,
		Email:  insertedUser.Email,
		Name:   insertedUser.Name,
	}

	emailData := map[string]interface{}{
		"Username": insertedUser.Name,
		"Code":     verificationData.Code,
	}

	templatePath, _ := filepath.Abs("src/lib/mail/template/verif-mail.html")
	err = mail.SendEmailHTML(insertedUser.Email, "Notebuk Verification Mail", emailData, templatePath)
	if err != nil {
		errMsg := fmt.Sprintf("FAILED SEND EMAIL: %s", err.Error())
		common.SendJSONResponse(w, http.StatusInternalServerError, nil, errMsg)
		return
	}
	common.SendJSONResponse(w, http.StatusOK, responseData, "SUCCESS CREATE USER")
}

type RequestValidate struct {
	Email string `json:"email"`
	Code  string `json:"code"`
}

type ResponseValidateData struct {
	AccessToken  string `json:"accessToken"`
	RefreshToken string `json:"refreshToken"`
}

func (inj *AppInjection) Validate(w http.ResponseWriter, r *http.Request) {

	var requestData RequestValidate

	err := json.NewDecoder(r.Body).Decode(&requestData)
	if err != nil {
		common.SendJSONResponse(w, http.StatusBadRequest, nil, "FAILED DECODE WRONG PAYLOAD")
		return
	}

	userRepository := auth.NewUsersRepository(inj.DB)
	codeVerifRepository := auth.NewUserCodeVerifRepository(inj.DB)
	accessTokenRepository := auth.NewUserAccessTokenRepository(inj.DB)
	refreshTokenRepository := auth.NewUserRefreshTokenRepository(inj.DB)

	userData, err := userRepository.GetUserByEmail(requestData.Email)
	if err != nil {
		common.SendJSONResponse(w, http.StatusBadRequest, nil, "FAILED VERIFY")
		return
	}

	if userData == nil {
		common.SendJSONResponse(w, http.StatusBadRequest, nil, "USER NOT FOUND")
		return
	}

	verifData, err := codeVerifRepository.GetCodeVerificationByUserId(userData.Id)
	if err != nil {
		common.SendJSONResponse(w, http.StatusBadRequest, nil, "FAILED VERIFY CODE")
		return
	}

	if verifData == nil {
		common.SendJSONResponse(w, http.StatusBadRequest, nil, "VERIFICATION NOT FOUND")
		return
	}

	if verifData.Code != requestData.Code {
		common.SendJSONResponse(w, http.StatusBadRequest, nil, "CODE INVALID")
		return
	}

	if verifData.Code == requestData.Code && verifData.ExpiredAt.Before(time.Now()) {
		common.SendJSONResponse(w, http.StatusBadRequest, nil, "CODE INVALID")
		return
	}

	userToken, err := common.GenerateUserToken(userData.Id, userData.Name)
	if err != nil {
		fmt.Println(err)
		common.SendJSONResponse(w, http.StatusBadRequest, nil, "FAILED GENERATE TOKEN")
		return
	}

	//STORE DATA
	accessTokenData, err := accessTokenRepository.InsertUserAccessToken(userData.Id, userToken.AccessToken, userToken.ExpiredAccessToken)
	if err != nil {
		fmt.Println(err)
		common.SendJSONResponse(w, http.StatusBadRequest, nil, "FAILED GENERATE TOKEN")
		return
	}

	_, err = refreshTokenRepository.InsertUserRefreshToken(userData.Id, userToken.RefreshToken, userToken.ExpiredRefreshToken, accessTokenData.Id)
	if err != nil {
		fmt.Println(err)
		common.SendJSONResponse(w, http.StatusBadRequest, nil, "FAILED GENERATE TOKEN")
		return
	}

	err = codeVerifRepository.DeleteCodeVerificationById(verifData.Id)
	fmt.Println(verifData.Id)
	if err != nil {
		common.SendJSONResponse(w, http.StatusBadRequest, nil, "FAILED VALIDATE")
		return
	}

	responseData := ResponseValidateData{
		AccessToken:  userToken.AccessToken,
		RefreshToken: userToken.RefreshToken,
	}

	common.SendJSONResponse(w, http.StatusOK, responseData, "SUCCESS VALIDATION")
}

type RequestRequestCode struct {
	Email string `json:"email"`
}

func (inj *AppInjection) RequestCode(w http.ResponseWriter, r *http.Request) {
	var requestData RequestRequestCode

	err := json.NewDecoder(r.Body).Decode(&requestData)
	if err != nil {
		common.SendJSONResponse(w, http.StatusBadRequest, nil, "FAILED DECODE WRONG PAYLOAD")
		return
	}

	userRepository := auth.NewUsersRepository(inj.DB)
	codeVerifRepository := auth.NewUserCodeVerifRepository(inj.DB)

	userData, err := userRepository.GetUserByEmail(requestData.Email)
	if err != nil {
		common.SendJSONResponse(w, http.StatusBadRequest, nil, "FAILED TO REQUEST CODE FOR USER")
		return
	}

	if userData == nil {
		common.SendJSONResponse(w, http.StatusBadRequest, nil, "USER NOT FOUND")
		return
	}

	verifData, err := codeVerifRepository.GetCodeVerificationByUserId(userData.Id)
	if err != nil {
		common.SendJSONResponse(w, http.StatusBadRequest, nil, "FAILED VERIFY")
		return
	}

	if verifData != nil {
		err := codeVerifRepository.DeleteCodeVerificationById(verifData.Id)
		if err != nil {
			common.SendJSONResponse(w, http.StatusBadRequest, nil, "FAILED GENERATE CODE")
			return
		}
	}

	verificationData, err := codeVerifRepository.InsertCodeVerification(userData.Id)
	if err != nil {
		errMsg := fmt.Sprintf("FAILED CREATED VERIFICATION CODE: %s", err.Error())
		common.SendJSONResponse(w, http.StatusInternalServerError, nil, errMsg)
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
		common.SendJSONResponse(w, http.StatusInternalServerError, nil, errMsg)
		return
	}
	common.SendJSONResponse(w, http.StatusOK, nil, "SUCCESS REQUEST CODE")

}

type RequestSignIn struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func (inj *AppInjection) SignIn(w http.ResponseWriter, r *http.Request) {
	var requestData RequestSignIn

	err := json.NewDecoder(r.Body).Decode(&requestData)
	if err != nil {
		common.SendJSONResponse(w, http.StatusBadRequest, nil, "FAILED DECODE WRONG PAYLOAD")
		return
	}

	usersRepository := auth.NewUsersRepository(inj.DB)
	accessTokenRepository := auth.NewUserAccessTokenRepository(inj.DB)
	refreshTokenRepository := auth.NewUserRefreshTokenRepository(inj.DB)

	userData, err := usersRepository.GetUserByEmail(requestData.Email)
	if err != nil {
		common.SendJSONResponse(w, http.StatusBadRequest, nil, "FAILED LOGIN")
		return
	}

	if userData == nil {
		common.SendJSONResponse(w, http.StatusBadRequest, nil, "WRONG EMAIL OR PASSWORD")
		return
	}

	passwordValid := common.ComparePassword(userData.Password, requestData.Password)
	if !passwordValid {
		common.SendJSONResponse(w, http.StatusBadRequest, nil, "WRONG EMAIL OR PASSWORD")
		return
	}

	userToken, err := common.GenerateUserToken(userData.Id, userData.Name)
	if err != nil {
		fmt.Println(err)
		common.SendJSONResponse(w, http.StatusBadRequest, nil, "FAILED GENERATE TOKEN")
		return
	}

	//STORE DATA
	accessTokenData, err := accessTokenRepository.InsertUserAccessToken(userData.Id, userToken.AccessToken, userToken.ExpiredAccessToken)
	if err != nil {
		fmt.Println(err)
		common.SendJSONResponse(w, http.StatusBadRequest, nil, "FAILED GENERATE TOKEN")
		return
	}

	_, err = refreshTokenRepository.InsertUserRefreshToken(userData.Id, userToken.RefreshToken, userToken.ExpiredRefreshToken, accessTokenData.Id)
	if err != nil {
		fmt.Println(err)
		common.SendJSONResponse(w, http.StatusBadRequest, nil, "FAILED GENERATE TOKEN")
		return
	}

	responseData := ResponseValidateData{
		AccessToken:  userToken.AccessToken,
		RefreshToken: userToken.RefreshToken,
	}

	common.SendJSONResponse(w, http.StatusOK, responseData, "SUCCESS VALIDATION")
}

func (inj *AppInjection) SignOut(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	tokenString, _ := ctx.Value("token").(string)

	userAccessTokenRepository := auth.NewUserAccessTokenRepository(inj.DB)
	userRefreshTokenRepository := auth.NewUserRefreshTokenRepository(inj.DB)

	dataAccessToken, err := userAccessTokenRepository.GetUserAccessTokenByToken(tokenString)
	if err != nil && err != sql.ErrNoRows {
		common.SendJSONResponse(w, http.StatusBadRequest, nil, "FAILED SIGN OUT")
		return
	}

	dataRefreshToken, err := userRefreshTokenRepository.GetUserRefreshTokenByUserAccessTokenId(dataAccessToken.Id)
	if err != nil && err != sql.ErrNoRows {
		common.SendJSONResponse(w, http.StatusBadRequest, nil, "FAILED SIGN OUT")
		return
	}

	if dataAccessToken != nil {
		userRefreshTokenRepository.DeleteUserRefreshTokenByToken(dataRefreshToken.Token)
	}

	if dataRefreshToken != nil {
		userAccessTokenRepository.DeleteUserAccessTokenByToken(dataAccessToken.Token)
	}

	common.SendJSONResponse(w, http.StatusOK, nil, "LOGOUT SUCCESS")
}
