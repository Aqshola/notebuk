package handler

import (
	"fmt"
	"net/http"
)

func (inj *AppInjection) SignIn(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "SIGN IN")
}

func (inj *AppInjection) Validate(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "VALIDATE")
}

func (inj *AppInjection) SignUp(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "SIGN UP")
}
