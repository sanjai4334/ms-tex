import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminNavbar from '../../components/AdminNavbar/AdminNavbar';
import ProductManagement from './ProductManagement';
import CustomerManagement from './CustomerManagement';
import AdminLogin from './AdminLogin';
import ProtectedRoute from '../../components/ProtectedRoute/ProtectedRoute';
import './admin.css';

function Admin() {
  return (
    <Routes>
      <Route path="login" element={<AdminLogin />} />
      <Route
        path="*"
        element={
          <ProtectedRoute>
            <AdminNavbar />
            <div className="admin-content">
              <Routes>
                <Route path="products" element={<ProductManagement />} />
                <Route path="customers" element={<CustomerManagement />} />
                <Route path="" element={<ProductManagement />} />
              </Routes>
            </div>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default Admin;