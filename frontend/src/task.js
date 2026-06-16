import api from './client';

export const tasksApi = {
  getAll: (params) => api.get('/api/v1/tasks', { params }),
  getOne: (id) => api.get(`/api/v1/tasks/${id}`),
  create: (data) => api.post('/api/v1/tasks', data),
  update: (id, data) => api.put(`/api/v1/tasks/${id}`, data),
  delete: (id) => api.delete(`/api/v1/tasks/${id}`),
  search: (keyword, params) => api.get('/api/v1/tasks/search', { params: { keyword, ...params } }),

  // Admin
  adminGetAll: (params) => api.get('/api/v1/admin/tasks', { params }),
};