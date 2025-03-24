import express from 'express';
import todoService from '../services/todoService.js';
import { logger } from '../utils/logger.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * Middleware to check if user is authenticated
 */
const isAuthenticated = (req, res, next) => {
  // Check for auth cookie or session
  const token = req.cookies.refreshToken;
  if (!token) {
    return res.redirect('/login');
  }
  next();
};

/**
 * Home page route
 */
router.get('/', isAuthenticated, (req, res) => {
    res.render('index', {
      title: 'Home',
      todos: [], // Will be populated by client-side API call
    });
});

/**
 * Add todo page route
 */
router.get('/add', isAuthenticated, (req, res) => {
  res.render('add', { title: 'Add Todo' });
});

/**
 * Edit todo page route
 */
router.get('/edit/:id', isAuthenticated, async (req, res) => {
  try {
    // Use todoService directly to fetch todo data
    const todo = await todoService.getTodoById(req.params.id);

    if (!todo) {
      req.flash('error', 'Todo not found');
      return res.redirect('/');
    }

    res.render('edit', {
      title: 'Edit Todo',
      todo: todo,
    });
  } catch (error) {
    logger.error('Error fetching todo for edit:', error);
    req.flash('error', 'Failed to load todo');
    res.redirect('/');
  }
});

/**
 * Login page route
 */
router.get('/login', (req, res) => {
  res.render('login', { title: 'Login' });
});

/**
 * Register page route
 */
router.get('/register', (req, res) => {
  res.render('register', { title: 'Register' });
});

export default router;
