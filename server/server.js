require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const { getDashboardStats } = require('./controllers/jobController');
const { protect, authorizeRole } = require('./middleware/authMiddleware');
const errorHandler = require('./middleware/errorHandler');

// Connect to the database
connectDB();

const app = express();

// Enable Cross-Origin Resource Sharing and JSON request body parsing
app.use(cors());
app.use(express.json());

// Set up routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/saved-jobs', require('./routes/savedJobRoutes'));
app.use('/api/profile', require('./routes/profileRoutes'));

// Secure dashboard stats endpoint (only Recruiters can pull their analytics)
app.get('/api/dashboard/stats', protect, authorizeRole('Recruiter'), getDashboardStats);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'HireNova Backend Service is running' });
});

// Register the global error handler middleware (must be registered last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`HireNova server listening on port ${PORT}...`);
});
