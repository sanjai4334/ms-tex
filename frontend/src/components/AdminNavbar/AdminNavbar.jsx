import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './AdminNavbar.css';

function AdminNavbar({ onLogout }) {
  const location = useLocation();
  
  return (
    <nav className="admin-navbar">
      <div className="admin-navbar-brand">
        <h1>MS-TEX Admin</h1>
      </div>
      
      <ul className="admin-nav-links">
        <li>
          <Link 
            to="/admin/products" 
            className={location.pathname.includes('/admin/products') ? 'active' : ''}
          >
            <i className="fas fa-box"></i>
            <span>Products</span>
          </Link>
        </li>
        <li>
          <Link 
            to="/admin/workers" 
            className={location.pathname.includes('/admin/workers') ? 'active' : ''}
          >
            <i className="fas fa-users"></i>
            <span>Workers</span>
          </Link>
        </li>
        <li>
          <Link 
            to="/admin/orders" 
            className={location.pathname.includes('/admin/orders') ? 'active' : ''}
          >
            <i className="fas fa-shopping-cart"></i>
            <span>Orders</span>
          </Link>
        </li>
        <li>
          <Link 
            to="/admin/reports" 
            className={location.pathname.includes('/admin/reports') ? 'active' : ''}
          >
            <i className="fas fa-chart-bar"></i>
            <span>Reports</span>
          </Link>
        </li>
      </ul>
      
      <div className="admin-navbar-footer">
        <button className="logout-btn" onClick={onLogout}>
          <i className="fas fa-sign-out-alt"></i>
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
}

export default AdminNavbar;
