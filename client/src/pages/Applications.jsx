import React, { useState, useEffect } from 'react';
import { getApplications, deleteApplication, updateApplicationStatus } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ApplicationCard from '../components/ApplicationCard';
import { ApplicationCardSkeleton } from '../components/Loader';
import EmptyState from '../components/EmptyState';

// Applications Management / Applied Roles page
export const Applications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isRecruiter = user?.role === 'Recruiter';

  // Fetch all applications submitted on load
  const fetchApplications = async () => {
    try {
      const data = await getApplications();
      setApplications(data);
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError('Could not load candidate application records from the API.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // Update application status (Mongoose status pipeline) - Recruiters only
  const handleStatusChange = async (appId, newStatus) => {
    try {
      console.log(`Applications page: Updating application ${appId} to status: ${newStatus}`);
      await updateApplicationStatus(appId, newStatus);
      
      // Update applications state locally
      setApplications(prev => prev.map(app => 
        app._id === appId ? { ...app, status: newStatus } : app
      ));
      
      alert(`Candidate status updated to ${newStatus}.`);
    } catch (err) {
      console.error('Error updating application status:', err);
      alert('Failed to update application status: ' + (err.response?.data?.message || err.message));
    }
  };

  // Delete specific candidate application record
  const handleDeleteApplication = async (id) => {
    console.log('handleDeleteApplication called with id:', id);
    if (!id) {
      console.error('Delete application aborted: ID is undefined');
      alert('Delete failed: Candidate ID is missing.');
      return;
    }
    try {
      console.log('Sending API delete request for application ID:', id);
      const res = await deleteApplication(id);
      console.log('Delete API response:', res);
      setApplications(prev => prev.filter(app => app._id !== id));
      alert('Application deleted successfully.');
    } catch (err) {
      console.error('Error deleting application:', err);
      alert('Failed to delete application: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', paddingBottom: '60px' }}>
      
      {/* Title Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '800', fontFamily: 'var(--font-display)', marginBottom: '8px' }}>
            {isRecruiter ? (
              <>
                Candidate <span className="gradient-text-accent">Applications</span>
              </>
            ) : (
              <>
                Your <span className="gradient-text-accent">Applied Roles</span>
              </>
            )}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            {isRecruiter 
              ? 'Review candidate resumes, cover letter write-ups, and contact profiles.'
              : 'Track the status and timeline of your submitted job applications.'
            }
          </p>
        </div>
        
        {/* Total counts counter box */}
        {!loading && (
          <div className="glass-card" style={{ padding: '10px 20px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid rgba(6, 214, 255, 0.2)' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600', fontFamily: 'var(--font-display)' }}>
              {isRecruiter ? 'Total Applicants:' : 'Total Applications:'}
            </span>
            <span style={{ fontSize: '18px', color: 'var(--accent-primary)', fontWeight: '800', fontFamily: 'var(--font-display)' }}>{applications.length}</span>
          </div>
        )}
      </div>

      {error && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          color: 'var(--danger-color)',
          padding: '16px',
          borderRadius: '8px',
          fontSize: '14px'
        }}>
          {error}
        </div>
      )}

      {/* Candidate list cards */}
      {loading ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '24px'
        }}>
          {Array.from({ length: 4 }).map((_, idx) => (
            <ApplicationCardSkeleton key={idx} />
          ))}
        </div>
      ) : applications.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '24px'
        }}>
          {applications.map((app) => (
            <ApplicationCard
              key={app._id}
              application={app}
              onDelete={handleDeleteApplication}
              isRecruiter={isRecruiter}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          message={isRecruiter 
            ? "No candidate applications have been received yet. When applicants apply for postings, they will be listed here."
            : "You have not applied to any job postings yet. Head over to the Jobs Board to get started!"
          }
        />
      )}
    </div>
  );
};

export default Applications;

