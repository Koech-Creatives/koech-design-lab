import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Unlock, Trash2, ChevronUp, ChevronDown, Image, Link, Upload, Palette } from 'lucide-react';
import { useCanvas } from '../contexts/CanvasContext';

export function LayersPanel() {
  const { elements, updateElement, removeElement, selectElement, selectedElement } = useCanvas();
  const [editingImage, setEditingImage] = useState<string | null>(null);
  const [editingColor, setEditingColor] = useState<string | null>(null);
  const [newImageUrl, setNewImageUrl] = useState('');

  const toggleVisibility = (id: string, currentVisibility: boolean) => {
    updateElement(id, { visible: !currentVisibility });
  };

  const toggleLock = (id: string, currentLocked: boolean) => {
    updateElement(id, { locked: !currentLocked });
  };

  const moveLayer = (id: string, direction: 'up' | 'down') => {
    const currentIndex = elements.findIndex(el => el.id === id);
    if (currentIndex === -1) return;

    const newZIndex = direction === 'up' 
      ? (elements[currentIndex].zIndex || 1) + 1
      : Math.max(1, (elements[currentIndex].zIndex || 1) - 1);
    
    updateElement(id, { zIndex: newZIndex });
  };

  const handleImageUpload = (id: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      updateElement(id, { content: imageUrl });
      setEditingImage(null);
      
      // Show success notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-20 right-6 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      notification.textContent = 'Image updated successfully!';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 3000);
    }
  };

  const handleUrlSubmit = (id: string) => {
    if (newImageUrl.trim()) {
      updateElement(id, { content: newImageUrl });
      setNewImageUrl('');
      setEditingImage(null);
      
      // Show success notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-20 right-6 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      notification.textContent = 'Image updated from URL!';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 3000);
    }
  };

  const handleColorChange = (id: string, color: string) => {
    const element = elements.find(el => el.id === id);
    if (!element) return;

    const style = element.style || {};
    
    if (element.type === 'text') {
      updateElement(id, { style: { ...style, color } });
    } else {
      updateElement(id, { style: { ...style, backgroundColor: color } });
    }
    
    // Show success notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-20 right-6 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    notification.textContent = 'Color updated!';
    document.body.appendChild(notification);
    
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 3000);
  };

  const getElementName = (element: any) => {
    switch (element.type) {
      case 'text':
        return element.content ? `Text: ${element.content.substring(0, 20)}...` : 'Text Layer';
      case 'image':
        return 'Image Layer';
      case 'rectangle':
        return 'Rectangle';
      case 'circle':
        return 'Circle';
      default:
        return 'Unknown Layer';
    }
  };

  const getElementColor = (element: any) => {
    if (!element.style) return '#cccccc';
    
    if (element.type === 'text') {
      return element.style.color || '#000000';
    } else {
      return element.style.backgroundColor || '#cccccc';
    }
  };

  const sortedElements = [...elements].sort((a, b) => (b.zIndex || 1) - (a.zIndex || 1));

  // Default color options
  const defaultColors = [
    '#e5e7eb', // Grey
    '#000000', // Black
    '#ffffff', // White
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-white">Layers</h2>
      
      <div className="space-y-1">
        {sortedElements.map((layer) => (
          <div key={layer.id} className="space-y-2">
            <div
              onClick={() => selectElement(layer.id)}
              className={`flex items-center space-x-2 p-3 rounded-lg transition-all duration-200 cursor-pointer group ${
                selectedElement === layer.id 
                  ? 'bg-indigo-600 text-white' 
                  : 'hover:bg-gray-800 text-gray-300'
              }`}
            >
              <div className="flex items-center space-x-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleVisibility(layer.id, layer.visible !== false);
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {layer.visible !== false ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLock(layer.id, layer.locked || false);
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {layer.locked ? <Lock className="w-4 h-4 text-yellow-400" /> : <Unlock className="w-4 h-4" />}
                </button>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="text-sm truncate block">{getElementName(layer)}</span>
                  {layer.type !== 'image' && (
                    <div 
                      className="w-4 h-4 rounded-sm border border-gray-500 cursor-pointer"
                      style={{ backgroundColor: getElementColor(layer) }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingColor(editingColor === layer.id ? null : layer.id);
                      }}
                      title="Change Color"
                    />
                  )}
                </div>
                <span className="text-xs opacity-75 capitalize">{layer.type}</span>
              </div>
              
              <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {layer.type !== 'image' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingColor(editingColor === layer.id ? null : layer.id);
                    }}
                    className="p-1 hover:bg-gray-700 rounded transition-colors"
                    title="Change Color"
                  >
                    <Palette className="w-3 h-3 text-purple-400" />
                  </button>
                )}
                {layer.type === 'image' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingImage(editingImage === layer.id ? null : layer.id);
                    }}
                    className="p-1 hover:bg-gray-700 rounded transition-colors"
                    title="Change Image"
                  >
                    <Image className="w-3 h-3 text-blue-400" />
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    moveLayer(layer.id, 'up');
                  }}
                  className="p-1 hover:bg-gray-700 rounded transition-colors"
                  title="Move Up"
                >
                  <ChevronUp className="w-3 h-3" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    moveLayer(layer.id, 'down');
                  }}
                  className="p-1 hover:bg-gray-700 rounded transition-colors"
                  title="Move Down"
                >
                  <ChevronDown className="w-3 h-3" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeElement(layer.id);
                  }}
                  className="p-1 hover:bg-gray-700 rounded transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-3 h-3 text-red-400" />
                </button>
              </div>
            </div>

            {/* Color picker controls */}
            {editingColor === layer.id && layer.type !== 'image' && (
              <div className="ml-6 p-3 bg-gray-800 rounded-lg space-y-2">
                <div className="grid grid-cols-5 gap-1 mb-2">
                  {defaultColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => handleColorChange(layer.id, color)}
                      className="w-6 h-6 rounded-sm hover:scale-110 transition-all"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={getElementColor(layer)}
                    onChange={(e) => handleColorChange(layer.id, e.target.value)}
                    className="w-8 h-8 bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={getElementColor(layer)}
                    onChange={(e) => handleColorChange(layer.id, e.target.value)}
                    className="flex-1 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-xs"
                    placeholder="#000000"
                  />
                  <button
                    onClick={() => setEditingColor(null)}
                    className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}

            {/* Image replacement controls */}
            {editingImage === layer.id && layer.type === 'image' && (
              <div className="ml-6 p-3 bg-gray-800 rounded-lg space-y-2">
                <div className="flex space-x-2">
                  <label className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(layer.id, e)}
                      className="hidden"
                    />
                    <div className="flex items-center justify-center space-x-2 p-2 border border-gray-600 rounded cursor-pointer hover:border-indigo-400 transition-colors">
                      <Upload className="w-4 h-4 text-gray-400" />
                      <span className="text-xs text-gray-400">Upload</span>
                    </div>
                  </label>
                  <button
                    onClick={() => setEditingImage(null)}
                    className="px-3 py-2 text-xs bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                  >
                    Cancel
                  </button>
                </div>
                
                <div className="flex space-x-2">
                  <input
                    type="url"
                    placeholder="Enter image URL"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    className="flex-1 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-xs"
                  />
                  <button
                    onClick={() => handleUrlSubmit(layer.id)}
                    className="px-3 py-1 bg-purple-600 hover:bg-purple-500 rounded transition-colors"
                  >
                    <Link className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {elements.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-400 text-sm">No layers yet</p>
          <p className="text-gray-500 text-xs mt-1">Add elements to see them here</p>
        </div>
      )}
    </div>
  );
}