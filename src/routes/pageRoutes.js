import express from 'express';
import todoService from '../services/todoService.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

/**
 * Home page route
 */
router.get('/', (req, res) => {
    res.render('index', {
      title: 'Home',
    todos: [], // Will be populated by client-side API call
    });
});

/**
 * Add todo page route
 */
router.get('/add', (req, res) => {
  res.render('add', { title: 'Add Todo' });
});

/**
 * Edit todo page route
 */
router.get('/edit/:id', async (req, res) => {
  try {
    // Use todoService directly to fetch todo data
    const todo = await todoService.getTodoById(req.params.id);

    if (!todo) {
      req.flash('error_msg', 'Todo not found');
      return res.redirect('/');
    }

    res.render('edit', {
      title: 'Edit Todo',
      todo: todo,
    });
  } catch (error) {
    logger.error('Error fetching todo for edit:', error);
    req.flash('error_msg', 'Failed to load todo');
    res.redirect('/');
  }
});

export default router;
