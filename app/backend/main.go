package main

import (
	"backend/route"
	"fmt"
	"net/http"
)

func main() {

	route := route.InitRoute()

	const PORT = ":8000"
	srv := &http.Server{
		Addr:    PORT,
		Handler: route,
	}
	//ROUTE
	fmt.Printf("STARTING PORT %s", PORT)
	srv.ListenAndServe()
}
