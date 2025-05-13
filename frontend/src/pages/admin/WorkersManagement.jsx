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
    // For demo purposes, let's create some mock data
    const mockWorkers = [
      {
        _id: '1',
        name: 'John Doe',
        position: 'Tailor',
        contactNumber: '9876543210',
        email: 'john@example.com',
        joiningDate: '2023-01-15T00:00:00.000Z',
        salary: '25000',
        status: 'active'
      },
      {
        _id: '2',
        name: 'Jane Smith',
        position: 'Designer',
        contactNumber: '8765432109',
        email: 'jane@example.com',
        joiningDate: '2023-02-20T00:00:00.000Z',
        salary: '30000',
        status: 'active'
      },
      {
        _id: '3',
        name: 'Mike Johnson',
        position: 'Cutter',
        contactNumber: '7654321098',
        email: 'mike@example.com',
        joiningDate: '2023-03-10T00:00:00.000Z',
        salary: '22000',
        status: 'on-leave'
      }
    ];
    
    // Simulate API call
    setTimeout(() => {
      setWorkers(mockWorkers);
      setLoading(false);
    }, 1000);
  }, []);

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
      if (currentWorker) {
        // Update existing worker (mock implementation)
        const updatedWorkers = workers.map(worker => 
          worker._id === currentWorker._id ? { ...formData, _id: currentWorker._id } : worker
        );
        setWorkers(updatedWorkers);
        toast.success('Worker updated successfully');
      } else {
        // Add new worker (mock implementation)
        const newWorker = {
          ...formData,
          _id: Date.now().toString() // Generate a mock ID
        };
        setWorkers([...workers, newWorker]);
        toast.success('Worker added successfully');
      }
      closeModal();
    } catch (error) {
      console.error('Error saving worker:', error);
      toast.error('Failed to save worker data');
    }
  };

  const handleEdit = (worker) => {
    setCurrentWorker(worker);
    setFormData({
      name: worker.name,
      position: worker.position,
      contactNumber: worker.contactNumber,
      email: worker.email,
      joiningDate: worker.joiningDate?.split('T')[0] || '',
      salary: worker.salary,
      status: worker.status
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (workerId) => {
    if (window.confirm('Are you sure you want to delete this worker?')) {
      try {
        // Mock delete implementation
        const filteredWorkers = workers.filter(worker => worker._id !== workerId);
        setWorkers(filteredWorkers);
        toast.success('Worker deleted successfully');
      } catch (error) {
        console.error('Error deleting worker:', error);
        toast.error('Failed to delete worker');
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
        <div className="loading">
          <div className="spinner">
            <div className="ring"></div>
            <div className="ring"></div>
          </div>
          <p className="loading-text">Loading workers data...</p>
        </div>
      ) : (
        <>
          {workers.length === 0 ? (
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
                        <button className="menu-btn" onClick={() => handleEdit(worker)}>
                          <i className="fas fa-edit"></i>
                        </button>
                        <button className="menu-btn delete" onClick={() => handleDelete(worker._id)}>
                          <i className="fas fa-trash"></i>
                        </button>
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
          <div className="modal-backdrop" onClick={closeModal}></div>
          <div className="modal-content">
            <h3>{currentWorker ? 'Edit Worker' : 'Add New Worker'}</h3>
            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="position">Position</label>
                <input
                  type="text"
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="contactNumber">Contact Number</label>
                <input
                  type="text"
                  id="contactNumber"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label htmlFor="joiningDate">Joining Date</label>
                <input
                  type="date"
                  id="joiningDate"
                  name="joiningDate"
                  value={formData.joiningDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="salary">Salary</label>
                <input
                  type="number"
                  id="salary"
                  name="salary"
                  value={formData.salary}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="status">Status</label>
                <select
                  id="status"
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