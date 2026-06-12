import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, verifyOtp } = useAuth();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const [otpMode, setOtpMode] = useState(false);
  const [otp, setOtp] = useState('');

  // Extract redirect state message (e.g. from signup success)
  useEffect(() => {
    if (location.state?.successMessage) {
      setSuccessMsg(location.state.successMessage);
      // Clean location state to avoid repeating on re-renders
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const { email, password } = formData;
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const data = await login(email, password);
      if (data.otpSent) {
        setOtpMode(true);
        addToast('OTP Sent Successfully', 'success');
      } else {
        // Fallback standard redirect
        if (data.role === 'Recruiter') {
          navigate('/dashboard');
        } else {
          navigate('/jobs');
        }
      }
    } catch (err) {
      console.error('Login submit error:', err);
      setError(err.response?.data?.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP code.');
      return;
    }

    setLoading(true);
    try {
      const data = await verifyOtp(formData.email, otp);
      addToast('OTP Verified Successfully', 'success');
      if (data.role === 'Recruiter') {
        navigate('/dashboard');
      } else {
        navigate('/jobs');
      }
    } catch (err) {
      console.error('OTP verification error:', err);
      setError(err.response?.data?.message || 'Invalid or expired OTP code.');
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
          top: '20%',
          left: '10%',
          width: '200px',
          height: '200px',
          background: 'rgba(0, 212, 255, 0.08)',
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
          Where Talent Meets <span className="gradient-text-accent">Opportunity</span>
        </h2>
        
        <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: '1.6', marginBottom: '40px', maxWidth: '450px' }}>
          Join top companies and developers scaling modern SaaS workspaces worldwide. Access recruiter metrics, application flows, and saved job board tracking in seconds.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
            <div style={{ color: 'var(--primary-color)', marginTop: '2px' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '4px' }}>Curated Startup Network</h4>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Explore roles at Stripe, Linear, Notion, Vercel, and Wellfound.</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
            <div style={{ color: 'var(--accent-color)', marginTop: '2px' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '4px' }}>Unified Recruiters Analytics</h4>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Track candidate stats, update pipeline milestones, and soft-delete listings.</p>
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
            {otpMode ? (
              <>
                Enter <span className="gradient-text-accent">OTP</span>
              </>
            ) : (
              <>
                Welcome <span className="gradient-text-accent">Back</span>
              </>
            )}
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '30px' }}>
            {otpMode 
              ? `We've sent a 6-digit code to ${formData.email}` 
              : 'Sign in to access your recruitment workspace.'}
          </p>

          {successMsg && (
            <div style={{
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              color: 'var(--success-color)',
              padding: '12px 16px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '500',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              {successMsg}
            </div>
          )}

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

          {otpMode ? (
            <form onSubmit={handleOtpSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Verification Code (OTP)</label>
                <input
                  type="text"
                  maxLength="6"
                  placeholder="••••••"
                  className="glass-input"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  style={{ letterSpacing: '8px', fontSize: '20px', textAlign: 'center', fontWeight: '700' }}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{ width: '100%', padding: '14px', marginTop: '10px' }}
              >
                {loading ? 'Verifying Code...' : 'Verify & Sign In'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setOtpMode(false);
                  setOtp('');
                  setError(null);
                }}
                className="btn-secondary"
                style={{ width: '100%', padding: '12px', border: 'none', background: 'transparent', color: 'var(--text-muted)' }}
              >
                Back to Login credentials
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  name="email"
                  className="glass-input"
                  placeholder="e.g. recruit@stripe.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Password</label>
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

              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{ width: '100%', padding: '14px', marginTop: '10px' }}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>
          )}

          <div style={{ marginTop: '30px', textAlign: 'center', fontSize: '14px', color: 'var(--text-muted)' }}>
            New to HireNova?{' '}
            <Link to="/signup" style={{ color: 'var(--primary-color)', fontWeight: '700' }}>
              Register Now
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

export default Login;
