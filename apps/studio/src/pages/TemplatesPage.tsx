import React from 'react';
import { Layout, Plus, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AVAILABLE_TEMPLATES } from '../modules/renderer/utils/templateRegistry';

export default function TemplatesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Templates</h2>
          <p className="text-gray-600">Browse and manage your design templates</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" />
          <span>Create Template</span>
        </button>
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {AVAILABLE_TEMPLATES.map((template) => (
          <div key={template.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{template.description}</p>
              </div>
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                {template.category}
              </span>
            </div>
            
            <div className="mb-4">
              <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                <Layout className="w-8 h-8 text-gray-400" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-500">
                {template.supportedPlatforms.length} platforms
              </div>
              <Link
                to={`/templates/playground/${template.id}`}
                className="bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm flex items-center space-x-1 hover:bg-blue-700 transition-colors"
              >
                <Play className="w-3 h-3" />
                <span>Open</span>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State (shown when no templates) */}
      {AVAILABLE_TEMPLATES.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="text-center">
            <Layout className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No templates yet</h3>
            <p className="text-gray-600 mb-6">Create reusable templates to speed up your design process</p>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 mx-auto hover:bg-blue-700 transition-colors">
              <Plus className="w-5 h-5" />
              <span>Create Your First Template</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 