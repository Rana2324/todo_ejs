/**
 * API configuration constants
 */

// Base URL for API endpoints
export const API_BASE_URL = '/api';

// API endpoints
export const API_ENDPOINTS = {
  TODOS: '/todos',
  TODO_BY_ID: (id) => `/todos/${id}`,
  TODO_BY_STATUS: (status) => `/todos/status/${status}`,
  TOGGLE_TODO: (id) => `/todos/${id}/toggle`,
};

// Toast display duration in milliseconds
export const TOAST_DURATION = 3000;
