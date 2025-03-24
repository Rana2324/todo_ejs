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
      // Pass user ID and admin status to service
      const isAdmin = req.user.role === 'admin';
      const todos = await todoService.getAllTodos(req.user.id, isAdmin);
      
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
      // Pass user ID and admin status to service
      const isAdmin = req.user.role === 'admin';
      const todos = await todoService.getTodosByStatus(status, req.user.id, isAdmin);
      
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
      // Pass user ID and admin status to service
      const isAdmin = req.user.role === 'admin';
      const todo = await todoService.getTodoById(req.params.id, req.user.id, isAdmin);

      if (!todo) {
        return res.status(404).json({ success: false, error: 'Todo not found' });
      }

      res.json({ success: true, data: todo });
    } catch (error) {
      logger.error('Error getting todo:', error);
      // Determine appropriate status code
      const statusCode = error.message.includes('Not authorized') ? 403 : 500;
      res.status(statusCode).json({ success: false, error: error.message || 'Failed to get todo' });
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

      // Pass user ID to service
      const todo = await todoService.createTodo(
        {
          title,
          description: description || '',
          status: status || 'pending',
        },
        req.user.id
      );

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
      // Pass user ID and admin status to service
      const isAdmin = req.user.role === 'admin';
      
      const todo = await todoService.updateTodo(id, updateData, req.user.id, isAdmin);

      if (!todo) {
        return res.status(404).json({ success: false, error: 'Todo not found' });
      }

      res.json({ success: true, data: todo });
    } catch (error) {
      logger.error('Error updating todo:', error);
      // Determine appropriate status code
      const statusCode = error.message.includes('Not authorized') ? 403 : 500;
      res.status(statusCode).json({ success: false, error: error.message || 'Failed to update todo' });
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
      // Pass user ID and admin status to service
      const isAdmin = req.user.role === 'admin';
      
      const updatedTodo = await todoService.toggleTodoStatus(id, req.user.id, isAdmin);

      res.json({ success: true, data: updatedTodo });
    } catch (error) {
      logger.error('Error toggling todo status:', error);
      // Determine appropriate status code
      const statusCode = error.message.includes('Not authorized') ? 403 : 500;
      res.status(statusCode).json({ success: false, error: error.message || 'Failed to toggle todo status' });
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
      // Pass user ID and admin status to service
      const isAdmin = req.user.role === 'admin';
      
      const todo = await todoService.deleteTodo(id, req.user.id, isAdmin);

      if (!todo) {
        return res.status(404).json({ success: false, error: 'Todo not found' });
      }

      res.json({ success: true, data: todo });
    } catch (error) {
      logger.error('Error deleting todo:', error);
      // Determine appropriate status code
      const statusCode = error.message.includes('Not authorized') ? 403 : 500;
      res.status(statusCode).json({ success: false, error: error.message || 'Failed to delete todo' });
    }
  },
};

export default todoController;
