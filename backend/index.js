// Load environment variables
require('dotenv').config({ path: '../.env' }); // Adjust path if needed

const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// CORS setup (frontend URL from .env)
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:9999',
  credentials: true,
}));

// Body parser with limit
app.use(express.json({ limit: '10kb' }));

// Request logger (dev-friendly)
app.use((req, res, next) => {
  console.log(
    `${new Date().toISOString()} - ${req.method} ${req.originalUrl}`,
    req.body && Object.keys(req.body).length ? `| Body: ${JSON.stringify(req.body)}` : ''
  );
  next();
});

// Rate limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100, // max 100 requests
  message: 'Too many requests from this IP, please try again later.',
});

// Routes
app.get('/', (req, res) => {
  res.send('Backend is running! 🚀');
});

// Product routes
const productRoutes = require('./routes/productRoutes');
app.use('/api/products', productRoutes);

// Auth routes (with rate limiter)
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authLimiter, authRoutes);

// Worker routes (add this for your WorkersManagement frontend)
const workerRoutes = require('./routes/workerRoutes');
app.use('/api/workers', workerRoutes);

// Error handler (should be last)
app.use((err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] Error: ${err.message}`);
  console.error(err.stack);

  res.status(err.statusCode || 500).json({
    success: false,
    error: process.env.NODE_ENV === 'development' ? err.message : 'Server error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'Not configured'}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
