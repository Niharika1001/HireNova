import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/');
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      background: 'var(--sidebar-bg)',
      backdropFilter: 'var(--backdrop-blur)',
      borderBottom: '1px solid var(--card-border)',
      boxShadow: '0 4px 30px rgba(0, 0, 0, 0.05)',
      transition: 'var(--transition-smooth)',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px',
        height: '75px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%)',
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(0, 212, 255, 0.3)',
          }}>
            <span style={{ color: '#050816', fontWeight: '800', fontSize: '18px', fontFamily: 'var(--font-display)' }}>H</span>
          </div>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: '18px',
            fontWeight: '800',
            letterSpacing: '-0.02em',
            display: 'flex',
            alignItems: 'center',
            color: 'var(--text-color)',
          }}>
            Hire<span style={{ color: 'var(--primary-color)' }}>Nova</span>
          </span>
        </Link>

        {/* Right Nav Menu actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {/* Light/Dark mode toggler button */}
          <button
            onClick={toggleTheme}
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid var(--card-border)',
              borderRadius: '8px',
              width: '38px',
              height: '38px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-color)',
              transition: 'var(--transition-smooth)'
            }}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
            )}
          </button>

          {/* Mobile hamburger menu toggle */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-color)',
              cursor: 'pointer',
              display: 'none',
            }}
            className="menu-toggle-btn"
          >
            {isOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            )}
          </button>

          {/* Navigation Links */}
          <nav 
            className={`nav-menu ${isOpen ? 'open' : ''}`}
            style={{ 
              display: 'flex', 
              gap: '8px', 
              alignItems: 'center',
              transition: 'var(--transition-smooth)'
            }}
          >
            <NavLink 
              to="/jobs" 
              end 
              onClick={() => setIsOpen(false)}
              style={({ isActive }) => ({
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: '500',
                color: isActive ? 'var(--primary-color)' : 'var(--text-muted)',
                background: isActive ? 'rgba(0, 212, 255, 0.08)' : 'transparent',
                border: isActive ? '1px solid rgba(0, 212, 255, 0.15)' : '1px solid transparent',
                transition: 'var(--transition-smooth)',
              })}
            >
              Browse Jobs
            </NavLink>

            {user ? (
              <>
                <NavLink 
                  to={user.role === 'Recruiter' ? '/dashboard' : '/my-applications'} 
                  onClick={() => setIsOpen(false)}
                  style={({ isActive }) => ({
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: '500',
                    color: isActive ? 'var(--primary-color)' : 'var(--text-muted)',
                    background: isActive ? 'rgba(0, 212, 255, 0.08)' : 'transparent',
                    border: isActive ? '1px solid rgba(0, 212, 255, 0.15)' : '1px solid transparent',
                    transition: 'var(--transition-smooth)',
                  })}
                >
                  Workspace
                </NavLink>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: '15px' }} className="user-nav-details">
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-color)' }}>{user.name}</span>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{user.role}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="btn-secondary"
                    style={{ padding: '8px 12px', fontSize: '11px', height: '38px' }}
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div style={{ display: 'flex', gap: '8px', marginLeft: '10px' }} className="auth-nav-buttons">
                <Link to="/login" onClick={() => setIsOpen(false)}>
                  <button className="btn-secondary" style={{ padding: '8px 16px', fontSize: '12px', height: '38px' }}>
                    Sign In
                  </button>
                </Link>
                <Link to="/signup" onClick={() => setIsOpen(false)}>
                  <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '10px', height: '38px' }}>
                    Register
                  </button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .menu-toggle-btn {
            display: block !important;
          }
          .nav-menu {
            position: absolute;
            top: 75px;
            left: 0;
            right: 0;
            background: var(--sidebar-bg) !important;
            border-bottom: 1px solid var(--card-border);
            flex-direction: column;
            align-items: stretch !important;
            padding: 20px;
            gap: 15px !important;
            transform: translateY(-120%);
            opacity: 0;
            pointer-events: none;
            z-index: 99;
          }
          .nav-menu.open {
            transform: translateY(0);
            opacity: 1;
            pointer-events: auto;
          }
          .user-nav-details {
            margin-left: 0 !important;
            flex-direction: row-reverse !important;
            justify-content: space-between !important;
            border-top: 1px solid var(--card-border);
            padding-top: 15px;
          }
          .user-nav-details div {
            align-items: flex-start !important;
          }
          .auth-nav-buttons {
            margin-left: 0 !important;
            display: grid !important;
            grid-template-columns: 1fr 1fr;
            border-top: 1px solid var(--card-border);
            padding-top: 15px;
          }
          .auth-nav-buttons button {
            width: 100%;
          }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
