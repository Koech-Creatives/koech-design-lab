import React, { useState, useEffect } from 'react';
import { X, Folder, LayoutTemplate } from 'lucide-react';

interface ProjectNameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (name: string) => void;
  template?: {
    id: string;
    name: string;
    platform: string;
    format: string;
  };
}

export function ProjectNameModal({ isOpen, onClose, onConfirm, template }: ProjectNameModalProps) {
  const [projectName, setProjectName] = useState('');
  const [isValid, setIsValid] = useState(false);

  // Generate default name based on template
  useEffect(() => {
    if (isOpen && template) {
      const defaultName = `${template.name} - ${new Date().toLocaleDateString()}`;
      setProjectName(defaultName);
      setIsValid(true);
    } else if (isOpen && !template) {
      setProjectName('Untitled Project');
      setIsValid(true);
    }
  }, [isOpen, template]);

  // Validate project name
  useEffect(() => {
    const trimmedName = projectName.trim();
    setIsValid(trimmedName.length >= 1 && trimmedName.length <= 100);
  }, [projectName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      onConfirm(projectName.trim());
      handleClose();
    }
  };

  const handleClose = () => {
    setProjectName('');
    setIsValid(false);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          className="relative w-full max-w-md rounded-xl shadow-2xl border transform transition-all"
          style={{ backgroundColor: '#002e51', borderColor: '#004080' }}
          onKeyDown={handleKeyDown}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: '#004080' }}>
            <div className="flex items-center space-x-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#ff4940' }}
              >
                {template ? (
                  <LayoutTemplate className="w-5 h-5 text-white" />
                ) : (
                  <Folder className="w-5 h-5 text-white" />
                )}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">
                  {template ? 'Name Your Project' : 'Create New Project'}
                </h2>
                <p className="text-sm text-gray-400">
                  {template ? `Based on ${template.name}` : 'Start from scratch'}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 rounded-lg text-gray-400 hover:text-white transition-colors"
              style={{ backgroundColor: '#003a63' }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="p-6">
            {/* Template Info */}
            {template && (
              <div 
                className="p-4 rounded-lg border mb-4"
                style={{ backgroundColor: '#003a63', borderColor: '#004080' }}
              >
                <div className="flex items-center space-x-3">
                  <LayoutTemplate className="w-5 h-5 text-gray-400" />
                  <div>
                    <h3 className="text-sm font-medium text-white">{template.name}</h3>
                    <p className="text-xs text-gray-400 capitalize">
                      {template.platform} • {template.format}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Project Name Input */}
            <div className="mb-6">
              <label htmlFor="projectName" className="block text-sm font-medium text-white mb-2">
                Project Name
              </label>
              <input
                id="projectName"
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Enter project name..."
                className="w-full px-4 py-3 rounded-lg border text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors"
                style={{ 
                  backgroundColor: '#003a63', 
                  borderColor: isValid ? '#004080' : '#dc2626',
                  focusRingColor: '#ff4940'
                }}
                autoFocus
                maxLength={100}
              />
              <div className="flex justify-between mt-2">
                <span className={`text-xs ${isValid ? 'text-gray-400' : 'text-red-400'}`}>
                  {!isValid && projectName.trim().length === 0 && 'Project name is required'}
                  {!isValid && projectName.trim().length > 100 && 'Project name must be 100 characters or less'}
                </span>
                <span className="text-xs text-gray-400">
                  {projectName.length}/100
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 rounded-lg text-gray-300 hover:text-white transition-colors"
                style={{ backgroundColor: '#003a63' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isValid}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isValid 
                    ? 'hover:opacity-90 text-white' 
                    : 'opacity-50 cursor-not-allowed text-gray-400'
                }`}
                style={{ backgroundColor: isValid ? '#ff4940' : '#666' }}
              >
                Create Project
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 