const express = require('express');
const router = express.Router();
const { saveJob, unsaveJob, getSavedJobs } = require('../controllers/savedJobController');
const { protect, authorizeRole } = require('../middleware/authMiddleware');

// Secure all routes under candidate-only role
router.use(protect);
router.use(authorizeRole('Candidate'));

router.route('/')
  .get(getSavedJobs)
  .post(saveJob);

router.route('/:jobId')
  .delete(unsaveJob);

module.exports = router;
