package main

import (
	"backend/lib/db"
	"backend/route"
	"fmt"
	"net/http"
)

func main() {

	db := db.InitDB()
	route := route.InitRoute(db)

	const PORT = ":8000"
	srv := &http.Server{
		Addr:    PORT,
		Handler: route,
	}
	//ROUTE
	fmt.Printf("STARTING PORT %s", PORT)
	srv.ListenAndServe()
}
