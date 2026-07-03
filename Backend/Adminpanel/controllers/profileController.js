const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');

// GET /profile
exports.getProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.session.admin._id);
    res.render('profile/index', { title: 'My Profile', admin });
  } catch (err) {
    req.flash('error', ['Failed to load profile.']);
    res.redirect('/dashboard');
  }
};

// POST /profile
exports.handleAction = async (req, res) => {
  const { _action } = req.body;

  try {
    const admin = await Admin.findById(req.session.admin._id);

    if (_action === 'update-profile') {
      const { name, email } = req.body;
      const errors = [];
      if (!name || !name.trim()) errors.push('Name is required.');
      if (!email || !email.includes('@')) errors.push('Valid email required.');
      if (errors.length) {
        req.flash('error', errors);
        return res.redirect('/profile');
      }

      admin.name = name.trim();
      admin.email = email.toLowerCase().trim();
      if (req.file) admin.avatar = `/uploads/${req.file.filename}`;
      await admin.save();

      // Update session
      req.session.admin = {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        avatar: admin.avatar,
        role: admin.role
      };

      req.flash('success', ['Profile updated successfully.']);
      return res.redirect('/profile');

    } else if (_action === 'change-password') {
      const { currentPassword, newPassword, confirmPassword } = req.body;
      const errors = [];
      if (!currentPassword) errors.push('Current password is required.');
      if (!newPassword || newPassword.length < 6) errors.push('New password must be at least 6 characters.');
      if (newPassword !== confirmPassword) errors.push('New passwords do not match.');
      if (errors.length) {
        req.flash('error', errors);
        return res.redirect('/profile');
      }

      const isMatch = await admin.comparePassword(currentPassword);
      if (!isMatch) {
        req.flash('error', ['Current password is incorrect.']);
        return res.redirect('/profile');
      }

      admin.password = newPassword;
      await admin.save();
      req.flash('success', ['Password changed successfully.']);
      return res.redirect('/profile');
    }

    req.flash('error', ['Unknown action.']);
    res.redirect('/profile');
  } catch (err) {
    console.error(err);
    req.flash('error', ['Action failed.']);
    res.redirect('/profile');
  }
};
