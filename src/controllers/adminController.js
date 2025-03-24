import User from '../models/User.js';
import Todo from '../models/Todo.js';
import { logger } from '../utils/logger.js';

const adminController = {
  /**
   * Render admin dashboard
   */
  getDashboard: async (req, res) => {
    try {
      res.render('admin/dashboard', {
        title: 'Admin Dashboard',
      });
    } catch (error) {
      logger.error('Error rendering admin dashboard:', error);
      req.flash('error', 'Failed to load admin dashboard');
      res.redirect('/');
    }
  },

  /**
   * Get user statistics (API route)
   */
  getUserStats: async (req, res) => {
    try {
      const userCount = await User.countDocuments();
      const adminCount = await User.countDocuments({ role: 'admin' });
      const regularUserCount = await User.countDocuments({ role: 'user' });

      res.json({
        success: true,
        data: {
          total: userCount,
          admins: adminCount,
          regularUsers: regularUserCount
        }
      });
    } catch (error) {
      logger.error('Error getting user stats:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get user statistics'
      });
    }
  },

  /**
   * Get todo statistics (API route)
   */
  getTodoStats: async (req, res) => {
    try {
      const totalTodos = await Todo.countDocuments();
      const completedTodos = await Todo.countDocuments({ status: 'completed' });
      const pendingTodos = await Todo.countDocuments({ status: 'pending' });

      res.json({
        success: true,
        data: {
          total: totalTodos,
          completed: completedTodos,
          pending: pendingTodos
        }
      });
    } catch (error) {
      logger.error('Error getting todo stats:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get todo statistics'
      });
    }
  },

  /**
   * Get all users (API route)
   */
  getAllUsers: async (req, res) => {
    try {
      // Get all users but exclude sensitive data
      const users = await User.find().select('-password -refreshToken');
      
      res.json({
        success: true,
        data: users
      });
    } catch (error) {
      logger.error('Error getting all users:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get users'
      });
    }
  },

  /**
   * Update user role (API route)
   */
  updateUserRole: async (req, res) => {
    try {
      const { userId, role } = req.body;
      
      if (!userId || !role) {
        return res.status(400).json({
          success: false,
          error: 'User ID and role are required'
        });
      }
      
      if (!['user', 'admin'].includes(role)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid role. Must be "user" or "admin"'
        });
      }
      
      const user = await User.findByIdAndUpdate(
        userId,
        { role },
        { new: true }
      ).select('-password -refreshToken');
      
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }
      
      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      logger.error('Error updating user role:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update user role'
      });
    }
  }
};

export default adminController;