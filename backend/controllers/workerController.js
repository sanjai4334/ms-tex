const Worker = require('../models/Worker');

const getWorkers = async (req, res) => {
  try {
    const workers = await Worker.find().sort({ createdAt: -1 });
    console.log(`Successfully fetched ${workers.length} workers`);
    res.json(workers);
  } catch (error) {
    console.error('Error in getWorkers:', error);
    res.status(500).json({ message: 'Failed to fetch workers' });
  }
};

const createWorker = async (req, res) => {
  try {
    const workerData = {
      name: req.body.name,
      position: req.body.position,
      contactNumber: req.body.contactNumber,
      email: req.body.email,
      joiningDate: req.body.joiningDate,
      salary: req.body.salary,
      status: req.body.status
    };

    const worker = new Worker(workerData);
    const savedWorker = await worker.save();
    console.log('Worker created:', savedWorker);
    res.status(201).json(savedWorker);
  } catch (error) {
    console.error('Error in createWorker:', error);
    res.status(400).json({ message: error.message });
  }
};

const updateWorker = async (req, res) => {
  try {
    const workerId = req.params.id;
    const updateData = {
      name: req.body.name,
      position: req.body.position,
      contactNumber: req.body.contactNumber,
      email: req.body.email,
      joiningDate: req.body.joiningDate,
      salary: req.body.salary,
      status: req.body.status
    };

    const updatedWorker = await Worker.findByIdAndUpdate(
      workerId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedWorker) {
      return res.status(404).json({ message: 'Worker not found' });
    }

    console.log('Worker updated:', updatedWorker);
    res.json(updatedWorker);
  } catch (error) {
    console.error('Error in updateWorker:', error);
    res.status(400).json({ message: error.message });
  }
};

const deleteWorker = async (req, res) => {
  try {
    const deletedWorker = await Worker.findByIdAndDelete(req.params.id);
    
    if (!deletedWorker) {
      return res.status(404).json({ message: 'Worker not found' });
    }

    console.log('Worker deleted:', deletedWorker);
    res.json({ message: 'Worker deleted successfully', worker: deletedWorker });
  } catch (error) {
    console.error('Error in deleteWorker:', error);
    res.status(500).json({ message: 'Failed to delete worker' });
  }
};

const getWorkerById = async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id);
    
    if (!worker) {
      return res.status(404).json({ message: 'Worker not found' });
    }

    console.log('Worker found:', worker);
    res.json(worker);
  } catch (error) {
    console.error('Error in getWorkerById:', error);
    res.status(500).json({ message: 'Failed to fetch worker' });
  }
};

module.exports = {
  getWorkers,
  createWorker,
  updateWorker,
  deleteWorker,
  getWorkerById
};
