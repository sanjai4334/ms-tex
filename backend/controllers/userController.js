const User = require('../models/User');

// @desc    Get user favorites and cart data
// @route   GET /user/data
// @access  Private
const getUserData = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('favorites')
      .populate({
        path: 'cart.product',
        model: 'Product'
      });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      favorites: user.favorites,
      cart: user.cart
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Save/update user favorites and cart data
// @route   POST /user/data
// @access  Private
const saveUserData = async (req, res) => {
  try {
    const { favorites, cart } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.favorites = favorites || [];
    user.cart = cart || [];
    await user.save();
    res.json({ message: 'User data saved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getUserData,
  saveUserData
};
