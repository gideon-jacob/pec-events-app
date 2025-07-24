import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Create axios instance
const api = axios.create({
  baseURL: 'http://YOUR_BACKEND_IP:5000/api', // Replace with your backend URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    // Get token from secure storage
    const token = await SecureStore.getItemAsync('auth_token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      // Clear auth data
      await SecureStore.deleteItemAsync('auth_token');
      // You might want to redirect to login here
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: (email: string, password: string) => 
    api.post('/auth/login', { email, password }),
  
  register: (name: string, email: string, password: string) =>
    api.post('/auth/register', { name, email, password }),
  
  logout: () => api.post('/auth/logout'),
};

// Notifications API
export const notificationApi = {
  getNotifications: (params?: { page?: number; limit?: number }) => 
    api.get('/notifications', { params }),
  
  markAsRead: (id: string) => 
    api.patch(`/notifications/${id}/read`),
  
  markAllAsRead: () => 
    api.patch('/notifications/read-all'),
  
  deleteNotification: (id: string) => 
    api.delete(`/notifications/${id}`),
  
  registerDevice: (token: string) => 
    api.post('/notifications/register-device', { token }),
};

export default api;
