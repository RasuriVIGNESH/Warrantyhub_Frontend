import api from './api';
import { AUTH_CONFIG } from '../utils/constants';

const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh-token',
  PROFILE: '/api/auth/profile',  // FIXED: Use AuthController's profile endpoint instead of UserController
  USER_PROFILE_UPDATE: '/users/profile',  // Keep this for UserController's update method
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
}

class AuthService {
  async login(email, password) {
    const response = await api.post(AUTH_ENDPOINTS.LOGIN, { email, password });
    if (response.data.token) {
      // Use the constant token key
      localStorage.setItem(AUTH_CONFIG.TOKEN_KEY, response.data.token);
    }
    return response.data;
  }

  async logout() {
    try {
      await api.post(AUTH_ENDPOINTS.LOGOUT);
    } finally {
      // Use the constant token key
      localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
    }
  } 
  
  async register(userData) {
    const response = await api.post(AUTH_ENDPOINTS.REGISTER, userData);
    return response.data;
  }

  async getProfile() {
    console.log('AuthService.getProfile() - Making request to:', AUTH_ENDPOINTS.PROFILE);
    console.log('AuthService.getProfile() - Full URL will be:', api.defaults.baseURL + AUTH_ENDPOINTS.PROFILE);
    const response = await api.get(AUTH_ENDPOINTS.PROFILE);
    console.log('AuthService.getProfile() - Response received:', response.data);
    return response.data;
  }

  async updateProfile(profileData) {
    const response = await api.put(AUTH_ENDPOINTS.USER_PROFILE_UPDATE, profileData);
    return response.data;
  }

  async forgotPassword(email) {
    const response = await api.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, { email });
    return response.data;
  }

  async resetPassword(token, password) {
    const response = await api.post(AUTH_ENDPOINTS.RESET_PASSWORD, { token, password });
    return response.data;
  }

  getToken() {
    return localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
  }

  isAuthenticated() {
    return !!this.getToken();
  }
}

export default new AuthService();

