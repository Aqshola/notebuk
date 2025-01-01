package router

import "net/http"

type Route struct {
	handler http.HandlerFunc
	method  string
	path    string
}

type Router struct {
	routes []Route
}
