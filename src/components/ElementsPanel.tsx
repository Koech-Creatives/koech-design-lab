import React, { useState } from 'react';
import { 
  Type, 
  Image, 
  Square, 
  Sparkles,
  Shapes as ShapesIcon,
  Palette,
  Plus,
  Zap,
  Heart,
  Star,
  Search,
  MousePointer,
  Smile,
  Camera,
  ArrowRight,
  Share,
  MessageCircle,
  ExternalLink,
  Send,
  ChevronRight
} from 'lucide-react';
import { IconLibrary } from './IconLibrary';
import { ShapesLibrary } from './ShapesLibrary';

interface ElementsPanelProps {
  onAddElement: (element: any) => void;
  selectedColor: string;
}

// Brand colors
const brandColors = [
  '#6366f1', // Indigo
  '#8b5cf6', // Purple
  '#ec4899', // Pink
  '#f59e0b', // Amber
  '#10b981', // Emerald
  '#3b82f6', // Blue
  '#ef4444', // Red
  '#6b7280', // Gray
  '#1f2937', // Dark Gray
  '#000000', // Black
];

// Quick add elements
const quickElements = [
  {
    name: 'Headline',
    icon: Type,
    description: 'Add a title or heading',
    action: 'text',
    popular: true
  },
  {
    name: 'Image',
    icon: Image,
    description: 'Upload or add an image',
    action: 'image',
    popular: true
  },
  {
    name: 'Button',
    icon: Square,
    description: 'Interactive button element',
    action: 'button',
    popular: true
  },
  {
    name: 'Text',
    icon: Type,
    description: 'Simple text element',
    action: 'text',
    popular: false
  }
];

// 3D Emojis
const emojis3D = [
  { emoji: '😀', name: 'Happy Face', category: 'emotions' },
  { emoji: '😍', name: 'Heart Eyes', category: 'emotions' },
  { emoji: '🤔', name: 'Thinking', category: 'emotions' },
  { emoji: '😎', name: 'Cool', category: 'emotions' },
  { emoji: '🥳', name: 'Party', category: 'emotions' },
  { emoji: '😴', name: 'Sleeping', category: 'emotions' },
  { emoji: '🔥', name: 'Fire', category: 'objects' },
  { emoji: '💎', name: 'Diamond', category: 'objects' },
  { emoji: '⭐', name: 'Star', category: 'objects' },
  { emoji: '🎯', name: 'Target', category: 'objects' },
  { emoji: '🚀', name: 'Rocket', category: 'objects' },
  { emoji: '💡', name: 'Bulb', category: 'objects' },
  { emoji: '🎨', name: 'Art', category: 'creative' },
  { emoji: '🎵', name: 'Music', category: 'creative' },
  { emoji: '📱', name: 'Phone', category: 'tech' },
  { emoji: '💻', name: 'Laptop', category: 'tech' },
  { emoji: '🌟', name: 'Glowing Star', category: 'objects' },
  { emoji: '💰', name: 'Money', category: 'business' },
  { emoji: '📈', name: 'Chart Up', category: 'business' },
  { emoji: '🎁', name: 'Gift', category: 'objects' }
];

// Stock Images Categories
const stockImageCategories = [
  { name: 'Business', icon: '💼', count: 150 },
  { name: 'Technology', icon: '💻', count: 120 },
  { name: 'People', icon: '👥', count: 200 },
  { name: 'Nature', icon: '🌿', count: 180 },
  { name: 'Abstract', icon: '🎨', count: 90 },
  { name: 'Food', icon: '🍕', count: 75 },
  { name: 'Travel', icon: '✈️', count: 110 },
  { name: 'Lifestyle', icon: '🏠', count: 85 }
];

// CTA Elements
const ctaElements = [
  { name: 'Arrow Right', icon: ArrowRight, type: 'arrow-right', category: 'arrows' },
  { name: 'Arrow Up', icon: '↗️', type: 'arrow-up', category: 'arrows' },
  { name: 'Arrow Down', icon: '↘️', type: 'arrow-down', category: 'arrows' },
  { name: 'Curved Arrow', icon: '↪️', type: 'arrow-curved', category: 'arrows' },
  { name: 'Share', icon: Share, type: 'share', category: 'social' },
  { name: 'Like', icon: Heart, type: 'like', category: 'social' },
  { name: 'Comment', icon: MessageCircle, type: 'comment', category: 'social' },
  { name: 'Visit Website', icon: ExternalLink, type: 'visit', category: 'actions' },
  { name: 'DM', icon: Send, type: 'dm', category: 'actions' },
  { name: 'Swipe', icon: ChevronRight, type: 'swipe', category: 'actions' },
  { name: 'Tap Here', icon: MousePointer, type: 'tap', category: 'actions' },
  { name: 'Click Me', icon: '👆', type: 'click', category: 'actions' }
];

export function ElementsPanel({ onAddElement, selectedColor }: ElementsPanelProps) {
  const [showIconLibrary, setShowIconLibrary] = useState(false);
  const [showShapesLibrary, setShowShapesLibrary] = useState(false);
  const [show3DEmojis, setShow3DEmojis] = useState(false);
  const [showStockImages, setShowStockImages] = useState(false);
  const [showCTAElements, setShowCTAElements] = useState(false);
  const [currentColor, setCurrentColor] = useState(selectedColor || brandColors[0]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleQuickAdd = (elementType: string) => {
    const baseElement = {
      id: Date.now().toString(),
      x: 400, // Center position
      y: 300, 
      width: 200,
      height: 100,
      color: currentColor,
      backgroundColor: currentColor,
      borderColor: currentColor,
    };

    switch (elementType) {
      case 'text':
        onAddElement({
          ...baseElement,
          type: 'text',
          content: 'Your text here',
          fontSize: 18,
          fontWeight: 'normal',
          textAlign: 'center',
          color: '#000000',
          fontFamily: 'Gilmer, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
          autoWrap: true,
          height: 40,
        });
        break;
      case 'image':
        onAddElement({
          ...baseElement,
          type: 'image',
          src: 'https://placehold.co/600x400?text=Image+Here',
          alt: 'Placeholder image',
        });
        break;
      case 'button':
        onAddElement({
          ...baseElement,
          type: 'button',
          content: 'Click me',
          fontSize: 16,
          fontWeight: 'medium',
          textAlign: 'center',
          borderRadius: 8,
          padding: 12,
          height: 48,
        });
        break;
      default:
        break;
    }
  };

  const handleIconSelect = (icon: any) => {
    onAddElement({
      id: Date.now().toString(),
      type: 'icon',
      x: 400,
      y: 300,
      width: 60,
      height: 60,
      color: currentColor,
      content: icon.content,
      name: icon.name,
    });
    setShowIconLibrary(false);
  };

  const handleShapeSelect = (shape: any) => {
    const baseElement = {
      id: Date.now().toString(),
      x: 400,
      y: 300,
      width: 120,
      height: 120,
      color: currentColor,
      backgroundColor: currentColor,
      borderColor: currentColor,
    };

    onAddElement({
      ...baseElement,
      type: shape.type,
      name: shape.name,
      path: shape.path,
    });
    setShowShapesLibrary(false);
  };

  return (
    <div className="w-80 bg-gray-900 border-l border-gray-700 p-6 overflow-y-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white mb-2">Elements</h2>
        <p className="text-sm text-gray-400">Add elements to your design</p>
      </div>

      {/* Quick Add Section */}
      <div className="mb-8">
        <h3 className="text-sm font-medium text-white mb-4 flex items-center">
          <Zap className="w-4 h-4 mr-2 text-yellow-400" />
          Quick Add
        </h3>
      <div className="grid grid-cols-2 gap-3">
          {quickElements.map((element) => {
          const Icon = element.icon;
          return (
              <button
                key={element.name}
                onClick={() => handleQuickAdd(element.action)}
                className="relative p-4 bg-gray-800 rounded-lg border border-gray-600 hover:border-indigo-500 hover:bg-gray-700 transition-all duration-200 group text-left"
                title={element.description}
              >
                {element.popular && (
                  <div className="absolute top-2 right-2 w-2 h-2 bg-yellow-400 rounded-full"></div>
                )}
                <Icon className="w-6 h-6 text-indigo-400 mb-2" />
                <div className="text-sm font-medium text-white group-hover:text-indigo-300">
                {element.name}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {element.description}
            </div>
              </button>
          );
        })}
        </div>
      </div>
      
      {/* Icons Library */}
      <div className="mb-8">
        <h3 className="text-sm font-medium text-white mb-4 flex items-center">
          <Sparkles className="w-4 h-4 mr-2 text-purple-400" />
          Icons Library
        </h3>
                  <button
          onClick={() => setShowIconLibrary(true)}
          className="w-full p-6 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg border border-purple-500 hover:from-purple-500 hover:to-indigo-500 transition-all duration-200 group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <Heart className="w-6 h-6 text-white" />
              <Star className="w-5 h-5 text-yellow-300" />
              <Sparkles className="w-4 h-4 text-pink-300" />
            </div>
            <span className="text-xs bg-white bg-opacity-20 text-white px-2 py-1 rounded-full">
              50+ Icons
            </span>
          </div>
          <div className="text-left">
            <div className="text-lg font-semibold text-white mb-1">
              Professional Icons
                </div>
            <div className="text-sm text-purple-100">
              Search, browse, and add icons instantly
            </div>
          </div>
          <div className="mt-3 text-xs text-purple-200 flex items-center">
            <Plus className="w-3 h-3 mr-1" />
           With categories, search & more
          </div>
        </button>
      </div>

      {/* Shapes Library */}
      <div className="mb-8">
        <h3 className="text-sm font-medium text-white mb-4 flex items-center">
          <ShapesIcon className="w-4 h-4 mr-2 text-blue-400" />
          Shapes Library
        </h3>
                <button
          onClick={() => setShowShapesLibrary(true)}
          className="w-full p-6 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg border border-blue-500 hover:from-blue-500 hover:to-cyan-500 transition-all duration-200 group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-white rounded-full"></div>
              <div className="w-4 h-4 bg-white" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}></div>
              <div className="w-4 h-4 bg-white" style={{ transform: 'rotate(45deg)' }}></div>
            </div>
            <span className="text-xs bg-white bg-opacity-20 text-white px-2 py-1 rounded-full">
              30+ Shapes
            </span>
          </div>
          <div className="text-left">
            <div className="text-lg font-semibold text-white mb-1">
              Geometric Shapes
            </div>
            <div className="text-sm text-blue-100">
              Basic to advanced shapes for any design
            </div>
              </div>
          <div className="mt-3 text-xs text-blue-200 flex items-center">
            <Plus className="w-3 h-3 mr-1" />
            Arrows, decorative, business & more
          </div>
        </button>
      </div>

      {/* Color Selector */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-white mb-4 flex items-center">
          <Palette className="w-4 h-4 mr-2 text-green-400" />
          Brand Colors
        </h3>
        <div className="grid grid-cols-5 gap-2">
          {brandColors.map((color) => (
            <button
              key={color}
              onClick={() => setCurrentColor(color)}
              className={`w-10 h-10 rounded-lg border-2 transition-all duration-200 ${
                currentColor === color 
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
              style={{ backgroundColor: currentColor }}
            />
            <span className="text-sm text-white font-mono">{currentColor}</span>
          </div>
        </div>
      </div>

      {/* Usage Tips */}
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <h4 className="text-sm font-medium text-white mb-2">💡 Quick Tips</h4>
        <ul className="text-xs text-gray-400 space-y-1">
          <li>• All elements use your selected color</li>
          <li>• Click to add, drag to position</li>
          <li>• Use Quick Add for common elements</li>
          <li>• Browse libraries for more options</li>
        </ul>
      </div>

      {/* Icon Library Modal */}
      <IconLibrary 
        isOpen={showIconLibrary}
        onClose={() => setShowIconLibrary(false)}
        onSelectIcon={handleIconSelect}
        selectedColor={currentColor}
      />

      {/* Shapes Library Modal */}
      <ShapesLibrary 
        isOpen={showShapesLibrary}
        onClose={() => setShowShapesLibrary(false)}
        onSelectShape={handleShapeSelect}
        selectedColor={currentColor}
      />
    </div>
  );
}