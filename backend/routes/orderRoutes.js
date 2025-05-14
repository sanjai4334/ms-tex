const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController'); // Add this line
const { getOrders } = require('../controllers/orderController');
const protect = require('../middleware/authMiddleware');

// Protected route to get all orders
router.route('/').get(protect, getOrders);
// Ensure this route is defined
router.post('/', protect, orderController.createOrder);

module.exports = router;
