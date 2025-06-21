import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock, User, UserPlus } from 'lucide-react';

interface SignupPageProps {
  onSwitchToLogin: () => void;
}

export function SignupPageCompact({ onSwitchToLogin }: SignupPageProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
    if (success) setSuccess('');
  };

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword) {
      return 'Please fill in all fields';
    }
    if (formData.firstName.length < 2 || formData.lastName.length < 2) {
      return 'Names must be at least 2 characters';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return 'Please enter a valid email address';
    }
    if (formData.password.length < 8) {
      return 'Password must be at least 8 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      return 'Passwords do not match';
    }
    if (!agreedToTerms) {
      return 'Please agree to the Terms and Conditions';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    try {
      const result = await register(
        formData.email,
        formData.password,
        formData.firstName,
        formData.lastName
      );

      if (result.success) {
        setSuccess('Account created successfully! Please check your email to confirm your account.');
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
        setAgreedToTerms(false);
        
        // Switch to login page after 3 seconds
        setTimeout(() => {
          onSwitchToLogin();
        }, 3000);
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (error: any) {
      setError(error?.message || 'An unexpected error occurred');
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
            <UserPlus className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white" style={{ fontFamily: gilmerFont }}>Create Account</h2>
          <p className="text-gray-400 text-sm" style={{ fontFamily: gilmerFont }}>Join Koech Design Lab</p>
        </div>

        {/* Form */}
        <div className="p-6 rounded-lg shadow-lg" style={{ backgroundColor: '#003a63', fontFamily: gilmerFont }}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-3 py-2.5 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="First Name"
                  required
                  style={{ fontFamily: gilmerFont }}
                />
              </div>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-3 py-2.5 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Last Name"
                  required
                  style={{ fontFamily: gilmerFont }}
                />
              </div>
            </div>

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pl-10 pr-3 py-2.5 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Email"
                required
                style={{ fontFamily: gilmerFont }}
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full pl-10 pr-10 py-2.5 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Password (8+ characters)"
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

            {/* Confirm Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full pl-10 pr-10 py-2.5 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Confirm Password"
                required
                style={{ fontFamily: gilmerFont }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-300"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {/* Terms Agreement */}
            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                id="terms"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-1 w-4 h-4 text-red-500 bg-gray-800 border-gray-600 rounded focus:ring-red-500"
              />
              <label htmlFor="terms" className="text-xs text-gray-400" style={{ fontFamily: gilmerFont }}>
                I agree to the{' '}
                <a href="#" className="text-red-400 hover:text-red-300">Terms & Conditions</a>
                {' '}and{' '}
                <a href="#" className="text-red-400 hover:text-red-300">Privacy Policy</a>
              </label>
            </div>

            {/* Success Message */}
            {success && (
              <div className="p-2.5 rounded bg-green-500/10 border border-green-500/20">
                <p className="text-sm text-green-400" style={{ fontFamily: gilmerFont }}>{success}</p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-2.5 rounded bg-red-500/10 border border-red-500/20">
                <p className="text-sm text-red-400" style={{ fontFamily: gilmerFont }}>{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded font-medium text-white transition-opacity disabled:opacity-50"
              style={{ backgroundColor: '#ff4940', fontFamily: gilmerFont }}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Switch to Login */}
          <div className="mt-4 text-center" style={{ fontFamily: gilmerFont }}>
            <span className="text-gray-400 text-sm">Already have an account? </span>
            <button
              onClick={onSwitchToLogin}
              className="text-red-400 hover:text-red-300 text-sm font-medium"
              style={{ fontFamily: gilmerFont }}
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 