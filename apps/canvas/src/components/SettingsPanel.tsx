import React, { useState } from 'react';
import { 
  MessageSquare, 
  Send, 
  TestTube, 
  Monitor, 
  Palette, 
  Info,
  ExternalLink,
  Star,
  Bug,
  Lightbulb
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function SettingsPanel() {
  const { user } = useAuth();
  const [feedbackType, setFeedbackType] = useState<'feature' | 'bug' | 'general'>('feature');
  const [feedbackText, setFeedbackText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;

    setIsSubmitting(true);

    // Simulate API call - in real app, this would go to your backend
    try {
      console.log('📝 Feedback submitted:', {
        type: feedbackType,
        message: feedbackText,
        user: user?.email,
        timestamp: new Date().toISOString()
      });

      // For now, just store in localStorage for demo purposes
      const existingFeedback = JSON.parse(localStorage.getItem('app_feedback') || '[]');
      const newFeedback = {
        id: Date.now(),
        type: feedbackType,
        message: feedbackText,
        user: user?.email,
        timestamp: new Date().toISOString()
      };
      existingFeedback.push(newFeedback);
      localStorage.setItem('app_feedback', JSON.stringify(existingFeedback));

      setFeedbackSubmitted(true);
      setFeedbackText('');
      
      setTimeout(() => setFeedbackSubmitted(false), 3000);
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const feedbackTypes = [
    { id: 'feature', label: 'Feature Request', icon: Lightbulb, color: 'text-yellow-400' },
    { id: 'bug', label: 'Bug Report', icon: Bug, color: 'text-red-400' },
    { id: 'general', label: 'General Feedback', icon: MessageSquare, color: 'text-blue-400' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Monitor className="w-5 h-5" style={{ color: '#ff4940' }} />
        <h2 className="text-lg font-semibold text-white">Settings</h2>
      </div>

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
            <p className="text-xs text-green-400">✅ Thank you! Your feedback has been received.</p>
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
              className="w-full p-2 rounded-lg text-xs border resize-none"
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
            className="w-full py-2 px-3 rounded-lg text-xs font-medium transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#ff4940', color: 'white' }}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-3 w-3 border-b border-white"></div>
                <span>Sending...</span>
              </>
            ) : (
              <>
                <Send className="w-3 h-3" />
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
  );
} 