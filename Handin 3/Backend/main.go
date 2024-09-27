package main

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"

	docs "iot/main/docs"
	service "iot/main/services"

	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

func main() {

	success, err := service.EstablishDatabaseConnection()

	if !success {
		fmt.Printf("Error while initializing database! %v", err)

		return
	}

	service.EstablishMQTTConnection()

	router := gin.Default()

	router.Use(CORSMiddleware())

	v1 := router.Group("/api/v1")
	{
		group := v1.Group("/sensors/air-quality")
		{
			group.GET("/co2", GetCO2)
			group.GET("/tvoc", GetTVOC)
		}

	}

	docs.SwaggerInfo.Title = "Swagger IoT API"
	docs.SwaggerInfo.Description = "This is a cloud hosted api for IoT course assignment"
	docs.SwaggerInfo.Version = "1.0"
	docs.SwaggerInfo.Schemes = []string{"http", "https"}

	router.GET("/swagger/*any", SwaggerHandler)

	router.PUT("/led-state/:on", LedHandler)

	router.Run(":8080")
}

// GetCO2
// @Summary      Get latest Co2 measurement
// @Description  Gets the latest Co2 measurement from the database
// @Tags         GET API Endpoints
// @Accept       json
// @Produce      json
// @Success      200  {object}  models.Measurement
// @Failure      500  {object}  error
// @Router       /api/v1/sensors/air-quality/co2 [get]
func GetCO2(context *gin.Context) {
	value, err := service.GetLatestCO2()

	fmt.Println(value)

	if err != nil {
		context.IndentedJSON(http.StatusInternalServerError, err)
	}

	context.IndentedJSON(http.StatusOK, value)
}

// GetVOC
// @Summary      Get latest TVOC measurement
// @Description  Gets the latest VOC measurement from the database
// @Tags         GET API Endpoints
// @Accept       json
// @Produce      json
// @Success      200  {object}  models.Measurement
// @Failure      500  {object}  error
// @Router       /api/v1/sensors/air-quality/tvoc [get]
func GetTVOC(context *gin.Context) {
	value, err := service.GetLatestTVOC()

	if err != nil {
		context.IndentedJSON(http.StatusInternalServerError, err)
	}

	context.IndentedJSON(http.StatusOK, value)
}

// LedHandler
// @Summary      Change led state on IoT device
// @Description  Change led state on IoT device
// @Tags         PUT API Endpoints
// @Accept       json
// @Produce      json
// @Success      204  {object}  string
// @Failure      400  {object}  error
// @Failure      500  {object}  error
// @Param        on path string true "State of led, 0 = off, 1 = on"
// @Router       /led-state/{on} [put]
func LedHandler(context *gin.Context) {
	param := context.Param("on")

	state, err := strconv.ParseInt(param, 10, 64)

	if err != nil {
		context.IndentedJSON(http.StatusBadRequest, fmt.Sprintf("Error while parsing parameter %v", err))

		return
	}

	if state < 0 || state > 1 {
		context.IndentedJSON(http.StatusBadRequest, "Passed parameter must be 0 (off) or 1 (on)")

		return
	}

	service.PublishToTopic(state)

	context.IndentedJSON(http.StatusNoContent, "Message pusblished")
}

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}

func SwaggerHandler(context *gin.Context) {
	ginSwagger.WrapHandler(swaggerFiles.Handler)(context)
}
