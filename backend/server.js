const express = require('express');
const orderRoutes = require('./routes/orderRoutes');
const app = express();

app.use('/api/orders', orderRoutes); // Ensure this line is present

// ...existing code...