const express = require('express');
const { getLogin, getRegister, register, login, logout } = require('../controllers/authController');

const router = express.Router();

router.get('/login', getLogin);
router.post('/login', login);

router.get('/register', getRegister);
router.post('/register', register);

router.get('/logout', logout);

module.exports = router;
