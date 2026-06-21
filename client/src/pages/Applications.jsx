import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  getApplications, 
  deleteApplication, 
  updateApplicationStatus, 
  getJobs,
  bulkUpdateStatus,
  exportApplications,
  getNotes,
  addNote,
  updateNote,
  deleteNote,
  getInterview,
  scheduleInterview,
  updateInterview,
  cancelInterview
} from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ApplicationCard from '../components/ApplicationCard';
import { ApplicationCardSkeleton } from '../components/Loader';
import EmptyState from '../components/EmptyState';

export const Applications = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [searchParams] = useSearchParams();
  
  const [applications, setApplications] = useState([]);
  const [recruiterJobs, setRecruiterJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters state
  const [selectedJobId, setSelectedJobId] = useState(searchParams.get('jobId') || '');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Bulk actions selection
  const [selectedAppIds, setSelectedAppIds] = useState([]);

  // Recruiter Notes Modal/Panel state
  const [activeNotesApp, setActiveNotesApp] = useState(null); // { id, name }
  const [notes, setNotes] = useState([]);
  const [newNoteText, setNewNoteText] = useState('');
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editingNoteText, setEditingNoteText] = useState('');

  // Interview Management Modal/Panel state
  const [activeInterviewApp, setActiveInterviewApp] = useState(null); // { id, name }
  const [interviewRecord, setInterviewRecord] = useState(null);
  const [interviewForm, setInterviewForm] = useState({
    date: '',
    time: '',
    mode: 'Online',
    meetingLink: '',
    remarks: ''
  });

  const isRecruiter = user?.role === 'Recruiter';

  // Fetch jobs for dropdown (recruiter only)
  useEffect(() => {
    const fetchJobs = async () => {
      if (!isRecruiter) return;
      try {
        const data = await getJobs({ recruiterId: user._id });
        setRecruiterJobs(data.filter(j => j.status !== 'Deleted'));
      } catch (err) {
        console.error('Error fetching jobs for dropdown:', err);
      }
    };
    fetchJobs();
  }, [user, isRecruiter]);

  // Fetch applications based on filters
  const fetchApplications = async () => {
    try {
      setLoading(true);
      const params = {};
      if (isRecruiter) {
        if (selectedJobId) params.jobId = selectedJobId;
        if (statusFilter) params.status = statusFilter;
        if (searchQuery) params.search = searchQuery;
      }
      
      const data = await getApplications(params);
      setApplications(data);
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError('Could not load application records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
    setSelectedAppIds([]); // Clear selection when filters change
  }, [selectedJobId, statusFilter, searchQuery]);

  // Update status single
  const handleStatusChange = async (appId, newStatus) => {
    try {
      await updateApplicationStatus(appId, newStatus);
      setApplications(prev => prev.map(app => 
        app._id === appId ? { ...app, status: newStatus } : app
      ));
      addToast('Status Updated Successfully', 'success');
    } catch (err) {
      console.error('Error updating status:', err);
      addToast('Failed to update status: ' + (err.response?.data?.message || err.message), 'error');
    }
  };

  // Delete single
  const handleDeleteApplication = async (id) => {
    try {
      await deleteApplication(id);
      setApplications(prev => prev.filter(app => app._id !== id));
      addToast('Application deleted successfully.', 'success');
    } catch (err) {
      console.error('Error deleting application:', err);
      addToast('Failed to delete application.', 'error');
    }
  };

  // Bulk actions status update
  const handleBulkStatusChange = async (targetStatus) => {
    if (selectedAppIds.length === 0) return;
    try {
      await bulkUpdateStatus({ ids: selectedAppIds, status: targetStatus });
      setApplications(prev => prev.map(app => 
        selectedAppIds.includes(app._id) ? { ...app, status: targetStatus } : app
      ));
      setSelectedAppIds([]);
      addToast(`Bulk updated ${selectedAppIds.length} applicants to ${targetStatus}`, 'success');
    } catch (err) {
      console.error('Bulk action failed:', err);
      addToast('Bulk update failed.', 'error');
    }
  };

  // Export CSV
  const handleExportCSV = async () => {
    try {
      const params = {};
      if (selectedJobId) params.jobId = selectedJobId;
      const blobData = await exportApplications(params);
      
      // Create client-side download anchor link
      const url = window.URL.createObjectURL(new Blob([blobData]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `applicants_${selectedJobId || 'all'}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      addToast('CSV Exported Successfully', 'success');
    } catch (err) {
      console.error('CSV Export failed:', err);
      addToast('Failed to export CSV.', 'error');
    }
  };

  // Checkbox select toggle
  const handleSelectApp = (appId, isChecked) => {
    if (isChecked) {
      setSelectedAppIds(prev => [...prev, appId]);
    } else {
      setSelectedAppIds(prev => prev.filter(id => id !== appId));
    }
  };

  const handleSelectAll = (isChecked) => {
    if (isChecked) {
      setSelectedAppIds(applications.map(app => app._id));
    } else {
      setSelectedAppIds([]);
    }
  };

  // ==========================================
  // Notes API flow
  // ==========================================
  const openNotesPanel = async (appId, candidateName) => {
    setActiveNotesApp({ id: appId, name: candidateName });
    setNewNoteText('');
    setEditingNoteId(null);
    try {
      const data = await getNotes(appId);
      setNotes(data);
    } catch (err) {
      console.error('Error fetching notes:', err);
      addToast('Failed to load candidate notes', 'error');
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    try {
      const data = await addNote({ applicationId: activeNotesApp.id, note: newNoteText });
      setNotes(prev => [data, ...prev]);
      setNewNoteText('');
      addToast('Note added successfully', 'success');
    } catch (err) {
      console.error('Error adding note:', err);
      addToast('Failed to add note', 'error');
    }
  };

  const handleStartEditNote = (noteId, noteText) => {
    setEditingNoteId(noteId);
    setEditingNoteText(noteText);
  };

  const handleSaveEditNote = async (noteId) => {
    if (!editingNoteText.trim()) return;
    try {
      const data = await updateNote(noteId, { note: editingNoteText });
      setNotes(prev => prev.map(n => n._id === noteId ? data : n));
      setEditingNoteId(null);
      addToast('Note updated successfully', 'success');
    } catch (err) {
      console.error('Error updating note:', err);
      addToast('Failed to update note', 'error');
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await deleteNote(noteId);
      setNotes(prev => prev.filter(n => n._id !== noteId));
      addToast('Note deleted successfully', 'success');
    } catch (err) {
      console.error('Error deleting note:', err);
      addToast('Failed to delete note', 'error');
    }
  };

  // ==========================================
  // Interview API flow
  // ==========================================
  const openInterviewModal = async (appId, candidateName) => {
    setActiveInterviewApp({ id: appId, name: candidateName });
    setInterviewRecord(null);
    setInterviewForm({
      date: '',
      time: '',
      mode: 'Online',
      meetingLink: '',
      remarks: ''
    });

    try {
      const data = await getInterview(appId);
      if (data) {
        setInterviewRecord(data);
        setInterviewForm({
          date: data.date,
          time: data.time,
          mode: data.mode,
          meetingLink: data.meetingLink || '',
          remarks: data.remarks || ''
        });
      }
    } catch (err) {
      console.error('Error fetching interview:', err);
    }
  };

  const handleScheduleInterview = async (e) => {
    e.preventDefault();
    try {
      const data = await scheduleInterview({
        applicationId: activeInterviewApp.id,
        ...interviewForm
      });
      setInterviewRecord(data);
      addToast('Interview scheduled successfully!', 'success');
      // Update applications state status locally
      setApplications(prev => prev.map(app => 
        app._id === activeInterviewApp.id ? { ...app, status: 'Interview Scheduled' } : app
      ));
      setActiveInterviewApp(null);
    } catch (err) {
      console.error('Scheduling failed:', err);
      addToast('Failed to schedule interview: ' + (err.response?.data?.message || err.message), 'error');
    }
  };

  const handleUpdateInterview = async () => {
    if (!interviewRecord) return;
    try {
      const data = await updateInterview(interviewRecord._id, interviewForm);
      setInterviewRecord(data);
      addToast('Interview details updated!', 'success');
      setActiveInterviewApp(null);
    } catch (err) {
      console.error('Update failed:', err);
      addToast('Failed to update interview.', 'error');
    }
  };

  const handleCancelInterview = async () => {
    if (!interviewRecord) return;
    if (!window.confirm('Are you sure you want to cancel this interview?')) return;
    try {
      await cancelInterview(interviewRecord._id);
      setInterviewRecord(null);
      addToast('Interview cancelled.', 'success');
      setActiveInterviewApp(null);
    } catch (err) {
      console.error('Cancel failed:', err);
      addToast('Failed to cancel interview.', 'error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', paddingBottom: '60px' }}>
      
      {/* Title Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '800', fontFamily: 'var(--font-display)', marginBottom: '8px' }}>
            {isRecruiter ? (
              <>
                ATS Candidate <span className="gradient-text-accent">Workspace</span>
              </>
            ) : (
              <>
                Your <span className="gradient-text-accent">Applied Roles</span>
              </>
            )}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            {isRecruiter 
              ? 'Filter and search applicants, write internal notes, schedule interviews, and bulk change statuses.'
              : 'Track the status and timeline of your submitted job applications.'
            }
          </p>
        </div>
        
        {/* Total counts counter box */}
        {!loading && (
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            {isRecruiter && (
              <button 
                onClick={handleExportCSV} 
                className="btn-secondary" 
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                Export CSV
              </button>
            )}
            <div className="glass-card" style={{ padding: '10px 20px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid rgba(6, 214, 255, 0.2)' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600', fontFamily: 'var(--font-display)' }}>
                {isRecruiter ? 'Applicants Found:' : 'Total Applications:'}
              </span>
              <span style={{ fontSize: '18px', color: 'var(--accent-primary)', fontWeight: '800', fontFamily: 'var(--font-display)' }}>{applications.length}</span>
            </div>
          </div>
        )}
      </div>

      {/* Recruiter Filters Toolbar */}
      {isRecruiter && (
        <div className="glass-card" style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', padding: '20px', alignItems: 'center' }}>
          {/* Job Filter Dropdown */}
          <div style={{ flex: 1, minWidth: '200px' }}>
            <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px', fontWeight: '600', textTransform: 'uppercase' }}>Filter by Job Posting</label>
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="select-custom"
              style={{
                width: '100%',
                background: 'var(--bg-color)',
                border: '1px solid var(--card-border)',
                borderRadius: '8px',
                padding: '10px',
                color: 'var(--text-color)',
                outline: 'none'
              }}
            >
              <option value="">All Job Postings</option>
              {recruiterJobs.map(job => (
                <option key={job._id} value={job._id}>{job.title} ({job.company})</option>
              ))}
            </select>
          </div>

          {/* Status Filter Dropdown */}
          <div style={{ width: '180px' }}>
            <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px', fontWeight: '600', textTransform: 'uppercase' }}>Filter by Pipeline Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                width: '100%',
                background: 'var(--bg-color)',
                border: '1px solid var(--card-border)',
                borderRadius: '8px',
                padding: '10px',
                color: 'var(--text-color)',
                outline: 'none'
              }}
            >
              <option value="">All Statuses</option>
              <option value="Applied">Applied</option>
              <option value="Under Review">Under Review</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Interview Scheduled">Interview Scheduled</option>
              <option value="Hired">Hired</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {/* Text Search Input */}
          <div style={{ flex: 1.2, minWidth: '200px' }}>
            <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px', fontWeight: '600', textTransform: 'uppercase' }}>Search Candidate</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  background: 'var(--bg-color)',
                  border: '1px solid var(--card-border)',
                  borderRadius: '8px',
                  padding: '10px 10px 10px 36px',
                  color: 'var(--text-color)',
                  outline: 'none'
                }}
              />
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Action Bar (Float-in when selections exist) */}
      {isRecruiter && selectedAppIds.length > 0 && (
        <div style={{
          background: 'rgba(5, 8, 22, 0.9)',
          border: '1.5px solid var(--primary-color)',
          boxShadow: '0px 0px 30px rgba(0, 212, 255, 0.25)',
          padding: '16px 24px',
          borderRadius: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '15px',
          position: 'sticky',
          top: '20px',
          zIndex: 700,
          backdropFilter: 'blur(10px)',
          animation: 'slideDown 0.3s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <input
              type="checkbox"
              checked={selectedAppIds.length === applications.length}
              onChange={(e) => handleSelectAll(e.target.checked)}
              style={{ width: '16px', height: '16px', cursor: 'pointer' }}
            />
            <span style={{ fontSize: '14px', fontWeight: '700', fontFamily: 'var(--font-display)' }}>
              Selected <span style={{ color: 'var(--primary-color)' }}>{selectedAppIds.length}</span> candidates
            </span>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>Bulk Transition:</span>
            <button onClick={() => handleBulkStatusChange('Under Review')} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }}>Move to Review</button>
            <button onClick={() => handleBulkStatusChange('Shortlisted')} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px', borderColor: 'var(--success-color)' }}>Shortlist</button>
            <button onClick={() => handleBulkStatusChange('Hired')} className="btn-primary" style={{ padding: '6px 12px', fontSize: '12px', background: 'var(--success-color)', color: '#fff', borderColor: 'var(--success-color)' }}>Hire</button>
            <button onClick={() => handleBulkStatusChange('Rejected')} className="btn-danger" style={{ padding: '6px 12px', fontSize: '12px', background: 'var(--danger-color)', color: '#fff' }}>Reject</button>
            <button onClick={() => setSelectedAppIds([])} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }}>Cancel</button>
          </div>
        </div>
      )}

      {error && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          color: 'var(--danger-color)',
          padding: '16px',
          borderRadius: '8px',
          fontSize: '14px'
        }}>
          {error}
        </div>
      )}

      {/* Candidate list cards */}
      {loading ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '24px'
        }}>
          {Array.from({ length: 4 }).map((_, idx) => (
            <ApplicationCardSkeleton key={idx} />
          ))}
        </div>
      ) : applications.length > 0 ? (
        <>
          {isRecruiter && (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', paddingLeft: '8px' }}>
              <input
                type="checkbox"
                checked={selectedAppIds.length === applications.length && applications.length > 0}
                onChange={(e) => handleSelectAll(e.target.checked)}
                style={{ width: '15px', height: '15px', cursor: 'pointer' }}
              />
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>Select All Applicants</span>
            </div>
          )}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '24px'
          }}>
            {applications.map((app) => (
              <ApplicationCard
                key={app._id}
                application={app}
                onDelete={handleDeleteApplication}
                isRecruiter={isRecruiter}
                onStatusChange={handleStatusChange}
                isSelected={selectedAppIds.includes(app._id)}
                onSelect={handleSelectApp}
                onOpenNotes={openNotesPanel}
                onOpenInterview={openInterviewModal}
              />
            ))}
          </div>
        </>
      ) : (
        <EmptyState
          message={isRecruiter 
            ? "No candidate applications match the chosen search or status filters."
            : "You have not applied to any job postings yet. Head over to the Jobs Board to get started!"
          }
        />
      )}

      {/* Recruiter Notes Sidebar Panel */}
      {activeNotesApp && (
        <div style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '420px',
          background: 'var(--sidebar-bg)',
          borderLeft: '1px solid var(--card-border)',
          boxShadow: '-10px 0px 30px rgba(0, 0, 0, 0.25)',
          zIndex: 1000,
          padding: '30px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '800', fontFamily: 'var(--font-display)' }}>Internal Recruiter Notes</h3>
                <span style={{ fontSize: '12px', color: 'var(--primary-color)', fontWeight: '700' }}>For: {activeNotesApp.name}</span>
              </div>
              <button 
                onClick={() => setActiveNotesApp(null)} 
                style={{ background: 'transparent', border: 'none', color: 'var(--text-color)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            {/* Note submission Form */}
            <form onSubmit={handleAddNote} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '25px' }}>
              <textarea
                placeholder="Write interview notes, technical feedback, or communication evaluations..."
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                style={{
                  height: '80px',
                  background: 'var(--bg-color)',
                  border: '1px solid var(--card-border)',
                  borderRadius: '8px',
                  padding: '10px',
                  color: 'var(--text-color)',
                  fontSize: '13px',
                  resize: 'none',
                  outline: 'none'
                }}
              />
              <button type="submit" className="btn-primary" style={{ height: '36px', fontSize: '12px' }}>Add Note</button>
            </form>

            {/* Notes List Scroll container */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', maxHeight: 'calc(100vh - 350px)' }}>
              {notes.length > 0 ? (
                notes.map((note) => (
                  <div key={note._id} className="glass-card" style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {editingNoteId === note._id ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <textarea
                          value={editingNoteText}
                          onChange={(e) => setEditingNoteText(e.target.value)}
                          style={{
                            height: '60px',
                            background: 'var(--bg-color)',
                            border: '1px solid var(--card-border)',
                            borderRadius: '4px',
                            padding: '6px',
                            color: 'var(--text-color)',
                            fontSize: '12px',
                            resize: 'none',
                            outline: 'none'
                          }}
                        />
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                          <button type="button" onClick={() => setEditingNoteId(null)} className="btn-secondary" style={{ padding: '4px 8px', fontSize: '10px' }}>Cancel</button>
                          <button type="button" onClick={() => handleSaveEditNote(note._id)} className="btn-primary" style={{ padding: '4px 8px', fontSize: '10px' }}>Save</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p style={{ fontSize: '13px', lineHeight: '1.4', margin: 0, color: 'var(--text-color)' }}>{note.note}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                            {new Date(note.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button 
                              onClick={() => handleStartEditNote(note._id, note.note)} 
                              style={{ background: 'transparent', border: 'none', color: 'var(--primary-color)', fontSize: '11px', cursor: 'pointer', padding: 0 }}
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDeleteNote(note._id)} 
                              style={{ background: 'transparent', border: 'none', color: 'var(--danger-color)', fontSize: '11px', cursor: 'pointer', padding: 0 }}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '30px 10px', color: 'var(--text-muted)', fontSize: '13px' }}>
                  No internal notes created yet. Add one above.
                </div>
              )}
            </div>
          </div>
          <div style={{ borderTop: '1px solid var(--card-border)', paddingTop: '15px', fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center' }}>
            Notes are confidential and visible only to recruiters.
          </div>
        </div>
      )}

      {/* Interview Scheduler Modal */}
      {activeInterviewApp && (
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
          padding: '20px'
        }}>
          <div className="glass-card" style={{ maxWidth: '480px', width: '100%', border: '1px solid var(--card-border)', padding: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '800', fontFamily: 'var(--font-display)' }}>
                {interviewRecord ? 'Manage Interview' : 'Schedule Interview'}
              </h2>
              <button 
                onClick={() => setActiveInterviewApp(null)} 
                style={{ background: 'transparent', border: 'none', color: 'var(--text-color)', cursor: 'pointer' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            
            <p style={{ fontSize: '13px', color: 'var(--primary-color)', fontWeight: '700', marginBottom: '20px' }}>
              Candidate: {activeInterviewApp.name}
            </p>

            <form onSubmit={interviewRecord ? (e) => e.preventDefault() : handleScheduleInterview} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {/* Date & Time */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px', fontWeight: '600' }}>Date</label>
                  <input
                    type="date"
                    required
                    value={interviewForm.date}
                    onChange={(e) => setInterviewForm(prev => ({ ...prev, date: e.target.value }))}
                    style={{ width: '100%', background: 'var(--bg-color)', border: '1px solid var(--card-border)', borderRadius: '6px', padding: '8px', color: 'var(--text-color)', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px', fontWeight: '600' }}>Time</label>
                  <input
                    type="time"
                    required
                    value={interviewForm.time}
                    onChange={(e) => setInterviewForm(prev => ({ ...prev, time: e.target.value }))}
                    style={{ width: '100%', background: 'var(--bg-color)', border: '1px solid var(--card-border)', borderRadius: '6px', padding: '8px', color: 'var(--text-color)', outline: 'none' }}
                  />
                </div>
              </div>

              {/* Mode */}
              <div>
                <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px', fontWeight: '600' }}>Mode</label>
                <select
                  value={interviewForm.mode}
                  onChange={(e) => setInterviewForm(prev => ({ ...prev, mode: e.target.value }))}
                  style={{ width: '100%', background: 'var(--bg-color)', border: '1px solid var(--card-border)', borderRadius: '6px', padding: '8px', color: 'var(--text-color)', outline: 'none' }}
                >
                  <option value="Online">Online</option>
                  <option value="Offline">Offline</option>
                </select>
              </div>

              {/* Link (if online) */}
              {interviewForm.mode === 'Online' && (
                <div>
                  <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px', fontWeight: '600' }}>Meeting Link</label>
                  <input
                    type="url"
                    placeholder="https://meet.google.com/..."
                    value={interviewForm.meetingLink}
                    onChange={(e) => setInterviewForm(prev => ({ ...prev, meetingLink: e.target.value }))}
                    style={{ width: '100%', background: 'var(--bg-color)', border: '1px solid var(--card-border)', borderRadius: '6px', padding: '8px', color: 'var(--text-color)', outline: 'none' }}
                  />
                </div>
              )}

              {/* Remarks */}
              <div>
                <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px', fontWeight: '600' }}>Remarks / Agenda</label>
                <textarea
                  placeholder="Provide preparation details, coding instructions, or interviewer list..."
                  value={interviewForm.remarks}
                  onChange={(e) => setInterviewForm(prev => ({ ...prev, remarks: e.target.value }))}
                  style={{ width: '100%', height: '70px', background: 'var(--bg-color)', border: '1px solid var(--card-border)', borderRadius: '6px', padding: '8px', color: 'var(--text-color)', fontSize: '12px', resize: 'none', outline: 'none' }}
                />
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setActiveInterviewApp(null)} className="btn-secondary" style={{ padding: '8px 16px' }}>Close</button>
                {interviewRecord ? (
                  <>
                    <button type="button" onClick={handleCancelInterview} className="btn-danger" style={{ padding: '8px 16px', background: 'var(--danger-color)', color: '#fff' }}>Cancel Interview</button>
                    <button type="button" onClick={handleUpdateInterview} className="btn-primary" style={{ padding: '8px 18px' }}>Update Details</button>
                  </>
                ) : (
                  <button type="submit" className="btn-primary" style={{ padding: '8px 20px' }}>Schedule</button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Keyframe animation declarations */}
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes slideDown {
          from { transform: translateY(-50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>

    </div>
  );
};

export default Applications;
