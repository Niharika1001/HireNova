const RecruiterNote = require('../models/RecruiterNote');
const Application = require('../models/Application');

// @desc    Get notes for a specific application
// @route   GET /api/notes/:applicationId
// @access  Private (Recruiter)
const getNotes = async (req, res, next) => {
  try {
    const { applicationId } = req.params;

    // Check if application exists and belongs to a job posted by this recruiter
    const application = await Application.findById(applicationId).populate('jobId');
    if (!application) {
      res.status(404);
      throw new Error('Application was not found');
    }

    if (application.jobId.recruiterId.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Permission denied. You do not own the job listing for this application.');
    }

    const notes = await RecruiterNote.find({ applicationId }).sort({ createdAt: -1 });
    res.status(200).json(notes);
  } catch (error) {
    next(error);
  }
};

// @desc    Add a note to an application
// @route   POST /api/notes
// @access  Private (Recruiter)
const addNote = async (req, res, next) => {
  try {
    const { applicationId, note } = req.body;

    if (!applicationId || !note) {
      res.status(400);
      throw new Error('applicationId and note content are required');
    }

    // Verify application and ownership
    const application = await Application.findById(applicationId).populate('jobId');
    if (!application) {
      res.status(404);
      throw new Error('Application was not found');
    }

    if (application.jobId.recruiterId.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Permission denied. You do not own the job listing for this application.');
    }

    const newNote = await RecruiterNote.create({
      applicationId,
      recruiterId: req.user._id,
      note
    });

    res.status(201).json(newNote);
  } catch (error) {
    next(error);
  }
};

// @desc    Update an existing note
// @route   PUT /api/notes/:id
// @access  Private (Recruiter)
const updateNote = async (req, res, next) => {
  try {
    const { note } = req.body;

    if (!note) {
      res.status(400);
      throw new Error('Note content is required');
    }

    const recruiterNote = await RecruiterNote.findById(req.params.id);
    if (!recruiterNote) {
      res.status(404);
      throw new Error('Note was not found');
    }

    // Check ownership
    if (recruiterNote.recruiterId.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Permission denied. You do not own this note.');
    }

    recruiterNote.note = note;
    const updatedNote = await recruiterNote.save();

    res.status(200).json(updatedNote);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a note
// @route   DELETE /api/notes/:id
// @access  Private (Recruiter)
const deleteNote = async (req, res, next) => {
  try {
    const recruiterNote = await RecruiterNote.findById(req.params.id);
    if (!recruiterNote) {
      res.status(404);
      throw new Error('Note was not found');
    }

    // Check ownership
    if (recruiterNote.recruiterId.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Permission denied. You do not own this note.');
    }

    await RecruiterNote.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: 'Note deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNotes,
  addNote,
  updateNote,
  deleteNote
};
