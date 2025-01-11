package auth

import (
	"database/sql"
	"fmt"
	"time"

	"github.com/jmoiron/sqlx"
)

type UserAccessTokenRepository struct {
	DB *sqlx.DB
}

func NewUserAccessTokenRepository(db *sqlx.DB) *UserAccessTokenRepository {
	return &UserAccessTokenRepository{DB: db}
}

type UserAccessToken struct {
	Id        int       `json:"id"`
	UserId    int       `json:"user_id"`
	Token     string    `json:"token"`
	ExpiredAt time.Time `json:"expired_at"`
	CreatedAt time.Time `json:"created_at"`
	CreatedBy string    `json:"created_by"`
}

func (r *UserAccessTokenRepository) InsertUserAccessToken(userId int, token string, expiredAt time.Time) (*UserAccessToken, error) {
	tx, err := r.DB.Begin()
	if err != nil {
		return nil, fmt.Errorf("failed to prepare query: %w", err)
	}

	userAccessToken := &UserAccessToken{
		UserId:    userId,
		Token:     token,
		ExpiredAt: expiredAt,
		CreatedAt: time.Now(),
		CreatedBy: "NOTEBUK_BE",
	}

	err = tx.QueryRow(`
					INSERT INTO auth.user_access_token (user_id, token,expired_at, created_at, created_by) 
					VALUES ($1,$2,$3,$4, $5) RETURNING id`,
		userAccessToken.UserId, userAccessToken.Token, userAccessToken.ExpiredAt, userAccessToken.CreatedAt, userAccessToken.CreatedBy,
	).Scan(&userAccessToken.Id)

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

	return userAccessToken, nil
}

func (r *UserAccessTokenRepository) GetUserAccessTokenByToken(token string) (*UserAccessToken, error) {
	var userAccessToken UserAccessToken

	err := r.DB.QueryRow(
		`SELECT id, token, user_id, expired_at FROM auth.user_access_token
		WHERE token = $1`, token,
	).Scan(&userAccessToken.Id, &userAccessToken.Token, &userAccessToken.UserId, &userAccessToken.ExpiredAt)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, err
		}
		return nil, fmt.Errorf("failed to prepare query: %w", err)
	}

	return &userAccessToken, nil
}

func (r *UserAccessTokenRepository) DeleteUserAccessTokenByToken(token string) error {
	tx, err := r.DB.Begin()
	if err != nil {
		return fmt.Errorf("failed to prepare query: %w", err)
	}

	_, err = tx.Exec(`DELETE FROM auth.user_access_token WHERE token = $1`, token)

	if err != nil {
		return fmt.Errorf("failed to prepare query: %w", err)
	}

	err = tx.Commit()
	if err != nil {
		return fmt.Errorf("failed to prepare query: %w", err)
	}
	defer func() {
		p := recover()
		if p != nil {
			_ = tx.Rollback()
		} else if err != nil {
			_ = tx.Rollback()
		}
	}()
	return nil
}
