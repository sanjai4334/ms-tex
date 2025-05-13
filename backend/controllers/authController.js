const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const jwt = require('jsonwebtoken');

const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '7d'
  });
};

exports.registerUser = asyncHandler(async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({ 
        message: 'User already exists with this email address'
      });
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      password
    });

    const refreshToken = generateRefreshToken(user._id);
    user.refreshToken = refreshToken;
    await user.save();

    res.status(201).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      token: generateToken(user._id),
      refreshToken
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      message: error.message || 'Error during registration'
    });
  }
});

exports.loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.comparePassword(password))) {
    const refreshToken = generateRefreshToken(user._id);
    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      token: generateToken(user._id),
      refreshToken
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// Refresh token endpoint
exports.refreshToken = asyncHandler(async (req, res) => {
  const { token } = req.body;
  if (!token) {
    res.status(401);
    throw new Error('No refresh token provided');
  }

  const user = await User.findOne({ refreshToken: token });
  if (!user) {
    res.status(403);
    throw new Error('Invalid refresh token');
  }

  jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
    if (err || user._id.toString() !== decoded.id) {
      res.status(403);
      throw new Error('Invalid refresh token');
    }

    const accessToken = generateToken(user._id);
    res.json({ token: accessToken });
  });
});

// Logout endpoint
exports.logoutUser = asyncHandler(async (req, res) => {
  const { token } = req.body;
  if (!token) {
    res.status(400);
    throw new Error('No refresh token provided');
  }

  const user = await User.findOne({ refreshToken: token });
  if (user) {
    user.refreshToken = null;
    await user.save();
  }

  res.json({ message: 'Logged out successfully' });
});
