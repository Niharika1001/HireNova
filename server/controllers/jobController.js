const Job = require('../models/Job');
const Application = require('../models/Application');

// @desc    Get all jobs with searching, filtering, and sorting
// @route   GET /api/jobs
// @access  Public
const getAllJobs = async (req, res, next) => {
  try {
    const { search, location, type, recruiterId } = req.query;
    let query = {};

    // Recruiters can query all their jobs (Open, Closed, Deleted) for their dashboard
    if (recruiterId) {
      query.recruiterId = recruiterId;
    } else {
      // By default, candidates and guests only view 'Open' listings
      query.status = 'Open';
    }

    // Filter by search terms (matching title or company)
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by location
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    // Filter by job type
    if (type) {
      query.jobType = { $regex: `^${type}$`, $options: 'i' };
    }

    // Sort by newest postings first
    const jobs = await Job.find(query).sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      res.status(404);
      throw new Error('Job listing was not found');
    }
    
    // Candidates should not view deleted listings even if they access by direct ID links
    if (job.status === 'Deleted') {
      res.status(404);
      throw new Error('Job listing was removed');
    }

    res.status(200).json(job);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new job posting (Recruiter Only)
// @route   POST /api/jobs
// @access  Private (Recruiter)
const createJob = async (req, res, next) => {
  try {
    const { title, company, location, salary, jobType, skills, description } = req.body;

    if (!title || !company || !location || !salary || !jobType || !skills || !description) {
      res.status(400);
      throw new Error('All job fields are required');
    }

    let skillsArray = skills;
    if (typeof skills === 'string') {
      skillsArray = skills.split(',').map(skill => skill.trim()).filter(Boolean);
    }

    const job = await Job.create({
      title,
      company,
      location,
      salary,
      jobType,
      skills: skillsArray,
      description,
      recruiterId: req.user._id, // Save reference to the posting recruiter
      status: 'Open' // Defaults to open listing
    });

    res.status(201).json(job);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a job posting (Recruiter Only)
// @route   PUT /api/jobs/:id
// @access  Private (Recruiter)
const updateJob = async (req, res, next) => {
  try {
    const { title, company, location, salary, jobType, skills, description, status } = req.body;

    let job = await Job.findById(req.params.id);
    if (!job) {
      res.status(404);
      throw new Error('Job listing was not found');
    }

    // Check recruiter authorization ownership
    if (job.recruiterId.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Permission denied. You do not own this job listing.');
    }

    let skillsArray = skills;
    if (skills && typeof skills === 'string') {
      skillsArray = skills.split(',').map(skill => skill.trim()).filter(Boolean);
    }

    job.title = title || job.title;
    job.company = company || job.company;
    job.location = location || job.location;
    job.salary = salary !== undefined ? salary : job.salary;
    job.jobType = jobType || job.jobType;
    job.skills = skillsArray || job.skills;
    job.description = description || job.description;
    job.status = status || job.status; // Supports Open and Closed transitions

    const updatedJob = await job.save();
    res.status(200).json(updatedJob);
  } catch (error) {
    next(error);
  }
};

// @desc    Soft Delete a job posting (Recruiter Only)
// @route   DELETE /api/jobs/:id
// @access  Private (Recruiter)
const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      res.status(404);
      throw new Error('Job listing was not found');
    }

    // Check recruiter authorization ownership
    if (job.recruiterId.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Permission denied. You do not own this job listing.');
    }

    // Soft Delete: change status field instead of physically deleting from collection
    job.status = 'Deleted';
    await job.save();

    res.status(200).json({ message: 'Job listing status updated to Deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get recruiter metrics (total jobs, total applications, recent jobs)
// @route   GET /api/dashboard/stats
// @access  Private (Recruiter)
const getDashboardStats = async (req, res, next) => {
  try {
    const recruiterId = req.user._id;

    // Filter aggregates by recruiter context
    const totalJobs = await Job.countDocuments({ recruiterId, status: { $ne: 'Deleted' } });
    
    // Count applications for all jobs posted by this recruiter
    const recruiterJobs = await Job.find({ recruiterId }).select('_id');
    const jobIds = recruiterJobs.map(job => job._id);
    const totalApplications = await Application.countDocuments({ jobId: { $in: jobIds } });

    // Recent jobs posted by this recruiter (excluding deleted ones)
    const recentJobs = await Job.find({ recruiterId, status: { $ne: 'Deleted' } })
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      totalJobs,
      totalApplications,
      recentJobs
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getDashboardStats
};
