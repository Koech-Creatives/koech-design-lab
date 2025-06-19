import React, { useState, useEffect } from 'react';
import { useCanvas } from '../contexts/CanvasContext';
import { useBrand } from '../contexts/BrandContext';
import { useBackground } from '../contexts/BackgroundContext';
import { Palette, Type, Move, Maximize as Resize, Sun, Square, Circle, Monitor } from 'lucide-react';

export function PropertiesPanel() {
  const { elements, selectedElement, updateElement } = useCanvas();
  const { brandAssets } = useBrand();
  const { canvasBackgroundColor, setCanvasBackgroundColor } = useBackground();
  const [colorTab, setColorTab] = useState('quick');

  const selectedEl = elements.find(el => el.id === selectedElement);

  const [localStyle, setLocalStyle] = useState(selectedEl?.style || {});

  useEffect(() => {
    if (selectedEl) {
      setLocalStyle(selectedEl.style || {});
    }
  }, [selectedEl]);

  if (!selectedEl) {
    return (
      <div className="p-3 space-y-3">
        <h2 className="text-xs font-semibold text-white">Properties</h2>
        
        {/* Canvas Background Controls */}
        <div className="rounded p-3" style={{ backgroundColor: '#003a63' }}>
          <h3 className="text-xs font-medium text-gray-300 mb-2 flex items-center">
            <Monitor className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
            Canvas Background
            <div className="ml-2 w-4 h-4 rounded border border-gray-600" 
              style={{ backgroundColor: canvasBackgroundColor }} 
            />
          </h3>
          
          <div className="space-y-2">
            <div className="grid grid-cols-4 gap-1">
              {['#ffffff', '#f8f9fa', '#e9ecef', '#000000'].map((color) => (
                <button
                  key={color}
                  onClick={() => setCanvasBackgroundColor(color)}
                  className={`w-6 h-6 rounded border-2 hover:scale-110 transition-transform ${
                    canvasBackgroundColor === color ? 'border-blue-400' : 'border-gray-600'
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={canvasBackgroundColor}
                onChange={(e) => setCanvasBackgroundColor(e.target.value)}
                className="w-8 h-8 bg-transparent cursor-pointer rounded"
              />
              <input
                type="text"
                value={canvasBackgroundColor}
                onChange={(e) => setCanvasBackgroundColor(e.target.value)}
                className="flex-1 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-xs"
                placeholder="#ffffff"
              />
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
  ].slice(0, 10); // Limit to 10 colors for UI consistency

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