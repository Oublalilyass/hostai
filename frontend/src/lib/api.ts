// frontend/src/lib/api.ts
// Axios API client with auth token injection

import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Safe cookie getter (client-side only)
const getToken = (): string | null => {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/(^| )hostai_token=([^;]+)/);
  return match ? decodeURIComponent(match[2]) : null;
};

// Inject JWT token on every request
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally - redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof document !== 'undefined') {
        document.cookie = 'hostai_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
        document.cookie = 'hostai_user=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// ── Auth ──────────────────────────────────────────────────────
export const authAPI = {
  login:         (data: object) => api.post('/auth/login', data),
  register:      (data: object) => api.post('/auth/register', data),
  me:            ()             => api.get('/auth/me'),
  updateProfile: (data: object) => api.put('/auth/profile', data),
};

// ── Properties ────────────────────────────────────────────────
export const propertiesAPI = {
  list:   ()                    => api.get('/properties'),
  get:    (id: string)          => api.get(`/properties/${id}`),
  create: (data: object)        => api.post('/properties', data),
  update: (id: string, data: object) => api.put(`/properties/${id}`, data),
  delete: (id: string)          => api.delete(`/properties/${id}`),
};

// ── Bookings ──────────────────────────────────────────────────
export const bookingsAPI = {
  list:   (params?: object)     => api.get('/bookings', { params }),
  get:    (id: string)          => api.get(`/bookings/${id}`),
  create: (data: object)        => api.post('/bookings', data),
  update: (id: string, data: object) => api.put(`/bookings/${id}`, data),
  delete: (id: string)          => api.delete(`/bookings/${id}`),
};

// ── AI ────────────────────────────────────────────────────────
export const aiAPI = {
  generate: (data: object)      => api.post('/ai/generate', data),
  messages: (params?: object)   => api.get('/ai/messages', { params }),
  chat:     (data: object)      => api.post('/ai/chat', data),
};

// ── Cleaning ──────────────────────────────────────────────────
export const cleaningAPI = {
  list:   (params?: object)     => api.get('/cleaning', { params }),
  create: (data: object)        => api.post('/cleaning', data),
  update: (id: string, data: object) => api.put(`/cleaning/${id}`, data),
  delete: (id: string)          => api.delete(`/cleaning/${id}`),
};

// ── Dashboard & Notifications ─────────────────────────────────
export const dashboardAPI = {
  stats:       ()               => api.get('/dashboard/stats'),
  notifications:()              => api.get('/notifications'),
  markRead:    (id: string)     => api.put(`/notifications/${id}/read`),
  markAllRead: ()               => api.put('/notifications/read-all'),
};

// ── Review Requests ───────────────────────────────────────────
export const reviewsAPI = {
  list:         (params?: object)          => api.get('/reviews', { params }),
  generate:     (data: object)             => api.post('/reviews/generate', data),
  bulkGenerate: (data: object)             => api.post('/reviews/bulk-generate', data),
  send:         (id: string)               => api.post(`/reviews/${id}/send`),
  update:       (id: string, data: object) => api.put(`/reviews/${id}`, data),
  delete:       (id: string)               => api.delete(`/reviews/${id}`),
};
