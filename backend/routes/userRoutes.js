const express = require('express');
const router = express.Router();
const { getUserData, saveUserData, getUserProfile, clearCart } = require('../controllers/userController');
const protect = require('../middleware/authMiddleware');

router.get('/data', protect, getUserData);
router.post('/data', protect, saveUserData);
router.get('/profile', protect, getUserProfile);
router.post('/cart/clear', protect, clearCart);

module.exports = router;
