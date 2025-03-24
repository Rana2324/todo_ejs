import { apiService } from './services/api.js';
import { ui } from './utils/ui.js';
import { showToast } from './utils/toast.js';

// DOM elements
const todosContainer = document.getElementById('todos-container');
let dataTable;

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  // Initialize DataTable
  initializeDataTable();

  // Load todos
  loadTodos();

  // Add event listeners for todo actions
  todosContainer.addEventListener('click', handleTodoActions);
});

/**
 * Initialize DataTable
 */
const initializeDataTable = () => {
  try {
    const todosTable = document.getElementById('todos-table');

    if (!todosTable) {
      console.log('Todos table element not found');
      return;
    }

    // Initialize DataTable with jQuery
    dataTable = $('#todos-table').DataTable({
      responsive: true,
      pageLength: 10,
      language: {
        search: 'Search todos:',
        emptyTable: 'No todos found',
        zeroRecords: 'No matching todos found',
      },
      columns: [
        {
          data: 'status',
          render: data => {
            const classes =
              data === 'completed'
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800';
            return `
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${classes}">
                ${data}
              </span>
            `;
          },
        },
        { data: 'title' },
        { data: 'description' },
        {
          data: 'createdAt',
          render: data => new Date(data).toLocaleDateString(),
        },
        {
          data: '_id',
          render: (data, type, row) => `
            <div class="flex space-x-2">
              <button
                class="toggle-status-btn"
                data-id="${data}"
                data-status="${row.status}"
                title="Toggle status"
              >
                ${
                  row.status === 'completed'
                    ? '<i class="fas fa-check-circle text-green-600 hover:text-green-800"></i>'
                    : '<i class="fas fa-circle text-yellow-600 hover:text-yellow-800"></i>'
                }
              </button>
              <a 
                href="/edit/${data}" 
                class="edit-btn"
                title="Edit todo"
              >
                <i class="fas fa-edit text-blue-600 hover:text-blue-800"></i>
              </a>
              <button
                class="delete-btn"
                data-id="${data}"
                title="Delete todo"
              >
                <i class="fas fa-trash-alt text-red-600 hover:text-red-800"></i>
              </button>
            </div>
          `,
        },
      ],
      order: [[3, 'desc']], // Sort by created date by default
    });

    console.log('DataTable initialized successfully');
  } catch (error) {
    console.log('Error initializing DataTable:', error);
    showToast('Failed to initialize table', 'error');
  }
};

/**
 * Load todos from API and update table
 */
const loadTodos = async () => {
  try {
    console.log('Loading todos...');
    const response = await apiService.getTodos();

    if (!response.success) {
      throw new Error(response.error || 'Failed to load todos');
    }

    if (dataTable) {
      dataTable.clear().rows.add(response.data).draw();
      console.log('DataTable updated with todos');
    }
  } catch (error) {
    console.log('Error loading todos:', error);
    showToast(error.message, 'error');
  }
};

/**
 * Handle todo actions (toggle status, delete)
 * @param {Event} e - The click event
 */
const handleTodoActions = async e => {
  const toggleBtn = e.target.closest('.toggle-status-btn');
  const deleteBtn = e.target.closest('.delete-btn');

  if (toggleBtn) {
    const id = toggleBtn.dataset.id;
    const currentStatus = toggleBtn.dataset.status;
    const icon = toggleBtn.querySelector('i');

    // Show loading state
    const originalIcon = icon.className;
    icon.className = 'fas fa-spinner fa-spin';
    toggleBtn.disabled = true;

    try {
      await toggleTodoStatus(id);

      // Update button state optimistically
      const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
      toggleBtn.dataset.status = newStatus;

      // Refresh the table to show updated data
      await loadTodos();
    } catch (error) {
      // Restore original icon on error
      icon.className = originalIcon;
      toggleBtn.disabled = false;
    }
  }

  if (deleteBtn) {
    e.preventDefault();
    const id = deleteBtn.dataset.id;
    const icon = deleteBtn.querySelector('i');

    // Show loading state
    const originalIcon = icon.className;
    icon.className = 'fas fa-spinner fa-spin';
    deleteBtn.disabled = true;

    try {
      await deleteTodo(id, deleteBtn, originalIcon);
    } catch (error) {
      // Restore original icon on error
      icon.className = originalIcon;
      deleteBtn.disabled = false;
    }
  }
};

/**
 * Toggle the status of a todo
 * @param {string} id - The todo ID
 */
const toggleTodoStatus = async id => {
  try {
    const response = await apiService.toggleTodoStatus(id);

    if (!response.success) {
      throw new Error(response.error || 'Failed to toggle todo status');
    }

    showToast('Todo status updated successfully', 'success');
  } catch (error) {
    console.error('Error toggling todo status:', error);
    showToast(error.message, 'error');
    throw error;
  }
};

/**
 * Delete a todo
 * @param {string} id - The todo ID
 * @param {HTMLElement} button - The delete button element
 * @param {string} originalIcon - The original icon class
 */
const deleteTodo = async (id, button, originalIcon) => {
  try {
    const confirmed = await ui.showConfirmation('Are you sure you want to delete this todo?');
    if (!confirmed) {
      // User canceled the operation, restore the button state
      if (button) {
        const icon = button.querySelector('i');
        // eslint-disable-next-line curly
        if (icon) icon.className = originalIcon;
        button.disabled = false;
      }
      return;
    }

    const response = await apiService.deleteTodo(id);

    if (!response.success) {
      throw new Error(response.error || 'Failed to delete todo');
    }

    showToast('Todo deleted successfully', 'success');
    loadTodos(); // Refresh the table
  } catch (error) {
    console.error('Error deleting todo:', error);
    showToast(error.message, 'error');
    throw error;
  }
};
