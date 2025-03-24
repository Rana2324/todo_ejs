import authService from '../services/authService.js';
import { logger } from '../utils/logger.js';

// JWT cookie options
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

const authController = {
  // Register a new user
  register: async (req, res) => {
    try {
      const { username, email, password } = req.body;

      // Validate required fields
      if (!username || !email || !password) {
        return res.status(400).json({
          success: false,
          error: 'Username, email, and password are required',
        });
      }

      // Password length validation
      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          error: 'Password must be at least 6 characters',
        });
      }

      // Register user through service
      const { user, accessToken, refreshToken } = await authService.register({
        username,
        email,
        password,
      });

      // Set refresh token as HTTP-only cookie
      res.cookie('refreshToken', refreshToken, cookieOptions);

      // Return user info and access token (but not refresh token)
      res.status(201).json({
        success: true,
        data: {
          user,
          accessToken,
        },
      });
    } catch (error) {
      logger.error('Registration error:', error);
      const statusCode = error.message.includes('already exists') ? 409 : 500;
      res.status(statusCode).json({
        success: false,
        error: error.message || 'Registration failed',
      });
    }
  },

  // Login a user
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Validate required fields
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: 'Email and password are required',
        });
      }

      // Login user through service
      const { user, accessToken, refreshToken } = await authService.login(
        email,
        password
      );

      // Set refresh token as HTTP-only cookie
      res.cookie('refreshToken', refreshToken, cookieOptions);

      // Return user info and access token (but not refresh token)
      res.status(200).json({
        success: true,
        data: {
          user,
          accessToken,
        },
      });
    } catch (error) {
      logger.error('Login error:', error);
      res.status(401).json({
        success: false,
        error: error.message || 'Login failed',
      });
    }
  },

  // Refresh access token
  refreshToken: async (req, res) => {
    try {
      // Get refresh token from cookie
      const refreshToken = req.cookies.refreshToken;
      
      if (!refreshToken) {
        return res.status(401).json({
          success: false,
          error: 'Refresh token is required',
        });
      }

      // Refresh token through service
      const tokens = await authService.refreshToken(refreshToken);

      // Set new refresh token as HTTP-only cookie
      res.cookie('refreshToken', tokens.refreshToken, cookieOptions);

      // Return new access token
      res.status(200).json({
        success: true,
        data: {
          accessToken: tokens.accessToken,
        },
      });
    } catch (error) {
      logger.error('Token refresh error:', error);
      res.status(401).json({
        success: false,
        error: error.message || 'Token refresh failed',
      });
    }
  },

  // Logout a user
  logout: async (req, res) => {
    try {
      // Clear refresh token cookie
      res.clearCookie('refreshToken');

      // If user is authenticated, invalidate refresh token in the database
      if (req.user) {
        await authService.logout(req.user.id);
      }

      res.status(200).json({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (error) {
      logger.error('Logout error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Logout failed',
      });
    }
  },

  // Get current authenticated user
  getCurrentUser: async (req, res) => {
    try {
      // User should be set by auth middleware
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Not authenticated',
        });
      }

      // Get full user data (excluding password and refresh token)
      const user = await authService.getUserById(req.user.id);

      res.status(200).json({
        success: true,
        data: { user },
      });
    } catch (error) {
      logger.error('Get current user error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to get user data',
      });
    }
  },
};

export default authController;