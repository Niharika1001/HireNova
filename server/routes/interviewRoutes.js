const express = require('express');
const router = express.Router();
const { getInterview, scheduleInterview, updateInterview, cancelInterview } = require('../controllers/interviewController');
const { protect, authorizeRole } = require('../middleware/authMiddleware');

// Secure all interview routes for Recruiters only
router.use(protect);
router.use(authorizeRole('Recruiter'));

router.route('/')
  .post(scheduleInterview);

router.route('/:applicationId')
  .get(getInterview);

router.route('/cancel/:id')
  .delete(cancelInterview);

router.route('/:id')
  .put(updateInterview);

module.exports = router;
