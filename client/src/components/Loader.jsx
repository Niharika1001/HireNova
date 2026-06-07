import React from 'react';

// Central spinning loader element
export const Loader = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px', flexDirection: 'column', gap: '20px' }}>
      <div style={{
        width: '45px',
        height: '45px',
        border: '3px solid rgba(0, 212, 255, 0.08)',
        borderTop: '3px solid var(--primary-color)',
        borderRadius: '50%',
        animation: 'spin 1s cubic-bezier(0.55, 0.055, 0.675, 0.19) infinite',
        boxShadow: '0 0 15px rgba(0, 212, 255, 0.15)'
      }} />
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <span style={{ color: 'var(--text-muted)', fontSize: '13px', letterSpacing: '0.1em', fontWeight: '700', fontFamily: 'var(--font-display)' }}>LOADING DATA...</span>
    </div>
  );
};

// Pulse skeleton loader representation for job cards
export const JobCardSkeleton = () => {
  return (
    <div className="glass-card" style={{ pointerEvents: 'none', minHeight: '190px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="skeleton" style={{ width: '60%', height: '24px' }} />
        <div className="skeleton" style={{ width: '80px', height: '20px', borderRadius: '10px' }} />
      </div>
      <div className="skeleton" style={{ width: '40%', height: '16px' }} />
      <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
        <div className="skeleton" style={{ width: '90px', height: '22px', borderRadius: '12px' }} />
        <div className="skeleton" style={{ width: '70px', height: '22px', borderRadius: '12px' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '15px' }}>
        <div className="skeleton" style={{ width: '110px', height: '18px' }} />
        <div className="skeleton" style={{ width: '90px', height: '36px', borderRadius: '8px' }} />
      </div>
    </div>
  );
};

// Pulse skeleton loader representation for dashboard metrics cards
export const DashboardCardSkeleton = () => {
  return (
    <div className="glass-card" style={{ pointerEvents: 'none', display: 'flex', alignItems: 'center', gap: '20px', minHeight: '110px' }}>
      <div className="skeleton" style={{ width: '50px', height: '50px', borderRadius: '12px' }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div className="skeleton" style={{ width: '40%', height: '14px' }} />
        <div className="skeleton" style={{ width: '60%', height: '28px' }} />
      </div>
    </div>
  );
};

// Pulse skeleton loader representation for candidate application listings
export const ApplicationCardSkeleton = () => {
  return (
    <div className="glass-card" style={{ pointerEvents: 'none', display: 'flex', flexDirection: 'column', gap: '15px', minHeight: '200px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div className="skeleton" style={{ width: '160px', height: '22px', marginBottom: '8px' }} />
          <div className="skeleton" style={{ width: '120px', height: '16px' }} />
        </div>
        <div className="skeleton" style={{ width: '90px', height: '22px', borderRadius: '12px' }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', margin: '10px 0' }}>
        <div className="skeleton" style={{ width: '85%', height: '14px' }} />
        <div className="skeleton" style={{ width: '60%', height: '14px' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '10px' }}>
        <div className="skeleton" style={{ width: '110px', height: '34px', borderRadius: '6px' }} />
        <div className="skeleton" style={{ width: '80px', height: '34px', borderRadius: '6px' }} />
      </div>
    </div>
  );
};

export default Loader;
