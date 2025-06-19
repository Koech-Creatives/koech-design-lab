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

    const validationError = validateForm();
    if (validationError) {
      console.error('🔴 [SIGNUP] Validation failed:', validationError);
      setError(validationError);
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
        setAgreedToTerms(false);
        setAgreedToPrivacy(false);

        // Switch to login page after successful registration
        // User needs to confirm email before they can log in
        setTimeout(() => {
          onSwitchToLogin();
        }, 3000);
      } else {
        console.error('🔴 [SIGNUP] Registration failed:', result.error);
        setError(result.error || 'Registration failed');
        toast.error(result.error || 'Registration failed');
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'An unexpected error occurred';
      console.error('💥 [SIGNUP] Exception caught:', error);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
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
          <p className="mt-2 text-gray-400">Join Koech Labs today</p>
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
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">
                      First Name *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="w-5 h-5 text-gray-400" />
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
              </div>
            )}

            {/* Step 2: Brand Details */}
            {currentStep === 2 && (
              <div className="space-y-6">
                {/* Brand Name */}
                <div>
                  <label htmlFor="brandName" className="block text-sm font-medium text-gray-300 mb-2">
                    Brand Name *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Palette className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      id="brandName"
                      type="text"
                      required
                      value={brandData.brandName}
                      onChange={(e) => handleBrandInputChange('brandName', e.target.value)}
                      className="w-full pl-10 pr-3 py-3 border border-gray-600 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                      placeholder="Your brand or company name"
                    />
                  </div>
                </div>

                {/* Industry */}
                <div>
                  <label htmlFor="industry" className="block text-sm font-medium text-gray-300 mb-2">
                    Industry <span className="text-gray-500">(Optional)</span>
                  </label>
                  <select
                    id="industry"
                    value={brandData.industry}
                    onChange={(e) => handleBrandInputChange('industry', e.target.value)}
                    className="w-full px-3 py-3 border border-gray-600 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select your industry</option>
                    {industries.map((industry) => (
                      <option key={industry} value={industry}>{industry}</option>
                    ))}
                  </select>
                </div>

                {/* Color Palette */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Brand Colors
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {/* Primary Color */}
                    <div>
                      <label className="block text-xs text-gray-400 mb-2">Primary</label>
                      <div className="relative">
                        <input
                          type="color"
                          value={brandData.primaryColor}
                          onChange={(e) => handleBrandInputChange('primaryColor', e.target.value)}
                          className="w-full h-12 bg-transparent cursor-pointer rounded-lg border border-gray-600"
                        />
                        <input
                          type="text"
                          value={brandData.primaryColor}
                          onChange={(e) => handleBrandInputChange('primaryColor', e.target.value)}
                          className="mt-1 w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-xs"
                        />
                      </div>
                    </div>

                    {/* Secondary Color */}
                    <div>
                      <label className="block text-xs text-gray-400 mb-2">Secondary</label>
                      <div className="relative">
                        <input
                          type="color"
                          value={brandData.secondaryColor}
                          onChange={(e) => handleBrandInputChange('secondaryColor', e.target.value)}
                          className="w-full h-12 bg-transparent cursor-pointer rounded-lg border border-gray-600"
                        />
                        <input
                          type="text"
                          value={brandData.secondaryColor}
                          onChange={(e) => handleBrandInputChange('secondaryColor', e.target.value)}
                          className="mt-1 w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-xs"
                        />
                      </div>
                    </div>

                    {/* Accent Color */}
                    <div>
                      <label className="block text-xs text-gray-400 mb-2">Accent</label>
                      <div className="relative">
                        <input
                          type="color"
                          value={brandData.accentColor}
                          onChange={(e) => handleBrandInputChange('accentColor', e.target.value)}
                          className="w-full h-12 bg-transparent cursor-pointer rounded-lg border border-gray-600"
                        />
                        <input
                          type="text"
                          value={brandData.accentColor}
                          onChange={(e) => handleBrandInputChange('accentColor', e.target.value)}
                          className="mt-1 w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Colors */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-300">
                      Additional Colors <span className="text-gray-500">(Optional)</span>
                    </label>
                    <button
                      type="button"
                      onClick={addCustomColor}
                      className="text-xs px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
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
                        className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                      />
                      <input
                        type="color"
                        value={color.hex}
                        onChange={(e) => updateAdditionalColor(index, 'hex', e.target.value)}
                        className="w-12 h-10 bg-transparent cursor-pointer rounded border border-gray-600"
                      />
                      <button
                        type="button"
                        onClick={() => removeAdditionalColor(index)}
                        className="p-2 text-red-400 hover:text-red-300"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                {/* Logo Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Brand Logo <span className="text-gray-500">(Optional)</span>
                  </label>
                  
                  {brandData.logo && (
                    <div className="mb-4 p-3 bg-gray-800 rounded-lg">
                      <img 
                        src={brandData.logo} 
                        alt="Brand Logo" 
                        className="w-full h-20 object-contain rounded"
                      />
                      <button
                        type="button"
                        onClick={() => handleBrandInputChange('logo', '')}
                        className="mt-2 text-red-400 hover:text-red-300 text-sm"
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
                    <div className="flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-red-500 transition-colors">
                      <Upload className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-400">Upload Logo</span>
                    </div>
                  </label>
                </div>

                <p className="text-xs text-gray-500 text-center">
                  Don't worry, you can always customize these later in the editor!
                </p>
              </div>
            )}

            {/* Step 3: Terms and Conditions */}
            {currentStep === 3 && (
              <div className="space-y-6">
                {/* Brand Summary */}
                <div className="p-4 bg-gray-800 rounded-lg">
                  <h3 className="text-sm font-medium text-white mb-3">Account Summary</h3>
                  <div className="space-y-2 text-sm">
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
                          <div className="w-4 h-4 rounded" style={{ backgroundColor: brandData.primaryColor }} />
                          <div className="w-4 h-4 rounded" style={{ backgroundColor: brandData.secondaryColor }} />
                          <div className="w-4 h-4 rounded" style={{ backgroundColor: brandData.accentColor }} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="space-y-4">
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
              </div>
            )}

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

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  currentStep === 1 
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                    : 'bg-gray-600 text-white hover:bg-gray-500'
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center space-x-2 px-6 py-2 rounded-lg text-white font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ 
                  backgroundColor: '#ff4940',
                  opacity: isLoading ? 0.7 : 1
                }}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>{currentStep === totalSteps ? 'Creating Account...' : 'Processing...'}</span>
                  </>
                ) : (
                  <>
                    <span>{currentStep === totalSteps ? 'Create Account' : 'Next'}</span>
                    {currentStep < totalSteps && <ArrowRight className="w-4 h-4" />}
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Switch to Login */}
          <div className="mt-6 text-center">
            <p className="text-gray-400">
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
      
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        toastStyle={{
          backgroundColor: '#003a63',
          color: '#ffffff',
          border: '1px solid #ff4940'
        }}
      />
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