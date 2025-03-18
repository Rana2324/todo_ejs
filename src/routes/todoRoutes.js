import express from 'express';
import todoController from '../controllers/todoController.js';

const router = express.Router();

// GET all todos
router.get('/todos', todoController.getAllTodos);

// GET todos by status
router.get('/todos/status/:status', todoController.getTodosByStatus);

// Toggle todo status
router.put('/todos/:id/toggle', todoController.toggleTodoStatus);
router.patch('/todos/:id/toggle', todoController.toggleTodoStatus);

// UPDATE a todo
router.put('/todos/:id', todoController.updateTodo);

// DELETE a todo
router.delete('/todos/:id', todoController.deleteTodo);

// GET a single todo
router.get('/todos/:id', todoController.getTodoById);

// CREATE a new todo
router.post('/todos', todoController.createTodo);

export default router;
//