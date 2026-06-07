import React from 'react';

export const EmptyState = ({ message, actionText, onAction, type = 'default' }) => {
  
  // Custom SVG Illustrations based on empty state types
  const getIllustration = () => {
    switch (type) {
      case 'jobs':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 8px rgba(0, 212, 255, 0.25))' }}>
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
          </svg>
        );
      case 'applications':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--accent-color)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 8px rgba(139, 92, 246, 0.25))' }}>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
          </svg>
        );
      case 'saved':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 8px rgba(0, 212, 255, 0.25))' }}>
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        );
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'jobs':
        return 'No Jobs Found';
      case 'applications':
        return 'No Applications Found';
      case 'saved':
        return 'No Saved Jobs';
      default:
        return 'No Results Found';
    }
  };

  return (
    <div className="glass-card" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '60px 40px',
      minHeight: '320px',
      gap: '20px',
      width: '100%',
      border: '1px dashed var(--card-border)',
      boxShadow: 'none'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid var(--card-border)',
        borderRadius: '50%',
        width: '80px',
        height: '80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--primary-color)',
      }}>
        {getIllustration()}
      </div>
      
      <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-color)', fontFamily: 'var(--font-display)' }}>
        {getTitle()}
      </h3>
      
      <p style={{ fontSize: '14px', color: 'var(--text-muted)', maxWidth: '420px', lineHeight: '1.6' }}>
        {message || "We couldn't find any listings matching your selection. Adjust your active filters or explore new roles."}
      </p>
      
      {actionText && onAction && (
        <button onClick={onAction} className="btn-primary" style={{ marginTop: '10px', padding: '10px 24px' }}>
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
