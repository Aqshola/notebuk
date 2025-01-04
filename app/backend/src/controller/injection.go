package controller

import "github.com/jmoiron/sqlx"

type AppInjection struct {
	DB *sqlx.DB
}
