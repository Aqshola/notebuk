package handler

import "github.com/jmoiron/sqlx"

type AppInjection struct {
	DB *sqlx.DB
}
