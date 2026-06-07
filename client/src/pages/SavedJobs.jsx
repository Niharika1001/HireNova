import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import { Loader } from '../components/Loader';
import EmptyState from '../components/EmptyState';

export const SavedJobs = () => {
  const { addToast } = useToast();
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSavedJobs = async () => {
    try {
      const response = await api.get('/api/saved-jobs');
      setSavedJobs(response.data);
    } catch (err) {
      console.error('Error fetching saved jobs:', err);
      addToast('Could not load your saved jobs.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const handleUnsave = async (jobId) => {
    try {
      await api.delete(`/api/saved-jobs/${jobId}`);
      setSavedJobs(prev => prev.filter(item => item.jobId?._id !== jobId && item.jobId !== jobId));
      addToast('Job listing removed from saved list.', 'success');
    } catch (err) {
      console.error('Error unsaving job:', err);
      addToast('Failed to unsave job listing.', 'error');
    }
  };

  const formatSalary = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  if (loading) return <Loader />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', paddingBottom: '60px' }}>
      
      {/* Page Header */}
      <div>
        <h1 style={{ fontSize: '32px', fontWeight: '800', fontFamily: 'var(--font-display)', marginBottom: '8px' }}>
          Saved <span className="gradient-text-accent">Jobs</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
          Keep track of positions you have saved and want to apply to later.
        </p>
      </div>

      {savedJobs.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '24px'
        }}>
          {savedJobs.map((item) => {
            const job = item.jobId;
            if (!job) return null;
            return (
              <div key={item._id} className="glass-card" style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '20px',
                height: '100%'
              }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                    <div>
                      <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-color)', fontFamily: 'var(--font-display)', marginBottom: '4px' }}>
                        {job.title}
                      </h3>
                      <span style={{ fontSize: '14px', color: 'var(--primary-color)', fontWeight: '600' }}>
                        {job.company}
                      </span>
                    </div>
                    <span className="badge badge-purple">{job.jobType}</span>
                  </div>

                  <div style={{ display: 'flex', gap: '15px', marginTop: '16px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-muted)' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                      {job.location}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-muted)' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12" y2="18.01"></line><path d="M17 12H7M22 8v8M2 8v8"></path></svg>
                      {formatSalary(job.salary)} / yr
                    </div>
                  </div>

                  {job.skills && job.skills.length > 0 && (
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '16px' }}>
                      {job.skills.slice(0, 3).map((skill, idx) => (
                        <span key={idx} className="badge badge-primary" style={{ fontSize: '10px', padding: '3px 8px' }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px', marginTop: '15px' }}>
                  <Link to={`/jobs/${job._id}`}>
                    <button className="btn-primary" style={{ width: '100%', padding: '10px', fontSize: '13px' }}>
                      View & Apply
                    </button>
                  </Link>
                  <button 
                    onClick={() => handleUnsave(job._id)} 
                    className="btn-secondary" 
                    style={{ width: '100%', padding: '10px', fontSize: '13px', color: 'var(--danger-color)', borderColor: 'rgba(239, 68, 68, 0.15)' }}
                    onMouseOver={e => e.target.style.background = 'rgba(239, 68, 68, 0.05)'}
                    onMouseOut={e => e.target.style.background = 'transparent'}
                  >
                    Unsave
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          message="You have not saved any job listings yet. Browse listings on the Jobs Board to save roles for later review."
          actionText="Explore Jobs"
          onAction={() => navigate('/jobs')}
        />
      )}

    </div>
  );
};

export default SavedJobs;
