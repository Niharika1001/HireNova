import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer style={{
      background: 'rgba(10, 16, 35, 0.4)',
      borderTop: '1px solid var(--card-border)',
      padding: '60px 20px 40px 20px',
      marginTop: 'auto',
      backdropFilter: 'var(--backdrop-blur)'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: '40px',
      }}>
        {/* Brand Summary */}
        <div style={{ flex: '1 1 300px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div style={{
              background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%)',
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(0, 212, 255, 0.25)',
            }}>
              <span style={{ color: '#050816', fontWeight: '800', fontSize: '18px', fontFamily: 'var(--font-display)' }}>H</span>
            </div>
            <span style={{ fontSize: '20px', fontWeight: '800', fontFamily: 'var(--font-display)', color: 'var(--text-color)' }}>
              Hire<span style={{ color: 'var(--primary-color)' }}>Nova</span>
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.6', maxWidth: '320px' }}>
            Experience the next generation of recruitment. Connect top talent with leading teams in a high-speed ecosystem designed for modern hiring.
          </p>
        </div>

        {/* Sitemap links */}
        <div style={{ display: 'flex', gap: '60px', flexWrap: 'wrap' }}>
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-color)', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-display)' }}>Candidates</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
              <li><Link to="/jobs" style={{ color: 'var(--text-muted)', transition: 'var(--transition-smooth)' }} onMouseOver={e => e.target.style.color = 'var(--primary-color)'} onMouseOut={e => e.target.style.color = 'var(--text-muted)'}>Browse Jobs</Link></li>
              <li><Link to="/jobs?type=Remote" style={{ color: 'var(--text-muted)', transition: 'var(--transition-smooth)' }} onMouseOver={e => e.target.style.color = 'var(--primary-color)'} onMouseOut={e => e.target.style.color = 'var(--text-muted)'}>Remote Positions</Link></li>
            </ul>
          </div>
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-color)', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-display)' }}>Recruiters</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
              <li><Link to="/login" style={{ color: 'var(--text-muted)', transition: 'var(--transition-smooth)' }} onMouseOver={e => e.target.style.color = 'var(--primary-color)'} onMouseOut={e => e.target.style.color = 'var(--text-muted)'}>Post a Job</Link></li>
              <li><Link to="/dashboard" style={{ color: 'var(--text-muted)', transition: 'var(--transition-smooth)' }} onMouseOver={e => e.target.style.color = 'var(--primary-color)'} onMouseOut={e => e.target.style.color = 'var(--text-muted)'}>Dashboard</Link></li>
              <li><Link to="/applications" style={{ color: 'var(--text-muted)', transition: 'var(--transition-smooth)' }} onMouseOver={e => e.target.style.color = 'var(--primary-color)'} onMouseOut={e => e.target.style.color = 'var(--text-muted)'}>Manage Applicants</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer credits and copyright */}
      <div style={{
        maxWidth: '1200px',
        margin: '40px auto 0 auto',
        paddingTop: '24px',
        borderTop: '1px solid var(--card-border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '15px',
        fontSize: '12px',
        color: 'var(--text-muted)',
      }}>
        <span>&copy; {new Date().getFullYear()} HireNova Inc. All rights reserved.</span>
        <span>Premium SaaS Recruitment Ecosystem.</span>
      </div>
    </footer>
  );
};

export default Footer;
