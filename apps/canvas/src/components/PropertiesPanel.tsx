import React, { useState, useEffect } from 'react';
import { useCanvas } from '../contexts/CanvasContext';
import { useBrand } from '../contexts/BrandContext';
import { useBackground } from '../contexts/BackgroundContext';
import { Palette, Type, Move, Maximize as Resize, Sun, Square, Circle, Monitor } from 'lucide-react';

export function PropertiesPanel() {
  const { elements, selectedElement, updateElement } = useCanvas();
  const { brandAssets } = useBrand();
  const { editorBackgroundColor, canvasBackgroundColor, setEditorBackgroundColor, setCanvasBackgroundColor } = useBackground();
  const [colorTab, setColorTab] = useState('quick');

  const selectedEl = elements.find(el => el.id === selectedElement);

  const [localStyle, setLocalStyle] = useState(selectedEl?.style || {});
  const [localPosition, setLocalPosition] = useState(selectedEl?.position || { x: 0, y: 0 });
  const [localSize, setLocalSize] = useState(selectedEl?.size || { width: 100, height: 100 });

  useEffect(() => {
    if (selectedEl) {
      setLocalStyle(selectedEl.style || {});
      setLocalPosition(selectedEl.position || { x: 0, y: 0 });
      setLocalSize(selectedEl.size || { width: 100, height: 100 });
    }
  }, [selectedEl]);

  if (!selectedEl) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Properties</h2>
        
        {/* Canvas Background Controls */}
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
            <Monitor className="w-4 h-4 mr-2 text-blue-400" />
            Canvas Background
            <div className="ml-2 w-5 h-5 rounded-sm border border-gray-600" 
              style={{ backgroundColor: canvasBackgroundColor }} 
            />
          </h3>
          
          <div className="space-y-3">
            <div className="grid grid-cols-4 gap-2">
              {['#ffffff', '#f8f9fa', '#e9ecef', '#000000'].map((color) => (
                <button
                  key={color}
                  onClick={() => setCanvasBackgroundColor(color)}
                  className={`w-8 h-8 rounded border-2 hover:scale-110 transition-transform ${
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
                className="w-10 h-10 bg-transparent cursor-pointer rounded"
              />
              <input
                type="text"
                value={canvasBackgroundColor}
                onChange={(e) => setCanvasBackgroundColor(e.target.value)}
                className="flex-1 px-2 py-1.5 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                placeholder="#ffffff"
              />
            </div>
          </div>
        </div>

        {/* Editor Background Controls */}
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
            <Palette className="w-4 h-4 mr-2 text-purple-400" />
            Editor Background
            <div className="ml-2 w-5 h-5 rounded-sm border border-gray-600" 
              style={{ backgroundColor: editorBackgroundColor }} 
            />
          </h3>
          
          <div className="space-y-3">
            <div className="grid grid-cols-4 gap-2">
              {['#1a1a1a', '#2d3748', '#4a5568', '#718096'].map((color) => (
                <button
                  key={color}
                  onClick={() => setEditorBackgroundColor(color)}
                  className={`w-8 h-8 rounded border-2 hover:scale-110 transition-transform ${
                    editorBackgroundColor === color ? 'border-purple-400' : 'border-gray-600'
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={editorBackgroundColor}
                onChange={(e) => setEditorBackgroundColor(e.target.value)}
                className="w-10 h-10 bg-transparent cursor-pointer rounded"
              />
              <input
                type="text"
                value={editorBackgroundColor}
                onChange={(e) => setEditorBackgroundColor(e.target.value)}
                className="flex-1 px-2 py-1.5 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                placeholder="#1a1a1a"
              />
            </div>
          </div>
        </div>

        <div className="text-center py-4">
          <p className="text-gray-400 text-sm">Select an element to edit its properties</p>
        </div>
      </div>
    );
  }

  const handleStyleUpdate = (updates: any) => {
    const newStyle = { ...localStyle, ...updates };
    setLocalStyle(newStyle);
    updateElement(selectedEl.id, { style: newStyle });
  };

  const handlePositionUpdate = (updates: any) => {
    const newPosition = { ...localPosition, ...updates };
    setLocalPosition(newPosition);
    updateElement(selectedEl.id, { position: newPosition });
  };

  const handleSizeUpdate = (updates: any) => {
    const newSize = { ...localSize, ...updates };
    setLocalSize(newSize);
    updateElement(selectedEl.id, { size: newSize });
  };

  const getCurrentColor = () => {
    if (selectedEl.type === 'text') {
      return localStyle.color || '#000000';
    }
    return localStyle.backgroundColor || '#e5e7eb';
  };

  const basicColors = [
    '#e5e7eb', // Grey
    '#000000', // Black
    '#ffffff', // White
  ];
  
  const getElementIcon = () => {
    switch (selectedEl.type) {
      case 'text': return <Type className="w-5 h-5 text-blue-400" />;
      case 'rectangle': return <Square className="w-5 h-5 text-purple-400" />;
      case 'circle': return <Circle className="w-5 h-5 text-green-400" />;
      case 'image': return <img src={selectedEl.content} className="w-5 h-5 object-cover rounded" alt="Selected" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Properties</h2>
        <div className="flex items-center space-x-2 bg-gray-800 rounded-lg p-1">
          {getElementIcon()}
          <span className="text-sm text-gray-300 capitalize">{selectedEl.type}</span>
        </div>
      </div>
      
      {/* Color Section - Prioritized for visibility */}
      {selectedEl.type !== 'image' && (
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
            <Palette className="w-4 h-4 mr-2 text-purple-400" />
            Color
            <div className="ml-2 w-5 h-5 rounded-sm border border-gray-600" 
              style={{ backgroundColor: getCurrentColor() }} 
            />
          </h3>

          <div className="mb-3">
            <div className="flex border-b border-gray-700 mb-3">
              <button
                onClick={() => setColorTab('quick')}
                className={`px-3 py-1.5 text-xs font-medium ${colorTab === 'quick' ? 'border-b-2' : 'text-gray-400'}`}
                style={colorTab === 'quick' ? { color: '#ff4940', borderColor: '#ff4940' } : {}}
              >
                Quick Colors
              </button>
              <button
                onClick={() => setColorTab('gradients')}
                className={`px-3 py-1.5 text-xs font-medium ${colorTab === 'gradients' ? 'border-b-2' : 'text-gray-400'}`}
                style={colorTab === 'gradients' ? { color: '#ff4940', borderColor: '#ff4940' } : {}}
              >
                Gradients
              </button>
              <button
                onClick={() => setColorTab('custom')}
                className={`px-3 py-1.5 text-xs font-medium ${colorTab === 'custom' ? 'border-b-2' : 'text-gray-400'}`}
                style={colorTab === 'custom' ? { color: '#ff4940', borderColor: '#ff4940' } : {}}
              >
                Custom
              </button>
            </div>

            {colorTab === 'quick' && (
              <div className="grid grid-cols-5 gap-2">
                {basicColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => {
                      if (selectedEl.type === 'text') {
                        handleStyleUpdate({ color });
                      } else {
                        handleStyleUpdate({ backgroundColor: color });
                      }
                    }}
                    className="w-8 h-8 rounded border border-gray-600 hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            )}

            {colorTab === 'gradients' && selectedEl.type !== 'text' && (
              <div className="grid grid-cols-2 gap-2">
                {/* Remove gradient colors since we're limiting the palette */}
              </div>
            )}

            {colorTab === 'custom' && (
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={getCurrentColor()}
                  onChange={(e) => {
                    if (selectedEl.type === 'text') {
                      handleStyleUpdate({ color: e.target.value });
                    } else {
                      handleStyleUpdate({ backgroundColor: e.target.value });
                    }
                  }}
                  className="w-10 h-10 bg-transparent cursor-pointer rounded"
                />
                <input
                  type="text"
                  value={getCurrentColor()}
                  onChange={(e) => {
                    if (selectedEl.type === 'text') {
                      handleStyleUpdate({ color: e.target.value });
                    } else {
                      handleStyleUpdate({ backgroundColor: e.target.value });
                    }
                  }}
                  className="flex-1 px-2 py-1.5 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                  placeholder="#000000"
                />
              </div>
            )}
          </div>

          {selectedEl.type !== 'text' && (
            <div>
              <h4 className="text-xs font-medium text-gray-400 mb-2">Appearance</h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Opacity</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={parseInt((localStyle.opacity || 1) * 100)}
                      onChange={(e) => handleStyleUpdate({ opacity: parseInt(e.target.value) / 100 })}
                      className="flex-1"
                    />
                    <span className="text-xs w-8 text-center text-gray-300">
                      {Math.round(parseFloat(localStyle.opacity || 1) * 100)}%
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Border Radius</label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={parseInt(localStyle.borderRadius) || 0}
                    onChange={(e) => handleStyleUpdate({ borderRadius: `${e.target.value}px` })}
                    className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Position Controls */}
      <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
          <Move className="w-4 h-4 mr-2 text-blue-400" />
          Position
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-gray-400">X</label>
            <input
              type="number"
              value={Math.round(localPosition.x)}
              onChange={(e) => handlePositionUpdate({ x: parseInt(e.target.value) || 0 })}
              className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400">Y</label>
            <input
              type="number"
              value={Math.round(localPosition.y)}
              onChange={(e) => handlePositionUpdate({ y: parseInt(e.target.value) || 0 })}
              className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm"
            />
          </div>
        </div>
      </div>

      {/* Size Controls */}
      <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
          <Resize className="w-4 h-4 mr-2 text-green-400" />
          Size
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-gray-400">Width</label>
            <input
              type="number"
              value={Math.round(localSize.width)}
              onChange={(e) => handleSizeUpdate({ width: parseInt(e.target.value) || 1 })}
              className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400">Height</label>
            <input
              type="number"
              value={Math.round(localSize.height)}
              onChange={(e) => handleSizeUpdate({ height: parseInt(e.target.value) || 1 })}
              className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm"
            />
          </div>
        </div>
      </div>

      {/* Typography Controls */}
      {selectedEl.type === 'text' && (
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
            <Type className="w-4 h-4 mr-2 text-yellow-400" />
            Typography
          </h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-400 block mb-1">Font Size</label>
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  min="12"
                  max="72"
                  value={parseInt(localStyle.fontSize) || 16}
                  onChange={(e) => handleStyleUpdate({ fontSize: `${e.target.value}px` })}
                  className="flex-1"
                />
                <span className="text-xs w-12 text-center text-gray-300">
                  {localStyle.fontSize || '16px'}
                </span>
              </div>
            </div>
            
            <div>
              <label className="text-xs text-gray-400 block mb-1">Font Weight</label>
              <select
                value={localStyle.fontWeight || 'normal'}
                onChange={(e) => handleStyleUpdate({ fontWeight: e.target.value })}
                className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm"
              >
                <option value="normal">Normal</option>
                <option value="bold">Bold</option>
                <option value="600">Semi Bold</option>
                <option value="300">Light</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-400 block mb-1">Text Align</label>
              <select
                value={localStyle.textAlign || 'left'}
                onChange={(e) => handleStyleUpdate({ textAlign: e.target.value })}
                className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-400 block mb-1">Line Height</label>
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  min="100"
                  max="200"
                  value={Math.round((parseFloat(localStyle.lineHeight) || 1.5) * 100)}
                  onChange={(e) => handleStyleUpdate({ lineHeight: (parseInt(e.target.value) / 100).toString() })}
                  className="flex-1"
                />
                <span className="text-xs w-12 text-center text-gray-300">
                  {((parseFloat(localStyle.lineHeight) || 1.5) * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}