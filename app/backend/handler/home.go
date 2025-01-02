package handler

import (
	"fmt"
	"net/http"
)

func (inj *AppInjection) HomeHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "HELLO WORLD")
}
