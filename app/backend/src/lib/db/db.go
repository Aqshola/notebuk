package db

import (
	"fmt"
	"log"
	"os"

	"github.com/jmoiron/sqlx"

	_ "github.com/lib/pq" // PostgreSQL driver
)

func InitDB() *sqlx.DB {
	user := os.Getenv("DB_USER")
	pass := os.Getenv("DB_PASS")
	dbName := os.Getenv("DB_NAME")
	connStr := fmt.Sprintf("user=%s password=%s dbname=%s host=localhost sslmode=disable", user, pass, dbName)

	db, err := sqlx.Connect("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}

	err = db.Ping()

	if err != nil {
		log.Fatal(err)
	}

	log.Println("DB CONNECTED")
	return db
}
