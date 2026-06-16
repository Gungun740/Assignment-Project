import api from './client';

export const authApi = {
  register: (data) => api.post('/api/v1/auth/register', data),
  login:    (data) => api.post('/api/v1/auth/login', data),
  refresh:  (refreshToken) => api.post('/api/v1/auth/refresh', { refreshToken }),
  me:       () => api.get('/api/v1/users/me'),
};