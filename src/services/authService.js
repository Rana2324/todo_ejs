import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { logger } from '../utils/logger.js';

// Helper function to generate JWT tokens
const generateTokens = (userId, role) => {
  try {
    // Access token - short lived (15 minutes)
    const accessToken = jwt.sign(
      { id: userId, role },
      process.env.JWT_ACCESS_SECRET || 'access-secret-key',
      { expiresIn: '15m' }
    );

    // Refresh token - longer lived (7 days)
    const refreshToken = jwt.sign(
      { id: userId, role },
      process.env.JWT_REFRESH_SECRET || 'refresh-secret-key',
      { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
  } catch (error) {
    logger.error('Error generating tokens:', error);
    throw new Error('Failed to generate authentication tokens');
  }
};

const authService = {
  // Register a new user
  register: async (userData) => {
    try {
      // Check if user already exists with the same email
      const existingUser = await User.findOne({ 
        $or: [
          { email: userData.email.toLowerCase() },
          { username: userData.username }
        ]
      });

      if (existingUser) {
        if (existingUser.email === userData.email.toLowerCase()) {
          throw new Error('User with this email already exists');
        } else {
          throw new Error('Username is already taken');
        }
      }

      // Create new user
      const user = new User({
        username: userData.username,
        email: userData.email.toLowerCase(),
        password: userData.password,
        role: userData.role || 'user'
      });

      // Save user to database
      await user.save();

      // Generate tokens
      const { accessToken, refreshToken } = generateTokens(user._id, user.role);

      // Update user with refresh token
      user.refreshToken = refreshToken;
      await user.save();

      // Return tokens and user info (without password)
      const userResponse = {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      };

      return { user: userResponse, accessToken, refreshToken };
    } catch (error) {
      logger.error('Error in register service:', error);
      throw new Error(error.message || 'Registration failed');
    }
  },

  // Login a user
  login: async (email, password) => {
    try {
      // Find user by email
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        throw new Error('Invalid credentials');
      }

      // Check password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        throw new Error('Invalid credentials');
      }

      // Generate tokens
      const { accessToken, refreshToken } = generateTokens(user._id, user.role);

      // Update refresh token in database
      user.refreshToken = refreshToken;
      await user.save();

      // Return tokens and user info (without password)
      const userResponse = {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      };

      return { user: userResponse, accessToken, refreshToken };
    } catch (error) {
      logger.error('Error in login service:', error);
      throw new Error(error.message || 'Login failed');
    }
  },

  // Refresh access token using refresh token
  refreshToken: async (refreshToken) => {
    try {
      if (!refreshToken) {
        throw new Error('Refresh token is required');
      }

      // Verify refresh token
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'refresh-secret-key');
      
      // Find user with matching refresh token
      const user = await User.findOne({ 
        _id: decoded.id,
        refreshToken: refreshToken 
      });

      if (!user) {
        throw new Error('Invalid refresh token');
      }

      // Generate new tokens
      const newTokens = generateTokens(user._id, user.role);

      // Update refresh token in database
      user.refreshToken = newTokens.refreshToken;
      await user.save();

      return newTokens;
    } catch (error) {
      logger.error('Error in refreshToken service:', error);
      throw new Error('Invalid or expired refresh token');
    }
  },

  // Logout a user (invalidate refresh token)
  logout: async (userId) => {
    try {
      // Find user and clear refresh token
      await User.findByIdAndUpdate(userId, { refreshToken: null });
      return true;
    } catch (error) {
      logger.error('Error in logout service:', error);
      throw new Error('Logout failed');
    }
  },

  // Get user by ID
  getUserById: async (userId) => {
    try {
      const user = await User.findById(userId).select('-password -refreshToken');
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      logger.error('Error in getUserById service:', error);
      throw new Error('Failed to get user');
    }
  }
};

export default authService;