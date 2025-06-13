import React from 'react';

interface FieldInputProps {
  type: 'text' | 'textarea' | 'image' | 'color';
  label: string;
  value: string | number | boolean;
  onChange: (value: string | number | boolean) => void;
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
  className?: string;
}

export function FieldInput({ 
  type, 
  label, 
  value, 
  onChange, 
  placeholder, 
  required = false,
  maxLength,
  className = '' 
}: FieldInputProps) {
  const baseInputClasses = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors";
  
  const renderInput = () => {
    switch (type) {
      case 'textarea':
        return (
          <textarea
            value={value as string}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            maxLength={maxLength}
            rows={3}
            className={baseInputClasses}
          />
        );
      
      case 'color':
        return (
          <div className="flex space-x-2">
            <input
              type="color"
              value={value as string}
              onChange={(e) => onChange(e.target.value)}
              className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
            />
            <input
              type="text"
              value={value as string}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder || '#000000'}
              pattern="^#[0-9A-Fa-f]{6}$"
              className={baseInputClasses}
            />
          </div>
        );
      
      case 'image':
        return (
          <div className="space-y-2">
            <input
              type="url"
              value={value as string}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder || 'https://example.com/image.jpg'}
              className={baseInputClasses}
            />
            {value && (
              <div className="mt-2">
                <img 
                  src={value as string} 
                  alt="Preview" 
                  className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>
        );
      
      case 'text':
      default:
        return (
          <input
            type="text"
            value={value as string}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            maxLength={maxLength}
            className={baseInputClasses}
          />
        );
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {renderInput()}
      {maxLength && (
        <p className="text-xs text-gray-500">
          {String(value).length}/{maxLength} characters
        </p>
      )}
    </div>
  );
} 