import React, { useState, useRef } from 'react';
import { X, Search, Grid, List, Shapes, Square, Circle, Triangle, Minus, Plus, Diamond, Hexagon, Star, Heart, Zap, Crown } from 'lucide-react';

interface ShapeDefinition {
  name: string;
  type: 'rectangle' | 'circle' | 'triangle' | 'line' | 'star' | 'diamond' | 'hexagon' | 'heart' | 'arrow' | 'custom';
  category: string;
  description: string;
  popular?: boolean;
  path?: string; // For custom SVG shapes
}

interface ShapesLibraryProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectShape: (shape: ShapeDefinition) => void;
  selectedColor: string;
}

// Comprehensive shapes library
const shapesLibrary: ShapeDefinition[] = [
  // BASIC SHAPES
  { name: 'Rectangle', type: 'rectangle', category: 'basic', description: 'Perfect square or rectangle', popular: true },
  { name: 'Circle', type: 'circle', category: 'basic', description: 'Perfect circle or ellipse', popular: true },
  { name: 'Triangle', type: 'triangle', category: 'basic', description: 'Equilateral triangle', popular: true },
  { name: 'Line', type: 'line', category: 'basic', description: 'Straight line', popular: true },

  // GEOMETRIC SHAPES
  { name: 'Diamond', type: 'diamond', category: 'geometric', description: 'Diamond/rhombus shape', popular: false },
  { name: 'Hexagon', type: 'hexagon', category: 'geometric', description: 'Six-sided polygon', popular: false },
  { name: 'Star', type: 'star', category: 'geometric', description: 'Five-pointed star', popular: true },
  { name: 'Pentagon', type: 'custom', category: 'geometric', description: 'Five-sided polygon', 
    path: 'M50,0 L95,35 L77,90 L23,90 L5,35 Z' },
  { name: 'Octagon', type: 'custom', category: 'geometric', description: 'Eight-sided polygon',
    path: 'M30,0 L70,0 L100,30 L100,70 L70,100 L30,100 L0,70 L0,30 Z' },

  // ARROWS & DIRECTIONAL
  { name: 'Arrow Right', type: 'custom', category: 'arrows', description: 'Right-pointing arrow',
    path: 'M0,20 L20,20 L20,10 L40,25 L20,40 L20,30 L0,30 Z' },
  { name: 'Arrow Left', type: 'custom', category: 'arrows', description: 'Left-pointing arrow',
    path: 'M40,20 L20,20 L20,10 L0,25 L20,40 L20,30 L40,30 Z' },
  { name: 'Arrow Up', type: 'custom', category: 'arrows', description: 'Up-pointing arrow',
    path: 'M20,40 L20,20 L10,20 L25,0 L40,20 L30,20 L30,40 Z' },
  { name: 'Arrow Down', type: 'custom', category: 'arrows', description: 'Down-pointing arrow',
    path: 'M20,0 L20,20 L10,20 L25,40 L40,20 L30,20 L30,0 Z' },
  { name: 'Double Arrow', type: 'custom', category: 'arrows', description: 'Bidirectional arrow',
    path: 'M0,25 L15,10 L15,20 L35,20 L35,10 L50,25 L35,40 L35,30 L15,30 L15,40 Z' },

  // DECORATIVE SHAPES
  { name: 'Heart', type: 'heart', category: 'decorative', description: 'Heart shape', popular: true },
  { name: 'Crown', type: 'custom', category: 'decorative', description: 'Royal crown',
    path: 'M10,40 L10,20 L20,10 L30,20 L40,10 L50,20 L60,10 L70,20 L80,10 L90,20 L90,40 Z' },
  { name: 'Lightning', type: 'custom', category: 'decorative', description: 'Lightning bolt',
    path: 'M20,0 L5,35 L15,35 L10,60 L35,20 L25,20 Z' },
  { name: 'Flower', type: 'custom', category: 'decorative', description: 'Simple flower',
    path: 'M25,10 A15,15 0 0,0 10,25 A15,15 0 0,0 25,40 A15,15 0 0,0 40,25 A15,15 0 0,0 25,10 Z M25,15 A10,10 0 0,1 35,25 A10,10 0 0,1 25,35 A10,10 0 0,1 15,25 A10,10 0 0,1 25,15 Z' },
  { name: 'Shield', type: 'custom', category: 'decorative', description: 'Protective shield',
    path: 'M25,5 L45,15 L45,35 C45,45 35,55 25,55 C15,55 5,45 5,35 L5,15 Z' },

  // SPEECH & COMMUNICATION
  { name: 'Speech Bubble', type: 'custom', category: 'communication', description: 'Speech bubble',
    path: 'M10,10 L90,10 C95,10 100,15 100,20 L100,40 C100,45 95,50 90,50 L30,50 L20,60 L25,50 L10,50 C5,50 0,45 0,40 L0,20 C0,15 5,10 10,10 Z' },
  { name: 'Thought Bubble', type: 'custom', category: 'communication', description: 'Thought bubble',
    path: 'M20,10 L80,10 C90,10 100,20 100,30 L100,40 C100,50 90,60 80,60 L40,60 C30,60 20,50 20,40 Z M15,70 A5,5 0 1,0 25,70 A5,5 0 1,0 15,70 M8,80 A3,3 0 1,0 14,80 A3,3 0 1,0 8,80' },
  { name: 'Callout', type: 'custom', category: 'communication', description: 'Callout shape',
    path: 'M10,10 L90,10 C95,10 100,15 100,20 L100,40 C100,45 95,50 90,50 L60,50 L50,70 L55,50 L10,50 C5,50 0,45 0,40 L0,20 C0,15 5,10 10,10 Z' },

  // ABSTRACT & MODERN
  { name: 'Blob 1', type: 'custom', category: 'abstract', description: 'Organic blob shape',
    path: 'M25,5 C40,5 60,15 70,30 C80,45 70,65 50,70 C30,75 10,65 5,45 C0,25 10,5 25,5 Z' },
  { name: 'Blob 2', type: 'custom', category: 'abstract', description: 'Fluid organic shape',
    path: 'M30,10 C50,8 70,20 75,40 C80,60 65,75 45,80 C25,85 5,70 3,50 C1,30 15,12 30,10 Z' },
  { name: 'Wave', type: 'custom', category: 'abstract', description: 'Smooth wave pattern',
    path: 'M0,25 Q25,5 50,25 T100,25 L100,50 Q75,70 50,50 T0,50 Z' },
  { name: 'Spiral', type: 'custom', category: 'abstract', description: 'Spiral shape',
    path: 'M50,50 A20,20 0 0,0 30,30 A40,40 0 0,0 70,70 A10,10 0 0,0 60,60 A30,30 0 0,0 80,20 A50,50 0 0,0 20,80' },

  // BUSINESS & OFFICE
  { name: 'Folder', type: 'custom', category: 'business', description: 'File folder',
    path: 'M10,20 L40,20 L45,15 L90,15 C95,15 100,20 100,25 L100,70 C100,75 95,80 90,80 L10,80 C5,80 0,75 0,70 L0,25 C0,20 5,15 10,15 Z' },
  { name: 'Document', type: 'custom', category: 'business', description: 'Document page',
    path: 'M20,10 L70,10 L80,20 L80,90 L20,90 C15,90 10,85 10,80 L10,20 C10,15 15,10 20,10 Z M70,10 L70,20 L80,20' },
  { name: 'Envelope', type: 'custom', category: 'business', description: 'Mail envelope',
    path: 'M10,25 L90,25 L90,65 C90,70 85,75 80,75 L20,75 C15,75 10,70 10,65 Z M10,25 L50,45 L90,25' },
  { name: 'Chart', type: 'custom', category: 'business', description: 'Bar chart',
    path: 'M10,70 L20,70 L20,50 L10,50 Z M25,70 L35,70 L35,30 L25,30 Z M40,70 L50,70 L50,40 L40,40 Z M55,70 L65,70 L65,20 L55,20 Z M70,70 L80,70 L80,35 L70,35 Z' },
];

// Shape categories
const categories = [
  { id: 'all', name: '🔍 All Shapes', description: 'Browse all available shapes', icon: Shapes },
  { id: 'basic', name: '🔺 Basic', description: 'Fundamental geometric shapes', icon: Square },
  { id: 'geometric', name: '🔷 Geometric', description: 'Complex geometric patterns', icon: Diamond },
  { id: 'arrows', name: '➡️ Arrows', description: 'Directional and navigation shapes', icon: Plus },
  { id: 'decorative', name: '✨ Decorative', description: 'Ornamental and artistic shapes', icon: Star },
  { id: 'communication', name: '💬 Communication', description: 'Speech and dialogue shapes', icon: Plus },
  { id: 'abstract', name: '🌊 Abstract', description: 'Modern and organic shapes', icon: Plus },
  { id: 'business', name: '📋 Business', description: 'Professional and office shapes', icon: Plus },
];

// Shape preview component
function ShapePreview({ shape, color, size = 60 }: { shape: ShapeDefinition; color: string; size?: number }) {
  const viewBox = `0 0 ${size} ${size}`;
  
  switch (shape.type) {
    case 'rectangle':
      return (
        <svg width={size} height={size} viewBox={viewBox}>
          <rect x={size * 0.1} y={size * 0.1} width={size * 0.8} height={size * 0.8} fill={color} rx="4" />
        </svg>
      );
    case 'circle':
      return (
        <svg width={size} height={size} viewBox={viewBox}>
          <circle cx={size / 2} cy={size / 2} r={size * 0.4} fill={color} />
        </svg>
      );
    case 'triangle':
      return (
        <svg width={size} height={size} viewBox={viewBox}>
          <polygon points={`${size/2},${size*0.1} ${size*0.9},${size*0.9} ${size*0.1},${size*0.9}`} fill={color} />
        </svg>
      );
    case 'line':
      return (
        <svg width={size} height={size} viewBox={viewBox}>
          <line x1={size * 0.1} y1={size / 2} x2={size * 0.9} y2={size / 2} stroke={color} strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case 'star':
      return (
        <svg width={size} height={size} viewBox={viewBox}>
          <polygon points={`${size/2},${size*0.1} ${size*0.6},${size*0.35} ${size*0.9},${size*0.4} ${size*0.7},${size*0.65} ${size*0.8},${size*0.9} ${size/2},${size*0.75} ${size*0.2},${size*0.9} ${size*0.3},${size*0.65} ${size*0.1},${size*0.4} ${size*0.4},${size*0.35}`} fill={color} />
        </svg>
      );
    case 'diamond':
      return (
        <svg width={size} height={size} viewBox={viewBox}>
          <polygon points={`${size/2},${size*0.1} ${size*0.9},${size/2} ${size/2},${size*0.9} ${size*0.1},${size/2}`} fill={color} />
        </svg>
      );
    case 'heart':
      return (
        <svg width={size} height={size} viewBox={viewBox}>
          <path d={`M${size/2},${size*0.85} C${size*0.2},${size*0.6} ${size*0.2},${size*0.3} ${size/2},${size*0.45} C${size*0.8},${size*0.3} ${size*0.8},${size*0.6} ${size/2},${size*0.85} Z`} fill={color} />
        </svg>
      );
    case 'custom':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100">
          <path d={shape.path} fill={color} />
        </svg>
      );
    default:
      return (
        <svg width={size} height={size} viewBox={viewBox}>
          <rect x={size * 0.1} y={size * 0.1} width={size * 0.8} height={size * 0.8} fill={color} rx="4" />
        </svg>
      );
  }
}

export function ShapesLibrary({ isOpen, onClose, onSelectShape, selectedColor }: ShapesLibraryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  if (!isOpen) return null;

  // Filter shapes based on search and category
  const getFilteredShapes = () => {
    let filtered = shapesLibrary;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(shape => shape.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(shape =>
        shape.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shape.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const filteredShapes = getFilteredShapes();
  const popularShapes = shapesLibrary.filter(shape => shape.popular);

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
            <h2 className="text-xl font-semibold text-white">Shapes Library</h2>
            <p className="text-sm text-gray-400">Choose from {shapesLibrary.length} professional shapes</p>
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
                <List className="w-4 h-4" />
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
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center space-x-2 ${
                      selectedCategory === category.id 
                        ? 'bg-indigo-600 text-white' 
                        : 'text-gray-300 hover:bg-gray-800'
                    }`}
                    title={category.description}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{category.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Quick Stats */}
            <div className="mt-6 p-3 bg-gray-800 rounded-lg">
              <h4 className="text-xs font-medium text-gray-400 mb-2">Library Stats</h4>
              <div className="text-xs text-gray-300 space-y-1">
                <div>Total: {shapesLibrary.length} shapes</div>
                <div>Categories: {categories.length - 1}</div>
                <div>Popular: {popularShapes.length}</div>
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
                placeholder="Search shapes by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-red-500"
              />
            </div>

            {/* Popular Shapes (when no search) */}
            {!searchTerm && selectedCategory === 'all' && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-white mb-3 flex items-center">
                  ⭐ Popular Shapes
                  <span className="ml-2 text-xs text-gray-400">({popularShapes.length})</span>
                </h3>
                <div className="grid grid-cols-6 gap-3 mb-6 p-4 bg-gray-800 rounded-lg">
                  {popularShapes.map((shape) => (
                    <button
                      key={`popular-${shape.name}`}
                      onClick={() => onSelectShape(shape)}
                      className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-700 transition-all duration-200 group"
                      title={`${shape.name} - ${shape.description}`}
                    >
                      <div className="mb-2 group-hover:scale-110 transition-transform">
                        <ShapePreview shape={shape} color={selectedColor} size={40} />
                      </div>
                      <span className="text-xs text-gray-300 group-hover:text-white text-center">
                        {shape.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Results Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-white">
                {searchTerm ? `Search Results (${filteredShapes.length})` : 
                 selectedCategory === 'all' ? 'All Shapes' : 
                 categories.find(c => c.id === selectedCategory)?.name}
              </h3>
              {filteredShapes.length > 0 && (
                <span className="text-xs text-gray-400">
                  Click any shape to add to canvas
                </span>
              )}
            </div>

            {/* Shapes Grid */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-5 gap-4">
                {filteredShapes.map((shape, index) => (
                  <button
                    key={`${shape.name}-${index}`}
                    onClick={() => onSelectShape(shape)}
                    className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-800 transition-all duration-200 group relative"
                    title={`${shape.name} - ${shape.description}`}
                  >
                    {shape.popular && (
                      <div className="absolute top-1 right-1 w-2 h-2 bg-yellow-400 rounded-full"></div>
                    )}
                    <div className="mb-3 group-hover:scale-110 transition-transform">
                      <ShapePreview shape={shape} color={selectedColor} size={50} />
                    </div>
                    <span className="text-xs text-gray-300 group-hover:text-white text-center">
                      {shape.name}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredShapes.map((shape, index) => (
                  <button
                    key={`${shape.name}-${index}`}
                    onClick={() => onSelectShape(shape)}
                    className="w-full flex items-center p-3 rounded-lg hover:bg-gray-800 transition-colors text-left"
                    title={`Click to add ${shape.name}`}
                  >
                    <div className="mr-4">
                      <ShapePreview shape={shape} color={selectedColor} size={40} />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-white">{shape.name}</div>
                      <div className="text-xs text-gray-400">{shape.description}</div>
                    </div>
                    {shape.popular && (
                      <span className="text-xs bg-yellow-400 text-black px-2 py-1 rounded-full">
                        Popular
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* No Results */}
            {filteredShapes.length === 0 && (
              <div className="text-center py-12">
                <Shapes className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-400 mb-2">No shapes found</h3>
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