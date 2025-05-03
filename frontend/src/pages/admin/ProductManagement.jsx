import React, { useState, useEffect, useMemo } from 'react';
import api from './api/axios';
import './admin.css';

const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/150'; // Fallback image URL

const ProductPreviewCard = ({ data }) => (
  <div className="preview-card">
    <div className="preview-image-container">
      <img 
        src={data.image || PLACEHOLDER_IMAGE}
        alt="Preview"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = PLACEHOLDER_IMAGE;
        }}
      />
      <div className="preview-stock">
        {data.stock > 0 ? `${data.stock} in stock` : 'Out of stock'}
      </div>
    </div>
    <div className="preview-content">
      <h3>{data.title || 'Product Title'}</h3>
      <p className="preview-description">{data.description || 'Product Description'}</p>
      <div className="preview-details">
        <p className="preview-price">₹{data.price || '0'}</p>
        <p className="preview-rating">⭐ {data.rating?.rate || '0'} ({data.rating?.count || '0'})</p>
      </div>
      <p className="preview-category">{data.category || 'Category'}</p>
    </div>
  </div>
);

function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const limit = 10;

  const [formData, setFormData] = useState({
    id: '',
    title: '',
    price: '',
    description: '',
    category: '',
    image: '',
    rating: {
      rate: 0,
      count: 0
    },
    stock: ''
  });

  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  // Update the fetchProducts function to maintain previous data during loading
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/products?page=${currentPage}&limit=${limit}`);
      if (response.data) {
        setProducts(Array.isArray(response.data.products) ? response.data.products : []);
        setTotalPages(Math.ceil(response.data.total / limit));
        setError(null);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to fetch products');
      // Don't clear products on error to maintain current view
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/products', formData);
      fetchProducts();
      setFormData({
        id: '',
        title: '',
        price: '',
        description: '',
        category: '',
        image: '',
        rating: {
          rate: 0,
          count: 0
        },
        stock: ''
      });
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {
        title: formData.title,
        price: Number(formData.price),
        description: formData.description,
        category: formData.category,
        image: formData.image,
        stock: Number(formData.stock),
        rating: {
          rate: Number(formData.rating.rate),
          count: Number(formData.rating.count)
        }
      };

      // Use MongoDB _id if available, fallback to numeric id
      const productId = selectedProduct._id || selectedProduct.id;
      
      console.log('Updating product:', productId, 'with data:', updatedData);
      
      const response = await api.put(`/api/products/${productId}`, updatedData);
      
      if (response.data) {
        console.log('Product updated successfully:', response.data);
        await fetchProducts();
        setSelectedProduct(null);
        setFormData({
          id: '',
          title: '',
          price: '',
          description: '',
          category: '',
          image: '',
          rating: {
            rate: 0,
            count: 0
          },
          stock: ''
        });
        setError(null);
      }
    } catch (error) {
      console.error('Error updating product:', error.response?.data || error.message);
      setError(error.response?.data?.message || 'Failed to update product');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/api/products/${id}`);
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const Pagination = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  
    return (
      <div className="pagination-container">
        <button 
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        
        <div className="page-numbers">
          {pageNumbers.map(number => (
            <button
              key={number}
              onClick={() => setCurrentPage(number)}
              className={currentPage === number ? 'active' : ''}
            >
              {number}
            </button>
          ))}
        </div>
  
        <div className="page-info">
          Page {currentPage} of {totalPages}
        </div>
        
        <button 
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    );
  };

  // Memoize the products table to prevent unnecessary re-renders
  const ProductsTable = useMemo(() => (
    <div className="admin-table">
      <table>
        <thead>
          <tr>
            <th>Image</th>
            <th>Title</th>
            <th>Price</th>
            <th>Category</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id || product.id}>
              <td>
                <img 
                  src={product.image} 
                  alt={product.title} 
                  loading="lazy" // Add lazy loading for images
                  style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = PLACEHOLDER_IMAGE;
                  }}
                />
              </td>
              <td>{product.title}</td>
              <td>₹{product.price}</td>
              <td>{product.category}</td>
              <td>{product.stock}</td>
              <td className="action-buttons">
                <button 
                  className="btn btn-primary"
                  onClick={() => {
                    setSelectedProduct(product);
                    setFormData(product);
                  }}
                >
                  Edit
                </button>
                <button 
                  className="btn btn-danger"
                  onClick={() => handleDelete(product._id || product.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ), [products]); // Only re-render when products change

  // Update the return statement to include a grid layout
  return (
    <div className="admin-container">
      <h2>Product Management</h2>
      
      <div className="admin-layout">
        <form className="admin-form" onSubmit={selectedProduct ? handleUpdate : handleCreate}>
          <div className="form-group">
            <label>Product Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Price</label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Category</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Stock</label>
            <input
              type="number"
              value={formData.stock}
              onChange={(e) => setFormData({...formData, stock: e.target.value})}
              required
            />
          </div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Image URL</label>
            <input
              type="text"
              value={formData.image}
              onChange={(e) => setFormData({...formData, image: e.target.value})}
              required
            />
            <img 
              src={formData.image || PLACEHOLDER_IMAGE}
              alt="Preview"
              style={{ 
                width: '100px', 
                height: '100px', 
                objectFit: 'cover',
                marginTop: '10px',
                border: '1px solid #ddd'
              }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = PLACEHOLDER_IMAGE;
              }}
            />
          </div>
          {/* Add image upload functionality to your form */}
          <div className="form-group">
            <label>Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files[0];
                if (file) {
                  const formData = new FormData();
                  formData.append('image', file);
                  try {
                    const response = await api.post('/api/upload', formData);
                    setFormData(prev => ({
                      ...prev,
                      image: response.data.imageUrl
                    }));
                  } catch (error) {
                    console.error('Error uploading image:', error);
                  }
                }
              }}
            />
          </div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <button type="submit" className="btn btn-primary">
              {selectedProduct ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>

        <div className="preview-section">
          <h3>Preview</h3>
          <ProductPreviewCard data={formData} />
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}
      
      {/* Show loading overlay instead of replacing content */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner">Loading...</div>
        </div>
      )}
      
      {/* Always render the table, it will be covered by overlay when loading */}
      {ProductsTable}
      
      <Pagination />
    </div>
  );
}

export default ProductManagement;