const express = require('express');
const orderRoutes = require('./routes/orderRoutes');
const app = express();

app.use('/api/orders', orderRoutes); // Ensure this line is correct

const PORT = 9999;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});