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
  tagline: string;
  description: string;
  website: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  logo: string;
  logoIcon: string;
  logoHorizontal: string;
  industry: string;
  brandTone: string;
  targetAudience: string;
  socialMedia: {
    instagram: string;
    twitter: string;
    facebook: string;
    linkedin: string;
  };
  fontPreferences: {
    primary: string;
    secondary: string;
  };
  additionalColors: Array<{ name: string; hex: string }>;
}

export function SignupPageBrandAware({ onSwitchToLogin }: SignupPageProps) {
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
    tagline: '',
    description: '',
    website: '',
    primaryColor: '#ff4940',
    secondaryColor: '#002e51',
    accentColor: '#6366f1',
    logo: '',
    logoIcon: '',
    logoHorizontal: '',
    industry: '',
    brandTone: '',
    targetAudience: '',
    socialMedia: {
      instagram: '',
      twitter: '',
      facebook: '',
      linkedin: ''
    },
    fontPreferences: {
      primary: 'Inter',
      secondary: 'Roboto'
    },
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
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const { register } = useAuth();

  // Industries list
  const industries = [
    'Technology', 'Healthcare', 'Finance', 'Education', 'Retail', 'Manufacturing',
    'Real Estate', 'Food & Beverage', 'Marketing & Advertising', 'Consulting',
    'Non-profit', 'Entertainment', 'Travel & Tourism', 'Automotive', 'Other'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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

  // Handle different logo types
  const handleLogoUploadByType = (event: React.ChangeEvent<HTMLInputElement>, logoType: 'logo' | 'logoIcon' | 'logoHorizontal') => {
    const file = event.target.files?.[0];
    if (file) {
      const logoUrl = URL.createObjectURL(file);
      setBrandData(prev => ({ ...prev, [logoType]: logoUrl }));
    }
  };

  // Handle social media inputs
  const handleSocialMediaChange = (platform: keyof BrandData['socialMedia'], value: string) => {
    setBrandData(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [platform]: value
      }
    }));
    if (error) setError('');
  };

  // Handle font preference changes
  const handleFontPreferenceChange = (type: 'primary' | 'secondary', value: string) => {
    setBrandData(prev => ({
      ...prev,
      fontPreferences: {
        ...prev.fontPreferences,
        [type]: value
      }
    }));
    if (error) setError('');
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

  // Format user-friendly error messages
  const formatErrorMessage = (error: any): string => {
    if (!error) return 'An unexpected error occurred';
    
    // Handle specific error codes and messages
    if (typeof error === 'string') {
      // Handle common error messages
      if (error === 'User already registered') {
        return 'An account with this email already exists. Please try logging in instead.';
      }
      if (error.includes('invalid email')) {
        return 'Please enter a valid email address.';
      }
      if (error.includes('password')) {
        return 'Password must be at least 8 characters long.';
      }
      return error;
    }

    // Handle error objects with codes
    if (error.code) {
      switch (error.code) {
        case 'user_already_exists':
          return 'An account with this email already exists. Please try logging in instead.';
        case 'invalid_credentials':
          return 'The email or password you entered is incorrect.';
        case 'email_not_confirmed':
          return 'Please check your email and click the confirmation link before logging in.';
        case 'signup_disabled':
          return 'Account registration is currently disabled. Please contact support.';
        case 'email_address_invalid':
          return 'Please enter a valid email address.';
        case 'password_too_short':
          return 'Password must be at least 8 characters long.';
        case 'weak_password':
          return 'Please choose a stronger password with letters, numbers, and special characters.';
        case 'rate_limit_exceeded':
          return 'Too many attempts. Please wait a few minutes before trying again.';
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
    console.log('🚨 [TOAST] Showing error:', errorMessage);
    setError(errorMessage);
    
    // Force toast to show with simpler configuration
    toast.error(errorMessage, {
      position: "top-center",
      autoClose: 6000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    
    console.log('🚨 [TOAST] Toast.error called');
  };

  // Show success message
  const showSuccess = (message: string) => {
    console.log('✅ [TOAST] Showing success:', message);
    setSuccess(message);
    toast.success(message, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    console.log('✅ [TOAST] Toast.success called');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // If not on the last step, validate current step and move to next
    if (currentStep < totalSteps) {
      const stepError = validateStep(currentStep);
      if (stepError) {
        showError(stepError);
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

    const validationError = validateForm();
    if (validationError) {
      console.error('🔴 [SIGNUP] Validation failed:', validationError);
      showError(validationError);
      return;
    }

    console.log('✅ [SIGNUP] Validation passed, calling register...');
    setIsLoading(true);

    try {
      const result = await register(
        formData.email, 
        formData.password, 
        formData.firstName, 
        formData.lastName,
        formData.phone
      );
      
      console.log('📥 [SIGNUP] Register function returned:', result);

      if (result.success) {
        console.log('🎉 [SIGNUP] Registration successful!');
        
        const successMessage = '🎉 Account created successfully! Please check your email to confirm your account.';
        showSuccess(successMessage);
        
        // Store brand data in localStorage temporarily for the BrandContext to pick up
        const brandDataToStore = {
          name: brandData.brandName || 'My Brand',
          tagline: brandData.tagline,
          description: brandData.description,
          website: brandData.website,
          industry: brandData.industry,
          brandTone: brandData.brandTone,
          targetAudience: brandData.targetAudience,
          colors: [
            { name: 'Primary', hex: brandData.primaryColor },
            { name: 'Secondary', hex: brandData.secondaryColor },
            { name: 'Accent', hex: brandData.accentColor },
            ...brandData.additionalColors
          ],
          fonts: [
            { name: brandData.fontPreferences.primary, url: '', family: `${brandData.fontPreferences.primary}, sans-serif` },
            { name: brandData.fontPreferences.secondary, url: '', family: `${brandData.fontPreferences.secondary}, sans-serif` },
            { name: 'Poppins', url: '', family: 'Poppins, sans-serif' },
          ],
          logo: brandData.logo,
          logoIcon: brandData.logoIcon,
          logoHorizontal: brandData.logoHorizontal,
          socialMedia: brandData.socialMedia,
          fontPreferences: brandData.fontPreferences,
          createdAt: new Date().toISOString()
        };
        
        localStorage.setItem('pendingBrandData', JSON.stringify(brandDataToStore));
        console.log('🎨 [BRAND] Stored pending brand data:', brandDataToStore);
        
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
          tagline: '',
          description: '',
          website: '',
          primaryColor: '#ff4940',
          secondaryColor: '#002e51',
          accentColor: '#6366f1',
          logo: '',
          logoIcon: '',
          logoHorizontal: '',
          industry: '',
          brandTone: '',
          targetAudience: '',
          socialMedia: {
            instagram: '',
            twitter: '',
            facebook: '',
            linkedin: ''
          },
          fontPreferences: {
            primary: 'Inter',
            secondary: 'Roboto'
          },
          additionalColors: []
        });
        setAgreedToTerms(false);
        setAgreedToPrivacy(false);

        // Switch to login page after successful registration
        // User needs to confirm email before they can log in
        setTimeout(() => {
          onSwitchToLogin();
        }, 3000);
      } else {
        console.error('🔴 [SIGNUP] Registration failed:', result.error);
        showError(result.error);
      }
    } catch (error: any) {
      console.error('💥 [SIGNUP] Exception caught:', error);
      showError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-2 py-4 relative"
      style={{ 
        background: 'linear-gradient(135deg, #002e51 0%, #002e51 100%)' 
      }}
    >
      <div className="max-w-md w-full space-y-4">
        {/* Logo/Brand */}
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center" style={{ backgroundColor: '#ff4940' }}>
            <UserPlus className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">Create Account</h2>
          <p className="mt-1 text-gray-400 text-sm">Join Koech Labs today</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center space-x-2 mb-4">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                step === currentStep 
                  ? 'bg-red-500 text-white' 
                  : step < currentStep 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-600 text-gray-300'
                }`}>
                {step < currentStep ? <CheckCircle className="w-3 h-3" /> : step}
              </div>
              {step < 3 && <div className={`w-8 h-0.5 mx-1 ${step < currentStep ? 'bg-green-500' : 'bg-gray-600'}`} />}
            </div>
          ))}
        </div>

        {/* Step Titles */}
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold text-white">
            {currentStep === 1 && 'Personal Information'}
            {currentStep === 2 && 'Brand Details'}
            {currentStep === 3 && 'Terms & Conditions'}
          </h3>
          <p className="text-gray-400 text-xs mt-1">
            {currentStep === 1 && 'Tell us about yourself'}
            {currentStep === 2 && 'Set up your brand identity'}
            {currentStep === 3 && 'Review and accept our terms'}
          </p>
        </div>

        {/* Signup Form */}
        <div 
          className="p-4 rounded-xl shadow-2xl max-h-[calc(100vh-16rem)] overflow-y-auto"
          style={{ backgroundColor: '#003a63' }}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-3">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="firstName" className="block text-xs font-medium text-gray-300 mb-1">
                      First Name *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                        <User className="w-4 h-4 text-gray-400" />
                      </div>
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        autoComplete="given-name"
                        required
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full pl-8 pr-2 py-2 border border-gray-600 rounded-lg bg-gray-800 text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                        placeholder="First name"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-xs font-medium text-gray-300 mb-1">
                      Last Name *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                        <User className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        autoComplete="family-name"
                        required
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full pl-8 pr-2 py-2 border border-gray-600 rounded-lg bg-gray-800 text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                        placeholder="Last name"
                      />
                    </div>
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-xs font-medium text-gray-300 mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-8 pr-2 py-2 border border-gray-600 rounded-lg bg-gray-800 text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                {/* Phone Field */}
                <div>
                  <label htmlFor="phone" className="block text-xs font-medium text-gray-300 mb-1">
                    Phone Number <span className="text-gray-500">(Optional)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                      <Phone className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full pl-8 pr-2 py-2 border border-gray-600 rounded-lg bg-gray-800 text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-xs font-medium text-gray-300 mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full pl-8 pr-10 py-2 border border-gray-600 rounded-lg bg-gray-800 text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                      placeholder="Create a password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-2 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-300" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400 hover:text-gray-300" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-xs font-medium text-gray-300 mb-1">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full pl-8 pr-10 py-2 border border-gray-600 rounded-lg bg-gray-800 text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-2 flex items-center"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-300" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400 hover:text-gray-300" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Brand Details */}
            {currentStep === 2 && (
              <div className="space-y-3">
                {/* Brand Name */}
                <div>
                  <label htmlFor="brandName" className="block text-xs font-medium text-gray-300 mb-1">
                    Brand Name *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                      <Palette className="w-4 h-4 text-gray-400" />
                    </div>
                    <input
                      id="brandName"
                      type="text"
                      required
                      value={brandData.brandName}
                      onChange={(e) => handleBrandInputChange('brandName', e.target.value)}
                      className="w-full pl-8 pr-2 py-2 border border-gray-600 rounded-lg bg-gray-800 text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                      placeholder="Your brand or company name"
                    />
                  </div>
                </div>

                {/* Industry */}
                <div>
                  <label htmlFor="industry" className="block text-xs font-medium text-gray-300 mb-1">
                    Industry <span className="text-gray-500">(Optional)</span>
                  </label>
                  <select
                    id="industry"
                    value={brandData.industry}
                    onChange={(e) => handleBrandInputChange('industry', e.target.value)}
                    className="w-full px-2 py-2 border border-gray-600 rounded-lg bg-gray-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select your industry</option>
                    {industries.map((industry) => (
                      <option key={industry} value={industry}>{industry}</option>
                    ))}
                  </select>
                </div>

                {/* Color Palette */}
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-2">
                    Brand Colors
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {/* Primary Color */}
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Primary</label>
                      <div className="relative">
                        <input
                          type="color"
                          value={brandData.primaryColor}
                          onChange={(e) => handleBrandInputChange('primaryColor', e.target.value)}
                          className="w-full h-8 bg-transparent cursor-pointer rounded border border-gray-600"
                        />
                        <input
                          type="text"
                          value={brandData.primaryColor}
                          onChange={(e) => handleBrandInputChange('primaryColor', e.target.value)}
                          className="mt-1 w-full px-1 py-1 bg-gray-700 border border-gray-600 rounded text-white text-xs"
                        />
                      </div>
                    </div>

                    {/* Secondary Color */}
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Secondary</label>
                      <div className="relative">
                        <input
                          type="color"
                          value={brandData.secondaryColor}
                          onChange={(e) => handleBrandInputChange('secondaryColor', e.target.value)}
                          className="w-full h-8 bg-transparent cursor-pointer rounded border border-gray-600"
                        />
                        <input
                          type="text"
                          value={brandData.secondaryColor}
                          onChange={(e) => handleBrandInputChange('secondaryColor', e.target.value)}
                          className="mt-1 w-full px-1 py-1 bg-gray-700 border border-gray-600 rounded text-white text-xs"
                        />
                      </div>
                    </div>

                    {/* Accent Color */}
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Accent</label>
                      <div className="relative">
                        <input
                          type="color"
                          value={brandData.accentColor}
                          onChange={(e) => handleBrandInputChange('accentColor', e.target.value)}
                          className="w-full h-8 bg-transparent cursor-pointer rounded border border-gray-600"
                        />
                        <input
                          type="text"
                          value={brandData.accentColor}
                          onChange={(e) => handleBrandInputChange('accentColor', e.target.value)}
                          className="mt-1 w-full px-1 py-1 bg-gray-700 border border-gray-600 rounded text-white text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Colors */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-medium text-gray-300">
                      Additional Colors <span className="text-gray-500">(Optional)</span>
                    </label>
                    <button
                      type="button"
                      onClick={addCustomColor}
                      className="text-xs px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                    >
                      Add Color
                    </button>
                  </div>
                  
                  {brandData.additionalColors.map((color, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <input
                        type="text"
                        value={color.name}
                        onChange={(e) => updateAdditionalColor(index, 'name', e.target.value)}
                        placeholder="Color name"
                        className="flex-1 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-xs"
                      />
                      <input
                        type="color"
                        value={color.hex}
                        onChange={(e) => updateAdditionalColor(index, 'hex', e.target.value)}
                        className="w-8 h-8 bg-transparent cursor-pointer rounded border border-gray-600"
                      />
                      <button
                        type="button"
                        onClick={() => removeAdditionalColor(index)}
                        className="p-1 text-red-400 hover:text-red-300"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                {/* Logo Upload */}
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-2">
                    Brand Logo <span className="text-gray-500">(Optional)</span>
                  </label>
                  
                  {brandData.logo && (
                    <div className="mb-3 p-2 bg-gray-800 rounded">
                      <img 
                        src={brandData.logo} 
                        alt="Brand Logo" 
                        className="w-full h-16 object-contain rounded"
                      />
                      <button
                        type="button"
                        onClick={() => handleBrandInputChange('logo', '')}
                        className="mt-1 text-red-400 hover:text-red-300 text-xs"
                      >
                        Remove Logo
                      </button>
                    </div>
                  )}

                  <label className="block">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                    <div className="flex items-center justify-center space-x-2 p-3 border-2 border-dashed border-gray-600 rounded cursor-pointer hover:border-red-500 transition-colors">
                      <Upload className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-400 text-xs">Upload Logo</span>
                    </div>
                  </label>
                </div>

                {/* Essential Brand Info - Compact */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label htmlFor="tagline" className="block text-xs font-medium text-gray-300 mb-1">
                      Tagline <span className="text-gray-500">(Optional)</span>
                    </label>
                    <input
                      id="tagline"
                      type="text"
                      value={brandData.tagline}
                      onChange={(e) => handleBrandInputChange('tagline', e.target.value)}
                      className="w-full px-2 py-2 border border-gray-600 rounded bg-gray-800 text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Your slogan"
                    />
                  </div>

                  <div>
                    <label htmlFor="website" className="block text-xs font-medium text-gray-300 mb-1">
                      Website <span className="text-gray-500">(Optional)</span>
                    </label>
                    <input
                      id="website"
                      type="url"
                      value={brandData.website}
                      onChange={(e) => handleBrandInputChange('website', e.target.value)}
                      className="w-full px-2 py-2 border border-gray-600 rounded bg-gray-800 text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="yourbrand.com"
                    />
                  </div>
                </div>

                <p className="text-xs text-gray-500 text-center">
                  You can add more details later in the editor!
                </p>
              </div>
            )}

            {/* Step 3: Terms and Conditions */}
            {currentStep === 3 && (
              <div className="space-y-3">
                {/* Brand Summary */}
                <div className="p-3 bg-gray-800 rounded">
                  <h3 className="text-xs font-medium text-white mb-2">Account Summary</h3>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Name:</span>
                      <span className="text-white">{formData.firstName} {formData.lastName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Email:</span>
                      <span className="text-white">{formData.email}</span>
                    </div>
                    {brandData.brandName && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Brand:</span>
                        <span className="text-white">{brandData.brandName}</span>
                      </div>
                    )}
                    {brandData.brandName && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Colors:</span>
                        <div className="flex space-x-1">
                          <div className="w-3 h-3 rounded" style={{ backgroundColor: brandData.primaryColor }} />
                          <div className="w-3 h-3 rounded" style={{ backgroundColor: brandData.secondaryColor }} />
                          <div className="w-3 h-3 rounded" style={{ backgroundColor: brandData.accentColor }} />
                        </div>
                      </div>
                    )}
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
                      className="mt-1 h-3 w-3 text-red-500 focus:ring-red-500 border-gray-600 rounded bg-gray-800"
                    />
                    <label htmlFor="agreeTerms" className="ml-2 text-xs text-gray-300">
                      I agree to the{' '}
                      <button
                        type="button"
                        onClick={() => setShowTermsModal(true)}
                        className="text-red-400 hover:text-red-300 underline inline-flex items-center"
                      >
                        Terms and Conditions <ExternalLink className="w-2 h-2 ml-1" />
                      </button>
                    </label>
                  </div>

                  <div className="flex items-start">
                    <input
                      id="agreePrivacy"
                      type="checkbox"
                      checked={agreedToPrivacy}
                      onChange={(e) => setAgreedToPrivacy(e.target.checked)}
                      className="mt-1 h-3 w-3 text-red-500 focus:ring-red-500 border-gray-600 rounded bg-gray-800"
                    />
                    <label htmlFor="agreePrivacy" className="ml-2 text-xs text-gray-300">
                      I agree to the{' '}
                      <button
                        type="button"
                        onClick={() => setShowPrivacyModal(true)}
                        className="text-red-400 hover:text-red-300 underline inline-flex items-center"
                      >
                        Privacy Policy <ExternalLink className="w-2 h-2 ml-1" />
                      </button>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="p-2 rounded bg-green-500/10 border border-green-500/20">
                <p className="text-xs text-green-400">{success}</p>
                <p className="text-xs text-green-300 mt-1">
                  You'll be redirected to login. Confirm your email to access the canvas.
                </p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 shadow-md">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-4 w-4 text-red-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-2 flex-1">
                    <p className="text-sm font-medium text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className={`flex items-center space-x-1 px-3 py-2 rounded font-medium text-sm transition-all duration-200 ${
                  currentStep === 1 
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                    : 'bg-gray-600 text-white hover:bg-gray-500'
                }`}
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Previous</span>
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center space-x-1 px-4 py-2 rounded text-white font-medium text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ 
                  backgroundColor: '#ff4940',
                  opacity: isLoading ? 0.7 : 1
                }}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                    <span>{currentStep === totalSteps ? 'Creating...' : 'Processing...'}</span>
                  </>
                ) : (
                  <>
                    <span>{currentStep === totalSteps ? 'Create Account' : 'Next'}</span>
                    {currentStep < totalSteps && <ArrowRight className="w-3 h-3" />}
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Switch to Login */}
          <div className="mt-4 text-center">
            <p className="text-gray-400 text-xs">
              Already have an account?{' '}
              <button
                onClick={onSwitchToLogin}
                className="text-red-400 hover:text-red-300 font-medium transition-colors duration-200"
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Terms Modal */}
      {showTermsModal && (
        <TermsModal onClose={() => setShowTermsModal(false)} />
      )}

      {/* Privacy Modal */}
      {showPrivacyModal && (
        <PrivacyModal onClose={() => setShowPrivacyModal(false)} />
      )}
      


      {/* Footer - positioned absolutely at bottom */}
      <div className="absolute bottom-4 left-0 right-0 text-center">
        <p className="text-gray-500 text-xs">
          © 2024 Koech Design Lab. All rights reserved.
        </p>
      </div>
    </div>
  );
}

// Terms Modal Component
function TermsModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Terms and Conditions</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              ×
            </button>
          </div>
          <div className="text-gray-300 text-sm space-y-4">
            <p><strong>1. Acceptance of Terms</strong></p>
            <p>By creating an account with Koech Design Lab, you agree to these Terms and Conditions.</p>
            
            <p><strong>2. Account Responsibility</strong></p>
            <p>You are responsible for maintaining the confidentiality of your account credentials.</p>
            
            <p><strong>3. Design Usage Rights</strong></p>
            <p>You retain ownership of designs created using our platform. We provide you with tools to create, but the creative output belongs to you.</p>
            
            <p><strong>4. Service Availability</strong></p>
            <p>We strive to maintain 99.9% uptime but cannot guarantee uninterrupted service.</p>
            
            <p><strong>5. Data Processing</strong></p>
            <p>Your brand information and designs are processed according to our Privacy Policy.</p>
            
            <p><strong>6. Termination</strong></p>
            <p>Either party may terminate the account at any time. Your data will be handled according to our data retention policy.</p>
            
            <p className="text-xs text-gray-500">Last updated: December 2024</p>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Privacy Modal Component
function PrivacyModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Privacy Policy</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              ×
            </button>
          </div>
          <div className="text-gray-300 text-sm space-y-4">
            <p><strong>Information We Collect</strong></p>
            <p>We collect information you provide directly, such as your name, email, phone number, and brand details.</p>
            
            <p><strong>How We Use Your Information</strong></p>
            <p>- To provide and improve our design services<br/>
            - To personalize your experience with brand-specific defaults<br/>
            - To communicate important account information<br/>
            - To provide customer support</p>
            
            <p><strong>Brand Data</strong></p>
            <p>Your brand colors, logos, and design preferences are stored securely and used to enhance your design experience. This data is never shared with third parties without your explicit consent.</p>
            
            <p><strong>Data Security</strong></p>
            <p>We implement industry-standard security measures to protect your personal and brand information.</p>
            
            <p><strong>Data Retention</strong></p>
            <p>We retain your information for as long as your account is active or as needed to provide services.</p>
            
            <p><strong>Your Rights</strong></p>
            <p>You have the right to access, update, or delete your personal information at any time through your account settings.</p>
            
            <p><strong>Contact Us</strong></p>
            <p>If you have questions about this Privacy Policy, contact us at privacy@koechdesignlab.com</p>
            
            <p className="text-xs text-gray-500">Last updated: December 2024</p>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 