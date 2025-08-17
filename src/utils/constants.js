/**
 * API Configuration - FIXED: Correct environment variables and URL structure
 */
export const API_CONFIG = {
  // FIXED: Don't add /api here since we add it in individual endpoints
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  TIMEOUT: 10000, // 10 seconds
  VERSION: 'v1',
};

/**
 * Backend Configuration - FIXED: Use correct VITE_ variables
 */
export const BACKEND_CONFIG = {
  BASE_URL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080',
  GOOGLE_AUTH_URL: (import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080') + '/oauth2/authorization/google',
};

/**
 * Authentication Constants
 */
export const AUTH_CONFIG = {
  TOKEN_KEY: 'warranty_tracker_token',
  REFRESH_TOKEN_KEY: 'warranty_tracker_refresh_token',
  TOKEN_EXPIRY_KEY: 'warranty_tracker_token_expiry',
};

/**
 * File Upload Configuration
 */
export const FILE_CONFIG = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'],
  MAX_FILES: 5,
  ALLOWED_TYPES_TEXT: 'PDF, JPG, JPEG, PNG',
};

/**
 * Warranty Status Configuration
 */
export const WARRANTY_STATUS = {
  ACTIVE: 'active',
  EXPIRING_SOON: 'expiring-soon',
  EXPIRED: 'expired',
  UNKNOWN: 'unknown',
};

export const WARRANTY_STATUS_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: WARRANTY_STATUS.ACTIVE, label: 'Active' },
  { value: WARRANTY_STATUS.EXPIRING_SOON, label: 'Expiring Soon' },
  { value: WARRANTY_STATUS.EXPIRED, label: 'Expired' },
  { value: WARRANTY_STATUS.UNKNOWN, label: 'Unknown' },
];

/**
 * Date Formats
 */
export const DATE_FORMATS = {
  DISPLAY: 'MMM d, yyyy',
  INPUT: 'yyyy-MM-dd',
  API: 'yyyy-MM-dd\'T\'HH:mm:ss.SSSxxx',
};

/**
 * Pagination Configuration
 */
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
};

/**
 * Theme Configuration
 */
export const THEME_CONFIG = {
  STORAGE_KEY: 'warranty_tracker_theme',
  DARK: 'dark',
  LIGHT: 'light',
};

/**
 * Navigation Configuration
 */
export const NAV_CONFIG = {
  SIDEBAR_WIDTH: 280,
  MOBILE_BREAKPOINT: 768,
  ITEMS: [
    { path: '/', label: 'Dashboard', icon: 'LayoutDashboard' },
    { path: '/devices', label: 'Devices', icon: 'Package' },
    { path: '/profile', label: 'Profile', icon: 'User' },
  ],
};

/**
 * Error Messages
 */
export const ERROR_MESSAGES = {
  GENERIC: 'An error occurred. Please try again.',
  NETWORK: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION: 'Please check your input and try again.',
  FILE_SIZE: `File size must be less than ${FILE_CONFIG.MAX_FILE_SIZE / 1024 / 1024}MB`,
  FILE_TYPE: `Only ${FILE_CONFIG.ALLOWED_TYPES_TEXT} files are allowed`,
  MAX_FILES: `Maximum ${FILE_CONFIG.MAX_FILES} files allowed`,
  AUTH_FAILED: 'Authentication failed. Please try again.',
  TOKEN_EXPIRED: 'Your session has expired. Please sign in again.',
};

/**
 * Local Storage Keys
 */
export const STORAGE_KEYS = {
  THEME: THEME_CONFIG.STORAGE_KEY,
  AUTH_TOKEN: AUTH_CONFIG.TOKEN_KEY,
  REFRESH_TOKEN: AUTH_CONFIG.REFRESH_TOKEN_KEY,
  TOKEN_EXPIRY: AUTH_CONFIG.TOKEN_EXPIRY_KEY,
  USER_PREFERENCES: 'warranty_tracker_preferences',
  OAUTH2_REDIRECT_PATH: 'oauth2_redirect_path',
};

/**
 * Animation Configuration
 */
export const ANIMATION_CONFIG = {
  DURATION: 200,
  EASING: 'ease-in-out',
};

/**
 * Chart Colors
 */
export const CHART_COLORS = {
  active: '#10B981', // green
  expiringSoon: '#F59E0B', // yellow
  expired: '#EF4444', // red
  unknown: '#6B7280', // gray
};

/**
 * OAuth2 Configuration
 */
export const OAUTH2_CONFIG = {
  REDIRECT_PATH_KEY: STORAGE_KEYS.OAUTH2_REDIRECT_PATH,
  SUCCESS_REDIRECT: '/dashboard',
  ERROR_REDIRECT: '/login',
};