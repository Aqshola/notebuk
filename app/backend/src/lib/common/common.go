package common

import (
	"bytes"
	"crypto/rand"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"text/template"

	"golang.org/x/crypto/bcrypt"
)

func HashPassword(password string) (string, error) {
	hashPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)

	if err != nil {
		if err != nil {
			return "", fmt.Errorf("failed to to hash: %w", err)
		}
	}

	return string(hashPassword), nil

}

func SendJSONResponse(w http.ResponseWriter, statusCode int, data any, message string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)

	response := JSONResponse{
		Data:    data,
		Message: message,
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
