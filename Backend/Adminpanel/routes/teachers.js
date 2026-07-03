const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const { isAuthenticated } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', isAuthenticated, teacherController.index);
router.get('/create', isAuthenticated, teacherController.getCreate);
router.post('/create', isAuthenticated, upload.single('avatar'), teacherController.postCreate);
router.get('/:id', isAuthenticated, teacherController.show);
router.get('/:id/edit', isAuthenticated, teacherController.getEdit);
router.post('/:id', isAuthenticated, upload.single('avatar'), teacherController.handleAction);

module.exports = router;
