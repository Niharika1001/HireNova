const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID reference is required'],
    unique: true
  },
  phone: {
    type: String,
    default: ''
  },
  resumeLink: {
    type: String,
    default: ''
  },
  skills: {
    type: [String],
    default: []
  },
  profilePicture: {
    type: String,
    default: ''
  },
  companyName: {
    type: String,
    default: ''
  },
  companyWebsite: {
    type: String,
    default: ''
  },
  companyDescription: {
    type: String,
    default: ''
  }
});

module.exports = mongoose.model('Profile', profileSchema);
