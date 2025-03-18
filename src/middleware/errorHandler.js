import { logger } from '../utils/logger.js';

/**
 * Handle 404 errors
 */
export const notFoundHandler = (req, res) => {
  const isApiRequest = req.xhr || req.headers.accept?.includes('json');

  if (isApiRequest) {
    res.status(404).json({
      success: false,
      error: 'Resource not found',
    });
  } else {
    res.status(404).render('error', {
      title: '404 Not Found',
      message: 'The page you are looking for does not exist.',
    });
  }
};

/**
 * Handle all other errors
 */
export const errorHandler = (err, req, res) => {
  // Log the error
  logger.error('Error:', err);

  // Set status code
  const statusCode = err.statusCode || 500;
  const isApiRequest = req.xhr || req.headers.accept?.includes('json');

  if (isApiRequest) {
    res.status(statusCode).json({
      success: false,
      error: err.message || 'Internal Server Error',
    });
  } else {
    res.status(statusCode).render('error', {
      title: `${statusCode} Error`,
      message:
        process.env.NODE_ENV === 'development'
          ? err.message
          : 'Something went wrong. Please try again later.',
    });
  }
};
