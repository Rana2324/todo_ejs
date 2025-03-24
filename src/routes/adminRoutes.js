import express from 'express';
import adminController from '../controllers/adminController.js';
import { authMiddleware, roleMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authMiddleware);
router.use(roleMiddleware(['admin']));

// Admin Dashboard
router.get('/', adminController.getDashboard);

// API endpoints for admin panel
router.get('/api/users/stats', adminController.getUserStats);
router.get('/api/todos/stats', adminController.getTodoStats);
router.get('/api/users', adminController.getAllUsers);
router.put('/api/users/role', adminController.updateUserRole);

export default router;