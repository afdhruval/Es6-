const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// GET /login
exports.getLogin = (req, res) => {
  res.render('auth/login', { layout: 'layouts/auth', title: 'Admin Login' });
};

// POST /login
exports.postLogin = async (req, res) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || !email.trim()) errors.push('Email is required.');
  if (!password) errors.push('Password is required.');

  if (errors.length) {
    req.flash('error', errors);
    return res.redirect('/login');
  }

  try {
    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (!admin) {
      req.flash('error', ['Invalid email or password.']);
      return res.redirect('/login');
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      req.flash('error', ['Invalid email or password.']);
      return res.redirect('/login');
    }

    req.session.admin = {
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      avatar: admin.avatar,
      role: admin.role
    };

    req.flash('success', [`Welcome back, ${admin.name}!`]);
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    req.flash('error', ['Something went wrong. Please try again.']);
    res.redirect('/login');
  }
};

// GET /logout
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) console.error(err);
    res.redirect('/login');
  });
};

// GET /forgot-password
exports.getForgotPassword = (req, res) => {
  res.render('auth/forgot-password', { layout: 'layouts/auth', title: 'Forgot Password' });
};

// POST /forgot-password
exports.postForgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email || !email.trim()) {
    req.flash('error', ['Email is required.']);
    return res.redirect('/forgot-password');
  }

  try {
    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (!admin) {
      req.flash('error', ['No admin account found with that email.']);
      return res.redirect('/forgot-password');
    }

    const token = crypto.randomBytes(32).toString('hex');
    admin.resetToken = token;
    admin.resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await admin.save({ validateBeforeSave: false });

    req.flash('success', [`Password reset token generated. Token: ${token} (Valid for 1 hour)`]);
    res.redirect('/forgot-password');
  } catch (err) {
    console.error(err);
    req.flash('error', ['Something went wrong.']);
    res.redirect('/forgot-password');
  }
};

// GET /reset-password/:token
exports.getResetPassword = async (req, res) => {
  const { token } = req.params;
  try {
    const admin = await Admin.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }
    });
    if (!admin) {
      req.flash('error', ['Invalid or expired reset token.']);
      return res.redirect('/forgot-password');
    }
    res.render('auth/reset-password', { layout: 'layouts/auth', title: 'Reset Password', token });
  } catch (err) {
    req.flash('error', ['Something went wrong.']);
    res.redirect('/forgot-password');
  }
};

// POST /reset-password/:token
exports.postResetPassword = async (req, res) => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;
  const errors = [];

  if (!password || password.length < 6) errors.push('Password must be at least 6 characters.');
  if (password !== confirmPassword) errors.push('Passwords do not match.');

  if (errors.length) {
    req.flash('error', errors);
    return res.redirect(`/reset-password/${token}`);
  }

  try {
    const admin = await Admin.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }
    });
    if (!admin) {
      req.flash('error', ['Invalid or expired reset token.']);
      return res.redirect('/forgot-password');
    }

    admin.password = password;
    admin.resetToken = null;
    admin.resetTokenExpiry = null;
    await admin.save();

    req.flash('success', ['Password reset successfully. Please login.']);
    res.redirect('/login');
  } catch (err) {
    req.flash('error', ['Something went wrong.']);
    res.redirect('/forgot-password');
  }
};
