const express = require('express');
const router = express.Router();
const { getUserData, saveUserData, getUserProfile } = require('../controllers/userController');
const protect = require('../middleware/authMiddleware');

router.get('/data', protect, getUserData);
router.post('/data', protect, saveUserData);
router.get('/profile', protect, getUserProfile);

module.exports = router;
