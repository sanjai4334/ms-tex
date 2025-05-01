const express = require('express');
const router = express.Router();
const {
  getCartItems,
  addToCart,
  removeFromCart,
  updateCartItem,
} = require('../controllers/cartController');

// Get cart items for a user
router.get('/:userId', getCartItems);

// Add product to cart
router.post('/:userId', addToCart);

// Remove product from cart
router.delete('/:userId/:productId', removeFromCart);

// Update quantity of product in cart
router.put('/:userId/:productId', updateCartItem);

module.exports = router;
