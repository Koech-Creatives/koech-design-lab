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
  Layers,
  Circle,
  Square
} from 'lucide-react';
import { useCanvas } from '../contexts/CanvasContext';

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
      display: 'inline-block',
      border: '2px solid currentColor', 
      padding: '6px 12px',
      borderRadius: '4px',
      margin: '2px'
    },
    description: 'Text with border'
  },
  { 
    name: 'Round Boxed', 
    value: 'round-boxed',
    style: { 
      display: 'inline-block',
      border: '2px solid currentColor', 
      padding: '8px 16px',
      borderRadius: '20px',
      margin: '2px'
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
      textShadow: '3px 3px 6px rgba(0,0,0,0.7), 1px 1px 2px rgba(0,0,0,0.5)'
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

// Brand colors palette
const brandColors = [
  '#000000', '#ffffff', '#ff4940', '#6366f1', '#8b5cf6', 
  '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#64748b',
  '#1f2937', '#374151', '#6b7280', '#9ca3af', '#d1d5db'
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



export function TextTab({ onAddElement }: TextTabProps) {
  const { addElement, selectedElement, updateElement, elements } = useCanvas();
  const [selectedColor, setSelectedColor] = useState(brandColors[0]);
  const [selectedFont, setSelectedFont] = useState(fontFamilies[0].value);
  const [selectedWeight, setSelectedWeight] = useState(fontWeights[4].value); // Semibold
  const [selectedTransform, setSelectedTransform] = useState(textTransforms[0].value);
  const [selectedStyle, setSelectedStyle] = useState(textStyles[0]);
  const [fontSize, setFontSize] = useState(18);
  const [textAlign, setTextAlign] = useState('center');

  // Get the selected element object
  const selectedElementObj = selectedElement ? elements?.find(el => el.id === selectedElement) : null;
  
  // Check if we have a selected text element
  const isTextSelected = selectedElementObj?.type === 'text';
  const hasTextSelection = isTextSelected && (window.getSelection()?.toString()?.length || 0) > 0;

  // Apply property to selected text or whole element
  const applyTextProperty = (property: string, value: any) => {
    if (hasTextSelection && (window as any).applyTextPropertyToSelected) {
      // Apply to selected text portion
      (window as any).applyTextPropertyToSelected(property, value);
    } else if (isTextSelected && selectedElement) {
      // Apply to whole text element
      updateElement(selectedElement, { [property]: value });
    }
  };

  const handleQuickAdd = (textType: any) => {
    onAddElement({
      type: 'text',
      x: 400,
      y: 300,
      width: 300,
      height: Math.max(textType.fontSize * 1.5, 40),
      content: textType.content,
      fontSize: textType.fontSize,
      fontWeight: textType.fontWeight,
      color: selectedColor,
      fontFamily: selectedFont,
      textAlign: textAlign,
      textTransform: selectedTransform,
      textStyle: selectedStyle.value,
      customStyle: selectedStyle.style,
      autoWrap: true, // Enable auto-wrap
    });
  };

  const handleCustomTextAdd = () => {
    onAddElement({
      type: 'text',
      x: 400,
      y: 300,
      width: 300,
      height: Math.max(fontSize * 1.5, 40),
      content: 'Your custom text',
      fontSize: fontSize,
      fontWeight: selectedWeight,
      color: selectedColor,
      fontFamily: selectedFont,
      textAlign: textAlign,
      textTransform: selectedTransform,
      textStyle: selectedStyle.value,
      customStyle: selectedStyle.style,
      autoWrap: true, // Enable auto-wrap
    });
  };

  const handleFontSizeChange = (newSize: number) => {
    const clampedSize = Math.max(8, Math.min(200, newSize));
    setFontSize(clampedSize);
    applyTextProperty('fontSize', clampedSize);
  };

  const handleFontWeightChange = (weight: string) => {
    setSelectedWeight(weight);
    applyTextProperty('fontWeight', weight);
  };

  const handleFontFamilyChange = (fontValue: string) => {
    setSelectedFont(fontValue);
    applyTextProperty('fontFamily', fontValue);
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    applyTextProperty('color', color);
  };

  const handleTextStyleApply = (style: any) => {
    setSelectedStyle(style);
    applyTextProperty('textStyle', style);
  };

  const handleTextAlignChange = (alignment: string) => {
    setTextAlign(alignment);
    applyTextProperty('textAlign', alignment);
  };

  const handleTextTransformChange = (transform: string) => {
    setSelectedTransform(transform);
    applyTextProperty('textTransform', transform);
  };

  return (
    <div className="h-full bg-gray-900 text-white overflow-y-auto">
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="text-center">
          <Type className="w-8 h-8 mx-auto mb-2 text-indigo-400" />
          <h2 className="text-lg font-semibold">Text Tools</h2>
          <p className="text-sm text-gray-400">Create and style text elements</p>
        </div>

        {/* Status indicator */}
        {isTextSelected && (
          <div className="bg-blue-900/50 border border-blue-700 rounded-lg p-3 mb-4">
            <div className="flex items-center space-x-2">
              <Type className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-blue-300 font-medium">
                {hasTextSelection ? 'Text Selected - Changes apply to selection' : 'Text Element Selected - Changes apply to entire text'}
              </span>
            </div>
            {hasTextSelection && (
              <p className="text-xs text-blue-400 mt-1">
                Highlight text and use controls below to format specific portions
              </p>
            )}
          </div>
        )}

        {/* Quick Add Text */}
        <div>
          <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Quick Add Text
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {quickTextTypes.map((textType) => (
              <button
                key={textType.name}
                onClick={() => handleQuickAdd(textType)}
                className="p-3 bg-gray-800 border border-gray-600 rounded-lg hover:border-indigo-500 hover:bg-gray-700 transition-all text-left group"
              >
                <div className="text-xs font-medium text-gray-400 mb-1">{textType.name}</div>
                <div 
                  className="text-gray-200 truncate"
                  style={{ 
                    fontSize: `${Math.min(textType.fontSize * 0.7, 14)}px`,
                    fontWeight: textType.fontWeight,
                    fontStyle: 'normal'
                  }}
                >
                  {textType.content}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Font Controls */}
        <div>
          <h3 className="text-sm font-semibold text-gray-300 mb-3">Font Controls</h3>
          
          {/* Font Family */}
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-400 mb-2">Font Family</label>
            <select
              value={selectedFont}
              onChange={(e) => handleFontFamilyChange(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500"
            >
              {fontFamilies.map((font) => (
                <option key={font.name} value={font.value} style={{ fontFamily: font.value }}>
                  {font.name}
                </option>
              ))}
            </select>
          </div>

          {/* Font Size */}
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-400 mb-2">Font Size</label>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleFontSizeChange(Math.max(8, fontSize - 2))}
                className="p-2 bg-gray-800 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <input
                type="number"
                value={fontSize}
                onChange={(e) => handleFontSizeChange(Math.max(8, Math.min(200, parseInt(e.target.value) || 18)))}
                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm text-center focus:outline-none focus:border-indigo-500"
                min="8"
                max="200"
              />
              <button
                onClick={() => handleFontSizeChange(Math.min(200, fontSize + 2))}
                className="p-2 bg-gray-800 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

                  {/* Font Weight */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-400 mb-2">Font Weight</label>
          <div className="grid grid-cols-4 gap-1">
            {fontWeights.map((weight) => (
              <button
                key={weight.value}
                onClick={() => handleFontWeightChange(weight.value)}
                className={`px-2 py-1 text-xs rounded transition-colors ${
                  selectedWeight === weight.value
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-800 border border-gray-600 text-gray-300 hover:bg-gray-700'
                }`}
                style={{ fontWeight: weight.value }}
              >
                {weight.name}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Format Buttons */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-400 mb-2">Quick Format</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => applyTextProperty('fontWeight', 'bold')}
              className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg hover:border-indigo-500 hover:bg-gray-700 transition-all flex items-center space-x-1"
              title="Bold"
            >
              <Bold className="w-4 h-4" />
              <span className="text-xs">Bold</span>
            </button>
            <button
              onClick={() => applyTextProperty('italic', true)}
              className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg hover:border-indigo-500 hover:bg-gray-700 transition-all flex items-center space-x-1"
              title="Italic"
            >
              <Italic className="w-4 h-4" />
              <span className="text-xs">Italic</span>
            </button>
            <button
              onClick={() => applyTextProperty('underline', true)}
              className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg hover:border-indigo-500 hover:bg-gray-700 transition-all flex items-center space-x-1"
              title="Underline"
            >
              <Underline className="w-4 h-4" />
              <span className="text-xs">Underline</span>
            </button>
            <button
              onClick={() => applyTextProperty('textStyle', { value: 'strikethrough', style: { textDecoration: 'line-through' } })}
              className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg hover:border-indigo-500 hover:bg-gray-700 transition-all flex items-center space-x-1"
              title="Strikethrough"
            >
              <Minus className="w-4 h-4" />
              <span className="text-xs">Strike</span>
            </button>
          </div>
        </div>
        </div>

        {/* Text Color */}
        <div>
          <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center">
            <Palette className="w-4 h-4 mr-2" />
            Text Color
          </h3>
          <div className="grid grid-cols-5 gap-2 mb-3">
            {brandColors.map((color) => (
              <button
                key={color}
                onClick={() => handleColorChange(color)}
                className={`w-10 h-10 rounded-lg border-2 transition-all duration-200 ${
                  selectedColor === color 
                    ? 'border-indigo-400 ring-2 ring-indigo-400/50' 
                    : 'border-gray-600 hover:border-gray-500'
                }`}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
          <input
            type="color"
            value={selectedColor}
            onChange={(e) => handleColorChange(e.target.value)}
            className="w-full h-10 bg-gray-800 border border-gray-600 rounded-lg cursor-pointer"
          />
        </div>

        {/* Text Alignment */}
        <div>
          <h3 className="text-sm font-semibold text-gray-300 mb-3">Text Alignment</h3>
          <div className="grid grid-cols-4 gap-2">
            {[
              { icon: AlignLeft, value: 'left', label: 'Left' },
              { icon: AlignCenter, value: 'center', label: 'Center' },
              { icon: AlignRight, value: 'right', label: 'Right' },
              { icon: AlignJustify, value: 'justify', label: 'Justify' }
            ].map((align) => {
              const Icon = align.icon;
              return (
                <button
                  key={align.value}
                  onClick={() => handleTextAlignChange(align.value)}
                  className="p-3 bg-gray-800 border border-gray-600 rounded-lg hover:border-indigo-500 hover:bg-gray-700 transition-all flex flex-col items-center space-y-1"
                  title={align.label}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-xs">{align.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Text Behavior */}
        <div>
          <h3 className="text-sm font-semibold text-gray-300 mb-3">Text Behavior</h3>
          <div className="space-y-2">
            <button
              onClick={() => applyTextProperty('autoWrap', true)}
              className={`w-full px-3 py-2 text-sm rounded-lg transition-all flex items-center space-x-2 ${
                selectedElementObj?.autoWrap !== false
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-800 border border-gray-600 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <RotateCcw className="w-4 h-4" />
              <span>Auto-resize (Dynamic)</span>
            </button>
            <button
              onClick={() => applyTextProperty('autoWrap', false)}
              className={`w-full px-3 py-2 text-sm rounded-lg transition-all flex items-center space-x-2 ${
                selectedElementObj?.autoWrap === false
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-800 border border-gray-600 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <Square className="w-4 h-4" />
              <span>Fixed size (Manual resize)</span>
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Auto-resize: Text box grows with content. Fixed size: Drag corners to resize manually.
          </p>
        </div>

        {/* Text Transform */}
        <div>
          <h3 className="text-sm font-semibold text-gray-300 mb-3">Text Case</h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Normal', value: 'none' },
              { label: 'UPPERCASE', value: 'uppercase' },
              { label: 'lowercase', value: 'lowercase' },
              { label: 'Capitalize', value: 'capitalize' }
            ].map((transform) => (
              <button
                key={transform.value}
                onClick={() => handleTextTransformChange(transform.value)}
                className="px-3 py-2 text-xs bg-gray-800 border border-gray-600 rounded-lg hover:border-indigo-500 hover:bg-gray-700 transition-all"
                style={{ textTransform: transform.value as any }}
              >
                {transform.label}
              </button>
            ))}
          </div>
        </div>

        {/* Text Styles */}
        <div>
          <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center">
            <Sparkles className="w-4 h-4 mr-2" />
            Text Styles
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {textStyles.map((style) => (
              <button
                key={style.name}
                onClick={() => handleTextStyleApply(style)}
                className="p-3 bg-gray-800 border border-gray-600 rounded-lg hover:border-indigo-500 hover:bg-gray-700 transition-all text-left group"
              >
                <div className="text-xs font-medium text-gray-400 mb-1">{style.name}</div>
                <div 
                  className="text-sm text-gray-200"
                  style={style.style}
                >
                  {style.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Usage Instructions */}
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-3">
          <h4 className="text-sm font-medium text-gray-300 mb-2">💡 How to Use Text Formatting</h4>
          <ul className="text-xs text-gray-400 space-y-1">
            <li>• <strong className="text-blue-400">Double-click</strong> any text to edit it</li>
            <li>• <strong className="text-green-400">Highlight text</strong> and use controls above to format specific portions</li>
            <li>• <strong className="text-purple-400">Select text element</strong> to apply changes to entire text</li>
            <li>• <strong className="text-yellow-400">Boxed styles</strong> create pill/box containers around text</li>
            <li>• <strong className="text-red-400">Effects</strong> like neon, shadow, gradient work on selected text</li>
            <li>• Use <strong>Ctrl+B/I/U</strong> for quick formatting while editing</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 