package router

import "net/http"

type Route struct {
	handler     http.HandlerFunc
	method      string
	path        string
	middlewares []Middleware
}

type Middleware func(http.HandlerFunc) http.HandlerFunc

type Router struct {
	routes      []Route
	middlewares []Middleware
}
