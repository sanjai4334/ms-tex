const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const protect = require('../middleware/authMiddleware');

// Ensure this route is defined
router.post('/', protect, orderController.createOrder);
router.get('/user', protect, orderController.getOrdersByUser);

module.exports = router;
