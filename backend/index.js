const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config({ path: '../.env' }); // Load env vars

const app = express();
const PORT = process.env.PORT || 5000;

// Enhanced CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Request logging middleware (enhanced)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`, 
    req.body && Object.keys(req.body).length > 0 ? `| Body: ${JSON.stringify(req.body)}` : ''
  );
  next();
});

// Connect to MongoDB (unchanged)
connectDB();

// Enhanced JSON parser with size limit
app.use(express.json({ limit: '10kb' }));

// Rate limiting middleware for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

// Test route (unchanged)
app.get('/', (req, res) => {
  res.send('Backend is running! 🚀');
});

// Product routes (unchanged)
const productRoutes = require('./routes/productRoutes');
app.use('/api/products', productRoutes);

// NEW: Auth routes with rate limiting
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authLimiter, authRoutes);

// NEW: Error handling middleware (should be last)
app.use((err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] Error: ${err.message}`);
  console.error(err.stack);
  
  res.status(err.statusCode || 500).json({
    success: false,
    error: process.env.NODE_ENV === 'development' ? err.message : 'Server error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Frontend URL: ${process.env.FRONTEND_URL || 'Not configured'}`);
});
