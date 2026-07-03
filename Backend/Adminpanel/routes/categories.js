const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { isAuthenticated } = require('../middleware/auth');

router.get('/', isAuthenticated, categoryController.index);
router.post('/create', isAuthenticated, categoryController.create);
router.post('/:id', isAuthenticated, categoryController.handleAction);

module.exports = router;
