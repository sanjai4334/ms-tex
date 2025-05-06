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
// @desc    Create new product
const createProduct = async (req, res) => {
  console.log("POST /api/products - Creating product with data:", req.body);
  try {
    // Ensure stock is a non-negative number
    if (req.body.stock < 0) {
      return res.status(400).json({ message: "Stock cannot be negative" });
    }

    // Generate numeric id
    const id = (await Product.countDocuments()) + 1;

    const newProduct = new Product({
      ...req.body,
      id, // Set the id field
    });

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
  console.log('PUT /api/products/:id - Request params:', req.params);
  console.log('PUT /api/products/:id - Request body:', req.body);
  try {
    const updatedProduct = await Product.findOneAndUpdate(
      { id: parseInt(req.params.id) }, // Query by numeric id
      req.body,
      { new: true }
    );
    if (!updatedProduct) {
      console.log('Product not found for id:', req.params.id);
      return res.status(404).json({ message: "Product not found" });
    }
    console.log('Updated product:', updatedProduct);
    res.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete product
const deleteProduct = async (req, res) => {
  console.log('DELETE /api/products/:id - Deleting product with id:', req.params.id);
  try {
    const deletedProduct = await Product.findOneAndDelete({
      id: parseInt(req.params.id),
    });
    if (!deletedProduct) {
      console.log('Product not found for id:', req.params.id);
      return res.status(404).json({ message: "Product not found" });
    }
    console.log('Product deleted successfully:', deletedProduct);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: error.message });
  }
};

// Add a new controller method to update stock
const updateStock = async (req, res) => {
  console.log('PATCH /api/products/:id/stock - Updating stock:', req.body);
  try {
    const { stock } = req.body;
    if (stock < 0) {
      return res.status(400).json({ message: "Stock cannot be negative" });
    }

    const product = await Product.findOneAndUpdate(
      { id: parseInt(req.params.id) },
      { stock },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Error updating stock:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock
};
