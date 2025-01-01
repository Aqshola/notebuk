package route

import (
	"backend/lib/router"
	"fmt"
	"net/http"
)

func InitRoute() *router.Router {
	route := router.NewRouter()

	route.GET("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "HELLO WORLD")
	})

	return route

}
