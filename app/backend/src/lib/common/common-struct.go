package common

type JSONResponse struct {
	Data    any    `json:"data,omitempty"`
	Message string `json:"message"`
}
