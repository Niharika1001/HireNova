const express = require('express');
const router = express.Router();
const { getActivityLogs } = require('../controllers/activityController');
const { protect, authorizeRole } = require('../middleware/authMiddleware');

// Secure activity routes for Recruiters only
router.use(protect);
router.use(authorizeRole('Recruiter'));

router.route('/')
  .get(getActivityLogs);

module.exports = router;
