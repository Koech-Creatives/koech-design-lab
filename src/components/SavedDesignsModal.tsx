import React, { useState, useEffect } from 'react';
import { X, Trash2, Download, FileText } from 'lucide-react';
import { CanvasStorageManager } from '../utils/canvasStorage';

interface SavedDesignsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadDesign?: (platform: string, format: string) => void;
}

export function SavedDesignsModal({ isOpen, onClose, onLoadDesign }: SavedDesignsModalProps) {
  const [designs, setDesigns] = useState<Array<{
    platform: string;
    format: string;
    elementCount: number;
    lastModified: Date;
    dimensions: string;
  }>>([]);
  const [storageSize, setStorageSize] = useState('');

  useEffect(() => {
    if (isOpen) {
      refreshDesigns();
    }
  }, [isOpen]);

  const refreshDesigns = () => {
    const storedDesigns = CanvasStorageManager.getAllStoredDesigns();
    setDesigns(storedDesigns);
    setStorageSize(CanvasStorageManager.getStorageSize());
  };

  const handleDeleteDesign = (platform: string, format: string, dimensions: string) => {
    const [width, height] = dimensions.replace(' × ', 'x').split('x').map(Number);
    const formatObj = { name: format.toLowerCase(), width, height };
    
    if (CanvasStorageManager.deleteDesign(platform.toLowerCase(), formatObj)) {
      refreshDesigns();
    }
  };

  const handleExportStorage = () => {
    const data = CanvasStorageManager.exportStorage();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `koech-design-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to delete all saved designs? This action cannot be undone.')) {
      CanvasStorageManager.clearStorage();
      refreshDesigns();
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Saved Designs</h2>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-400">Storage: {storageSize}</span>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {designs.length > 0 ? (
            <div className="space-y-4">
              {designs.map((design, index) => (
                <div
                  key={`${design.platform}-${design.format}-${design.dimensions}`}
                  className="flex items-center justify-between p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="px-2 py-1 text-xs font-medium bg-red-500 text-white rounded">
                        {design.platform}
                      </span>
                      <span className="text-white font-medium">
                        {design.format} • {design.dimensions}
                      </span>
                      <span className="text-gray-400 text-sm">
                        {design.elementCount} elements
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm">
                      Last modified: {formatDate(design.lastModified)}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {onLoadDesign && (
                      <button
                        onClick={() => {
                          onLoadDesign(design.platform.toLowerCase(), design.format.toLowerCase());
                          onClose();
                        }}
                        className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                      >
                        Load
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteDesign(design.platform, design.format, design.dimensions)}
                      className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                      title="Delete design"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No saved designs</h3>
              <p className="text-gray-400">
                Your designs will automatically save as you work on them.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        {designs.length > 0 && (
          <div className="flex items-center justify-between p-6 border-t border-gray-700">
            <div className="flex items-center space-x-3">
              <button
                onClick={handleExportStorage}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export Backup</span>
              </button>
            </div>
            
            <button
              onClick={handleClearAll}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear All</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 