package main

import (
	_ "fmt"
	"net/http"
	_ "os"

	"github.com/gin-gonic/gin"
)

func main() {

	router := gin.Default()

	router.GET("/helloworld", func(context *gin.Context) {
		context.IndentedJSON(http.StatusOK, "Hello World!")
	})

	router.Run("localhost:8080")
}
