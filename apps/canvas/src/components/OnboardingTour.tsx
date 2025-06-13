import React, { useState } from 'react';
import { 
  ArrowRight, 
  ArrowLeft, 
  X, 
  Play, 
  Layers, 
  Type, 
  Palette, 
  Settings,
  Download,
  Save
} from 'lucide-react';

interface OnboardingTourProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const tourSteps = [
  {
    id: 1,
    title: "Welcome to Koech Design Lab! 🎨",
    description: "Let's take a quick tour to get you started with creating amazing designs.",
    icon: Play,
    position: "center",
  },
  {
    id: 2,
    title: "Dashboard - Your Creative Hub",
    description: "This is your dashboard where you can create new projects, browse templates, and manage all your designs.",
    icon: Palette,
    position: "center",
    target: "#dashboard-main",
  },
  {
    id: 3,
    title: "Quick Start Templates",
    description: "Jump right in with pre-designed templates for Instagram, LinkedIn, Twitter, and TikTok.",
    icon: Type,
    position: "top",
    target: "#quick-start-section",
  },
  {
    id: 4,
    title: "Design Editor Mode",
    description: "When you create or open a project, you'll enter the design editor with powerful tools at your fingertips.",
    icon: Layers,
    position: "center",
  },
  {
    id: 5,
    title: "Left Panel - Design Tools",
    description: "Access layers and properties to fine-tune your designs with precision.",
    icon: Settings,
    position: "right",
    target: "#left-panel",
  },
  {
    id: 6,
    title: "Right Panel - Resources",
    description: "Add elements, use your brand assets, and access all the building blocks for your designs.",
    icon: Type,
    position: "left",
    target: "#right-panel",
  },
  {
    id: 7,
    title: "Save & Export",
    description: "Your work is automatically saved, and you can export high-quality designs anytime.",
    icon: Download,
    position: "bottom",
    target: "#editor-actions",
  },
  {
    id: 8,
    title: "You're All Set! 🚀",
    description: "Ready to create something amazing? Start with a template or begin from scratch!",
    icon: Save,
    position: "center",
  },
];

export function OnboardingTour({ isOpen, onClose, onComplete }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(isOpen);

  React.useEffect(() => {
    setIsVisible(isOpen);
  }, [isOpen]);

  if (!isVisible) return null;

  const currentTourStep = tourSteps[currentStep];
  const isLastStep = currentStep === tourSteps.length - 1;
  const isFirstStep = currentStep === 0;

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
      handleClose();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    onClose();
  };

  const handleSkip = () => {
    onComplete();
    handleClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300">
        {/* Tour Step Card */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div 
            className="max-w-md w-full mx-4 rounded-2xl shadow-2xl border"
            style={{ backgroundColor: '#002e51', borderColor: '#004080' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: '#004080' }}>
              <div className="flex items-center space-x-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#ff4940' }}
                >
                  <currentTourStep.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">{currentTourStep.title}</h2>
                  <p className="text-xs text-gray-400">Step {currentStep + 1} of {tourSteps.length}</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <p className="text-gray-300 leading-relaxed mb-4">
                {currentTourStep.description}
              </p>

              {/* Progress bar */}
              <div className="mb-6">
                <div className="flex justify-between text-xs text-gray-400 mb-2">
                  <span>Progress</span>
                  <span>{Math.round(((currentStep + 1) / tourSteps.length) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{ 
                      backgroundColor: '#ff4940',
                      width: `${((currentStep + 1) / tourSteps.length) * 100}%`
                    }}
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {!isFirstStep && (
                    <button
                      onClick={handlePrevious}
                      className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-300 hover:text-white transition-colors"
                      style={{ backgroundColor: '#003a63' }}
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Previous</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleSkip}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Skip tour
                  </button>
                  <button
                    onClick={handleNext}
                    className="flex items-center space-x-2 px-6 py-2 rounded-lg font-medium transition-all duration-200 hover:opacity-90"
                    style={{ backgroundColor: '#ff4940', color: 'white' }}
                  >
                    <span>{isLastStep ? 'Get Started' : 'Next'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Spotlight highlights for specific elements */}
        {currentTourStep.target && (
          <div className="absolute inset-0 pointer-events-none">
            {/* This would highlight specific UI elements */}
            <div 
              className="absolute border-2 border-red-500 rounded-lg animate-pulse"
              style={{
                // Position would be calculated based on the target selector
                // This is a simplified version
                top: '20%',
                left: '20%',
                width: '60%',
                height: '20%',
              }}
            />
          </div>
        )}
      </div>
    </>
  );
} 