const mongoose = require('mongoose');

// Mongoose schema representing Candidate applications
const applicationSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address'],
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [/^\+?[0-9\s\-()]{7,15}$/, 'Please provide a valid phone number'],
  },
  resumeLink: {
    type: String,
    required: [true, 'Resume link is required'],
    trim: true,
    match: [/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w \.-]*)*\/?$/, 'Please provide a valid URL for the resume link'],
  },
  coverLetter: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    required: [true, 'Application status is required'],
    enum: {
      values: ['Applied', 'Reviewed', 'Selected', 'Rejected'],
      message: 'Status must be Applied, Reviewed, Selected, or Rejected',
    },
    default: 'Applied',
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: [true, 'Job reference is required'],
  },
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Candidate reference is required'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Application', applicationSchema);
