import React, { useState } from 'react';
import { useCanvas } from '../contexts/CanvasContext';
import { useBrand } from '../contexts/BrandContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  Palette, 
  Type, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify,
  Bold,
  Italic,
  Underline,
  X,
  ChevronUp,
  ChevronDown,
  Move3D,
  AlignHorizontalJustifyStart,
  AlignHorizontalJustifyCenter,
  AlignHorizontalJustifyEnd,
  AlignVerticalJustifyStart,
  AlignVerticalJustifyCenter,
  AlignVerticalJustifyEnd
} from 'lucide-react';

interface BottomPropertiesPanelProps {
  canvasFormat?: { width: number; height: number };
}

export function BottomPropertiesPanel({ canvasFormat = { width: 1080, height: 1080 } }: BottomPropertiesPanelProps) {
  const { elements, selectedElement, updateElement } = useCanvas();
  const { brandAssets, addColor } = useBrand();
  const { isAuthenticated } = useAuth();
  const [isMinimized, setIsMinimized] = useState(false);

  const selectedEl = selectedElement ? elements.find(el => el.id === selectedElement) : null;

  // Debug logging to verify element type
  if (selectedEl) {
    console.log('🔍 BottomPropertiesPanel - Selected Element:', {
      id: selectedEl.id,
      type: selectedEl.type,
      isText: selectedEl.type === 'text',
      shouldShowTextSection: selectedEl.type === 'text',
      elementKeys: Object.keys(selectedEl)
    });
  }

  // Additional check for text section rendering
  const shouldShowTextSection = selectedEl?.type === 'text';
  console.log('🔍 Text Section Visibility:', shouldShowTextSection);

  if (!selectedEl) {
    return (
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-20 rounded-lg border border-gray-600 shadow-lg backdrop-blur-md" style={{ backgroundColor: 'rgba(26, 26, 26, 0.95)' }}>
        <div className="p-3 text-center">
          <p className="text-gray-400 text-xs">Select an element to edit properties</p>
        </div>
      </div>
    );
  }

  // Get brand colors with fallbacks
  const getBrandColors = () => {
    if (isAuthenticated) {
      // For authenticated users, only show their brand colors
      if (brandAssets.colors && brandAssets.colors.length > 0) {
        return brandAssets.colors.map(color => color.hex);
      }
      // If authenticated but no brand colors, return empty array
      return [];
    }
    // For guests, show Koech Labs default colors
    return ['#ff4940', '#002e51', '#6366f1', '#ffffff', '#000000', '#f8f9fa', '#e9ecef', '#6b7280'];
  };

  const brandColors = getBrandColors();
  const hasBrandColors = brandColors.length > 0;

  // Handle color change
  const handleColorChange = (color: string) => {
    if (selectedEl.type === 'text') {
      updateElement(selectedEl.id, { color });
    } else {
      updateElement(selectedEl.id, { backgroundColor: color });
    }
    
    // Auto-add color to brand if it's not already there and user is authenticated
    if (isAuthenticated && brandAssets.colors && !brandAssets.colors.find(c => c.hex === color)) {
      // Generate a name for the color
      const colorName = `Color ${brandAssets.colors.length + 1}`;
      addColor({ name: colorName, hex: color });
      console.log('🎨 [BRAND] Auto-added new color to brand:', colorName, color);
    }
  };

  // Handle text alignment
  const handleTextAlign = (align: string) => {
    if (selectedEl.type === 'text') {
      updateElement(selectedEl.id, { textAlign: align });
    }
  };

  // Handle text styles
  const handleTextStyle = (property: string, value: any) => {
    if (selectedEl.type === 'text') {
      updateElement(selectedEl.id, { [property]: value });
    }
  };

  // Toggle text decoration
  const toggleTextDecoration = (decoration: string) => {
    if (selectedEl.type === 'text') {
      const currentDecoration = selectedEl.textDecoration || 'none';
      const newDecoration = currentDecoration === decoration ? 'none' : decoration;
      updateElement(selectedEl.id, { textDecoration: newDecoration });
    }
  };

  // Canvas alignment functions
  const alignToCanvas = (alignment: string) => {
    if (!selectedEl) return;
    
    let updates: any = {};

    switch (alignment) {
      case 'canvas-left':
        updates.x = 0;
        break;
      case 'canvas-center-horizontal':
        updates.x = (canvasFormat.width - selectedEl.width) / 2;
        break;
      case 'canvas-right':
        updates.x = canvasFormat.width - selectedEl.width;
        break;
      case 'canvas-top':
        updates.y = 0;
        break;
      case 'canvas-center-vertical':
        updates.y = (canvasFormat.height - selectedEl.height) / 2;
        break;
      case 'canvas-bottom':
        updates.y = canvasFormat.height - selectedEl.height;
        break;
      case 'canvas-center':
        updates.x = (canvasFormat.width - selectedEl.width) / 2;
        updates.y = (canvasFormat.height - selectedEl.height) / 2;
        break;
    }

    updateElement(selectedEl.id, updates);
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-20 rounded-lg border border-gray-600 shadow-lg backdrop-blur-md" style={{ backgroundColor: 'rgba(26, 26, 26, 0.95)' }}>
        <button
          onClick={() => setIsMinimized(false)}
          className="p-2 text-gray-400 hover:text-white transition-colors flex items-center space-x-2"
        >
          <ChevronUp className="w-4 h-4" />
          <span className="text-xs">Properties ({selectedEl.type})</span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-20 rounded-lg border border-gray-600 shadow-lg backdrop-blur-md" style={{ backgroundColor: 'rgba(26, 26, 26, 0.95)' }}>
      <div className="p-3">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-medium text-white flex items-center space-x-2">
            <span>Properties</span>
            <span className="text-gray-400">({selectedEl.type})</span>
          </h3>
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1 text-gray-400 hover:text-white transition-colors"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          {/* Text Controls Section (only for text elements) - Top Section */}
          {shouldShowTextSection && selectedEl.type === 'text' && (
            <div className="space-y-2">
             <div className="flex items-center space-x-1" style={{ color: '#ff4940' }}>
                <Type className="w-4 h-4" />
                <span className="text-xs font-medium">Text Controls</span>
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                {/* Text Alignment */}
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-400">Align:</span>
                  <div className="flex space-x-1">
                    {[
                      { value: 'left', icon: AlignLeft },
                      { value: 'center', icon: AlignCenter },
                      { value: 'right', icon: AlignRight },
                      { value: 'justify', icon: AlignJustify }
                    ].map(({ value, icon: Icon }) => (
                      <button
                        key={value}
                        onClick={() => handleTextAlign(value)}
                        className={`p-1 rounded transition-colors ${
                          selectedEl.textAlign === value ? 'text-white' : 'text-gray-400 hover:text-white'
                        }`}
                        style={{ 
                          backgroundColor: selectedEl.textAlign === value ? '#6366f1' : 'transparent'
                        }}
                        title={`Align ${value}`}
                      >
                        <Icon className="w-4 h-4" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Text Styles */}
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-400">Style:</span>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => {
                        const currentWeight = selectedEl.fontWeight || '400';
                        const newWeight = currentWeight === '700' || currentWeight === 'bold' ? '400' : '700';
                        handleTextStyle('fontWeight', newWeight);
                      }}
                      className={`p-1 rounded transition-colors ${
                        (selectedEl.fontWeight === '700' || selectedEl.fontWeight === 'bold') ? 'text-white bg-green-600' : 'text-gray-400 hover:text-white'
                      }`}
                      title="Bold"
                    >
                      <Bold className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        const currentStyle = selectedEl.fontStyle || 'normal';
                        const newStyle = currentStyle === 'italic' ? 'normal' : 'italic';
                        handleTextStyle('fontStyle', newStyle);
                      }}
                      className={`p-1 rounded transition-colors ${
                        selectedEl.fontStyle === 'italic' ? 'text-white bg-green-600' : 'text-gray-400 hover:text-white'
                      }`}
                      title="Italic"
                    >
                      <Italic className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => toggleTextDecoration('underline')}
                      className={`p-1 rounded transition-colors ${
                        selectedEl.textDecoration === 'underline' ? 'text-white bg-green-600' : 'text-gray-400 hover:text-white'
                      }`}
                      title="Underline"
                    >
                      <Underline className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Font Size */}
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-400">Size:</span>
                  <input
                    type="number"
                    value={selectedEl.fontSize || 18}
                    onChange={(e) => handleTextStyle('fontSize', parseInt(e.target.value) || 18)}
                    className="w-16 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-xs"
                    min="8"
                    max="200"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Colors Section - Middle Section */}
          <div className="space-y-2">
          <div className="flex items-center space-x-1" style={{ color: '#ff4940' }}>
              <Palette className="w-4 h-4" />
              <span className="text-xs font-medium">Colors</span>
            </div>
            
            <div className="flex items-center space-x-2">
              {hasBrandColors ? (
                <div className="flex space-x-1">
                  {brandColors.slice(0, 8).map((color) => (
                    <button
                      key={color}
                      onClick={() => handleColorChange(color)}
                      className={`w-6 h-6 rounded border-2 transition-all hover:scale-110 ${
                        (selectedEl.type === 'text' ? selectedEl.color : selectedEl.backgroundColor) === color 
                          ? 'border-white' : 'border-gray-600'
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                  {/* Custom color picker */}
                  <input
                    type="color"
                    value={selectedEl.type === 'text' ? selectedEl.color || '#000000' : selectedEl.backgroundColor || '#000000'}
                    onChange={(e) => handleColorChange(e.target.value)}
                    className="w-6 h-6 bg-transparent cursor-pointer rounded border border-gray-600"
                    title="Custom color"
                  />
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  {isAuthenticated ? (
                    <span className="text-xs text-gray-500">No brand colors defined. Use color picker to add colors.</span>
                  ) : (
                    <div className="flex space-x-1">
                      {brandColors.slice(0, 8).map((color) => (
                        <button
                          key={color}
                          onClick={() => handleColorChange(color)}
                          className={`w-6 h-6 rounded border-2 transition-all hover:scale-110 ${
                            (selectedEl.type === 'text' ? selectedEl.color : selectedEl.backgroundColor) === color 
                              ? 'border-white' : 'border-gray-600'
                          }`}
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                  )}
                  {/* Custom color picker - always available */}
                  <input
                    type="color"
                    value={selectedEl.type === 'text' ? selectedEl.color || '#000000' : selectedEl.backgroundColor || '#000000'}
                    onChange={(e) => handleColorChange(e.target.value)}
                    className="w-6 h-6 bg-transparent cursor-pointer rounded border border-gray-600"
                    title="Custom color"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Canvas Alignment Section - Bottom Section */}
          <div className="space-y-2">
            <div className="flex items-center space-x-1" style={{ color: '#ff4940' }}>
              <Move3D className="w-4 h-4" />
              <span className="text-xs font-medium">Canvas Alignment</span>
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Quick center button */}
              <button
                onClick={() => alignToCanvas('canvas-center')}
                className="p-1 rounded transition-colors text-white hover:opacity-80"
                style={{ backgroundColor: '#ff4940' }}
                title="Center on Canvas"
              >
                <Move3D className="w-4 h-4" />
              </button>
              
              <div className="w-px h-4 bg-gray-600" />
              
              {/* Horizontal alignment */}
              <div className="flex space-x-1">
                <button
                  onClick={() => alignToCanvas('canvas-left')}
                  className="p-1 rounded transition-colors text-gray-400 hover:text-white hover:bg-gray-600"
                  title="Align Left"
                >
                  <AlignHorizontalJustifyStart className="w-4 h-4" />
                </button>
                <button
                  onClick={() => alignToCanvas('canvas-center-horizontal')}
                  className="p-1 rounded transition-colors text-gray-400 hover:text-white hover:bg-gray-600"
                  title="Center Horizontally"
                >
                  <AlignHorizontalJustifyCenter className="w-4 h-4" />
                </button>
                <button
                  onClick={() => alignToCanvas('canvas-right')}
                  className="p-1 rounded transition-colors text-gray-400 hover:text-white hover:bg-gray-600"
                  title="Align Right"
                >
                  <AlignHorizontalJustifyEnd className="w-4 h-4" />
                </button>
              </div>
              
              <div className="w-px h-4 bg-gray-600" />
              
              {/* Vertical alignment */}
              <div className="flex space-x-1">
                <button
                  onClick={() => alignToCanvas('canvas-top')}
                  className="p-1 rounded transition-colors text-gray-400 hover:text-white hover:bg-gray-600"
                  title="Align Top"
                >
                  <AlignVerticalJustifyStart className="w-4 h-4" />
                </button>
                <button
                  onClick={() => alignToCanvas('canvas-center-vertical')}
                  className="p-1 rounded transition-colors text-gray-400 hover:text-white hover:bg-gray-600"
                  title="Center Vertically"
                >
                  <AlignVerticalJustifyCenter className="w-4 h-4" />
                </button>
                <button
                  onClick={() => alignToCanvas('canvas-bottom')}
                  className="p-1 rounded transition-colors text-gray-400 hover:text-white hover:bg-gray-600"
                  title="Align Bottom"
                >
                  <AlignVerticalJustifyEnd className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 