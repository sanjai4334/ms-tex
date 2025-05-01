const Product = require("../models/productModel");

// @desc    Get all products
const getAllProducts = async (req, res) => {
  console.log("GET /api/products - Fetching all products");
  try {
    const products = await Product.find();
    console.log(`Found ${products.length} products`);
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single product by ID
const getProductById = async (req, res) => {
  console.log('GET /api/products/:id - Fetching product with id:', req.params.id);
  try {
    const product = await Product.findOne({ id: parseInt(req.params.id) });
    if (!product) {
      console.log('Product not found with id:', req.params.id);
      return res.status(404).json({ message: 'Product not found' });
    }
    console.log('Product found:', product);
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new product
const createProduct = async (req, res) => {
  console.log("POST /api/products - Creating product with data:", req.body);
  try {
    const newProduct = new Product(req.body);

    // Validate product before saving
    const validationError = newProduct.validateSync();
    if (validationError) {
      console.error("Validation error:", validationError);
      return res.status(400).json({ message: validationError.message });
    }

    const savedProduct = await newProduct.save();
    console.log("Product saved successfully:", savedProduct);
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("Error creating product:", {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update existing product
const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedProduct)
      return res.status(404).json({ message: "Product not found" });
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete product
const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct)
      return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
