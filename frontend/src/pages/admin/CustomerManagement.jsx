import React, { useState, useEffect } from 'react';
import api from './api/axios';
import './admin.css';

function CustomerManagement() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/customers');
      setCustomers(Array.isArray(response.data) ? response.data : []);
      setError(null);
    } catch (error) {
      console.error('Error fetching customers:', error);
      setCustomers([]);
      setError('Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-container">
      <h2>Customer Management</h2>
      {loading && <p>Loading customers...</p>}
      {error && <p className="error-message">{error}</p>}
      {!loading && !error && (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Orders</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer._id}>
                <td>{customer.name}</td>
                <td>{customer.email}</td>
                <td>{customer.orders?.length || 0}</td>
                <td>
                  <button>View Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default CustomerManagement;