const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');
const {
  sendRecruiterNotification,
  sendCandidateConfirmation,
  sendStatusUpdateEmail
} = require('../utils/emailService');

// @desc    Get all job applications (Role-based access)
// @route   GET /api/applications
// @access  Private
const getAllApplications = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role;
    
    let applications = [];

    if (userRole === 'Recruiter') {
      // Recruiters only view applications submitted to jobs THEY posted
      const recruiterJobs = await Job.find({ recruiterId: userId }).select('_id');
      const jobIds = recruiterJobs.map(job => job._id);

      applications = await Application.find({ jobId: { $in: jobIds } })
        .populate('jobId', 'title company location jobType status')
        .sort({ createdAt: -1 });
    } else if (userRole === 'Candidate') {
      // Candidates only view applications THEY submitted
      applications = await Application.find({ candidateId: userId })
        .populate('jobId', 'title company location jobType status')
        .sort({ createdAt: -1 });
    }

    res.status(200).json(applications);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new application (Candidate Only)
// @route   POST /api/applications
// @access  Private (Candidate)
const createApplication = async (req, res, next) => {
  try {
    const { candidateId, jobId, fullName, email, phone, resumeLink, coverLetter } = req.body;

    // Validate all fields
    if (!fullName || !email || !phone || !resumeLink || !jobId || !candidateId) {
      res.status(400);
      throw new Error('All required fields (candidateId, jobId, fullName, email, phone, resumeLink) are required');
    }

    // Verify candidate exists and has Candidate role
    const candidate = await User.findById(candidateId);
    if (!candidate) {
      res.status(404);
      throw new Error('Candidate user was not found');
    }
    if (candidate.role !== 'Candidate') {
      res.status(400);
      throw new Error('Only users registered with Candidate accounts can apply for jobs.');
    }

    // Verify job exists and is OPEN for applications
    const job = await Job.findById(jobId);
    if (!job) {
      res.status(404);
      throw new Error('Associated Job listing was not found');
    }

    if (job.status !== 'Open') {
      res.status(400);
      throw new Error('This job listing is closed and no longer accepting applications.');
    }

    // Check if candidate already applied to this job
    const alreadyApplied = await Application.findOne({ jobId, candidateId });
    if (alreadyApplied) {
      res.status(400);
      throw new Error('You have already submitted an application for this position.');
    }

    const application = await Application.create({
      fullName,
      email,
      phone,
      resumeLink,
      coverLetter,
      jobId,
      candidateId,
      status: 'Applied' // Default state
    });

    // Trigger email notifications asynchronously (error-safe)
    (async () => {
      try {
        const recruiter = await User.findById(job.recruiterId);
        if (recruiter) {
          const dateStr = new Date(application.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          });

          // Send notification email to the recruiter
          await sendRecruiterNotification(
            recruiter.email,
            recruiter.name,
            application.fullName,
            application.email,
            job.title,
            dateStr
          );

          // Send confirmation email to the candidate
          await sendCandidateConfirmation(
            application.email,
            application.fullName,
            job.title,
            job.company,
            dateStr
          );
        }
      } catch (emailErr) {
        console.error('Asynchronous application notification flow failed:', emailErr);
      }
    })();

    res.status(201).json(application);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an application (Recruiter Only)
// @route   DELETE /api/applications/:id
// @access  Private (Recruiter)
const deleteApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id).populate('jobId');
    if (!application) {
      res.status(404);
      throw new Error('Application was not found');
    }

    // Verify recruiter owns the associated job
    if (application.jobId.recruiterId.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Permission denied. You do not own the job listing for this application.');
    }

    await Application.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: 'Application was deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Update application status (Recruiter Only)
// @route   PUT /api/applications/:id/status
// @access  Private (Recruiter)
const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    
    if (!status) {
      res.status(400);
      throw new Error('Please provide application status');
    }

    const application = await Application.findById(req.params.id).populate('jobId');
    if (!application) {
      res.status(404);
      throw new Error('Application was not found');
    }

    // Verify recruiter owns the associated job
    if (application.jobId.recruiterId.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Permission denied. You do not own the job listing for this application.');
    }

    const previousStatus = application.status;
    application.status = status;
    await application.save();

    // Trigger status update email notification asynchronously (error-safe)
    (async () => {
      try {
        const candidate = await User.findById(application.candidateId);
        if (candidate) {
          const dateStr = new Date().toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          });

          await sendStatusUpdateEmail(
            candidate.email,
            candidate.name,
            application.jobId.title,
            application.jobId.company,
            previousStatus,
            status,
            dateStr
          );
        }
      } catch (emailErr) {
        console.error('Asynchronous status update notification flow failed:', emailErr);
      }
    })();

    res.status(200).json(application);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllApplications,
  createApplication,
  deleteApplication,
  updateApplicationStatus
};
