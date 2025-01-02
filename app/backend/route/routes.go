package route

import (
	"backend/handler"
	"backend/lib/router"

	"github.com/jmoiron/sqlx"
)

func InitRoute(db *sqlx.DB) *router.Router {

	handlerRoute := &handler.AppInjection{
		DB: db,
	}
	route := router.NewRouter()
	route.GET("/", handlerRoute.HomeHandler)

	//AUTH
	route.POST("/auth/sign-in", handlerRoute.SignIn)
	route.POST("/auth/sign-up", handlerRoute.SignUp)
	route.POST("/auth/validate", handlerRoute.Validate)

	return route

}
