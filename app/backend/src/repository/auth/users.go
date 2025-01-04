package auth

import (
	"backend/src/lib/common"
	"database/sql"
	"fmt"
	"time"

	"github.com/jmoiron/sqlx"
)

type UsersRepository struct {
	DB *sqlx.DB
}

type User struct {
	Id        int       `json:"id"`
	Email     string    `json:"email"`
	Name      string    `json:"name"`
	CreatedAt time.Time `json:"created_at"`
	CreatedBy string    `json:"created_by"`
}

func NewUsersRepository(db *sqlx.DB) *UsersRepository {
	return &UsersRepository{DB: db}
}

func (r *UsersRepository) InsertUser(email string, password string, name string) (*User, error) {

	hashPassword, errHashPassword := common.HashPassword(password)
	if errHashPassword != nil {
		return nil, fmt.Errorf("failed to Hash password: %w", errHashPassword)
	}

	user := &User{
		Email:     email,
		Name:      name,
		CreatedAt: time.Now(),
		CreatedBy: "NOTEBUK_BE",
	}
	tx, err := r.DB.Begin()
	if err != nil {
		return nil, fmt.Errorf("failed to prepare query: %w", err)
	}

	err = tx.QueryRow(`
					INSERT INTO auth.users (email, name,password, created_at, created_by) 
					VALUES ($1,$2,$3,$4,$5) RETURNING id`,
		user.Email, user.Name, hashPassword, user.CreatedAt, user.CreatedBy,
	).Scan(&user.Id)

	if err != nil {
		return nil, fmt.Errorf("failed to prepare query: %w", err)
	}

	err = tx.Commit()
	if err != nil {
		return nil, fmt.Errorf("failed to prepare query: %w", err)
	}

	defer func() {
		p := recover()
		if p != nil {
			_ = tx.Rollback()
		} else if err != nil {
			_ = tx.Rollback()
		}
	}()

	return user, nil
}

func (r *UsersRepository) GetUserByEmail(email string) (*User, error) {
	var user User

	err := r.DB.QueryRow(
		"SELECT id, email, password, name FROM auth.users WHERE email = $1 LIMIT 1",
		email,
	).Scan(&user)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, fmt.Errorf("failed to prepare query: %w", err)
	}

	return &user, nil
}
