const Profile = require('../models/Profile');
const User = require('../models/User');

// @desc    Get current user profile
// @route   GET /api/profile
// @access  Private (Candidate and Recruiter)
const getProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;

    let profile = await Profile.findOne({ userId });
    
    // Automatically create a profile if it doesn't exist yet
    if (!profile) {
      profile = await Profile.create({
        userId,
        phone: '',
        resumeLink: '',
        skills: [],
        profilePicture: '',
        companyName: '',
        companyWebsite: '',
        companyDescription: ''
      });
    }

    res.status(200).json(profile);
  } catch (error) {
    next(error);
  }
};

// @desc    Update current user profile
// @route   PUT /api/profile
// @access  Private (Candidate and Recruiter)
const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const {
      phone,
      resumeLink,
      skills,
      profilePicture,
      companyName,
      companyWebsite,
      companyDescription,
      name // Allow changing user's display name too!
    } = req.body;

    // 1. Update display name in user document if provided
    if (name) {
      await User.findByIdAndUpdate(userId, { name });
    }

    // 2. Find and update or create profile document
    let profile = await Profile.findOne({ userId });
    if (!profile) {
      profile = new Profile({ userId });
    }

    // Assign appropriate values based on user input
    if (phone !== undefined) profile.phone = phone;
    if (resumeLink !== undefined) profile.resumeLink = resumeLink;
    if (profilePicture !== undefined) profile.profilePicture = profilePicture;
    
    // Parse skills array if provided
    if (skills !== undefined) {
      if (Array.isArray(skills)) {
        profile.skills = skills;
      } else if (typeof skills === 'string') {
        profile.skills = skills.split(',').map(s => s.trim()).filter(Boolean);
      }
    }

    // Recruiter specific fields
    if (companyName !== undefined) profile.companyName = companyName;
    if (companyWebsite !== undefined) profile.companyWebsite = companyWebsite;
    if (companyDescription !== undefined) profile.companyDescription = companyDescription;

    await profile.save();

    res.status(200).json({
      message: 'Profile updated successfully',
      profile,
      user: {
        _id: req.user._id,
        name: name || req.user.name,
        email: req.user.email,
        role: req.user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile
};
