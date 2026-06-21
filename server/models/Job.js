const mongoose = require('mongoose');

// Mongoose schema representing job postings with lifecycle states
const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
  },
  company: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
  },
  salary: {
    type: Number,
    required: [true, 'Salary is required'],
    min: [0, 'Salary must be a positive number'],
  },
  jobType: {
    type: String,
    required: [true, 'Job type is required'],
    enum: {
      values: ['Full-Time', 'Part-Time', 'Contract', 'Internship', 'Remote'],
      message: 'Job type must be Full-Time, Part-Time, Contract, Internship, or Remote',
    },
  },
  skills: {
    type: [String],
    required: [true, 'Skills required is required'],
    validate: {
      validator: function(v) {
        return Array.isArray(v) && v.length > 0;
      },
      message: 'At least one skill is required',
    },
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    minlength: [20, 'Description must be at least 20 characters long'],
  },
  status: {
    type: String,
    required: [true, 'Status is required'],
    enum: {
      values: ['Open', 'Closed', 'Reopen', 'Deleted'],
      message: 'Status must be Open, Closed, Reopen, or Deleted',
    },
    default: 'Open',
  },
  recruiterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Recruiter ID reference is required'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Job', jobSchema);
