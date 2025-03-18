/**
 * Todo App - JavaScript for the add todo page
 * Using ES modules and Axios for API requests
 */

import { apiService } from './services/api.js';
import { showToast } from './utils/toast.js';

// DOM elements
const addTodoForm = document.getElementById('add-todo-form');
const submitBtn = addTodoForm.querySelector('button[type="submit"]');
const titleInput = document.getElementById('title');
const descriptionInput = document.getElementById('description');
const statusSelect = document.getElementById('status');

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  // Pre-fill form if query parameters exist
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('title')) {
    titleInput.value = urlParams.get('title');
  }
  if (urlParams.has('description')) {
    descriptionInput.value = urlParams.get('description');
  }
  if (urlParams.has('status')) {
    statusSelect.value = urlParams.get('status');
  }

  // Add event listeners
  addTodoForm.addEventListener('submit', handleAddTodo);
  titleInput.addEventListener('input', validateTitle);
});

/**
 * Validate the title input
 */
const validateTitle = () => {
  const title = titleInput.value.trim();
  if (title.length < 3) {
    titleInput.classList.add('border-red-500');
    titleInput.classList.remove('border-green-500');
    return false;
  } else {
    titleInput.classList.remove('border-red-500');
    titleInput.classList.add('border-green-500');
    return true;
  }
};

/**
 * Handle form submission to add a new todo
 * @param {Event} e - The submit event
 */
const handleAddTodo = async e => {
  e.preventDefault();

  try {
    // Get form values
    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();
    const status = statusSelect.value;

    // Validate form
    if (!validateTitle()) {
      showToast('Title must be at least 3 characters long', 'error');
      return;
    }

    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding...';

    // Create todo using API service
    await apiService.createTodo({
      title,
      description: description || undefined,
      status,
    });

    // Show success message
    showToast('Todo added successfully!', 'success');

    // Redirect to home page after a short delay
    setTimeout(() => {
      window.location.href = '/';
    }, 1000);
  } catch (error) {
    console.error('Error adding todo:', error);
    showToast(error.message || 'Failed to add todo', 'error');

    // Reset button state
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="fas fa-plus mr-1"></i> Add Todo';
  }
};
