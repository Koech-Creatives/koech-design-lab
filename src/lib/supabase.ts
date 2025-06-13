// @ts-nocheck
// eslint-disable

import { createClient, SupabaseClient, Session } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Add defensive checks for missing environment variables
if (!supabaseUrl || supabaseUrl === 'https://your-project-id.supabase.co') {
  console.warn('⚠️ VITE_SUPABASE_URL not configured. Please add your Supabase URL to environment variables');
}
if (!supabaseKey || supabaseKey === 'your-anon-key-here') {
  console.warn('⚠️ VITE_SUPABASE_ANON_KEY not configured. Please add your Supabase anonymous key to environment variables');
}

// Validate environment in production
if (import.meta.env.PROD && (!supabaseUrl || !supabaseKey || supabaseUrl.includes('placeholder'))) {
  console.error('🔴 Production build requires valid Supabase configuration');
}

export const supabase: SupabaseClient = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseKey || 'placeholder-key'
);

// -------- Logging helpers (similar to Directus) ------------
const postDebug = (payload: any) => {
  // Only send debug info in development
  if (typeof window !== 'undefined' && import.meta.env.DEV) {
    fetch('/__debug', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).catch(() => {});
  }
};

const logSuccess = (operation: string, data?: any) => {
  if (import.meta.env.DEV) {
    console.log(`✅ Supabase Success: ${operation}`, data);
  }
  postDebug({ type: 'supabase', level: 'success', operation, data, timestamp: new Date().toISOString() });
};

const logError = (operation: string, error: any, context?: any) => {
  const info = {
    type: 'supabase',
    level: 'error',
    operation,
    timestamp: new Date().toISOString(),
    error: error?.message || JSON.stringify(error),
    context
  };
  
  if (import.meta.env.DEV) {
    console.error('🔴 Supabase Error:', info);
  }
  
  postDebug(info);
  return info;
};

// -------------- Auth wrappers -------------------
export const supabaseAuth = {
  login: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      logSuccess('login', { user: data.user?.id });
      return { success: true, user: data.user };
    } catch (error) {
      logError('login', error, { email });
      return { success: false, error: error.message };
    }
  },
  register: async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { first_name: firstName, last_name: lastName }
        }
      });
      if (error) throw error;
      logSuccess('register', { user: data.user?.id });
      return { success: true, user: data.user };
    } catch (error) {
      logError('register', error, { email });
      return { success: false, error: error.message };
    }
  },
  logout: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      logSuccess('logout');
      return { success: true };
    } catch (error) {
      logError('logout', error);
      return { success: false, error: error.message };
    }
  },
  getCurrentUser: () => {
    const session: Session | null = supabase.auth.getSession().data.session;
    return session?.user || null;
  },
  isAuthenticated: () => !!supabase.auth.getSession().data.session,
  resendConfirmation: async (email: string) => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email
      });
      if (error) throw error;
      logSuccess('resend confirmation', { email });
      return { success: true };
    } catch (error) {
      logError('resend confirmation', error, { email });
      return { success: false, error: error.message };
    }
  }
}; 