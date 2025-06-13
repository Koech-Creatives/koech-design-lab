import React from 'react';
import { Palette } from 'lucide-react';
import { useCanvas } from '../contexts/CanvasContext';
import { useBrand } from '../contexts/BrandContext';

export function FloatingColorPalette() {
  const { elements, selectedElement, updateElement } = useCanvas();
  const { brandAssets } = useBrand();
  
  const selectedEl = elements.find(el => el.id === selectedElement);
  
  // Don't show if no element is selected or if selected element is an image
  if (!selectedEl || selectedEl.type === 'image') {
    return null;
  }

  // Neutral colors that are always available
  const neutralColors = [
    { name: 'White', value: '#ffffff' },
    { name: 'Black', value: '#000000' },
    { name: 'Grey', value: '#e5e7eb' },
  ];

  const handleColorSelect = (color: string) => {
    if (selectedEl.type === 'text') {
      updateElement(selectedEl.id, { 
        style: { ...selectedEl.style, color } 
      });
    } else if (selectedEl.type === 'rectangle' || selectedEl.type === 'circle') {
      updateElement(selectedEl.id, { 
        style: { ...selectedEl.style, backgroundColor: color } 
      });
    }
  };

  const getCurrentColor = () => {
    if (selectedEl.type === 'text') {
      return selectedEl.style?.color || '#1f2937';
    }
    return selectedEl.style?.backgroundColor || '#e5e7eb';
  };

  const hasBrandColors = brandAssets.colors && brandAssets.colors.length > 0;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="rounded-xl shadow-2xl border p-4 backdrop-blur-sm bg-opacity-95" style={{ backgroundColor: '#002e51', borderColor: '#004080' }}>
        <div className="flex items-center space-x-4">
          {/* Color indicator and title */}
          <div className="flex items-center space-x-2">
            <Palette className="w-5 h-5" style={{ color: '#ff4940' }} />
            <div 
              className="w-6 h-6 rounded-md border-2"
              style={{ 
                backgroundColor: getCurrentColor(),
                borderColor: '#004080'
              }}
              title={`Current: ${getCurrentColor()}`}
            />
          </div>

          {/* Brand Colors Section - Only show if brand colors exist */}
          {hasBrandColors && (
            <div className="flex items-center space-x-2">
              <div className="text-xs text-gray-400 font-medium">Brand</div>
              <div className="flex space-x-1">
                {brandAssets.colors.map((color) => (
                  <button
                    key={color.hex}
                    onClick={() => handleColorSelect(color.hex)}
                    className={`w-8 h-8 rounded-lg border-2 transition-all hover:scale-110 ${
                      getCurrentColor() === color.hex
                        ? 'scale-110'
                        : ''
                    }`}
                    style={{ 
                      backgroundColor: color.hex,
                      borderColor: getCurrentColor() === color.hex ? '#ff4940' : '#004080'
                    }}
                    title={`${color.name}: ${color.hex}`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Neutral Colors Section */}
          <div className="flex items-center space-x-2">
            <div className="text-xs text-gray-400 font-medium">
              {hasBrandColors ? 'Neutral' : 'Colors'}
            </div>
            <div className="flex space-x-1">
              {neutralColors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => handleColorSelect(color.value)}
                  className={`w-8 h-8 rounded-lg border-2 transition-all hover:scale-110 ${
                    getCurrentColor() === color.value
                      ? 'scale-110'
                      : ''
                  }`}
                  style={{ 
                    backgroundColor: color.value,
                    borderColor: getCurrentColor() === color.value ? '#ff4940' : '#004080'
                  }}
                  title={`${color.name}: ${color.value}`}
                />
              ))}
            </div>
          </div>

          {/* Element type indicator */}
          <div className="text-xs text-gray-500 capitalize ml-2 px-2 py-1 rounded" style={{ backgroundColor: '#003a63' }}>
            {selectedEl.type}
          </div>
        </div>

        {/* Hint text when no brand colors */}
        {!hasBrandColors && (
          <div className="mt-2 text-xs text-gray-500 text-center">
            Add brand colors in the Brand panel to maintain consistency
          </div>
        )}
      </div>
    </div>
  );
} 