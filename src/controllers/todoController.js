import todoService from '../services/todoService.js';
import { logger } from '../utils/logger.js';

/**
 * Todo controller containing all route handlers for todo operations
 */
const todoController = {
  /**
   * Get all todos
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getAllTodos(req, res) {
    try {
      const todos = await todoService.getAllTodos();
      console.log(todos);
      res.json({ success: true, data: todos });
    } catch (error) {
      logger.error('Error getting todos:', error);
      res.status(500).json({ success: false, error: 'Failed to get todos' });
    }
  },

  /**
   * Get todos by status
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getTodosByStatus(req, res) {
    try {
      const { status } = req.params;
      const todos = await todoService.getTodosByStatus(status);
      res.json({ success: true, data: todos });
    } catch (error) {
      logger.error('Error getting todos by status:', error);
      res.status(500).json({ success: false, error: 'Failed to get todos' });
    }
  },

  /**
   * Get a single todo by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getTodoById(req, res) {
    try {
      const todo = await todoService.getTodoById(req.params.id);

      if (!todo) {
        return res.status(404).json({ success: false, error: 'Todo not found' });
      }

      res.json({ success: true, data: todo });
    } catch (error) {
      logger.error('Error getting todo:', error);
      res.status(500).json({ success: false, error: 'Failed to get todo' });
    }
  },

  /**
   * Create a new todo
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async createTodo(req, res) {
    try {
      const { title, description, status } = req.body;

      // Validate required fields
      if (!title) {
        return res.status(400).json({
          success: false,
          error: 'Title is required',
        });
      }

      const todo = await todoService.createTodo({
        title,
        description: description || '',
        status: status || 'pending',
      });

      res.status(201).json({ success: true, data: todo });
    } catch (error) {
      logger.error('Error creating todo:', error);
      res.status(500).json({ success: false, error: 'Failed to create todo' });
    }
  },

  /**
   * Update a todo
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async updateTodo(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const todo = await todoService.updateTodo(id, updateData);

      if (!todo) {
        return res.status(404).json({ success: false, error: 'Todo not found' });
      }

      res.json({ success: true, data: todo });
    } catch (error) {
      logger.error('Error updating todo:', error);
      res.status(500).json({ success: false, error: 'Failed to update todo' });
    }
  },

  /**
   * Toggle todo status
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async toggleTodoStatus(req, res) {
    try {
      const { id } = req.params;
      const todo = await todoService.getTodoById(id);

      if (!todo) {
        return res.status(404).json({ success: false, error: 'Todo not found' });
      }

      // Toggle the status
      const newStatus = todo.status === 'completed' ? 'pending' : 'completed';
      const updatedTodo = await todoService.updateTodo(id, { status: newStatus });

      res.json({ success: true, data: updatedTodo });
    } catch (error) {
      logger.error('Error toggling todo status:', error);
      res.status(500).json({ success: false, error: 'Failed to toggle todo status' });
    }
  },

  /**
   * Delete a todo
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async deleteTodo(req, res) {
    try {
      const { id } = req.params;
      const todo = await todoService.deleteTodo(id);

      if (!todo) {
        return res.status(404).json({ success: false, error: 'Todo not found' });
      }

      res.json({ success: true, data: todo });
    } catch (error) {
      logger.error('Error deleting todo:', error);
      res.status(500).json({ success: false, error: 'Failed to delete todo' });
    }
  },
};

export default todoController;
