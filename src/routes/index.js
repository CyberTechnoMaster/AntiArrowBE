const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');
const adminController = require('../controllers/adminController');

router.post('/register', authController.register);
router.post('/login', authController.login);

router.get('/profile', authMiddleware, userController.getProfile);
router.patch('/progress', authMiddleware, userController.updateProgress);

// Admin Routes
router.get('/admin/users', authMiddleware, adminMiddleware, adminController.getAllUsers);

module.exports = router;
