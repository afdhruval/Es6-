const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { isAuthenticated } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', isAuthenticated, studentController.index);
router.get('/create', isAuthenticated, studentController.getCreate);
router.post('/create', isAuthenticated, upload.single('avatar'), studentController.postCreate);
router.get('/:id', isAuthenticated, studentController.show);
router.get('/:id/edit', isAuthenticated, studentController.getEdit);
router.post('/:id', isAuthenticated, upload.single('avatar'), studentController.handleAction);

module.exports = router;
