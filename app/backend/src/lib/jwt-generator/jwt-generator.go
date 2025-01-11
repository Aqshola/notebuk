package jwtgenerator

import (
	"fmt"
	"os"

	"github.com/golang-jwt/jwt/v5"
)

func GenerateJWTWithClaim(claim map[string]interface{}) (string, error) {

	key := []byte(os.Getenv("JWT_KEY"))
	jwtClaims := jwt.MapClaims{}

	for k, v := range claim {
		jwtClaims[k] = v
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwtClaims)
	tokenString, err := token.SignedString(key)
	if err != nil {
		return "", fmt.Errorf("failed to generate token: %w", err)
	}

	return tokenString, nil
}

func GenerateJWTWithoutClaim() (string, error) {
	key := []byte(os.Getenv("JWT_KEY"))
	token := jwt.New(jwt.SigningMethodHS256)
	tokenString, err := token.SignedString(key)
	if err != nil {
		return "", fmt.Errorf("failed to generate token: %w", err)
	}

	return tokenString, nil
}

func ParsedJWTWithClaim(token string) (jwt.MapClaims, error) {
	claims := jwt.MapClaims{}
	key := []byte(os.Getenv("JWT_KEY"))

	parsedToken, err := jwt.ParseWithClaims(token, claims, func(token *jwt.Token) (interface{}, error) {
		// Replace "your-secret-key" with your actual secret key
		return []byte(key), nil
	})

	if err != nil {
		return nil, fmt.Errorf("failed to parse token: %w", err)
	}

	if !parsedToken.Valid {
		return nil, fmt.Errorf("invalid token")
	}

	return claims, nil
}
