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
  Settings as SettingsIcon
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { user } = useAuth();
  const [feedbackType, setFeedbackType] = useState<'feature' | 'bug' | 'general'>('feature');
  const [feedbackText, setFeedbackText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  // n8n webhook URL from environment variable or fallback
  const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || 'https://your-n8n-instance.com/webhook/feedback';

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;

    setIsSubmitting(true);

    try {
      // Prepare data for n8n webhook
      const feedbackData = {
        type: feedbackType,
        message: feedbackText,
        user: {
          email: user?.email,
          name: `${user?.first_name} ${user?.last_name}`,
          id: user?.id
        },
        timestamp: new Date().toISOString(),
        source: 'koech-design-lab',
        version: '0.1.0-beta',
        platform: window.location.hostname
      };

      // Only attempt webhook if URL is properly configured
      if (N8N_WEBHOOK_URL && !N8N_WEBHOOK_URL.includes('your-n8n-instance.com')) {
        // Send to n8n webhook
        const response = await fetch(N8N_WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(feedbackData)
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        console.log('📝 Feedback sent to n8n webhook:', feedbackData);
      } else {
        console.warn('⚠️ n8n webhook URL not configured. Feedback stored locally only.');
        // Still add webhook info for debugging
        feedbackData.webhook_status = 'not_configured';
      }

      // Always store locally as backup/fallback
      const existingFeedback = JSON.parse(localStorage.getItem('app_feedback') || '[]');
      existingFeedback.push(feedbackData);
      // Keep only last 50 feedback items
      if (existingFeedback.length > 50) {
        existingFeedback.splice(0, existingFeedback.length - 50);
      }
      localStorage.setItem('app_feedback', JSON.stringify(existingFeedback));

      setFeedbackSubmitted(true);
      setFeedbackText('');
      
      setTimeout(() => setFeedbackSubmitted(false), 3000);
    } catch (error) {
      console.error('Failed to submit feedback to webhook:', error);
      
      // Fallback: store locally if webhook fails
      const fallbackData = {
        type: feedbackType,
        message: feedbackText,
        user: {
          email: user?.email,
          name: `${user?.first_name} ${user?.last_name}`,
          id: user?.id
        },
        timestamp: new Date().toISOString(),
        source: 'koech-design-lab',
        version: '0.1.0-beta',
        webhook_status: 'failed',
        error_message: error.message
      };
      
      const existingFeedback = JSON.parse(localStorage.getItem('app_feedback') || '[]');
      existingFeedback.push(fallbackData);
      localStorage.setItem('app_feedback', JSON.stringify(existingFeedback));
      
      // Still show success to user, but log the error
      setFeedbackSubmitted(true);
      setFeedbackText('');
      setTimeout(() => setFeedbackSubmitted(false), 3000);
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
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          className="relative w-full max-w-lg rounded-xl shadow-2xl border transform transition-all"
          style={{ backgroundColor: '#002e51', borderColor: '#004080' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: '#004080' }}>
            <div className="flex items-center space-x-3">
              <SettingsIcon className="w-6 h-6" style={{ color: '#ff4940' }} />
              <h2 className="text-xl font-semibold text-white">Settings</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-gray-400 hover:text-white transition-colors"
              style={{ backgroundColor: '#003a63' }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6 max-h-96 overflow-y-auto">
            {/* Beta Status */}
            <div 
              className="p-4 rounded-lg border"
              style={{ backgroundColor: '#003a63', borderColor: '#004080' }}
            >
              <div className="flex items-center space-x-2 mb-2">
                <TestTube className="w-4 h-4 text-orange-400" />
                <h3 className="text-sm font-medium text-white">Beta Status</h3>
              </div>
              <p className="text-xs text-gray-300 mb-3">
                You're using the early access version of Koech Design Lab. Help us improve by sharing your feedback!
              </p>
              <div className="flex items-center space-x-4 text-xs">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-gray-300">Online</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-3 h-3 text-yellow-400" />
                  <span className="text-gray-300">Beta Version</span>
                </div>
              </div>
            </div>

            {/* App Info */}
            <div 
              className="p-4 rounded-lg border"
              style={{ backgroundColor: '#003a63', borderColor: '#004080' }}
            >
              <div className="flex items-center space-x-2 mb-2">
                <Info className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-medium text-white">App Information</h3>
              </div>
              <div className="space-y-1 text-xs text-gray-300">
                <div>Version: 0.1.0-beta</div>
                <div>User: {user?.email}</div>
                <div>Last Updated: {new Date().toLocaleDateString()}</div>
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
                <div className="mb-3 p-2 rounded-lg bg-green-500/10 border border-green-500/20">
                  <p className="text-xs text-green-400">✅ Thank you! Your feedback has been received and sent to our team.</p>
                </div>
              )}

              <form onSubmit={handleFeedbackSubmit} className="space-y-3">
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
                          className={`p-2 rounded-lg text-left transition-all duration-200 flex items-center space-x-2 ${
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
                          <span className="text-xs font-medium">{type.label}</span>
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
                  className="w-full py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: '#ff4940', color: 'white' }}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b border-white"></div>
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
    </div>
  );
} 