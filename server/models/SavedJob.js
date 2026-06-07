const mongoose = require('mongoose');

const savedJobSchema = new mongoose.Schema({
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Candidate ID is required']
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: [true, 'Job ID is required']
  },
  savedAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index to ensure candidate cannot save the same job twice
savedJobSchema.index({ candidateId: 1, jobId: 1 }, { unique: true });

module.exports = mongoose.model('SavedJob', savedJobSchema);
