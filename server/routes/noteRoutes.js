const express = require('express');
const router = express.Router();
const { getNotes, addNote, updateNote, deleteNote } = require('../controllers/noteController');
const { protect, authorizeRole } = require('../middleware/authMiddleware');

// Secure all notes routes for Recruiters only
router.use(protect);
router.use(authorizeRole('Recruiter'));

router.route('/')
  .post(addNote);

router.route('/:applicationId')
  .get(getNotes);

router.route('/:id')
  .put(updateNote)
  .delete(deleteNote);

module.exports = router;
