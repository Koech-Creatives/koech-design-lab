import React, { useState } from 'react';
import { Type, Image, Square, Circle, Palette, FileImage } from 'lucide-react';
import { useCanvas } from '../contexts/CanvasContext';
import { useBrand } from '../contexts/BrandContext';

type ElementType = 'text' | 'image' | 'rectangle' | 'circle' | 'svg';
type QuickElementType = 'headline' | 'logo' | 'cta';

const elements = [
  { type: 'text' as ElementType, name: 'Text', icon: Type, content: 'Your text here' },
  { type: 'image' as ElementType, name: 'Image', icon: Image, content: undefined },
  { type: 'svg' as ElementType, name: 'SVG', icon: FileImage, content: undefined },
  { type: 'rectangle' as ElementType, name: 'Rectangle', icon: Square, content: undefined },
  { type: 'circle' as ElementType, name: 'Circle', icon: Circle, content: undefined },
];

export function ElementsPanel() {
  const { addElement } = useCanvas();
  const { brandAssets } = useBrand();
  
  // Neutral colors that are always available
  const neutralColors = [
    { name: 'Black', value: '#000000' },
    { name: 'White', value: '#ffffff' },
    { name: 'Grey', value: '#e5e7eb' },
  ];

  // Combine brand colors and neutral colors, with brand colors first
  const allColors = [
    ...brandAssets.colors.map(color => ({ name: color.name, value: color.hex })),
    ...neutralColors
  ];

  const [selectedColor, setSelectedColor] = useState(allColors.length > 0 ? allColors[0].value : '#e5e7eb');

  const handleElementAdd = (elementType: any) => {
    if (elementType.type === 'image' || elementType.type === 'svg') {
      // Open file input dialog
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = elementType.type === 'svg' ? '.svg' : 'image/*';
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          const fileUrl = URL.createObjectURL(file);
          const newElement = {
            type: elementType.type,
            position: { x: 50, y: 50 },
            size: getDefaultSize(elementType.type),
            content: fileUrl,
            style: getDefaultStyle(elementType.type, selectedColor),
            locked: false,
          };
          addElement(newElement);
        }
      };
      input.click();
      return;
    }
    
    const newElement = {
      type: elementType.type,
      position: { x: 50, y: 50 },
      size: getDefaultSize(elementType.type),
      content: elementType.content || '',
      style: getDefaultStyle(elementType.type, selectedColor),
      locked: false,
    };
    
    addElement(newElement);
  };

  const getDefaultSize = (type: string) => {
    switch (type) {
      case 'text': return { width: 200, height: 50 };
      case 'image': return { width: 200, height: 150 };
      case 'svg': return { width: 150, height: 150 };
      case 'rectangle': return { width: 150, height: 100 };
      case 'circle': return { width: 100, height: 100 };
      default: return { width: 100, height: 100 };
    }
  };

  const getDefaultStyle = (type: string, color: string = '#e5e7eb') => {
    switch (type) {
      case 'text':
        return {
          fontSize: '24px',
          fontWeight: '600',
          color: color === '#e5e7eb' ? '#1f2937' : color,
          fontFamily: 'Inter, sans-serif',
        };
      case 'rectangle':
        return {
          backgroundColor: color,
          borderRadius: '8px',
        };
      case 'circle':
        return {
          backgroundColor: color,
        };
      default:
        return {};
    }
  };

  const handleDragStart = (e: React.DragEvent, element: any) => {
    e.dataTransfer.setData('elementType', element.type);
  };

  const addQuickElement = (type: QuickElementType) => {
    if (type === 'logo') {
      // Open file input dialog for logo
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          const imageUrl = URL.createObjectURL(file);
          const newElement = {
            type: 'image',
            content: imageUrl,
            style: { borderRadius: '8px' },
            size: { width: 120, height: 120 },
            position: { x: 100, y: 100 },
            locked: false,
          };
          addElement(newElement);
        }
      };
      input.click();
      return;
    }

    const quickElements = {
      headline: {
        type: 'text',
        content: 'Your Headline Here',
        style: {
          fontSize: '36px',
          fontWeight: 'bold',
          color: selectedColor === '#e5e7eb' ? '#1f2937' : selectedColor,
          textAlign: 'center',
        },
        size: { width: 400, height: 80 },
      },
      cta: {
        type: 'rectangle',
        content: '', // Use empty string instead of null
        style: {
          backgroundColor: selectedColor,
          borderRadius: '12px',
        },
        size: { width: 180, height: 50 },
      },
    };

    if (type === 'headline' || type === 'cta') {
      const element = quickElements[type];
      addElement({
        ...element,
        position: { x: 100, y: 100 },
        locked: false,
      });
    }
  };

  const hasBrandColors = brandAssets.colors && brandAssets.colors.length > 0;

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-white">Elements</h2>
      
      <div className="grid grid-cols-2 gap-3">
        {elements.map((element) => {
          const Icon = element.icon;
          return (
            <div
              key={element.type}
              draggable
              onDragStart={(e) => handleDragStart(e, element)}
              onClick={() => handleElementAdd(element)}
              className="flex flex-col items-center space-y-2 p-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all duration-200 cursor-pointer group transform hover:scale-105"
            >
              <Icon className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
              <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                {element.name}
              </span>
            </div>
          );
        })}
      </div>
      
      {/* Color Selection */}
      <div className="pt-4 border-t border-gray-700">
        <h3 className="text-sm font-medium text-white flex items-center mb-3">
          <Palette className="w-4 h-4 mr-2 text-indigo-400" />
          Select Color
        </h3>

        {/* Brand Colors Section */}
        {hasBrandColors && (
          <div className="mb-4">
            <div className="text-xs text-gray-400 font-medium mb-2">Brand Colors</div>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {brandAssets.colors.map(color => (
                <div key={color.hex} className="flex flex-col items-center">
                  <button
                    onClick={() => setSelectedColor(color.hex)}
                    className={`w-12 h-12 rounded-md transition-all ${
                      selectedColor === color.hex 
                        ? 'ring-2 scale-110' 
                        : 'hover:scale-105'
                    }`}
                    style={{ 
                      backgroundColor: color.hex,
                      borderColor: selectedColor === color.hex ? '#ff4940' : 'transparent',
                      borderWidth: selectedColor === color.hex ? '2px' : '0px'
                    }}
                    title={color.name}
                  />
                  <span className="text-xs text-gray-300 mt-1 truncate w-full text-center">{color.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Neutral Colors Section */}
        <div>
          <div className="text-xs text-gray-400 font-medium mb-2">
            {hasBrandColors ? 'Neutral Colors' : 'Colors'}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {neutralColors.map(color => (
              <div key={color.value} className="flex flex-col items-center">
                <button
                  onClick={() => setSelectedColor(color.value)}
                  className={`w-12 h-12 rounded-md transition-all ${
                    selectedColor === color.value 
                      ? 'ring-2 scale-110' 
                      : 'hover:scale-105'
                  }`}
                  style={{ 
                    backgroundColor: color.value,
                    border: color.value === '#ffffff' ? '1px solid #e5e7eb' : 'none',
                    borderColor: selectedColor === color.value ? '#ff4940' : (color.value === '#ffffff' ? '#e5e7eb' : 'transparent'),
                    borderWidth: selectedColor === color.value ? '2px' : (color.value === '#ffffff' ? '1px' : '0px')
                  }}
                  title={color.name}
                />
                <span className="text-xs text-gray-300 mt-1">{color.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Color Indicator */}
        <div className="mt-3 p-2 bg-gray-800 rounded-lg">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-400">Selected:</span>
            <div 
              className="w-4 h-4 rounded border border-gray-600"
              style={{ backgroundColor: selectedColor }}
            />
            <span className="text-xs text-gray-300">{selectedColor}</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="pt-4 border-t border-gray-700">
        <h3 className="text-sm font-medium text-gray-300 mb-3">Quick Add</h3>
        <div className="space-y-2">
          <button 
            onClick={() => addQuickElement('headline')}
            className="w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors text-white hover:opacity-80"
            style={{ backgroundColor: '#ff4940' }}
          >
            Add Headline
          </button>
          <button 
            onClick={() => addQuickElement('logo')}
            className="w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors text-white hover:opacity-80"
            style={{ backgroundColor: '#ff4940' }}
          >
            Add Logo
          </button>
          <button 
            onClick={() => addQuickElement('cta')}
            className="w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors text-white hover:opacity-80"
            style={{ backgroundColor: '#ff4940' }}
          >
            Add CTA Button
          </button>
          <button 
            onClick={() => handleElementAdd({ type: 'svg', name: 'SVG', icon: FileImage })}
            className="w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors text-white hover:opacity-80 flex items-center justify-center space-x-2"
            style={{ backgroundColor: '#4f46e5' }}
          >
            <FileImage className="w-4 h-4" />
            <span>Upload SVG</span>
          </button>
        </div>
      </div>
    </div>
  );
}