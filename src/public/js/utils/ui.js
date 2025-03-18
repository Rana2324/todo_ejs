/**
 * UI utility functions for handling notifications and UI interactions
 */
const ui = {
  /**
   * Show a notification message
   * @param {string} message - Message to display
   * @param {string} type - Type of notification (success, error, info, warning)
   */
  showNotification(message, type = 'info') {
    const alertClasses = {
      success: 'bg-green-100 border-green-500 text-green-700',
      error: 'bg-red-100 border-red-500 text-red-700',
      info: 'bg-blue-100 border-blue-500 text-blue-700',
      warning: 'bg-yellow-100 border-yellow-500 text-yellow-700',
    };

    const iconClasses = {
      success: 'fa-check-circle',
      error: 'fa-exclamation-circle',
      info: 'fa-info-circle',
      warning: 'fa-exclamation-triangle',
    };

    const alert = document.createElement('div');
    alert.className = `${alertClasses[type]} border-l-4 p-4 mb-4`;
    alert.setAttribute('role', 'alert');
    alert.innerHTML = `
            <p><i class="fas ${iconClasses[type]}"></i> ${message}</p>
        `;

    // Insert at the top of the content area
    const contentArea = document.querySelector('.max-w-6xl');
    contentArea.insertBefore(alert, contentArea.firstChild);

    // Remove after 5 seconds
    setTimeout(() => alert.remove(), 5000);
  },

  /**
   * Show a confirmation dialog
   * @param {string} message - Confirmation message
   * @returns {Promise<boolean>} User's choice
   */
  async showConfirmation(message) {
    return window.confirm(message);
  },

  /**
   * Format a date string
   * @param {string} dateString - ISO date string
   * @returns {string} Formatted date
   */
  formatDate(dateString) {
    return new Date(dateString).toLocaleDateString();
  },

  /**
   * Create a status badge element
   * @param {string} status - Todo status
   * @returns {string} HTML for status badge
   */
  createStatusBadge(status) {
    const classes =
      status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';

    return `
            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${classes}">
                ${status}
            </span>
        `;
  },

  /**
   * Create action buttons for a todo item
   * @param {string} todoId - Todo ID
   * @returns {string} HTML for action buttons
   */
  createActionButtons(todoId) {
    return `
            <button onclick="toggleStatus('${todoId}')" 
                class="text-blue-600 hover:text-blue-900">
                <i class="fas fa-sync-alt"></i>
            </button>
            <a href="/todos/${todoId}/edit" 
                class="text-indigo-600 hover:text-indigo-900">
                <i class="fas fa-edit"></i>
            </a>
            <button onclick="deleteTodo('${todoId}')" 
                class="text-red-600 hover:text-red-900">
                <i class="fas fa-trash-alt"></i>
            </button>
        `;
  },

  /**
   * Show a loading spinner
   * @param {HTMLElement} element - Element to show spinner in
   * @param {string} [size='md'] - Size of spinner (sm/md/lg)
   * @returns {Function} Function to hide spinner
   */
  showSpinner(element, size = 'md') {
    const originalContent = element.innerHTML;
    const spinnerSizes = {
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-8 h-8',
    };

    element.innerHTML = `
      <div class="flex justify-center items-center">
        <div class="${spinnerSizes[size]} animate-spin">
          <i class="fas fa-spinner"></i>
        </div>
      </div>
    `;

    return () => {
      element.innerHTML = originalContent;
    };
  },

  /**
   * Show a modal dialog
   * @param {Object} options - Modal options
   * @param {string} options.title - Modal title
   * @param {string} options.content - Modal content
   * @param {Object} [options.buttons] - Modal buttons
   * @returns {Promise<any>} Result from modal
   */
  showModal({ title, content, buttons = {} }) {
    return new Promise(resolve => {
      const modal = document.createElement('div');
      modal.className = 'fixed inset-0 z-50 overflow-y-auto';
      modal.innerHTML = `
        <div class="flex items-center justify-center min-h-screen p-4">
          <div class="fixed inset-0 bg-black opacity-50"></div>
          <div class="relative bg-white rounded-lg shadow-xl max-w-lg w-full">
            <div class="px-6 py-4">
              <h3 class="text-lg font-medium">${title}</h3>
              <div class="mt-2">${content}</div>
            </div>
            <div class="px-6 py-4 bg-gray-50 flex justify-end space-x-2 rounded-b-lg">
              ${Object.entries(buttons)
                .map(
                  ([key, label]) => `
                  <button
                    class="px-4 py-2 text-sm font-medium rounded-md shadow-sm
                    ${
                      key === 'cancel'
                        ? 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }"
                    data-action="${key}">
                    ${label}
                  </button>
                `
                )
                .join('')}
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(modal);

      const handleClick = e => {
        const button = e.target.closest('button[data-action]');
        if (button) {
          const action = button.dataset.action;
          modal.remove();
          resolve(action);
        }
      };

      modal.addEventListener('click', handleClick);
    });
  },

  /**
   * Initialize DataTable
   * @param {string} selector - Table selector
   * @param {Object} options - DataTable options
   * @returns {Object} DataTable instance
   */
  initDataTable(selector, options = {}) {
    try {
      return $(selector).DataTable({
        responsive: true,
        pageLength: 10,
        ...options,
      });
    } catch (error) {
      console.error('Error initializing DataTable:', error);
      throw error;
    }
  },
};

export { ui };
