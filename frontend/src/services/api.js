import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('cem_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, (error) => Promise.reject(error));

// Handle 401 globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('cem_token');
      localStorage.removeItem('cem_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getMe: () => API.get('/auth/me'),
  logout: () => API.post('/auth/logout'),
};

// Event APIs
export const eventAPI = {
  getAll: (params) => API.get('/events', { params }),
  getOne: (id) => API.get(`/events/${id}`),
  create: (data) => API.post('/events', data),
  update: (id, data) => API.put(`/events/${id}`, data),
  delete: (id) => API.delete(`/events/${id}`),
  addFeedback: (id, data) => API.post(`/events/${id}/feedback`, data),
  getStats: () => API.get('/events/stats'),
};

// Registration APIs
export const registrationAPI = {
  register: (data) => API.post('/registrations', data),
  getAll: () => API.get('/registrations'),
  getByEvent: (eventId) => API.get(`/registrations/event/${eventId}`),
  cancel: (id) => API.delete(`/registrations/${id}`),
  markAttendance: (id) => API.put(`/registrations/${id}/attend`),
};

// User APIs
export const userAPI = {
  getAll: () => API.get('/users'),
  getOne: (id) => API.get(`/users/${id}`),
  updateProfile: (id, data) => API.put(`/users/${id}`, data),
  changePassword: (id, data) => API.put(`/users/${id}/change-password`, data),
  getRegistrations: (id) => API.get(`/users/${id}/registrations`),
  getNotifications: (id) => API.get(`/users/${id}/notifications`),
  markNotificationRead: (userId, notifId) => API.put(`/users/${userId}/notifications/${notifId}`),
  deleteUser: (id) => API.delete(`/users/${id}`),
};

// Notification APIs
export const notificationAPI = {
  broadcast: (data) => API.post('/notifications/broadcast', data),
};

export default API;
