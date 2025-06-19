import React, { useState, useEffect } from 'react';
import { useCanvas } from '../contexts/CanvasContext';
import { useBrand } from '../contexts/BrandContext';
import { useAuth } from '../contexts/AuthContext';
import { Palette, Type, Move, Maximize as Resize, Square, Plus, X, Upload, Image } from 'lucide-react';

export function PropertiesPanel() {
  const { elements, selectedElement, updateElement } = useCanvas();
  const { brandAssets, addColor, removeColor, setLogo } = useBrand();
  const { isAuthenticated } = useAuth();
  const [colorTab, setColorTab] = useState('quick');

  // Temporary brand state for session
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#ff4940');
  const [logoUrl, setLogoUrl] = useState('');
  const [showLogoInput, setShowLogoInput] = useState(false);

  const selectedEl = elements.find(el => el.id === selectedElement);

  const [localStyle, setLocalStyle] = useState(selectedEl?.style || {});

  useEffect(() => {
    if (selectedEl) {
      setLocalStyle(selectedEl.style || {});
    }
  }, [selectedEl]);

  const handleAddSessionColor = () => {
    if (newColorName.trim() && newColorHex) {
      addColor({ name: newColorName.trim(), hex: newColorHex });
      setNewColorName('');
      setNewColorHex('#ff4940');
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
      notification.textContent = 'Logo added successfully!';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        if (notification.parentNode) {
          document.body.removeChild(notification);
        }
      }, 3000);
    }
  };

  const handleLogoFromUrl = () => {
    if (logoUrl.trim()) {
      setLogo(logoUrl.trim());
      setLogoUrl('');
      setShowLogoInput(false);
      
      // Show success notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-20 right-6 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      notification.textContent = 'Logo added from URL!';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        if (notification.parentNode) {
          document.body.removeChild(notification);
        }
      }, 3000);
    }
  };

  if (!selectedEl) {
    return (
      <div className="p-3 space-y-3">
        <h2 className="text-xs font-semibold text-white">Properties</h2>
        
        {/* Session Brand Properties */}
        <div className="rounded p-3" style={{ backgroundColor: '#003a63' }}>
          <h3 className="text-xs font-medium text-gray-300 mb-3 flex items-center">
            <Palette className="w-3.5 h-3.5 mr-1.5 text-red-400" />
            {isAuthenticated ? 'Brand Properties' : 'Session Brand'}
          </h3>
          
          {!isAuthenticated && (
            <div className="mb-3 p-2 bg-blue-500/10 border border-blue-500/20 rounded text-xs text-blue-300">
              💡 Define brand colors for this session. Sign up to save permanently!
            </div>
          )}
          
          {/* Brand Colors */}
          <div className="space-y-3">
            <div>
              <div className="text-xs text-gray-400 mb-2">Brand Colors ({brandAssets.colors.length})</div>
              
              {/* Existing Colors */}
              {brandAssets.colors.length > 0 && (
                <div className="grid grid-cols-4 gap-1 mb-3">
                  {brandAssets.colors.map((color) => (
                    <div key={color.name} className="relative group">
                      <div
                        className="w-8 h-8 rounded border border-gray-600 cursor-pointer"
                        style={{ backgroundColor: color.hex }}
                        title={`${color.name}: ${color.hex}`}
                      />
                      <button
                        onClick={() => removeColor(color.name)}
                        className="absolute -top-1 -right-1 bg-red-500 rounded-full w-4 h-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-2.5 h-2.5 text-white" />
                      </button>
                      <span className="text-xs text-gray-500 mt-0.5 block truncate text-center">
                        {color.name}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Add New Color */}
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Color name (e.g., Primary)"
                  value={newColorName}
                  onChange={(e) => setNewColorName(e.target.value)}
                  className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-xs"
                />
                <div className="flex space-x-2">
                  <input
                    type="color"
                    value={newColorHex}
                    onChange={(e) => setNewColorHex(e.target.value)}
                    className="w-8 h-8 bg-transparent cursor-pointer rounded"
                  />
                  <input
                    type="text"
                    value={newColorHex}
                    onChange={(e) => setNewColorHex(e.target.value)}
                    className="flex-1 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-xs"
                    placeholder="#ff4940"
                  />
                  <button
                    onClick={handleAddSessionColor}
                    disabled={!newColorName.trim()}
                    className={`px-2 py-1 rounded text-white text-xs transition-colors ${
                      newColorName.trim() 
                        ? 'hover:opacity-80' 
                        : 'opacity-50 cursor-not-allowed'
                    }`}
                    style={{ backgroundColor: '#ff4940' }}
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Brand Logo */}
            <div>
              <div className="text-xs text-gray-400 mb-2">Brand Logo</div>
              
              {brandAssets.logo && (
                <div className="mb-2 p-2 bg-gray-700 rounded border border-gray-600">
                  <img 
                    src={brandAssets.logo} 
                    alt="Brand logo" 
                    className="w-full h-12 object-contain rounded"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
              
              <div className="space-y-2">
                {/* Upload Logo */}
                <label className="block">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  <div className="flex items-center justify-center space-x-2 p-2 border border-dashed border-gray-600 rounded cursor-pointer hover:border-red-400 transition-colors">
                    <Upload className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-400">Upload Logo</span>
                  </div>
                </label>
                
                {/* URL Input */}
                {!showLogoInput ? (
                  <button
                    onClick={() => setShowLogoInput(true)}
                    className="w-full flex items-center justify-center space-x-2 p-2 border border-dashed border-gray-600 rounded hover:border-red-400 transition-colors"
                  >
                    <Image className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-400">Add from URL</span>
                  </button>
                ) : (
                  <div className="flex space-x-1">
                    <input
                      type="url"
                      placeholder="Logo URL"
                      value={logoUrl}
                      onChange={(e) => setLogoUrl(e.target.value)}
                      className="flex-1 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-xs"
                    />
                    <button
                      onClick={handleLogoFromUrl}
                      disabled={!logoUrl.trim()}
                      className="px-2 py-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded text-xs"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => {
                        setShowLogoInput(false);
                        setLogoUrl('');
                      }}
                      className="px-2 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded text-xs"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="text-center py-4">
          <p className="text-gray-400 text-xs">Select an element to edit its properties</p>
        </div>
      </div>
    );
  }

  // Element properties interface when an element is selected
  const handleStyleChange = (property: string, value: any) => {
    if (!selectedElement) return;
    const newStyle = { ...localStyle, [property]: value };
    setLocalStyle(newStyle);
    updateElement(selectedElement, { style: newStyle });
  };

  const handleDirectUpdate = (property: string, value: any) => {
    if (!selectedElement) return;
    updateElement(selectedElement, { [property]: value });
  };

  // Create dynamic brand color palette
  const brandColorPalette = [
    // Brand colors from user's brand assets
    ...brandAssets.colors.map(color => color.hex),
    // Default fallback colors if no brand colors are set
    ...(brandAssets.colors.length === 0 ? ['#ff4940', '#002e51', '#004080', '#ffffff', '#000000', '#6366f1', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'] : [])
  ].slice(0, 10);

  return (
    <div className="p-3 space-y-3 max-h-full overflow-y-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold text-white">Properties</h2>
        <div className="text-xs text-gray-400">{selectedEl.type}</div>
      </div>

      {/* Position Controls */}
      <div className="rounded p-3" style={{ backgroundColor: '#003a63' }}>
        <h3 className="text-xs font-medium text-gray-300 mb-2 flex items-center">
          <Move className="w-3.5 h-3.5 mr-1.5" />
          Position
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-gray-400 mb-1 block">X</label>
            <input
              type="number"
              value={Math.round(selectedEl.x || 0)}
              onChange={(e) => handleDirectUpdate('x', parseInt(e.target.value) || 0)}
              className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-xs"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Y</label>
            <input
              type="number"
              value={Math.round(selectedEl.y || 0)}
              onChange={(e) => handleDirectUpdate('y', parseInt(e.target.value) || 0)}
              className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-xs"
            />
          </div>
        </div>
      </div>

      {/* Size Controls */}
      <div className="rounded p-3" style={{ backgroundColor: '#003a63' }}>
        <h3 className="text-xs font-medium text-gray-300 mb-2 flex items-center">
          <Resize className="w-3.5 h-3.5 mr-1.5" />
          Size
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Width</label>
            <input
              type="number"
              value={Math.round(selectedEl.width || 0)}
              onChange={(e) => handleDirectUpdate('width', parseInt(e.target.value) || 0)}
              className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-xs"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Height</label>
            <input
              type="number"
              value={Math.round(selectedEl.height || 0)}
              onChange={(e) => handleDirectUpdate('height', parseInt(e.target.value) || 0)}
              className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-xs"
            />
          </div>
        </div>
      </div>

      {/* Text Properties */}
      {selectedEl.type === 'text' && (
        <div className="rounded p-3" style={{ backgroundColor: '#003a63' }}>
          <h3 className="text-xs font-medium text-gray-300 mb-2 flex items-center">
            <Type className="w-3.5 h-3.5 mr-1.5" />
            Text Properties
          </h3>
          <div className="space-y-2">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Font Size</label>
              <input
                type="number"
                value={selectedEl.fontSize || 18}
                onChange={(e) => handleDirectUpdate('fontSize', parseInt(e.target.value) || 18)}
                className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-xs"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Font Weight</label>
              <select
                value={selectedEl.fontWeight || 'normal'}
                onChange={(e) => handleDirectUpdate('fontWeight', e.target.value)}
                className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-xs"
              >
                <option value="100">Thin</option>
                <option value="300">Light</option>
                <option value="400">Normal</option>
                <option value="500">Medium</option>
                <option value="600">Semibold</option>
                <option value="700">Bold</option>
                <option value="900">Black</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Color Controls */}
      <div className="rounded p-3" style={{ backgroundColor: '#003a63' }}>
        <h3 className="text-xs font-medium text-gray-300 mb-2 flex items-center">
          <Palette className="w-3.5 h-3.5 mr-1.5" />
          Color
        </h3>
        
        <div className="space-y-2">
          <div className="grid grid-cols-5 gap-1">
            {brandColorPalette.map((color) => (
              <button
                key={color}
                onClick={() => {
                  if (selectedEl.type === 'text') {
                    handleDirectUpdate('color', color);
                  } else {
                    handleDirectUpdate('backgroundColor', color);
                  }
                }}
                className={`w-6 h-6 rounded border-2 transition-all ${
                  (selectedEl.type === 'text' ? selectedEl.color : selectedEl.backgroundColor) === color 
                    ? 'border-white' : 'border-gray-600'
                }`}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={selectedEl.type === 'text' ? selectedEl.color || '#000000' : selectedEl.backgroundColor || '#000000'}
              onChange={(e) => {
                if (selectedEl.type === 'text') {
                  handleDirectUpdate('color', e.target.value);
                } else {
                  handleDirectUpdate('backgroundColor', e.target.value);
                }
              }}
              className="w-8 h-8 bg-transparent cursor-pointer rounded"
            />
            <input
              type="text"
              value={selectedEl.type === 'text' ? selectedEl.color || '#000000' : selectedEl.backgroundColor || '#000000'}
              onChange={(e) => {
                if (selectedEl.type === 'text') {
                  handleDirectUpdate('color', e.target.value);
                } else {
                  handleDirectUpdate('backgroundColor', e.target.value);
                }
              }}
              className="flex-1 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-xs"
              placeholder="#000000"
            />
          </div>
        </div>
      </div>

      {/* Style Controls */}
      {(selectedEl.type === 'button' || selectedEl.type === 'shape') && (
        <div className="rounded p-3" style={{ backgroundColor: '#003a63' }}>
          <h3 className="text-xs font-medium text-gray-300 mb-2 flex items-center">
            <Square className="w-3.5 h-3.5 mr-1.5" />
            Style
          </h3>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Border Radius</label>
            <input
              type="number"
              value={selectedEl.borderRadius || 0}
              onChange={(e) => handleDirectUpdate('borderRadius', parseInt(e.target.value) || 0)}
              className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-xs"
            />
          </div>
        </div>
      )}

      {/* Visibility & Lock Controls */}
      <div className="rounded p-3" style={{ backgroundColor: '#003a63' }}>
        <h3 className="text-xs font-medium text-gray-300 mb-2">Element Controls</h3>
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectedEl.visible !== false}
              onChange={(e) => handleDirectUpdate('visible', e.target.checked)}
              className="rounded"
            />
            <span className="text-xs text-gray-300">Visible</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectedEl.locked || false}
              onChange={(e) => handleDirectUpdate('locked', e.target.checked)}
              className="rounded"
            />
            <span className="text-xs text-gray-300">Locked</span>
          </label>
        </div>
      </div>
    </div>
  );
}