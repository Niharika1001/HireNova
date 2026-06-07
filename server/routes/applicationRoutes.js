const express = require('express');
const router = express.Router();
const {
  getAllApplications,
  createApplication,
  deleteApplication,
  updateApplicationStatus
} = require('../controllers/applicationController');
const { protect, authorizeRole } = require('../middleware/authMiddleware');

// Get applications list (auth required) and submit application (Candidates only)
router.route('/')
  .get(protect, getAllApplications)
  .post(protect, authorizeRole('Candidate'), createApplication);

// Delete application (Recruiters only)
router.route('/:id')
  .delete(protect, authorizeRole('Recruiter'), deleteApplication);

// Update application status pipeline (Recruiters only)
router.route('/:id/status')
  .put(protect, authorizeRole('Recruiter'), updateApplicationStatus);

module.exports = router;
