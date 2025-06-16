// @ts-nocheck
// eslint-disable

import { createClient, SupabaseClient, Session } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Validation
if (!supabaseUrl || supabaseUrl === 'https://your-project-id.supabase.co') {
  console.warn('⚠️ VITE_SUPABASE_URL not configured. Please add your Supabase URL to environment variables');
}
if (!supabaseKey || supabaseKey === 'your-anon-key-here') {
  console.warn('⚠️ VITE_SUPABASE_ANON_KEY not configured. Please add your Supabase anonymous key to environment variables');
}

// Production validation
if (import.meta.env.PROD && (!supabaseUrl || !supabaseKey || supabaseUrl.includes('placeholder'))) {
  console.error('🔴 Production build requires valid Supabase configuration');
}

export const supabase: SupabaseClient = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder-key'
);

// -------- Logging helpers (similar to Directus) ------------

const postDebug = (data: any) => {
  if (typeof window !== 'undefined' && import.meta.env.DEV) {
    fetch('/__debug', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).catch(() => {/* ignore */});
  }
};

const logSuccess = (operation: string, data?: any) => {
  if (import.meta.env.DEV) {
    console.log(`✅ Supabase Success: ${operation}`, data);
  }
  postDebug({ type: 'supabase', level: 'success', operation, data, timestamp: new Date().toISOString() });
};

const logError = (operation: string, error: any, context?: any) => {
  const errorInfo = {
    type: 'supabase',
    level: 'error',
    operation,
    error: {
      message: error?.message || 'Unknown error',
      code: error?.code,
      name: error?.name,
      details: error?.details,
      hint: error?.hint,
      fullError: JSON.stringify(error, null, 2)
    },
    context,
    timestamp: new Date().toISOString()
  };
  
  if (import.meta.env.DEV) {
    console.error('🔴 Supabase Error:', errorInfo);
  }
  
  postDebug(errorInfo);
  return errorInfo;
};

// -------- Authentication helpers --------

export const supabaseAuth = {
  login: async (email: string, password: string) => {
    try {
      console.log('🔍 [SUPABASE] Login attempt:', { email });
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        console.error('🔴 [SUPABASE] Login error:', error);
        throw error;
      }
      
      console.log('✅ [SUPABASE] Login successful:', { 
        email, 
        userId: data.user?.id,
        hasSession: !!data.session 
      });
      logSuccess('Login', { email, userId: data.user?.id });
      return { success: true, user: data.user, session: data.session };
    } catch (error: any) {
      console.error('🔴 [SUPABASE] Login failed:', {
        message: error.message,
        code: error.code,
        email
      });
      logError('Login', error, { email });
      return { success: false, error: error.message || 'Login failed' };
    }
  },

  register: async (email: string, password: string, firstName: string, lastName: string, phone?: string) => {
    try {
      console.log('🔍 [SUPABASE] Registration attempt:', { 
        email, 
        firstName, 
        lastName, 
        hasPhone: !!phone,
        phone: phone ? `${phone.substring(0, 3)}***` : 'Not provided'
      });

      // Prepare user metadata
      const userMetadata: any = {
        first_name: firstName,
        last_name: lastName,
        full_name: `${firstName} ${lastName}`.trim()
      };

      // Add phone if provided
      if (phone && phone.trim()) {
        // Clean phone number (remove spaces, dashes, parentheses)
        const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
        userMetadata.phone = cleanPhone;
        console.log('📱 [SUPABASE] Phone number added:', { 
          original: phone, 
          cleaned: cleanPhone 
        });
      }

      console.log('🔍 [SUPABASE] User metadata prepared:', userMetadata);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userMetadata
        }
      });
      
      if (error) {
        console.error('🔴 [SUPABASE] Registration error:', {
          message: error.message,
          code: error.code,
          name: error.name,
          details: error.details,
          hint: error.hint,
          email,
          firstName,
          lastName,
          fullError: JSON.stringify(error, null, 2)
        });
        
        // If it's a "Database error saving new user", it might be a trigger issue
        // Provide specific guidance
        if (error.message === 'Database error saving new user') {
          console.error('🔧 [SUPABASE] This error suggests the database trigger is not working.');
          console.error('🔧 [SUPABASE] Please run the database-setup.sql script in Supabase SQL editor.');
          throw new Error('Database setup incomplete. Please run the setup script and try again.');
        }
        
        throw error;
      }
      
      console.log('✅ [SUPABASE] Registration successful:', { 
        email, 
        userId: data.user?.id,
        needsConfirmation: !data.user?.email_confirmed_at,
        userMetadata: data.user?.user_metadata
      });

      logSuccess('Registration', { 
        email, 
        userId: data.user?.id, 
        firstName, 
        lastName,
        hasPhone: !!phone
      });
      
      return { success: true, user: data.user };
    } catch (error: any) {
      console.error('🔴 [SUPABASE] Registration failed:', {
        message: error.message,
        code: error.code,
        name: error.name,
        details: error.details,
        hint: error.hint,
        email,
        firstName,
        lastName,
        hasPhone: !!phone,
        fullError: JSON.stringify(error, null, 2)
      });
      
      logError('Registration', error, { 
        email, 
        firstName, 
        lastName,
        hasPhone: !!phone
      });
      
      return { success: false, error: error.message || 'Registration failed' };
    }
  },

  // Social Authentication
  signInWithGoogle: async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });
      
      if (error) throw error;
      
      logSuccess('Google Sign In', { provider: 'google' });
      return { success: true, data };
    } catch (error) {
      logError('Google Sign In', error);
      return { success: false, error: (error as any).message || 'Google sign in failed' };
    }
  },

  signInWithGithub: async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) throw error;
      
      logSuccess('GitHub Sign In', { provider: 'github' });
      return { success: true, data };
    } catch (error) {
      logError('GitHub Sign In', error);
      return { success: false, error: (error as any).message || 'GitHub sign in failed' };
    }
  },

  // Magic Link Authentication
  signInWithMagicLink: async (email: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) throw error;
      
      logSuccess('Magic Link Sent', { email });
      return { success: true, data };
    } catch (error) {
      logError('Magic Link', error, { email });
      return { success: false, error: (error as any).message || 'Failed to send magic link' };
    }
  },

  logout: async () => {
    try {
      // First check if there's an active session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.warn('🔍 [SUPABASE] Session check error during logout:', sessionError);
      }
      
      if (!session) {
        console.log('🔍 [SUPABASE] No active session to logout from');
        logSuccess('Logout', { note: 'No active session' });
        return { success: true };
      }
      
      console.log('🔍 [SUPABASE] Logging out user:', { userId: session.user?.id });
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      logSuccess('Logout');
      return { success: true };
    } catch (error: any) {
      // Handle specific auth session errors more gracefully
      if (error.name === 'AuthSessionMissingError' || error.message?.includes('Auth session missing')) {
        console.log('🔍 [SUPABASE] Auth session already missing, treating as successful logout');
        logSuccess('Logout', { note: 'Session already cleared' });
        return { success: true };
      }
      
      console.error('🔴 [SUPABASE] Logout error:', {
        message: error.message,
        code: error.code,
        name: error.name
      });
      
      logError('Logout', error);
      return { success: false, error: error.message || 'Logout failed' };
    }
  },

  getCurrentUser: async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        logError('Get Current User', error);
        return null;
      }
      return session?.user || null;
    } catch (error) {
      logError('Get Current User', error);
      return null;
    }
  },

  isAuthenticated: async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) return false;
      return !!session?.user;
    } catch (error) {
      return false;
    }
  },

  resendConfirmation: async (email: string) => {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email
    });
    
    if (error) {
      logError('Resend Confirmation', error, { email });
      return { success: false, error: error.message };
    }
    
    logSuccess('Resend Confirmation', { email });
    return { success: true };
  },

  // Password Reset
  resetPassword: async (email: string) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      });
      
      if (error) throw error;
      
      logSuccess('Password Reset Email Sent', { email });
      return { success: true, data };
    } catch (error) {
      logError('Password Reset', error, { email });
      return { success: false, error: (error as any).message || 'Failed to send reset email' };
    }
  },

  // Update Password
  updatePassword: async (newPassword: string) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;
      
      logSuccess('Password Updated');
      return { success: true, data };
    } catch (error) {
      logError('Password Update', error);
      return { success: false, error: (error as any).message || 'Failed to update password' };
    }
  }
};

// -------- Brand Management --------

interface Brand {
  id?: string;
  user_id: string;
  name: string;
  colors: Array<{ name: string; hex: string }>;
  fonts: Array<{ name: string; url: string; family: string }>;
  logo?: string;
  created_at?: string;
  updated_at?: string;
}

export const brandAPI = {
  create: async (brandData: Omit<Brand, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('brands')
        .insert([brandData])
        .select()
        .single();
      
      if (error) throw error;
      
      logSuccess('Create Brand', { brandId: data.id, name: brandData.name });
      return { success: true, brand: data };
    } catch (error) {
      logError('Create Brand', error, brandData);
      return { success: false, error: (error as any).message || 'Failed to create brand' };
    }
  },

  update: async (id: string, updates: Partial<Brand>) => {
    try {
      const { data, error } = await supabase
        .from('brands')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      logSuccess('Update Brand', { brandId: id });
      return { success: true, brand: data };
    } catch (error) {
      logError('Update Brand', error, { id, updates });
      return { success: false, error: (error as any).message || 'Failed to update brand' };
    }
  },

  getByUserId: async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });
      
      if (error) throw error;
      
      logSuccess('Get Brands by User', { userId, count: data?.length || 0 });
      return { success: true, brands: data || [] };
    } catch (error) {
      logError('Get Brands by User', error, { userId });
      return { success: false, error: (error as any).message || 'Failed to get brands' };
    }
  }
};

// -------- Project Management --------

interface Project {
  id?: string;
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
  created_at?: string;
  updated_at?: string;
}

export const projectAPI = {
  create: async (projectData: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([projectData])
        .select()
        .single();
      
      if (error) throw error;
      
      logSuccess('Create Project', { projectId: data.id, name: projectData.name });
      return { success: true, project: data };
    } catch (error) {
      logError('Create Project', error, projectData);
      return { success: false, error: (error as any).message || 'Failed to create project' };
    }
  },

  update: async (id: string, updates: Partial<Project>) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      logSuccess('Update Project', { projectId: id });
      return { success: true, project: data };
    } catch (error) {
      logError('Update Project', error, { id, updates });
      return { success: false, error: (error as any).message || 'Failed to update project' };
    }
  },

  getByUserId: async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });
      
      if (error) throw error;
      
      logSuccess('Get Projects by User', { userId, count: data?.length || 0 });
      return { success: true, projects: data || [] };
    } catch (error) {
      logError('Get Projects by User', error, { userId });
      return { success: false, error: (error as any).message || 'Failed to get projects' };
    }
  },

  delete: async (id: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      logSuccess('Delete Project', { projectId: id });
      return { success: true };
    } catch (error) {
      logError('Delete Project', error, { id });
      return { success: false, error: (error as any).message || 'Failed to delete project' };
    }
  }
};

// -------- Connection Testing --------

export const testConnection = async () => {
  try {
    const { data, error } = await supabase.from('brands').select('count').limit(1);
    if (error) throw error;
    
    logSuccess('Connection Test');
    return { success: true, data: { message: 'Connected to Supabase' } };
  } catch (error) {
    logError('Connection Test', error);
    return { success: false, error };
  }
};

// -------- Debug Utilities --------

export const debugUtils = {
  getErrorLogs: () => {
    try {
      return JSON.parse(localStorage.getItem('supabase_error_logs') || '[]');
    } catch {
      return [];
    }
  },

  clearErrorLogs: () => {
    try {
      localStorage.removeItem('supabase_error_logs');
      return true;
    } catch {
      return false;
    }
  },

  getConnectionInfo: async () => {
    try {
      const result = await testConnection();
      return {
        success: result.success,
        url: supabaseUrl,
        info: result.data
      };
    } catch (error) {
      return {
        success: false,
        url: supabaseUrl,
        error: (error as any).message
      };
    }
  },

  testAllEndpoints: async () => {
    const results = {
      connection: await testConnection(),
      // Add more endpoint tests as needed
    };
    
    if (import.meta.env.DEV) {
      console.log('🧪 Supabase Endpoint Test Results:', results);
    }
    
    return results;
  }
};

// Initialize
if (import.meta.env.DEV) {
  console.log('🚀 Supabase client initialized');
  console.log('📍 Supabase URL:', supabaseUrl);
}

export default supabase; 