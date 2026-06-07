import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';

export const JobCard = ({ job }) => {
  const { _id, title, company, location, salary, jobType, skills } = job;
  const { user } = useAuth();
  const { addToast } = useToast();
  const [isSaved, setIsSaved] = useState(false);
  const [savingState, setSavingState] = useState(false);

  // Check if job is currently saved by candidate
  useEffect(() => {
    const checkSavedStatus = async () => {
      if (user && user.role === 'Candidate') {
        try {
          const res = await api.get('/api/saved-jobs');
          const savedList = res.data;
          const found = savedList.some(item => item.jobId?._id === _id || item.jobId === _id);
          setIsSaved(found);
        } catch (err) {
          console.error('Error checking saved status:', err);
        }
      }
    };
    checkSavedStatus();
  }, [_id, user]);

  const handleBookmarkClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      addToast('Please sign in to save jobs', 'error');
      return;
    }
    
    setSavingState(true);
    try {
      if (isSaved) {
        await api.delete(`/api/saved-jobs/${_id}`);
        setIsSaved(false);
        addToast('Job listing removed from saved list.', 'success');
      } else {
        await api.post('/api/saved-jobs', { jobId: _id });
        setIsSaved(true);
        addToast('Job listing saved successfully.', 'success');
      }
    } catch (err) {
      console.error('Error toggling saved job:', err);
      addToast('Failed to toggle saved status.', 'error');
    } finally {
      setSavingState(false);
    }
  };

  const formatSalary = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="glass-card" style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      justifyContent: 'space-between',
      gap: '15px',
      position: 'relative'
    }}>
      
      {/* Absolute Bookmark toggle for candidates */}
      {user && user.role === 'Candidate' && (
        <button
          onClick={handleBookmarkClick}
          disabled={savingState}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--card-border)',
            borderRadius: '50%',
            width: '34px',
            height: '34px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: isSaved ? 'var(--primary-color)' : 'var(--text-muted)',
            boxShadow: isSaved ? '0 0 10px rgba(0, 212, 255, 0.15)' : 'none',
            transition: 'var(--transition-smooth)'
          }}
          title={isSaved ? "Unsave Job" : "Save Job"}
          className="bookmark-btn"
        >
          {isSaved ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
          )}
        </button>
      )}

      <div style={{ paddingRight: user && user.role === 'Candidate' ? '25px' : '0' }}>
        {/* Title and Company */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '4px', color: 'var(--text-color)', fontFamily: 'var(--font-display)' }}>
              {title}
            </h3>
            <span style={{ fontSize: '14px', color: 'var(--primary-color)', fontWeight: '600' }}>
              {company}
            </span>
          </div>
        </div>

        {/* Location & Salary */}
        <div style={{ display: 'flex', gap: '15px', marginTop: '14px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-muted)' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            {location}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-muted)' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12" y2="18.01"></line><path d="M17 12H7M22 8v8M2 8v8"></path></svg>
            {formatSalary(salary)} / yr
          </div>
        </div>

        {/* Skill tag list */}
        {skills && skills.length > 0 && (
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '16px' }}>
            {skills.slice(0, 3).map((skill, idx) => (
              <span key={idx} className="badge badge-primary" style={{ fontSize: '10px', padding: '3px 8px' }}>
                {skill}
              </span>
            ))}
            {skills.length > 3 && (
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', marginLeft: '4px' }}>
                +{skills.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
        <Link to={`/jobs/${_id}`} style={{ width: '100%' }}>
          <button className="btn-secondary" style={{ width: '100%', padding: '10px 15px', fontSize: '13px' }}>
            View Details
          </button>
        </Link>
      </div>

      <style>{`
        .bookmark-btn:hover {
          background: rgba(255, 255, 255, 0.08) !important;
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
};

export default JobCard;
