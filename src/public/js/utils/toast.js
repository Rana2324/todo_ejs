/**
 * Toast notification system
 */
class Toast {
  constructor() {
    this.container = document.getElementById('toast-container');
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'toast-container';
      this.container.className = 'fixed top-4 right-4 z-50';
      document.body.appendChild(this.container);
    }
  }

  show(message, type = 'info') {
    const toast = document.createElement('div');
    const colors = {
      success: 'bg-green-500',
      error: 'bg-red-500',
      warning: 'bg-yellow-500',
      info: 'bg-blue-500',
    };

    const icons = {
      success: 'fas fa-check-circle',
      error: 'fas fa-exclamation-circle',
      warning: 'fas fa-exclamation-triangle',
      info: 'fas fa-info-circle',
    };

    toast.className = `${colors[type]} text-white px-6 py-4 rounded-lg shadow-lg mb-4 flex items-center transition-all duration-300 transform translate-x-full opacity-0`;
    toast.innerHTML = `
            <i class="${icons[type]} mr-3"></i>
            <span class="flex-1">${message}</span>
            <button class="ml-4 hover:text-gray-200 focus:outline-none">
                <i class="fas fa-times"></i>
            </button>
        `;

    this.container.appendChild(toast);

    // Trigger animation
    setTimeout(() => {
      toast.classList.remove('translate-x-full', 'opacity-0');
    }, 10);

    // Add click handler to close button
    const closeButton = toast.querySelector('button');
    closeButton.addEventListener('click', () => this.hide(toast));

    // Auto-hide after 5 seconds
    setTimeout(() => this.hide(toast), 5000);
  }

  hide(toast) {
    toast.classList.add('translate-x-full', 'opacity-0');
    setTimeout(() => toast.remove(), 300);
  }
}

// Initialize toast instance
const toast = new Toast();

/**
 * Show a toast notification
 * @param {string} message - Message to display
 * @param {string} type - Type of notification (success, error, warning, info)
 */
export const showToast = (message, type = 'info') => {
  toast.show(message, type);
};

// Check for flash messages on page load
document.addEventListener('DOMContentLoaded', () => {
  const messages = {
    success: document.getElementById('success-msg'),
    error: document.getElementById('error-msg'),
    info: document.getElementById('info-msg'),
    warning: document.getElementById('warning-msg'),
  };

  Object.entries(messages).forEach(([type, element]) => {
    if (element && element.textContent) {
      showToast(element.textContent, type);
    }
  });
});
