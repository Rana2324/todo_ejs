import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { logger } from './logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../..');

// Function to create directory if it doesn't exist
const createDirIfNotExists = dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Function to copy file
const copyFile = (src, dest) => {
  fs.copyFileSync(src, dest);
  logger.info(`Copied ${src} to ${dest}`);
};

// Create necessary directories
const directories = [
  'src/api',
  'src/config',
  'src/controllers',
  'src/middleware',
  'src/models',
  'src/public/css',
  'src/public/js',
  'src/public/images',
  'src/routes',
  'src/services',
  'src/utils',
  'src/views/partials',
];

directories.forEach(dir => {
  const fullPath = path.join(rootDir, dir);
  createDirIfNotExists(fullPath);
});

// Move backend files
const backendFiles = [
  ['backend/models/Todo.js', 'src/models/Todo.js'],
  ['backend/services/todoService.js', 'src/services/todoService.js'],
  ['backend/controllers/todoController.js', 'src/controllers/todoController.js'],
  ['backend/routes/todoRoutes.js', 'src/routes/todoRoutes.js'],
  ['backend/middleware/errorHandler.js', 'src/middleware/errorHandler.js'],
];

// Move frontend files
const frontendFiles = [
  ['frontend/public/js/index.js', 'src/public/js/index.js'],
  ['frontend/public/js/add.js', 'src/public/js/add.js'],
  ['frontend/public/js/edit.js', 'src/public/js/edit.js'],
  ['frontend/public/css/style.css', 'src/public/css/style.css'],
  ['frontend/views/index.ejs', 'src/views/index.ejs'],
  ['frontend/views/add.ejs', 'src/views/add.ejs'],
  ['frontend/views/edit.ejs', 'src/views/edit.ejs'],
  ['frontend/views/error.ejs', 'src/views/error.ejs'],
  ['frontend/views/partials/header.ejs', 'src/views/partials/header.ejs'],
  ['frontend/views/partials/footer.ejs', 'src/views/partials/footer.ejs'],
  ['frontend/views/partials/messages.ejs', 'src/views/partials/messages.ejs'],
];

// Copy all files
[...backendFiles, ...frontendFiles].forEach(([src, dest]) => {
  const srcPath = path.join(rootDir, src);
  const destPath = path.join(rootDir, dest);
  if (fs.existsSync(srcPath)) {
    createDirIfNotExists(path.dirname(destPath));
    copyFile(srcPath, destPath);
  }
});

logger.info('File migration completed!');
