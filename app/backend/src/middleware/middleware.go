package middleware

import (
	"backend/src/lib/common"
	jwtgenerator "backend/src/lib/jwt-generator"
	"context"
	"log"
	"net/http"
	"strings"
	"time"
)

// CORS adds CORS headers
func CORS(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next(w, r)
	}
}

// Recovery middleware to handle panics
func Recovery(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		defer func() {
			if err := recover(); err != nil {
				log.Printf("panic: %v", err)
				http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			}
		}()
		next(w, r)
	}
}

func PrivateRoute(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")

		if authHeader == "" {
			common.SendJSONResponse(w, http.StatusUnauthorized, nil, "NO TOKEN PROVIDED")
			return
		}

		bearerToken := strings.Split(authHeader, " ")
		if len(bearerToken) != 2 {
			common.SendJSONResponse(w, http.StatusUnauthorized, nil, "INVALID TOKEN")
			return
		}

		token := bearerToken[1]

		claimToken, err := jwtgenerator.ParsedJWTWithClaim(token)

		if err != nil {
			common.SendJSONResponse(w, http.StatusInternalServerError, nil, "FAILED PARSED TOKEN")
			return
		}

		expiredToken, ok := claimToken["expiredAt"]

		if !ok {
			common.SendJSONResponse(w, http.StatusInternalServerError, nil, "FAILED PARSED TOKEN")
			return
		}

		//parsing expired token
		expiredString, ok := expiredToken.(string)

		if !ok {
			common.SendJSONResponse(w, http.StatusInternalServerError, nil, "FAILED PARSED TOKEN")
			return
		}

		expiryTime, err := time.Parse(time.RFC3339Nano, expiredString)
		if err != nil {
			common.SendJSONResponse(w, http.StatusInternalServerError, nil, "FAILED PARSED TOKEN")
			return
		}

		if time.Now().After(expiryTime) {
			common.SendJSONResponse(w, http.StatusInternalServerError, nil, "TOKEN EXPIRED")
			return
		}

		userId := int(claimToken["userId"].(float64))
		ctx := r.Context()

		// Chain the context values
		ctx = context.WithValue(ctx, "token", token)
		ctx = context.WithValue(ctx, "userId", userId)

		r = r.WithContext(ctx)
		next(w, r)
	}
}
