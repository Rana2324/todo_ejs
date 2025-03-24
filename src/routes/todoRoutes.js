import express from 'express';
import todoController from '../controllers/todoController.js';
import { authMiddleware, roleMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// GET all todos
router.get('/', todoController.getAllTodos);

// GET todos by status
router.get('/status/:status', todoController.getTodosByStatus);

// Toggle todo status
router.put('/:id/toggle', todoController.toggleTodoStatus);
router.patch('/:id/toggle', todoController.toggleTodoStatus);

// UPDATE a todo
router.put('/:id', todoController.updateTodo);

// DELETE a todo
router.delete('/:id', todoController.deleteTodo);

// GET a single todo
router.get('/:id', todoController.getTodoById);

// CREATE a new todo
router.post('/', todoController.createTodo);

export default router;