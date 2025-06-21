import React, { useState } from 'react';
import { X, Mail, ArrowRight, Star, Users, Sparkles } from 'lucide-react';

interface ConversionPromptProps {
  isOpen: boolean;
  onClose: () => void;
  onSignup: () => void;
  trigger: {
    type: string;
    message: string;
  } | null;
  onEmailCapture: (email: string, context: string) => Promise<{ success: boolean; error?: string }>;
}

export function ConversionPrompt({ 
  isOpen, 
  onClose, 
  onSignup, 
  trigger, 
  onEmailCapture 
}: ConversionPromptProps) {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'prompt' | 'email' | 'success'>('prompt');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !trigger) return null;

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setError('');

    try {
      const result = await onEmailCapture(email, trigger.type);
      if (result.success) {
        setStep('success');
        setTimeout(() => {
          onClose();
          setStep('prompt');
          setEmail('');
        }, 3000);
      } else {
        setError(result.error || 'Failed to save email');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getPromptContent = () => {
    switch (trigger.type) {
      case 'time_spent':
        return {
          icon: <Sparkles className="w-8 h-8 text-yellow-400" />,
          title: "You're on fire! 🔥",
          subtitle: "10 minutes of pure creativity",
          features: ["Save unlimited projects", "HD exports", "No watermarks"]
        };
      case 'projects_created':
        return {
          icon: <Star className="w-8 h-8" style={{ color: '#ff4940' }} />,
          title: "Amazing work! ⭐",
          subtitle: "You've created multiple designs",
          features: ["Project library", "Cloud sync", "Share anywhere"]
        };
      case 'features_used':
        return {
          icon: <Users className="w-8 h-8 text-blue-400" />,
          title: "You're a natural! 🎨",
          subtitle: "Exploring like a pro designer",
          features: ["Advanced tools", "Premium templates", "Priority support"]
        };
      case 'export_attempt':
        return {
          icon: <ArrowRight className="w-8 h-8 text-green-400" />,
          title: "Ready to export? 📥",
          subtitle: "Get high-quality downloads",
          features: ["HD quality", "No watermarks", "Multiple formats"]
        };
      default:
        return {
          icon: <Sparkles className="w-8 h-8 text-indigo-400" />,
          title: "Unlock your potential! 🚀",
          subtitle: "Join thousands of creators",
          features: ["Premium features", "Unlimited access", "Free forever"]
        };
    }
  };

  const content = getPromptContent();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div 
        className="max-w-md w-full rounded-xl shadow-2xl overflow-hidden"
        style={{ backgroundColor: '#003a63' }}
      >
        {/* Header */}
        <div className="relative p-6 text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {step === 'prompt' && (
            <>
              <div className="mb-4 flex justify-center">
                {content.icon}
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                {content.title}
              </h3>
              <p className="text-gray-300 mb-6">
                {content.subtitle}
              </p>

              {/* Features */}
              <div className="space-y-3 mb-6">
                {content.features.map((feature, index) => (
                  <div key={index} className="flex items-center justify-start space-x-3">
                    <div className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
                    <span className="text-gray-200 text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3">
                <button
                  onClick={onSignup}
                  className="w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors hover:opacity-90"
                  style={{ backgroundColor: '#ff4940' }}
                >
                  Create Free Account
                </button>
                
                <button
                  onClick={() => setStep('email')}
                  className="w-full py-3 px-4 rounded-lg font-medium text-white border border-gray-500 hover:border-gray-400 transition-colors"
                >
                  Just save my email for now
                </button>

                <p className="text-xs text-gray-400 mt-2">
                  Free forever • No credit card required
                </p>
              </div>
            </>
          )}

          {step === 'email' && (
            <>
              <div className="mb-4 flex justify-center">
                <Mail className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Stay in the loop! 📧
              </h3>
              <p className="text-gray-300 mb-6">
                We'll notify you about new features and send design tips
              </p>

              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 border border-gray-600 focus:border-blue-400 focus:outline-none"
                  />
                  {error && (
                    <p className="text-red-400 text-sm mt-2">{error}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !email}
                  className="w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors hover:opacity-90 disabled:opacity-50"
                  style={{ backgroundColor: '#ff4940' }}
                >
                  {isLoading ? 'Saving...' : 'Save Email'}
                </button>

                <button
                  type="button"
                  onClick={() => setStep('prompt')}
                  className="w-full text-gray-400 hover:text-white transition-colors text-sm"
                >
                  ← Back to signup options
                </button>
              </form>
            </>
          )}

          {step === 'success' && (
            <>
              <div className="mb-4 flex justify-center">
                <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center">
                  <Star className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                You're all set! ✨
              </h3>
              <p className="text-gray-300 mb-4">
                Thanks for your email! We'll keep you updated on new features and design tips.
              </p>
              <p className="text-sm text-gray-400">
                You can continue designing while we prepare amazing updates for you!
              </p>
            </>
          )}
        </div>

        {/* Social Proof Footer */}
        {step === 'prompt' && (
          <div 
            className="px-6 py-4 border-t"
            style={{ backgroundColor: '#002e51', borderColor: '#004080' }}
          >
            <div className="flex items-center justify-center space-x-4 text-xs text-gray-400">
              <div className="flex items-center space-x-1">
                <Users className="w-3 h-3" />
                <span>1,000+ creators</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="w-3 h-3" />
                <span>Free forever</span>
              </div>
              <div className="flex items-center space-x-1">
                <Sparkles className="w-3 h-3" />
                <span>No credit card</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 