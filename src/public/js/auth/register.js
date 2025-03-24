import { authService } from '../services/authService.js';
import { showToast } from '../utils/toast.js';

// DOM elements
const registerForm = document.getElementById('register-form');
const usernameInput = document.getElementById('username');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const submitBtn = registerForm.querySelector('button[type="submit"]');

// Check if user is already logged in
document.addEventListener('DOMContentLoaded', () => {
  if (authService.isAuthenticated()) {
    // Redirect to home page if already logged in
    window.location.href = '/';
    return;
  }

  // Add event listeners
  if (registerForm) {
    registerForm.addEventListener('submit', handleRegister);
    passwordInput.addEventListener('input', validatePassword);
    confirmPasswordInput.addEventListener('input', validatePasswordMatch);
  }
});

/**
 * Validate password strength
 * @returns {boolean} True if password is valid
 */
const validatePassword = () => {
  const password = passwordInput.value;
  
  if (password.length < 6) {
    passwordInput.classList.add('border-red-500');
    passwordInput.classList.remove('border-green-500');
    return false;
  } else {
    passwordInput.classList.remove('border-red-500');
    passwordInput.classList.add('border-green-500');
    return true;
  }
};

/**
 * Validate that passwords match
 * @returns {boolean} True if passwords match
 */
const validatePasswordMatch = () => {
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;
  
  if (password !== confirmPassword) {
    confirmPasswordInput.classList.add('border-red-500');
    confirmPasswordInput.classList.remove('border-green-500');
    return false;
  } else {
    confirmPasswordInput.classList.remove('border-red-500');
    confirmPasswordInput.classList.add('border-green-500');
    return true;
  }
};

/**
 * Handle registration form submission
 * @param {Event} e - Form submit event
 */
const handleRegister = async (e) => {
  e.preventDefault();

  try {
    // Get form values
    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();

    // Basic validation
    if (!username || !email || !password) {
      showToast('All fields are required', 'error');
      return;
    }

    if (username.length < 3) {
      showToast('Username must be at least 3 characters', 'error');
      return;
    }

    if (!validatePassword()) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }

    if (password !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registering...';

    // Register user using auth service
    const response = await authService.register({ username, email, password });

    if (!response.success) {
      throw new Error(response.error || 'Failed to register');
    }

    // Store authentication data
    authService.setAuth(response.data);

    // Show success message
    showToast('Registered successfully!', 'success');

    // Redirect to home page after a short delay
    setTimeout(() => {
      window.location.href = '/';
    }, 1000);
  } catch (error) {
    console.error('Registration error:', error);
    showToast(error.message || 'Registration failed', 'error');

    // Reset button state
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="fas fa-user-plus mr-1"></i> Register';
  }
};

// Export functions for testing
export { handleRegister, validatePassword, validatePasswordMatch };