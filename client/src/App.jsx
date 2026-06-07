import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Jobs from './pages/Jobs';
import JobDetails from './pages/JobDetails';
import AddJob from './pages/AddJob';
import EditJob from './pages/EditJob';
import Applications from './pages/Applications';
import Dashboard from './pages/Dashboard';
import ManageJobs from './pages/ManageJobs';
import Analytics from './pages/Analytics';
import SavedJobs from './pages/SavedJobs';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';
import './styles/index.css';

// Dynamic Layout Wrapper to switch between Landing and Workspace shells
const AppLayout = ({ children }) => {
  const location = useLocation();
  const path = location.pathname;

  // Public/Landing Layout pages: Home, Login, Signup, Job search listing, Job public details
  const isJobDetails = /^\/jobs\/[a-f0-9]{24}$/i.test(path);
  const isLandingLayout = path === '/' || path === '/login' || path === '/signup' || path === '/jobs' || isJobDetails;

  if (isLandingLayout) {
    return (
      <div className="landing-layout">
        <Navbar />
        <main className="landing-content">
          {children}
        </main>
        <Footer />
      </div>
    );
  }

  // Authenticated Workspace Layout (Sidebar + Content area)
  return (
    <div className="workspace-layout">
      <Sidebar />
      <div className="workspace-container">
        <main className="workspace-content">
          {children}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <Router>
            <AppLayout>
              <Routes>
                {/* Public Pages */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/jobs" element={<Jobs />} />
                <Route path="/jobs/:id" element={<JobDetails />} />
                
                {/* Secured Authenticated Pages */}
                <Route 
                  path="/jobs/new" 
                  element={
                    <ProtectedRoute allowedRoles={['Recruiter']}>
                      <AddJob />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/jobs/:id/edit" 
                  element={
                    <ProtectedRoute allowedRoles={['Recruiter']}>
                      <EditJob />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute allowedRoles={['Recruiter']}>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/manage-jobs" 
                  element={
                    <ProtectedRoute allowedRoles={['Recruiter']}>
                      <ManageJobs />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/applications" 
                  element={
                    <ProtectedRoute allowedRoles={['Recruiter']}>
                      <Applications />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/analytics" 
                  element={
                    <ProtectedRoute allowedRoles={['Recruiter']}>
                      <Analytics />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Candidate Workspace Pages */}
                <Route 
                  path="/my-applications" 
                  element={
                    <ProtectedRoute allowedRoles={['Candidate']}>
                      <Applications />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/saved-jobs" 
                  element={
                    <ProtectedRoute allowedRoles={['Candidate']}>
                      <SavedJobs />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Shared Profile Page */}
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute allowedRoles={['Recruiter', 'Candidate']}>
                      <Profile />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </AppLayout>
          </Router>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
