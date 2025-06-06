package constants

const (
	NO_ERROR = "SCS"
)
const (
	ERROR_DATABASE_CALL           = "ERR_DB_CA"
	ERROR_DATABASE_CALL_INSERT    = "ERR_DB_CA_1"
	ERROR_DATABASE_CALL_UPDATE    = "ERR_DB_CA_2"
	ERROR_DATABASE_CALL_GET       = "ERR_DB_CA_3"
	ERROR_DATABASE_CALL_DELETE    = "ERR_DB_CA_4"
	ERROR_DATABASE_NOTFOUND       = "ERR_DB_NFD"
	ERROR_DATABASE_DUPLICATE_DATA = "ERR_DB_DPC"
	ERROR_FAILED_DECODE_PAYLOOAD  = "ERR_DCD_PYD"
	ERROR_HEADER_AUTH_NO_PROVIDED = "ERR_H_AUTH_NPD"
	ERROR_TOKEN_EXPIRED           = "ERR_TKN_EXP"

	ERROR_INTERNAL = "ERR_INT"
)

// AUTH
const (
	ERROR_AUTH_USER_ALREADY_EXIST   = "ERR_AUTH_UE"
	ERROR_AUTH_VERIFICATION_ERROR   = "ERR_AUTH_V"
	ERROR_AUTH_WRONG_AUTHENTICATION = "ERR_AUTH_A"
	ERROR_AUTH_TOKEN_EXPIRED        = "ERR_AUTH_TE"
)

const (
	ERROR_THRD_EMAIL_FAIL_SEND    = "ERR_THRD_MAIL_FS"
	ERROR_THRD_JWT_GENERATE_TOKEN = "ERR_THRD_JWT_GT"
	ERROR_THRD_JWT_PARSED_TOKEN   = "ERR_THRD_JWT_PT"
)
