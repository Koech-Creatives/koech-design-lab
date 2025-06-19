import React, { useState, useRef } from 'react';
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
  ChevronRight,
  X,
  Upload,
  FileImage
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

// Sample elements for each category (2 rows display)
const categoryElements = {
  icons: [
    { name: 'Star', icon: Star, type: 'icon' },
    { name: 'Heart', icon: Heart, type: 'icon' },
    { name: 'Share', icon: Share, type: 'icon' },
    { name: 'Arrow', icon: ArrowRight, type: 'icon' },
    { name: 'Message', icon: MessageCircle, type: 'icon' },
    { name: 'External', icon: ExternalLink, type: 'icon' },
    { name: 'Send', icon: Send, type: 'icon' },
    { name: 'Search', icon: Search, type: 'icon' }
  ],
  shapes: [
    { name: 'Rectangle', icon: Square, type: 'rectangle' },
    { name: 'Circle', icon: '●', type: 'circle' },
    { name: 'Triangle', icon: '▲', type: 'triangle' },
    { name: 'Diamond', icon: '◆', type: 'diamond' },
    { name: 'Star', icon: '★', type: 'star' },
    { name: 'Heart', icon: '♥', type: 'heart' },
    { name: 'Arrow', icon: '→', type: 'arrow' },
    { name: 'Line', icon: '─', type: 'line' }
  ],
  emojis: [
    { emoji: '😀', name: 'Grinning Face' },
    { emoji: '❤️', name: 'Red Heart' },
    { emoji: '👍', name: 'Thumbs Up' },
    { emoji: '🎉', name: 'Party Popper' },
    { emoji: '🔥', name: 'Fire' },
    { emoji: '⭐', name: 'Star' },
    { emoji: '💡', name: 'Light Bulb' },
    { emoji: '🚀', name: 'Rocket' }
  ],
  stockImages: [
    { name: 'Business', preview: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop' },
    { name: 'Nature', preview: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=100&h=100&fit=crop' },
    { name: 'Technology', preview: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=100&h=100&fit=crop' },
    { name: 'Food', preview: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=100&h=100&fit=crop' },
    { name: 'Travel', preview: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=100&h=100&fit=crop' },
    { name: 'Fashion', preview: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=100&h=100&fit=crop' },
    { name: 'Sports', preview: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=100&h=100&fit=crop' },
    { name: 'Abstract', preview: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=100&h=100&fit=crop' }
  ],
  ctaElements: [
    { name: 'Subscribe', icon: '📧', type: 'cta' },
    { name: 'Buy Now', icon: '🛒', type: 'cta' },
    { name: 'Learn More', icon: '📚', type: 'cta' },
    { name: 'Contact', icon: '📞', type: 'cta' },
    { name: 'Follow', icon: '👥', type: 'cta' },
    { name: 'Download', icon: '⬇️', type: 'cta' },
    { name: 'Sign Up', icon: '✍️', type: 'cta' },
    { name: 'Watch', icon: '▶️', type: 'cta' }
  ]
};

// Extended 3D emoji collection for the popup
const all3DEmojis = [
  { emoji: '😀', name: 'Grinning Face' },
  { emoji: '😃', name: 'Grinning Face with Big Eyes' },
  { emoji: '😄', name: 'Grinning Face with Smiling Eyes' },
  { emoji: '😁', name: 'Beaming Face with Smiling Eyes' },
  { emoji: '😊', name: 'Smiling Face with Smiling Eyes' },
  { emoji: '😇', name: 'Smiling Face with Halo' },
  { emoji: '🙂', name: 'Slightly Smiling Face' },
  { emoji: '🙃', name: 'Upside-Down Face' },
  { emoji: '😉', name: 'Winking Face' },
  { emoji: '😌', name: 'Relieved Face' },
  { emoji: '😍', name: 'Smiling Face with Heart-Eyes' },
  { emoji: '🥰', name: 'Smiling Face with Hearts' },
  { emoji: '😘', name: 'Face Blowing a Kiss' },
  { emoji: '😗', name: 'Kissing Face' },
  { emoji: '😙', name: 'Kissing Face with Smiling Eyes' },
  { emoji: '😚', name: 'Kissing Face with Closed Eyes' },
  { emoji: '🤗', name: 'Hugging Face' },
  { emoji: '🤩', name: 'Star-Struck' },
  { emoji: '🤔', name: 'Thinking Face' },
  { emoji: '🤨', name: 'Face with Raised Eyebrow' },
  { emoji: '😐', name: 'Neutral Face' },
  { emoji: '😑', name: 'Expressionless Face' },
  { emoji: '😶', name: 'Face Without Mouth' },
  { emoji: '😏', name: 'Smirking Face' },
  { emoji: '😒', name: 'Unamused Face' },
  { emoji: '🙄', name: 'Face with Rolling Eyes' },
  { emoji: '😬', name: 'Grimacing Face' },
  { emoji: '🤥', name: 'Lying Face' },
  { emoji: '😔', name: 'Pensive Face' },
  { emoji: '😪', name: 'Sleepy Face' },
  { emoji: '🤤', name: 'Drooling Face' },
  { emoji: '😴', name: 'Sleeping Face' },
  { emoji: '😷', name: 'Face with Medical Mask' },
  { emoji: '🤒', name: 'Face with Thermometer' },
  { emoji: '🤕', name: 'Face with Head-Bandage' },
  { emoji: '🤢', name: 'Nauseated Face' },
  { emoji: '🤮', name: 'Face Vomiting' },
  { emoji: '🤧', name: 'Sneezing Face' },
  { emoji: '🥵', name: 'Hot Face' },
  { emoji: '🥶', name: 'Cold Face' },
  { emoji: '🥴', name: 'Woozy Face' },
  { emoji: '😵', name: 'Dizzy Face' },
  { emoji: '🤯', name: 'Exploding Head' },
  { emoji: '🤠', name: 'Cowboy Hat Face' },
  { emoji: '🥳', name: 'Partying Face' },
  { emoji: '😎', name: 'Smiling Face with Sunglasses' },
  { emoji: '🤓', name: 'Nerd Face' },
  { emoji: '🧐', name: 'Face with Monocle' },
  { emoji: '😕', name: 'Confused Face' },
  { emoji: '😟', name: 'Worried Face' },
  { emoji: '🙁', name: 'Slightly Frowning Face' },
  { emoji: '☹️', name: 'Frowning Face' },
  { emoji: '😮', name: 'Face with Open Mouth' },
  { emoji: '😯', name: 'Hushed Face' },
  { emoji: '😲', name: 'Astonished Face' },
  { emoji: '😳', name: 'Flushed Face' },
  { emoji: '🥺', name: 'Pleading Face' },
  { emoji: '😦', name: 'Frowning Face with Open Mouth' },
  { emoji: '😧', name: 'Anguished Face' },
  { emoji: '😨', name: 'Fearful Face' },
  { emoji: '😰', name: 'Anxious Face with Sweat' },
  { emoji: '😥', name: 'Sad but Relieved Face' },
  { emoji: '😢', name: 'Crying Face' },
  { emoji: '😭', name: 'Loudly Crying Face' },
  { emoji: '😱', name: 'Face Screaming in Fear' },
  { emoji: '😖', name: 'Confounded Face' },
  { emoji: '😣', name: 'Persevering Face' },
  { emoji: '😞', name: 'Disappointed Face' },
  { emoji: '😓', name: 'Downcast Face with Sweat' },
  { emoji: '😩', name: 'Weary Face' },
  { emoji: '😫', name: 'Tired Face' },
  { emoji: '🥱', name: 'Yawning Face' },
  { emoji: '😤', name: 'Face with Steam From Nose' },
  { emoji: '😡', name: 'Pouting Face' },
  { emoji: '😠', name: 'Angry Face' },
  { emoji: '🤬', name: 'Face with Symbols on Mouth' },
  { emoji: '😈', name: 'Smiling Face with Horns' },
  { emoji: '👿', name: 'Angry Face with Horns' },
  { emoji: '💀', name: 'Skull' },
  { emoji: '☠️', name: 'Skull and Crossbones' },
  { emoji: '💩', name: 'Pile of Poo' },
  { emoji: '🤡', name: 'Clown Face' },
  { emoji: '👹', name: 'Ogre' },
  { emoji: '👺', name: 'Goblin' },
  { emoji: '👻', name: 'Ghost' },
  { emoji: '👽', name: 'Alien' },
  { emoji: '👾', name: 'Alien Monster' },
  { emoji: '🤖', name: 'Robot' },
  { emoji: '😺', name: 'Grinning Cat' },
  { emoji: '😸', name: 'Grinning Cat with Smiling Eyes' },
  { emoji: '😹', name: 'Cat with Tears of Joy' },
  { emoji: '😻', name: 'Smiling Cat with Heart-Eyes' },
  { emoji: '😼', name: 'Cat with Wry Smile' },
  { emoji: '😽', name: 'Kissing Cat' },
  { emoji: '🙀', name: 'Weary Cat' },
  { emoji: '😿', name: 'Crying Cat' },
  { emoji: '😾', name: 'Pouting Cat' },
  { emoji: '❤️', name: 'Red Heart' },
  { emoji: '🧡', name: 'Orange Heart' },
  { emoji: '💛', name: 'Yellow Heart' },
  { emoji: '💚', name: 'Green Heart' },
  { emoji: '💙', name: 'Blue Heart' },
  { emoji: '💜', name: 'Purple Heart' },
  { emoji: '🖤', name: 'Black Heart' },
  { emoji: '🤍', name: 'White Heart' },
  { emoji: '🤎', name: 'Brown Heart' },
  { emoji: '💔', name: 'Broken Heart' },
  { emoji: '❣️', name: 'Heart Exclamation' },
  { emoji: '💕', name: 'Two Hearts' },
  { emoji: '💞', name: 'Revolving Hearts' },
  { emoji: '💓', name: 'Beating Heart' },
  { emoji: '💗', name: 'Growing Heart' },
  { emoji: '💖', name: 'Sparkling Heart' },
  { emoji: '💘', name: 'Heart with Arrow' },
  { emoji: '💝', name: 'Heart with Ribbon' }
];

// 3D Emoji Modal Component
function EmojiModal({ isOpen, onClose, onSelectEmoji }: {
  isOpen: boolean;
  onClose: () => void;
  onSelectEmoji: (emoji: any) => void;
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEmojis = all3DEmojis.filter(emoji =>
    emoji.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emoji.emoji.includes(searchTerm)
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg p-4 w-96 max-h-96 overflow-hidden flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-white">3D Emojis</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="relative mb-3">
          <Search className="absolute left-2 top-2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search emojis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-xs border rounded"
            style={{
              backgroundColor: '#003a63',
              borderColor: '#004080',
              color: 'white'
            }}
          />
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-6 gap-2">
            {filteredEmojis.map((emoji) => (
              <button
                key={emoji.name}
                onClick={() => {
                  onSelectEmoji(emoji);
                  onClose();
                }}
                className="p-2 rounded text-center transition-colors hover:bg-gray-700"
                style={{ backgroundColor: '#003a63' }}
                title={emoji.name}
              >
                <span className="text-lg">{emoji.emoji}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ElementsPanel({ onAddElement }: ElementsPanelProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showEmojiModal, setShowEmojiModal] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const svgInputRef = useRef<HTMLInputElement>(null);

  const handleElementAdd = (elementData: any) => {
    if (onAddElement) {
      const baseElement = {
        id: Date.now().toString(),
        x: 400, // Center position
        y: 300, 
        width: 200,
        height: 100,
        ...elementData
      };
      onAddElement(baseElement);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const imageUrl = URL.createObjectURL(file);
      handleElementAdd({
        type: 'image',
        src: imageUrl,
        width: 300,
        height: 200,
        alt: file.name
      });
      
      // Show success notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-20 right-6 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      notification.textContent = 'Image added to canvas!';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        if (notification.parentNode) {
          document.body.removeChild(notification);
        }
      }, 3000);
    }
    // Reset the input
    if (event.target) {
      event.target.value = '';
    }
  };

  const handleSvgUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const svgContent = e.target?.result as string;
        handleElementAdd({
          type: 'svg',
          content: svgContent,
          width: 150,
          height: 150,
          alt: file.name
        });
        
        // Show success notification
        const notification = document.createElement('div');
        notification.className = 'fixed top-20 right-6 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50';
        notification.textContent = 'SVG added to canvas!';
        document.body.appendChild(notification);
        
        setTimeout(() => {
          if (notification.parentNode) {
            document.body.removeChild(notification);
          }
        }, 3000);
      };
      reader.readAsText(file);
    }
    // Reset the input
    if (event.target) {
      event.target.value = '';
    }
  };

  const handleEmojiSelect = (emoji: any) => {
    handleElementAdd({
      type: 'text',
      content: emoji.emoji,
      fontSize: 48,
      width: 60,
      height: 60,
      color: '#000000',
      fontFamily: 'system-ui',
      textAlign: 'center'
    });
  };

  return (
    <div className="p-3 space-y-4">
      {/* File Upload Section */}
      <div className="space-y-2">
        <h3 className="text-xs font-semibold text-white mb-2 flex items-center">
          <Upload className="w-3.5 h-3.5 mr-1.5" />
          Add Files
        </h3>
        
        <div className="grid grid-cols-2 gap-2">
          {/* Upload Image Button */}
          <label className="block">
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <button
              onClick={() => imageInputRef.current?.click()}
              className="w-full p-3 rounded-lg text-white transition-all duration-200 hover:opacity-90 flex flex-col items-center space-y-1"
              style={{ backgroundColor: '#ff4940' }}
            >
              <FileImage className="w-5 h-5" />
              <span className="text-xs font-medium">Add Image</span>
              <span className="text-xs opacity-75">JPG, PNG, GIF</span>
            </button>
          </label>
          
          {/* Upload SVG Button */}
          <label className="block">
            <input
              ref={svgInputRef}
              type="file"
              accept=".svg,image/svg+xml"
              onChange={handleSvgUpload}
              className="hidden"
            />
            <button
              onClick={() => svgInputRef.current?.click()}
              className="w-full p-3 rounded-lg text-white transition-all duration-200 hover:opacity-90 flex flex-col items-center space-y-1"
              style={{ backgroundColor: '#6366f1' }}
            >
              <Star className="w-5 h-5" />
              <span className="text-xs font-medium">Add SVG</span>
              <span className="text-xs opacity-75">Vector files</span>
            </button>
          </label>
        </div>
        
        <div className="text-xs text-gray-400 text-center mt-2">
          💡 Drag & drop files directly onto the canvas
        </div>
      </div>

      {/* Categories with 2-row displays */}
      <div className="space-y-4">
        {/* Icons */}
        <div>
          <h3 className="text-xs font-semibold text-white mb-2 flex items-center">
            <Star className="w-3.5 h-3.5 mr-1.5" />
            Icons
          </h3>
          <div className="grid grid-cols-4 gap-1">
            {categoryElements.icons.map((icon, index) => {
              const IconComponent = icon.icon;
              return (
                <button
                  key={icon.name}
                  onClick={() => handleElementAdd({
                    type: 'icon',
                    iconName: icon.name,
                    width: 60,
                    height: 60,
                    color: '#000000'
                  })}
                  className="p-2 rounded text-center transition-colors hover:bg-gray-700"
                  style={{ backgroundColor: '#003a63' }}
                  title={icon.name}
                >
                  <IconComponent className="w-4 h-4 mx-auto text-gray-300" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Shapes */}
        <div>
          <h3 className="text-xs font-semibold text-white mb-2 flex items-center">
            <ShapesIcon className="w-3.5 h-3.5 mr-1.5" />
            Shapes
          </h3>
          <div className="grid grid-cols-4 gap-1">
            {categoryElements.shapes.map((shape) => (
              <button
                key={shape.name}
                onClick={() => handleElementAdd({
                  type: shape.type,
                  width: 100,
                  height: 100,
                  backgroundColor: '#000000'
                })}
                className="p-2 rounded text-center transition-colors hover:bg-gray-700"
                style={{ backgroundColor: '#003a63' }}
                title={shape.name}
              >
                {typeof shape.icon === 'string' ? (
                  <span className="text-gray-300">{shape.icon}</span>
                ) : (
                  <shape.icon className="w-4 h-4 mx-auto text-gray-300" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 3D Emojis */}
        <div>
          <h3 className="text-xs font-semibold text-white mb-2 flex items-center">
            <Smile className="w-3.5 h-3.5 mr-1.5" />
            3D Emojis
          </h3>
          <div className="grid grid-cols-4 gap-1 mb-2">
            {categoryElements.emojis.map((emoji) => (
              <button
                key={emoji.name}
                onClick={() => handleEmojiSelect(emoji)}
                className="p-2 rounded text-center transition-colors hover:bg-gray-700"
                style={{ backgroundColor: '#003a63' }}
                title={emoji.name}
              >
                <span className="text-lg">{emoji.emoji}</span>
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowEmojiModal(true)}
            className="w-full px-3 py-2 rounded text-xs font-medium text-white transition-colors hover:opacity-80"
            style={{ backgroundColor: '#ff4940' }}
          >
            View All Emojis
          </button>
        </div>

        {/* Stock Images */}
        <div>
          <h3 className="text-xs font-semibold text-white mb-2 flex items-center">
            <Camera className="w-3.5 h-3.5 mr-1.5" />
            Stock Images
          </h3>
          <div className="grid grid-cols-4 gap-1">
            {categoryElements.stockImages.map((category) => (
              <button
                key={category.name}
                onClick={() => handleElementAdd({
                  type: 'image',
                  src: category.preview,
                  width: 200,
                  height: 150
                })}
                className="p-2 rounded text-center transition-colors hover:bg-gray-700 overflow-hidden"
                style={{ backgroundColor: '#003a63' }}
                title={category.name}
              >
                <img 
                  src={category.preview} 
                  alt={category.name}
                  className="w-6 h-6 mx-auto rounded object-cover"
                />
                <div className="text-xs text-gray-300 mt-1 truncate">{category.name}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3D Emoji Modal */}
      <EmojiModal 
        isOpen={showEmojiModal}
        onClose={() => setShowEmojiModal(false)}
        onSelectEmoji={handleEmojiSelect}
      />
    </div>
  );
}