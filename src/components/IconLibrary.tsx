import React, { useState } from 'react';
import { 
  Heart, Star, Sparkles, Quote, Crown, Award, Shield, Zap,
  ArrowRight, ArrowLeft, ArrowUp, ArrowDown, ChevronRight, ChevronLeft,
  MessageCircle, Users, User, Eye, Mail, Phone, MapPin, Calendar, Clock,
  Play, Pause, Volume2, Search, Settings, X, Filter, Grid,
  Smile, Coffee, Camera, Gift, Home, Car, Plane, Music,
  Book, Lightbulb, Target, Rocket, Flame, Snowflake, Sun, Moon,
  Wifi, Battery, Signal, Bluetooth, Lock, Unlock, Key, Bell
} from 'lucide-react';

interface IconDefinition {
  name: string;
  icon: React.ComponentType<any>;
  content: string;
  category: string;
  tags: string[];
  popular?: boolean;
}

interface IconLibraryProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectIcon: (icon: IconDefinition) => void;
  selectedColor: string;
}

// Comprehensive icon library
const iconLibrary: IconDefinition[] = [
  // POPULAR ICONS (Most commonly used)
  { name: 'Heart', icon: Heart, content: 'heart', category: 'popular', tags: ['love', 'like', 'favorite'], popular: true },
  { name: 'Star', icon: Star, content: 'star', category: 'popular', tags: ['favorite', 'rating', 'quality'], popular: true },
  { name: 'Arrow Right', icon: ArrowRight, content: 'arrow-right', category: 'popular', tags: ['next', 'forward', 'continue'], popular: true },
  { name: 'Play', icon: Play, content: 'play', category: 'popular', tags: ['video', 'start', 'media'], popular: true },
  { name: 'Search', icon: Search, content: 'search', category: 'popular', tags: ['find', 'look', 'explore'], popular: true },
  { name: 'User', icon: User, content: 'user', category: 'popular', tags: ['person', 'profile', 'account'], popular: true },

  // EMOTIONS & EXPRESSIONS
  { name: 'Smile', icon: Smile, content: 'smile', category: 'emotions', tags: ['happy', 'face', 'emoji'] },
  { name: 'Heart', icon: Heart, content: 'heart', category: 'emotions', tags: ['love', 'emotion', 'feeling'] },
  { name: 'Sparkles', icon: Sparkles, content: 'sparkles', category: 'emotions', tags: ['magic', 'special', 'shine'] },
  { name: 'Fire', icon: Flame, content: 'flame', category: 'emotions', tags: ['hot', 'trending', 'energy'] },

  // BUSINESS & PROFESSIONAL
  { name: 'Mail', icon: Mail, content: 'mail', category: 'business', tags: ['email', 'contact', 'message'] },
  { name: 'Phone', icon: Phone, content: 'phone', category: 'business', tags: ['call', 'contact', 'mobile'] },
  { name: 'Calendar', icon: Calendar, content: 'calendar', category: 'business', tags: ['date', 'schedule', 'time'] },
  { name: 'Clock', icon: Clock, content: 'clock', category: 'business', tags: ['time', 'schedule', 'deadline'] },
  { name: 'Target', icon: Target, content: 'target', category: 'business', tags: ['goal', 'objective', 'aim'] },
  { name: 'Award', icon: Award, content: 'award', category: 'business', tags: ['achievement', 'success', 'winner'] },
  { name: 'Shield', icon: Shield, content: 'shield', category: 'business', tags: ['security', 'protection', 'safe'] },
  { name: 'Settings', icon: Settings, content: 'settings', category: 'business', tags: ['configure', 'options', 'gear'] },

  // NAVIGATION & ARROWS
  { name: 'Arrow Up', icon: ArrowUp, content: 'arrow-up', category: 'navigation', tags: ['up', 'increase', 'top'] },
  { name: 'Arrow Down', icon: ArrowDown, content: 'arrow-down', category: 'navigation', tags: ['down', 'decrease', 'bottom'] },
  { name: 'Arrow Left', icon: ArrowLeft, content: 'arrow-left', category: 'navigation', tags: ['back', 'previous', 'left'] },
  { name: 'Chevron Right', icon: ChevronRight, content: 'chevron-right', category: 'navigation', tags: ['next', 'expand', 'more'] },
  { name: 'Chevron Left', icon: ChevronLeft, content: 'chevron-left', category: 'navigation', tags: ['back', 'collapse', 'less'] },

  // SOCIAL & COMMUNICATION
  { name: 'Users', icon: Users, content: 'users', category: 'social', tags: ['team', 'group', 'people'] },
  { name: 'Message Circle', icon: MessageCircle, content: 'message-circle', category: 'social', tags: ['chat', 'comment', 'talk'] },
  { name: 'Eye', icon: Eye, content: 'eye', category: 'social', tags: ['view', 'see', 'watch'] },
  { name: 'Bell', icon: Bell, content: 'bell', category: 'social', tags: ['notification', 'alert', 'ring'] },

  // MEDIA & ENTERTAINMENT
  { name: 'Pause', icon: Pause, content: 'pause', category: 'media', tags: ['stop', 'break', 'halt'] },
  { name: 'Volume', icon: Volume2, content: 'volume-2', category: 'media', tags: ['sound', 'audio', 'speaker'] },
  { name: 'Camera', icon: Camera, content: 'camera', category: 'media', tags: ['photo', 'picture', 'snapshot'] },
  { name: 'Music', icon: Music, content: 'music', category: 'media', tags: ['song', 'audio', 'sound'] },

  // LIFESTYLE & OBJECTS
  { name: 'Home', icon: Home, content: 'home', category: 'lifestyle', tags: ['house', 'building', 'residence'] },
  { name: 'Coffee', icon: Coffee, content: 'coffee', category: 'lifestyle', tags: ['drink', 'cafe', 'beverage'] },
  { name: 'Gift', icon: Gift, content: 'gift', category: 'lifestyle', tags: ['present', 'box', 'surprise'] },
  { name: 'Car', icon: Car, content: 'car', category: 'lifestyle', tags: ['vehicle', 'transport', 'drive'] },
  { name: 'Plane', icon: Plane, content: 'plane', category: 'lifestyle', tags: ['travel', 'flight', 'trip'] },
  { name: 'Book', icon: Book, content: 'book', category: 'lifestyle', tags: ['read', 'education', 'learn'] },
  { name: 'Map Pin', icon: MapPin, content: 'map-pin', category: 'lifestyle', tags: ['location', 'place', 'address'] },

  // NATURE & WEATHER
  { name: 'Sun', icon: Sun, content: 'sun', category: 'nature', tags: ['sunny', 'bright', 'day'] },
  { name: 'Moon', icon: Moon, content: 'moon', category: 'nature', tags: ['night', 'dark', 'lunar'] },
  { name: 'Snowflake', icon: Snowflake, content: 'snowflake', category: 'nature', tags: ['cold', 'winter', 'snow'] },

  // TECHNOLOGY
  { name: 'Wifi', icon: Wifi, content: 'wifi', category: 'technology', tags: ['internet', 'connection', 'network'] },
  { name: 'Battery', icon: Battery, content: 'battery', category: 'technology', tags: ['power', 'energy', 'charge'] },
  { name: 'Signal', icon: Signal, content: 'signal', category: 'technology', tags: ['connection', 'strength', 'bars'] },
  { name: 'Bluetooth', icon: Bluetooth, content: 'bluetooth', category: 'technology', tags: ['wireless', 'connect', 'pair'] },

  // SECURITY & ACCESS
  { name: 'Lock', icon: Lock, content: 'lock', category: 'security', tags: ['secure', 'protected', 'private'] },
  { name: 'Unlock', icon: Unlock, content: 'unlock', category: 'security', tags: ['open', 'access', 'free'] },
  { name: 'Key', icon: Key, content: 'key', category: 'security', tags: ['access', 'password', 'entry'] },

  // CREATIVE & INSPIRATION
  { name: 'Lightbulb', icon: Lightbulb, content: 'lightbulb', category: 'creative', tags: ['idea', 'inspiration', 'think'] },
  { name: 'Rocket', icon: Rocket, content: 'rocket', category: 'creative', tags: ['launch', 'start', 'fast'] },
  { name: 'Lightning', icon: Zap, content: 'zap', category: 'creative', tags: ['energy', 'power', 'fast'] },
  { name: 'Crown', icon: Crown, content: 'crown', category: 'creative', tags: ['king', 'royal', 'premium'] },
  { name: 'Quote', icon: Quote, content: 'quote', category: 'creative', tags: ['text', 'citation', 'speech'] },
];

// Categories with emojis and descriptions
const categories = [
  { id: 'all', name: '🔍 All Icons', description: 'Browse all available icons' },
  { id: 'popular', name: '⭐ Popular', description: 'Most commonly used icons' },
  { id: 'emotions', name: '😊 Emotions', description: 'Feelings and expressions' },
  { id: 'business', name: '💼 Business', description: 'Professional and work-related' },
  { id: 'navigation', name: '🧭 Navigation', description: 'Arrows and directional' },
  { id: 'social', name: '👥 Social', description: 'People and communication' },
  { id: 'media', name: '🎬 Media', description: 'Audio, video, and entertainment' },
  { id: 'lifestyle', name: '🏠 Lifestyle', description: 'Daily life and objects' },
  { id: 'nature', name: '🌿 Nature', description: 'Weather and natural elements' },
  { id: 'technology', name: '💻 Technology', description: 'Tech and digital icons' },
  { id: 'security', name: '🔒 Security', description: 'Privacy and access control' },
  { id: 'creative', name: '🎨 Creative', description: 'Inspiration and artistic' },
];

export function IconLibrary({ isOpen, onClose, onSelectIcon, selectedColor }: IconLibraryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  if (!isOpen) return null;

  // Filter icons based on search and category
  const getFilteredIcons = () => {
    let filtered = iconLibrary;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(icon => icon.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(icon =>
        icon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        icon.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    return filtered;
  };

  const filteredIcons = getFilteredIcons();
  const popularIcons = iconLibrary.filter(icon => icon.popular);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-gray-900 rounded-xl border border-gray-600 shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div>
            <h2 className="text-xl font-semibold text-white">Icon Library</h2>
            <p className="text-sm text-gray-400">Choose from {iconLibrary.length} professional icons</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-gray-400'}`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-indigo-600 text-white' : 'text-gray-400'}`}
                title="List View"
              >
                <Filter className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-800 transition-colors text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex">
          {/* Sidebar - Categories */}
          <div className="w-64 border-r border-gray-700 p-4 max-h-[calc(80vh-120px)] overflow-y-auto">
            <h3 className="text-sm font-medium text-white mb-3">Categories</h3>
            <div className="space-y-1">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedCategory === category.id 
                      ? 'bg-indigo-600 text-white' 
                      : 'text-gray-300 hover:bg-gray-800'
                  }`}
                  title={category.description}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="mt-6 p-3 bg-gray-800 rounded-lg">
              <h4 className="text-xs font-medium text-gray-400 mb-2">Library Stats</h4>
              <div className="text-xs text-gray-300 space-y-1">
                <div>Total: {iconLibrary.length} icons</div>
                <div>Categories: {categories.length - 1}</div>
                <div>Popular: {popularIcons.length}</div>
                <div className="pt-2 border-t border-gray-700">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded"
                      style={{ backgroundColor: selectedColor }}
                    />
                    <span>Current Color</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6 max-h-[calc(80vh-120px)] overflow-y-auto">
            {/* Search */}
            <div className="relative mb-6">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search icons by name or tag..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Popular Icons (when no search) */}
            {!searchTerm && selectedCategory === 'all' && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-white mb-3 flex items-center">
                  ⭐ Popular Icons
                  <span className="ml-2 text-xs text-gray-400">({popularIcons.length})</span>
                </h3>
                <div className="grid grid-cols-8 gap-3 mb-6 p-4 bg-gray-800 rounded-lg">
                  {popularIcons.map((icon) => {
                    const Icon = icon.icon;
                    return (
                      <button
                        key={`popular-${icon.content}`}
                        onClick={() => onSelectIcon(icon)}
                        className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-700 transition-all duration-200 group"
                        title={`${icon.name} - ${icon.tags.join(', ')}`}
                      >
                        <Icon 
                          className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform" 
                          style={{ color: selectedColor }}
                        />
                        <span className="text-xs text-gray-300 group-hover:text-white text-center">
                          {icon.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Results Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-white">
                {searchTerm ? `Search Results (${filteredIcons.length})` : 
                 selectedCategory === 'all' ? 'All Icons' : 
                 categories.find(c => c.id === selectedCategory)?.name}
              </h3>
              {filteredIcons.length > 0 && (
                <span className="text-xs text-gray-400">
                  Click any icon to add to canvas
                </span>
              )}
            </div>

            {/* Icons Grid */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-6 gap-4">
                {filteredIcons.map((icon, index) => {
                  const Icon = icon.icon;
                  return (
                    <button
                      key={`${icon.content}-${index}`}
                      onClick={() => onSelectIcon(icon)}
                      className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-800 transition-all duration-200 group relative"
                      title={`${icon.name} - ${icon.tags.join(', ')}`}
                    >
                      {icon.popular && (
                        <div className="absolute top-1 right-1 w-2 h-2 bg-yellow-400 rounded-full"></div>
                      )}
                      <Icon 
                        className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform" 
                        style={{ color: selectedColor }}
                      />
                      <span className="text-xs text-gray-300 group-hover:text-white text-center leading-tight">
                        {icon.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredIcons.map((icon, index) => {
                  const Icon = icon.icon;
                  return (
                    <button
                      key={`${icon.content}-${index}`}
                      onClick={() => onSelectIcon(icon)}
                      className="w-full flex items-center p-3 rounded-lg hover:bg-gray-800 transition-colors text-left"
                      title={`Click to add ${icon.name}`}
                    >
                      <Icon 
                        className="w-6 h-6 mr-4" 
                        style={{ color: selectedColor }}
                      />
                      <div className="flex-1">
                        <div className="text-sm text-white">{icon.name}</div>
                        <div className="text-xs text-gray-400">{icon.tags.join(', ')}</div>
                      </div>
                      {icon.popular && (
                        <span className="text-xs bg-yellow-400 text-black px-2 py-1 rounded-full">
                          Popular
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* No Results */}
            {filteredIcons.length === 0 && (
              <div className="text-center py-12">
                <Search className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-400 mb-2">No icons found</h3>
                <p className="text-gray-500 text-sm">
                  Try adjusting your search or browse different categories
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 