const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Login route (semua user)
router.post('/login', authController.login);

// Register Guru route (hanya admin yang bisa)
// router.post('/register-guru', verifyToken, isAdmin, authController.registerGuru);

module.exports = router;
