import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminNavbar from '../../components/AdminNavbar/AdminNavbar';
import ProductManagement from './ProductManagement';
import './admin.css';

function Admin() {
  return (
    <div className="admin-container">
      <AdminNavbar />
      <main className="admin-main-content">
        <Routes>
          <Route path="products" element={<ProductManagement />} />
          {/* Add other admin routes here */}
        </Routes>
      </main>
    </div>
  );
}

export default Admin;