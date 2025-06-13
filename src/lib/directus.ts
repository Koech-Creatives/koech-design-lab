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
  try {
    if (import.meta.env.DEV) {
      console.log('🔌 Testing Directus connection...');
    }
    const response = await fetch(`${directusUrl}/server/info`);
    const data = await response.json();
    logSuccess('Connection Test', data);
    return { success: true, data };
  } catch (error) {
    logError('Connection Test', error);
    return { success: false, error };
  }
};

export const directus = createDirectus<Schema>(directusUrl)
  .with(authentication())
  .with(rest());

// Auth helpers
export const auth = {
  login: async (email: string, password: string) => {
    try {
      if (import.meta.env.DEV) {
        console.log('🔐 Attempting login for:', email);
      }
      await directus.login(email, password);
      logSuccess('Login', { email });
      return { success: true };
    } catch (error) {
      logError('Login', error, { email });
      return { success: false, error: (error as any).message || 'Login failed' };
    }
  },

  register: async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      if (import.meta.env.DEV) {
        console.log('📝 Attempting registration for:', email);
      }

      const res = await fetch(`${directusUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          first_name: firstName,
          last_name: lastName
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData?.errors?.[0]?.message || res.statusText);
      }

      const data = await res.json();
      // data contains access_token, expires, refresh_token, user
      if (data?.data?.access_token) {
        await directus.setToken(data.data.access_token);
      }
      logSuccess('Registration', { email, userId: data?.data?.user?.id });
      return { success: true, user: data?.data?.user };
    } catch (error) {
      logError('Registration', error, { email, firstName, lastName });
      return { success: false, error: (error as any).message || 'Registration failed' };
    }
  },

  logout: async () => {
    try {
      if (import.meta.env.DEV) {
        console.log('🚪 Logging out...');
      }
      await directus.logout();
      logSuccess('Logout');
      return { success: true };
    } catch (error) {
      logError('Logout', error);
      return { success: false, error: (error as any).message || 'Logout failed' };
    }
  },

  getCurrentUser: async () => {
    try {
      if (import.meta.env.DEV) {
        console.log('👤 Getting current user...');
      }
      const user = await directus.request({
        method: 'GET',
        path: '/users/me'
      });
      logSuccess('Get Current User', { userId: user.id, email: user.email });
      return { success: true, user };
    } catch (error) {
      logError('Get Current User', error);
      return { success: false, error: (error as any).message || 'Failed to get user' };
    }
  },

  isAuthenticated: () => {
    const token = localStorage.getItem('directus_token');
    if (import.meta.env.DEV) {
      console.log('🔍 Checking authentication status:', !!token);
    }
    return !!token;
  }
};

// Brand helpers
export const brandAPI = {
  create: async (brandData: Omit<Brand, 'id' | 'date_created' | 'date_updated'>) => {
    try {
      if (import.meta.env.DEV) {
        console.log('🎨 Creating brand:', brandData.name);
      }
      const brand = await directus.request({
        method: 'POST',
        path: '/items/brands',
        body: brandData
      });
      logSuccess('Create Brand', { brandId: brand.id, name: brandData.name });
      return { success: true, brand };
    } catch (error) {
      logError('Create Brand', error, brandData);
      return { success: false, error: (error as any).message };
    }
  },

  update: async (id: string, updates: Partial<Brand>) => {
    try {
      if (import.meta.env.DEV) {
        console.log('🎨 Updating brand:', id);
      }
      const brand = await directus.request({
        method: 'PATCH',
        path: `/items/brands/${id}`,
        body: updates
      });
      logSuccess('Update Brand', { brandId: id });
      return { success: true, brand };
    } catch (error) {
      logError('Update Brand', error, { id, updates });
      return { success: false, error: (error as any).message };
    }
  },

  getByUser: async (userId: string) => {
    try {
      if (import.meta.env.DEV) {
        console.log('🎨 Getting brands for user:', userId);
      }
      const brands = await directus.request({
        method: 'GET',
        path: '/items/brands',
        params: {
          filter: { user_id: { _eq: userId } }
        }
      });
      logSuccess('Get User Brands', { userId, count: brands.length });
      return { success: true, brands };
    } catch (error) {
      logError('Get User Brands', error, { userId });
      return { success: false, error: (error as any).message };
    }
  }
};

// Project helpers
export const projectAPI = {
  create: async (projectData: Omit<Project, 'id' | 'date_created' | 'date_updated'>) => {
    try {
      if (import.meta.env.DEV) {
        console.log('📁 Creating project:', projectData.name);
      }
      const project = await directus.request({
        method: 'POST',
        path: '/items/projects',
        body: projectData
      });
      logSuccess('Create Project', { projectId: project.id, name: projectData.name });
      return { success: true, project };
    } catch (error) {
      logError('Create Project', error, projectData);
      return { success: false, error: (error as any).message };
    }
  },

  update: async (id: string, updates: Partial<Project>) => {
    try {
      if (import.meta.env.DEV) {
        console.log('📁 Updating project:', id);
      }
      const project = await directus.request({
        method: 'PATCH',
        path: `/items/projects/${id}`,
        body: updates
      });
      logSuccess('Update Project', { projectId: id });
      return { success: true, project };
    } catch (error) {
      logError('Update Project', error, { id, updates });
      return { success: false, error: (error as any).message };
    }
  },

  getByUser: async (userId: string) => {
    try {
      if (import.meta.env.DEV) {
        console.log('📁 Getting projects for user:', userId);
      }
      const projects = await directus.request({
        method: 'GET',
        path: '/items/projects',
        params: {
          filter: { user_id: { _eq: userId } }
        }
      });
      logSuccess('Get User Projects', { userId, count: projects.length });
      return { success: true, projects };
    } catch (error) {
      logError('Get User Projects', error, { userId });
      return { success: false, error: (error as any).message };
    }
  },

  delete: async (id: string) => {
    try {
      if (import.meta.env.DEV) {
        console.log('📁 Deleting project:', id);
      }
      await directus.request({
        method: 'DELETE',
        path: `/items/projects/${id}`
      });
      logSuccess('Delete Project', { projectId: id });
      return { success: true };
    } catch (error) {
      logError('Delete Project', error, { id });
      return { success: false, error: (error as any).message };
    }
  }
};

// Debug utilities
export const debugUtils = {
  // Get all stored error logs
  getErrorLogs: () => {
    try {
      return JSON.parse(localStorage.getItem('directus_error_logs') || '[]');
    } catch (e) {
      return [];
    }
  },

  // Clear error logs
  clearErrorLogs: () => {
    localStorage.removeItem('directus_error_logs');
    if (import.meta.env.DEV) {
      console.log('🧹 Error logs cleared');
    }
  },

  // Test all API endpoints
  testAllEndpoints: async () => {
    if (import.meta.env.DEV) {
      console.group('🧪 Testing All Endpoints');
    }
    
    const results = {
      connection: await testConnection(),
      // Add more tests as needed
    };
    
    if (import.meta.env.DEV) {
      console.groupEnd();
    }
    return results;
  },

  // Get Directus server info
  getServerInfo: async () => {
    try {
      const response = await fetch(`${directusUrl}/server/info`);
      const data = await response.json();
      if (import.meta.env.DEV) {
        console.log('🖥️ Directus Server Info:', data);
      }
      return data;
    } catch (error) {
      logError('Get Server Info', error);
      return null;
    }
  }
};

// Initialize connection test on load (development only)
if (typeof window !== 'undefined') {
  if (import.meta.env.DEV) {
    console.log('🚀 Directus client initialized');
    console.log('📍 Directus URL:', directusUrl);
  }
  
  // Only test connection in development to reduce production noise
  // Uncomment when Directus CORS is properly configured
  // if (import.meta.env.DEV) {
  //   testConnection().then(result => {
  //     if (!result.success) {
  //       console.warn('⚠️ Initial connection test failed. Check your Directus setup.');
  //     }
  //   });
  // }
}

export default directus;

export { logError, logSuccess }; 