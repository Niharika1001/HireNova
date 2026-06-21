import React, { useState, useEffect } from 'react';

// Status badge class mapper
const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'Hired':
      return 'badge-green';
    case 'Rejected':
      return 'badge-red';
    case 'Shortlisted':
      return 'badge-green';
    case 'Under Review':
      return 'badge-purple';
    case 'Interview Scheduled':
      return 'badge-orange';
    case 'Applied':
    default:
      return 'badge-blue';
  }
};

// UI status text helper
const getStatusLabel = (status) => {
  return status;
};

export const ApplicationCard = ({
  application,
  onDelete,
  isRecruiter = false,
  onStatusChange,
  isSelected = false,
  onSelect,
  onOpenNotes,
  onOpenInterview
}) => {
  const { _id, fullName, email, phone, resumeLink, coverLetter, jobId, createdAt, status: dbStatus } = application;
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [displayStatus, setDisplayStatus] = useState(dbStatus);

  // Sync display status with dbStatus
  useEffect(() => {
    setDisplayStatus(dbStatus);
  }, [dbStatus]);

  const handleDropdownChange = async (e) => {
    const newStatus = e.target.value;
    setDisplayStatus(newStatus);
    await onStatusChange(_id, newStatus);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="glass-card" style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      gap: '20px',
      height: '100%',
      border: isSelected ? '1px solid var(--primary-color)' : '1px solid var(--card-border)',
      boxShadow: isSelected ? '0 0 15px rgba(0, 212, 255, 0.15)' : 'none',
      transition: 'var(--transition-smooth)'
    }}>
      <div>
        {/* Header: Candidate details & Badge */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '15px' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            {isRecruiter && onSelect && (
              <input
                type="checkbox"
                checked={isSelected}
                onChange={(e) => onSelect(_id, e.target.checked)}
                style={{
                  marginTop: '5px',
                  width: '16px',
                  height: '16px',
                  cursor: 'pointer',
                  accentColor: 'var(--primary-color)'
                }}
              />
            )}
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-color)', fontFamily: 'var(--font-display)' }}>
                {fullName}
              </h3>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Applied on {formatDate(createdAt)}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
            {jobId ? (
              <div style={{ display: 'flex', gap: '4px', flexDirection: 'column', alignItems: 'flex-end' }}>
                <span className="badge badge-primary" style={{ fontSize: '9px', padding: '2px 8px' }}>{jobId.jobType}</span>
                {jobId.status !== 'Open' && (
                  <span className={`badge ${jobId.status === 'Deleted' ? 'badge-red' : 'badge-orange'}`} style={{ fontSize: '9px', padding: '2px 8px' }}>
                    {jobId.status === 'Deleted' ? 'Archived' : jobId.status} Job
                  </span>
                )}
              </div>
            ) : (
              <span className="badge badge-red" style={{ fontSize: '9px', padding: '2px 8px' }}>Deleted Job</span>
            )}
            
            {/* Status Badge (visible to candidates only, recruiters see select dropdown) */}
            {!isRecruiter && (
              <span className={`badge ${getStatusBadgeClass(displayStatus)}`} style={{ fontSize: '9px', padding: '2px 8px', marginTop: '6px' }}>
                {getStatusLabel(displayStatus)}
              </span>
            )}
          </div>
        </div>

        {/* Applied Position Info */}
        {jobId ? (
          <div style={{
            background: jobId.status === 'Deleted' ? 'rgba(239, 68, 68, 0.01)' : 'rgba(255, 255, 255, 0.01)',
            border: jobId.status === 'Deleted' ? '1px solid rgba(239, 68, 68, 0.15)' : '1px solid var(--card-border)',
            borderRadius: '8px',
            padding: '12px',
            marginTop: '12px',
          }}>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', fontFamily: 'var(--font-display)', fontWeight: '600' }}>Position</span>
            <span style={{ fontSize: '14px', fontWeight: '700', color: jobId.status === 'Deleted' ? 'var(--danger-color)' : 'var(--text-color)' }}>
              {jobId.title} {jobId.status === 'Deleted' && '(Archived)'}
            </span>
            <span style={{ fontSize: '13px', color: 'var(--primary-color)', display: 'block', fontWeight: '600' }}>{jobId.company} &bull; {jobId.location}</span>
          </div>
        ) : (
          <div style={{
            background: 'rgba(239, 68, 68, 0.03)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: '8px',
            padding: '12px',
            marginTop: '12px',
            color: 'var(--danger-color)',
            fontSize: '13px',
          }}>
            The job listing this candidate applied to has been archived.
          </div>
        )}

        {/* Contact details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '15px', fontSize: '13px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            <a href={`mailto:${email}`} style={{ color: 'var(--text-color)', textDecoration: 'underline' }}>{email}</a>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            <a href={`tel:${phone}`} style={{ color: 'var(--text-color)' }}>{phone}</a>
          </div>
        </div>

        {/* Cover Letter */}
        {coverLetter && (
          <div style={{ marginTop: '15px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px', fontFamily: 'var(--font-display)', fontWeight: '600' }}>Cover Letter</span>
            <p style={{
              fontSize: '13px',
              color: 'var(--text-muted)',
              lineHeight: '1.5',
              background: 'rgba(255, 255, 255, 0.01)',
              borderLeft: '2px solid var(--accent-color)',
              paddingLeft: '10px',
              whiteSpace: 'pre-line',
            }}>
              {coverLetter}
            </p>
          </div>
        )}

        {/* Recruiter Status Dropdown Selector */}
        {isRecruiter && onStatusChange && (
          <div style={{
            marginTop: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'rgba(255,255,255,0.01)',
            border: '1px solid var(--card-border)',
            borderRadius: '8px',
            padding: '8px 12px'
          }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', fontFamily: 'var(--font-display)' }}>Pipeline:</span>
            <select
              value={displayStatus}
              onChange={handleDropdownChange}
              style={{
                background: 'var(--bg-color)',
                border: '1px solid var(--card-border)',
                borderRadius: '4px',
                padding: '4px 8px',
                fontSize: '12px',
                color: 'var(--text-color)',
                cursor: 'pointer',
                flex: 1,
                outline: 'none'
              }}
            >
              <option value="Applied">Applied</option>
              <option value="Under Review">Under Review</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Interview Scheduled">Interview Scheduled</option>
              <option value="Hired">Hired</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        )}

        {/* Notes & Interview Buttons */}
        {isRecruiter && (
          <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
            <button
              onClick={() => onOpenNotes(_id, fullName)}
              className="btn-secondary"
              style={{ padding: '6px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', flex: 1, justifyContent: 'center' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
              Notes
            </button>
            <button
              onClick={() => onOpenInterview(_id, fullName)}
              className="btn-secondary"
              style={{ padding: '6px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', flex: 1, justifyContent: 'center' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              Interview
            </button>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '15px',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        paddingTop: '15px',
        position: 'relative'
      }}>
        {confirmDelete ? (
          <div style={{
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'rgba(239, 68, 68, 0.08)',
            padding: '8px 12px',
            borderRadius: '6px',
            border: '1px solid rgba(239, 68, 68, 0.25)',
          }}>
            <span style={{ fontSize: '12px', color: 'var(--danger-color)', fontWeight: '600' }}>Confirm delete?</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                type="button"
                onClick={() => setConfirmDelete(false)} 
                className="btn-secondary" 
                style={{ padding: '4px 10px', fontSize: '11px' }}
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={() => {
                  onDelete(_id);
                  setConfirmDelete(false);
                }} 
                className="btn-danger" 
                style={{ padding: '4px 10px', fontSize: '11px', background: 'var(--danger-color)', color: '#fff' }}
              >
                Delete
              </button>
            </div>
          </div>
        ) : (
          <>
            <a href={resumeLink} target="_blank" rel="noopener noreferrer">
              <button className="btn-secondary" style={{ padding: '8px 12px', fontSize: '12px' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '6px' }}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                View Resume
              </button>
            </a>

            {isRecruiter && onDelete && (
              <button onClick={() => setConfirmDelete(true)} className="btn-danger" style={{ padding: '8px 12px', fontSize: '12px' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '4px' }}><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                Delete
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ApplicationCard;
