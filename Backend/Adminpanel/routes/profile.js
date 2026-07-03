const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { isAuthenticated } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', isAuthenticated, profileController.getProfile);
router.post('/', isAuthenticated, upload.single('avatar'), profileController.handleAction);

module.exports = router;
