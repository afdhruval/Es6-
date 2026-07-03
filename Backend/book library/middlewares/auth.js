const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    let token;
    
    // Check for token in cookies
    if (req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      req.flash('error_msg', 'Not authorized to access this route');
      return res.redirect('/auth/login');
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user still exists
    const user = await User.findById(decoded.id);
    if (!user) {
      req.flash('error_msg', 'User no longer exists');
      res.clearCookie('token');
      return res.redirect('/auth/login');
    }

    // Check if user is active
    if (!user.isActive) {
      req.flash('error_msg', 'Your account has been deactivated. Please contact admin.');
      res.clearCookie('token');
      return res.redirect('/auth/login');
    }

    req.user = user;
    next();
  } catch (error) {
    req.flash('error_msg', 'Not authorized to access this route');
    res.redirect('/auth/login');
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      req.flash('error_msg', 'Not authorized to perform this action');
      return res.redirect('back');
    }
    next();
  };
};

const checkUser = async (req, res, next) => {
  let token = req.cookies.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      req.user = user || null;
    } catch (error) {
      req.user = null;
    }
  } else {
    req.user = null;
  }
  next();
};

module.exports = { protect, authorize, checkUser };
