import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import AdminNavbar from '../../components/AdminNavbar/AdminNavbar';
import ProductManagement from './ProductManagement';
import WorkersManagement from './WorkersManagement';
import AdminLogin from './AdminLogin';
import './admin.css';

function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin is authenticated
    const checkAuth = () => {
      const adminToken = localStorage.getItem('adminToken');
      setIsAuthenticated(!!adminToken);
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    navigate('/admin/login');
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="login" element={<AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} />} />
        <Route path="*" element={<Navigate to="/admin/login" replace />} />
      </Routes>
    );
  }

  return (
    <div className="admin-container">
      <AdminNavbar onLogout={handleLogout} />
      <main className="admin-main-content">
        <Routes>
          <Route path="products" element={<ProductManagement />} />
          <Route path="workers" element={<WorkersManagement />} />
          <Route path="orders" element={<div>Orders Management (Coming Soon)</div>} />
          <Route path="reports" element={<div>Reports (Coming Soon)</div>} />
          <Route path="*" element={<Navigate to="/admin/products" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default Admin;
