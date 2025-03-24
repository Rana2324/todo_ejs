import { API_BASE_URL } from '../config/constants.js';

/**
 * Auth service for handling user authentication operations
 */
const authService = {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Response containing user and token
   */
  async register(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      return { success: false, error: 'Failed to register user' };
    }
  },

  /**
   * Login a user
   * @param {Object} credentials - User login credentials
   * @returns {Promise<Object>} Response containing user and token
   */
  async login(credentials) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      return { success: false, error: 'Failed to login' };
    }
  },

  /**
   * Logout the current user
   * @returns {Promise<Object>} Response indicating logout success
   */
  async logout() {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`,
        },
      });
      // Clear stored auth data
      this.clearAuth();
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      return { success: false, error: 'Failed to logout' };
    }
  },

  /**
   * Refresh the access token
   * @returns {Promise<Object>} Response containing new access token
   */
  async refreshToken() {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Refresh token is sent via HttpOnly cookie
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Update stored access token
        this.setToken(data.data.accessToken);
      }
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      return { success: false, error: 'Failed to refresh token' };
    }
  },

  /**
   * Get the current authenticated user
   * @returns {Promise<Object>} Response containing user data
   */
  async getCurrentUser() {
    try {
      const token = this.getToken();
      
      if (!token) {
        return { success: false, error: 'Not authenticated' };
      }
      
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      return { success: false, error: 'Failed to get current user' };
    }
  },

  /**
   * Store authentication data in localStorage
   * @param {Object} data - Auth data to store
   */
  setAuth(data) {
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('token', data.accessToken);
  },

  /**
   * Get the stored access token
   * @returns {string|null} The stored access token or null
   */
  getToken() {
    return localStorage.getItem('token');
  },

  /**
   * Get the stored user data
   * @returns {Object|null} The stored user data or null
   */
  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  /**
   * Clear stored authentication data
   */
  clearAuth() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  },

  /**
   * Check if user is authenticated
   * @returns {boolean} True if authenticated, false otherwise
   */
  isAuthenticated() {
    return !!this.getToken();
  },

  /**
   * Check if user has a specific role
   * @param {string} role - Role to check
   * @returns {boolean} True if user has role, false otherwise
   */
  hasRole(role) {
    const user = this.getUser();
    return user && user.role === role;
  },
};

export { authService };