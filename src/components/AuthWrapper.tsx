import React, { useState, useContext, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LoginPage } from './LoginPage';
import { SignupPageBrandAware } from './SignupPageBrandAware';
import { DebugPanel } from './DebugPanel';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  const [showLogin, setShowLogin] = useState(true);
  const [guestMode, setGuestMode] = useState(false);
  const [forceShowApp, setForceShowApp] = useState(false);
  
  console.log('🔍 AuthWrapper: Rendering, attempting to access auth context');
  
  // Add timeout to prevent infinite loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      console.warn('⚠️ AuthWrapper: Loading timeout - forcing app to show');
      setForceShowApp(true);
    }, 15000); // 15 second timeout
    
    return () => clearTimeout(timeout);
  }, []);
  
  // Safely get auth context with error handling
  let authContext;
  try {
    authContext = useAuth();
    console.log('✅ AuthWrapper: Auth context accessed successfully:', {
      isAuthenticated: authContext?.isAuthenticated,
      isLoading: authContext?.isLoading,
      hasUser: !!authContext?.user,
      userEmail: authContext?.user?.email,
      userId: authContext?.user?.id,
      guestMode,
      forceShowApp
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
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Refresh Page
            </button>
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
    guestMode,
    forceShowApp,
    willShowLoading: isLoading && !forceShowApp,
    willShowAuth: !isAuthenticated && !isLoading && !guestMode && !forceShowApp,
    willShowApp: (isAuthenticated || guestMode || forceShowApp) && !isLoading
  });

  // Show loading spinner while checking authentication (unless forced to show app)
  if (isLoading && !forceShowApp) {
    console.log('🔄 AuthWrapper: Showing loading spinner');
    return (
      <>
        <div 
          className="min-h-screen flex items-center justify-center"
          style={{ 
            background: 'linear-gradient(135deg, #002e51 0%, #004080 100%)' 
          }}
        >
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-500 mx-auto mb-4"></div>
            <p className="text-white text-lg">Loading...</p>
            <p className="text-gray-400 text-sm mt-2">Setting up your workspace</p>
            <button
              onClick={() => {
                console.log('🔄 AuthWrapper: User clicked continue as guest');
                setGuestMode(true);
              }}
              className="mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors text-sm"
            >
              Continue as Guest
            </button>
          </div>
        </div>
        {/* Debug Panel */}
        <DebugPanel />
      </>
    );
  }

  // Show login/signup if not authenticated and not in guest mode and not forced to show app
  if (!isAuthenticated && !guestMode && !forceShowApp) {
    console.log('🔐 AuthWrapper: User not authenticated, showing auth pages. showLogin:', showLogin);
    return (
      <>
        <div className="relative">
          {showLogin ? (
            <div>
              <LoginPage onSwitchToSignup={() => setShowLogin(false)} />
              {/* Guest Access Banner */}
              <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
                <div className="bg-gray-800 border border-gray-600 rounded-lg p-4 max-w-md text-center">
                  <p className="text-gray-300 text-sm mb-3">
                    Want to try Frames without signing up?
                  </p>
                  <button
                    onClick={() => setGuestMode(true)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Continue as Guest
                  </button>
                  <p className="text-xs text-gray-400 mt-2">
                    Note: You'll need to sign up to export or share your designs
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <SignupPageBrandAware onSwitchToLogin={() => setShowLogin(true)} />
              {/* Guest Access Banner */}
              <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
                <div className="bg-gray-800 border border-gray-600 rounded-lg p-4 max-w-md text-center">
                  <p className="text-gray-300 text-sm mb-3">
                    Want to try Frames without signing up?
                  </p>
                  <button
                    onClick={() => setGuestMode(true)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Continue as Guest
                  </button>
                  <p className="text-xs text-gray-400 mt-2">
                    Note: You'll need to sign up to export or share your designs
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Debug Panel */}
        <DebugPanel />
      </>
    );
  }

  // Show the main app if authenticated or in guest mode
  console.log('✅ AuthWrapper: User authenticated or in guest mode, showing main app');
  return (
    <>
      {/* Pass guest mode status to children via context */}
      <div data-guest-mode={guestMode ? 'true' : 'false'}>
        {children}
      </div>
      {/* Debug Panel */}
      <DebugPanel />
    </>
  );
} 