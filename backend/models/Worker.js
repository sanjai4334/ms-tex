const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  position: { type: String, required: true },
  contactNumber: { type: String, required: true },
  email: { type: String },
  joiningDate: { type: Date, required: true },
  salary: { type: Number, required: true },
  status: {
    type: String,
    enum: ['active', 'on-leave', 'terminated'],
    default: 'active',
  },
}, { timestamps: true });

module.exports = mongoose.model('Worker', workerSchema);
