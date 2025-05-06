import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../store/slices/productSlice';
import ProductCard from '../../components/Card/Card'; // Adjust path to your ProductCard component
import './ProductManagement.css';

function ProductManagement() {
  const dispatch = useDispatch();
  const { items: products, status, error } = useSelector((state) => state.products);

  // State for form, pagination, and filtering
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    stock: '',
    image: '',
    rating: { rate: '', count: '' },
  });
  const [formError, setFormError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState({
    title: '',
    category: '',
    minPrice: '',
    maxPrice: '',
  });
  const productsPerPage = 10;

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
    setCurrentPage(1);
  }, [status, dispatch, filter]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('rating.')) {
      const ratingField = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        rating: { ...prev.rating, [ratingField]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    setFormError(null);
  };

  // Handle filter input changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  // Clear filter inputs
  const clearFilters = () => {
    setFilter({
      title: '',
      category: '',
      minPrice: '',
      maxPrice: '',
    });
  };

  // Handle form submission for adding or updating a product
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const productData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        price: parseFloat(formData.price) || 0,
        stock: parseInt(formData.stock) || 0,
        image: formData.image || '',
        rating: {
          rate: parseFloat(formData.rating.rate) || 0,
          count: parseInt(formData.rating.count) || 0,
        },
      };

      // Client-side validation
      if (!productData.title) {
        throw new Error('Title is required');
      }
      if (!productData.description) {
        throw new Error('Description is required');
      }
      if (!productData.category) {
        throw new Error('Category is required');
      }
      if (productData.price <= 0) {
        throw new Error('Price must be greater than 0');
      }
      if (productData.stock < 0) {
        throw new Error('Stock cannot be negative');
      }
      if (productData.rating.rate < 0 || productData.rating.rate > 5) {
        throw new Error('Rating must be between 0 and 5');
      }
      if (productData.rating.count < 0) {
        throw new Error('Rating count cannot be negative');
      }

      console.log('Submitting product data:', productData);

      let response;
      if (currentProduct) {
        if (!currentProduct.id) {
          throw new Error('Product ID is missing');
        }
        console.log('Updating product with ID:', currentProduct.id);
        response = await fetch(`${apiUrl}/products/${currentProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData),
        });
      } else {
        console.log('Creating new product');
        response = await fetch(`${apiUrl}/products`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API error:', errorData);
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const savedProduct = await response.json();
      console.log('API response:', savedProduct);

      dispatch(fetchProducts());
      setFormData({
        title: '',
        description: '',
        category: '',
        price: '',
        stock: '',
        image: '',
        rating: { rate: '', count: '' },
      });
      setCurrentProduct(null);
      setIsFormOpen(false);
    } catch (err) {
      console.error('Error saving product:', err);
      setFormError(err.message || 'Failed to save product. Please try again.');
    }
  };

  // Handle edit button click
  const handleEdit = (product) => {
    console.log('Editing product:', product);
    setCurrentProduct(product);
    setFormData({
      title: product.title || '',
      description: product.description || '',
      category: product.category || '',
      price: product.price ? product.price.toString() : '',
      stock: product.stock ? product.stock.toString() : '',
      image: product.image || '',
      rating: {
        rate: product.rating?.rate ? product.rating.rate.toString() : '',
        count: product.rating?.count ? product.rating.count.toString() : '',
      },
    });
    setIsFormOpen(true);
    setFormError(null);
  };

  // Handle delete button click
  const handleDelete = async (id) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      console.log('Deleting product with ID:', id);
      const response = await fetch(`${apiUrl}/products/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      dispatch(fetchProducts());
    } catch (err) {
      console.error('Error deleting product:', err);
      setFormError(err.message || 'Failed to delete product. Please try again.');
    }
  };

  // Filter products based on filter state
  const filteredProducts = Array.isArray(products) ? products.filter((product) => {
    const titleMatch = filter.title
      ? product.title.toLowerCase().includes(filter.title.toLowerCase())
      : true;
    const categoryMatch = filter.category
      ? product.category.toLowerCase().includes(filter.category.toLowerCase())
      : true;
    const minPriceMatch = filter.minPrice
      ? product.price >= parseFloat(filter.minPrice)
      : true;
    const maxPriceMatch = filter.maxPrice
      ? product.price <= parseFloat(filter.maxPrice)
      : true;
    return titleMatch && categoryMatch && minPriceMatch && maxPriceMatch;
  }) : [];

  // Calculate pagination data
  const totalProducts = filteredProducts.length;
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Create preview product for ProductCard
  const previewProduct = {
    id: currentProduct ? currentProduct.id : 0, // Temporary ID for preview
    title: formData.title || 'Product Title',
    price: parseFloat(formData.price) || 0,
    stock: parseInt(formData.stock) || 0,
    image: formData.image || 'https://placehold.co/280x250/png?text=Product+Image',
    rating: {
      rate: parseFloat(formData.rating.rate) || 0,
      count: parseInt(formData.rating.count) || 0,
    },
    description: formData.description || 'Product description',
    category: formData.category || 'Category',
  };

  if (status === 'loading') return <div className="loading">Loading products...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="product-management">
      <h2>Product Management</h2>

      {/* Filter Bar */}
      <div className="filter-bar">
        <h3>Filter Products</h3>
        <div className="filter-inputs">
          <div>
            <label>Title:</label>
            <input
              type="text"
              name="title"
              value={filter.title}
              onChange={handleFilterChange}
              placeholder="Search by title"
            />
          </div>
          <div>
            <label>Category:</label>
            <input
              type="text"
              name="category"
              value={filter.category}
              onChange={handleFilterChange}
              placeholder="Search by category"
            />
          </div>
          <div>
            <label>Min Price:</label>
            <input
              type="number"
              name="minPrice"
              value={filter.minPrice}
              onChange={handleFilterChange}
              placeholder="Min price"
              step="0.01"
              min="0"
            />
          </div>
          <div>
            <label>Max Price:</label>
            <input
              type="number"
              name="maxPrice"
              value={filter.maxPrice}
              onChange={handleFilterChange}
              placeholder="Max price"
              step="0.01"
              min="0"
            />
          </div>
          <button onClick={clearFilters} className="clear-filter-btn">
            Clear Filters
          </button>
        </div>
      </div>

      <div className="product-actions">
        <button
          className="add-product-btn"
          onClick={() => {
            setCurrentProduct(null);
            setFormData({
              title: '',
              description: '',
              category: '',
              price: '',
              stock: '',
              image: '',
              rating: { rate: '', count: '' },
            });
            setIsFormOpen(true);
            setFormError(null);
          }}
        >
          Add New Product
        </button>
      </div>

      {/* Product Form with Preview */}
      {isFormOpen && (
        <div className="product-form-container">
          <div className="product-form">
            <h3>{currentProduct ? 'Edit Product' : 'Add Product'}</h3>
            {formError && <div className="error">{formError}</div>}
            <form onSubmit={handleSubmit}>
              <div>
                <label>Title:</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label>Description:</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label>Category:</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label>Price:</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0.01"
                  required
                />
              </div>
              <div>
                <label>Stock:</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  min="0"
                  required
                />
              </div>
              <div>
                <label>Image URL:</label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label>Rating (Rate):</label>
                <input
                  type="number"
                  name="rating.rate"
                  value={formData.rating.rate}
                  onChange={handleInputChange}
                  step="0.1"
                  min="0"
                  max="5"
                  required
                />
              </div>
              <div>
                <label>Rating (Count):</label>
                <input
                  type="number"
                  name="rating.count"
                  value={formData.rating.count}
                  onChange={handleInputChange}
                  min="0"
                  required
                />
              </div>
              <button type="submit">{currentProduct ? 'Update' : 'Add'} Product</button>
              <button type="button" onClick={() => setIsFormOpen(false)}>
                Cancel
              </button>
            </form>
          </div>
          <div className="product-preview">
            <h3>Preview</h3>
            <ProductCard product={previewProduct} />
          </div>
        </div>
      )}

      {/* Product Table */}
      {currentProducts.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <>
          <table className="products-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Image</th>
                <th>Title</th>
                <th>Description</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Rating</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.map((product) => (
                <tr key={product._id || product.id}>
                  <td>{product.id}</td>
                  <td>
                    {product.image && (
                      <img
                        src={product.image}
                        alt={product.title}
                        className="product-thumbnail"
                      />
                    )}
                  </td>
                  <td>{product.title}</td>
                  <td>{product.description?.substring(0, 50)}...</td>
                  <td>{product.category}</td>
                  <td>₹{product.price?.toFixed(2)}</td>
                  <td>{product.stock}</td>
                  <td>
                    {product.rating?.rate} ({product.rating?.count})
                  </td>
                  <td className="actions">
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(product)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(product.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="pagination-btn"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="pagination-btn"
            >
              Next
            </button>
            <span className="pagination-info">
              Page {currentPage} of {totalPages} ({totalProducts} products)
            </span>
          </div>
        </>
      )}
    </div>
  );
}

export default ProductManagement;