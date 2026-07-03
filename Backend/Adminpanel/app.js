require('dotenv').config();
const express = require('express');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const connectDB = require('./config/db');
const flashMiddleware = require('./middleware/flash');

// Connect to MongoDB
connectDB();

const app = express();

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layouts/main');
app.set('layout extractScripts', true);
app.set('layout extractStyles', true);

// Static Files
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session
app.use(session({
  secret: process.env.SESSION_SECRET || 'lms_secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Flash Middleware (custom session-based)
app.use(flashMiddleware);

// Global template variables
app.use((req, res, next) => {
  res.locals.currentUser = req.session.admin || null;
  res.locals.currentPath = req.path;
  next();
});

// Routes
app.use('/', require('./routes/auth'));
app.use('/dashboard', require('./routes/dashboard'));
app.use('/students', require('./routes/students'));
app.use('/teachers', require('./routes/teachers'));
app.use('/courses', require('./routes/courses'));
app.use('/categories', require('./routes/categories'));
app.use('/profile', require('./routes/profile'));

// 404 Handler
app.use((req, res) => {
  res.status(404).render('errors/404', { layout: 'layouts/main', title: 'Page Not Found' });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('errors/500', { layout: 'layouts/main', title: 'Server Error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 LMS Admin Panel running at http://localhost:${PORT}`);
});
