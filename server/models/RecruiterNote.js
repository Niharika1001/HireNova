const mongoose = require('mongoose');

const recruiterNoteSchema = new mongoose.Schema({
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    required: [true, 'Application reference is required']
  },
  recruiterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Recruiter reference is required']
  },
  note: {
    type: String,
    required: [true, 'Note content is required'],
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('RecruiterNote', recruiterNoteSchema);
