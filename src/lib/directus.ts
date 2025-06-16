// @ts-nocheck
// eslint-disable

import { createDirectus, rest, authentication } from '@directus/sdk';

// Define the schema for our Directus collections
interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  date_created: string;
  last_access: string;
}

interface Brand {
  id: string;
  user_id: string;
  name: string;
  colors: Array<{ name: string; hex: string }>;
  fonts: Array<{ name: string; url: string; family: string }>;
  logo?: string;
  date_created: string;
  date_updated: string;
}

interface Project {
  id: string;
  user_id: string;
  brand_id?: string;
  name: string;
  platform: string;
  format: {
    name: string;
    width: number;
    height: number;
  };
  pages: Array<{
    id: string;
    name: string;
    elements: any[];
  }>;
  current_page_id: string;
  thumbnail?: string;
  date_created: string;
  date_updated: string;
}

interface Schema {
  directus_users: User[];
  brands: Brand[];
  projects: Project[];
}

// Create Directus client
const directusUrl = import.meta.env.VITE_DIRECTUS_URL || 'https://koech-labs.onrender.com';

// Enhanced error logging utility
const logError = (operation: string, error: any, context?: any) => {
  const errorInfo = {
    operation,
    timestamp: new Date().toISOString(),
    error: {
      message: error?.message || 'Unknown error',
      status: error?.response?.status || error?.status,
      statusText: error?.response?.statusText || error?.statusText,
      data: error?.response?.data || error?.data,
      url: error?.config?.url || error?.url,
      method: error?.config?.method || error?.method
    },
    context,
    stack: import.meta.env.DEV ? error?.stack : undefined // Only include stack in development
  };
  
  // Only show detailed logs in development
  if (import.meta.env.DEV) {
    console.group(`🔴 Directus Error: ${operation}`);
    console.error('Error Details:', errorInfo);
    console.error('Raw Error:', error);
    console.groupEnd();
  } else {
    // In production, just log the basic error
    console.error(`Directus Error (${operation}):`, error?.message || 'Unknown error');
  }
  
  // Store error logs for debugging (limit to prevent memory issues)
  try {
    const existingLogs = JSON.parse(localStorage.getItem('directus_error_logs') || '[]');
    existingLogs.push(errorInfo);
    // Keep only last 10 errors
    if (existingLogs.length > 10) {
      existingLogs.splice(0, existingLogs.length - 10);
    }
    localStorage.setItem('directus_error_logs', JSON.stringify(existingLogs));
  } catch (e) {
    // Ignore localStorage errors in production
    if (import.meta.env.DEV) {
      console.warn('Failed to store error log:', e);
    }
  }

  // Send to dev server for terminal output in development only
  if (typeof window !== 'undefined' && import.meta.env.DEV) {
    fetch('/__debug', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(errorInfo)
    }).catch(() => {/* ignore */});
  }
  
  return errorInfo;
};

// Enhanced success logging
const logSuccess = (operation: string, data?: any) => {
  if (import.meta.env.DEV) {
    console.log(`✅ Directus Success: ${operation}`, data);
  }
};

// Test connection utility
export const testConnection = async () => {
  return { success: false, error: 'Directus disabled - using Supabase directly' };
};

export const directus = null;

// Auth helpers
export const auth = {
  login: async () => ({ success: false, error: 'Directus disabled' }),
  register: async () => ({ success: false, error: 'Directus disabled' }),
  logout: async () => ({ success: false, error: 'Directus disabled' }),
  getCurrentUser: async () => ({ success: false, error: 'Directus disabled' }),
  isAuthenticated: () => false
};

// Brand helpers
export const brandAPI = {
  create: async () => ({ success: false, error: 'Directus disabled' }),
  update: async () => ({ success: false, error: 'Directus disabled' }),
  getByUserId: async () => ({ success: false, error: 'Directus disabled' })
};

// Project helpers
export const projectAPI = {
  create: async () => ({ success: false, error: 'Directus disabled' }),
  update: async () => ({ success: false, error: 'Directus disabled' }),
  getByUserId: async () => ({ success: false, error: 'Directus disabled' }),
  delete: async () => ({ success: false, error: 'Directus disabled' })
};

// Debug utilities
export const debugUtils = {
  getErrorLogs: () => [],
  clearErrorLogs: () => true,
  getConnectionInfo: async () => ({ success: false, error: 'Directus disabled' }),
  getServerInfo: async () => { throw new Error('Directus disabled'); }
};

// Initialize client
if (import.meta.env.DEV) {
  console.log('🚀 Directus client initialized');
  console.log('📍 Directus URL:', directusUrl);
  
  // Test connection on initialization (only in dev)
  // Uncomment when Directus CORS is properly configured
  // testConnection().catch(() => {
  //   if (import.meta.env.DEV) {
  //     console.warn('⚠️ Initial connection test failed. Check your Directus setup.');
  //   }
  // });
}

export default directus;

export { logError, logSuccess }; 