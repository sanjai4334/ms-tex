const express = require('express');
const router = express.Router();
const { getUserData, saveUserData } = require('../controllers/userController');
const protect = require('../middleware/authMiddleware');

router.get('/data', protect, getUserData);
router.post('/data', protect, saveUserData);

module.exports = router;
