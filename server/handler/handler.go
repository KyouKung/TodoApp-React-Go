package handler

import (
	"github.com/KyouKung/go-react-todo/database"
	todos "github.com/KyouKung/go-react-todo/model"
	"github.com/gofiber/fiber/v2"
)

func CreateTodo(c *fiber.Ctx) error {
	db := database.DB.Db
	todo := new(todos.Todo)
	err := c.BodyParser(todo)
	if err != nil {
	 return c.Status(500).JSON(fiber.Map{"data": err})
	}
   err = db.Create(&todo).Error
	if err != nil {
	 return c.Status(500).JSON(fiber.Map{"data": err})
	}
	return c.Status(201).JSON(fiber.Map{"data": todo})
   }

func GetAllTodos(c *fiber.Ctx) error {
	db := database.DB.Db
	var todo []todos.Todo
	db.Find(&todo)
	if len(todo) == 0 {
	 return c.Status(404).JSON(fiber.Map{"data": nil})
	}
	return c.Status(200).JSON(fiber.Map{"data": todo})
   }

func GetSingleTodo(c *fiber.Ctx) error {
	db := database.DB.Db
	id, err := c.ParamsInt("id")
	if err != nil {
		return c.SendStatus(fiber.StatusBadRequest)
	}
   var todo todos.Todo
	db.Find(&todo, "id = ?", id)
   if todo.ID != id {
	 return c.Status(404).JSON(fiber.Map{"data": nil})
	}
   return c.Status(200).JSON(fiber.Map{"data": todo})
   }

func UpdateTodo(c *fiber.Ctx) error {
	type updateTodo struct {
		ID      int    `json:"id"`
		Title   string `json:"title"`
		Content string `json:"content"`
		Done    bool   `json:"done"`
	}

   db := database.DB.Db
   var todo todos.Todo
   id, err := c.ParamsInt("id")
   if err != nil {
	   return c.SendStatus(fiber.StatusBadRequest)
   }
	db.Find(&todo, "id = ?", id)
	if todo.ID != id {
		return c.Status(404).JSON(fiber.Map{"data": nil})
	   }
   var updateTodoData updateTodo
	err = c.BodyParser(&updateTodoData)
	if err != nil {
	 return c.Status(500).JSON(fiber.Map{"data": err})
	}
	todo.Title = updateTodoData.Title
	todo.Content = updateTodoData.Content
	todo.Done = updateTodoData.Done
	db.Save(&todo)
	return c.Status(200).JSON(fiber.Map{"data": todo})
   }

func DeleteTodo(c *fiber.Ctx) error {
	db := database.DB.Db
	var todo todos.Todo
	id, err := c.ParamsInt("id")
	if err != nil {
		return c.SendStatus(fiber.StatusBadRequest)
	}
	db.Find(&todo, "id = ?", id)
	if todo.ID != id {
		return c.Status(404).JSON(fiber.Map{"data": nil})
	   }
   err = db.Delete(&todo, "id = ?", id).Error
   if err != nil {
	 return c.Status(404).JSON(fiber.Map{"data": nil})
	}
   return c.Status(200).JSON(fiber.Map{"message": "Todo deleted"})
   }