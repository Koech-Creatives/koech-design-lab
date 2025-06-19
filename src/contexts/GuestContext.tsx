import React, { createContext, useContext, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';

interface GuestContextType {
  isGuestMode: boolean;
  showLoginPrompt: boolean;
  setShowLoginPrompt: (show: boolean) => void;
  requiresAuth: (action: string) => boolean;
  promptForAuth: (action: string, callback?: () => void) => void;
}

const GuestContext = createContext<GuestContextType | undefined>(undefined);

interface LoginPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  action: string;
  onLogin: () => void;
  onSignup: () => void;
}

function LoginPromptModal({ isOpen, onClose, action, onLogin, onSignup }: LoginPromptModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-md w-full p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0h-2m9-9V4a2 2 0 00-2-2H5a2 2 0 00-2 2v3m0 0v7a2 2 0 002 2h14a2 2 0 002-2V7m0 0L12 2 7 7h10z" />
            </svg>
          </div>
          
          <h3 className="text-xl font-bold text-white mb-2">Account Required</h3>
          <p className="text-gray-300 mb-6">
            To {action.toLowerCase()}, you need to create an account or sign in. 
            This helps us save your work and provide the best experience.
          </p>
          
          <div className="space-y-3">
            <button
              onClick={onSignup}
              className="w-full py-3 px-6 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
            >
              Create Free Account
            </button>
            
            <button
              onClick={onLogin}
              className="w-full py-3 px-6 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
            >
              Sign In
            </button>
            
            <button
              onClick={onClose}
              className="w-full py-2 px-4 text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
          
          <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-xs text-blue-300">
              ✨ Free accounts include: Unlimited designs, Cloud saving, Export in multiple formats
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function GuestProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [currentAction, setCurrentAction] = useState('');
  const [pendingCallback, setPendingCallback] = useState<(() => void) | null>(null);

  // Check if user is in guest mode (not authenticated but able to use the app)
  const isGuestMode = !isAuthenticated;

  // Actions that require authentication
  const restrictedActions = [
    'export your design',
    'download your design', 
    'post to social media',
    'share your design',
    'save your project',
    'access your projects'
  ];

  const requiresAuth = useCallback((action: string) => {
    return restrictedActions.some(restricted => 
      action.toLowerCase().includes(restricted) || 
      restricted.includes(action.toLowerCase())
    );
  }, []);

  const promptForAuth = useCallback((action: string, callback?: () => void) => {
    if (isAuthenticated) {
      // User is already authenticated, execute callback immediately
      callback?.();
      return;
    }

    setCurrentAction(action);
    setPendingCallback(() => callback);
    setShowLoginPrompt(true);
  }, [isAuthenticated]);

  const handleLogin = () => {
    setShowLoginPrompt(false);
    // Redirect to login - this will be handled by AuthWrapper
    window.location.reload();
  };

  const handleSignup = () => {
    setShowLoginPrompt(false);
    // Redirect to signup - this will be handled by AuthWrapper
    window.location.reload();
  };

  const handleClose = () => {
    setShowLoginPrompt(false);
    setCurrentAction('');
    setPendingCallback(null);
  };

  return (
    <GuestContext.Provider
      value={{
        isGuestMode,
        showLoginPrompt,
        setShowLoginPrompt,
        requiresAuth,
        promptForAuth,
      }}
    >
      {children}
      
      <LoginPromptModal
        isOpen={showLoginPrompt}
        onClose={handleClose}
        action={currentAction}
        onLogin={handleLogin}
        onSignup={handleSignup}
      />
    </GuestContext.Provider>
  );
}

export function useGuest() {
  const context = useContext(GuestContext);
  if (context === undefined) {
    throw new Error('useGuest must be used within a GuestProvider');
  }
  return context;
} 