package auth

import (
	"fmt"
	"time"

	"github.com/jmoiron/sqlx"
)

type UserRefreshTokenRepository struct {
	DB *sqlx.DB
}

func NewUserRefreshTokenRepository(db *sqlx.DB) *UserRefreshTokenRepository {
	return &UserRefreshTokenRepository{DB: db}
}

type UserRefreshToken struct {
	Id                int       `json:"id"`
	UserId            int       `json:"user_id"`
	Token             string    `json:"token"`
	ExpiredAt         time.Time `json:"expired_at"`
	UserAccessTokenId int       `json:"user_access_token_id"`
	CreatedAt         time.Time `json:"created_at"`
	CreatedBy         string    `json:"created_by"`
}

func (r *UserRefreshTokenRepository) InsertUserRefreshToken(userId int, token string, expiredAt time.Time, userAccessTokenId int) (*UserRefreshToken, error) {
	tx, err := r.DB.Begin()
	if err != nil {
		return nil, fmt.Errorf("failed to prepare query: %w", err)
	}

	userRefreshToken := &UserRefreshToken{
		UserId:            userId,
		Token:             token,
		ExpiredAt:         expiredAt,
		UserAccessTokenId: userAccessTokenId,
		CreatedAt:         time.Now(),
		CreatedBy:         "NOTEBUK_BE",
	}

	err = tx.QueryRow(`
					INSERT INTO auth.user_refresh_token (user_id, token, expired_at, user_access_token_id, created_at, created_by) 
					VALUES ($1,$2,$3,$4, $5,$6) RETURNING id`,
		userRefreshToken.UserId, userRefreshToken.Token, userRefreshToken.ExpiredAt, userRefreshToken.UserAccessTokenId, userRefreshToken.CreatedAt, userRefreshToken.CreatedBy,
	).Scan(&userRefreshToken.Id)

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

	return userRefreshToken, nil
}

func (r *UserRefreshTokenRepository) GetUserRefreshTokenByToken(token string) (*UserRefreshToken, error) {
	var userRefreshToken UserRefreshToken

	err := r.DB.QueryRow(
		`SELECT id, token, user_id, expired_at, user_access_token_id FROM auth.user_refresh_token
		WHERE token = $1`, token,
	).Scan(&userRefreshToken)

	if err != nil {
		return nil, fmt.Errorf("failed to prepare query: %w", err)
	}

	return &userRefreshToken, nil
}
