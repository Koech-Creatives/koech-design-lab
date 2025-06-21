import React, { useState } from 'react';
import { 
  Zap,
  Quote,
  Hash,
  FileText,
  Heading1,
  Heading2,
  Heading3,
  Plus,
  Minus,
} from 'lucide-react';
import { useCanvas } from '../contexts/CanvasContext';
import { useMarketingTracking } from '../hooks/useMarketingTracking';

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
      margin: '2px',
      backgroundColor: 'currentColor',
      color: 'white'
    },
    description: 'Text with filled box'
  },
  { 
    name: 'Round Boxed', 
    value: 'round-boxed',
    style: { 
      display: 'inline-block',
      border: '2px solid currentColor', 
      padding: '8px 16px',
      borderRadius: '20px',
      margin: '2px',
      backgroundColor: 'currentColor',
      color: 'white'
    },
    description: 'Rounded filled box'
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
        '#000000', '#ffffff', '#ff4940', '#6366f1', '#ff4940', 
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
    content: '"Your inspirational quote here"',
    fontSize: 22,
    fontWeight: '500',
    icon: Quote,
    description: 'Quoted text'
  },
  {
    name: 'Hashtag',
    content: '#YourHashtag',
    fontSize: 18,
    fontWeight: '600',
    icon: Hash,
    description: 'Social media tag'
  }
];

// Helper function to determine if a color is light or dark
const isLightColor = (color: string): boolean => {
  // Remove # if present
  const hex = color.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  return luminance > 0.5;
};

// Helper function to get contrasting text color
const getContrastColor = (backgroundColor: string): string => {
  return isLightColor(backgroundColor) ? '#000000' : '#ffffff';
};

export function TextTab({ onAddElement }: TextTabProps) {
  const [customText, setCustomText] = useState('Your text here');
  const [selectedFont, setSelectedFont] = useState(fontFamilies[0].value);
  const [selectedFontWeight, setSelectedFontWeight] = useState('400');
  const [selectedTextTransform, setSelectedTextTransform] = useState('none');
  const [selectedStyle, setSelectedStyle] = useState('normal');
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [fontSize, setFontSize] = useState(18);
  const [textAlign, setTextAlign] = useState('left');
  const [isEditingText, setIsEditingText] = useState(false);
  
  const { selectedElement, removeElement, updateElement, elements } = useCanvas();
  const { trackTextAdded, trackFeatureUsed } = useMarketingTracking();
  
  // Get the selected element object
  const selectedElementObj = selectedElement ? elements.find(el => el.id === selectedElement) : null;
  
  // Check if we have a selected text element
  const isTextSelected = selectedElementObj?.type === 'text';

  const applyTextProperty = (property: string, value: any) => {
    if (isTextSelected && selectedElement) {
      updateElement(selectedElement, { [property]: value });
    }
  };

  const handleQuickAdd = (textType: any) => {
    const element = {
      id: Date.now().toString(),
      type: 'text',
      x: 300,
      y: 200,
      width: 200,
      height: 50,
      content: textType.content,
      fontSize: textType.fontSize,
      fontWeight: textType.fontWeight,
      fontFamily: selectedFont,
      color: selectedColor,
      textAlign: textAlign,
      autoWrap: true,
      autoResize: true,
      textTransform: selectedTextTransform,
      textStyle: selectedStyle,
      opacity: 1,
      rotation: 0
    };
    onAddElement(element);
    
    // Track text addition for marketing analytics
    trackTextAdded({
      content: textType.content,
      fontSize: textType.fontSize,
      fontWeight: textType.fontWeight,
      fontFamily: selectedFont,
      textStyle: selectedStyle,
      textType: textType.name
    });
  };

  const handleCustomTextAdd = () => {
    const element = {
      id: Date.now().toString(),
      type: 'text',
      x: 300,
      y: 200,
      width: 200,
      height: 50,
      content: customText,
      fontSize: fontSize,
      fontWeight: selectedFontWeight,
      fontFamily: selectedFont,
      color: selectedColor,
      textAlign: textAlign,
      autoWrap: true,
      autoResize: true,
      textTransform: selectedTextTransform,
      textStyle: selectedStyle,
      opacity: 1,
      rotation: 0
    };
    onAddElement(element);
    
    // Track custom text addition
    trackTextAdded({
      content: customText,
      fontSize: fontSize,
      fontWeight: selectedFontWeight,
      fontFamily: selectedFont,
      textStyle: selectedStyle,
      textType: 'Custom'
    });
  };

  const handleFontSizeChange = (newSize: number) => {
    setFontSize(newSize);
    applyTextProperty('fontSize', newSize);
  };

  const handleFontWeightChange = (weight: string) => {
    setSelectedFontWeight(weight);
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
    setSelectedStyle(style.value);
    applyTextProperty('textStyle', style.value);
    
    // Track feature usage
    trackFeatureUsed('text-style', {
      style: style.name,
      value: style.value
    });
  };

  const handleTextAlignChange = (alignment: string) => {
    setTextAlign(alignment);
    applyTextProperty('textAlign', alignment);
  };

  const handleTextTransformChange = (transform: string) => {
    setSelectedTextTransform(transform);
    applyTextProperty('textTransform', transform);
  };

  return (
    <div className="p-3 space-y-4">
      {/* Quick Text Types */}
      <div>
        <h3 className="text-xs font-semibold text-white mb-2">Quick Add</h3>
        <div className="grid grid-cols-1 gap-2">
          {quickTextTypes.map((textType) => {
            const Icon = textType.icon;
            return (
              <button
                key={textType.name}
                onClick={() => handleQuickAdd(textType)}
                className="flex items-center space-x-2 p-2 rounded text-left transition-colors hover:bg-gray-700 group"
                style={{ backgroundColor: '#003a63' }}
              >
                <Icon className="w-3.5 h-3.5 text-gray-400 group-hover:text-white" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-white">{textType.name}</div>
                  <div className="text-xs text-gray-400 truncate">{textType.description}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Text Input */}
      <div>
        <h3 className="text-xs font-semibold text-white mb-2">Custom Text</h3>
        <div className="space-y-2">
          <textarea
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="Enter your text..."
            className="w-full p-1 text-xs border rounded resize-none"
            style={{ 
              backgroundColor: '#003a63', 
              borderColor: '#004080',
              color: 'white',
              minHeight: '40px'
            }}
            rows={2}
          />
          <button
            onClick={handleCustomTextAdd}
            className="w-full px-2 py-1 rounded text-xs font-medium text-white transition-colors hover:opacity-80"
            style={{ backgroundColor: '#ff4940' }}
          >
            Add Text
          </button>
        </div>
      </div>

      {/* Font Settings */}
      <div>
        <h3 className="text-xs font-semibold text-white mb-2">Font Settings</h3>
        <div className="space-y-2">
          {/* Font Family */}
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Font Family</label>
            <select
              value={selectedFont}
              onChange={(e) => handleFontFamilyChange(e.target.value)}
              className="w-full p-2 text-xs border rounded"
              style={{ 
                backgroundColor: '#003a63', 
                borderColor: '#004080',
                color: 'white'
              }}
            >
              {fontFamilies.map((font) => (
                <option key={font.value} value={font.value}>
                  {font.name}
                </option>
              ))}
            </select>
          </div>

          {/* Font Size */}
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Font Size</label>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleFontSizeChange(Math.max(8, fontSize - 2))}
                className="p-1 rounded transition-colors"
                style={{ backgroundColor: '#003a63', color: 'white' }}
              >
                <Minus className="w-3 h-3" />
              </button>
              <input
                type="number"
                value={fontSize}
                onChange={(e) => handleFontSizeChange(parseInt(e.target.value) || 18)}
                className="flex-1 p-2 text-xs text-center border rounded"
                style={{ 
                  backgroundColor: '#003a63', 
                  borderColor: '#004080',
                  color: 'white'
                }}
                min="8"
                max="200"
              />
              <button
                onClick={() => handleFontSizeChange(Math.min(200, fontSize + 2))}
                className="p-1 rounded transition-colors"
                style={{ backgroundColor: '#003a63', color: 'white' }}
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Font Weight */}
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Font Weight</label>
            <select
              value={selectedFontWeight}
              onChange={(e) => handleFontWeightChange(e.target.value)}
              className="w-full p-2 text-xs border rounded"
              style={{ 
                backgroundColor: '#003a63', 
                borderColor: '#004080',
                color: 'white'
              }}
            >
              {fontWeights.map((weight) => (
                <option key={weight.value} value={weight.value}>
                  {weight.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Text Alignment section removed - now handled by bottom properties panel */}

      {/* Text Transform */}
      <div>
        <h3 className="text-xs font-semibold text-white mb-2">Text Transform</h3>
        <div className="grid grid-cols-2 gap-1">
          {textTransforms.map((transform) => (
            <button
              key={transform.value}
              onClick={() => handleTextTransformChange(transform.value)}
              className={`p-2 rounded text-xs transition-colors ${
                selectedTextTransform === transform.value ? 'text-white' : 'text-gray-400 hover:text-white'
              }`}
              style={{ 
                backgroundColor: selectedTextTransform === transform.value ? '#ff4940' : '#003a63'
              }}
            >
              {transform.name}
            </button>
          ))}
        </div>
      </div>

      {/* Color section removed - now handled by bottom properties panel */}

      {/* Text Effects */}
      <div>
        <h3 className="text-xs font-semibold text-white mb-2">Text Effects</h3>
        <div className="grid grid-cols-2 gap-1">
          {textStyles.map((style) => (
            <button
              key={style.value}
              onClick={() => handleTextStyleApply(style)}
              className={`p-2 rounded text-xs transition-colors text-left ${
                selectedStyle === style.value ? 'text-white' : 'text-gray-400 hover:text-white'
              }`}
              style={{ 
                backgroundColor: selectedStyle === style.value ? '#ff4940' : '#003a63'
              }}
              title={style.description}
            >
              {style.name}
            </button>
          ))}
        </div>
      </div>

      {/* Delete Text Button */}
      {isTextSelected && selectedElementObj && (
        <div>
          <button
            onClick={() => {
              if (selectedElementObj) {
                removeElement(selectedElementObj.id);
              }
            }}
            className="w-full px-3 py-2 rounded text-xs font-medium text-white transition-colors hover:opacity-80"
            style={{ backgroundColor: '#ef4444' }}
          >
            Delete Text
          </button>
        </div>
      )}
    </div>
  );
} 