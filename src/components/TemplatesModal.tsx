import React from 'react';
import { TemplatePanel } from './TemplatePanel';
import { X } from 'lucide-react';

interface TemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlatform: string;
  onTemplateSelect: (template: any) => void;
}

export function TemplatesModal({ isOpen, onClose, selectedPlatform, onTemplateSelect }: TemplatesModalProps) {
  if (!isOpen) return null;

  const handleTemplateSelect = (template: any) => {
    onTemplateSelect(template);
    onClose(); // Close modal after selecting template
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-gray-900 rounded-xl border border-gray-600 shadow-2xl w-full max-w-5xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Templates</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-800 transition-colors text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
          <TemplatePanel 
            platform={selectedPlatform} 
            onSelect={handleTemplateSelect} 
          />
        </div>
      </div>
    </div>
  );
} 