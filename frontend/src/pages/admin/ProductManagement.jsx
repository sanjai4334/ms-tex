import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../store/slices/productSlice';
import ProductCard from '../../components/Card/Card';
import './ProductManagement.scss'; 
import { gsap } from 'gsap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ProductManagement() {
  const dispatch = useDispatch();
  const { items: products, status, error } = useSelector((state) => state.products);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
  const [dropdownStates, setDropdownStates] = useState({});
  const productsPerPage = 10;

  // Refs for GSAP animations
  const modalRef = useRef(null);
  const tableRef = useRef(null);
  const spinnerRef = useRef(null);
  const loadingRef = useRef(null);
  const dropdownRefs = useRef({});

  // Debounce filter state
  const [debouncedFilter, setDebouncedFilter] = useState(filter);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFilter(filter);
    }, 300);
    return () => clearTimeout(handler);
  }, [filter]);

  // Memoized filtered products
  const filteredProducts = useMemo(() => {
    return Array.isArray(products)
      ? products.filter((product) => {
          const titleMatch = debouncedFilter.title
            ? product.title.toLowerCase().includes(debouncedFilter.title.toLowerCase())
            : true;
          const categoryMatch = debouncedFilter.category
            ? product.category.toLowerCase().includes(debouncedFilter.category.toLowerCase())
            : true;
          const minPriceMatch = debouncedFilter.minPrice
            ? product.price >= parseFloat(debouncedFilter.minPrice)
            : true;
          const maxPriceMatch = debouncedFilter.maxPrice
            ? product.price <= parseFloat(debouncedFilter.maxPrice)
            : true;
          return titleMatch && categoryMatch && minPriceMatch && maxPriceMatch;
        })
      : [];
  }, [products, debouncedFilter]);

  const totalProducts = filteredProducts.length;
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = useMemo(
    () => filteredProducts.slice(startIndex, endIndex),
    [filteredProducts, startIndex, endIndex]
  );

  // Fetch products and reset page
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
    setCurrentPage(1);
  }, [status, dispatch]);

  // GSAP Animations for Loading
  useEffect(() => {
    if (status === 'loading' && spinnerRef.current && loadingRef.current) {
      gsap.to(spinnerRef.current.querySelectorAll('.ring'), {
        rotation: 360,
        repeat: -1,
        duration: 1.2,
        ease: 'linear',
      });
      gsap.fromTo(
        loadingRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.5, ease: 'power3.out' }
      );
    } else if (loadingRef.current) {
      gsap.to(loadingRef.current, {
        opacity: 0,
        scale: 0.8,
        duration: 0.5,
        ease: 'power3.in',
        onComplete: () => {
          loadingRef.current.style.display = 'none';
        },
      });
    }
  }, [status]);

  // GSAP Animations for Modal
  useEffect(() => {
    if (isModalOpen && modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.9, y: 50 },
        { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'power3.out' }
      );
      gsap.fromTo(
        modalRef.current.querySelector('.modal-backdrop'),
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: 'power3.out' }
      );
      gsap.from(modalRef.current.querySelectorAll('.product-form div'), {
        opacity: 0,
        y: 20,
        stagger: 0.1,
        duration: 0.6,
        ease: 'power3.out',
        delay: 0.2,
      });
    }
  }, [isModalOpen]);

  // GSAP Animations for Table
  useEffect(() => {
    if (tableRef.current && status === 'succeeded' && currentProducts.length > 0) {
      const rows = tableRef.current.querySelectorAll('tbody tr:not(.skeleton-row)');
      gsap.fromTo(
        rows,
        { opacity: 0, y: 20, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.1,
          duration: 0.6,
          ease: 'power4.out',
          onStart: () => {
            gsap.to(tableRef.current.querySelectorAll('.skeleton-row'), {
              opacity: 0,
              duration: 0.3,
              ease: 'power2.in',
            });
          },
        }
      );
    }
  }, [currentProducts, status]);

  // GSAP Animations for Dropdown
  useEffect(() => {
    Object.keys(dropdownStates).forEach((id) => {
      if (dropdownStates[id] && dropdownRefs.current[id]) {
        gsap.fromTo(
          dropdownRefs.current[id],
          { opacity: 0, scale: 0.95, y: -8 },
          { opacity: 1, scale: 1, y: 0, duration: 0.25, ease: 'back.out(1.4)' }
        );
      }
    });
  }, [dropdownStates]);

  // GSAP Animation for Menu Button Click
  useEffect(() => {
    const buttons = document.querySelectorAll('.menu-btn');
    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        gsap.to(button, {
          scale: 0.95,
          duration: 0.1,
          yoyo: true,
          repeat: 1,
          ease: 'power2.inOut',
        });
      });
    });
    return () => {
      buttons.forEach((button) => {
        button.removeEventListener('click', () => {});
      });
    };
  }, []);

  // Handle clicks outside dropdown to close all
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.actions')) {
        setDropdownStates({});
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const toggleDropdown = useCallback((productId) => {
    setDropdownStates((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  }, []);

  const handleInputChange = useCallback((e) => {
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
  }, []);

  const handleFilterChange = useCallback((e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilter({
      title: '',
      category: '',
      minPrice: '',
      maxPrice: '',
    });
  }, []);

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

      if (!productData.title) throw new Error('Title is required');
      if (!productData.description) throw new Error('Description is required');
      if (!productData.category) throw new Error('Category is required');
      if (productData.price <= 0) throw new Error('Price must be greater than 0');
      if (productData.stock < 0) throw new Error('Stock cannot be negative');
      if (productData.rating.rate < 0 || productData.rating.rate > 5)
        throw new Error('Rating must be between 0 and 5');
      if (productData.rating.count < 0) throw new Error('Rating count cannot be negative');

      let response;
      if (currentProduct) {
        if (!currentProduct.id) throw new Error('Product ID is missing');
        response = await fetch(`${apiUrl}/products/${currentProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData),
        });
      } else {
        response = await fetch(`${apiUrl}/products`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

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
      setIsModalOpen(false);
      toast.success(
        currentProduct ? 'Product updated successfully!' : 'Product added successfully!',
        {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
    } catch (err) {
      const errorMessage = err.message.includes('Duplicate product ID')
        ? 'A product with this ID already exists.'
        : err.message || 'Failed to save product.';
      setFormError(errorMessage);
      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleEdit = useCallback(
    (product) => {
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
      setIsModalOpen(true);
      setFormError(null);
      setDropdownStates({});
    },
    []
  );

  const handleDelete = useCallback(
    async (id) => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const response = await fetch(`${apiUrl}/products/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        dispatch(fetchProducts());
        setDropdownStates({});
        toast.success('Product deleted successfully!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } catch (err) {
        const errorMessage = err.message || 'Failed to delete product.';
        setFormError(errorMessage);
        toast.error(errorMessage, {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    },
    [dispatch]
  );

  const handlePageChange = useCallback((page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }, [totalPages]);

  const previewProduct = useMemo(
    () => ({
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
    }),
    [formData]
  );

  // Skeleton rows
  const renderSkeletonRows = () => {
    return Array(5).fill().map((_, index) => (
      <tr key={`skeleton-${index}`} className="skeleton-row">
        <td data-label="ID"></td>
        <td data-label="Image"><div className="product-thumbnail"></div></td>
        <td data-label="Title"></td>
        <td data-label="Description"></td>
        <td data-label="Category"></td>
        <td data-label="Price"></td>
        <td data-label="Stock"></td>
        <td data-label="Rating"></td>
        <td data-label="Actions" className="actions">
          <button className="menu-btn">
            <i className="fas fa-ellipsis-vertical"></i>
          </button>
        </td>
      </tr>
    ));
  };

  if (status === 'loading') {
    return (
      <div className="loading" ref={loadingRef}>
        <div className="spinner" ref={spinnerRef}>
          <div className="ring"></div>
          <div className="ring"></div>
        </div>
        <span className="loading-text">Loading Products...</span>
      </div>
    );
  }

  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="product-management">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <h2>Product Management</h2>

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
            setIsModalOpen(true);
            setFormError(null);
          }}
        >
          Add New Product
        </button>
      </div>

      {isModalOpen && (
        <div className="modal" ref={modalRef}>
          <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}></div>
          <div className="modal-content">
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
                  <div className="form-buttons">
                    <button type="submit">{currentProduct ? 'Update' : 'Add'} Product</button>
                    <button type="button" onClick={() => setIsModalOpen(false)}>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
              <div className="product-preview">
                <h3>Preview</h3>
                <ProductCard product={previewProduct} />
              </div>
            </div>
          </div>
        </div>
      )}

      {currentProducts.length === 0 && status !== 'loading' ? (
        <p>No products found.</p>
      ) : (
        <>
          <table className="products-table" ref={tableRef}>
            <thead>
              <tr>
                <th data-label="ID">ID</th>
                <th data-label="Image">Image</th>
                <th data-label="Title">Title</th>
                <th data-label="Description">Description</th>
                <th data-label="Category">Category</th>
                <th data-label="Price">Price</th>
                <th data-label="Stock">Stock</th>
                <th data-label="Rating">Rating</th>
                <th data-label="Actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {status === 'loading' ? renderSkeletonRows() : currentProducts.map((product) => (
                <tr key={product._id || product.id}>
                  <td data-label="ID">{product.id}</td>
                  <td data-label="Image">
                    {product.image && (
                      <img
                        src={product.image}
                        alt={product.title}
                        className="product-thumbnail"
                      />
                    )}
                  </td>
                  <td data-label="Title">{product.title}</td>
                  <td data-label="Description">{product.description?.substring(0, 50)}...</td>
                  <td data-label="Category">{product.category}</td>
                  <td data-label="Price">₹{product.price?.toFixed(2)}</td>
                  <td data-label="Stock">{product.stock}</td>
                  <td data-label="Rating">
                    {product.rating?.rate} ({product.rating?.count})
                  </td>
                  <td data-label="Actions" className="actions">
                    <button
                      className="menu-btn"
                      onClick={() => toggleDropdown(product._id || product.id)}
                    >
                      <i className="fas fa-ellipsis-vertical"></i>
                    </button>
                    {dropdownStates[product._id || product.id] && (
                      <div
                        className="dropdown-menu"
                        ref={(el) => (dropdownRefs.current[product._id || product.id] = el)}
                      >
                        <button onClick={() => handleEdit(product)}>
                          <i className="fas fa-edit"></i> Edit
                        </button>
                        <button className="delete" onClick={() => handleDelete(product.id)}>
                          <i className="fas fa-trash"></i> Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

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
  );}

export default ProductManagement;
