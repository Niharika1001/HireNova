import axios from 'axios';

// Create an Axios instance using relative paths (to leverage the Vite dev-server proxy configuration)
const api = axios.create({
  baseURL: '',
});

// Job API helper methods
export const getJobs = async (params = {}) => {
  const response = await api.get('/api/jobs', { params });
  return response.data;
};

export const getJob = async (id) => {
  const response = await api.get(`/api/jobs/${id}`);
  return response.data;
};

export const createJob = async (data) => {
  const response = await api.post('/api/jobs', data);
  return response.data;
};

export const updateJob = async (id, data) => {
  const response = await api.put(`/api/jobs/${id}`, data);
  return response.data;
};

export const deleteJob = async (id) => {
  const response = await api.delete(`/api/jobs/${id}`);
  return response.data;
};

// Application API helper methods
export const getApplications = async (params = {}) => {
  const response = await api.get('/api/applications', { params });
  return response.data;
};

export const applyToJob = async (data) => {
  const response = await api.post('/api/applications', data);
  return response.data;
};

export const deleteApplication = async (id) => {
  const response = await api.delete(`/api/applications/${id}`);
  return response.data;
};

export const updateApplicationStatus = async (id, status) => {
  const response = await api.put(`/api/applications/${id}/status`, { status });
  return response.data;
};

export const bulkUpdateStatus = async (data) => {
  const response = await api.post('/api/applications/bulk-status', data);
  return response.data;
};

export const exportApplications = async (params = {}) => {
  const response = await api.get('/api/applications/export', { params, responseType: 'blob' });
  return response.data;
};

// Notes API helper methods
export const getNotes = async (applicationId) => {
  const response = await api.get(`/api/notes/${applicationId}`);
  return response.data;
};

export const addNote = async (data) => {
  const response = await api.post('/api/notes', data);
  return response.data;
};

export const updateNote = async (id, data) => {
  const response = await api.put(`/api/notes/${id}`, data);
  return response.data;
};

export const deleteNote = async (id) => {
  const response = await api.delete(`/api/notes/${id}`);
  return response.data;
};

// Interview API helper methods
export const getInterview = async (applicationId) => {
  const response = await api.get(`/api/interviews/${applicationId}`);
  return response.data;
};

export const scheduleInterview = async (data) => {
  const response = await api.post('/api/interviews', data);
  return response.data;
};

export const updateInterview = async (id, data) => {
  const response = await api.put(`/api/interviews/${id}`, data);
  return response.data;
};

export const cancelInterview = async (id) => {
  const response = await api.delete(`/api/interviews/cancel/${id}`);
  return response.data;
};

// Activities API helper methods
export const getActivityLogs = async () => {
  const response = await api.get('/api/activities');
  return response.data;
};

// Dashboard API helper method
export const getDashboardStats = async () => {
  const response = await api.get('/api/dashboard/stats');
  return response.data;
};

export default api;
