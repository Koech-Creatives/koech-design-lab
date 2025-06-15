import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Trash2, Copy, Lock, Unlock,
  Heart, Star, Sparkles, Quote, Crown, Award, Shield, Zap,
  ArrowRight, ArrowLeft, ArrowUp, ArrowDown, ChevronRight, ChevronLeft,
  MessageCircle, Users, User, Eye, Mail, Phone, MapPin, Calendar, Clock,
  Play, Pause, Volume2, Search, Settings, Smile, Coffee, Camera, Gift, 
  Home, Car, Plane, Music, Book, Lightbulb, Target, Rocket, Flame, 
  Snowflake, Sun, Moon, Wifi, Battery, Signal, Bluetooth, Lock as LockIcon, 
  Unlock as UnlockIcon, Key, Bell, Share, ExternalLink, Send, MousePointer,
  Bold, Italic, Underline, Type, Palette
} from 'lucide-react';
import { useCanvas } from '../contexts/CanvasContext';

interface CanvasElementProps {
  element: any;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: any) => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

export function CanvasElement({ element, isSelected, onSelect, onUpdate, onDelete, onDuplicate }: CanvasElementProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const { removeElement, duplicateElement } = useCanvas();

  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [elementStart, setElementStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ width: 0, height: 0 });
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showTextToolbar, setShowTextToolbar] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 });
  const [selectedText, setSelectedText] = useState('');

  // Text formatting functions
  const applyTextFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    saveTextContent();
  };

  const saveTextContent = () => {
    if (textRef.current) {
      onUpdate({ content: textRef.current.innerHTML });
    }
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0 && textRef.current?.contains(selection.anchorNode)) {
      setSelectedText(selection.toString());
      
      // Get selection position for toolbar
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const elementRect = elementRef.current?.getBoundingClientRect();
      
      if (elementRect) {
        setToolbarPosition({
          x: rect.left - elementRect.left + rect.width / 2,
          y: rect.top - elementRect.top - 50
        });
        setShowTextToolbar(true);
      }
    } else {
      setShowTextToolbar(false);
      setSelectedText('');
    }
  };

  // Text formatting toolbar component
  const TextFormattingToolbar = () => {
    if (!showTextToolbar || !isEditing) return null;

    const formatButtons = [
      { command: 'bold', icon: Bold, title: 'Bold', shortcut: 'Ctrl+B' },
      { command: 'italic', icon: Italic, title: 'Italic', shortcut: 'Ctrl+I' },
      { command: 'underline', icon: Underline, title: 'Underline', shortcut: 'Ctrl+U' },
    ];

    const colorOptions = [
      '#000000', '#ffffff', '#ff4940', '#6366f1', '#8b5cf6', 
      '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#64748b'
    ];

    return (
      <div
        className="absolute z-50 bg-gray-800 border border-gray-600 rounded-lg shadow-lg p-2 flex items-center space-x-1"
        style={{
          left: `${toolbarPosition.x - 100}px`,
          top: `${toolbarPosition.y}px`,
          transform: 'translateX(-50%)',
        }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Format buttons */}
        {formatButtons.map((btn) => {
          const Icon = btn.icon;
          return (
            <button
              key={btn.command}
              onClick={() => applyTextFormat(btn.command)}
              className="p-1.5 rounded hover:bg-gray-700 transition-colors"
              title={`${btn.title} (${btn.shortcut})`}
            >
              <Icon className="w-4 h-4 text-gray-300 hover:text-white" />
            </button>
          );
        })}
        
        {/* Divider */}
        <div className="w-px h-6 bg-gray-600 mx-1" />
        
        {/* Color picker */}
        <div className="flex items-center space-x-1">
          <Palette className="w-4 h-4 text-gray-400" />
          <div className="flex space-x-1">
            {colorOptions.slice(0, 5).map((color) => (
              <button
                key={color}
                onClick={() => applyTextFormat('foreColor', color)}
                className="w-4 h-4 rounded border border-gray-600 hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
                title={`Color: ${color}`}
              />
            ))}
          </div>
        </div>
        
        {/* Font size controls */}
        <div className="flex items-center space-x-1 ml-2">
          <button
            onClick={() => applyTextFormat('fontSize', '1')}
            className="px-2 py-1 text-xs bg-gray-700 rounded hover:bg-gray-600 text-gray-300"
            title="Small"
          >
            S
          </button>
          <button
            onClick={() => applyTextFormat('fontSize', '3')}
            className="px-2 py-1 text-xs bg-gray-700 rounded hover:bg-gray-600 text-gray-300"
            title="Medium"
          >
            M
          </button>
          <button
            onClick={() => applyTextFormat('fontSize', '5')}
            className="px-2 py-1 text-xs bg-gray-700 rounded hover:bg-gray-600 text-gray-300"
            title="Large"
          >
            L
          </button>
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (isEditing && textRef.current) {
      // Add event listeners for text selection
      document.addEventListener('mouseup', handleTextSelection);
      document.addEventListener('keyup', handleTextSelection);
      
      // Focus the text element
      textRef.current.focus();
      
      return () => {
        document.removeEventListener('mouseup', handleTextSelection);
        document.removeEventListener('keyup', handleTextSelection);
      };
    }
  }, [isEditing]);

  // Hide toolbar when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!elementRef.current?.contains(e.target as Node)) {
        setShowTextToolbar(false);
      }
    };

    if (showTextToolbar) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showTextToolbar]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (element.locked || e.button !== 0) return;
    
    e.stopPropagation();
    onSelect();
    
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setElementStart({ x: element.x, y: element.y });
  }, [element.locked, element.x, element.y, onSelect]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging && !element.locked) {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      
      const newX = elementStart.x + deltaX;
      const newY = elementStart.y + deltaY;
      
      onUpdate({
        x: Math.max(0, newX),
        y: Math.max(0, newY)
      });
    } else if (isResizing && !element.locked) {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      
      let newWidth = resizeStart.width;
      let newHeight = resizeStart.height;
      let newX = elementStart.x;
      let newY = elementStart.y;

      switch (resizeHandle) {
        case 'se':
          newWidth = Math.max(50, resizeStart.width + deltaX);
          newHeight = Math.max(30, resizeStart.height + deltaY);
          break;
        case 'sw':
          newWidth = Math.max(50, resizeStart.width - deltaX);
          newHeight = Math.max(30, resizeStart.height + deltaY);
          newX = elementStart.x + deltaX;
          break;
        case 'ne':
          newWidth = Math.max(50, resizeStart.width + deltaX);
          newHeight = Math.max(30, resizeStart.height - deltaY);
          newY = elementStart.y + deltaY;
          break;
        case 'nw':
          newWidth = Math.max(50, resizeStart.width - deltaX);
          newHeight = Math.max(30, resizeStart.height - deltaY);
          newX = elementStart.x + deltaX;
          newY = elementStart.y + deltaY;
          break;
      }

      onUpdate({
        x: newX,
        y: newY,
        width: newWidth,
        height: newHeight
      });
    }
  }, [isDragging, isResizing, dragStart.x, dragStart.y, elementStart.x, elementStart.y, resizeHandle, resizeStart.width, resizeStart.height, onUpdate]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeHandle(null);
  }, []);

  useEffect(() => {
    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

  const handleResizeMouseDown = useCallback((e: React.MouseEvent, handle: string) => {
    if (element.locked) return;
    
    e.stopPropagation();
    onSelect();
    
    setIsResizing(true);
    setResizeHandle(handle);
    setDragStart({ x: e.clientX, y: e.clientY });
    setElementStart({ x: element.x, y: element.y });
    setResizeStart({ width: element.width, height: element.height });
  }, [element.locked, element.x, element.y, element.width, element.height, onSelect]);

  const handleDoubleClick = () => {
    if (element.type === 'text' && !element.locked) {
      setIsEditing(true);
    }
  };

  const handleTextBlur = () => {
    setIsEditing(false);
    setShowTextToolbar(false);
    saveTextContent();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsEditing(false);
      setShowTextToolbar(false);
    }
    // Allow text formatting shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          applyTextFormat('bold');
          break;
        case 'i':
          e.preventDefault();
          applyTextFormat('italic');
          break;
        case 'u':
          e.preventDefault();
          applyTextFormat('underline');
          break;
      }
    }
  };

  const toggleLock = () => {
    onUpdate({ locked: !element.locked });
  };

  const handleDuplicate = () => {
    duplicateElement(element.id);
  };

  const handleDelete = () => {
    removeElement(element.id);
  };

  const renderIcon = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      heart: Heart, star: Star, sparkles: Sparkles, quote: Quote, crown: Crown,
      award: Award, shield: Shield, zap: Zap, 'arrow-right': ArrowRight,
      'arrow-left': ArrowLeft, 'arrow-up': ArrowUp, 'arrow-down': ArrowDown,
      'chevron-right': ChevronRight, 'chevron-left': ChevronLeft,
      'message-circle': MessageCircle, users: Users, user: User, eye: Eye,
      mail: Mail, phone: Phone, 'map-pin': MapPin, calendar: Calendar,
      clock: Clock, play: Play, pause: Pause, 'volume-2': Volume2,
      search: Search, settings: Settings, smile: Smile, coffee: Coffee,
      camera: Camera, gift: Gift, home: Home, car: Car, plane: Plane,
      music: Music, book: Book, lightbulb: Lightbulb, target: Target,
      rocket: Rocket, flame: Flame, snowflake: Snowflake, sun: Sun,
      moon: Moon, wifi: Wifi, battery: Battery, signal: Signal,
      bluetooth: Bluetooth, 'lock-icon': LockIcon, 'unlock-icon': UnlockIcon,
      key: Key, bell: Bell, share: Share, 'external-link': ExternalLink,
      send: Send, 'mouse-pointer': MousePointer
    };
    
    const IconComponent = iconMap[iconName];
    return IconComponent ? <IconComponent className="w-full h-full" /> : null;
  };

  const renderShape = () => {
    const shapeStyle = {
      width: '100%',
      height: '100%',
      backgroundColor: element.backgroundColor || element.color || '#6366f1',
    };

    switch (element.type) {
      case 'rectangle':
        return (
          <div
            style={{
              ...shapeStyle,
              borderRadius: element.borderRadius || '8px',
            }}
          />
        );
      case 'circle':
        return (
          <div
            style={{
              ...shapeStyle,
              borderRadius: '50%',
            }}
          />
        );
      case 'triangle':
        return (
          <div
            style={{
              ...shapeStyle,
              clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
            }}
          />
        );
      case 'star':
        return (
          <div
            style={{
              ...shapeStyle,
              clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
            }}
          />
        );
      case 'diamond':
        return (
          <div
            style={{
              ...shapeStyle,
              transform: 'rotate(45deg)',
            }}
          />
        );
      case 'heart':
        return (
          <svg width="100%" height="100%" viewBox="0 0 100 100">
            <path 
              d="M50,85 C20,60 20,30 50,45 C80,30 80,60 50,85 Z" 
              fill={element.backgroundColor || element.color || '#6366f1'} 
            />
          </svg>
        );
      case 'line':
        return (
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: element.backgroundColor || element.color || '#6366f1',
              borderRadius: '2px',
            }}
          />
        );
      case 'custom':
        return (
          <svg width="100%" height="100%" viewBox="0 0 100 100">
            <path 
              d={element.path} 
              fill={element.backgroundColor || element.color || '#6366f1'} 
            />
          </svg>
        );
      default:
        return renderShape();
    }
  };

  const renderElement = () => {
    switch (element.type) {
      case 'text':
        return (
          <div
            ref={textRef}
            className="w-full h-full overflow-hidden flex items-center"
            style={{
              color: element.color || '#000000',
              fontSize: `${element.fontSize || 18}px`,
              fontWeight: element.fontWeight || 'normal',
              textAlign: element.textAlign || 'center',
              fontFamily: element.fontFamily || 'Gilmer, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
              lineHeight: '1.4',
              padding: '8px',
              whiteSpace: element.autoWrap ? 'pre-wrap' : 'nowrap',
              wordBreak: element.autoWrap ? 'break-word' : 'normal',
              wordWrap: element.autoWrap ? 'break-word' : 'normal',
              overflowWrap: element.autoWrap ? 'break-word' : 'normal',
              textTransform: element.textTransform || 'none',
              userSelect: element.locked ? 'none' : (isEditing ? 'text' : 'pointer'),
              cursor: element.locked ? 'not-allowed' : (isEditing ? 'text' : 'pointer'),
              justifyContent: element.textAlign === 'left' ? 'flex-start' : 
                             element.textAlign === 'right' ? 'flex-end' : 'center',
              alignItems: 'center',
              ...element.customStyle,
            }}
            contentEditable={isEditing && !element.locked}
            suppressContentEditableWarning
            onBlur={handleTextBlur}
            onKeyDown={handleKeyDown}
            dangerouslySetInnerHTML={{ __html: element.content || 'Double-click to edit' }}
          />
        );
        
      case 'button':
        return (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              backgroundColor: element.backgroundColor || element.color || '#6366f1',
              color: 'white',
              fontSize: `${element.fontSize || 16}px`,
              fontWeight: element.fontWeight || 'medium',
              textAlign: 'center',
              borderRadius: `${element.borderRadius || 8}px`,
              padding: `${element.padding || 12}px`,
              cursor: 'pointer',
              userSelect: 'none',
              border: 'none',
              fontFamily: element.fontFamily || 'Gilmer, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
            }}
          >
            {element.content || 'Button'}
          </div>
        );
        
      case 'image':
        return (
          <img
            src={element.src || element.content || 'https://via.placeholder.com/200x100?text=Image'}
            alt={element.alt || 'Canvas element'}
            className="w-full h-full object-cover"
            style={{ 
              borderRadius: `${element.borderRadius || 0}px`,
              border: element.borderColor ? `2px solid ${element.borderColor}` : 'none'
            }}
            draggable={false}
          />
        );
        
      case 'icon':
        return (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              color: element.color || '#6366f1',
            }}
          >
            {renderIcon(element.content)}
          </div>
        );
        
      case 'emoji':
        return (
          <div
            className="w-full h-full flex items-center justify-center"
              style={{ 
              fontSize: `${Math.min(element.width, element.height) * 0.8}px`,
              userSelect: 'none',
            }}
          >
            {element.content}
          </div>
        );
        
      case 'cta':
        return (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              color: element.color || '#6366f1',
              fontSize: `${element.fontSize || 14}px`,
              fontWeight: element.fontWeight || 'medium',
              textAlign: 'center',
              fontFamily: element.fontFamily || 'Gilmer, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
              userSelect: 'none',
              cursor: 'pointer',
            }}
          >
            {element.ctaType === 'arrow-right' && <ArrowRight className="w-full h-full" />}
            {element.ctaType === 'share' && <Share className="w-full h-full" />}
            {element.ctaType === 'like' && <Heart className="w-full h-full" />}
            {element.ctaType === 'comment' && <MessageCircle className="w-full h-full" />}
            {element.ctaType === 'visit' && <ExternalLink className="w-full h-full" />}
            {element.ctaType === 'dm' && <Send className="w-full h-full" />}
            {element.ctaType === 'swipe' && <ChevronRight className="w-full h-full" />}
            {element.ctaType === 'tap' && <MousePointer className="w-full h-full" />}
            {(element.ctaType === 'arrow-up' || element.ctaType === 'arrow-down' || element.ctaType === 'arrow-curved' || element.ctaType === 'click') && (
              <span style={{ fontSize: `${Math.min(element.width, element.height) * 0.6}px` }}>
                {element.ctaType === 'arrow-up' && '↗️'}
                {element.ctaType === 'arrow-down' && '↘️'}
                {element.ctaType === 'arrow-curved' && '↪️'}
                {element.ctaType === 'click' && '👆'}
              </span>
            )}
          </div>
        );
        
      // Handle all shape types
      case 'rectangle':
      case 'circle':
      case 'triangle':
      case 'star':
      case 'diamond':
      case 'heart':
      case 'line':
      case 'custom':
        return renderShape();
        
      default:
        return <div>Unknown element</div>;
    }
  };

  return (
    <div
      ref={elementRef}
      className={`absolute select-none group ${
        element.locked ? 'cursor-not-allowed' : 'cursor-move'
      } ${isSelected ? 'ring-2 ring-indigo-500' : ''}`}
      style={{
        left: `${element.x}px`,
        top: `${element.y}px`,
        width: `${element.width}px`,
        height: `${element.height}px`,
        zIndex: element.zIndex || 1,
        opacity: element.visible === false ? 0.5 : 1,
        display: element.visible === false ? 'none' : 'block',
        transition: isDragging || isResizing ? 'none' : 'all 0.2s ease-in-out',
        transform: `scale(${isDragging || isResizing ? 1.02 : 1})`,
        userSelect: 'none',
        WebkitUserSelect: 'none',
        touchAction: 'none'
      }}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
    >
      {renderElement()}
      
      {/* Text Formatting Toolbar */}
      <TextFormattingToolbar />
      
      {/* Selection Controls */}
      {isSelected && !isEditing && (
        <>
          {/* Resize handles */}
          {!element.locked && (
            <>
              <div
                className="absolute -top-1 -left-1 w-3 h-3 bg-indigo-500 border border-white rounded-full cursor-nw-resize opacity-0 group-hover:opacity-100 transition-opacity"
                onMouseDown={(e) => handleResizeMouseDown(e, 'nw')}
              />
              <div
                className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-500 border border-white rounded-full cursor-ne-resize opacity-0 group-hover:opacity-100 transition-opacity"
                onMouseDown={(e) => handleResizeMouseDown(e, 'ne')}
              />
              <div
                className="absolute -bottom-1 -left-1 w-3 h-3 bg-indigo-500 border border-white rounded-full cursor-sw-resize opacity-0 group-hover:opacity-100 transition-opacity"
                onMouseDown={(e) => handleResizeMouseDown(e, 'sw')}
              />
              <div
                className="absolute -bottom-1 -right-1 w-3 h-3 bg-indigo-500 border border-white rounded-full cursor-se-resize opacity-0 group-hover:opacity-100 transition-opacity"
                onMouseDown={(e) => handleResizeMouseDown(e, 'se')}
              />
            </>
          )}
          
          <div className="absolute -top-10 right-0 flex items-center space-x-1 bg-gray-800 rounded-lg shadow-lg px-1 py-1">
            <button
              onClick={toggleLock}
              className="p-1.5 rounded-md hover:bg-gray-700 transition-colors"
              title={element.locked ? 'Unlock' : 'Lock'}
            >
              {element.locked ? <Lock className="w-4 h-4 text-yellow-500" /> : <Unlock className="w-4 h-4 text-green-400" />}
            </button>
            <button
              onClick={onDuplicate}
              className="p-1.5 rounded-md hover:bg-gray-700 transition-colors"
              title="Duplicate"
            >
              <Copy className="w-4 h-4 text-blue-400" />
            </button>
            <button
              onClick={onDelete}
              className="p-1.5 rounded-md hover:bg-gray-700 transition-colors"
              title="Delete"
            >
              <Trash2 className="w-4 h-4 text-red-400" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}