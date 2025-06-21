import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock, User, UserPlus, Phone, ExternalLink, Palette, Upload, ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface SignupPageProps {
  onSwitchToLogin: () => void;
}

interface BrandData {
  brandName: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  logo: string;
  industry: string;
  additionalColors: Array<{ name: string; hex: string }>;
}

export function SignupPage({ onSwitchToLogin }: SignupPageProps) {
  // Step management
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  // Form data
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  // Brand data
  const [brandData, setBrandData] = useState<BrandData>({
    brandName: '',
    primaryColor: '#ff4940',
    secondaryColor: '#002e51',
    accentColor: '#6366f1',
    logo: '',
    industry: '',
    additionalColors: []
  });

  // UI state
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any[]>([]);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const { register } = useAuth();

  // Industries list
  const industries = [
    'Technology', 'Healthcare', 'Finance', 'Education', 'Retail', 'Manufacturing',
    'Real Estate', 'Food & Beverage', 'Marketing & Advertising', 'Consulting',
    'Non-profit', 'Entertainment', 'Travel & Tourism', 'Automotive', 'Other'
  ];

  // Debug logging function
  const addDebugLog = (step: string, data: any, type: 'info' | 'success' | 'error' = 'info') => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      step,
      data,
      type
    };
    console.log(`🔍 [SIGNUP DEBUG] ${step}:`, data);
    setDebugInfo(prev => [...prev, logEntry]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear errors when user starts typing
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleBrandInputChange = (field: keyof BrandData, value: string) => {
    setBrandData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const logoUrl = URL.createObjectURL(file);
      setBrandData(prev => ({ ...prev, logo: logoUrl }));
    }
  };

  const addCustomColor = () => {
    const colorName = prompt('Enter a name for this color:');
    if (colorName) {
      const newColor = { name: colorName, hex: '#000000' };
      setBrandData(prev => ({
        ...prev,
        additionalColors: [...prev.additionalColors, newColor]
      }));
    }
  };

  const updateAdditionalColor = (index: number, field: 'name' | 'hex', value: string) => {
    setBrandData(prev => ({
      ...prev,
      additionalColors: prev.additionalColors.map((color, i) => 
        i === index ? { ...color, [field]: value } : color
      )
    }));
  };

  const removeAdditionalColor = (index: number) => {
    setBrandData(prev => ({
      ...prev,
      additionalColors: prev.additionalColors.filter((_, i) => i !== index)
    }));
  };

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        // Basic information validation
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword) {
          return 'Please fill in all required fields';
        }
        if (formData.firstName.length < 2) return 'First name must be at least 2 characters';
        if (formData.lastName.length < 2) return 'Last name must be at least 2 characters';
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) return 'Please enter a valid email address';
        
        if (formData.phone && formData.phone.length > 0) {
          const cleanPhone = formData.phone.replace(/[\s\-\(\)]/g, '');
          if (!/^\+?[\d]{10,15}$/.test(cleanPhone)) {
            return 'Please enter a valid phone number (10-15 digits)';
          }
        }
        
        if (formData.password.length < 8) return 'Password must be at least 8 characters';
        if (formData.password !== formData.confirmPassword) return 'Passwords do not match';
        return null;

      case 2:
        // Brand information validation (optional but recommended)
        if (!brandData.brandName.trim()) return 'Please enter your brand name';
        return null;

      case 3:
        // Terms and conditions validation
        if (!agreedToTerms) return 'Please agree to the Terms and Conditions';
        if (!agreedToPrivacy) return 'Please agree to the Privacy Policy';
        return null;

      default:
        return null;
    }
  };

  const validateForm = () => {
    // Validate all steps for final submission
    for (let step = 1; step <= totalSteps; step++) {
      const stepError = validateStep(step);
      if (stepError) return stepError;
    }
    return null;
  };

  const handleNext = () => {
    const stepError = validateStep(currentStep);
    if (stepError) {
      setError(stepError);
      return;
    }
    setError('');
    setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  };

  const handlePrevious = () => {
    setError('');
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // If not on the last step, validate current step and move to next
    if (currentStep < totalSteps) {
      const stepError = validateStep(currentStep);
      if (stepError) {
        setError(stepError);
        return;
      }
      setError('');
      setCurrentStep(prev => prev + 1);
      return;
    }

    console.log('🔄 [SIGNUP] Form submitted', { 
      email: formData.email,
      hasTerms: agreedToTerms,
      hasPrivacy: agreedToPrivacy,
      brandData: brandData
    });
    
    setError('');
    setSuccess('');
    setDebugInfo([]); // Clear previous debug info

    addDebugLog('Signup Process Started', {
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      hasPhone: !!formData.phone,
      brandName: brandData.brandName,
      agreedToTerms,
      agreedToPrivacy
    }, 'info');

    const validationError = validateForm();
    if (validationError) {
      console.error('🔴 [SIGNUP] Validation failed:', validationError);
      setError(validationError);
      toast.error(validationError);
      return;
    }

    console.log('✅ [SIGNUP] Validation passed, calling register...');
    setIsLoading(true);
    addDebugLog('Calling Register Function', { email: formData.email }, 'info');

    try {
      console.log('📞 [SIGNUP] Calling register function with:', {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        hasPhone: !!formData.phone,
        brandData: brandData
      });

      const result = await register(
        formData.email, 
        formData.password, 
        formData.firstName, 
        formData.lastName,
        formData.phone // Pass phone number
      );
      
      console.log('📥 [SIGNUP] Register function returned:', result);
      addDebugLog('Register Function Response', result, result.success ? 'success' : 'error');

      if (result.success) {
        console.log('🎉 [SIGNUP] Registration successful!');
        
        // Show success toast with email confirmation message
        toast.success('🎉 Account created successfully! Please check your email to confirm your account.', {
          position: "top-right",
          autoClose: 8000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        
        // Store brand data in localStorage temporarily for the BrandContext to pick up
        if (brandData.brandName) {
          localStorage.setItem('pendingBrandData', JSON.stringify({
            name: brandData.brandName,
            colors: [
              { name: 'Primary', hex: brandData.primaryColor },
              { name: 'Secondary', hex: brandData.secondaryColor },
              { name: 'Accent', hex: brandData.accentColor },
              ...brandData.additionalColors
            ],
            fonts: [
              { name: 'Inter', url: '', family: 'Inter, sans-serif' },
              { name: 'Roboto', url: '', family: 'Roboto, sans-serif' },
              { name: 'Poppins', url: '', family: 'Poppins, sans-serif' },
            ],
            logo: brandData.logo,
            industry: brandData.industry
          }));
        }
        
        setSuccess('Account created successfully! Please check your email to confirm your account.');
        addDebugLog('Signup Successful', { 
          email: formData.email,
          brandName: brandData.brandName,
          message: 'User needs to confirm email before accessing canvas'
        }, 'success');
        
        // Clear form on success
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          password: '',
          confirmPassword: ''
        });
        setBrandData({
          brandName: '',
          primaryColor: '#ff4940',
          secondaryColor: '#002e51',
          accentColor: '#6366f1',
          logo: '',
          industry: '',
          additionalColors: []
        });

        // Switch to login page after successful registration
        // User needs to confirm email before they can log in
        addDebugLog('Email Confirmation Required', { 
          email: formData.email,
          message: 'User will be redirected to login page to sign in after email confirmation'
        }, 'info');
        
        // Show login page after a delay so user can see the success message
        setTimeout(() => {
          onSwitchToLogin();
        }, 3000);
      } else {
        console.error('🔴 [SIGNUP] Registration failed:', result.error);
        setError(result.error || 'Registration failed');
        toast.error(result.error || 'Registration failed');
        addDebugLog('Signup Failed', { 
          error: result.error,
          email: formData.email
        }, 'error');
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'An unexpected error occurred';
      console.error('💥 [SIGNUP] Exception caught:', error);
      setError(errorMessage);
      toast.error(errorMessage);
      addDebugLog('Signup Exception', { 
        error: errorMessage,
        stack: error?.stack,
        email: formData.email
      }, 'error');
    } finally {
      setIsLoading(false);
      console.log('🏁 [SIGNUP] Process completed');
      addDebugLog('Signup Process Completed', { isLoading: false }, 'info');
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{ 
        background: 'linear-gradient(135deg, #002e51 0%, #002e51 100%)' 
      }}
    >
      <div className="max-w-lg w-full space-y-8">
        {/* Logo/Brand */}
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#ff4940' }}>
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white">Create Account</h2>
          <p className="mt-2 text-gray-400">Join Koech Design Lab today</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center space-x-2 mb-8">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === currentStep 
                  ? 'bg-red-500 text-white' 
                  : step < currentStep 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-600 text-gray-300'
                }`}>
                {step < currentStep ? <CheckCircle className="w-4 h-4" /> : step}
              </div>
              {step < 3 && <div className={`w-12 h-0.5 mx-2 ${step < currentStep ? 'bg-green-500' : 'bg-gray-600'}`} />}
            </div>
          ))}
        </div>

        {/* Step Titles */}
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold text-white">
            {currentStep === 1 && 'Personal Information'}
            {currentStep === 2 && 'Brand Details'}
            {currentStep === 3 && 'Terms & Conditions'}
          </h3>
          <p className="text-gray-400 text-sm mt-1">
            {currentStep === 1 && 'Tell us about yourself'}
            {currentStep === 2 && 'Set up your brand identity'}
            {currentStep === 3 && 'Review and accept our terms'}
          </p>
        </div>

        {/* Signup Form */}
        <div 
          className="p-8 rounded-xl shadow-2xl"
          style={{ backgroundColor: '#003a63' }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">
                  First Name *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    autoComplete="given-name"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-3 border border-gray-600 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                    placeholder="First name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-2">
                  Last Name *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    autoComplete="family-name"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-3 border border-gray-600 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                    placeholder="Last name"
                  />
                </div>
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-3 py-3 border border-gray-600 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Phone Field */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                Phone Number <span className="text-gray-500">(Optional)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-3 py-3 border border-gray-600 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-600 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-600 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                  )}
                </button>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="space-y-3">
              <div className="flex items-start">
                <input
                  id="agreeTerms"
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-1 h-4 w-4 text-red-500 focus:ring-red-500 border-gray-600 rounded bg-gray-800"
                />
                <label htmlFor="agreeTerms" className="ml-2 text-sm text-gray-300">
                  I agree to the{' '}
                  <button
                    type="button"
                    onClick={() => setShowTermsModal(true)}
                    className="text-red-400 hover:text-red-300 underline inline-flex items-center"
                  >
                    Terms and Conditions <ExternalLink className="w-3 h-3 ml-1" />
                  </button>
                </label>
              </div>

              <div className="flex items-start">
                <input
                  id="agreePrivacy"
                  type="checkbox"
                  checked={agreedToPrivacy}
                  onChange={(e) => setAgreedToPrivacy(e.target.checked)}
                  className="mt-1 h-4 w-4 text-red-500 focus:ring-red-500 border-gray-600 rounded bg-gray-800"
                />
                <label htmlFor="agreePrivacy" className="ml-2 text-sm text-gray-300">
                  I agree to the{' '}
                  <button
                    type="button"
                    onClick={() => setShowPrivacyModal(true)}
                    className="text-red-400 hover:text-red-300 underline inline-flex items-center"
                  >
                    Privacy Policy <ExternalLink className="w-3 h-3 ml-1" />
                  </button>
                </label>
              </div>
            </div>

            {/* Success Message */}
            {success && (
              <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <p className="text-sm text-green-400">{success}</p>
                <p className="text-xs text-green-300 mt-1">
                  You'll be redirected to the login page in a few seconds. After confirming your email, you can sign in to access the canvas.
                </p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {/* Debug Information (Development Only) */}
            {import.meta.env.DEV && debugInfo.length > 0 && (
              <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 max-h-40 overflow-y-auto">
                <p className="text-xs text-blue-400 font-semibold mb-2">Debug Information:</p>
                {debugInfo.map((log, index) => (
                  <div key={index} className="text-xs mb-1">
                    <span className={`font-mono ${
                      log.type === 'success' ? 'text-green-400' : 
                      log.type === 'error' ? 'text-red-400' : 'text-blue-400'
                    }`}>
                      [{log.timestamp.split('T')[1].split('.')[0]}] {log.step}
                    </span>
                    {log.data && (
                      <pre className="text-gray-400 ml-2 text-xs">
                        {JSON.stringify(log.data, null, 2)}
                      </pre>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-6 rounded-lg text-white font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ 
                backgroundColor: '#ff4940',
                opacity: isLoading ? 0.7 : 1
              }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Switch to Login */}
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Already have an account?{' '}
              <button
                onClick={onSwitchToLogin}
                className="text-red-400 hover:text-red-300 font-medium transition-colors duration-200"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-gray-500 text-sm">
            © 2024 Koech Design Lab. All rights reserved.
          </p>
        </div>
      </div>

      {/* Terms and Conditions Modal */}
      {showTermsModal && (
        <TermsModal onClose={() => setShowTermsModal(false)} />
      )}

      {/* Privacy Policy Modal */}
      {showPrivacyModal && (
        <PrivacyModal onClose={() => setShowPrivacyModal(false)} />
      )}


    </div>
  );
}

// Terms and Conditions Modal Component
function TermsModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Terms and Conditions</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-xl"
            >
              ×
            </button>
          </div>
          
          <div className="prose prose-sm max-w-none text-gray-700">
            <p><strong>Last updated:</strong> {new Date().toLocaleDateString()}</p>
            
            <h3>1. Acceptance of Terms</h3>
            <p>By creating an account and using Koech Design Lab, you agree to be bound by these Terms and Conditions and our Privacy Policy. If you do not agree to these terms, please do not use our service.</p>
            
            <h3>2. Description of Service</h3>
            <p>Koech Design Lab is a digital design platform that allows users to create, edit, and manage design projects including logos, social media graphics, and other visual content.</p>
            
            <h3>3. User Accounts</h3>
            <ul>
              <li>You must provide accurate and complete information when creating your account</li>
              <li>You are responsible for maintaining the security of your account credentials</li>
              <li>You must notify us immediately of any unauthorized use of your account</li>
              <li>One person or legal entity may not maintain more than one free account</li>
            </ul>
            
            <h3>4. Acceptable Use</h3>
            <p>You agree not to:</p>
            <ul>
              <li>Use the service for any illegal or unauthorized purpose</li>
              <li>Create content that violates intellectual property rights</li>
              <li>Upload malicious code or attempt to disrupt our service</li>
              <li>Share your account credentials with others</li>
              <li>Use automated tools to access our service without permission</li>
            </ul>
            
            <h3>5. Content and Intellectual Property</h3>
            <ul>
              <li>You retain ownership of content you create using our platform</li>
              <li>You grant us a license to host, store, and display your content as necessary to provide our service</li>
              <li>You are responsible for ensuring you have rights to any assets you upload</li>
              <li>We respect intellectual property rights and will respond to valid DMCA notices</li>
            </ul>
            
            <h3>6. WhatsApp Communications</h3>
            <p>By providing your phone number, you consent to receive:</p>
            <ul>
              <li>Important account notifications and security alerts</li>
              <li>Product updates and feature announcements</li>
              <li>Educational content related to design and our platform</li>
              <li>Promotional messages (you may opt out at any time)</li>
            </ul>
            <p>Standard message and data rates may apply. You can opt out by replying "STOP" to any message.</p>
            
            <h3>7. Subscription and Billing</h3>
            <ul>
              <li>Free accounts have usage limitations as described on our website</li>
              <li>Paid subscriptions will be billed according to your chosen plan</li>
              <li>All fees are non-refundable unless otherwise stated</li>
              <li>We may change pricing with 30 days notice to existing subscribers</li>
            </ul>
            
            <h3>8. Data and Privacy</h3>
            <ul>
              <li>Your privacy is important to us - see our Privacy Policy for details</li>
              <li>We use industry-standard security measures to protect your data</li>
              <li>You can export your data and delete your account at any time</li>
            </ul>
            
            <h3>9. Service Availability</h3>
            <ul>
              <li>We strive for 99.9% uptime but cannot guarantee uninterrupted service</li>
              <li>We may perform maintenance that temporarily affects service availability</li>
              <li>We are not liable for losses due to service interruptions</li>
            </ul>
            
            <h3>10. Termination</h3>
            <ul>
              <li>You may terminate your account at any time</li>
              <li>We may suspend or terminate accounts that violate these terms</li>
              <li>Upon termination, your right to use the service ceases immediately</li>
            </ul>
            
            <h3>11. Disclaimers and Limitation of Liability</h3>
            <p>The service is provided "as is" without warranties. We are not liable for indirect, incidental, or consequential damages. Our total liability is limited to the amount you paid for the service in the past 12 months.</p>
            
            <h3>12. Governing Law</h3>
            <p>These terms are governed by the laws of [Your Jurisdiction]. Any disputes will be resolved in the courts of [Your Jurisdiction].</p>
            
            <h3>13. Changes to Terms</h3>
            <p>We may update these terms from time to time. We will notify users of significant changes via email or platform notification.</p>
            
            <h3>14. Contact Information</h3>
            <p>For questions about these terms, contact us at legal@koechdesignlab.com</p>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Privacy Policy Modal Component
function PrivacyModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Privacy Policy</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-xl"
            >
              ×
            </button>
          </div>
          
          <div className="prose prose-sm max-w-none text-gray-700">
            <p><strong>Last updated:</strong> {new Date().toLocaleDateString()}</p>
            
            <h3>1. Information We Collect</h3>
            
            <h4>Personal Information</h4>
            <ul>
              <li><strong>Account Information:</strong> Name, email address, password</li>
              <li><strong>Contact Information:</strong> Phone number (optional, for WhatsApp notifications)</li>
              <li><strong>Profile Information:</strong> Company name, avatar image (optional)</li>
              <li><strong>Billing Information:</strong> Payment details for paid subscriptions</li>
            </ul>
            
            <h4>Usage Information</h4>
            <ul>
              <li><strong>Design Content:</strong> Projects, images, text, and other creative assets you create</li>
              <li><strong>Usage Analytics:</strong> How you interact with our platform, features used, time spent</li>
              <li><strong>Technical Data:</strong> IP address, browser type, device information, access logs</li>
            </ul>
            
            <h3>2. How We Use Your Information</h3>
            
            <h4>To Provide Our Service</h4>
            <ul>
              <li>Create and maintain your account</li>
              <li>Store and sync your design projects</li>
              <li>Process payments and manage subscriptions</li>
              <li>Provide customer support</li>
            </ul>
            
            <h4>To Communicate With You</h4>
            <ul>
              <li>Send important account notifications via email</li>
              <li>Send WhatsApp messages (if phone number provided and consented)</li>
              <li>Respond to your inquiries and support requests</li>
              <li>Send product updates and educational content</li>
            </ul>
            
            <h4>WhatsApp Communications</h4>
            <p>If you provide your phone number, we may send you:</p>
            <ul>
              <li><strong>Transactional messages:</strong> Account alerts, security notifications, billing updates</li>
              <li><strong>Product updates:</strong> New features, platform improvements</li>
              <li><strong>Educational content:</strong> Design tips, tutorials, best practices</li>
              <li><strong>Promotional messages:</strong> Special offers, webinars (you can opt out anytime)</li>
            </ul>
            
            <h4>To Improve Our Service</h4>
            <ul>
              <li>Analyze usage patterns to enhance user experience</li>
              <li>Develop new features and capabilities</li>
              <li>Monitor and maintain platform performance</li>
              <li>Prevent fraud and ensure security</li>
            </ul>
            
            <h3>3. Information Sharing</h3>
            
            <p>We do not sell your personal information. We may share information in these situations:</p>
            
            <h4>Service Providers</h4>
            <ul>
              <li><strong>Cloud Storage:</strong> Supabase (database and authentication)</li>
              <li><strong>Payment Processing:</strong> Stripe or similar payment processors</li>
              <li><strong>Communication:</strong> WhatsApp Business API, email service providers</li>
              <li><strong>Analytics:</strong> Privacy-focused analytics tools</li>
            </ul>
            
            <h4>Legal Requirements</h4>
            <ul>
              <li>When required by law or legal process</li>
              <li>To protect our rights, property, or safety</li>
              <li>To prevent fraud or illegal activities</li>
            </ul>
            
            <h4>Business Transfers</h4>
            <p>If we are acquired or merge with another company, your information may be transferred as part of that transaction.</p>
            
            <h3>4. Data Security</h3>
            
            <ul>
              <li><strong>Encryption:</strong> All data is encrypted in transit and at rest</li>
              <li><strong>Access Controls:</strong> Strict access controls and authentication</li>
              <li><strong>Regular Audits:</strong> Security assessments and vulnerability testing</li>
              <li><strong>Incident Response:</strong> Procedures for handling security breaches</li>
            </ul>
            
            <h3>5. Data Retention</h3>
            
            <ul>
              <li><strong>Account Data:</strong> Retained while your account is active</li>
              <li><strong>Design Projects:</strong> Stored until you delete them or close your account</li>
              <li><strong>Communication Logs:</strong> Kept for customer service purposes (up to 2 years)</li>
              <li><strong>Analytics Data:</strong> Aggregated data may be retained indefinitely</li>
            </ul>
            
            <h3>6. Your Rights and Choices</h3>
            
            <h4>Account Management</h4>
            <ul>
              <li><strong>Access:</strong> View and download your personal data</li>
              <li><strong>Update:</strong> Modify your account information anytime</li>
              <li><strong>Delete:</strong> Request account deletion (data removed within 30 days)</li>
              <li><strong>Export:</strong> Download your design projects and data</li>
            </ul>
            
            <h4>Communication Preferences</h4>
            <ul>
              <li><strong>Email:</strong> Unsubscribe from marketing emails (account emails still sent)</li>
              <li><strong>WhatsApp:</strong> Reply "STOP" to opt out of WhatsApp messages</li>
              <li><strong>Push Notifications:</strong> Manage in your device settings</li>
            </ul>
            
            <h3>7. Cookies and Tracking</h3>
            
            <p>We use cookies and similar technologies for:</p>
            <ul>
              <li><strong>Essential Functions:</strong> Authentication, security, basic functionality</li>
              <li><strong>Analytics:</strong> Understanding usage patterns (anonymized)</li>
              <li><strong>Preferences:</strong> Remembering your settings and choices</li>
            </ul>
            
            <h3>8. Third-Party Services</h3>
            
            <p>Our platform integrates with third-party services that have their own privacy policies:</p>
            <ul>
              <li><strong>Supabase:</strong> Database and authentication services</li>
              <li><strong>Font Providers:</strong> Google Fonts and other typography services</li>
              <li><strong>Image Services:</strong> Stock photo and icon providers</li>
            </ul>
            
            <h3>9. Children's Privacy</h3>
            
            <p>Our service is not intended for children under 13. We do not knowingly collect personal information from children under 13. If you believe we have collected such information, please contact us immediately.</p>
            
            <h3>10. International Data Transfers</h3>
            
            <p>Your data may be processed in countries other than your own. We ensure adequate protection through appropriate safeguards and compliance with applicable laws.</p>
            
            <h3>11. Changes to This Policy</h3>
            
            <p>We may update this privacy policy to reflect changes in our practices or legal requirements. We will notify you of significant changes via email or platform notification.</p>
            
            <h3>12. Contact Us</h3>
            
            <p>For privacy-related questions or to exercise your rights, contact us:</p>
            <ul>
              <li><strong>Email:</strong> privacy@koechdesignlab.com</li>
              <li><strong>Data Protection Officer:</strong> dpo@koechdesignlab.com</li>
              <li><strong>Mailing Address:</strong> [Your Business Address]</li>
            </ul>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 