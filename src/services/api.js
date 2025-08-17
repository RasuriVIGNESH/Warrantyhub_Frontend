import axios from 'axios';
import { AUTH_CONFIG, API_CONFIG, ERROR_MESSAGES } from '../utils/constants';

// Use configurable API URL from constants
const API_URL = API_CONFIG.BASE_URL;

const api = axios.create({
  baseURL: API_URL,
  timeout: API_CONFIG.TIMEOUT,
});

// Add request interceptor to attach token
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem(AUTH_CONFIG.TOKEN_KEY); 
    console.log('API Request:', {
      url: config.url,
      method: config.method?.toUpperCase(),
      hasToken: !!token,
      baseURL: config.baseURL
    });
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Enhanced response interceptor with better error handling
api.interceptors.response.use(
  response => {
    console.log('API Response Success:', {
      url: response.config.url,
      status: response.status,
      method: response.config.method?.toUpperCase()
    });
    return response;
  },
  error => {
    console.error('API Response Error:', {
      url: error.config?.url,
      status: error.response?.status,
      method: error.config?.method?.toUpperCase(),
      message: error.message,
      data: error.response?.data
    });

    // Handle different error scenarios
    if (error.response?.status === 401) {
      console.log('Unauthorized request, clearing auth state');
      localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
      
      const currentPath = window.location.pathname;
      
      // Prevent redirect loops during OAuth2 flow and auth pages
      const authPaths = ['/login', '/register', '/oauth2/redirect', '/forgot-password', '/reset-password'];
      const isAuthPath = authPaths.some(path => currentPath.startsWith(path));
      
      if (!isAuthPath) {
        console.log('Redirecting to login due to 401 error');
        // Store current path for redirect after login
        sessionStorage.setItem('oauth2_redirect_path', currentPath);
        window.location.href = '/login';
      }
    } else if (error.response?.status === 403) {
      console.error('Forbidden request - insufficient permissions');
    } else if (error.response?.status >= 500) {
      console.error('Server error - please try again later');
    } else if (!error.response) {
      console.error('Network error - please check your connection');
    }

    // Enhance error object with user-friendly messages
    if (error.response?.status === 401) {
      error.userMessage = ERROR_MESSAGES.UNAUTHORIZED;
    } else if (error.response?.status === 404) {
      error.userMessage = ERROR_MESSAGES.NOT_FOUND;
    } else if (error.response?.status >= 500) {
      error.userMessage = 'Server error. Please try again later.';
    } else if (!error.response) {
      error.userMessage = ERROR_MESSAGES.NETWORK;
    } else {
      error.userMessage = error.response?.data?.message || ERROR_MESSAGES.GENERIC;
    }

    return Promise.reject(error);
  }
);

export default api;

