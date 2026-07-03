const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { isGuest } = require('../middleware/auth');

// Redirect root to dashboard or login
router.get('/', (req, res) => {
  if (req.session && req.session.admin) return res.redirect('/dashboard');
  res.redirect('/login');
});

router.get('/login', isGuest, authController.getLogin);
router.post('/login', isGuest, authController.postLogin);
router.get('/logout', authController.logout);
router.get('/forgot-password', isGuest, authController.getForgotPassword);
router.post('/forgot-password', isGuest, authController.postForgotPassword);
router.get('/reset-password/:token', authController.getResetPassword);
router.post('/reset-password/:token', authController.postResetPassword);

module.exports = router;
