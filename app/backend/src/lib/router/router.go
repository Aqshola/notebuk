package router

import (
	"net/http"
)

func NewRouter() *Router {
	return &Router{
		routes:      make([]Route, 0),
		middlewares: make([]Middleware, 0),
	}
}

func (r *Router) Use(middlewares ...Middleware) {
	r.middlewares = append(r.middlewares, middlewares...)
}
func (r *Router) Handle(method, path string, handler http.HandlerFunc, middlewares ...Middleware) {
	route := Route{
		handler:     handler,
		path:        path,
		method:      method,
		middlewares: middlewares,
	}

	r.routes = append(r.routes, route)
}
func (r *Router) GET(path string, handler http.HandlerFunc, middlewares ...Middleware) {
	r.Handle("GET", path, handler, middlewares...)
}

func (r *Router) POST(path string, handler http.HandlerFunc, middlewares ...Middleware) {
	r.Handle("POST", path, handler, middlewares...)
}

func (r *Router) applyMiddleware(handler http.HandlerFunc, middlewares []Middleware) http.HandlerFunc {
	for i := len(middlewares) - 1; i >= 0; i-- {
		handler = middlewares[i](handler)
	}

	for i := len(r.middlewares) - 1; i >= 0; i-- {
		handler = r.middlewares[i](handler)
	}

	return handler
}

func (r *Router) ServeHTTP(w http.ResponseWriter, req *http.Request) {
	for _, route := range r.routes {
		if route.path == req.URL.Path && route.method == req.Method {
			finalHandler := r.applyMiddleware(route.handler, route.middlewares)
			finalHandler(w, req)
			return
		}
	}

	http.NotFound(w, req)
}
