import React from 'react';
import { useNavigate } from 'react-router-dom';

export function TestTemplates() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: '#1a1a1a' }}>
      <div className="text-center space-y-8">
        <h1 className="text-4xl font-bold text-white mb-8">
          🎉 HTML Template Playground Ready!
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
          <div className="p-6 rounded-lg" style={{ backgroundColor: '#002e51' }}>
            <h2 className="text-xl font-semibold text-white mb-4">✅ Features Implemented</h2>
            <ul className="text-left text-gray-300 space-y-2">
              <li>• Mode Selector (/) - Choose your creative approach</li>
              <li>• Template Gallery (/templates) - Browse & filter templates</li>
              <li>• Render Studio (/playground/:id) - Edit & preview</li>
              <li>• Brand Integration - Auto-inject colors, fonts, logo</li>
              <li>• Platform Optimization - IG, LinkedIn, Twitter, etc.</li>
              <li>• Real-time Preview - See changes instantly</li>
            </ul>
          </div>

          <div className="p-6 rounded-lg" style={{ backgroundColor: '#002e51' }}>
            <h2 className="text-xl font-semibold text-white mb-4">🎨 Available Templates</h2>
            <ul className="text-left text-gray-300 space-y-2">
              <li>• Minimal Quote - Clean quote designs</li>
              <li>• Product Showcase - Professional product displays</li>
              <li>• Announcement - Eye-catching announcements</li>
              <li>• Tips Carousel - Educational content layouts</li>
            </ul>
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 rounded-lg text-white font-medium transition-colors hover:opacity-80"
            style={{ backgroundColor: '#ff4940' }}
          >
            Go to Mode Selector
          </button>
          
          <button
            onClick={() => navigate('/templates')}
            className="px-6 py-3 rounded-lg text-white font-medium transition-colors hover:opacity-80"
            style={{ backgroundColor: '#003a63' }}
          >
            Browse Templates
          </button>
        </div>

        <div className="text-sm text-gray-400 max-w-2xl">
          <p>
            The HTML-to-Image Template Playground is now fully functional! 
            Navigate to the templates page to see brand-integrated previews, 
            or try the playground editor with real-time preview updates.
          </p>
        </div>
      </div>
    </div>
  );
} 