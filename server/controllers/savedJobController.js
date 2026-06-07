const SavedJob = require('../models/SavedJob');
const Job = require('../models/Job');

// @desc    Save a job listing
// @route   POST /api/saved-jobs
// @access  Private (Candidate only)
const saveJob = async (req, res, next) => {
  try {
    const { jobId } = req.body;
    const candidateId = req.user._id;

    if (!jobId) {
      res.status(400);
      throw new Error('Job ID is required');
    }

    // Verify job exists and is not deleted
    const job = await Job.findById(jobId);
    if (!job || job.status === 'Deleted') {
      res.status(404);
      throw new Error('Job listing not found or has been removed');
    }

    // Check if already saved
    const exists = await SavedJob.findOne({ candidateId, jobId });
    if (exists) {
      return res.status(200).json({ message: 'Job is already saved', savedJob: exists });
    }

    const savedJob = await SavedJob.create({
      candidateId,
      jobId
    });

    res.status(201).json({ message: 'Job saved successfully', savedJob });
  } catch (error) {
    next(error);
  }
};

// @desc    Unsave a job listing
// @route   DELETE /api/saved-jobs/:jobId
// @access  Private (Candidate only)
const unsaveJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const candidateId = req.user._id;

    const savedJob = await SavedJob.findOneAndDelete({ candidateId, jobId });
    if (!savedJob) {
      res.status(404);
      throw new Error('Saved job record not found');
    }

    res.status(200).json({ message: 'Job unsaved successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get candidate's saved jobs list
// @route   GET /api/saved-jobs
// @access  Private (Candidate only)
const getSavedJobs = async (req, res, next) => {
  try {
    const candidateId = req.user._id;

    // Find and populate job details
    const savedJobs = await SavedJob.find({ candidateId })
      .populate({
        path: 'jobId',
        match: { status: { $ne: 'Deleted' } } // Only active jobs
      })
      .sort({ savedAt: -1 });

    // Filter out populated jobs that are null (e.g. if a job was soft-deleted later)
    const validSavedJobs = savedJobs.filter(item => item.jobId !== null);

    res.status(200).json(validSavedJobs);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  saveJob,
  unsaveJob,
  getSavedJobs
};
