import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { toast } from 'react-toastify';
import './OrdersManagement.scss';

function OrdersManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const adminToken = localStorage.getItem('adminToken');
      const config = {
        headers: {
          Authorization: `Bearer ${adminToken}`
        }
      };
      const { data } = await axios.get('/api/orders', config);
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error(error.response?.data?.message || 'Failed to load orders data');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        const adminToken = localStorage.getItem('adminToken');
        const config = {
          headers: {
            Authorization: `Bearer ${adminToken}`
          }
        };
        await axios.delete(`/api/orders/${orderId}`, config);
        toast.success('Order deleted successfully');
        fetchOrders();
      } catch (error) {
        console.error('Error deleting order:', error);
        toast.error(error.response?.data?.message || 'Failed to delete order');
      }
    }
  };

  const handleMarkCompleted = async (orderId) => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      const config = {
        headers: {
          Authorization: `Bearer ${adminToken}`
        }
      };
      await axios.put(`/api/orders/${orderId}/complete`, {}, config);
      toast.success('Order marked as completed');
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error(error.response?.data?.message || 'Failed to update order status');
    }
  };

  return (
    <div className="orders-management">
      <h2>Orders Management</h2>
      {loading ? (
        <div className="loading">Loading orders data...</div>
      ) : (
        <>
          {!Array.isArray(orders) || orders.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            <div className="orders-list">
              {orders.map((order) => (
                <div key={order._id} className={`order-card${order.status === 'Completed' ? ' completed' : ''}`}>
                  {order.status === 'Completed' && (
                    <div className="completed-tick">&#10004;</div>
                  )}
                  <h3>Order ID: {order._id}</h3>
                  <p>
                    <strong>User:</strong> {order.user?.firstName} {order.user?.lastName} ({order.user?.email})
                  </p>
                  <div className="order-items">
                    <strong>Items:</strong>
                    <ul>
                      {order.items?.map((item) => (
                        <li key={item._id}>
                          {item.title} - Quantity: {item.quantity} - Price: ₹{item.price}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p><strong>Subtotal:</strong> ₹{order.subtotal}</p>
                  <p><strong>Shipping:</strong> ₹{order.shipping}</p>
                  <p><strong>Total:</strong> ₹{order.total}</p>
                  <p><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                  <p><strong>Status:</strong> {order.status || 'Pending'}</p>
                  <div className="order-actions">
                    <button onClick={() => handleMarkCompleted(order._id)} disabled={order.status === 'Completed'}>
                      Mark as Completed
                    </button>
                    <button onClick={() => handleDelete(order._id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default OrdersManagement;
