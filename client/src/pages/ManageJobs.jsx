import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getJobs, updateJob, deleteJob, getApplications } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Loader } from '../components/Loader';

export const ManageJobs = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [archiveJobId, setArchiveJobId] = useState(null);

  const fetchJobsData = async () => {
    try {
      const jobsData = await getJobs({ recruiterId: user._id });
      // Exclude jobs that have been deleted/archived from the list if desired, or show them?
      // "Recruiters see: Open, Closed, Draft, Deleted"
      // So recruiters should see all of them, including Deleted!
      setJobs(jobsData);
      
      const appsData = await getApplications();
      setApplications(appsData);
    } catch (err) {
      console.error('Error fetching jobs management:', err);
      addToast('Could not load jobs management data.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchJobsData();
    }
  }, [user]);

  // Toggle status: Open <-> Closed
  const handleToggleStatus = async (jobId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'Open' ? 'Closed' : 'Open';
      await updateJob(jobId, { status: newStatus });
      setJobs(prev => prev.map(job => 
        job._id === jobId ? { ...job, status: newStatus } : job
      ));
      addToast(`Job status updated to ${newStatus}.`, 'success');
    } catch (err) {
      console.error('Error toggling job status:', err);
      addToast('Failed to update job status.', 'error');
    }
  };

  // Archive job: status = Deleted
  const handleArchiveJob = async () => {
    if (!archiveJobId) return;
    try {
      await deleteJob(archiveJobId);
      setJobs(prev => prev.map(job => 
        job._id === archiveJobId ? { ...job, status: 'Deleted' } : job
      ));
      addToast('Job listing archived successfully.', 'success');
    } catch (err) {
      console.error('Error archiving job:', err);
      addToast('Failed to archive job listing.', 'error');
    } finally {
      setArchiveJobId(null);
    }
  };

  // Count candidate applications per job
  const getAppCount = (jobId) => {
    return applications.filter(app => app.jobId?._id === jobId || app.jobId === jobId).length;
  };

  if (loading) return <Loader />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', paddingBottom: '60px' }}>
      
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '800', fontFamily: 'var(--font-display)', marginBottom: '8px' }}>
            Manage <span className="gradient-text-accent">Job Postings</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            View, edit, close, and archive your recruitment listings.
          </p>
        </div>
        
        <Link to="/jobs/new">
          <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Create Job Post
          </button>
        </Link>
      </div>

      {/* Main professional table */}
      <div className="premium-table-container">
        {jobs.length > 0 ? (
          <table className="premium-table">
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Company</th>
                <th>Status</th>
                <th>Applications</th>
                <th>Created Date</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job._id}>
                  <td style={{ fontWeight: '600' }}>
                    {job.status === 'Deleted' ? (
                      <span style={{ color: 'var(--text-muted)', textDecoration: 'line-through' }}>{job.title}</span>
                    ) : (
                      <Link to={`/jobs/${job._id}`} style={{ transition: 'var(--transition-smooth)' }} onMouseOver={e => e.target.style.color = 'var(--primary-color)'} onMouseOut={e => e.target.style.color = 'inherit'}>
                        {job.title}
                      </Link>
                    )}
                  </td>
                  <td style={{ color: 'var(--text-muted)' }}>{job.company}</td>
                  <td>
                    <span className={`badge ${
                      job.status === 'Open' ? 'badge-green' :
                      job.status === 'Closed' ? 'badge-orange' : 'badge-red'
                    }`}>
                      {job.status}
                    </span>
                  </td>
                  <td style={{ fontWeight: '700', paddingLeft: '24px' }}>
                    {getAppCount(job._id)}
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                    {new Date(job.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', alignItems: 'center' }}>
                      {job.status !== 'Deleted' ? (
                        <>
                          <button
                            onClick={() => handleToggleStatus(job._id, job.status)}
                            className="btn-secondary"
                            style={{ padding: '6px 12px', fontSize: '12px' }}
                          >
                            {job.status === 'Open' ? 'Close' : 'Reopen'}
                          </button>
                          
                          <Link to={`/jobs/${job._id}/edit`}>
                            <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }}>
                              Edit
                            </button>
                          </Link>

                          <button
                            onClick={() => setArchiveJobId(job._id)}
                            className="btn-danger"
                            style={{ padding: '6px 12px', fontSize: '12px' }}
                          >
                            Archive
                          </button>
                        </>
                      ) : (
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)', paddingRight: '12px' }}>Archived</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
            <div style={{ color: 'var(--primary-color)', marginBottom: '15px' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2-4a2 2 0 0 0-2 2v16"></path></svg>
            </div>
            <h3>No Jobs Found</h3>
            <p style={{ fontSize: '14px', marginTop: '6px' }}>You haven't posted any job listings yet.</p>
          </div>
        )}
      </div>

      {/* Archive Confirmation Modal */}
      {archiveJobId && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(5, 8, 22, 0.85)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1500,
          padding: '20px',
        }}>
          <div className="glass-card" style={{
            maxWidth: '450px',
            width: '100%',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            boxShadow: '0 0 35px rgba(239, 68, 68, 0.15)',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            padding: '35px'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '2px solid var(--danger-color)',
              color: 'var(--danger-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
            </div>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '800', fontFamily: 'var(--font-display)', marginBottom: '8px' }}>Archive Job?</h2>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                Are you sure you want to archive this job? The job listing status will be set to Deleted and hidden from candidate searches.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button 
                onClick={() => setArchiveJobId(null)} 
                className="btn-secondary" 
                style={{ padding: '10px 20px', fontSize: '13px' }}
              >
                Cancel
              </button>
              <button 
                onClick={handleArchiveJob} 
                className="btn-danger" 
                style={{ padding: '10px 24px', fontSize: '13px', background: 'var(--danger-color)', color: '#fff' }}
              >
                Archive Job
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ManageJobs;
