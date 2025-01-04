package controller

import (
	"backend/src/lib/common"
	"backend/src/lib/mail"
	"backend/src/repository/auth"
	"path/filepath"

	"encoding/json"
	"fmt"
	"net/http"
)

type RequestSignIn struct {
	Email    string `json:"email"`
	Password string `json:"password"`
	Name     string `json:"name"`
}

type ResponseSignInData struct {
	UserId int    `json:"userId"`
	Email  string `json:"email"`
	Name   string `json:"name"`
}

func (inj *AppInjection) SignUp(w http.ResponseWriter, r *http.Request) {
	var requestData RequestSignIn
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

	responseData := &ResponseSignInData{
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

func (inj *AppInjection) Validate(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "VALIDATE")
}

func (inj *AppInjection) SignIn(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "SIGN IN")
}
