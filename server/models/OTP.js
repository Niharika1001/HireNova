const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
  },
  otp: {
    type: String,
    required: [true, 'OTP code is required'],
    trim: true
  },
  expiresAt: {
    type: Date,
    required: [true, 'Expiration timestamp is required']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Set up TTL index so MongoDB automatically deletes documents after expiresAt has passed.
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('OTP', otpSchema);
