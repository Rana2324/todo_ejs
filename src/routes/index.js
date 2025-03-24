import express from 'express';
import todoRoutes from './todoRoutes.js';
import pageRoutes from './pageRoutes.js';
import authRoutes from './authRoutes.js';
import adminRoutes from './adminRoutes.js';

const router = express.Router();

// API routes
router.use('/api/todos', todoRoutes);
router.use('/api/auth', authRoutes);

// Admin routes
router.use('/admin', adminRoutes);

// Page routes
router.use('/', pageRoutes);

export default router;