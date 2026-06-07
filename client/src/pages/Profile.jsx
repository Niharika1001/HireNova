import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Loader } from '../components/Loader';

export const Profile = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    resumeLink: '',
    skills: '',
    profilePicture: '',
    companyName: '',
    companyWebsite: '',
    companyDescription: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/api/profile');
        setProfile(response.data);
        
        // Populate inputs with current database state
        setFormData({
          name: user?.name || '',
          phone: response.data.phone || '',
          resumeLink: response.data.resumeLink || '',
          skills: response.data.skills ? response.data.skills.join(', ') : '',
          profilePicture: response.data.profilePicture || '',
          companyName: response.data.companyName || '',
          companyWebsite: response.data.companyWebsite || '',
          companyDescription: response.data.companyDescription || ''
        });
      } catch (err) {
        console.error('Error fetching profile data:', err);
        addToast('Could not load profile details.', 'error');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user, addToast]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const cleanedResumeLink = formData.resumeLink ? formData.resumeLink.split('?')[0].trim() : '';
      const payload = {
        name: formData.name,
        phone: formData.phone,
        profilePicture: formData.profilePicture
      };

      if (user.role === 'Candidate') {
        payload.resumeLink = cleanedResumeLink;
        payload.skills = formData.skills
          .split(',')
          .map(s => s.trim())
          .filter(Boolean);
      } else {
        payload.companyName = formData.companyName;
        payload.companyWebsite = formData.companyWebsite;
        payload.companyDescription = formData.companyDescription;
      }

      await api.put('/api/profile', payload);
      
      // Update form state to reflect cleaned link
      if (user.role === 'Candidate') {
        setFormData(prev => ({ ...prev, resumeLink: cleanedResumeLink }));
      }
      
      // Update local storage token names if user changed their name
      if (formData.name !== user.name) {
        // Trigger page refresh or session updates to sync name changes across workspace views
        addToast('Profile and display name updated successfully.', 'success');
      } else {
        addToast('Profile details updated successfully.', 'success');
      }
    } catch (err) {
      console.error('Error updating profile settings:', err);
      addToast(err.response?.data?.message || 'Failed to save profile changes.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      addToast('Image size should be less than 2MB.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({
        ...prev,
        profilePicture: reader.result
      }));
      addToast('Profile picture uploaded. Click Save Settings to persist.', 'success');
    };
    reader.onerror = () => {
      addToast('Failed to read image file.', 'error');
    };
    reader.readAsDataURL(file);
  };

  if (loading) return <Loader />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', paddingBottom: '60px', maxWidth: '800px', margin: '0 auto' }}>
      
      {/* Page Header */}
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: '800', fontFamily: 'var(--font-display)', marginBottom: '8px' }}>
          Profile <span className="gradient-text-accent">Settings</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
          Update your personal details, avatar profile, and workspace properties.
        </p>
      </div>

      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
        
        {/* Profile Header Block */}
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            <img 
              src={formData.profilePicture || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%239ca3af"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 4a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7zm0 14.2c-2.505 0-4.755-1.017-6.387-2.662C6.31 15.534 9.613 15 12 15s5.69 0.534 6.387 2.538C16.755 19.183 14.505 20.2 12 20.2z"/></svg>'} 
              alt="Avatar Profile" 
              style={{
                width: '90px',
                height: '90px',
                borderRadius: '16px',
                objectFit: 'cover',
                border: '2px solid var(--primary-color)',
                boxShadow: '0 4px 20px rgba(0, 212, 255, 0.15)'
              }}
            />
            {formData.profilePicture && (
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, profilePicture: '' }))}
                style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  background: 'var(--danger-color)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                }}
                title="Remove image"
              >
                &times;
              </button>
            )}
          </div>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '800', fontFamily: 'var(--font-display)' }}>{user.name}</h2>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '600' }}>{user.role} Workspace</span>
            <span style={{ fontSize: '12px', color: 'var(--primary-color)', display: 'block', marginTop: '4px' }}>{user.email}</span>
            <div style={{ marginTop: '10px' }}>
              <input
                type="file"
                id="profile-image-upload"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
              <label 
                htmlFor="profile-image-upload"
                className="btn-secondary"
                style={{
                  padding: '6px 12px',
                  fontSize: '11px',
                  cursor: 'pointer',
                  display: 'inline-block',
                  borderRadius: '8px',
                  height: 'auto',
                  lineHeight: 'normal'
                }}
              >
                Upload Profile Picture
              </label>
            </div>
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--card-border)' }} />

        {/* Profile fields Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div className="form-row">
            {/* Display Name */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Display Name *</label>
              <input
                type="text"
                name="name"
                className="glass-input"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            
            {/* Phone Number */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Phone Number</label>
              <input
                type="text"
                name="phone"
                className="glass-input"
                placeholder="e.g. +1 (555) 019-2834"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Candidate Profile Details */}
          {user.role === 'Candidate' && (
            <>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Resume URL Link</label>
                <input
                  type="url"
                  name="resumeLink"
                  className="glass-input"
                  placeholder="https://drive.google.com/file/d/.../view"
                  value={formData.resumeLink}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Skills (Comma separated list)</label>
                <input
                  type="text"
                  name="skills"
                  className="glass-input"
                  placeholder="e.g. React, Node.js, JavaScript, Python"
                  value={formData.skills}
                  onChange={handleInputChange}
                />
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>Separate skills with commas.</span>
              </div>
            </>
          )}

          {/* Recruiter Profile Details */}
          {user.role === 'Recruiter' && (
            <>
              <div className="form-row">
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Company Name</label>
                  <input
                    type="text"
                    name="companyName"
                    className="glass-input"
                    placeholder="e.g. Stripe"
                    value={formData.companyName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Company Website (URL)</label>
                  <input
                    type="url"
                    name="companyWebsite"
                    className="glass-input"
                    placeholder="https://stripe.com"
                    value={formData.companyWebsite}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Company Description</label>
                <textarea
                  name="companyDescription"
                  className="glass-input"
                  placeholder="Enter a brief summary of what your company does..."
                  value={formData.companyDescription}
                  onChange={handleInputChange}
                  rows="4"
                  style={{ resize: 'vertical' }}
                />
              </div>
            </>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary"
              style={{ padding: '10px 24px' }}
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default Profile;
