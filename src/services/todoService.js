import Todo from '../models/Todo.js';
import { logger } from '../utils/logger.js';

export const todoService = {
  // Get all todos
  getAllTodos: async () => {
    try {
      return await Todo.find().sort({ createdAt: -1 });
    } catch (error) {
      logger.error('Error in getAllTodos:', error);
      throw new Error(`Error fetching todos: ${error.message}`);
    }
  },

  // Get todos by status
  getTodosByStatus: async status => {
    try {
      if (!['pending', 'completed'].includes(status)) {
        throw new Error('Invalid status value');
      }
      return await Todo.find({ status }).sort({ createdAt: -1 });
    } catch (error) {
      logger.error('Error in getTodosByStatus:', error);
      throw new Error(`Error fetching todos by status: ${error.message}`);
    }
  },

  // Get a single todo by ID
  getTodoById: async id => {
    try {
      const todo = await Todo.findById(id);
      if (!todo) {
        throw new Error('Todo not found');
      }
      return todo;
    } catch (error) {
      logger.error('Error in getTodoById:', error);
      throw new Error(`Error fetching todo: ${error.message}`);
    }
  },

  // Create a new todo
  createTodo: async todoData => {
    try {
      // Validate required fields
      if (!todoData.title || todoData.title.trim().length < 3) {
        throw new Error('Title must be at least 3 characters long');
      }

      // Create new todo with validated data
      const newTodo = new Todo({
        title: todoData.title.trim(),
        description: todoData.description?.trim(),
        status: todoData.status || 'pending',
      });

      // Save and return the new todo
      return await newTodo.save();
    } catch (error) {
      logger.error('Error in createTodo:', error);
      throw new Error(`Error creating todo: ${error.message}`);
    }
  },

  // Update a todo
  updateTodo: async (id, todoData) => {
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
      return await todo.save();
    } catch (error) {
      logger.error('Error in updateTodo:', error);
      throw new Error(`Error updating todo: ${error.message}`);
    }
  },

  // Toggle todo status
  toggleTodoStatus: async id => {
    try {
      const todo = await Todo.findById(id);

      if (!todo) {
        throw new Error('Todo not found');
      }

      todo.status = todo.status === 'pending' ? 'completed' : 'pending';
      return await todo.save();
    } catch (error) {
      logger.error('Error in toggleTodoStatus:', error);
      throw new Error(`Error toggling todo status: ${error.message}`);
    }
  },

  // Delete a todo
  deleteTodo: async id => {
    try {
      const todo = await Todo.findByIdAndDelete(id);

      if (!todo) {
        throw new Error('Todo not found');
      }

      return todo;
    } catch (error) {
      logger.error('Error in deleteTodo:', error);
      throw new Error(`Error deleting todo: ${error.message}`);
    }
  },
};

export default todoService;
