package router

import (
	"github.com/KyouKung/go-react-todo/handler"
	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App) {

 api := app.Group("/api")
 v1 := api.Group("/todos")

 v1.Get("/", handler.GetAllTodos)
 v1.Get("/:id", handler.GetSingleTodo)
 v1.Post("/", handler.CreateTodo)
 v1.Put("/:id", handler.UpdateTodo)
 v1.Delete("/:id", handler.DeleteTodo)
}