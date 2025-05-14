import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import api from '../../api/axios';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user || !user.email || !user.firstName || !user.lastName) {
        setError('User details are incomplete');
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('/orders/user', {
          params: {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
          },
        });
        setOrders(response.data);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  return (
    <div className="profile-page">
      <h2>Welcome, {user?.firstName} {user?.lastName}</h2>
      <p style={{ textAlign: 'left' }}>Email: {user?.email}</p>

      <h3>Your Orders</h3>
      {loading ? (
        <p>Loading orders...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '10px', borderBottom: '1px solid #ddd' }}>Date</th>
              <th style={{ textAlign: 'right', padding: '10px', borderBottom: '1px solid #ddd' }}>Total</th>
              <th style={{ textAlign: 'left', padding: '10px', borderBottom: '1px solid #ddd' }}>Items</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td style={{ textAlign: 'right', padding: '10px', borderBottom: '1px solid #ddd' }}>
                  ₹{order.total.toLocaleString('en-IN')}
                </td>
                <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                  <ul style={{ margin: 0, paddingLeft: '20px' }}>
                    {order.items.map((item, index) => (
                      <li key={index} style={{ marginBottom: '5px' }}>
                        <strong>{item.title}</strong> - {item.quantity} x ₹{item.price.toLocaleString('en-IN')}
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Profile;
