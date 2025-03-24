import { authService } from '../services/authService.js';
import { showToast } from '../utils/toast.js';

// DOM elements
const loginForm = document.getElementById('login-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const submitBtn = loginForm.querySelector('button[type="submit"]');

// Check if user is already logged in
document.addEventListener('DOMContentLoaded', () => {
  if (authService.isAuthenticated()) {
    // Redirect to home page if already logged in
    window.location.href = '/';
    return;
  }

  // Add event listeners
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }
});

/**
 * Handle login form submission
 * @param {Event} e - Form submit event
 */
const handleLogin = async (e) => {
  e.preventDefault();

  try {
    // Get form values
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    // Basic validation
    if (!email || !password) {
      showToast('Email and password are required', 'error');
      return;
    }

    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';

    // Login user using auth service
    const response = await authService.login({ email, password });

    if (!response.success) {
      throw new Error(response.error || 'Failed to login');
    }

    // Store authentication data
    authService.setAuth(response.data);

    // Show success message
    showToast('Logged in successfully!', 'success');

    // Redirect to home page after a short delay
    setTimeout(() => {
      window.location.href = '/';
    }, 1000);
  } catch (error) {
    console.error('Login error:', error);
    showToast(error.message || 'Login failed', 'error');

    // Reset button state
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="fas fa-sign-in-alt mr-1"></i> Login';
  }
};

// Export functions for testing
export { handleLogin };