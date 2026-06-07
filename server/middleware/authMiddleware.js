const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes: parses JWT Bearer tokens and attaches authenticated user to requests
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Decode and verify JWT
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Bind user data (excluding password) to request context
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        res.status(401);
        throw new Error('User profile not found. Request rejected.');
      }

      return next();
    } catch (error) {
      console.error('Auth Error:', error.message);
      res.status(401);
      return next(new Error('Not authorized, token validation failed'));
    }
  }

  if (!token) {
    res.status(401);
    return next(new Error('Not authorized, authentication token is missing'));
  }
};

// Enforces role-based permissions on protected routes
const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      res.status(401);
      return next(new Error('Not authorized, user authentication details missing'));
    }
    if (!roles.includes(req.user.role)) {
      res.status(403);
      return next(new Error(`Permission denied. Role [${req.user.role}] is not authorized.`));
    }
    next();
  };
};

module.exports = { protect, authorizeRole };
