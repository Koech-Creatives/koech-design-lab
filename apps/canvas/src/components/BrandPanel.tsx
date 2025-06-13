import React, { useState } from 'react';
import { Upload, Plus, X, Palette, Link, Image } from 'lucide-react';
import { useBrand } from '../contexts/BrandContext';

export function BrandPanel() {
  const { brandAssets, addColor, addFont, removeColor, removeFont, setLogo } = useBrand();
  const [newColor, setNewColor] = useState('#000000');
  const [colorName, setColorName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);

  const handleColorAdd = () => {
    if (colorName.trim()) {
      addColor({ name: colorName, hex: newColor });
      setColorName('');
      setNewColor('#000000');
    }
  };

  const handleFontUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fontUrl = URL.createObjectURL(file);
      addFont({
        name: file.name.replace(/\.[^/.]+$/, ''),
        url: fontUrl,
        family: file.name.replace(/\.[^/.]+$/, ''),
      });
    }
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const logoUrl = URL.createObjectURL(file);
      setLogo(logoUrl);
      
      // Show success notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-20 right-6 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      notification.textContent = 'Logo uploaded successfully!';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 3000);
    }
  };

  const handleUrlSubmit = () => {
    if (imageUrl.trim()) {
      setLogo(imageUrl);
      setImageUrl('');
      setShowUrlInput(false);
      
      // Show success notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-20 right-6 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      notification.textContent = 'Logo added from URL!';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 3000);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-white mb-4">Brand Assets</h2>

      {/* Colors Section */}
      <div>
        <h3 className="text-sm font-medium text-gray-300 mb-3">Brand Colors</h3>
        
        <div className="grid grid-cols-4 gap-2 mb-4">
          {brandAssets.colors.map((color) => (
            <div key={color.name} className="relative group">
              <div
                className="w-full h-12 rounded-lg border border-gray-600 cursor-pointer"
                style={{ backgroundColor: color.hex }}
                title={`${color.name}: ${color.hex}`}
              />
              <button
                onClick={() => removeColor(color.name)}
                className="absolute -top-1 -right-1 bg-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
              <span className="text-xs text-gray-400 mt-1 block truncate">{color.name}</span>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <input
            type="text"
            placeholder="Color name"
            value={colorName}
            onChange={(e) => setColorName(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm"
          />
          <div className="flex space-x-2">
            <input
              type="color"
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              className="w-12 h-10 bg-gray-800 border border-gray-600 rounded-lg cursor-pointer"
            />
            <input
              type="text"
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm"
            />
            <button
              onClick={handleColorAdd}
              className="px-4 py-2 rounded-lg transition-colors text-white hover:opacity-80"
              style={{ backgroundColor: '#ff4940' }}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Fonts Section */}
      <div>
        <h3 className="text-sm font-medium text-gray-300 mb-3">Brand Fonts</h3>
        
        <div className="space-y-2 mb-4">
          {brandAssets.fonts.map((font) => (
            <div key={font.name} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
              <div>
                <span className="text-white font-medium" style={{ fontFamily: font.family }}>
                  {font.name}
                </span>
                <p className="text-xs text-gray-400">Font Family: {font.family}</p>
              </div>
              <button
                onClick={() => removeFont(font.name)}
                className="text-red-400 hover:text-red-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <label className="block">
          <input
            type="file"
            accept=".woff,.woff2,.ttf,.otf"
            onChange={handleFontUpload}
            className="hidden"
          />
          <div className="flex items-center justify-center space-x-2 p-3 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer transition-colors"
            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#ff4940'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = '#6b7280'}
          >
            <Upload className="w-5 h-5 text-gray-400" />
            <span className="text-gray-400">Upload Font File</span>
          </div>
        </label>
      </div>

      {/* Logo Section */}
      <div>
        <h3 className="text-sm font-medium text-gray-300 mb-3">Brand Logo</h3>
        
        {brandAssets.logo && (
          <div className="mb-4 p-3 bg-gray-800 rounded-lg">
            <img 
              src={brandAssets.logo} 
              alt="Brand Logo" 
              className="w-full h-20 object-contain rounded"
            />
            <button
              onClick={() => setLogo('')}
              className="mt-2 text-red-400 hover:text-red-300 text-sm"
            >
              Remove Logo
            </button>
          </div>
        )}

        <div className="space-y-2">
          <label className="block">
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
            />
            <div className="flex items-center justify-center space-x-2 p-3 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer transition-colors hover:border-opacity-80"
              style={{ '--hover-border-color': '#ff4940' }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = '#ff4940'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = '#6b7280'}
            >
              <Upload className="w-5 h-5 text-gray-400" />
              <span className="text-gray-400">Upload Logo</span>
            </div>
          </label>

          <button
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="w-full flex items-center justify-center space-x-2 p-3 border-2 border-dashed border-gray-600 rounded-lg transition-colors"
            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#ff4940'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = '#6b7280'}
          >
            <Link className="w-5 h-5 text-gray-400" />
            <span className="text-gray-400">Add from URL</span>
          </button>

          {showUrlInput && (
            <div className="flex space-x-2">
              <input
                type="url"
                placeholder="Enter image URL"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm"
              />
              <button
                onClick={handleUrlSubmit}
                className="px-4 py-2 rounded-lg transition-colors text-white hover:opacity-80"
                style={{ backgroundColor: '#ff4940' }}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}