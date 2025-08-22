import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { AUTH_CONFIG } from '../utils/constants';
import AuthService from '../services/authService';

// Create and export the AuthContext for direct access if needed
export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Clear authentication state
  const clearAuthState = useCallback(() => {
    localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
    setUser(null);
    setError(null);
    setIsLoading(false);
  }, []);

  // Load user profile from token with enhanced error handling
  const loadUserFromToken = useCallback(async (retryCount = 0) => {
    const token = localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
    if (!token) {
      setIsLoading(false);
      return false;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Loading user profile from token...');
      const userProfile = await AuthService.getProfile();
      
      console.log('User profile loaded successfully:', userProfile.email);
      setUser(userProfile);
      setError(null);
      return true;
      
    } catch (err) {
      console.error('Failed to load user profile:', err);
      
      // Handle different types of errors
      if (err.response?.status === 401) {
        console.log('Token is invalid or expired, clearing auth state');
        clearAuthState();
        return false;
      }
      
      // For network errors or temporary issues, retry once
      if (retryCount === 0 && (!err.response || err.response.status >= 500)) {
        console.log('Network error, retrying once...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        return loadUserFromToken(1);
      }
      
      // For other errors, clear auth state
      setError(err.message || 'Failed to load user profile');
      clearAuthState();
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [clearAuthState]);

  // Login with email and password
  const login = useCallback(async (email, password) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const data = await AuthService.login(email, password);
      if (data.token) {
        localStorage.setItem(AUTH_CONFIG.TOKEN_KEY, data.token);
        const success = await loadUserFromToken();
        if (!success) {
          throw new Error('Failed to load user profile after login');
        }
      }
      return data;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [loadUserFromToken]);

  // Logout
  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      await AuthService.logout();
    } catch (err) {
      console.error('Logout error:', err);
      // Continue with local logout even if server logout fails
    } finally {
      clearAuthState();
    }
  }, [clearAuthState]);

  // Login with OAuth2 token with enhanced error handling
  const loginWithToken = useCallback(async (token) => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (!token || token.trim() === '') {
        throw new Error('Invalid token provided');
      }
      
      console.log('Storing OAuth2 token and loading user profile...');
      localStorage.setItem(AUTH_CONFIG.TOKEN_KEY, token);
      
      const success = await loadUserFromToken();
      if (!success) {
        throw new Error('Failed to authenticate with provided token');
      }
      
      console.log('OAuth2 authentication completed successfully');
      return true;
      
    } catch (err) {
      console.error('OAuth2 token authentication failed:', err);
      setError(err.message || 'OAuth2 authentication failed');
      clearAuthState();
      throw err;
    }
  }, [loadUserFromToken, clearAuthState]);

  // Register a new user
  const registerUser = useCallback(async (userData) => {
    try {
      setIsLoading(true);
      setError(null);

      // Call the register method from your AuthService
      const responseData = await AuthService.register(userData);

      // Handle successful registration response
      // e.g., redirect to login or log in the user immediately
      
      return responseData;
    } catch (err) {
      setError(err.message || 'Registration failed');
      throw err; // Re-throw the error to be handled by the form component
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Refresh user profile
  const refreshUser = useCallback(async () => {
    return loadUserFromToken();
  }, [loadUserFromToken]);

  // Initialize authentication state on mount
  useEffect(() => {
    console.log('Initializing authentication state...');
    loadUserFromToken();
  }, [loadUserFromToken]);

  // Debug logging for authentication state changes
  useEffect(() => {
    console.log('Auth state changed:', {
      isAuthenticated: !!user,
      isLoading,
      hasError: !!error,
      userEmail: user?.email
    });
  }, [user, isLoading, error]);

  const value = {
    user,
    isLoading,
    error,
    login,
    logout,
    loginWithToken,
    refreshUser,
    isAuthenticated: !!user && !error,
    clearError: () => setError(null),
    registerUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}