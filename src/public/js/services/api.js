import { API_BASE_URL } from '../config/constants.js';

/**
 * API service for handling todo operations
 */
const apiService = {
  /**
   * Get all todos
   * @returns {Promise<Object>} Response containing todos
   */
  async getTodos() {
    try {
      const response = await fetch(`${API_BASE_URL}/todos`);
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      return { success: false, error: 'Failed to fetch todos' };
    }
  },

  /**
   * Get todos by status
   * @param {string} status - Todo status to filter by
   * @returns {Promise<Object>} Response containing filtered todos
   */
  async getTodosByStatus(status) {
    try {
      const response = await fetch(`${API_BASE_URL}/todos/status/${status}`);
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      return { success: false, error: 'Failed to fetch todos' };
    }
  },

  /**
   * Get a single todo by ID
   * @param {string} id - Todo ID
   * @returns {Promise<Object>} Response containing todo
   */
  async getTodoById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/todos/${id}`);
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      return { success: false, error: 'Failed to fetch todo' };
    }
  },

  /**
   * Create a new todo
   * @param {Object} todoData - Todo data
   * @returns {Promise<Object>} Response containing created todo
   */
  async createTodo(todoData) {
    try {
      const response = await fetch(`${API_BASE_URL}/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(todoData),
      });
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      return { success: false, error: 'Failed to create todo' };
    }
  },

  /**
   * Update a todo
   * @param {string} id - Todo ID
   * @param {Object} todoData - Updated todo data
   * @returns {Promise<Object>} Response containing updated todo
   */
  async updateTodo(id, todoData) {
    try {
      const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(todoData),
      });
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      return { success: false, error: 'Failed to update todo' };
    }
  },

  /**
   * Toggle todo status
   * @param {string} id - Todo ID
   * @returns {Promise<Object>} Response containing updated todo
   */
  async toggleTodoStatus(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/todos/${id}/toggle`, {
        method: 'PUT',
      });
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      return { success: false, error: 'Failed to toggle todo status' };
    }
  },

  /**
   * Delete a todo
   * @param {string} id - Todo ID
   * @returns {Promise<Object>} Response containing deleted todo
   */
  async deleteTodo(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
        method: 'DELETE',
      });
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      return { success: false, error: 'Failed to delete todo' };
    }
  },
};

export { apiService };
