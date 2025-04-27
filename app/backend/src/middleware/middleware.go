package middleware

import (
	"backend/src/constants"
	"backend/src/lib/common"
	jwtgenerator "backend/src/lib/jwt-generator"
	"context"
	"fmt"
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

		// Handle preflight request
		// if r.Method == "OPTIONS" {
		// 	w.WriteHeader(http.StatusOK)
		// 	return
		// }
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
			common.SendJSONResponse(w, http.StatusUnauthorized, constants.ERROR_HEADER_AUTH_NO_PROVIDED, nil, constants.RESPONSE_HEADER_AUTH_NO_PROVIDED)
			return
		}

		bearerToken := strings.Split(authHeader, " ")
		if len(bearerToken) != 2 {
			common.SendJSONResponse(w, http.StatusUnauthorized, constants.ERROR_HEADER_AUTH_NO_PROVIDED, nil, constants.RESPONSE_AUTH_INVALID_ACCESS_TOKEN_ERROR)
			return
		}

		token := bearerToken[1]

		claimToken, err := jwtgenerator.ParsedJWTWithClaim(token)

		if err != nil {
			common.SendJSONResponse(w, http.StatusInternalServerError, constants.ERROR_THRD_JWT_PARSED_TOKEN, nil, constants.RESPONSE_THIRD_PARTY_JWT_PARSED_TOKEN_ERROR)
			return
		}

		expiredToken, ok := claimToken["expiredAt"]

		if !ok {
			common.SendJSONResponse(w, http.StatusInternalServerError, constants.ERROR_THRD_JWT_PARSED_TOKEN, nil, constants.RESPONSE_THIRD_PARTY_JWT_PARSED_TOKEN_ERROR)
			return
		}

		//parsing expired token
		expiredString, ok := expiredToken.(string)

		if !ok {
			common.SendJSONResponse(w, http.StatusInternalServerError, constants.ERROR_INTERNAL, nil, constants.RESPONSE_THIRD_PARTY_JWT_PARSED_TOKEN_ERROR)
			return
		}

		expiryTime, err := time.Parse(time.RFC3339Nano, expiredString)
		if err != nil {
			common.SendJSONResponse(w, http.StatusInternalServerError, constants.ERROR_INTERNAL, nil, constants.RESPONSE_THIRD_PARTY_JWT_PARSED_TOKEN_ERROR)
			return
		}

		if time.Now().After(expiryTime) {
			common.SendJSONResponse(w, http.StatusUnauthorized, constants.ERROR_TOKEN_EXPIRED, nil, constants.RESPONSE_TOKEN_EXPIRED)
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
