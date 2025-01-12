package constants

// GLOBAL
const (
	RESPONSE_INSERT_DATA_SUCCESS = "SUCCESS INSERT DATA"
	RESPONSE_UPDATE_DATA_SUCCESS = "SUCCESS UPDATE DATA"
	RESPONSE_GET_DATA_SUCCESS    = "SUCCESS GET DATA"
	RESPONSE_DELETE_DATA_SUCCESS = "SUCCESS DELETE DATA"

	RESPONSE_DECODE_PAYLOAD_ERROR    = "FAILED DECODE PAYLOAD, WRONG PAYLOAD"
	RESPONSE_HEADER_AUTH_NO_PROVIDED = "NO TOKEN PROVIDED"
	RESPONSE_TOKEN_EXPIRED           = "TOKEN EXPIRED"
)

// AUTH
const (
	RESPONSE_AUTH_LOGIN_SUCCESS         = "SUCCESS SIGN IN"
	RESPONSE_AUTH_LOGOUT_SUCCESS        = "SUCCESS SIGN OUT"
	RESPONSE_AUTH_SIGNUP_SUCCESS        = "SUCCESS SIGN UP"
	RESPONSE_AUTH_VALIDATE_SUCCESS      = "SUCCESS VALIDATE"
	RESPONSE_AUTH_REQUEST_TOKEN_SUCCESS = "SUCCESS REQUEST TOKEN"

	RESPONSE_AUTH_LOGIN_ERROR  = "FAILED SIGN IN"
	RESPONSE_AUTH_LOGOUT_ERROR = "FAILD SIGN OUT"

	RESPONSE_AUTH_VALIDATION_ERROR  = "FAIL VALIDATE USER"
	RESPONSE_AUTH_USER_EXISTS_ERROR = "USER ALREADY SIGN UP"

	RESPONSE_AUTH_VERIFY_ERROR         = "FAIL VERIFY USER"
	RESPONSE_AUTH_USER_NOT_FOUND_ERROR = "USER NOT FOUND"

	RESPONSE_AUTH_VERIFY_CODE_ERROR = "FAIL VERIFY CODE"

	RESPONSE_AUTH_VERIFY_CODE_INVALID_ERROR = "CODE INVALID"

	RESPONSE_AUTH_FAILED_REQUEST_CODE_ERROR  = "FAILED REQUEST VERIFICATION CODE"
	RESPONSE_AUTH_FAILED_REQUEST_TOKEN_ERROR = "FAILED REQUEST VERIFICATION TOKEN"

	RESPONSE_AUTH_WRONG_AUTH_ERROR = "WRONG EMAIL OR PASSWORD"

	RESPONSE_AUTH_INVALID_ACCESS_TOKEN_ERROR  = "INVALID ACCESS TOKEN"
	RESPONSE_AUTH_INVALID_REFRESH_TOKEN_ERROR = "INVALID REFRESH TOKEN"

	RESPONSE_AUTH_ACCESS_TOKEN_EXPIRED_ERROR  = "ACCESS TOKEN EXPIRED"
	RESPONSE_AUTH_REFRESH_TOKEN_EXPIRED_ERROR = "REFRESH TOKEN EXPIRED"
)

// THIRD PARTY

const (
	RESPONSE_THIRD_PARTY_MAIL_SEND_ERROR          = "FAIL TO SEND EMAIL"
	RESPONSE_THIRD_PARTY_JWT_GENERATE_TOKEN_ERROR = "FAIL GENERATE TOKEN"
	RESPONSE_THIRD_PARTY_FAIL_GENERATE_CODE       = "FAIL GENERATE CODE"
	RESPONSE_THIRD_PARTY_JWT_PARSED_TOKEN_ERROR   = "FAIL PARSED TOKEN"
)
