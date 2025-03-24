import { authService } from '../services/authService.js';
import { showToast } from '../utils/toast.js';

// DOM elements
const userCountElement = document.getElementById('user-count');
const todoCountTotalElement = document.getElementById('todo-count-total');
const todoCountCompletedElement = document.getElementById('todo-count-completed');

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
  // Check if user is authenticated and has admin role
  if (!authService.isAuthenticated() || !authService.hasRole('admin')) {
    // Redirect to login if not authenticated or not an admin
    window.location.href = '/login';
    return;
  }

  // Load dashboard data
  loadDashboardData();
});

/**
 * Load dashboard data from API
 */
const loadDashboardData = async () => {
  try {
    // Load user statistics
    loadUserStats();
    
    // Load todo statistics
    loadTodoStats();
  } catch (error) {
    console.error('Error loading dashboard data:', error);
    showToast('Failed to load dashboard data', 'error');
  }
};

/**
 * Load user statistics
 */
const loadUserStats = async () => {
  try {
    const response = await fetch('/admin/api/users/stats', {
      headers: {
        'Authorization': `Bearer ${authService.getToken()}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to load user statistics');
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to load user statistics');
    }

    // Update UI with user statistics
    if (userCountElement) {
      userCountElement.innerHTML = `
        <span class="text-blue-600">${data.data.total}</span> Users
        <div class="text-sm text-gray-600 mt-1">
          <span class="text-green-600">${data.data.admins}</span> Admins, 
          <span class="text-blue-600">${data.data.regularUsers}</span> Regular Users
        </div>
      `;
    }
  } catch (error) {
    console.error('Error loading user statistics:', error);
    if (userCountElement) {
      userCountElement.innerHTML = '<span class="text-red-600">Failed to load</span>';
    }
  }
};

/**
 * Load todo statistics
 */
const loadTodoStats = async () => {
  try {
    const response = await fetch('/admin/api/todos/stats', {
      headers: {
        'Authorization': `Bearer ${authService.getToken()}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to load todo statistics');
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to load todo statistics');
    }

    // Update UI with todo statistics
    if (todoCountTotalElement) {
      todoCountTotalElement.textContent = data.data.total;
    }
    
    if (todoCountCompletedElement) {
      todoCountCompletedElement.textContent = data.data.completed;
    }
  } catch (error) {
    console.error('Error loading todo statistics:', error);
    if (todoCountTotalElement) {
      todoCountTotalElement.innerHTML = '<span class="text-red-600">Error</span>';
    }
    if (todoCountCompletedElement) {
      todoCountCompletedElement.innerHTML = '<span class="text-red-600">Error</span>';
    }
  }
};