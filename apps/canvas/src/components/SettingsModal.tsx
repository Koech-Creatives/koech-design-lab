import React, { useState } from 'react';
import { 
  X,
  MessageSquare, 
  Send, 
  TestTube, 
  Monitor, 
  Info,
  ExternalLink,
  Star,
  Bug,
  Lightbulb,
  Loader,
  Sun,
  Moon,
  Palette
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { sendFeedbackToN8n, WebhookPayload } from '../config/webhooks';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { user } = useAuth();
  const { mode, colors, toggleTheme, setTheme } = useTheme();
  const [feedbackType, setFeedbackType] = useState<'feature' | 'bug' | 'general'>('feature');
  const [feedbackText, setFeedbackText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;

    setIsSubmitting(true);

    try {
      const payload: WebhookPayload = {
        type: feedbackType,
        message: feedbackText,
        user: {
          email: user?.email,
          name: `${user?.first_name} ${user?.last_name}`,
          id: user?.id
        },
        timestamp: new Date().toISOString(),
        app_version: '0.1.0-beta',
        user_agent: navigator.userAgent,
        url: window.location.href
      };

      // Send to n8n webhook
      const success = await sendFeedbackToN8n(payload);

      if (success) {
        // Also store locally as backup
        const existingFeedback = JSON.parse(localStorage.getItem('app_feedback') || '[]');
        existingFeedback.push({ ...payload, status: 'sent_to_n8n' });
        localStorage.setItem('app_feedback', JSON.stringify(existingFeedback));

        setFeedbackSubmitted(true);
        setFeedbackText('');
        
        setTimeout(() => {
          setFeedbackSubmitted(false);
          onClose();
        }, 2000);
      } else {
        throw new Error('Failed to send to n8n');
      }

    } catch (error) {
      console.error('Failed to submit feedback:', error);
      
      // Fallback: store locally if webhook fails
      const fallbackPayload = {
        type: feedbackType,
        message: feedbackText,
        user: user?.email,
        timestamp: new Date().toISOString(),
        status: 'webhook_failed'
      };
      
      const existingFeedback = JSON.parse(localStorage.getItem('app_feedback') || '[]');
      existingFeedback.push(fallbackPayload);
      localStorage.setItem('app_feedback', JSON.stringify(existingFeedback));
      
      alert('Failed to send feedback to our servers. Your message has been saved locally and we\'ll try to sync it later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const feedbackTypes = [
    { id: 'feature', label: 'Feature Request', icon: Lightbulb, color: 'text-yellow-400' },
    { id: 'bug', label: 'Bug Report', icon: Bug, color: 'text-red-400' },
    { id: 'general', label: 'General Feedback', icon: MessageSquare, color: 'text-blue-400' },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div 
        className="relative w-full max-w-md mx-4 rounded-xl shadow-2xl border max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: colors.background, borderColor: colors.border }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: colors.border }}>
          <div className="flex items-center space-x-2">
            <Monitor className="w-5 h-5" style={{ color: colors.accent }} />
            <h2 className="text-lg font-semibold" style={{ color: colors.text }}>Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Beta Status */}
          <div 
            className="p-4 rounded-lg border"
            style={{ backgroundColor: colors.backgroundSecondary, borderColor: colors.border }}
          >
            <div className="flex items-center space-x-2 mb-2">
              <TestTube className="w-4 h-4" style={{ color: colors.warning }} />
              <h3 className="text-sm font-medium" style={{ color: colors.text }}>Beta Status</h3>
            </div>
            <p className="text-xs mb-3" style={{ color: colors.textSecondary }}>
              You're using the early access version of Koech Design Lab. Help us improve by sharing your feedback!
            </p>
            <div className="flex items-center space-x-4 text-xs">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.success }}></div>
                <span style={{ color: colors.textSecondary }}>Online</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="w-3 h-3" style={{ color: colors.warning }} />
                <span style={{ color: colors.textSecondary }}>Beta Version</span>
              </div>
            </div>
          </div>

          {/* App Info */}
          <div 
            className="p-4 rounded-lg border"
            style={{ backgroundColor: colors.backgroundSecondary, borderColor: colors.border }}
          >
            <div className="flex items-center space-x-2 mb-2">
              <Info className="w-4 h-4" style={{ color: colors.info }} />
              <h3 className="text-sm font-medium" style={{ color: colors.text }}>App Information</h3>
            </div>
            <div className="space-y-1 text-xs" style={{ color: colors.textSecondary }}>
              <div>Version: 0.1.0-beta</div>
              <div>User: {user?.email}</div>
              <div>Last Updated: {new Date().toLocaleDateString()}</div>
            </div>
          </div>

          {/* Theme Settings */}
          <div 
            className="p-4 rounded-lg border"
            style={{ backgroundColor: colors.backgroundSecondary, borderColor: colors.border }}
          >
            <div className="flex items-center space-x-2 mb-3">
              <Palette className="w-4 h-4" style={{ color: colors.primary }} />
              <h3 className="text-sm font-medium" style={{ color: colors.text }}>Appearance</h3>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium mb-2" style={{ color: colors.textSecondary }}>
                  Theme Mode
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setTheme('light')}
                    className={`p-3 rounded-lg text-left transition-all duration-200 flex items-center space-x-2 border ${
                      mode === 'light' ? 'border-2' : ''
                    }`}
                    style={{
                      backgroundColor: mode === 'light' ? colors.primary : colors.backgroundTertiary,
                      borderColor: mode === 'light' ? colors.primary : colors.border,
                      color: mode === 'light' ? '#ffffff' : colors.text
                    }}
                  >
                    <Sun className="w-4 h-4" />
                    <span className="text-sm font-medium">Light</span>
                  </button>
                  
                  <button
                    onClick={() => setTheme('dark')}
                    className={`p-3 rounded-lg text-left transition-all duration-200 flex items-center space-x-2 border ${
                      mode === 'dark' ? 'border-2' : ''
                    }`}
                    style={{
                      backgroundColor: mode === 'dark' ? colors.primary : colors.backgroundTertiary,
                      borderColor: mode === 'dark' ? colors.primary : colors.border,
                      color: mode === 'dark' ? '#ffffff' : colors.text
                    }}
                  >
                    <Moon className="w-4 h-4" />
                    <span className="text-sm font-medium">Dark</span>
                  </button>
                </div>
              </div>
              
              <div className="text-xs" style={{ color: colors.textMuted }}>
                Dark mode matches the canvas editor theme for a consistent experience.
              </div>
            </div>
          </div>

          {/* Feedback Section */}
          <div 
            className="p-4 rounded-lg border"
            style={{ backgroundColor: '#003a63', borderColor: '#004080' }}
          >
            <div className="flex items-center space-x-2 mb-3">
              <MessageSquare className="w-4 h-4 text-green-400" />
              <h3 className="text-sm font-medium text-white">Share Your Feedback</h3>
            </div>

            {feedbackSubmitted && (
              <div className="mb-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <p className="text-xs text-green-400">✅ Thank you! Your feedback has been sent to our team via n8n.</p>
              </div>
            )}

            <form onSubmit={handleFeedbackSubmit} className="space-y-4">
              {/* Feedback Type */}
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-2">
                  What would you like to share?
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {feedbackTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setFeedbackType(type.id as any)}
                        className={`p-3 rounded-lg text-left transition-all duration-200 flex items-center space-x-2 ${
                          feedbackType === type.id
                            ? 'text-white border-2'
                            : 'text-gray-400 hover:text-white border'
                        }`}
                        style={{
                          backgroundColor: feedbackType === type.id ? '#ff4940' : '#002e51',
                          borderColor: feedbackType === type.id ? '#ff4940' : '#004080'
                        }}
                      >
                        <Icon className={`w-4 h-4 ${type.color}`} />
                        <span className="text-sm font-medium">{type.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Feedback Text */}
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-2">
                  Tell us more
                </label>
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder={
                    feedbackType === 'feature' 
                      ? "What feature would you like to see? How would it help your workflow?"
                      : feedbackType === 'bug'
                      ? "Describe the bug you encountered. What were you trying to do?"
                      : "Share your thoughts about the app. What's working well? What could be better?"
                  }
                  className="w-full p-3 rounded-lg text-sm border resize-none"
                  style={{
                    backgroundColor: '#002e51',
                    borderColor: '#004080',
                    color: 'white'
                  }}
                  rows={4}
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !feedbackText.trim()}
                className="w-full py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#ff4940', color: 'white' }}
              >
                {isSubmitting ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>Sending to n8n...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Feedback</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Quick Links */}
          <div 
            className="p-4 rounded-lg border"
            style={{ backgroundColor: '#003a63', borderColor: '#004080' }}
          >
            <h3 className="text-sm font-medium text-white mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <button
                onClick={() => {
                  const feedback = JSON.parse(localStorage.getItem('app_feedback') || '[]');
                  console.log('📋 All feedback:', feedback);
                }}
                className="w-full p-2 rounded-lg text-xs text-left text-gray-300 hover:text-white transition-colors border border-gray-600 hover:border-gray-500"
              >
                View All Feedback (Console)
              </button>
              <button
                onClick={() => {
                  window.open('mailto:support@koechcreatives.com?subject=Koech Design Lab Beta Feedback', '_blank');
                }}
                className="w-full p-2 rounded-lg text-xs text-left text-gray-300 hover:text-white transition-colors border border-gray-600 hover:border-gray-500 flex items-center space-x-2"
              >
                <ExternalLink className="w-3 h-3" />
                <span>Email Support</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 