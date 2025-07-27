import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { AUTH_CONFIG } from '../utils/constants';
import AuthService from '../services/authService';

export const AuthContext = createContext(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadUserFromToken = useCallback(async () => {
    const token = localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
    if (token) {
      try {
        const userProfile = await AuthService.getProfile();
        setUser(userProfile);
      } catch (err) {
        // If token is invalid, remove it
        localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadUserFromToken();
  }, [loadUserFromToken]);

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await AuthService.login(email, password);
      localStorage.setItem(AUTH_CONFIG.TOKEN_KEY, response.token);
      // Fetch user profile after login
      const userProfile = await AuthService.getProfile();
      setUser(userProfile);
      return true;
    } catch (err) {
      setError(err.message || 'Login failed');
      setUser(null);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // OPTION 1: Register without auto-login (user must login after registration)
  const register = async (userData) => {
    setIsLoading(true);
    setError(null);
    try {
      // Clear any existing authentication state first
      clearAuthState();
      
      const response = await AuthService.register(userData);
      // DON'T store token or set user - let them login manually
      return true;
    } catch (err) {
      setError(err.message || 'Registration failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // OPTION 2: Register with auto-login (user goes directly to dashboard)
  const registerWithAutoLogin = async (userData) => {
    setIsLoading(true);
    setError(null);
    try {
      // Clear any existing authentication state first
      clearAuthState();
      
      const response = await AuthService.register(userData);
      
      // If registration successful and returns a token, auto-login
      if (response.token) {
        localStorage.setItem(AUTH_CONFIG.TOKEN_KEY, response.token);
        const userProfile = await AuthService.getProfile();
        setUser(userProfile);
        return true;
      } else {
        // If no token returned, try to login with provided credentials
        // Use direct login without calling the login function to avoid setting isLoading twice
        try {
          const loginResponse = await AuthService.login(userData.email, userData.password);
          localStorage.setItem(AUTH_CONFIG.TOKEN_KEY, loginResponse.token);
          const userProfile = await AuthService.getProfile();
          setUser(userProfile);
          return true;
        } catch (loginErr) {
          setError(loginErr.message || 'Auto-login failed after registration');
          return false;
        }
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
      setUser(null);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const clearAuthState = () => {
    localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
    setUser(null);
    setError(null);
  };

  const logout = () => {
    clearAuthState();
  };

  const updateProfile = async (profileData) => {
    try {
      const updatedUser = await AuthService.updateProfile(profileData);
      setUser(updatedUser);
      return true;
    } catch (err) {
      setError(err.message || 'Failed to update profile');
      return false;
    }
  };

  const forgotPassword = async (email) => {
    setIsLoading(true);
    setError(null);
    try {
      await AuthService.forgotPassword(email);
      return true;
    } catch (err) {
      setError(err.message || 'Failed to send reset email');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (token, password) => {
    setIsLoading(true);
    setError(null);
    try {
      await AuthService.resetPassword(token, password);
      return true;
    } catch (err) {
      setError(err.message || 'Failed to reset password');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoading,
    error,
    login,
    register, // Use this for "register then login" flow
    registerWithAutoLogin, // Use this for "register and auto-login" flow
    logout,
    updateProfile,
    forgotPassword,
    resetPassword,
    isAuthenticated: !!user,
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};