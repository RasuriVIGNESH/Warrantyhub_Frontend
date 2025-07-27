import api from './api';

const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh-token',
  PROFILE: '/auth/profile',
  USER_PROFILE_UPDATE: '/users/profile',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
}

class AuthService {
  async login(email, password) {
    const response = await api.post(AUTH_ENDPOINTS.LOGIN, { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  }

  async register(userData) {
    const response = await api.post(AUTH_ENDPOINTS.REGISTER, userData);
    return response.data;
  }

  async logout() {
    try {
      await api.post(AUTH_ENDPOINTS.LOGOUT);
    } finally {
      localStorage.removeItem('token');
    }
  }

  async getProfile() {
    const response = await api.get(AUTH_ENDPOINTS.PROFILE);
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
    return localStorage.getItem('token');
  }

  isAuthenticated() {
    return !!this.getToken();
  }
}

export default new AuthService(); 