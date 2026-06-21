const express = require('express');
const router = express.Router();
const {
  getAllApplications,
  createApplication,
  deleteApplication,
  updateApplicationStatus,
  exportApplications,
  bulkUpdateStatus
} = require('../controllers/applicationController');
const { protect, authorizeRole } = require('../middleware/authMiddleware');

// Get applications list (auth required) and submit application (Candidates only)
router.route('/')
  .get(protect, getAllApplications)
  .post(protect, authorizeRole('Candidate'), createApplication);

// Export applications to CSV (Recruiters only)
router.route('/export')
  .get(protect, authorizeRole('Recruiter'), exportApplications);

// Bulk update application status (Recruiters only)
router.route('/bulk-status')
  .post(protect, authorizeRole('Recruiter'), bulkUpdateStatus);

// Delete application (Recruiters only)
router.route('/:id')
  .delete(protect, authorizeRole('Recruiter'), deleteApplication);

// Update application status pipeline (Recruiters only)
router.route('/:id/status')
  .put(protect, authorizeRole('Recruiter'), updateApplicationStatus);

module.exports = router;
