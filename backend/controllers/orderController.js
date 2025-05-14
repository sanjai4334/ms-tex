const mongoose = require('mongoose');
const Order = require('../models/Order');

const createOrder = async (req, res) => {
  try {
    const { user, items, subtotal, shipping, total } = req.body;

    // Validate required fields
    if (!user || !user.firstName || !user.lastName || !user.email) {
      console.error('Validation Error: Missing user data', req.body);
      return res.status(400).json({ message: 'Missing user data' });
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
      console.error('Validation Error: Missing order items', req.body);
      return res.status(400).json({ message: 'Missing order items' });
    }
    if (subtotal == null || shipping == null || total == null) {
      console.error('Validation Error: Missing order totals', req.body);
      return res.status(400).json({ message: 'Missing order totals' });
    }

    // Convert productId to ObjectId using new keyword
    const processedItems = items.map(item => ({
      ...item,
      productId: new mongoose.Types.ObjectId(item.productId),
    }));

    const order = new Order({
      user,
      items: processedItems,
      subtotal,
      shipping,
      total,
    });

    await order.save();

    console.log('Order created successfully:', order);
    res.status(201).json({ message: 'Order created successfully', orderId: order._id });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createOrder
};
