package main

import (
	"backend/src/lib/db"
	"backend/src/route"
	"fmt"
	"log"
	"net/http"

	"github.com/joho/godotenv"
)

func main() {

	errEnv := godotenv.Load()
	if errEnv != nil {
		log.Fatalf("ERROR LOADING ENV")
	}

	db := db.InitDB()
	route := route.InitRoute(db)

	const PORT = ":8000"
	srv := &http.Server{
		Addr:    PORT,
		Handler: route,
	}
	//ROUTE
	srv.ListenAndServe()
	fmt.Printf("STARTING PORT %s", PORT)
}
