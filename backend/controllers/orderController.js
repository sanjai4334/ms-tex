const Order = require('../models/Order');

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

const createOrder = async (req, res) => {
  try {
    const { user, items, subtotal, shipping, total } = req.body;

    if (!user || !items || !subtotal || !total) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newOrder = new Order({
      user,
      orderItems: items,
      shippingPrice: shipping || 0,
      totalPrice: total,
      taxPrice: 0, // Adjust if tax is applicable
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Failed to create order' });
  }
};

module.exports = {
  getOrders,
  createOrder,
};
