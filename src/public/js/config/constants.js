/**
 * API configuration constants
 */

// Base URL for API endpoints
export const API_BASE_URL = '/api';

// Todo status options
export const TODO_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed'
};

// API endpoints
export const API_ENDPOINTS = {
  TODOS: '/todos',
  TODO_BY_ID: (id) => `/todos/${id}`,
  TODOS_BY_STATUS: (status) => `/todos/status/${status}`,
  TOGGLE_TODO: (id) => `/todos/${id}/toggle`
};
