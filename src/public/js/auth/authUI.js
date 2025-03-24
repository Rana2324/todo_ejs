import { authService } from '../services/authService.js';
import { showToast } from '../utils/toast.js';

// DOM Elements
const guestNav = document.getElementById('guest-nav');
const userNav = document.getElementById('user-nav');
const usernameDisplay = document.getElementById('username-display');
const userMenuButton = document.getElementById('user-menu-button');
const userDropdown = document.getElementById('user-dropdown');
const adminLink = document.getElementById('admin-link');
const logoutButton = document.getElementById('logout-button');

/**
 * Initialize authentication UI
 */
const initAuthUI = () => {
  // Check if user is authenticated
  if (authService.isAuthenticated()) {
    showAuthenticatedUI();
  } else {
    showGuestUI();
  }

  // Add event listeners
  userMenuButton?.addEventListener('click', toggleUserDropdown);
  logoutButton?.addEventListener('click', handleLogout);
  
  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (userDropdown?.classList.contains('hidden')) return;
    if (!userNav.contains(e.target)) {
      userDropdown?.classList.add('hidden');
    }
  });
};

/**
 * Show authenticated user UI
 */
const showAuthenticatedUI = () => {
  const user = authService.getUser();
  
  if (!user) {
    showGuestUI();
    return;
  }

  // Update username display
  if (usernameDisplay) {
    usernameDisplay.textContent = user.username;
  }

  // Show admin link if user is admin
  if (adminLink && user.role === 'admin') {
    adminLink.classList.remove('hidden');
  }

  // Show user nav, hide guest nav
  guestNav?.classList.add('hidden');
  userNav?.classList.remove('hidden');
};

/**
 * Show guest (unauthenticated) UI
 */
const showGuestUI = () => {
  // Show guest nav, hide user nav
  guestNav?.classList.remove('hidden');
  userNav?.classList.add('hidden');
  
  // Hide admin link
  adminLink?.classList.add('hidden');
};

/**
 * Toggle the user dropdown menu
 */
const toggleUserDropdown = () => {
  userDropdown?.classList.toggle('hidden');
};

/**
 * Handle user logout
 * @param {Event} e - Click event
 */
const handleLogout = async (e) => {
  e.preventDefault();
  
  try {
    // Call logout API
    await authService.logout();
    
    // Show success message
    showToast('Logged out successfully', 'success');
    
    // Update UI
    showGuestUI();
    
    // Redirect to home after a short delay
    setTimeout(() => {
      window.location.href = '/';
    }, 1000);
  } catch (error) {
    console.error('Logout error:', error);
    showToast('Error logging out', 'error');
  }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', initAuthUI);

export { initAuthUI, showAuthenticatedUI, showGuestUI };