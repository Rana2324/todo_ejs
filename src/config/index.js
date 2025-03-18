import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

// ES Module dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const config = {
  // Server configuration
  server: {
    port: process.env.PORT || 5000, // Default port 5000
    env: process.env.NODE_ENV || 'development',
  },

  // Database configuration
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/todo_app',
  },

  // Session configuration
  session: {
    secret: process.env.SESSION_SECRET || 'todo-app-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  },

  // Paths configuration
  paths: {
    root: path.resolve(__dirname, '../..'),
    src: path.resolve(__dirname, '..'),
    views: path.resolve(__dirname, '../views'),
    public: path.resolve(__dirname, '../public'),
    logs: path.resolve(__dirname, '../../logs'),
  },

  // Logging configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.NODE_ENV === 'development' ? 'dev' : 'combined',
  },
};

export default config;
