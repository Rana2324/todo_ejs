/**
 * Todo App - JavaScript for the edit todo page
 * Using ES modules for modern JavaScript
 */

import { apiService } from './services/api.js';
import { showToast } from './utils/toast.js';

// DOM elements
const editTodoForm = document.getElementById('edit-todo-form');
const titleInput = document.getElementById('title');
const submitBtn = editTodoForm.querySelector('button[type="submit"]');

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  if (editTodoForm) {
    editTodoForm.addEventListener('submit', handleEditTodo);
    titleInput.addEventListener('input', validateTitle);
  }
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
 * Handle form submission to edit a todo
 * @param {Event} e - The submit event
 */
const handleEditTodo = async e => {
  e.preventDefault();

  try {
    // Get form values
    const todoId = editTodoForm.dataset.todoId;
    const title = titleInput.value.trim();
    const description = document.getElementById('description').value.trim();
    const status = document.getElementById('status').value;

    // Validate title
    if (!validateTitle()) {
      showToast('Title must be at least 3 characters long', 'error');
      return;
    }

    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Updating...';

    // Update todo using API service
    const response = await apiService.updateTodo(todoId, {
      title,
      description: description || undefined,
      status,
    });

    if (!response.success) {
      throw new Error(response.error || 'Failed to update todo');
    }

    // Show success message
    showToast('Todo updated successfully!', 'success');

    // Redirect to home page after a short delay
    setTimeout(() => {
      window.location.href = '/';
    }, 1000);
  } catch (error) {
    console.error('Error updating todo:', error);
    showToast(error.message || 'Failed to update todo', 'error');

    // Reset button state
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="fas fa-save mr-1"></i> Update Todo';
  }
};

// Export functions for testing
export { handleEditTodo, validateTitle };
