package auth

import (
	"backend/src/lib/common"
	"fmt"
	"time"

	"github.com/jmoiron/sqlx"
)

type UserCodeVerifRepository struct {
	DB *sqlx.DB
}

func NewUserCodeVerifRepository(db *sqlx.DB) *UserCodeVerifRepository {
	return &UserCodeVerifRepository{DB: db}
}

type UserCodeVerif struct {
	Id        int       `json:"id"`
	UserId    int       `json:"user_id"`
	Code      string    `json:"code"`
	ExpiredAt time.Time `json:"expired_at"`
	CreatedAt time.Time `json:"created_at"`
	CreatedBy string    `json:"created_by"`
}

func (r *UserCodeVerifRepository) InsertCodeVerification(userId int) (*UserCodeVerif, error) {

	otpCode, _ := common.GenerateOTP(6)
	userCodeVerif := &UserCodeVerif{
		UserId:    userId,
		ExpiredAt: time.Now().Add(5 * time.Minute),
		Code:      otpCode,
		CreatedAt: time.Now(),
		CreatedBy: "NOTEBUK_BE",
	}

	tx, err := r.DB.Begin()
	if err != nil {
		return nil, fmt.Errorf("failed to prepare query: %w", err)
	}

	err = tx.QueryRow(`
					INSERT INTO auth.user_code_verif (user_id, code,expired_at, created_at, created_by) 
					VALUES ($1,$2,$3,$4, $5) RETURNING id`,
		userCodeVerif.UserId, userCodeVerif.Code, userCodeVerif.ExpiredAt, userCodeVerif.CreatedAt, userCodeVerif.CreatedBy,
	).Scan(&userCodeVerif.Id)

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

	return userCodeVerif, nil

}

func (r *UserCodeVerifRepository) GetCodeVerificationByUserId(userId int) (*UserCodeVerif, error) {
	var userCodeVerif UserCodeVerif

	err := r.DB.QueryRow(
		`SELECT id, user_id, code, expired_at 
		FROM auth.user_code_verif WHERE user_id = $1 LIMIT 1`, userId,
	).Scan(&userCodeVerif.Id, &userCodeVerif.UserId, &userCodeVerif.Code, &userCodeVerif.ExpiredAt)

	if err != nil {
		return nil, fmt.Errorf("failed to prepare query: %w", err)
	}

	return &userCodeVerif, nil
}

func (r *UserCodeVerifRepository) DeleteCodeVerificationById(id int) error {
	tx, err := r.DB.Begin()
	if err != nil {
		return fmt.Errorf("failed to prepare query: %w", err)
	}

	_, err = tx.Exec(`DELETE FROM auth.user_code_verif WHERE id = $1`, id)

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
