import React from 'react';
import { templateLibrary } from '../data/templates';

interface TemplatePanelProps {
  platform: string;
  onSelect: (template: any) => void;
}

export function TemplatePanel({ platform, onSelect }: TemplatePanelProps) {
  const templates = templateLibrary[platform] || [];

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-white">Templates</h2>
      
      <div className="grid grid-cols-2 gap-3">
        {templates.map((template) => (
          <div
            key={template.id}
            onClick={() => onSelect(template)}
            className="relative group cursor-pointer rounded-lg overflow-hidden bg-gray-800 hover:bg-gray-700 transition-all duration-200 transform hover:scale-105"
          >
            <div className="aspect-square p-4" style={{ background: 'linear-gradient(to bottom right, #ff4940, #cc3a33)' }}>
              <div className="w-full h-full bg-white rounded opacity-80 flex items-center justify-center">
                <span className="text-gray-600 text-xs font-medium">{template.name}</span>
              </div>
            </div>
            <div className="p-2">
              <h3 className="text-sm font-medium text-white truncate">{template.name}</h3>
              <p className="text-xs text-gray-400">{template.category}</p>
            </div>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity" style={{ backgroundColor: '#ff4940' }} />
          </div>
        ))}
      </div>

      {templates.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-400">No templates available for {platform}</p>
        </div>
      )}
    </div>
  );
}