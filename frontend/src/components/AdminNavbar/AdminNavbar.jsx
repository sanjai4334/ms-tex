import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './AdminNavbar.css';

const breadcrumbNames = {
  admin: 'Admin',
  products: 'Products',
  customers: 'Customers',
  login: 'Login',
};

function AdminNavbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login', { replace: true });
  };

  const getBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter((path) => path);
    return paths.map((path, index) => {
      const fullPath = '/' + paths.slice(0, index + 1).join('/');
      const displayName = breadcrumbNames[path] || path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ');
      return { name: displayName, path: fullPath };
    });
  };

  const isActiveLink = (path) => location.pathname === path || location.pathname.startsWith(`${path}/`);

  return (
    <div className="admin-navbar">
      <div className="admin-sidebar" role="navigation" aria-label="Admin navigation">
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
        </div>
        <nav className="sidebar-nav">
          <Link
            to="/admin/products"
            className={isActiveLink('/admin/products') ? 'active' : ''}
            aria-current={isActiveLink('/admin/products') ? 'page' : undefined}
          >
            <i className="fas fa-box" aria-hidden="true"></i>
            <span>Products</span>
          </Link>
          <Link
            to="/admin/customers"
            className={isActiveLink('/admin/customers') ? 'active' : ''}
            aria-current={isActiveLink('/admin/customers') ? 'page' : undefined}
          >
            <i className="fas fa-users" aria-hidden="true"></i>
            <span>Customers</span>
          </Link>
          <button onClick={handleLogout} className="logout-btn" aria-label="Log out">
            <i className="fas fa-sign-out-alt" aria-hidden="true"></i>
            <span>Logout</span>
          </button>
        </nav>
      </div>
      <nav className="breadcrumb" aria-label="Breadcrumb">
        {getBreadcrumbs().map((crumb, index) => (
          <span key={crumb.path}>
            {index > 0 && <span className="separator" aria-hidden="true">/</span>}
            <Link to={crumb.path} aria-current={location.pathname === crumb.path ? 'page' : undefined}>
              {crumb.name}
            </Link>
          </span>
        ))}
      </nav>
    </div>
  );
}

export default AdminNavbar;