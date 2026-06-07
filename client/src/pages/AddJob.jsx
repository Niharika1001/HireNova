import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createJob } from '../services/api';

// Page for adding a new job listing
export const AddJob = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    salary: '',
    jobType: 'Full-Time',
    skills: '',
    description: ''
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Perform validation matching the backend model criteria
  const validateForm = () => {
    const { title, company, location, salary, description } = formData;
    
    if (!title.trim()) return 'Job Title is required.';
    if (!company.trim()) return 'Company Name is required.';
    if (!location.trim()) return 'Location is required.';
    
    // Salary validation: must be present and numeric
    if (!salary) return 'Salary is required.';
    if (isNaN(salary) || Number(salary) < 0) {
      return 'Salary must be a valid positive number.';
    }

    // Description validation: minimum 20 characters
    if (!description.trim() || description.trim().length < 20) {
      return 'Description must be at least 20 characters long.';
    }

    return null;
  };

  // Submit new job details to MongoDB
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const validationMsg = validateForm();
    if (validationMsg) {
      setError(validationMsg);
      window.scrollTo(0, 0);
      return;
    }

    setSubmitting(true);
    try {
      // Convert skills text box listing into an array of string items
      const skillsArray = formData.skills
        .split(',')
        .map(skill => skill.trim())
        .filter(Boolean);

      await createJob({
        ...formData,
        salary: Number(formData.salary),
        skills: skillsArray
      });

      alert('Job listing created successfully.');
      navigate('/jobs');
    } catch (err) {
      console.error('Error creating job:', err);
      setError(err.response?.data?.message || 'Failed to create job posting. Please check all fields.');
      window.scrollTo(0, 0);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '25px', paddingBottom: '60px' }}>
      
      {/* Back link */}
      <Link to="/jobs" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--accent-primary)', fontSize: '14px', fontWeight: '500' }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        Cancel and Back
      </Link>

      {/* Main glass card wrapper */}
      <div className="glass-card">
        <h2 style={{ fontSize: '24px', fontWeight: '700', fontFamily: 'var(--font-display)', marginBottom: '6px' }}>Post a New Job</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '25px' }}>Fill in the details to publish a new job posting to candidates.</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              color: 'var(--danger-color)',
              padding: '12px',
              borderRadius: '6px',
              fontSize: '13px'
            }}>
              {error}
            </div>
          )}

          {/* Job Title */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Job Title *</label>
            <input
              type="text"
              name="title"
              className="glass-input"
              placeholder="e.g. Lead React Developer"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Company & Location */}
          <div className="form-row">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Company Name *</label>
              <input
                type="text"
                name="company"
                className="glass-input"
                placeholder="e.g. Stripe"
                value={formData.company}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Location *</label>
              <input
                type="text"
                name="location"
                className="glass-input"
                placeholder="e.g. San Francisco, CA / Remote"
                value={formData.location}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* Salary & Job Type */}
          <div className="form-row">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Annual Salary (USD, numeric only) *</label>
              <input
                type="text"
                name="salary"
                className="glass-input"
                placeholder="e.g. 140000"
                value={formData.salary}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Job Type *</label>
              <select
                name="jobType"
                className="glass-input"
                value={formData.jobType}
                onChange={handleInputChange}
                style={{ background: 'var(--bg-secondary)', cursor: 'pointer' }}
                required
              >
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
                <option value="Remote">Remote</option>
              </select>
            </div>
          </div>

          {/* Skills Required */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Skills Required (Comma separated) *</label>
            <input
              type="text"
              name="skills"
              className="glass-input"
              placeholder="e.g. React, Node.js, TypeScript, REST APIs"
              value={formData.skills}
              onChange={handleInputChange}
              required
            />
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>Separate each skill item with a comma (e.g. React, Express, Mongoose).</span>
          </div>

          {/* Description */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Job Description (Minimum 20 characters) *</label>
            <textarea
              name="description"
              className="glass-input"
              placeholder="Enter full job details, required experience, responsibilities, and benefits..."
              value={formData.description}
              onChange={handleInputChange}
              rows="6"
              style={{ resize: 'vertical' }}
              required
            />
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end', marginTop: '10px' }}>
            <Link to="/jobs">
              <button type="button" className="btn-secondary" style={{ padding: '12px 24px' }}>Cancel</button>
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary"
              style={{ padding: '12px 28px' }}
            >
              {submitting ? 'Creating...' : 'Create Job Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddJob;
