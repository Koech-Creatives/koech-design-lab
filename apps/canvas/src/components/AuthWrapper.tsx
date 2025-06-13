import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LoginPage } from './LoginPage';
import { SignupPage } from './SignupPage';
import { DebugPanel } from './DebugPanel';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const [showLogin, setShowLogin] = useState(true);

  // Show loading spinner while checking authentication
  if (isLoading) {
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
    return (
      <>
        {showLogin ? (
          <LoginPage onSwitchToSignup={() => setShowLogin(false)} />
        ) : (
          <SignupPage onSwitchToLogin={() => setShowLogin(true)} />
        )}
        {/* Debug Panel */}
        <DebugPanel />
      </>
    );
  }

  // Show the main app if authenticated
  return (
    <>
      {children}
      {/* Debug Panel */}
      <DebugPanel />
    </>
  );
} 