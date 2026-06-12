const OTP = require('../models/OTP');

/**
 * Generate a 6-digit verification code and save it to the DB
 */
const generateOTP = async (email) => {
  // 1. Generate a random 6-digit numeric string
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
  // 2. Set expiry to 5 minutes from now
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  // 3. Clear any existing OTP tokens for this email address
  await OTP.deleteMany({ email: email.toLowerCase() });

  // 4. Create and save the new OTP record
  await OTP.create({
    email: email.toLowerCase(),
    otp,
    expiresAt
  });

  // 5. Run an asynchronous cleanup of any expired OTP documents in the collection
  OTP.deleteMany({ expiresAt: { $lt: new Date() } }).catch(err => {
    console.error('Expired OTP background cleanup failed:', err);
  });

  return otp;
};

/**
 * Verify if the provided OTP is valid and not expired.
 * Consumes and deletes the OTP code immediately upon successful validation.
 */
const verifyOTP = async (email, otp) => {
  const normalizedEmail = email.toLowerCase();
  
  // 1. Query for the active matching code
  const record = await OTP.findOne({ email: normalizedEmail, otp });
  
  if (!record) {
    return false;
  }

  // 2. Double-check expiration (as MongoDB TTL index runs periodically every 60s)
  if (record.expiresAt < new Date()) {
    await OTP.deleteOne({ _id: record._id });
    return false;
  }

  // 3. Delete the token immediately to ensure one-time use (single consumption)
  await OTP.deleteOne({ _id: record._id });
  return true;
};

module.exports = {
  generateOTP,
  verifyOTP
};
