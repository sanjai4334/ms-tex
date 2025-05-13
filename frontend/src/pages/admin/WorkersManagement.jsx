import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './WorkersManagement.scss';

function WorkersManagement() {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentWorker, setCurrentWorker] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    contactNumber: '',
    email: '',
    joiningDate: '',
    salary: '',
    status: 'active'
  });

  useEffect(() => {
    fetchWorkers();
  }, []);

  const fetchWorkers = async () => {
    setLoading(true);
    try {
      const adminToken = localStorage.getItem('adminToken');
      const config = {
        headers: {
          Authorization: `Bearer ${adminToken}`
        }
      };
      const { data } = await axios.get('/api/workers', config);
      setWorkers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching workers:', error);
      toast.error(error.response?.data?.message || 'Failed to load workers data');
      setWorkers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const adminToken = localStorage.getItem('adminToken');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        }
      };

      if (currentWorker) {
        await axios.put(`/api/workers/${currentWorker._id}`, formData, config);
        toast.success('Worker updated successfully');
      } else {
        await axios.post('/api/workers', formData, config);
        toast.success('Worker added successfully');
      }
      fetchWorkers();
      closeModal();
    } catch (error) {
      console.error('Error saving worker:', error);
      toast.error(error.response?.data?.message || 'Failed to save worker data');
    }
  };

  const handleEdit = (worker) => {
    setCurrentWorker(worker);
    setFormData({
      name: worker.name || '',
      position: worker.position || '',
      contactNumber: worker.contactNumber || '',
      email: worker.email || '',
      joiningDate: worker.joiningDate ? worker.joiningDate.split('T')[0] : '',
      salary: worker.salary || '',
      status: worker.status || 'active'
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (workerId) => {
    if (window.confirm('Are you sure you want to delete this worker?')) {
      try {
        const adminToken = localStorage.getItem('adminToken');
        const config = {
          headers: {
            Authorization: `Bearer ${adminToken}`
          }
        };
        await axios.delete(`/api/workers/${workerId}`, config);
        toast.success('Worker deleted successfully');
        fetchWorkers();
      } catch (error) {
        console.error('Error deleting worker:', error);
        toast.error(error.response?.data?.message || 'Failed to delete worker');
      }
    }
  };

  const openModal = () => {
    setCurrentWorker(null);
    setFormData({
      name: '',
      position: '',
      contactNumber: '',
      email: '',
      joiningDate: '',
      salary: '',
      status: 'active'
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="workers-management">
      <h2>Workers Management</h2>
      
      <div className="worker-actions">
        <button className="add-worker-btn" onClick={openModal}>
          Add New Worker
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading workers data...</div>
      ) : (
        <>
          {!Array.isArray(workers) || workers.length === 0 ? (
            <p>No workers found. Add your first worker!</p>
          ) : (
            <table className="workers-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Position</th>
                  <th>Contact</th>
                  <th>Email</th>
                  <th>Joining Date</th>
                  <th>Salary</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {workers.map((worker) => (
                  <tr key={worker._id}>
                    <td>{worker.name}</td>
                    <td>{worker.position}</td>
                    <td>{worker.contactNumber}</td>
                    <td>{worker.email}</td>
                    <td>{new Date(worker.joiningDate).toLocaleDateString()}</td>
                    <td>₹{worker.salary}</td>
                    <td>
                      <span className={`status-badge ${worker.status}`}>
                        {worker.status}
                      </span>
                    </td>
                    <td>
                      <div className="actions">
                        <button onClick={() => handleEdit(worker)}>Edit</button>
                        <button onClick={() => handleDelete(worker._id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>{currentWorker ? 'Edit Worker' : 'Add New Worker'}</h3>
            <form onSubmit={handleSubmit}>
              <div>
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label>Position</label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label>Contact Number</label>
                <input
                  type="text"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label>Joining Date</label>
                <input
                  type="date"
                  name="joiningDate"
                  value={formData.joiningDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label>Salary</label>
                <input
                  type="number"
                  name="salary"
                  value={formData.salary}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label>Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="active">Active</option>
                  <option value="on-leave">On Leave</option>
                  <option value="terminated">Terminated</option>
                </select>
              </div>
              <div className="form-buttons">
                <button type="submit">
                  {currentWorker ? 'Update Worker' : 'Add Worker'}
                </button>
                <button type="button" onClick={closeModal}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default WorkersManagement;