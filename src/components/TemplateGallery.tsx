import React, { useState } from 'react';
import { X, Search } from 'lucide-react';
import { templateLibrary } from '../data/templates';

interface TemplateGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: any) => void;
}

const templateCategories = [
  { id: 'all', name: 'All Templates' },
  { id: 'business', name: 'Business' },
  { id: 'social', name: 'Social Media' },
  { id: 'marketing', name: 'Marketing' },
  { id: 'education', name: 'Education' },
  { id: 'personal', name: 'Personal' },
];

// Mock template data with preview images
const mockTemplates = [
  {
    id: 'entrepreneurial-potential',
    name: 'Unlock Your Entrepreneurial Potential',
    category: 'business',
    preview: '/api/placeholder/300/200',
    description: 'Perfect for business coaching and entrepreneurship content',
    color: '#F59E0B'
  },
  {
    id: 'grow-online-presence',
    name: 'Grow Your Online Presence',
    category: 'marketing',
    preview: '/api/placeholder/300/200',
    description: 'Ideal for digital marketing and social media growth',
    color: '#8B5CF6'
  },
  {
    id: 'master-online-presence',
    name: 'Master Your Online Presence',
    category: 'marketing',
    preview: '/api/placeholder/300/200',
    description: 'Advanced strategies for online success',
    color: '#F59E0B'
  },
  {
    id: 'diversity-movement',
    name: 'Join the Diversity Movement',
    category: 'social',
    preview: '/api/placeholder/300/200',
    description: 'Promote diversity and inclusion in your content',
    color: '#EC4899'
  },
  {
    id: 'unlock-diversity-power',
    name: 'Unlocking the Power of Diversity',
    category: 'social',
    preview: '/api/placeholder/300/200',
    description: 'Celebrate diversity and cultural exchange',
    color: '#8B5CF6'
  },
  {
    id: 'minimal-quote',
    name: 'Minimal Quote Design',
    category: 'personal',
    preview: '/api/placeholder/300/200',
    description: 'Clean and elegant quote templates',
    color: '#10B981'
  },
];

export function TemplateGallery({ isOpen, onClose, onSelectTemplate }: TemplateGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredTemplates = mockTemplates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleTemplateSelect = (template: any) => {
    // Convert mock template to actual template format
    const actualTemplate = templateLibrary.instagram?.find(t => t.id === 'ig-minimal-quote') || templateLibrary.instagram?.[0];
    onSelectTemplate(actualTemplate);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Template Gallery</h2>
            <p className="text-gray-600 mt-1">Start with a customizable template and adapt it to your brand.</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Search and Categories */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {templateCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                onClick={() => handleTemplateSelect(template)}
                className="group cursor-pointer bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200 hover:scale-105"
              >
                {/* Template Preview */}
                <div className="aspect-[4/3] relative overflow-hidden" style={{ backgroundColor: template.color }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                  <div className="absolute inset-4 bg-white/90 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-2"></div>
                      <div className="w-20 h-2 bg-gray-300 rounded mx-auto mb-1"></div>
                      <div className="w-16 h-2 bg-gray-200 rounded mx-auto"></div>
                    </div>
                  </div>
                </div>

                {/* Template Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {template.name}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {template.description}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full capitalize">
                      {template.category}
                    </span>
                    <button className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors">
                      Use Template
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
              <p className="text-gray-600">Try adjusting your search or category filter.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} available
            </div>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Start from Scratch
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 