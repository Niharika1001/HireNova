const express = require('express');
const router = express.Router();
const {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob
} = require('../controllers/jobController');
const { protect, authorizeRole } = require('../middleware/authMiddleware');

// Get all jobs and create a job
router.route('/')
  .get(getAllJobs)
  .post(protect, authorizeRole('Recruiter'), createJob);

// Get, update, and soft-delete individual jobs
router.route('/:id')
  .get(getJobById)
  .put(protect, authorizeRole('Recruiter'), updateJob)
  .delete(protect, authorizeRole('Recruiter'), deleteJob);

module.exports = router;
