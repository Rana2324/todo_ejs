import express from 'express';
import todoRoutes from './todoRoutes.js';
import pageRoutes from './pageRoutes.js';

const router = express.Router();

//api routes
router.use('/api/todos', todoRoutes);

//page routes
router.use('/', pageRoutes);

export default router;