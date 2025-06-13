import React, { useState } from 'react';
import { ArrowLeft, Code, Download, Play, FileText } from 'lucide-react';

interface StudioAppProps {
  onBack: () => void;
}

export function StudioApp({ onBack }: StudioAppProps) {
  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Koech Labs</span>
            </button>
            <div className="h-6 w-px bg-gray-300"></div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Koech API Studio</h1>
              <p className="text-sm text-gray-600">Developer Platform</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              Documentation
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              API Keys
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Code className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Koech API Studio</h2>
            <p className="text-xl text-gray-600 mb-8">
              Developer-focused platform for template to SVG/Image generation and API automations
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 mt-12">
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <FileText className="w-8 h-8 text-blue-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Template Engine</h3>
                <p className="text-gray-600 mb-4">Convert React templates to SVG and images programmatically</p>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  View Templates
                </button>
              </div>
              
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <Code className="w-8 h-8 text-purple-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">API Integration</h3>
                <p className="text-gray-600 mb-4">RESTful APIs for automated image generation and workflows</p>
                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  API Docs
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 