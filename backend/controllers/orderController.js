const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');

// Create an order from the user's cart
const createOrder = async (req, res) => {
  const { userId } = req.params;

  try {
    // Fetch the user's cart
    const cart = await Cart.findOne({ userId }).populate('items.productId');
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Create the order
    const order = new Order({
      userId,
      items: cart.items,
      totalPrice: cart.items.reduce((total, item) => total + item.productId.price * item.quantity, 0),
      status: 'Pending',  // Order status can be Pending, Shipped, Delivered
    });

    // Save the order
    await order.save();

    // Optionally, clear the user's cart after creating the order
    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all orders for a user
const getUserOrders = async (req, res) => {
  const { userId } = req.params;

  try {
    const orders = await Order.find({ userId }).populate('items.productId');
    if (!orders) {
      return res.status(404).json({ message: 'No orders found' });
    }
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a specific order by orderId
const getOrderById = async (req, res) => {
  const { userId, orderId } = req.params;

  try {
    const order = await Order.findOne({ _id: orderId, userId }).populate('items.productId');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update order status (e.g., 'Pending' -> 'Shipped')
const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    await order.save();

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
};
