const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3036';
const apiBasePath = import.meta.env.VITE_API_BASE_PATH || '/api/v1';

export const apiConfig = {
  baseURL: `${apiBaseUrl}${apiBasePath}`,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
};

export const apiEndpoints = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    refresh: '/auth/refresh',
    logout: '/auth/logout',
    verifyEmail: '/auth/verify-email',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
  },
  categories: '/categories',
  transactions: '/transactions',
  wallets: '/wallets',
  budgets: '/budgets',
};
