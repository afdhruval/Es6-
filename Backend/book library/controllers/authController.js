const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// Send token response
const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);

  const options = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    httpOnly: true
  };

  res.status(statusCode).cookie('token', token, options).redirect('/');
};

// @desc    Show login form
// @route   GET /auth/login
exports.getLogin = (req, res) => {
  if (req.cookies.token) {
    return res.redirect('/');
  }
  res.render('auth/login', { title: 'Login' });
};

// @desc    Show register form
// @route   GET /auth/register
exports.getRegister = (req, res) => {
  if (req.cookies.token) {
    return res.redirect('/');
  }
  res.render('auth/register', { title: 'Register' });
};

// @desc    Register user
// @route   POST /auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      req.flash('error_msg', 'Please fill in all fields');
      return res.redirect('/auth/register');
    }

    if (password !== confirmPassword) {
      req.flash('error_msg', 'Passwords do not match');
      return res.redirect('/auth/register');
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      req.flash('error_msg', 'Email is already registered');
      return res.redirect('/auth/register');
    }

    // Determine role (first user becomes admin)
    const count = await User.countDocuments();
    const role = count === 0 ? 'admin' : 'user';

    const user = await User.create({
      name,
      email,
      password,
      role
    });

    req.flash('success_msg', 'Registration successful. You are now logged in.');
    sendTokenResponse(user, 200, res);
  } catch (error) {
    req.flash('error_msg', 'Registration failed. Please try again.');
    res.redirect('/auth/register');
  }
};

// @desc    Login user
// @route   POST /auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      req.flash('error_msg', 'Please provide email and password');
      return res.redirect('/auth/login');
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      req.flash('error_msg', 'Invalid credentials');
      return res.redirect('/auth/login');
    }

    // Check if user is active
    if (!user.isActive) {
      req.flash('error_msg', 'Your account has been deactivated. Please contact admin.');
      return res.redirect('/auth/login');
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      req.flash('error_msg', 'Invalid credentials');
      return res.redirect('/auth/login');
    }

    req.flash('success_msg', 'Logged in successfully');
    sendTokenResponse(user, 200, res);
  } catch (error) {
    req.flash('error_msg', 'Login failed');
    res.redirect('/auth/login');
  }
};

// @desc    Logout user
// @route   GET /auth/logout
exports.logout = (req, res) => {
  res.clearCookie('token');
  req.flash('success_msg', 'Logged out successfully');
  res.redirect('/auth/login');
};
