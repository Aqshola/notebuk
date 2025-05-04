package common

import (
	jwtgenerator "backend/src/lib/jwt-generator"
	"bytes"
	"crypto/rand"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"text/template"
	"time"

	"golang.org/x/crypto/bcrypt"
)

func HashPassword(password string) (string, error) {
	hashPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)

	if err != nil {
		return "", fmt.Errorf("failed to to hash: %w", err)

	}

	return string(hashPassword), nil

}

func ComparePassword(hashPassword string, password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hashPassword), []byte(password))
	return err == nil
}

func SendJSONResponse(w http.ResponseWriter, statusCode int, responseCode string, data any, message string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)

	response := JSONResponse{
		Data:         data,
		Message:      message,
		ResponseCode: responseCode,
	}

	json.NewEncoder(w).Encode(response)

}

func GenerateOTP(length int) (string, error) {
	const digits = "0123456789"
	b := make([]byte, length)

	// Read random bytes
	_, err := rand.Read(b)
	if err != nil {
		return "", err
	}

	// Convert to digits
	otp := make([]byte, length)
	for i := 0; i < length; i++ {
		otp[i] = digits[b[i]%byte(len(digits))]
	}

	return string(otp), nil
}

func TemplateHTMLWithData(data any, pathTemplate string) string {

	tmpl, err := template.ParseFiles(pathTemplate)
	if err != nil {
		log.Printf("Error parsing template file: %v", err)
		return ""
	}
	var buf bytes.Buffer
	if err := tmpl.Execute(&buf, data); err != nil {
		log.Printf("Error executing template: %v", err)
		return ""
	}

	return buf.String()
}

type GenerateUserTokenValue struct {
	AccessToken        string
	ExpiredAccessToken time.Time

	RefreshToken        string
	ExpiredRefreshToken time.Time
}

func GenerateUserToken(userId int) (*GenerateUserTokenValue, error) {
	expiredAccess := time.Now().Add(1 * time.Hour)
	jwtClaimContent := map[string]interface{}{
		"userId":    userId,
		"expiredAt": expiredAccess,
		"issuedAt":  time.Now(),
	}

	accessToken, err := jwtgenerator.GenerateJWTWithClaim(jwtClaimContent)
	if err != nil {
		return nil, fmt.Errorf("FAILED GENERATE ACCESS TOKEN", err)
	}

	expiredRefresh := time.Now().Add(7 * 24 * time.Hour)
	refreshClaimContent := map[string]interface{}{
		"issuedAt":  time.Now(),
		"expiredAt": expiredRefresh,
	}
	refreshToken, err := jwtgenerator.GenerateJWTWithClaim(refreshClaimContent)
	if err != nil {
		return nil, fmt.Errorf("FAILED GENERATE REFRESH TOKEN", err)
	}

	userToken := &GenerateUserTokenValue{
		AccessToken:        accessToken,
		ExpiredAccessToken: expiredAccess,

		RefreshToken:        refreshToken,
		ExpiredRefreshToken: time.Now().Add(7 * 24 * time.Hour),
	}

	return userToken, nil

}

func SetAuthCookie(w http.ResponseWriter, accessToken string, refreshToken string) {
	accessTokenCookie := http.Cookie{Name: "accessToken", Value: accessToken, HttpOnly: true, SameSite: http.SameSiteNoneMode, Secure: true}
	refreshTokenCookie := http.Cookie{Name: "refreshToken", Value: refreshToken, HttpOnly: true, SameSite: http.SameSiteNoneMode, Secure: true}
	http.SetCookie(w, &accessTokenCookie)
	http.SetCookie(w, &refreshTokenCookie)
}
