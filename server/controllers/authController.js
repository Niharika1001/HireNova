const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { generateOTP, verifyOTP } = require('../utils/otpService');
const { sendWelcomeEmail, sendOTPEmail } = require('../utils/emailService');

// Helper function to sign JWT tokens
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      res.status(400);
      throw new Error('All registration fields (name, email, password, role) are required');
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error('An account already exists with this email address');
    }

    const user = await User.create({
      name,
      email,
      password,
      role
    });

    // Send Welcome Email asynchronously (error-safe)
    sendWelcomeEmail(user.email, user.name).catch((err) => {
      console.error('Welcome email asynchronous delivery failed:', err);
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & dispatch OTP verification
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error('Please enter both email and password credentials');
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    // Compare encrypted passwords
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    // Generate and store OTP code
    const otp = await generateOTP(email);

    // Send OTP email (error-safe)
    sendOTPEmail(user.email, otp).catch((err) => {
      console.error('OTP email asynchronous delivery failed:', err);
    });

    // Output code to server log for developer testing convenience
    console.log(`\n==================================================`);
    console.log(`[DEVELOPER NOTICE] Generated OTP for ${user.email}: ${otp}`);
    console.log(`==================================================\n`);

    res.status(200).json({
      otpSent: true,
      email: user.email
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify OTP and return authentication details
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOTPController = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      res.status(400);
      throw new Error('Please enter both email and OTP verification code');
    }

    const isValid = await verifyOTP(email, otp);
    if (!isValid) {
      res.status(401);
      throw new Error('Invalid or expired OTP verification code');
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(404);
      throw new Error('Associated user account was not found');
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged-in user profile details
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      res.status(404);
      throw new Error('User profile was not found');
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  verifyOTPController,
  getUserProfile
};

