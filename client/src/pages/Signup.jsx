import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Candidate' // Default role
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const { name, email, password } = formData;
    if (!name.trim()) return 'Full name is required.';
    if (!email.trim()) return 'Email address is required.';
    if (!password || password.length < 6) {
      return 'Password must be at least 6 characters long.';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const validationMsg = validateForm();
    if (validationMsg) {
      setError(validationMsg);
      return;
    }

    setLoading(true);
    try {
      const { name, email, password, role } = formData;
      await signup(name, email, password, role);
      
      // Success toast
      addToast('Account created successfully', 'success');
      
      // Redirect to login page with success notification state
      navigate('/login', { 
        state: { 
          successMessage: 'Account created successfully. Please sign in to continue.' 
        } 
      });
    } catch (err) {
      console.error('Signup submit error:', err);
      setError(err.response?.data?.message || 'Registration failed. Please verify email and inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-split-container" style={{
      display: 'grid',
      gridTemplateColumns: '1.2fr 1fr',
      minHeight: '80vh',
      borderRadius: 'var(--border-radius-lg)',
      overflow: 'hidden',
      border: '1px solid var(--card-border)',
      background: 'var(--auth-container-bg)',
      backdropFilter: 'var(--backdrop-blur)',
      boxShadow: '0 20px 50px rgba(0, 0, 0, 0.25)'
    }}>
      
      {/* Left Pane: Branding & Benefits */}
      <div className="auth-branding-pane" style={{
        background: 'var(--auth-branding-bg)',
        padding: '60px 50px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        position: 'relative',
        borderRight: '1px solid var(--card-border)'
      }}>
        {/* Glowing blob */}
        <div style={{
          position: 'absolute',
          top: '25%',
          left: '15%',
          width: '200px',
          height: '200px',
          background: 'rgba(139, 92, 246, 0.06)',
          borderRadius: '50%',
          filter: 'blur(70px)',
          pointerEvents: 'none'
        }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '40px' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%)',
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <span style={{ color: '#050816', fontWeight: '800', fontSize: '18px', fontFamily: 'var(--font-display)' }}>H</span>
          </div>
          <span style={{ fontSize: '22px', fontWeight: '800', fontFamily: 'var(--font-display)' }}>
            Hire<span style={{ color: 'var(--primary-color)' }}>Nova</span>
          </span>
        </div>

        <h2 style={{ fontSize: '36px', fontWeight: '800', lineHeight: '1.2', marginBottom: '20px', fontFamily: 'var(--font-display)' }}>
          Build Your Career <span className="gradient-text-accent">Smarter</span>
        </h2>
        
        <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: '1.6', marginBottom: '40px', maxWidth: '450px' }}>
          Whether you are listing positions or applying, join a modern startup recruitment platform that handles resume screening and analytics dashboards with speed.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
            <div style={{ color: 'var(--primary-color)', marginTop: '2px' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '4px' }}>For Candidates</h4>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Browse tech listings, apply in seconds, track milestones, and save jobs.</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
            <div style={{ color: 'var(--accent-color)', marginTop: '2px' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '4px' }}>For Recruiters</h4>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Post openings, toggle open/close status, archive postings, and analyze stats.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Pane: Form Card */}
      <div className="auth-form-pane" style={{
        padding: '60px 50px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{ width: '100%', maxWidth: '380px' }}>
          <h3 style={{ fontSize: '26px', fontWeight: '800', fontFamily: 'var(--font-display)', marginBottom: '8px' }}>
            Create <span className="gradient-text-accent">Account</span>
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '30px' }}>
            Register to explore jobs or manage candidate applications.
          </p>

          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              color: 'var(--danger-color)',
              padding: '12px 16px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '500',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="name"
                className="glass-input"
                placeholder="e.g. Jane Doe"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Email Address</label>
              <input
                type="email"
                name="email"
                className="glass-input"
                placeholder="e.g. jane@gmail.com"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Password (Min. 6 chars)</label>
              <input
                type="password"
                name="password"
                className="glass-input"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Account Role</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => handleInputChange({ target: { name: 'role', value: 'Candidate' } })}
                  style={{
                    padding: '12px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: formData.role === 'Candidate' ? '600' : '400',
                    border: formData.role === 'Candidate' ? '1px solid var(--primary-color)' : '1px solid var(--card-border)',
                    background: formData.role === 'Candidate' ? 'rgba(0, 212, 255, 0.08)' : 'rgba(255,255,255,0.01)',
                    color: formData.role === 'Candidate' ? 'var(--primary-color)' : 'var(--text-color)',
                    transition: 'var(--transition-smooth)'
                  }}
                >
                  Candidate
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange({ target: { name: 'role', value: 'Recruiter' } })}
                  style={{
                    padding: '12px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: formData.role === 'Recruiter' ? '600' : '400',
                    border: formData.role === 'Recruiter' ? '1px solid var(--primary-color)' : '1px solid var(--card-border)',
                    background: formData.role === 'Recruiter' ? 'rgba(0, 212, 255, 0.08)' : 'rgba(255,255,255,0.01)',
                    color: formData.role === 'Recruiter' ? 'var(--primary-color)' : 'var(--text-color)',
                    transition: 'var(--transition-smooth)'
                  }}
                >
                  Recruiter
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ width: '100%', padding: '14px', marginTop: '10px' }}
            >
              {loading ? 'Creating Account...' : 'Get Started'}
            </button>
          </form>

          <div style={{ marginTop: '25px', textAlign: 'center', fontSize: '14px', color: 'var(--text-muted)' }}>
            Already registered?{' '}
            <Link to="/login" style={{ color: 'var(--primary-color)', fontWeight: '700' }}>
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Responsive Breakpoint CSS */}
      <style>{`
        @media (max-width: 900px) {
          .auth-split-container {
            grid-template-columns: 1fr !important;
          }
          .auth-branding-pane {
            display: none !important;
          }
          .auth-form-pane {
            padding: 50px 24px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Signup;
