import React, { useState } from 'react';
import { 
  Type, 
  Zap,
  Palette,
  Quote,
  Hash,
  FileText,
  Heading1,
  Heading2,
  Heading3,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Plus,
  Minus,
  RotateCcw,
  Sparkles,
  Shadow,
  Layers,
  Circle,
  Square
} from 'lucide-react';

interface TextTabProps {
  onAddElement: (element: any) => void;
}

// Font families available
const fontFamilies = [
  { name: 'Gilmer', value: 'Gilmer, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif' },
  { name: 'Inter', value: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif' },
  { name: 'Helvetica', value: 'Helvetica, Arial, sans-serif' },
  { name: 'Times', value: 'Times, Times New Roman, serif' },
  { name: 'Georgia', value: 'Georgia, serif' },
  { name: 'Monaco', value: 'Monaco, Consolas, monospace' },
  { name: 'Impact', value: 'Impact, Arial Black, sans-serif' },
  { name: 'Comic Sans', value: 'Comic Sans MS, cursive' },
];

// Font weights
const fontWeights = [
  { name: 'Thin', value: '100' },
  { name: 'Light', value: '300' },
  { name: 'Regular', value: '400' },
  { name: 'Medium', value: '500' },
  { name: 'Semibold', value: '600' },
  { name: 'Bold', value: '700' },
  { name: 'Black', value: '900' },
];

// Text transform options
const textTransforms = [
  { name: 'Normal', value: 'none' },
  { name: 'UPPERCASE', value: 'uppercase' },
  { name: 'lowercase', value: 'lowercase' },
  { name: 'Capitalize', value: 'capitalize' },
];

// Text styles with effects
const textStyles = [
  { 
    name: 'Normal', 
    value: 'normal',
    style: {},
    description: 'Clean text'
  },
  { 
    name: 'Underlined', 
    value: 'underlined',
    style: { textDecoration: 'underline' },
    description: 'Underlined text'
  },
  { 
    name: 'Italic', 
    value: 'italic',
    style: { fontStyle: 'italic' },
    description: 'Italic text'
  },
  { 
    name: 'Strikethrough', 
    value: 'strikethrough',
    style: { textDecoration: 'line-through' },
    description: 'Crossed out text'
  },
  { 
    name: 'Boxed', 
    value: 'boxed',
    style: { 
      border: '2px solid currentColor', 
      padding: '8px 16px',
      borderRadius: '4px'
    },
    description: 'Text with border'
  },
  { 
    name: 'Round Boxed', 
    value: 'round-boxed',
    style: { 
      border: '2px solid currentColor', 
      padding: '8px 16px',
      borderRadius: '20px'
    },
    description: 'Rounded border'
  },
  { 
    name: 'Neon', 
    value: 'neon',
    style: { 
      textShadow: '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor',
      fontWeight: 'bold'
    },
    description: 'Glowing effect'
  },
  { 
    name: 'Shadow', 
    value: 'shadow',
    style: { 
      textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
    },
    description: 'Drop shadow'
  },
  { 
    name: 'Outlined', 
    value: 'outlined',
    style: { 
      WebkitTextStroke: '1px currentColor',
      color: 'transparent'
    },
    description: 'Outline only'
  },
  { 
    name: 'Gradient', 
    value: 'gradient',
    style: { 
      background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      fontWeight: 'bold'
    },
    description: 'Gradient fill'
  },
];

// Quick text types
const quickTextTypes = [
  {
    name: 'Hook',
    content: 'Attention-grabbing hook',
    fontSize: 32,
    fontWeight: '700',
    icon: Zap,
    description: 'Eye-catching opener'
  },
  {
    name: 'Headline',
    content: 'Your Main Headline',
    fontSize: 28,
    fontWeight: '600',
    icon: Heading1,
    description: 'Primary heading'
  },
  {
    name: 'Title',
    content: 'Section Title',
    fontSize: 24,
    fontWeight: '600',
    icon: Heading2,
    description: 'Section header'
  },
  {
    name: 'Subtitle',
    content: 'Supporting subtitle',
    fontSize: 20,
    fontWeight: '500',
    icon: Heading3,
    description: 'Secondary heading'
  },
  {
    name: 'Paragraph',
    content: 'Your paragraph text goes here. This is perfect for longer descriptions and detailed content.',
    fontSize: 16,
    fontWeight: '400',
    icon: FileText,
    description: 'Body text'
  },
  {
    name: 'Quote',
    content: '"Inspiring quote or testimonial"',
    fontSize: 18,
    fontWeight: '400',
    icon: Quote,
    description: 'Quotation text'
  },
];

// Brand colors
const brandColors = [
  '#000000', // Black
  '#ffffff', // White
  '#ff4940', // Red
  '#6366f1', // Indigo
  '#8b5cf6', // Purple
  '#06b6d4', // Cyan
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ef4444', // Red
  '#64748b', // Slate
];

export function TextTab({ onAddElement }: TextTabProps) {
  const [selectedColor, setSelectedColor] = useState(brandColors[0]);
  const [selectedFont, setSelectedFont] = useState(fontFamilies[0]);
  const [selectedWeight, setSelectedWeight] = useState(fontWeights[4]); // Semibold
  const [selectedTransform, setSelectedTransform] = useState(textTransforms[0]);
  const [selectedStyle, setSelectedStyle] = useState(textStyles[0]);
  const [fontSize, setFontSize] = useState(18);
  const [textAlign, setTextAlign] = useState('center');

  const handleQuickAdd = (textType: any) => {
    onAddElement({
      id: Date.now().toString(),
      type: 'text',
      x: 400,
      y: 300,
      width: 300,
      height: Math.max(textType.fontSize * 1.5, 40),
      content: textType.content,
      fontSize: textType.fontSize,
      fontWeight: textType.fontWeight,
      color: selectedColor,
      fontFamily: selectedFont.value,
      textAlign: textAlign,
      textTransform: selectedTransform.value,
      textStyle: selectedStyle.value,
      customStyle: selectedStyle.style,
      autoWrap: true, // Enable auto-wrap
    });
  };

  const handleCustomTextAdd = () => {
    onAddElement({
      id: Date.now().toString(),
      type: 'text',
      x: 400,
      y: 300,
      width: 300,
      height: Math.max(fontSize * 1.5, 40),
      content: 'Your custom text',
      fontSize: fontSize,
      fontWeight: selectedWeight.value,
      color: selectedColor,
      fontFamily: selectedFont.value,
      textAlign: textAlign,
      textTransform: selectedTransform.value,
      textStyle: selectedStyle.value,
      customStyle: selectedStyle.style,
      autoWrap: true, // Enable auto-wrap
    });
  };

  return (
    <div className="w-80 bg-gray-900 border-l border-gray-700 p-6 overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white mb-2">Text Tools</h2>
        <p className="text-sm text-gray-400">Create and style text elements</p>
      </div>

      {/* Quick Add Text */}
      <div className="mb-8">
        <h3 className="text-sm font-medium text-white mb-4 flex items-center">
          <Zap className="w-4 h-4 mr-2 text-yellow-400" />
          Quick Add Text
        </h3>
        <div className="space-y-2">
          {quickTextTypes.map((textType) => {
            const Icon = textType.icon;
            return (
              <button
                key={textType.name}
                onClick={() => handleQuickAdd(textType)}
                className="w-full p-3 bg-gray-800 rounded-lg border border-gray-600 hover:border-indigo-500 hover:bg-gray-700 transition-all duration-200 group text-left"
                title={textType.description}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-5 h-5 text-indigo-400" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white group-hover:text-indigo-300">
                      {textType.name}
                    </div>
                    <div className="text-xs text-gray-400 truncate">
                      {textType.content}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {textType.fontSize}px
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Font Controls */}
      <div className="mb-8">
        <h3 className="text-sm font-medium text-white mb-4 flex items-center">
          <Type className="w-4 h-4 mr-2 text-blue-400" />
          📝 Font Controls
        </h3>
        
        {/* Font Family */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-300 mb-2">Font Family</label>
          <select
            value={selectedFont.name}
            onChange={(e) => setSelectedFont(fontFamilies.find(f => f.name === e.target.value) || fontFamilies[0])}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500"
          >
            {fontFamilies.map((font) => (
              <option key={font.name} value={font.name}>{font.name}</option>
            ))}
          </select>
        </div>

        {/* Font Size */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-300 mb-2">Font Size</label>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setFontSize(Math.max(8, fontSize - 2))}
              className="p-2 bg-gray-800 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Minus className="w-4 h-4 text-gray-300" />
            </button>
            <input
              type="number"
              value={fontSize}
              onChange={(e) => setFontSize(Math.max(8, Math.min(200, parseInt(e.target.value) || 18)))}
              className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm text-center focus:outline-none focus:border-indigo-500"
              min="8"
              max="200"
            />
            <button
              onClick={() => setFontSize(Math.min(200, fontSize + 2))}
              className="p-2 bg-gray-800 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Plus className="w-4 h-4 text-gray-300" />
            </button>
          </div>
        </div>

        {/* Font Weight */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-300 mb-2">Font Weight</label>
          <div className="grid grid-cols-4 gap-1">
            {fontWeights.map((weight) => (
              <button
                key={weight.value}
                onClick={() => setSelectedWeight(weight)}
                className={`px-2 py-1 text-xs rounded transition-colors ${
                  selectedWeight.value === weight.value
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
                style={{ fontWeight: weight.value }}
              >
                {weight.name}
              </button>
            ))}
          </div>
        </div>

        {/* Text Transform */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-300 mb-2">Text Case</label>
          <div className="grid grid-cols-2 gap-2">
            {textTransforms.map((transform) => (
              <button
                key={transform.value}
                onClick={() => setSelectedTransform(transform)}
                className={`px-3 py-2 text-xs rounded transition-colors ${
                  selectedTransform.value === transform.value
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
                style={{ textTransform: transform.value as any }}
              >
                {transform.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Text Alignment */}
      <div className="mb-8">
        <h3 className="text-sm font-medium text-white mb-4 flex items-center">
          <AlignCenter className="w-4 h-4 mr-2 text-green-400" />
          📐 Text Alignment Tools
        </h3>
        <div className="grid grid-cols-4 gap-2">
          {[
            { name: 'Left', value: 'left', icon: AlignLeft },
            { name: 'Center', value: 'center', icon: AlignCenter },
            { name: 'Right', value: 'right', icon: AlignRight },
            { name: 'Justify', value: 'justify', icon: AlignJustify },
          ].map((align) => {
            const Icon = align.icon;
            return (
              <button
                key={align.value}
                onClick={() => setTextAlign(align.value)}
                className={`p-3 rounded-lg transition-colors flex items-center justify-center ${
                  textAlign === align.value
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
                title={`Align ${align.name}`}
              >
                <Icon className="w-4 h-4" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Text Styles & Effects */}
      <div className="mb-8">
        <h3 className="text-sm font-medium text-white mb-4 flex items-center">
          <Sparkles className="w-4 h-4 mr-2 text-purple-400" />
          🎨 Text Styles & ✨ Effects
        </h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {textStyles.map((style) => (
            <button
              key={style.value}
              onClick={() => setSelectedStyle(style)}
              className={`w-full p-3 rounded-lg border transition-all duration-200 text-left ${
                selectedStyle.value === style.value
                  ? 'bg-purple-600 border-purple-500 text-white'
                  : 'bg-gray-800 border-gray-600 text-gray-300 hover:border-purple-500 hover:bg-gray-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">{style.name}</span>
                {selectedStyle.value === style.value && (
                  <Circle className="w-3 h-3 fill-current" />
                )}
              </div>
              <div className="text-xs text-gray-400">{style.description}</div>
              <div 
                className="text-xs mt-2 p-2 bg-gray-900 rounded"
                style={style.style}
              >
                Preview Text
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Color Selector */}
      <div className="mb-8">
        <h3 className="text-sm font-medium text-white mb-4 flex items-center">
          <Palette className="w-4 h-4 mr-2 text-pink-400" />
          Text Color
        </h3>
        <div className="grid grid-cols-5 gap-2">
          {brandColors.map((color) => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              className={`w-10 h-10 rounded-lg border-2 transition-all duration-200 ${
                selectedColor === color 
                  ? 'border-white scale-110 shadow-lg' 
                  : 'border-gray-600 hover:border-gray-400'
              }`}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
        <div className="mt-3 p-3 bg-gray-800 rounded-lg">
          <div className="text-xs text-gray-400 mb-1">Selected Color</div>
          <div className="flex items-center space-x-2">
            <div 
              className="w-4 h-4 rounded border border-gray-600"
              style={{ backgroundColor: selectedColor }}
            />
            <span className="text-sm text-white font-mono">{selectedColor}</span>
          </div>
        </div>
      </div>

      {/* Live Preview */}
      <div className="mb-8">
        <h3 className="text-sm font-medium text-white mb-4 flex items-center">
          <Layers className="w-4 h-4 mr-2 text-cyan-400" />
          Live Preview
        </h3>
        <div className="p-4 bg-gray-800 rounded-lg border border-gray-600">
          <div 
            className="text-center"
            style={{
              fontSize: `${fontSize}px`,
              fontWeight: selectedWeight.value,
              color: selectedColor,
              fontFamily: selectedFont.value,
              textAlign: textAlign as any,
              textTransform: selectedTransform.value as any,
              ...selectedStyle.style,
            }}
          >
            Preview Text
          </div>
        </div>
      </div>

      {/* Add Custom Text Button */}
      <div className="mb-6">
        <button
          onClick={handleCustomTextAdd}
          className="w-full px-4 py-3 rounded-lg text-white font-medium transition-all duration-200 hover:opacity-90 flex items-center justify-center space-x-2"
          style={{ backgroundColor: '#ff4940' }}
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Text</span>
        </button>
      </div>

      {/* Usage Tips */}
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <h4 className="text-sm font-medium text-white mb-2">💡 Text Tips</h4>
        <ul className="text-xs text-gray-400 space-y-1">
          <li>• Text auto-wraps to fit container</li>
          <li>• Double-click text to edit content</li>
          <li>• <strong className="text-yellow-400">Highlight text to format it!</strong></li>
          <li>• Use Ctrl+B, Ctrl+I, Ctrl+U for shortcuts</li>
          <li>• Use Quick Add for common text types</li>
          <li>• Combine styles for unique effects</li>
          <li>• Preview shows your current settings</li>
        </ul>
        
        {/* Rich Text Demo */}
        <div className="mt-3 p-3 bg-gray-900 rounded border border-gray-600">
          <div className="text-xs text-gray-300 mb-2">Rich Text Example:</div>
          <div className="text-sm" style={{ color: '#ffffff' }}>
            <span style={{ fontWeight: 'bold', color: '#ff4940' }}>Bold Red</span>{' '}
            <span style={{ fontStyle: 'italic', color: '#10b981' }}>Italic Green</span>{' '}
            <span style={{ textDecoration: 'underline', color: '#6366f1' }}>Underlined Blue</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            ↑ Select text in editing mode to apply different styles
          </div>
        </div>
      </div>
    </div>
  );
} 