import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Template } from './templatesData';
import { Eye, ArrowRight, Palette } from 'lucide-react';

interface TemplateCardProps {
  template: Template;
  className?: string;
}

export function TemplateCard({ template, className = '' }: TemplateCardProps) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/templates/${template.id}`);
  };

  const handlePreviewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Add quick preview modal functionality
    console.log('Quick preview for template:', template.id);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    // Fallback to placeholder if image fails to load
    e.currentTarget.src = 'https://placehold.co/400x300/f3f4f6/9ca3af/png?text=Template+Preview&font=roboto';
  };

  return (
    <div 
      className={`group cursor-pointer transition-all duration-300 transform hover:scale-105 ${className}`}
      onClick={handleCardClick}
    >
      <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200">
        {/* Preview Image */}
        <div className="relative aspect-video overflow-hidden">
          <img
            src={template.previewImage}
            alt={template.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            onError={handleImageError}
          />
          
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-3">
              <button
                onClick={handlePreviewClick}
                className="bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 p-2 rounded-full transition-all duration-200"
                title="Quick Preview"
              >
                <Eye className="w-5 h-5" />
              </button>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition-all duration-200"
                title="Edit Template"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span className="bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded-full">
              {template.category}
            </span>
          </div>

          {/* Platform Indicators */}
          <div className="absolute top-3 right-3 flex space-x-1">
            {template.platforms.slice(0, 3).map((platform, index) => (
              <div
                key={index}
                className="w-2 h-2 rounded-full bg-white bg-opacity-80"
                title={platform}
              />
            ))}
            {template.platforms.length > 3 && (
              <div className="text-white text-xs bg-black bg-opacity-50 px-1 rounded">
                +{template.platforms.length - 3}
              </div>
            )}
          </div>
        </div>

        {/* Card Content */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
              {template.name}
            </h3>
            <Palette className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors duration-200" />
          </div>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {template.description}
          </p>

          {/* Platform Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {template.platforms.slice(0, 2).map((platform) => (
              <span
                key={platform}
                className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-md"
              >
                {platform}
              </span>
            ))}
            {template.platforms.length > 2 && (
              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-md">
                +{template.platforms.length - 2} more
              </span>
            )}
          </div>

          {/* Color Preview */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">Colors:</span>
              <div className="flex space-x-1">
                <div
                  className="w-4 h-4 rounded-full border border-gray-200"
                  style={{ backgroundColor: template.defaultStyles.colors.primary }}
                  title="Primary Color"
                />
                <div
                  className="w-4 h-4 rounded-full border border-gray-200"
                  style={{ backgroundColor: template.defaultStyles.colors.accent }}
                  title="Accent Color"
                />
                <div
                  className="w-4 h-4 rounded-full border border-gray-200"
                  style={{ backgroundColor: template.defaultStyles.colors.background }}
                  title="Background Color"
                />
              </div>
            </div>
            
            <div className="text-xs text-gray-500">
              {template.defaultStyles.font.split(',')[0]}
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2">
              <span>Customize Template</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 