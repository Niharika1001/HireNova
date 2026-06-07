import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getJob, updateJob } from '../services/api';
import { Loader } from '../components/Loader';

// Page for editing an existing job listing
export const EditJob = () => {
  const { id } = useParams();
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

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Fetch current details of the target job listing to prefill fields
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const data = await getJob(id);
        setFormData({
          title: data.title,
          company: data.company,
          location: data.location,
          salary: data.salary.toString(),
          jobType: data.jobType,
          skills: data.skills.join(', '),
          description: data.description
        });
      } catch (err) {
        console.error('Error fetching job details for edit:', err);
        setError('Could not retrieve job listing info for editing.');
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

  // Validate form entries matching schema logic
  const validateForm = () => {
    const { title, company, location, salary, description } = formData;
    
    if (!title.trim()) return 'Job Title is required.';
    if (!company.trim()) return 'Company Name is required.';
    if (!location.trim()) return 'Location is required.';
    
    // Salary check
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

  // Submit edits via PUT request
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
      const skillsArray = formData.skills
        .split(',')
        .map(skill => skill.trim())
        .filter(Boolean);

      await updateJob(id, {
        ...formData,
        salary: Number(formData.salary),
        skills: skillsArray
      });

      alert('Job listing updated successfully.');
      navigate(`/jobs/${id}`);
    } catch (err) {
      console.error('Error updating job:', err);
      setError(err.response?.data?.message || 'Failed to update job posting. Please check inputs.');
      window.scrollTo(0, 0);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '25px', paddingBottom: '60px' }}>
      
      {/* Back link */}
      <Link to={`/jobs/${id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--accent-primary)', fontSize: '14px', fontWeight: '500' }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        Cancel and Back
      </Link>

      {/* Form Card */}
      <div className="glass-card">
        <h2 style={{ fontSize: '24px', fontWeight: '700', fontFamily: 'var(--font-display)', marginBottom: '6px' }}>Edit Job Posting</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '25px' }}>Make updates to your job listing. Updates are published instantly.</p>

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

          {/* Title */}
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
          </div>

          {/* Description */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Job Description (Minimum 20 characters) *</label>
            <textarea
              name="description"
              className="glass-input"
              placeholder="Enter full job specifications, duties, and qualifications..."
              value={formData.description}
              onChange={handleInputChange}
              rows="6"
              style={{ resize: 'vertical' }}
              required
            />
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end', marginTop: '10px' }}>
            <Link to={`/jobs/${id}`}>
              <button type="button" className="btn-secondary" style={{ padding: '12px 24px' }}>Cancel</button>
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary"
              style={{ padding: '12px 28px' }}
            >
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditJob;
