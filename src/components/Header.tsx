import React, { useState } from 'react';
import { Palette, Download, Save, Undo, Redo, Settings, Menu, X } from 'lucide-react';
import { useCanvas } from '../contexts/CanvasContext';

interface HeaderProps {
  selectedPlatform: string;
  onPlatformChange: (platform: string) => void;
}

const platforms = [
  { id: 'instagram', name: 'Instagram', color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
  { id: 'linkedin', name: 'LinkedIn', color: 'bg-blue-600' },
  { id: 'twitter', name: 'Twitter/X', color: 'bg-black' },
  { id: 'tiktok', name: 'TikTok', color: 'bg-gradient-to-r from-cyan-500 to-black-500 to-pink-500' },
];

export function Header({ 
  selectedPlatform, 
  onPlatformChange
}: HeaderProps) {
  const { elements, clearCanvas, undo, redo, canUndo, canRedo } = useCanvas();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSave = () => {
    const designData = {
      platform: selectedPlatform,
      elements: elements,
      timestamp: new Date().toISOString(),
    };
    
    localStorage.setItem('currentDesign', JSON.stringify(designData));
    
    // Create a temporary notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-20 right-6 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    notification.textContent = 'Design saved successfully!';
    document.body.appendChild(notification);
    
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 3000);
  };

  const handleExport = () => {
    // In a real app, this would generate high-res images
    const notification = document.createElement('div');
    notification.className = 'fixed top-20 right-6 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    notification.style.backgroundColor = '#ff4940';
    notification.textContent = `Exporting design for ${selectedPlatform} with ${elements.length} elements`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 3000);
  };

  return (
    <div className="sticky top-0 left-0 right-0 z-50 border-b shadow-lg" style={{ backgroundColor: '#002e51', borderColor: '#004080' }}>
      {/* Desktop Header */}
      <div className="hidden md:flex items-center justify-between px-6 py-3">
        <div className="flex items-center space-x-3">
          <img 
            src="/logo.png" 
            alt="Logo" 
            className="w-14 h-14 rounded-full"
            onError={(e) => {
              // Fallback to icon if image not found
              e.currentTarget.style.display = 'none';
              const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
              if (nextElement) {
                nextElement.style.display = 'block';
              }
            }}
          />
          <Palette className="w-8 h-8 hidden" style={{ color: '#ff4940' }} />
          <h1 className="text-sm font-bold text-white opacity-60">by Koech Creatives</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          {platforms.map((platform) => (
            <button
              key={platform.id}
              onClick={() => onPlatformChange(platform.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                selectedPlatform === platform.id
                  ? `${platform.color} text-white shadow-lg`
                  : 'text-gray-300 hover:text-white'
              }`}
              style={selectedPlatform !== platform.id ? { backgroundColor: '#003a63' } : {}}
            >
              {platform.name}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-3">
          <div className="text-xs text-gray-300 px-3 py-2 rounded-lg" style={{ backgroundColor: '#003a63' }}>
            {elements.length} elements
          </div>
          
          <button 
            onClick={undo}
            disabled={!canUndo}
            className={`p-2 rounded-lg transition-colors ${
              canUndo 
                ? 'text-white hover:opacity-80' 
                : 'text-gray-500 cursor-not-allowed'
            }`}
            style={canUndo ? { backgroundColor: '#003a63' } : { backgroundColor: '#002447' }}
            title="Undo"
          >
            <Undo className="w-5 h-5" />
          </button>
          <button 
            onClick={redo}
            disabled={!canRedo}
            className={`p-2 rounded-lg transition-colors ${
              canRedo 
                ? 'text-white hover:opacity-80' 
                : 'text-gray-500 cursor-not-allowed'
            }`}
            style={canRedo ? { backgroundColor: '#003a63' } : { backgroundColor: '#002447' }}
            title="Redo"
          >
            <Redo className="w-5 h-5" />
          </button>
          <button 
            onClick={handleSave}
            className="px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 text-white hover:opacity-80"
            style={{ backgroundColor: '#003a63' }}
          >
            <Save className="w-4 h-4" />
            <span>Save</span>
          </button>
          <button 
            onClick={handleExport}
            className="px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 text-white hover:opacity-80"
            style={{ backgroundColor: '#ff4940' }}
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-3">
          <img 
            src="/logo.png" 
            alt="Logo" 
            className="w-6 h-6 rounded-full"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
              if (nextElement) {
                nextElement.style.display = 'block';
              }
            }}
          />
          <Palette className="w-6 h-6 hidden" style={{ color: '#ff4940' }} />
           </div>
        
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg hover:opacity-80"
            style={{ backgroundColor: '#003a63' }}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 py-3 border-b" style={{ backgroundColor: '#003a63', borderColor: '#004080' }}>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {platforms.map((platform) => (
              <button
                key={platform.id}
                onClick={() => {
                  onPlatformChange(platform.id);
                  setMobileMenuOpen(false);
                }}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  selectedPlatform === platform.id
                    ? `${platform.color} text-white shadow-lg`
                    : 'text-gray-300'
                }`}
                style={selectedPlatform !== platform.id ? { backgroundColor: '#002e51' } : {}}
              >
                {platform.name}
              </button>
            ))}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <button 
                onClick={undo}
                disabled={!canUndo}
                className={`p-2 rounded-lg ${
                  canUndo ? 'text-white' : 'text-gray-500'
                }`}
                style={canUndo ? { backgroundColor: '#002e51' } : { backgroundColor: '#002447' }}
              >
                <Undo className="w-5 h-5" />
              </button>
              <button 
                onClick={redo}
                disabled={!canRedo}
                className={`p-2 rounded-lg ${
                  canRedo ? 'text-white' : 'text-gray-500'
                }`}
                style={canRedo ? { backgroundColor: '#002e51' } : { backgroundColor: '#002447' }}
              >
                <Redo className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex space-x-2">
              <button 
                onClick={handleSave}
                className="px-3 py-2 rounded-lg flex items-center text-white"
                style={{ backgroundColor: '#002e51' }}
              >
                <Save className="w-4 h-4 mr-1" />
                <span className="text-sm">Save</span>
              </button>
              <button 
                onClick={handleExport}
                className="px-3 py-2 rounded-lg flex items-center text-white"
                style={{ backgroundColor: '#ff4940' }}
              >
                <Download className="w-4 h-4 mr-1" />
                <span className="text-sm">Export</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}