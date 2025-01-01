package router

import (
	"net/http"
)

func NewRouter() *Router {
	return &Router{
		routes: make([]Route, 0),
	}
}

func (r *Router) Handle(method, path string, handler http.HandlerFunc) {
	route := Route{
		handler: handler,
		path:    path,
		method:  method,
	}

	r.routes = append(r.routes, route)
}

func (r *Router) GET(path string, handler http.HandlerFunc) {
	r.Handle("GET", path, handler)
}

func (r *Router) POST(path string, handler http.HandlerFunc) {
	r.Handle("POST", path, handler)
}

func (r *Router) ServeHTTP(w http.ResponseWriter, req *http.Request) {
	for _, route := range r.routes {
		if route.path == req.URL.Path && route.method == req.Method {
			route.handler(w, req)
			return
		}
	}

	http.NotFound(w, req)
}
