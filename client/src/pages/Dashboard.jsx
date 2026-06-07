import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardStats, getApplications, getJobs } from '../services/api';
import { useAuth } from '../context/AuthContext';
import DashboardCard from '../components/DashboardCard';
import { DashboardCardSkeleton } from '../components/Loader';

export const Dashboard = () => {
  const { user } = useAuth();
  
  const [stats, setStats] = useState(null);
  const [applications, setApplications] = useState([]);
  const [recruiterJobs, setRecruiterJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load recruiter analytics
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const statsData = await getDashboardStats();
        setStats(statsData);
        
        const appsData = await getApplications();
        setApplications(appsData);

        // Fetch all jobs created by this recruiter to calculate status breakdowns
        const jobsData = await getJobs({ recruiterId: user._id });
        setRecruiterJobs(jobsData);
      } catch (err) {
        console.error('Error fetching dashboard metrics:', err);
        setError('Could not load recruiter dashboard analytics.');
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', paddingBottom: '60px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '800', fontFamily: 'var(--font-display)', marginBottom: '8px' }}>Recruiter Dashboard</h1>
          <div className="skeleton" style={{ width: '200px', height: '16px' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
          <DashboardCardSkeleton />
          <DashboardCardSkeleton />
          <DashboardCardSkeleton />
          <DashboardCardSkeleton />
          <DashboardCardSkeleton />
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px' }}>
        <div className="glass-card" style={{ maxWidth: '500px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ color: 'var(--danger-color)', fontFamily: 'var(--font-display)' }}>Error Loading Dashboard</h3>
          <p style={{ color: 'var(--text-muted)' }}>{error || 'Unable to retrieve analytics.'}</p>
          <button onClick={() => window.location.reload()} className="btn-primary">Retry</button>
        </div>
      </div>
    );
  }

  // Calculate client-side aggregates safely
  const totalJobs = recruiterJobs.filter(j => j.status !== 'Deleted').length;
  const openJobs = recruiterJobs.filter(j => j.status === 'Open').length;
  const closedJobs = recruiterJobs.filter(j => j.status === 'Closed').length;
  const totalApplications = applications.length;
  const selectedCandidates = applications.filter(app => app.status === 'Selected').length;

  // Recent jobs posted (limit to 5)
  const recentJobs = recruiterJobs
    .filter(j => j.status !== 'Deleted')
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '35px', paddingBottom: '60px' }}>
      
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '800', fontFamily: 'var(--font-display)', marginBottom: '8px' }}>
            Welcome Back, <span className="gradient-text-accent">{user.name}</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            Here is a summary of your recruiting metrics and candidate pipelines.
          </p>
        </div>
        
        <Link to="/jobs/new">
          <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Create Job Post
          </button>
        </Link>
      </div>

      {/* Metrics statistics cards row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px'
      }}>
        <DashboardCard
          title="Total Jobs"
          value={totalJobs}
          accentColor="primary"
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>}
        />
        <DashboardCard
          title="Open Jobs"
          value={openJobs}
          accentColor="primary"
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>}
        />
        <DashboardCard
          title="Closed Jobs"
          value={closedJobs}
          accentColor="secondary"
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>}
        />
        <DashboardCard
          title="Applications Received"
          value={totalApplications}
          accentColor="primary"
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>}
        />
        <DashboardCard
          title="Selected Candidates"
          value={selectedCandidates}
          accentColor="secondary"
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>}
        />
      </div>

      {/* Recruiter Activity Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr', gap: '30px', alignItems: 'start' }} className="dashboard-grid">
        
        {/* Recently Added Jobs */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', fontFamily: 'var(--font-display)' }}>Recently Added Jobs</h3>
            <Link to="/manage-jobs" style={{ fontSize: '13px', color: 'var(--primary-color)', fontWeight: '600' }}>
              Manage All
            </Link>
          </div>

          {recentJobs.length > 0 ? (
            <div className="premium-table-container" style={{ border: 'none' }}>
              <table className="premium-table">
                <thead>
                  <tr>
                    <th>Job Title</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Type</th>
                  </tr>
                </thead>
                <tbody>
                  {recentJobs.map((job) => (
                    <tr key={job._id}>
                      <td style={{ fontWeight: '600' }}>
                        <Link to={`/jobs/${job._id}`} style={{ transition: 'var(--transition-smooth)' }} onMouseOver={e => e.target.style.color = 'var(--primary-color)'} onMouseOut={e => e.target.style.color = 'inherit'}>
                          {job.title}
                        </Link>
                      </td>
                      <td style={{ color: 'var(--text-muted)' }}>{job.location}</td>
                      <td>
                        <span className={`badge ${job.status === 'Open' ? 'badge-green' : 'badge-orange'}`}>
                          {job.status}
                        </span>
                      </td>
                      <td>
                        <span className="badge badge-primary" style={{ fontSize: '9px' }}>{job.jobType}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)', fontSize: '14px' }}>
              No active job postings found. Get started by creating your first post.
            </div>
          )}
        </div>

        {/* Recent Applications Activity Summary */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', fontFamily: 'var(--font-display)' }}>Recent Activity</h3>
            <Link to="/applications" style={{ fontSize: '13px', color: 'var(--primary-color)', fontWeight: '600' }}>
              View All
            </Link>
          </div>

          {applications.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {applications.slice(0, 4).map((app) => (
                <div key={app._id} style={{
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'center',
                  padding: '10px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.01)',
                  border: '1px solid var(--card-border)'
                }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'rgba(0, 212, 255, 0.1)',
                    color: 'var(--primary-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '700',
                    fontSize: '12px'
                  }}>
                    {app.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{ fontSize: '13px', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{app.fullName}</h4>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Applied for {app.jobId?.title || 'Deleted Job'}</span>
                  </div>
                  <span className={`badge ${
                    app.status === 'Selected' ? 'badge-green' :
                    app.status === 'Rejected' ? 'badge-red' :
                    app.status === 'Reviewed' ? 'badge-purple' : 'badge-blue'
                  }`} style={{ fontSize: '8px', padding: '2px 6px' }}>
                    {app.status === 'Reviewed' ? 'Under Review' : app.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)', fontSize: '14px' }}>
              No recent application submissions received yet.
            </div>
          )}
        </div>

      </div>

      {/* Grid Breakpoints */}
      <style>{`
        @media (max-width: 900px) {
          .dashboard-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
