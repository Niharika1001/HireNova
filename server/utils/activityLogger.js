const ActivityLog = require('../models/ActivityLog');

/**
 * Logs a recruiter activity asynchronously
 * @param {string|ObjectId} recruiterId 
 * @param {string} message 
 */
const logActivity = async (recruiterId, message) => {
  try {
    await ActivityLog.create({
      recruiterId,
      message
    });
    console.log(`Activity Logged: ${message}`);
  } catch (error) {
    console.error('Error logging recruiter activity:', error);
  }
};

module.exports = { logActivity };
