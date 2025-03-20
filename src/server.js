import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import { fileURLToPath } from 'url';
import path from 'path';
import dotenv from 'dotenv';
import session from 'express-session';
import flash from 'connect-flash';

import  router  from './routes/index.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { logger } from './utils/logger.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Get directory path for ES modules
const __filename = fileURLToPath(import.meta.url);
const rootDir = path.dirname(path.dirname(__filename));

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(rootDir, 'src', 'public')));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    secure: process.env.NODE_ENV === 'production',
  },
}));

// Flash messages
app.use(flash());

// Global variables for views
app.use((req, res, next) => {
  res.locals.messages = {
    success: req.flash('success'),
    error: req.flash('error'),
    info: req.flash('info')
  };
  next();
});

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(rootDir, 'src', 'views'));

// Routes

app.use('/', router);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/todo_app');
    logger.info(`Connected to MongoDB at ${process.env.MONGODB_URI || 'mongodb://localhost:27017/todo_app'}`);

    app.listen(PORT, () => {
      logger.info(`Server running in ${process.env.NODE_ENV} mode on http://localhost:${PORT}`);
      logger.debug('Debug logging enabled');
    });
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    logger.info('Retrying MongoDB connection in 5 seconds...');
  }
};

connectDB();
