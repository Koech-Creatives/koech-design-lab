import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock, LogIn } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface LoginPageProps {
  onSwitchToSignup: () => void;
}

export function LoginPage({ onSwitchToSignup }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  // Format user-friendly error messages
  const formatErrorMessage = (error: any): string => {
    if (!error) return 'An unexpected error occurred';
    
    // Handle specific error codes and messages
    if (typeof error === 'string') {
      // Handle common error messages
      if (error.includes('Invalid login credentials')) {
        return 'The email or password you entered is incorrect. Please check and try again.';
      }
      if (error.includes('Email not confirmed')) {
        return 'Please check your email and click the confirmation link before logging in.';
      }
      if (error.includes('invalid email')) {
        return 'Please enter a valid email address.';
      }
      return error;
    }

    // Handle error objects with codes
    if (error.code) {
      switch (error.code) {
        case 'invalid_credentials':
          return 'The email or password you entered is incorrect. Please check and try again.';
        case 'email_not_confirmed':
          return 'Please check your email and click the confirmation link before logging in.';
        case 'signup_disabled':
          return 'Login is currently disabled. Please contact support.';
        case 'email_address_invalid':
          return 'Please enter a valid email address.';
        case 'rate_limit_exceeded':
          return 'Too many login attempts. Please wait a few minutes before trying again.';
        case 'database_error':
          return 'There was a problem with our database. Please try again in a moment.';
        case 'network_error':
          return 'Network connection error. Please check your internet connection and try again.';
        default:
          return error.message || 'An unexpected error occurred. Please try again.';
      }
    }

    // Handle error objects with messages
    if (error.message) {
      return formatErrorMessage(error.message);
    }

    return 'An unexpected error occurred. Please try again.';
  };

  // Show user-friendly error toast and set error state
  const showError = (error: any) => {
    const errorMessage = formatErrorMessage(error);
    setError(errorMessage);
    toast.error(errorMessage, {
      position: "top-center",
      autoClose: 6000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      style: {
        background: '#FEE2E2',
        color: '#DC2626',
        borderLeft: '4px solid #DC2626',
        fontSize: '14px'
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!email || !password) {
      showError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    try {
      const result = await login(email, password);
      if (!result.success) {
        showError(result.error || 'Login failed');
      }
    } catch (error) {
      showError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const gilmerFont = 'Gilmer, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif';

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{ 
        background: 'linear-gradient(135deg, #002e51 0%, #002e51 100%)',
        fontFamily: gilmerFont
      }}
    >
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-6" style={{ fontFamily: gilmerFont }}>
          <div className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center" style={{ backgroundColor: '#ff4940' }}>
            <LogIn className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white" style={{ fontFamily: gilmerFont }}>Welcome Back</h2>
          <p className="text-gray-400 text-sm" style={{ fontFamily: gilmerFont }}>Sign in to continue</p>
        </div>

        {/* Form */}
        <div className="p-6 rounded-lg shadow-lg" style={{ backgroundColor: '#003a63', fontFamily: gilmerFont }}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  className="w-full pl-10 pr-3 py-2.5 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Email"
                  required
                  style={{ fontFamily: gilmerFont }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError('');
                  }}
                  className="w-full pl-10 pr-10 py-2.5 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Password"
                  required
                  style={{ fontFamily: gilmerFont }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 shadow-md">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-4 w-4 text-red-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-2 flex-1">
                    <p className="text-sm font-medium text-red-800" style={{ fontFamily: gilmerFont }}>{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded font-medium text-white transition-opacity disabled:opacity-50"
              style={{ backgroundColor: '#ff4940', fontFamily: gilmerFont }}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Switch to Signup */}
          <div className="mt-4 text-center" style={{ fontFamily: gilmerFont }}>
            <span className="text-gray-400 text-sm">Don't have an account? </span>
            <button
              onClick={onSwitchToSignup}
              className="text-red-400 hover:text-red-300 text-sm font-medium"
              style={{ fontFamily: gilmerFont }}
            >
              Sign up
            </button>
          </div>
        </div>
      </div>


    </div>
  );
} 