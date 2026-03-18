import axios from 'axios';

const api = axios.create({
  baseURL: `http://${window.location.hostname}:3333/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratar erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (data: any) =>
    api.post('/auth/register', data),
  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),
  resetPassword: (token: string, newPassword: string) =>
    api.post('/auth/reset-password', { token, newPassword }),
};

// Customers
export const customersAPI = {
  list: (params?: any) =>
    api.get('/customers', { params }),
  getById: (id: string) =>
    api.get(`/customers/${id}`),
  create: (data: any) =>
    api.post('/customers', data),
  update: (id: string, data: any) =>
    api.put(`/customers/${id}`, data),
  delete: (id: string) =>
    api.delete(`/customers/${id}`),
  getConversations: (id: string) =>
    api.get(`/customers/${id}/conversations`),
  addNote: (id: string, note: string) =>
    api.post(`/customers/${id}/notes`, { note }),
};

// Notifications
export const notificationsAPI = {
  list: (filter?: string) =>
    api.get('/notifications', { params: { filter } }),
  markAsRead: (id: string) =>
    api.put(`/notifications/${id}/read`),
  markAllAsRead: () =>
    api.put('/notifications/read-all'),
  clearAll: () =>
    api.delete('/notifications'),
};

// User Profile
export const userAPI = {
  getProfile: () =>
    api.get('/users/profile'),
  updateProfile: (data: any) =>
    api.put('/users/profile', data),
  changePassword: (currentPassword: string, newPassword: string) =>
    api.put('/users/password', { currentPassword, newPassword }),
  uploadAvatar: (avatarUrl: string) =>
    api.post('/users/avatar', { avatarUrl }),
  deleteAccount: () =>
    api.delete('/users/account'),
};

// Conversations
export const conversationsAPI = {
  list: () =>
    api.get('/conversations'),
  create: (customerId: string) =>
    api.post('/conversations', { customerId }),
  getById: (id: string) =>
    api.get(`/conversations/${id}`),
  assign: (id: string, userId: string) =>
    api.patch(`/conversations/${id}/assign`, { userId }),
  close: (id: string) =>
    api.patch(`/conversations/${id}/close`),
};

// Messages
export const messagesAPI = {
  send: (data: any) =>
    api.post('/messages/send', data),
  getHistory: (conversationId: string) =>
    api.get(`/messages/${conversationId}`),
};

// Analytics
export const analyticsAPI = {
  getConversationLogs: (conversationId: string) =>
    api.get(`/analytics/conversations/${conversationId}/logs`),
  getUserActivity: (userId: string) =>
    api.get(`/analytics/users/${userId}/activity`),
  getEventStats: (event: string) =>
    api.get(`/analytics/events/${event}`),
};

export default api;
