package route

import (
	"backend/src/controller"
	"backend/src/lib/router"
	"backend/src/middleware"

	"github.com/jmoiron/sqlx"
)

func InitRoute(db *sqlx.DB) *router.Router {

	controllerRoute := &controller.AppInjection{
		DB: db,
	}
	route := router.NewRouter()

	//INIT MIDDLEWARE
	route.Use(middleware.CORS, middleware.Recovery)

	route.GET("/", controllerRoute.HomeHandler)

	//AUTH
	route.POST("/auth/sign-in", controllerRoute.SignIn)
	route.POST("/auth/sign-up", controllerRoute.SignUp)
	route.POST("/auth/validate", controllerRoute.Validate)
	route.POST("/auth/sign-out", controllerRoute.SignOut, middleware.PrivateRoute)

	return route

}
