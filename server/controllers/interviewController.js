const Interview = require('../models/Interview');
const Application = require('../models/Application');
const { logActivity } = require('../utils/activityLogger');
const {
  sendInterviewScheduledEmail,
  sendInterviewUpdatedEmail,
  sendInterviewCancelledEmail
} = require('../utils/emailService');

// @desc    Get interview details for a specific application
// @route   GET /api/interviews/:applicationId
// @access  Private (Recruiter)
const getInterview = async (req, res, next) => {
  try {
    const { applicationId } = req.params;

    // Check application and recruiter ownership
    const application = await Application.findById(applicationId).populate('jobId');
    if (!application) {
      res.status(404);
      throw new Error('Application was not found');
    }

    if (application.jobId.recruiterId.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Permission denied. You do not own the job listing for this application.');
    }

    const interview = await Interview.findOne({ applicationId });
    res.status(200).json(interview);
  } catch (error) {
    next(error);
  }
};

// @desc    Schedule a new interview
// @route   POST /api/interviews
// @access  Private (Recruiter)
const scheduleInterview = async (req, res, next) => {
  try {
    const { applicationId, date, time, mode, meetingLink, remarks } = req.body;

    if (!applicationId || !date || !time || !mode) {
      res.status(400);
      throw new Error('applicationId, date, time, and mode are required');
    }

    // Check application and recruiter ownership
    const application = await Application.findById(applicationId).populate('jobId candidateId');
    if (!application) {
      res.status(404);
      throw new Error('Application was not found');
    }

    if (application.jobId.recruiterId.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Permission denied. You do not own the job listing for this application.');
    }

    // Check if interview already scheduled
    let interview = await Interview.findOne({ applicationId });
    if (interview) {
      res.status(400);
      throw new Error('An interview has already been scheduled for this candidate. Please update the existing interview instead.');
    }

    // Create interview
    interview = await Interview.create({
      applicationId,
      date,
      time,
      mode,
      meetingLink,
      remarks
    });

    // Update application status to 'Interview Scheduled'
    const prevStatus = application.status;
    application.status = 'Interview Scheduled';
    await application.save();

    // Log Activity
    const candidateName = application.fullName;
    await logActivity(req.user._id, `Scheduled Interview for ${candidateName}`);

    // Send Email notification asynchronously (error-safe)
    (async () => {
      try {
        await sendInterviewScheduledEmail(
          application.email,
          candidateName,
          application.jobId.title,
          application.jobId.company,
          date,
          time,
          mode,
          meetingLink,
          remarks
        );
      } catch (err) {
        console.error('Failed to send interview scheduled email:', err);
      }
    })();

    res.status(201).json(interview);
  } catch (error) {
    next(error);
  }
};

// @desc    Update interview details
// @route   PUT /api/interviews/:id
// @access  Private (Recruiter)
const updateInterview = async (req, res, next) => {
  try {
    const { date, time, mode, meetingLink, remarks } = req.body;

    const interview = await Interview.findById(req.params.id);
    if (!interview) {
      res.status(404);
      throw new Error('Interview was not found');
    }

    // Check ownership
    const application = await Application.findById(interview.applicationId).populate('jobId');
    if (!application || application.jobId.recruiterId.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Permission denied. You do not own the job listing associated with this interview.');
    }

    interview.date = date || interview.date;
    interview.time = time || interview.time;
    interview.mode = mode || interview.mode;
    interview.meetingLink = meetingLink !== undefined ? meetingLink : interview.meetingLink;
    interview.remarks = remarks !== undefined ? remarks : interview.remarks;

    const updatedInterview = await interview.save();

    // Log Activity
    const candidateName = application.fullName;
    await logActivity(req.user._id, `Updated Interview for ${candidateName}`);

    // Send Email notification asynchronously
    (async () => {
      try {
        await sendInterviewUpdatedEmail(
          application.email,
          candidateName,
          application.jobId.title,
          application.jobId.company,
          interview.date,
          interview.time,
          interview.mode,
          interview.meetingLink,
          interview.remarks
        );
      } catch (err) {
        console.error('Failed to send interview update email:', err);
      }
    })();

    res.status(200).json(updatedInterview);
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel/delete an interview
// @route   DELETE /api/interviews/:id
// @access  Private (Recruiter)
const cancelInterview = async (req, res, next) => {
  try {
    const interview = await Interview.findById(req.params.id);
    if (!interview) {
      res.status(404);
      throw new Error('Interview was not found');
    }

    // Check ownership
    const application = await Application.findById(interview.applicationId).populate('jobId');
    if (!application || application.jobId.recruiterId.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Permission denied. You do not own the job listing associated with this interview.');
    }

    await Interview.deleteOne({ _id: req.params.id });

    // Log Activity
    const candidateName = application.fullName;
    await logActivity(req.user._id, `Cancelled Interview for ${candidateName}`);

    // Send Email notification asynchronously
    (async () => {
      try {
        await sendInterviewCancelledEmail(
          application.email,
          candidateName,
          application.jobId.title,
          application.jobId.company
        );
      } catch (err) {
        console.error('Failed to send interview cancelled email:', err);
      }
    })();

    res.status(200).json({ message: 'Interview cancelled successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getInterview,
  scheduleInterview,
  updateInterview,
  cancelInterview
};
