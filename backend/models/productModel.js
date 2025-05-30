const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
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

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
