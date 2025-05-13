const express = require('express');
const router = express.Router();
const {
  getWorkers,
  createWorker,
  updateWorker,
  deleteWorker,
} = require('../controllers/workerController');
const protect = require('../middleware/authMiddleware');

// Protected routes
router.route('/').get(protect, getWorkers).post(protect, createWorker);
router.route('/:id').put(protect, updateWorker).delete(protect, deleteWorker);

module.exports = router;
