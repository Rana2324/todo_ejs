import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger.js';
import User from '../models/User.js';

// Middleware to verify JWT token and attach user to request
export const authMiddleware = async (req, res, next) => {
  try {
    // Get the token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'No token provided',
      });
    }

    // Extract token from header
    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET || 'access-secret-key');
    
    // Find user by id
    const user = await User.findById(decoded.id).select('-password -refreshToken');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User not found',
      });
    }

    // Attach user to request object
    req.user = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    };
    
    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    
    // Check if token is expired
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token expired',
      });
    }
    
    return res.status(401).json({
      success: false,
      error: 'Not authorized',
    });
  }
};

// Role-based authorization middleware
export const roleMiddleware = (roles = []) => {
  // Convert single role to array if it's not
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    // Check if user exists (should be set by authMiddleware)
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Not authenticated',
      });
    }

    // Check if user role is included in the required roles
    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized - insufficient permissions',
      });
    }

    // User has required role
    next();
  };
};

// Middleware for checking Todo ownership
export const ownershipMiddleware = (model) => {
  return async (req, res, next) => {
    try {
      // Skip for admin users
      if (req.user.role === 'admin') {
        return next();
      }
      
      const resourceId = req.params.id;
      if (!resourceId) {
        return res.status(400).json({
          success: false,
          error: 'Resource ID is required',
        });
      }
      
      // Find the resource
      const resource = await model.findById(resourceId);
      
      if (!resource) {
        return res.status(404).json({
          success: false,
          error: 'Resource not found',
        });
      }
      
      // Check if user owns the resource
      // This assumes your resource has a 'user' or 'userId' field
      // You may need to adjust this based on your resource schema
      if (resource.user && resource.user.toString() !== req.user.id.toString()) {
        return res.status(403).json({
          success: false,
          error: 'Not authorized - you do not own this resource',
        });
      }
      
      next();
    } catch (error) {
      logger.error('Ownership check error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to verify resource ownership',
      });
    }
  };
};