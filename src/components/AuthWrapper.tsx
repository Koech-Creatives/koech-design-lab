import React, { useState, useContext } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LoginPage } from './LoginPage';
import { SignupPageBrandAware } from './SignupPageBrandAware';
import { DebugPanel } from './DebugPanel';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  const [showLogin, setShowLogin] = useState(true);
  
  console.log('🔍 AuthWrapper: Rendering, attempting to access auth context');
  
  // Safely get auth context with error handling
  let authContext;
  try {
    authContext = useAuth();
    console.log('✅ AuthWrapper: Auth context accessed successfully:', {
      isAuthenticated: authContext?.isAuthenticated,
      isLoading: authContext?.isLoading,
      hasUser: !!authContext?.user,
      userEmail: authContext?.user?.email,
      userId: authContext?.user?.id
    });
  } catch (error) {
    console.error('🔴 AuthWrapper: Error accessing auth context:', error);
    console.error('🔴 AuthWrapper: This might be due to HMR or provider hierarchy issues');
    // Return loading state if context is not available
    return (
      <>
        <div 
          className="min-h-screen flex items-center justify-center"
          style={{ 
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)' 
          }}
        >
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-500 mx-auto mb-4"></div>
            <p className="text-white text-lg">Initializing authentication...</p>
            <p className="text-gray-400 text-sm mt-2">Context loading issue - refreshing may help</p>
          </div>
        </div>
        <DebugPanel />
      </>
    );
  }
  
  const { isAuthenticated, isLoading } = authContext;

  console.log('🔍 AuthWrapper: Authentication decision:', {
    isLoading,
    isAuthenticated,
    willShowLoading: isLoading,
    willShowAuth: !isAuthenticated && !isLoading,
    willShowApp: isAuthenticated && !isLoading
  });

  // Show loading spinner while checking authentication
  if (isLoading) {
    console.log('🔄 AuthWrapper: Showing loading spinner');
    return (
      <>
        <div 
          className="min-h-screen flex items-center justify-center"
          style={{ 
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)' 
          }}
        >
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-500 mx-auto mb-4"></div>
            <p className="text-white text-lg">Loading...</p>
          </div>
        </div>
        {/* Debug Panel */}
        <DebugPanel />
      </>
    );
  }

  // Show login/signup if not authenticated
  if (!isAuthenticated) {
    console.log('🔐 AuthWrapper: User not authenticated, showing auth pages. showLogin:', showLogin);
    return (
      <>
        {showLogin ? (
          <LoginPage onSwitchToSignup={() => setShowLogin(false)} />
        ) : (
          <SignupPageBrandAware onSwitchToLogin={() => setShowLogin(true)} />
        )}
        {/* Debug Panel */}
        <DebugPanel />
      </>
    );
  }

  // Show the main app if authenticated
  console.log('✅ AuthWrapper: User authenticated, showing main app');
  return (
    <>
      {children}
      {/* Debug Panel */}
      <DebugPanel />
    </>
  );
} 