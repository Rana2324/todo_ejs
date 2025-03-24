import Todo from '../models/Todo.js';
import { logger } from '../utils/logger.js';

export const todoService = {
  // Get all todos (for admins) or user's todos
  getAllTodos: async (userId, isAdmin = false) => {
    try {
      // If admin, get all todos, otherwise filter by user
      const query = isAdmin ? {} : { user: userId };
      return await Todo.find(query).sort({ createdAt: -1 }).populate('user', 'username');
    } catch (error) {
      logger.error('Error in getAllTodos:', error);
      throw new Error(`Error fetching todos: ${error.message}`);
    }
  },

  // Get todos by status
  getTodosByStatus: async (status, userId, isAdmin = false) => {
    try {
      if (!['pending', 'completed'].includes(status)) {
        throw new Error('Invalid status value');
      }
      
      // If admin, get all todos with status, otherwise filter by user and status
      const query = isAdmin ? { status } : { status, user: userId };
      return await Todo.find(query).sort({ createdAt: -1 }).populate('user', 'username');
    } catch (error) {
      logger.error('Error in getTodosByStatus:', error);
      throw new Error(`Error fetching todos by status: ${error.message}`);
    }
  },

  // Get a single todo by ID
  getTodoById: async (id, userId, isAdmin = false) => {
    try {
      const todo = await Todo.findById(id).populate('user', 'username');
      
      if (!todo) {
        throw new Error('Todo not found');
      }
      
      // Check if user has access to this todo
      if (!isAdmin && todo.user._id.toString() !== userId.toString()) {
        throw new Error('Not authorized to access this todo');
      }
      
      return todo;
    } catch (error) {
      logger.error('Error in getTodoById:', error);
      throw new Error(`Error fetching todo: ${error.message}`);
    }
  },

  // Create a new todo
  createTodo: async (todoData, userId) => {
    try {
      // Validate required fields
      if (!todoData.title || todoData.title.trim().length < 3) {
        throw new Error('Title must be at least 3 characters long');
      }

      // Create new todo with validated data and user ID
      const newTodo = new Todo({
        title: todoData.title.trim(),
        description: todoData.description?.trim(),
        status: todoData.status || 'pending',
        user: userId
      });

      // Save and return the new todo
      const savedTodo = await newTodo.save();
      return await Todo.findById(savedTodo._id).populate('user', 'username');
    } catch (error) {
      logger.error('Error in createTodo:', error);
      throw new Error(`Error creating todo: ${error.message}`);
    }
  },

  // Update a todo
  updateTodo: async (id, todoData, userId, isAdmin = false) => {
    try {
      // Validate title if provided
      if (todoData.title && todoData.title.trim().length < 3) {
        throw new Error('Title must be at least 3 characters long');
      }

      // Find the todo first
      const todo = await Todo.findById(id);
      if (!todo) {
        throw new Error('Todo not found');
      }
      
      // Check if user has permission to update this todo
      if (!isAdmin && todo.user.toString() !== userId.toString()) {
        throw new Error('Not authorized to update this todo');
      }

      // Update todo fields
      if (todoData.title) {
        todo.title = todoData.title.trim();
      }
      if (todoData.description !== undefined) {
        todo.description = todoData.description.trim();
      }
      if (todoData.status) {
        todo.status = todoData.status;
      }

      // Save and return the updated todo
      const updatedTodo = await todo.save();
      return await Todo.findById(updatedTodo._id).populate('user', 'username');
    } catch (error) {
      logger.error('Error in updateTodo:', error);
      throw new Error(`Error updating todo: ${error.message}`);
    }
  },

  // Toggle todo status
  toggleTodoStatus: async (id, userId, isAdmin = false) => {
    try {
      const todo = await Todo.findById(id);

      if (!todo) {
        throw new Error('Todo not found');
      }
      
      // Check if user has permission to toggle this todo
      if (!isAdmin && todo.user.toString() !== userId.toString()) {
        throw new Error('Not authorized to toggle this todo');
      }

      todo.status = todo.status === 'pending' ? 'completed' : 'pending';
      const updatedTodo = await todo.save();
      return await Todo.findById(updatedTodo._id).populate('user', 'username');
    } catch (error) {
      logger.error('Error in toggleTodoStatus:', error);
      throw new Error(`Error toggling todo status: ${error.message}`);
    }
  },

  // Delete a todo
  deleteTodo: async (id, userId, isAdmin = false) => {
    try {
      const todo = await Todo.findById(id);
      
      if (!todo) {
        throw new Error('Todo not found');
      }
      
      // Check if user has permission to delete this todo
      if (!isAdmin && todo.user.toString() !== userId.toString()) {
        throw new Error('Not authorized to delete this todo');
      }
      
      await Todo.findByIdAndDelete(id);
      return todo;
    } catch (error) {
      logger.error('Error in deleteTodo:', error);
      throw new Error(`Error deleting todo: ${error.message}`);
    }
  },
};

export default todoService;
