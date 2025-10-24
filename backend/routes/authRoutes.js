const express = require('express');
const router = express.Router();
const { registerStudent, login, createManager, getAllManagers } = require('../controllers/authController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

// Public routes
router.post('/register/student', registerStudent);
router.post('/login', login);

// Admin only routes
router.post('/manager', authenticate, authorizeAdmin, createManager);
router.get('/managers', authenticate, authorizeAdmin, getAllManagers);

module.exports = router;