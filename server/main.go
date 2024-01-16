package main

import (
	"github.com/KyouKung/go-react-todo/database"
	"github.com/KyouKung/go-react-todo/router"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	_ "github.com/lib/pq"
)

func main() {

	database.Connect()

	app := fiber.New()
	
	app.Use(logger.New())
	app.Use(cors.New())
	router.SetupRoutes(app)

	app.Listen(":8080")
}