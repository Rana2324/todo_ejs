import { API_BASE_URL } from '../config/constants.js';
import { authService } from './authService.js';

/**
 * API service for handling todo operations
 */
const apiService = {
  /**
   * Get auth headers for authenticated requests
   * @returns {Object} Headers object with Authorization token
   */
  getAuthHeaders() {
    const token = authService.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
  },

  /**
   * Get all todos
   * @returns {Promise<Object>} Response containing todos
   */
  async getTodos() {
    try {
      const response = await fetch(`${API_BASE_URL}/todos`, {
        headers: this.getAuthHeaders()
      });
      
      if (response.status === 401) {
        // Token might be expired, try to refresh it
        const refreshed = await this.handleTokenRefresh();
        if (refreshed) {
          // Retry the request with new token
          return this.getTodos();
        } else {
          // Refresh failed, redirect to login
          this.handleAuthError();
          return { success: false, error: 'Authentication failed' };
        }
      }
      
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
      const response = await fetch(`${API_BASE_URL}/todos/status/${status}`, {
        headers: this.getAuthHeaders()
      });

      if (response.status === 401) {
        // Token might be expired, try to refresh it
        const refreshed = await this.handleTokenRefresh();
        if (refreshed) {
          // Retry the request with new token
          return this.getTodosByStatus(status);
        } else {
          // Refresh failed, redirect to login
          this.handleAuthError();
          return { success: false, error: 'Authentication failed' };
        }
      }
      
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
      const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
        headers: this.getAuthHeaders()
      });

      if (response.status === 401) {
        // Token might be expired, try to refresh it
        const refreshed = await this.handleTokenRefresh();
        if (refreshed) {
          // Retry the request with new token
          return this.getTodoById(id);
        } else {
          // Refresh failed, redirect to login
          this.handleAuthError();
          return { success: false, error: 'Authentication failed' };
        }
      }
      
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
        headers: this.getAuthHeaders(),
        body: JSON.stringify(todoData),
      });

      if (response.status === 401) {
        // Token might be expired, try to refresh it
        const refreshed = await this.handleTokenRefresh();
        if (refreshed) {
          // Retry the request with new token
          return this.createTodo(todoData);
        } else {
          // Refresh failed, redirect to login
          this.handleAuthError();
          return { success: false, error: 'Authentication failed' };
        }
      }
      
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
        headers: this.getAuthHeaders(),
        body: JSON.stringify(todoData),
      });

      if (response.status === 401) {
        // Token might be expired, try to refresh it
        const refreshed = await this.handleTokenRefresh();
        if (refreshed) {
          // Retry the request with new token
          return this.updateTodo(id, todoData);
        } else {
          // Refresh failed, redirect to login
          this.handleAuthError();
          return { success: false, error: 'Authentication failed' };
        }
      }
      
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
        headers: this.getAuthHeaders()
      });

      if (response.status === 401) {
        // Token might be expired, try to refresh it
        const refreshed = await this.handleTokenRefresh();
        if (refreshed) {
          // Retry the request with new token
          return this.toggleTodoStatus(id);
        } else {
          // Refresh failed, redirect to login
          this.handleAuthError();
          return { success: false, error: 'Authentication failed' };
        }
      }
      
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
        headers: this.getAuthHeaders()
      });

      if (response.status === 401) {
        // Token might be expired, try to refresh it
        const refreshed = await this.handleTokenRefresh();
        if (refreshed) {
          // Retry the request with new token
          return this.deleteTodo(id);
        } else {
          // Refresh failed, redirect to login
          this.handleAuthError();
          return { success: false, error: 'Authentication failed' };
        }
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      return { success: false, error: 'Failed to delete todo' };
    }
  },

  /**
   * Handle token refresh when a request returns 401
   * @returns {Promise<boolean>} True if refresh succeeded, false otherwise
   */
  async handleTokenRefresh() {
    try {
      const refreshResponse = await authService.refreshToken();
      return refreshResponse.success;
    } catch (error) {
      console.error('Token refresh error:', error);
      return false;
    }
  },

  /**
   * Handle authentication errors by redirecting to login
   */
  handleAuthError() {
    // Clear auth data
    authService.clearAuth();
    
    // Show message only if we're not already on the login page
    if (!window.location.pathname.includes('/login')) {
      // Store the current page to redirect back after login
      localStorage.setItem('redirectAfterLogin', window.location.pathname);
      
      // Redirect to login page
      window.location.href = '/login';
    }
  }
};

export { apiService };
