import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabaseAuth, supabase } from '../lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  user_metadata?: any;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, firstName: string, lastName: string, phone?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  resendConfirmation: (email: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  console.log('🔍 AuthProvider: Mounting/Remounting');
  
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Transform Supabase user to our User interface
  const transformSupabaseUser = (supabaseUser: SupabaseUser): User => {
    console.log('🔄 Transforming Supabase user:', {
      id: supabaseUser.id,
      email: supabaseUser.email,
      metadata: supabaseUser.user_metadata
    });

    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      first_name: supabaseUser.user_metadata?.first_name,
      last_name: supabaseUser.user_metadata?.last_name,
      phone: supabaseUser.user_metadata?.phone,
      user_metadata: supabaseUser.user_metadata
    };
  };

  // Listen to auth state changes
  useEffect(() => {
    console.log('🔍 Setting up Supabase auth listener...');
    
    // Get initial session
    const getInitialSession = async () => {
      try {
        console.log('🔍 Getting initial session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('🔴 Error getting initial session:', error);
          setIsLoading(false);
          return;
        }

        if (session?.user) {
          const transformedUser = transformSupabaseUser(session.user);
          setUser(transformedUser);
          console.log('✅ Initial session found:', {
            email: session.user.email,
            userId: session.user.id,
            transformedUser
          });
        } else {
          console.log('ℹ️ No initial session found');
        }
      } catch (error) {
        console.error('🔴 Error in getInitialSession:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', {
          event,
          userEmail: session?.user?.email,
          userId: session?.user?.id,
          hasSession: !!session
        });
        
        try {
          if (session?.user) {
            const transformedUser = transformSupabaseUser(session.user);
            setUser(transformedUser);
            console.log('✅ User set from auth state change:', transformedUser);
          } else {
            setUser(null);
            console.log('🔄 User cleared from auth state change');
            // Clear logout state when user is cleared
            setIsLoggingOut(false);
          }
        } catch (error) {
          console.error('🔴 Error in auth state change handler:', error);
        } finally {
          setIsLoading(false);
        }
      }
    );

    return () => {
      console.log('🧹 Cleaning up auth listener');
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    console.log('🔍 [AUTH] Login attempt started:', { email });
    setIsLoading(true);
    try {
      const result = await supabaseAuth.login(email, password);
      console.log('🔍 [AUTH] Login result:', { 
        success: result.success, 
        hasUser: !!result.user,
        error: result.error 
      });
      
      if (result.success && result.user) {
        // User will be set automatically by the auth state listener
        console.log('✅ [AUTH] Login successful');
        return { success: true };
      }
      console.log('🔴 [AUTH] Login failed:', result.error);
      return { success: false, error: result.error || 'Login failed' };
    } catch (error) {
      console.error('🔴 [AUTH] Login error:', error);
      return { success: false, error: 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, firstName: string, lastName: string, phone?: string) => {
    console.log('🔍 [AUTH] Registration attempt started:', { 
      email, 
      firstName, 
      lastName, 
      hasPhone: !!phone,
      phone: phone ? `${phone.substring(0, 3)}***` : 'Not provided' // Masked for security
    });
    
    setIsLoading(true);
    try {
      const result = await supabaseAuth.register(email, password, firstName, lastName, phone);
      console.log('🔍 [AUTH] Registration result:', { 
        success: result.success, 
        hasUser: !!result.user,
        userId: result.user?.id,
        error: result.error 
      });
      
      if (result.success && result.user) {
        console.log('✅ [AUTH] Registration successful:', {
          userId: result.user.id,
          email: result.user.email,
          needsConfirmation: !result.user.email_confirmed_at
        });
        
        // User will be set automatically by the auth state listener
        return { success: true };
      }
      console.log('🔴 [AUTH] Registration failed:', result.error);
      return { success: false, error: result.error || 'Registration failed' };
    } catch (error: any) {
      console.error('🔴 [AUTH] Registration error:', {
        message: error?.message,
        stack: error?.stack,
        email
      });
      return { success: false, error: error?.message || 'Registration failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    // Prevent multiple simultaneous logout calls
    if (isLoggingOut) {
      console.log('🔍 [AUTH] Logout already in progress, skipping');
      return;
    }
    
    setIsLoggingOut(true);
    console.log('🔍 [AUTH] Logout attempt started');
    
    try {
      const result = await supabaseAuth.logout();
      if (result.success) {
        console.log('✅ [AUTH] Logout successful');
      } else {
        console.warn('⚠️ [AUTH] Logout completed with warning:', result.error);
      }
      // User will be cleared automatically by the auth state listener
    } catch (error) {
      console.error('🔴 [AUTH] Logout error:', error);
      // Don't throw the error - treat logout as successful even if there are issues
      // The important thing is to clear the local state
    } finally {
      setIsLoggingOut(false);
    }
  };

  const resendConfirmation = async (email: string) => {
    console.log('🔍 [AUTH] Resend confirmation attempt:', { email });
    try {
      const result = await supabaseAuth.resendConfirmation(email);
      console.log('🔍 [AUTH] Resend confirmation result:', result);
      return result;
    } catch (error) {
      console.error('🔴 [AUTH] Resend confirmation error:', error);
      return { success: false, error: 'Failed to resend confirmation email' };
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    resendConfirmation,
  };

  console.log('🔍 [AUTH] AuthProvider render:', {
    hasUser: !!user,
    isLoading,
    isAuthenticated: !!user,
    userEmail: user?.email
  });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 