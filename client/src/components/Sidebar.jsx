import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Define navigation links dynamically based on user role
  const getNavLinks = () => {
    const links = [];
    
    // Find Jobs is visible to all
    links.push({
      path: '/jobs',
      label: 'Find Jobs',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
      )
    });

    if (user) {
      if (user.role === 'Recruiter') {
        links.unshift({
          path: '/dashboard',
          label: 'Dashboard',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>
          )
        });
        
        links.push({
          path: '/manage-jobs',
          label: 'Manage Jobs',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
          )
        });

        links.push({
          path: '/applications',
          label: 'Applications',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          )
        });

        links.push({
          path: '/analytics',
          label: 'Analytics',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
          )
        });
      } else if (user.role === 'Candidate') {
        links.push({
          path: '/my-applications',
          label: 'My Applications',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          )
        });

        links.push({
          path: '/saved-jobs',
          label: 'Saved Jobs',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
          )
        });
      }

      // Profile is visible to all logged in users
      links.push({
        path: '/profile',
        label: 'Profile',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
        )
      });
    }

    return links;
  };

  const navLinks = getNavLinks();

  return (
    <>
      {/* Mobile Top Header */}
      <header className="mobile-header" style={{
        display: 'none',
        height: '60px',
        background: 'var(--sidebar-bg)',
        borderBottom: '1px solid var(--card-border)',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        position: 'sticky',
        top: 0,
        zIndex: 900,
        backdropFilter: 'var(--backdrop-blur)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%)',
            width: '28px',
            height: '28px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <span style={{ color: '#050816', fontWeight: '800', fontSize: '15px', fontFamily: 'var(--font-display)' }}>H</span>
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: '800', letterSpacing: '-0.02em' }}>
            Hire<span style={{ color: 'var(--primary-color)' }}>Nova</span>
          </span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button onClick={toggleTheme} style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-color)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center'
          }}>
            {theme === 'dark' ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
            )}
          </button>
          
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-color)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center'
          }}>
            {mobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            )}
          </button>
        </div>
      </header>

      {/* Mobile Slide-out Menu Overlay */}
      {mobileMenuOpen && (
        <div className="mobile-overlay" style={{
          position: 'fixed',
          top: '60px',
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(5, 8, 22, 0.95)',
          zIndex: 899,
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          backdropFilter: 'blur(10px)',
          animation: 'fadeIn 0.2s ease'
        }}>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  fontSize: '15px',
                  fontWeight: '600',
                  color: isActive ? 'var(--primary-color)' : 'var(--text-muted)',
                  background: isActive ? 'rgba(0, 214, 255, 0.08)' : 'transparent',
                  border: isActive ? '1px solid rgba(0, 214, 255, 0.15)' : '1px solid transparent',
                })}
              >
                {link.icon}
                {link.label}
              </NavLink>
            ))}
          </nav>
          
          <div style={{ marginTop: 'auto', borderTop: '1px solid var(--card-border)', paddingTop: '16px' }}>
            {user ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#050816',
                    fontWeight: '700'
                  }}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: '700' }}>{user.name}</h4>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{user.role}</span>
                  </div>
                </div>
                <button onClick={() => { setMobileMenuOpen(false); handleLogout(); }} className="btn-danger" style={{ width: '100%', padding: '10px' }}>
                  Logout
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <button onClick={() => { setMobileMenuOpen(false); navigate('/login'); }} className="btn-secondary" style={{ padding: '10px' }}>Sign In</button>
                <button onClick={() => { setMobileMenuOpen(false); navigate('/signup'); }} className="btn-primary" style={{ padding: '10px' }}>Register</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar */}
      <nav className="mobile-bottom-nav" style={{
        display: 'none',
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '60px',
        background: 'var(--sidebar-bg)',
        borderTop: '1px solid var(--card-border)',
        zIndex: 900,
        gridTemplateColumns: `repeat(${navLinks.length > 5 ? 5 : navLinks.length}, 1fr)`,
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '0 10px',
        backdropFilter: 'var(--backdrop-blur)'
      }}>
        {navLinks.slice(0, 5).map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <NavLink
              key={link.path}
              to={link.path}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                color: isActive ? 'var(--primary-color)' : 'var(--text-muted)',
                fontSize: '10px',
                fontWeight: '600',
                height: '100%',
                flex: 1
              }}
            >
              <div style={{
                color: isActive ? 'var(--primary-color)' : 'var(--text-muted)',
                transform: isActive ? 'scale(1.1)' : 'scale(1)',
                transition: 'var(--transition-smooth)',
                boxShadow: isActive ? '0 0 10px rgba(0, 212, 255, 0.15)' : 'none',
                borderRadius: '4px',
                padding: '2px'
              }}>
                {link.icon}
              </div>
              <span style={{ transform: isActive ? 'scale(1.05)' : 'scale(1)', transition: 'var(--transition-smooth)' }}>
                {link.label}
              </span>
            </NavLink>
          );
        })}
      </nav>

      {/* Desktop & Tablet Sidebar */}
      <aside className="app-sidebar" style={{
        background: 'var(--sidebar-bg)',
        borderRight: '1px solid var(--card-border)',
        padding: '30px 24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100vh',
        position: 'sticky',
        top: 0,
        zIndex: 800,
        backdropFilter: 'var(--backdrop-blur)'
      }}>
        <div>
          {/* Logo Brand */}
          <NavLink to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }} className="sidebar-logo">
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
              <span style={{ color: '#050816', fontWeight: '800', fontSize: '20px', fontFamily: 'var(--font-display)' }}>H</span>
            </div>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: '18px',
              fontWeight: '800',
              letterSpacing: '-0.02em',
              color: 'var(--text-color)',
            }} className="logo-text">
              Hire<span style={{ color: 'var(--primary-color)' }}>Nova</span>
            </span>
          </NavLink>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: isActive ? 'var(--primary-color)' : 'var(--text-muted)',
                  background: isActive ? 'rgba(0, 212, 255, 0.08)' : 'transparent',
                  border: isActive ? '1px solid rgba(0, 212, 255, 0.15)' : '1px solid transparent',
                  boxShadow: isActive ? '0 0 15px rgba(0, 212, 255, 0.1)' : 'none',
                  transition: 'var(--transition-smooth)'
                })}
                className="sidebar-link"
              >
                <div className="sidebar-icon">{link.icon}</div>
                <span className="sidebar-label">{link.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Footer controls & Profile Summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Theme Mode Toggler details */}
          <button
            onClick={toggleTheme}
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid var(--card-border)',
              borderRadius: '10px',
              padding: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              cursor: 'pointer',
              color: 'var(--text-color)',
              transition: 'var(--transition-smooth)',
              width: '100%'
            }}
            className="theme-toggle-btn"
          >
            {theme === 'dark' ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--primary-color)' }}><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
                <span className="toggle-label" style={{ fontSize: '13px', fontWeight: '500' }}>Light Mode</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent-color)' }}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                <span className="toggle-label" style={{ fontSize: '13px', fontWeight: '500' }}>Dark Mode</span>
              </>
            )}
          </button>

          {user ? (
            <div style={{
              borderTop: '1px solid var(--card-border)',
              paddingTop: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '15px'
            }} className="sidebar-profile-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }} className="profile-info">
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#050816',
                  fontWeight: '800',
                  fontFamily: 'var(--font-display)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="profile-details">
                  <h4 style={{ fontSize: '13px', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '140px' }}>{user.name}</h4>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>{user.role}</span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="btn-danger"
                style={{
                  width: '100%',
                  padding: '10px',
                  fontSize: '11px',
                  height: '38px',
                  borderRadius: '8px'
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                Logout
              </button>
            </div>
          ) : (
            <div style={{
              borderTop: '1px solid var(--card-border)',
              paddingTop: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }} className="sidebar-auth-btns">
              <NavLink to="/login" style={{ width: '100%' }}>
                <button className="btn-secondary" style={{ width: '100%', padding: '10px', fontSize: '13px', height: '38px' }}>Sign In</button>
              </NavLink>
              <NavLink to="/signup" style={{ width: '100%' }}>
                <button className="btn-primary" style={{ width: '100%', padding: '10px', fontSize: '11px', height: '38px' }}>Register</button>
              </NavLink>
            </div>
          )}
        </div>
      </aside>

      {/* Responsive Breakpoint CSS */}
      <style>{`
        @media (max-width: 1024px) {
          .logo-text, .toggle-label, .profile-details, .sidebar-label {
            display: none !important;
          }
          .sidebar-logo, .sidebar-link, .theme-toggle-btn {
            justify-content: center !important;
            padding: 12px !important;
          }
          .sidebar-profile-card button {
            padding: 8px !important;
          }
          .sidebar-profile-card button span, .sidebar-profile-card button svg {
            margin-right: 0 !important;
          }
          .sidebar-profile-card button {
            display: flex;
            align-content: center;
            justify-content: center;
          }
          .sidebar-profile-card button {
            font-size: 0 !important;
          }
          .sidebar-profile-card button svg {
            width: 16px;
            height: 16px;
          }
          .sidebar-auth-btns {
            display: flex;
            flex-direction: column !important;
            gap: 10px !important;
          }
          .sidebar-auth-btns button {
            font-size: 11px !important;
            padding: 8px 4px !important;
          }
        }

        @media (max-width: 768px) {
          .app-sidebar {
            display: none !important;
          }
          .mobile-header {
            display: flex !important;
          }
          .mobile-bottom-nav {
            display: grid !important;
          }
        }
      `}</style>
    </>
  );
};

export default Sidebar;
