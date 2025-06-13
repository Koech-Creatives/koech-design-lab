import React, { useState } from 'react';
import { LayersPanel } from './LayersPanel';
import { PropertiesPanel } from './PropertiesPanel';
import { BrandPanel } from './BrandPanel';
import { PagesPanel } from './PagesPanel';
import { 
  Layers,
  Settings,
  Palette,
  FileText,
  X,
  Square,
  Type
} from 'lucide-react';

interface LeftPanelProps {
  platform: string;
  currentFormat: any;
  activePanel: string;
}

export function LeftPanel({ platform, currentFormat, activePanel }: LeftPanelProps) {
  const [isOpen, setIsOpen] = useState(true);

  const renderPanel = () => {
    switch (activePanel) {
      case 'canvas':
        return <CanvasPanel />;
      case 'branding':
        return <BrandPanel />;
      case 'text':
        return <TextPanel />;
      case 'layers':
        return <LayersPanel />;
      case 'properties':
        return <PropertiesPanel />;
      case 'ai':
        return <AIPanel />;
      case 'import':
        return <ImportPanel />;
      case 'design':
        return <DesignPanel />;
      case 'colors':
        return <ColorsPanel />;
      case 'order':
        return <OrderPanel />;
      default:
        return <CanvasPanel />;
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="w-80 flex flex-col bg-slate-800 border-l border-slate-700">
      {/* Panel Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        <h2 className="text-lg font-semibold text-white capitalize">{activePanel}</h2>
        <button 
          onClick={() => setIsOpen(false)}
          className="p-1 rounded text-slate-400 hover:text-white transition-colors"
          title="Close panel"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      {/* Panel Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {renderPanel()}
      </div>
    </div>
  );
}

// AI Panel Component
function AIPanel() {
  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">🤖</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Assistant</h3>
        <p className="text-sm text-gray-600">AI-powered design suggestions and automation coming soon.</p>
      </div>
    </div>
  );
}

// Import Panel Component
function ImportPanel() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-4">Import Assets</h3>
        <div className="space-y-3">
          <button className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
            <div className="text-center">
              <div className="text-2xl mb-2">📁</div>
              <p className="text-sm text-gray-600">Upload Images</p>
            </div>
          </button>
          <button className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
            <div className="text-center">
              <div className="text-2xl mb-2">🎨</div>
              <p className="text-sm text-gray-600">Import Brand Kit</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

// Design Panel Component
function DesignPanel() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-4">Design Elements</h3>
        <div className="grid grid-cols-2 gap-3">
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="text-center">
              <Square className="w-6 h-6 mx-auto mb-2 text-gray-600" />
              <p className="text-xs text-gray-600">Rectangle</p>
            </div>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="text-center">
              <div className="w-6 h-6 rounded-full bg-gray-600 mx-auto mb-2"></div>
              <p className="text-xs text-gray-600">Circle</p>
            </div>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="text-center">
              <Type className="w-6 h-6 mx-auto mb-2 text-gray-600" />
              <p className="text-xs text-gray-600">Text</p>
            </div>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="text-center">
              <div className="w-6 h-1 bg-gray-600 mx-auto mb-2 mt-2"></div>
              <p className="text-xs text-gray-600">Line</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

// Colors Panel Component
function ColorsPanel() {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-4">Color Palette</h3>
        <div className="grid grid-cols-5 gap-2">
          {colors.map((color, index) => (
            <button
              key={index}
              className="w-12 h-12 rounded-lg border border-gray-200 hover:scale-110 transition-transform"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-4">Custom Color</h3>
        <div className="flex space-x-2">
          <input
            type="color"
            className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
          />
          <input
            type="text"
            placeholder="#000000"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>
      </div>
    </div>
  );
}

// Order Panel Component
function OrderPanel() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-4">Layer Order</h3>
        <div className="space-y-2">
          <div className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
            <span className="text-sm text-gray-700">Text Layer 1</span>
            <div className="flex space-x-1">
              <button className="p-1 text-gray-400 hover:text-gray-600">↑</button>
              <button className="p-1 text-gray-400 hover:text-gray-600">↓</button>
            </div>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
            <span className="text-sm text-gray-700">Background</span>
            <div className="flex space-x-1">
              <button className="p-1 text-gray-400 hover:text-gray-600">↑</button>
              <button className="p-1 text-gray-400 hover:text-gray-600">↓</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Canvas Panel Component
function CanvasPanel() {
  const [backgroundPattern, setBackgroundPattern] = useState('grid');
  const [opacity, setOpacity] = useState(30);

  return (
    <div className="space-y-6">
      {/* Layout Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-900">Layout</h3>
          <div className="flex space-x-2">
            <button className="text-xs text-gray-500 hover:text-gray-700">Settings</button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 border border-gray-200 rounded-lg bg-gray-50">
            <div className="w-full h-16 bg-white border border-gray-200 rounded mb-2 flex items-center justify-center">
              <div className="w-8 h-8 bg-gray-300 rounded"></div>
            </div>
          </div>
          <div className="p-3 border border-gray-200 rounded-lg">
            <div className="w-full h-16 bg-white border border-gray-200 rounded mb-2 flex items-center justify-center">
              <div className="w-8 h-8 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Pattern Section */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-4">Background Pattern</h3>
        
        <div className="mb-4">
          <select 
            value={backgroundPattern}
            onChange={(e) => setBackgroundPattern(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="grid">Grid</option>
            <option value="dots">Dots</option>
            <option value="none">None</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-xs text-gray-600 mb-2">Opacity</label>
          <div className="flex items-center space-x-3">
            <input
              type="range"
              min="0"
              max="100"
              value={opacity}
              onChange={(e) => setOpacity(Number(e.target.value))}
              className="flex-1"
            />
            <span className="text-sm text-gray-600 w-8">{opacity}%</span>
          </div>
        </div>
      </div>

      {/* Design Elements Section */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-4">Design Elements</h3>
        
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <input type="checkbox" id="custom-elements" className="rounded" />
            <label htmlFor="custom-elements" className="text-sm text-gray-700">Custom Design Elements</label>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 mt-4">
          {/* Design element icons */}
          <button className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Square className="w-5 h-5 text-gray-600 mx-auto" />
          </button>
          <button className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="w-5 h-5 rounded-full bg-gray-600 mx-auto"></div>
          </button>
          <button className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Type className="w-5 h-5 text-gray-600 mx-auto" />
          </button>
          <button className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="w-5 h-1 bg-gray-600 mx-auto mt-2"></div>
          </button>
        </div>
      </div>

      {/* Opacity Control */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-4">Opacity</h3>
        <div className="flex items-center space-x-3">
          <input
            type="range"
            min="0"
            max="100"
            value={opacity}
            onChange={(e) => setOpacity(Number(e.target.value))}
            className="flex-1"
          />
          <span className="text-sm text-gray-600 w-8">{opacity}%</span>
        </div>
      </div>
    </div>
  );
}

// Text Panel Component
function TextPanel() {
  const [fontPair, setFontPair] = useState('Inter / Ubuntu');
  const [customFonts, setCustomFonts] = useState(false);
  const [titleFont, setTitleFont] = useState('Archivo Black');
  const [bodyFont, setBodyFont] = useState('Lato');

  return (
    <div className="space-y-6">
      {/* Fonts Pair Section */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-4">Fonts Pair</h3>
        
        <div className="mb-4">
          <input
            type="text"
            value={fontPair}
            onChange={(e) => setFontPair(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg text-sm"
            placeholder="Inter / Ubuntu"
          />
        </div>

        <div className="flex items-center space-x-3 mb-4">
          <input 
            type="checkbox" 
            id="custom-fonts" 
            checked={customFonts}
            onChange={(e) => setCustomFonts(e.target.checked)}
            className="rounded" 
          />
          <label htmlFor="custom-fonts" className="text-sm text-gray-700">Custom Fonts Pairing</label>
        </div>

        {customFonts && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-gray-600 mb-2">Title Font</label>
              <select 
                value={titleFont}
                onChange={(e) => setTitleFont(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="Archivo Black">Archivo Black</option>
                <option value="Inter">Inter</option>
                <option value="Roboto">Roboto</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-2">Body Font</label>
              <select 
                value={bodyFont}
                onChange={(e) => setBodyFont(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="Lato">Lato</option>
                <option value="Inter">Inter</option>
                <option value="Roboto">Roboto</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Text Align Section */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-4">Text Align</h3>
        <div className="flex space-x-2">
          <button className="p-2 border border-gray-300 rounded hover:bg-gray-50">
            <div className="w-4 h-3 border-l-2 border-gray-600"></div>
          </button>
          <button className="p-2 border border-gray-300 rounded hover:bg-gray-50 bg-gray-100">
            <div className="w-4 h-3 border-l border-r border-gray-600"></div>
          </button>
          <button className="p-2 border border-gray-300 rounded hover:bg-gray-50">
            <div className="w-4 h-3 border-r-2 border-gray-600"></div>
          </button>
        </div>
      </div>

      {/* Vertical Align Section */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-4">Vertical Align</h3>
        <div className="flex space-x-2">
          <button className="p-2 border border-gray-300 rounded hover:bg-gray-50">
            <div className="w-3 h-4 border-t-2 border-gray-600"></div>
          </button>
          <button className="p-2 border border-gray-300 rounded hover:bg-gray-50">
            <div className="w-3 h-4 border-t border-b border-gray-600"></div>
          </button>
          <button className="p-2 border border-gray-300 rounded hover:bg-gray-50">
            <div className="w-3 h-4 border-b-2 border-gray-600"></div>
          </button>
        </div>
      </div>

      {/* Font Size Section */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-4">Font Size</h3>
        
        <div className="flex items-center space-x-3 mb-4">
          <input 
            type="checkbox" 
            id="custom-font-sizes" 
            className="rounded" 
          />
          <label htmlFor="custom-font-sizes" className="text-sm text-gray-700">Set Custom Font Sizes</label>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-600">CTA</span>
              <span className="text-xs text-gray-600">Size (em)</span>
              <span className="text-xs text-gray-600">Height</span>
              <span className="text-xs text-gray-600">Spacing (px)</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              <input type="number" value="1.40" className="p-1 border border-gray-300 rounded text-xs" />
              <input type="number" value="1.20" className="p-1 border border-gray-300 rounded text-xs" />
              <input type="number" value="1.00" className="p-1 border border-gray-300 rounded text-xs" />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-600">Title</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              <input type="number" value="4.00" className="p-1 border border-gray-300 rounded text-xs" />
              <input type="number" value="1.28" className="p-1 border border-gray-300 rounded text-xs" />
              <input type="number" value="1.00" className="p-1 border border-gray-300 rounded text-xs" />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-600">Subtitle</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              <input type="number" value="1.20" className="p-1 border border-gray-300 rounded text-xs" />
              <input type="number" value="1.20" className="p-1 border border-gray-300 rounded text-xs" />
              <input type="number" value="1.00" className="p-1 border border-gray-300 rounded text-xs" />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-600">BodyTitle</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              <input type="number" value="3.00" className="p-1 border border-gray-300 rounded text-xs" />
              <input type="number" value="1.28" className="p-1 border border-gray-300 rounded text-xs" />
              <input type="number" value="1.00" className="p-1 border border-gray-300 rounded text-xs" />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-600">Description</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              <input type="number" value="1.50" className="p-1 border border-gray-300 rounded text-xs" />
              <input type="number" value="1.40" className="p-1 border border-gray-300 rounded text-xs" />
              <input type="number" value="1.00" className="p-1 border border-gray-300 rounded text-xs" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 