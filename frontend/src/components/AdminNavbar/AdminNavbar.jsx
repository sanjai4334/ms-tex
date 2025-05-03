import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './AdminNavbar.css';

function AdminNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const getBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter(path => path);
    return paths.map((path, index) => ({
      name: path.charAt(0).toUpperCase() + path.slice(1),
      path: '/' + paths.slice(0, index + 1).join('/')
    }));
  };

  return (
    <div className="admin-layout">
      <div className="admin-sidebar">
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
        </div>
        <nav className="sidebar-nav">
          <Link to="/admin/products" className={location.pathname.includes('/products') ? 'active' : ''}>
            <i className="fas fa-box"></i>
            <span>Products</span>
          </Link>
          <Link to="/admin/customers" className={location.pathname.includes('/customers') ? 'active' : ''}>
            <i className="fas fa-users"></i>
            <span>Customers</span>
          </Link>
          <button onClick={handleLogout} className="logout-btn">
            <i className="fas fa-sign-out-alt"></i>
            <span>Logout</span>
          </button>
        </nav>
      </div>
      <div className="admin-main">
        <div className="breadcrumb">
          {getBreadcrumbs().map((crumb, index) => (
            <span key={crumb.path}>
              {index > 0 && <span className="separator">/</span>}
              <Link to={crumb.path}>{crumb.name}</Link>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminNavbar;