// Custom session-based flash middleware (no connect-flash)
module.exports = (req, res, next) => {
  res.locals.flash = req.session.flash || {};
  req.session.flash = {};
  
  // Helper to set flash messages
  req.flash = (type, message) => {
    if (!req.session.flash) req.session.flash = {};
    if (!req.session.flash[type]) req.session.flash[type] = [];
    if (Array.isArray(message)) {
      req.session.flash[type] = [...(req.session.flash[type] || []), ...message];
    } else {
      req.session.flash[type].push(message);
    }
  };
  
  next();
};
