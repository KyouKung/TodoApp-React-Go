package router

import (
	"github.com/KyouKung/go-react-todo/handler"
	"github.com/gofiber/fiber/v2"
)

// SetupRoutes func
func SetupRoutes(app *fiber.App) {
 // grouping
 api := app.Group("/api")
 v1 := api.Group("/todos")
 // routes
 v1.Get("/", handler.GetAllTodos)
 v1.Get("/:id", handler.GetSingleTodo)
 v1.Post("/", handler.CreateTodo)
 v1.Put("/:id", handler.UpdateTodo)
 v1.Delete("/:id", handler.DeleteTodo)
}