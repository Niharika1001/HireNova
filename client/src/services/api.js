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
export const getApplications = async () => {
  const response = await api.get('/api/applications');
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

// Dashboard API helper method
export const getDashboardStats = async () => {
  const response = await api.get('/api/dashboard/stats');
  return response.data;
};

export default api;
