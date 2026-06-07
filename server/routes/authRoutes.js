const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Public authentication paths
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected profile info path
router.get('/profile', protect, getUserProfile);

module.exports = router;
