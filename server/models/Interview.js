const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    required: [true, 'Application reference is required']
  },
  date: {
    type: String,
    required: [true, 'Interview date is required']
  },
  time: {
    type: String,
    required: [true, 'Interview time is required']
  },
  mode: {
    type: String,
    required: [true, 'Interview mode is required'],
    enum: {
      values: ['Online', 'Offline'],
      message: 'Mode must be Online or Offline'
    }
  },
  meetingLink: {
    type: String,
    trim: true
  },
  remarks: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Interview', interviewSchema);
