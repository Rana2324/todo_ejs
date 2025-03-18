# Todo App with EJS

A modern todo application built with Node.js, Express, MongoDB, and EJS templating engine.

## Features

- Create, Read, Update, and Delete todos
- Mark todos as completed/pending
- Modern UI with Tailwind CSS
- Real-time updates with client-side JavaScript
- Flash messages for user feedback
- Responsive design
- Error handling and logging
- Form validation

## Tech Stack

- **Backend**
  - Node.js
  - Express.js
  - MongoDB with Mongoose
  - EJS (Embedded JavaScript templates)

- **Frontend**
  - Tailwind CSS (via CDN)
  - Font Awesome icons
  - DataTables
  - ES6+ JavaScript

- **Development Tools**
  - Morgan (HTTP request logging)
  - Winston (Application logging)
  - Nodemon (Development server)
  - ESLint (Code linting)

## Project Structure

```
src/
├── config/          # Configuration files
├── controllers/     # Request handlers
├── middleware/      # Custom middleware
├── models/         # Database models
├── public/         # Static files
│   ├── css/       # Custom styles
│   ├── js/        # Client-side scripts
│   └── images/    # Static images
├── routes/         # Route definitions
│   ├── todoRoutes.js  # API routes
│   └── pageRoutes.js  # Page routes
├── services/       # Business logic
├── utils/          # Helper functions
└── views/          # EJS templates
    └── partials/   # Reusable components
```

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/todo-app-ejs.git
   cd todo-app-ejs
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/todo_app
   NODE_ENV=development
   ```

4. Start MongoDB:
   ```bash
   # Windows
   mongod
   # macOS/Linux
   sudo service mongod start
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Visit `http://localhost:5000` in your browser

## API Endpoints

- **GET /todos** - Get all todos
- **GET /todos/:id** - Get a specific todo
- **POST /todos** - Create a new todo
- **PUT /todos/:id** - Update a todo
- **PUT/PATCH /todos/:id/toggle** - Toggle todo status
- **DELETE /todos/:id** - Delete a todo

## Page Routes

- **GET /** - Home page (todo list)
- **GET /add** - Add todo page
- **GET /edit/:id** - Edit todo page

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


# todo_ejs
