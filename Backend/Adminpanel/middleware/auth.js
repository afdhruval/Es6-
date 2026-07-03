// Auth guard middleware
exports.isAuthenticated = (req, res, next) => {
  if (req.session && req.session.admin) {
    return next();
  }
  req.session.flash = { error: ['Please login to continue.'] };
  res.redirect('/login');
};

// Already logged in guard (redirect to dashboard if session exists)
exports.isGuest = (req, res, next) => {
  if (req.session && req.session.admin) {
    return res.redirect('/dashboard');
  }
  next();
};
