package main

import (
	"github.com/gofiber/fiber/v2"
)

type Todo struct {
	ID     int    `json:"id"`
	Title  string `json:"title"`
	Content string `json:"content"`
	Done bool `json:"done"`
}

var todos []Todo

func main() {
	app := fiber.New()

	app.Get("/hello", func(c *fiber.Ctx) error {
		return c.SendString("Hello World")
	  })

	app.Get("/todo", getTodos)
	app.Get("/todo/:id", getTodo)
	app.Post("/todo", createTodo)
	app.Put("/todo/:id", updateTodo)
	app.Patch("/todo/:id/done", todoDone)
	app.Delete("/todo/:id", deleteTodo)

	app.Listen(":8080")
}

func getTodos(c *fiber.Ctx) error {
	return c.JSON(todos)
}

func getTodo(c *fiber.Ctx) error {
	id, err := c.ParamsInt("id")
	if err != nil {
		return c.SendStatus(fiber.StatusBadRequest)
	}

	for _, todo := range todos {
		if todo.ID == id {
			return c.JSON(todo)
		}
	}

	return c.SendStatus(fiber.StatusNotFound)
}

func createTodo(c *fiber.Ctx) error {
	todo := new(Todo)

	if err := c.BodyParser(todo); err != nil {
		return c.Status(fiber.StatusBadRequest).SendString(err.Error())
	}

	todo.ID = len(todos) + 1
	todos = append(todos, *todo)

	return c.JSON(todo)
}

func updateTodo(c *fiber.Ctx) error {
	id, err := c.ParamsInt("id")
	if err != nil {
		return c.SendStatus(fiber.StatusBadRequest)
	}

	todoUpdate := new(Todo)
	if err := c.BodyParser(todoUpdate); err != nil {
		return c.Status(fiber.StatusBadRequest).SendString(err.Error())
	}

	for i, todo := range todos {
		if todo.ID == id {
			todo.Title = todoUpdate.Title
			todo.Content = todoUpdate.Content
			todos[i] = todo
			return c.JSON(todo)
		}
	}

	return c.SendStatus(fiber.StatusNotFound)
}

func todoDone(c *fiber.Ctx) error {
	id, err := c.ParamsInt("id")
	if err != nil {
		return c.SendStatus(fiber.StatusBadRequest)
	}

	for i, todo := range todos {
		if todo.ID == id {
			todos[i].Done = true
			return c.JSON(todo)
		}
	}

	return c.SendStatus(fiber.StatusNotFound)
}

func deleteTodo(c *fiber.Ctx) error {
	id, err := c.ParamsInt("id")
	if err != nil {
		return c.SendStatus(fiber.StatusBadRequest)
	}

	for i, todo := range todos {
		if todo.ID == id {
			todos = append(todos[:i], todos[i+1:]...)
			return c.SendStatus(fiber.StatusNoContent)
		}
	}

	return c.SendStatus(fiber.StatusNotFound)
}