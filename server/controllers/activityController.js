const ActivityLog = require('../models/ActivityLog');

// @desc    Get latest 10 activity logs for the recruiter
// @route   GET /api/activities
// @access  Private (Recruiter)
const getActivityLogs = async (req, res, next) => {
  try {
    const recruiterId = req.user._id;
    // Show latest 10 activities, newest first
    const logs = await ActivityLog.find({ recruiterId })
      .sort({ timestamp: -1 })
      .limit(10);
      
    res.status(200).json(logs);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getActivityLogs
};
