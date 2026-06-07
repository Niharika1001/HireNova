import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getJob, deleteJob, applyToJob } from '../services/api';
import { Loader } from '../components/Loader';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    resumeLink: '',
    coverLetter: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(false);

  // Initialize form details from user state if logged in
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.name || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const data = await getJob(id);
        setJob(data);
      } catch (err) {
        console.error('Error fetching job details:', err);
        setError('The requested job listing was not found or has been removed.');
      } finally {
        setLoading(false);
      }
    };
    fetchJobDetails();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = (cleanedResumeLink) => {
    const { fullName, email, phone } = formData;
    if (!fullName || !email || !phone || !cleanedResumeLink) {
      return 'Please fill in all required fields.';
    }
    
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address.';
    }

    const phoneRegex = /^\+?[0-9\s\-()]{7,15}$/;
    if (!phoneRegex.test(phone)) {
      return 'Please enter a valid phone number.';
    }

    const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w \.-]*)*\/?$/;
    if (!urlRegex.test(cleanedResumeLink)) {
      return 'Please enter a valid URL link to your resume document.';
    }

    return null;
  };

  const handleApplyClick = () => {
    if (!user) {
      addToast('Please sign in to apply', 'error');
      navigate('/login');
      return;
    }
    if (user.role !== 'Candidate') {
      addToast('Recruiters cannot apply for jobs', 'error');
      return;
    }
    setShowApplyModal(true);
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(false);

    if (!user) {
      addToast('Please sign in to apply', 'error');
      navigate('/login');
      return;
    }

    if (user.role !== 'Candidate') {
      addToast('Recruiters cannot apply for jobs', 'error');
      return;
    }

    const cleanedResumeLink = formData.resumeLink ? formData.resumeLink.split('?')[0].trim() : '';
    const validationMsg = validateForm(cleanedResumeLink);
    if (validationMsg) {
      setFormError(validationMsg);
      return;
    }

    setSubmitting(true);
    try {
      await applyToJob({
        candidateId: user._id,
        jobId: id,
        ...formData,
        resumeLink: cleanedResumeLink
      });
      
      addToast('Application submitted successfully', 'success');
      setFormSuccess(true);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        resumeLink: '',
        coverLetter: ''
      });

      // Redirect candidate to applications view
      setTimeout(() => {
        setShowApplyModal(false);
        setFormSuccess(false);
        navigate('/my-applications');
      }, 1800);
    } catch (err) {
      console.error('Application submission error:', err);
      const errMsg = err.response?.data?.message || 'Failed to submit application. Please try again.';
      setFormError(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const formatSalary = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  if (loading) return <Loader />;

  if (error || !job) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px' }}>
        <div className="glass-card" style={{ maxWidth: '500px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ color: 'var(--danger-color)', fontFamily: 'var(--font-display)' }}>Error Loading Details</h3>
          <p style={{ color: 'var(--text-muted)' }}>{error || 'Unable to retrieve job details.'}</p>
          <Link to="/jobs">
            <button className="btn-primary">Back to Listings</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '60px' }}>
      
      {/* Back to listings link */}
      <div>
        <Link to="/jobs" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--primary-color)', fontSize: '13px', fontWeight: '600' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          Back to Jobs Board
        </Link>
      </div>

      {/* Modern two-column layout */}
      <div className="job-details-grid" style={{
        display: 'grid',
        gridTemplateColumns: '1.8fr 1fr',
        gap: '30px',
        alignItems: 'start'
      }}>
        
        {/* Left Column: Job Info details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            {/* Position details header */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '15px' }}>
                <div>
                  <h1 style={{ fontSize: '24px', fontWeight: '800', fontFamily: 'var(--font-display)', marginBottom: '8px' }}>
                    {job.title}
                  </h1>
                  <span style={{ fontSize: '15px', color: 'var(--primary-color)', fontWeight: '700' }}>
                    {job.company}
                  </span>
                </div>
                
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span className="badge badge-purple">{job.jobType}</span>
                  <span className={`badge ${job.status === 'Open' ? 'badge-green' : 'badge-orange'}`}>
                    {job.status}
                  </span>
                </div>
              </div>

              {/* Created Date subtext */}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '12px', color: 'var(--text-muted)', marginTop: '16px' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                Posted {new Date(job.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--card-border)' }} />

            {/* Skills required */}
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-color)', marginBottom: '14px', fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Skills Required
              </h3>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {job.skills.map((skill, idx) => (
                  <span key={idx} className="badge badge-primary" style={{ fontSize: '10px' }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Description details */}
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-color)', marginBottom: '14px', fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Job Description
              </h3>
              <p style={{
                fontSize: '13px',
                color: 'var(--text-muted)',
                lineHeight: '1.7',
                whiteSpace: 'pre-line'
              }}>
                {job.description}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Sticky apply sidecard */}
        <div style={{ position: 'sticky', top: '95px' }} className="sticky-apply-column">
          <div className="glass-card" style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            border: '1px solid rgba(0, 212, 255, 0.15)',
            boxShadow: '0 10px 30px rgba(0, 212, 255, 0.04)'
          }}>
            <h3 style={{ fontSize: '15px', fontWeight: '700', fontFamily: 'var(--font-display)' }}>Position Details</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ color: 'var(--primary-color)' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12" y2="18.01"></line><path d="M17 12H7M22 8v8M2 8v8"></path></svg>
                </div>
                <div>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', fontWeight: '600' }}>Annual Salary</span>
                  <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-color)' }}>{formatSalary(job.salary)} / yr</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ color: 'var(--primary-color)' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                </div>
                <div>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', fontWeight: '600' }}>Location</span>
                  <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-color)' }}>{job.location}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ color: 'var(--accent-color)' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>
                </div>
                <div>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', fontWeight: '600' }}>Company Name</span>
                  <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-color)' }}>{job.company}</span>
                </div>
              </div>
            </div>

            {/* Recruiter specific controls or Apply Button */}
            {user && user.role === 'Recruiter' && job.recruiterId === user._id ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                <Link to={`/jobs/${job._id}/edit`} style={{ width: '100%' }}>
                  <button className="btn-secondary" style={{ width: '100%', padding: '12px' }}>
                    Edit Posting Details
                  </button>
                </Link>
                <button onClick={() => setShowDeleteConfirm(true)} className="btn-danger" style={{ width: '100%', padding: '12px' }}>
                  Archive Position
                </button>
              </div>
            ) : job.status === 'Open' ? (
              <button onClick={handleApplyClick} className="btn-primary" style={{ width: '100%', padding: '14px', marginTop: '10px' }}>
                Apply Now
              </button>
            ) : (
              <div style={{
                background: 'rgba(245, 158, 11, 0.08)',
                border: '1px solid rgba(245, 158, 11, 0.2)',
                color: 'var(--warning-color)',
                padding: '12px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '600',
                textAlign: 'center',
                marginTop: '10px'
              }}>
                Applications are closed for this position (Job is {job.status}).
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Apply Form Glass Overlay Modal */}
      {showApplyModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(5, 8, 22, 0.85)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1500,
          padding: '20px',
        }}>
          <div className="glass-card" style={{
            maxWidth: '550px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            animation: 'fadeInDown 0.3s ease',
            border: '1px solid rgba(0, 212, 255, 0.2)',
            boxShadow: '0 0 35px rgba(0, 212, 255, 0.15)',
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '17px', fontWeight: '800', fontFamily: 'var(--font-display)' }}>Submit Application</h2>
                <span style={{ fontSize: '12px', color: 'var(--primary-color)', fontWeight: '600' }}>Applying for {job.title} at {job.company}</span>
              </div>
              <button
                onClick={() => setShowApplyModal(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  fontSize: '24px',
                  lineHeight: '1',
                }}
              >
                &times;
              </button>
            </div>

            {formSuccess ? (
              <div style={{
                textAlign: 'center',
                padding: '40px 20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '15px'
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '2px solid var(--success-color)',
                  color: 'var(--success-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  animation: 'scaleUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <h3 style={{ color: 'var(--text-color)', fontFamily: 'var(--font-display)' }}>Application Submitted!</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Redirecting to your applications tracking view...</p>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {formError && (
                  <div style={{
                    background: 'rgba(239, 68, 68, 0.08)',
                    border: '1px solid rgba(239, 68, 68, 0.25)',
                    color: 'var(--danger-color)',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    {formError}
                  </div>
                )}

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    className="glass-input"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      className="glass-input"
                      placeholder="e.g. candidate@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Phone Number *</label>
                    <input
                      type="text"
                      name="phone"
                      className="glass-input"
                      placeholder="e.g. +1 (555) 019-2834"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Resume Link (URL) *</label>
                  <input
                    type="url"
                    name="resumeLink"
                    className="glass-input"
                    placeholder="https://drive.google.com/file/.../view"
                    value={formData.resumeLink}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Cover Letter</label>
                  <textarea
                    name="coverLetter"
                    className="glass-input"
                    placeholder="Why are you a good fit for this role?"
                    value={formData.coverLetter}
                    onChange={handleInputChange}
                    rows="4"
                    style={{ resize: 'vertical' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '10px', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => setShowApplyModal(false)}
                    className="btn-secondary"
                    style={{ padding: '10px 20px' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary"
                    style={{ padding: '10px 24px' }}
                  >
                    {submitting ? 'Submitting...' : 'Submit Application'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Confirmation modal for archiving */}
      {showDeleteConfirm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(5, 8, 22, 0.85)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1500,
          padding: '20px',
        }}>
          <div className="glass-card" style={{
            maxWidth: '450px',
            width: '100%',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            boxShadow: '0 0 35px rgba(239, 68, 68, 0.15)',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            padding: '35px'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '2px solid var(--danger-color)',
              color: 'var(--danger-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              animation: 'shake 0.5s ease'
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
            </div>
            <div>
              <h2 style={{ fontSize: '17px', fontWeight: '800', fontFamily: 'var(--font-display)', marginBottom: '8px' }}>Archive Job Listing?</h2>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                Are you sure you want to archive this job? Applications associated with this posting will remain in status logs but the job listing will be hidden from searches.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button 
                onClick={() => setShowDeleteConfirm(false)} 
                className="btn-secondary" 
                style={{ padding: '10px 20px', fontSize: '12px' }}
              >
                Cancel
              </button>
              <button 
                onClick={async () => {
                  setShowDeleteConfirm(false);
                  try {
                    await deleteJob(id);
                    addToast('Job listing archived successfully.', 'success');
                    navigate('/jobs');
                  } catch (err) {
                    console.error('Error deleting job:', err);
                    addToast('Failed to archive job: ' + (err.response?.data?.message || err.message), 'error');
                  }
                }} 
                className="btn-danger" 
                style={{ padding: '10px 24px', fontSize: '12px', background: 'var(--danger-color)', color: '#fff' }}
              >
                Archive Job
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animation Breakpoint CSS definitions */}
      <style>{`
        .job-details-grid {
          display: grid;
        }
        @media (max-width: 900px) {
          .job-details-grid {
            grid-template-columns: 1fr !important;
          }
          .sticky-apply-column {
            position: relative !important;
            top: 0 !important;
          }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleUp {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
      `}</style>
    </div>
  );
};

export default JobDetails;
