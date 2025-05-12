const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String
  },
  category: {
    type: String
  },
  image: {
    type: String
  },
  rating: {
    rate: Number,
    count: Number
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  }
}, { timestamps: true });

// Pre-save middleware to auto-generate unique IDs
productSchema.pre('save', async function(next) {
  if (!this.id) {
    // If no ID is provided, find the highest existing ID and increment by 1
    const highestProduct = await this.constructor.findOne({}, {}, { sort: { id: -1 } });
    this.id = highestProduct ? highestProduct.id + 1 : 1;
  }
  next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;