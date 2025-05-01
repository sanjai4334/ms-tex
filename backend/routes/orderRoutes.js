const express = require('express');
const { createOrder, getUserOrders, getOrderById, updateOrderStatus } = require('../controllers/orderController');
const router = express.Router();

// Create order
router.post('/:userId', createOrder);

// Get all orders for a user
router.get('/:userId', getUserOrders);

// Get specific order by orderId
router.get('/:userId/order/:orderId', getOrderById);

// Update order status
router.put('/:userId/order/:orderId/status', updateOrderStatus);

module.exports = router;
