package main

import (
	"fmt"
	Service "iot/main/services"
	"net/http"
	_ "os"

	docs "iot/main/docs"

	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

func main() {

	success, err := Service.EstablishDatabaseConnection()

	if !success {
		fmt.Printf("Error while initializing database! %v", err)

		return
	}

	router := gin.Default()

	v1 := router.Group("/api/v1")
	{
		v1.Group("/sensors/air-quality")
		{
			router.GET("/co2", GetCO2)
			router.GET("/voc", GetVOC)
		}

	}

	docs.SwaggerInfo.Title = "Swagger IoT API"
	docs.SwaggerInfo.Description = "This is a cloud hosted api for IoT course assignment"
	docs.SwaggerInfo.Version = "1.0"
	docs.SwaggerInfo.Schemes = []string{"http", "https"}

	router.GET("/swagger/*any", SwaggerHandler)

	router.Run(":8080")
}

// GetCO2
// @Summary      Get latest Co2 measurement
// @Description  Gets the latest Co2 measurement from the database
// @Tags         /sensors/air-quality
// @Accept       json
// @Produce      json
// @Success      200  {object}  models.Measurement
// @Failure      500  {object}  error
// @Router       /sensors/air-quality/co2 [get]
func GetCO2(context *gin.Context) {
	value, err := Service.GetLatestCO2()

	if err != nil {
		context.IndentedJSON(http.StatusInternalServerError, err)
	}

	context.IndentedJSON(http.StatusOK, value)
}

// GetVOC
// @Summary      Get latest VOC measurement
// @Description  Gets the latest VOC measurement from the database
// @Tags         /sensors/air-quality
// @Accept       json
// @Produce      json
// @Success      200  {object}  models.Measurement
// @Failure      500  {object}  error
// @Router       /sensors/air-quality/voc [get]
func GetVOC(context *gin.Context) {
	value, err := Service.GetLatestVOC()

	if err != nil {
		context.IndentedJSON(http.StatusInternalServerError, err)
	}

	context.IndentedJSON(http.StatusOK, value)
}

func SwaggerHandler(context *gin.Context) {
	ginSwagger.WrapHandler(swaggerFiles.Handler)(context)
}
