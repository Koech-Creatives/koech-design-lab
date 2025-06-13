import React from 'react';
import { 
  Type, 
  Image, 
  Palette, 
  Settings,
  Upload
} from 'lucide-react';
import { TemplateField } from '../../../data/htmlTemplates';

interface EditorPanelProps {
  template: any;
  fieldValues: Record<string, string>;
  onFieldChange: (fieldId: string, value: string) => void;
}

export function EditorPanel({ template, fieldValues, onFieldChange }: EditorPanelProps) {
  const renderField = (field: TemplateField) => {
    const value = fieldValues[field.id] || '';

    switch (field.type) {
      case 'text':
        return (
          <div key={field.id} className="space-y-2">
            <label className="block text-sm font-medium text-white">
              {field.label}
            </label>
            <textarea
              value={value}
              onChange={(e) => onFieldChange(field.id, e.target.value)}
              placeholder={field.placeholder}
              rows={field.id === 'content' || field.id === 'description' ? 4 : 2}
              className="w-full px-3 py-2 rounded-lg border text-sm resize-none"
              style={{ 
                backgroundColor: '#003a63', 
                borderColor: '#004080',
                color: 'white'
              }}
            />
          </div>
        );

      case 'image':
        return (
          <div key={field.id} className="space-y-2">
            <label className="block text-sm font-medium text-white">
              {field.label}
            </label>
            <div className="space-y-2">
              <input
                type="url"
                value={value}
                onChange={(e) => onFieldChange(field.id, e.target.value)}
                placeholder="Enter image URL..."
                className="w-full px-3 py-2 rounded-lg border text-sm"
                style={{ 
                  backgroundColor: '#003a63', 
                  borderColor: '#004080',
                  color: 'white'
                }}
              />
              {value && (
                <div className="relative">
                  <img
                    src={value}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded-lg"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
              <div className="flex items-center space-x-2 text-xs text-gray-400">
                <Upload className="w-3 h-3" />
                <span>Paste image URL or upload to your preferred service</span>
              </div>
            </div>
          </div>
        );

      case 'color':
        return (
          <div key={field.id} className="space-y-2">
            <label className="block text-sm font-medium text-white">
              {field.label}
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={value}
                onChange={(e) => onFieldChange(field.id, e.target.value)}
                className="w-12 h-10 rounded-lg border cursor-pointer"
                style={{ borderColor: '#004080' }}
              />
              <input
                type="text"
                value={value}
                onChange={(e) => onFieldChange(field.id, e.target.value)}
                placeholder="#000000"
                className="flex-1 px-3 py-2 rounded-lg border text-sm"
                style={{ 
                  backgroundColor: '#003a63', 
                  borderColor: '#004080',
                  color: 'white'
                }}
              />
            </div>
          </div>
        );

      case 'select':
        return (
          <div key={field.id} className="space-y-2">
            <label className="block text-sm font-medium text-white">
              {field.label}
            </label>
            <select
              value={value}
              onChange={(e) => onFieldChange(field.id, e.target.value)}
              className="w-full px-3 py-2 rounded-lg border text-sm"
              style={{ 
                backgroundColor: '#003a63', 
                borderColor: '#004080',
                color: 'white'
              }}
            >
              {field.options?.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-80 border-r overflow-y-auto" style={{ backgroundColor: '#002e51', borderColor: '#004080' }}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <Settings className="w-6 h-6" style={{ color: '#ff4940' }} />
          <div>
            <h2 className="text-lg font-semibold text-white">Customize</h2>
            <p className="text-sm text-gray-400">Edit template content</p>
          </div>
        </div>

        {/* Template Info */}
        <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: '#003a63' }}>
          <h3 className="font-medium text-white mb-2">{template.name}</h3>
          <p className="text-sm text-gray-300 mb-3">{template.description}</p>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-400">Category:</span>
            <span className="text-xs px-2 py-1 rounded-full text-white" style={{ backgroundColor: '#ff4940' }}>
              {template.category}
            </span>
          </div>
        </div>

        {/* Fields */}
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center">
              <Type className="w-4 h-4 mr-2" />
              Content Fields
            </h3>
            <div className="space-y-4">
              {template.fields.map((field: TemplateField) => renderField(field))}
            </div>
          </div>

          {/* Brand Integration Info */}
          <div className="p-4 rounded-lg border" style={{ backgroundColor: '#003a63', borderColor: '#004080' }}>
            <h4 className="text-sm font-semibold text-white mb-2 flex items-center">
              <Palette className="w-4 h-4 mr-2" />
              Brand Integration
            </h4>
            <div className="space-y-2 text-xs text-gray-300">
              <div className="flex items-center justify-between">
                <span>Logo:</span>
                <span className="text-green-400">Auto-applied</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Colors:</span>
                <span className="text-green-400">Auto-applied</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Fonts:</span>
                <span className="text-green-400">Auto-applied</span>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Your brand settings are automatically applied to this template.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-white">Quick Actions</h4>
            <button
              onClick={() => {
                // Reset to defaults
                const resetValues: Record<string, string> = {};
                template.fields.forEach((field: TemplateField) => {
                  resetValues[field.id] = field.defaultValue || '';
                });
                Object.entries(resetValues).forEach(([key, value]) => {
                  onFieldChange(key, value);
                });
              }}
              className="w-full px-3 py-2 text-sm rounded-lg border text-white hover:opacity-80 transition-colors"
              style={{ backgroundColor: '#003a63', borderColor: '#004080' }}
            >
              Reset to Defaults
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 