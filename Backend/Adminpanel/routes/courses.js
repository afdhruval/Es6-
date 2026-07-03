const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { isAuthenticated } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', isAuthenticated, courseController.index);
router.get('/create', isAuthenticated, courseController.getCreate);
router.post('/create', isAuthenticated, upload.single('thumbnail'), courseController.postCreate);
router.get('/:id/edit', isAuthenticated, courseController.getEdit);
router.post('/:id', isAuthenticated, upload.single('thumbnail'), courseController.handleAction);

module.exports = router;
