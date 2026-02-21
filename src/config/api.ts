export const API = {
  // Authentication Endpoints
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REGISTER: '/auth/register',
  REFRESH_TOKEN: '/auth/refresh',
  VERIFY_EMAIL: '/auth/verify-email',

  // User Endpoints
  GET_ALL_USERS: '/users',
  GET_USER_BY_ID: '/users/:id',
  CREATE_USER: '/users',
  UPDATE_USER: '/users/:id',
  DELETE_USER: '/users/:id',
  GET_CURRENT_USER: '/users/current/profile',

  // Dashboard Endpoints
  GET_DASHBOARD_DATA: '/dashboard',
  GET_DASHBOARD_STATS: '/dashboard/stats',
  GET_DASHBOARD_CHARTS: '/dashboard/charts',

  // Content Endpoints
  GET_ALL_CONTENT: '/content',
  GET_CONTENT_BY_ID: '/content/:id',
  CREATE_CONTENT: '/content',
  UPDATE_CONTENT: '/content/:id',
  DELETE_CONTENT: '/content/:id',
  SEARCH_CONTENT: '/content/search',

  // Settings Endpoints
  GET_SETTINGS: '/settings',
  UPDATE_SETTINGS: '/settings',
  GET_USER_PREFERENCES: '/settings/preferences',
  UPDATE_USER_PREFERENCES: '/settings/preferences',
};
