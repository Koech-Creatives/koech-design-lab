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

  // Simplified state management
  const [isEditing, setIsEditing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<string>('');

  // ========================================
  // TEXT LOGIC - COMPLETELY REWRITTEN
  // ========================================

  // Simple text content management
  const getDisplayContent = () => {
    if (!element.content || element.content.trim() === '') {
      return isEditing ? '' : 'Double-click to edit';
    }
    
    // Check for placeholder content
    const placeholders = ['Double-click to edit', 'Click to edit text', 'Your text here'];
    if (placeholders.includes(element.content)) {
      return isEditing ? '' : 'Double-click to edit';
    }
    
    return element.content;
  };

  // Start editing mode with improved cursor positioning
  const startEditing = () => {
    setIsEditing(true);
    
    // Use requestAnimationFrame for better timing
    requestAnimationFrame(() => {
      setTimeout(() => {
        if (textRef.current) {
          // Clear placeholder content first if needed
          const isPlaceholder = !element.content || 
                               element.content === 'Double-click to edit' || 
                               element.content === 'Click to edit text' ||
                               element.content === 'Your text here' ||
                               element.content.trim() === '';
          
          if (isPlaceholder) {
            textRef.current.textContent = '';
          }
          
          textRef.current.focus();
          
          // Position cursor with better error handling
          try {
            const selection = window.getSelection();
            if (!selection) return;
            
            selection.removeAllRanges();
            const range = document.createRange();
            
            // More robust cursor positioning
            if (textRef.current.firstChild && textRef.current.firstChild.nodeType === Node.TEXT_NODE) {
              // Position at end of text node
              const textNode = textRef.current.firstChild;
              range.setStart(textNode, textNode.textContent?.length || 0);
            } else if (textRef.current.childNodes.length > 0) {
              // Position at end of last child
              range.setStartAfter(textRef.current.lastChild!);
            } else {
              // Position at start of empty element
              range.setStart(textRef.current, 0);
            }
            
            range.collapse(true);
            selection.addRange(range);
          } catch (error) {
            console.warn('Cursor positioning failed:', error);
            // Fallback: just focus and let browser handle it
            if (textRef.current) {
              textRef.current.focus();
            }
          }
        }
      }, 50); // Increased timeout for better reliability
    });
  };

  // Stop editing and save content
  const stopEditing = () => {
    if (!textRef.current) return;
    
    const textContent = textRef.current.textContent || '';
    const trimmedContent = textContent.trim();
    
    // Save content or set placeholder
    if (trimmedContent) {
      onUpdate({ content: trimmedContent });
    } else {
      onUpdate({ content: 'Double-click to edit' });
    }
    
    setIsEditing(false);
  };

  // Handle text input with improved debouncing
  const handleTextInput = useCallback(() => {
    if (!isEditing || !textRef.current) return;
    
    const textContent = textRef.current.textContent || '';
    if (textContent.trim()) {
      // Clear any existing timeout
      if ((window as any).textSaveTimeout) {
        clearTimeout((window as any).textSaveTimeout);
      }
      
      // Debounced save - only save if there's actual content
      (window as any).textSaveTimeout = setTimeout(() => {
        onUpdate({ content: textContent });
      }, 1000); // Increased timeout to reduce interruptions
    }
  }, [isEditing, onUpdate]);

  // Handle double-click to start editing
  const handleDoubleClick = (e: React.MouseEvent) => {
    if (element.type === 'text' && !element.locked) {
      e.stopPropagation();
      startEditing();
    }
  };

  // Handle content when starting to edit
  useEffect(() => {
    if (isEditing && textRef.current) {
      const isPlaceholder = !element.content || 
                           element.content === 'Double-click to edit' || 
                           element.content === 'Click to edit text' ||
                           element.content === 'Your text here' ||
                           element.content.trim() === '';
      
      if (!isPlaceholder) {
        textRef.current.textContent = element.content;
      }
    }
  }, [isEditing, element.content]);

  // Handle click outside to stop editing
  useEffect(() => {
    if (!isEditing) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (textRef.current && !textRef.current.contains(e.target as Node)) {
        stopEditing();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        stopEditing();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isEditing]);

  // ========================================
  // RESIZE LOGIC - SIMPLIFIED
  // ========================================

  const handleResizeMouseDown = (e: React.MouseEvent, direction: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (element.locked) return;
    
    setIsResizing(true);
    setResizeDirection(direction);
    
    // Capture initial values
    const startMouseX = e.clientX;
    const startMouseY = e.clientY;
    const startWidth = element.width;
    const startHeight = element.height;
    const startX = element.x;
    const startY = element.y;
    
    // Get canvas boundaries once
    const canvasElement = document.querySelector('[data-canvas="true"]');
    const canvasWidth = canvasElement ? canvasElement.clientWidth : 1080;
    const canvasHeight = canvasElement ? canvasElement.clientHeight : 1080;
    
    const handleResizeMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startMouseX;
      const deltaY = e.clientY - startMouseY;
      
      let newWidth = startWidth;
      let newHeight = startHeight;
      let newX = startX;
      let newY = startY;
      
      switch (direction) {
        case 'se': // Southeast
          newWidth = Math.max(20, startWidth + deltaX);
          newHeight = Math.max(20, startHeight + deltaY);
          break;
        case 'sw': // Southwest
          newWidth = Math.max(20, startWidth - deltaX);
          newHeight = Math.max(20, startHeight + deltaY);
          newX = startX + (startWidth - newWidth);
          break;
        case 'ne': // Northeast
          newWidth = Math.max(20, startWidth + deltaX);
          newHeight = Math.max(20, startHeight - deltaY);
          newY = startY + (startHeight - newHeight);
          break;
        case 'nw': // Northwest
          newWidth = Math.max(20, startWidth - deltaX);
          newHeight = Math.max(20, startHeight - deltaY);
          newX = startX + (startWidth - newWidth);
          newY = startY + (startHeight - newHeight);
          break;
        case 'n': // North (top edge)
          newHeight = Math.max(20, startHeight - deltaY);
          newY = startY + (startHeight - newHeight);
          break;
        case 's': // South (bottom edge)
          newHeight = Math.max(20, startHeight + deltaY);
          break;
        case 'w': // West (left edge)
          newWidth = Math.max(20, startWidth - deltaX);
          newX = startX + (startWidth - newWidth);
          break;
        case 'e': // East (right edge)
          newWidth = Math.max(20, startWidth + deltaX);
          break;
      }
      
      // Constrain to canvas bounds
      if (newX < 0) {
        newWidth += newX;
        newX = 0;
      }
      if (newY < 0) {
        newHeight += newY;
        newY = 0;
      }
      if (newX + newWidth > canvasWidth) {
        newWidth = canvasWidth - newX;
      }
      if (newY + newHeight > canvasHeight) {
        newHeight = canvasHeight - newY;
      }
      
      // Ensure minimum size
      newWidth = Math.max(20, newWidth);
      newHeight = Math.max(20, newHeight);
      
      // Update element
      onUpdate({
        x: Math.round(newX),
        y: Math.round(newY),
        width: Math.round(newWidth),
        height: Math.round(newHeight)
      });
    };
    
    const handleResizeMouseUp = () => {
      setIsResizing(false);
      setResizeDirection('');
      document.removeEventListener('mousemove', handleResizeMouseMove);
      document.removeEventListener('mouseup', handleResizeMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
    
    // Set cursor and prevent text selection during resize
    document.body.style.cursor = getComputedStyle(e.target as Element).cursor;
    document.body.style.userSelect = 'none';
    
    document.addEventListener('mousemove', handleResizeMouseMove);
    document.addEventListener('mouseup', handleResizeMouseUp);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (element.locked || isEditing || isResizing) return;
    
    // Check if we're clicking on a resize handle
    const target = e.target as HTMLElement;
    if (target.closest('[data-resize-handle]')) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    onSelect();
    setIsDragging(true);
    
    const startMouseX = e.clientX;
    const startMouseY = e.clientY;
    const startElementX = element.x;
    const startElementY = element.y;
    
    // Get canvas boundaries
    const canvasElement = document.querySelector('[data-canvas="true"]');
    const canvasWidth = canvasElement ? canvasElement.clientWidth : 1080;
    const canvasHeight = canvasElement ? canvasElement.clientHeight : 1080;
    
    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startMouseX;
      const deltaY = e.clientY - startMouseY;
      
      const newX = Math.max(0, Math.min(canvasWidth - element.width, startElementX + deltaX));
      const newY = Math.max(0, Math.min(canvasHeight - element.height, startElementY + deltaY));
      
      onUpdate({ x: Math.round(newX), y: Math.round(newY) });
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
    
    // Set cursor and prevent text selection during drag
    document.body.style.cursor = 'move';
    document.body.style.userSelect = 'none';
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
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
      backgroundColor: element.backgroundColor || element.color || '#000000',
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
              fill={element.backgroundColor || element.color || '#000000'} 
            />
          </svg>
        );
      case 'line':
        return (
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: element.backgroundColor || element.color || '#000000',
              borderRadius: '2px',
            }}
          />
        );
      case 'custom':
        return (
          <svg width="100%" height="100%" viewBox="0 0 100 100">
            <path 
              d={element.path} 
              fill={element.backgroundColor || element.color || '#000000'} 
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
        // Determine what content to display
        let displayContent = getDisplayContent();

        return (
          <div
            ref={textRef}
            className="w-full h-full"
            style={{
              color: element.color || '#000000',
              fontSize: `${element.fontSize || 18}px`,
              fontWeight: element.fontWeight || 'normal',
              textAlign: element.textAlign || 'left',
              fontFamily: element.fontFamily || 'Gilmer, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
              lineHeight: '1.4',
              padding: '8px',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
              textTransform: element.textTransform || 'none',
              userSelect: element.locked ? 'none' : (isEditing ? 'text' : 'none'),
              pointerEvents: element.locked ? 'none' : 'auto',
              cursor: element.locked ? 'not-allowed' : (isEditing ? 'text' : 'move'),
              minHeight: `${(element.fontSize || 18) * 1.4 + 16}px`,
              display: 'block',
              overflow: 'visible',
              resize: 'none',
              outline: isEditing ? '2px solid #6366f1' : 'none',
              outlineOffset: isEditing ? '2px' : '0',
              hyphens: 'auto',
              opacity: displayContent === 'Double-click to edit' ? 0.5 : 1,
              ...element.customStyle,
            }}
            contentEditable={isEditing && !element.locked}
            suppressContentEditableWarning
            onInput={handleTextInput}
            onBlur={(e) => {
              // Only stop editing if we're actually losing focus to something outside
              setTimeout(() => {
                if (document.activeElement !== textRef.current) {
                  stopEditing();
                }
              }, 100);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                e.preventDefault();
                stopEditing();
              }
            }}
            onMouseDown={isEditing ? undefined : handleMouseDown}
            onMouseUp={(e) => isEditing && e.stopPropagation()}
            onMouseMove={(e) => isEditing && e.stopPropagation()}
          >
            {!isEditing ? displayContent : ''}
          </div>
        );
        
      case 'button':
        return (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              backgroundColor: element.backgroundColor || element.color || '#000000',
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
        
      case 'svg':
        return (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ 
              borderRadius: `${element.borderRadius || 0}px`,
              border: element.borderColor ? `2px solid ${element.borderColor}` : 'none',
              overflow: 'hidden'
            }}
            dangerouslySetInnerHTML={{ __html: element.content || '<svg><text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" fill="#666">SVG</text></svg>' }}
          />
        );
        
      case 'icon':
        return (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              color: element.color || '#000000',
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
              color: element.color || '#000000',
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
      data-element-id={element.id}
      className={`absolute select-none group ${
        element.locked ? 'cursor-not-allowed' : (isEditing ? 'cursor-text' : (element.type === 'text' ? 'cursor-move hover:bg-blue-50 hover:bg-opacity-10' : 'cursor-move'))
      } ${isSelected ? 'ring-2' : ''}`}
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
        userSelect: isEditing ? 'text' : 'none',
        WebkitUserSelect: isEditing ? 'text' : 'none',
        touchAction: 'none',
        borderColor: isSelected ? '#ff4940' : 'transparent'
      }}
      onMouseDown={!isEditing && element.type !== 'text' ? handleMouseDown : undefined}
      onDoubleClick={handleDoubleClick}
    >
      {renderElement()}
      
      {/* Invisible drag overlay for text elements when not editing */}
      {element.type === 'text' && !isEditing && (
        <div
          className="absolute inset-0 w-full h-full z-10 cursor-move"
          onMouseDown={handleMouseDown}
          style={{
            background: 'transparent',
            pointerEvents: 'auto'
          }}
          title="Click and drag to move text"
        />
      )}
      
      {/* Selection Controls */}
      {isSelected && !isEditing && (
        <>
          {/* Resize handles */}
          {!element.locked && (
            <>
              <div
                data-resize-handle="nw"
                className="absolute -top-2 -left-2 w-4 h-4 border-2 border-white rounded-full cursor-nw-resize shadow-lg hover:opacity-80 transition-colors z-20"
                style={{ backgroundColor: '#ff4940', pointerEvents: 'auto' }}
                onMouseDown={(e) => handleResizeMouseDown(e, 'nw')}
                title="Resize from top-left corner"
              />
              <div
                data-resize-handle="ne"
                className="absolute -top-2 -right-2 w-4 h-4 border-2 border-white rounded-full cursor-ne-resize shadow-lg hover:opacity-80 transition-colors z-20"
                style={{ backgroundColor: '#ff4940', pointerEvents: 'auto' }}
                onMouseDown={(e) => handleResizeMouseDown(e, 'ne')}
                title="Resize from top-right corner"
              />
              <div
                data-resize-handle="sw"
                className="absolute -bottom-2 -left-2 w-4 h-4 border-2 border-white rounded-full cursor-sw-resize shadow-lg hover:opacity-80 transition-colors z-20"
                style={{ backgroundColor: '#ff4940', pointerEvents: 'auto' }}
                onMouseDown={(e) => handleResizeMouseDown(e, 'sw')}
                title="Resize from bottom-left corner"
              />
              <div
                data-resize-handle="se"
                className="absolute -bottom-2 -right-2 w-4 h-4 border-2 border-white rounded-full cursor-se-resize shadow-lg hover:opacity-80 transition-colors z-20"
                style={{ backgroundColor: '#ff4940', pointerEvents: 'auto' }}
                onMouseDown={(e) => handleResizeMouseDown(e, 'se')}
                title="Resize from bottom-right corner"
              />
              {/* Edge handles for better UX */}
              <div
                data-resize-handle="n"
                className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 border-2 border-white rounded-full cursor-n-resize shadow-lg hover:opacity-80 transition-colors z-20"
                style={{ backgroundColor: '#ff4940', pointerEvents: 'auto' }}
                onMouseDown={(e) => handleResizeMouseDown(e, 'n')}
                title="Resize from top edge"
              />
              <div
                data-resize-handle="s"
                className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 border-2 border-white rounded-full cursor-s-resize shadow-lg hover:opacity-80 transition-colors z-20"
                style={{ backgroundColor: '#ff4940', pointerEvents: 'auto' }}
                onMouseDown={(e) => handleResizeMouseDown(e, 's')}
                title="Resize from bottom edge"
              />
              <div
                data-resize-handle="w"
                className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 border-2 border-white rounded-full cursor-w-resize shadow-lg hover:opacity-80 transition-colors z-20"
                style={{ backgroundColor: '#ff4940', pointerEvents: 'auto' }}
                onMouseDown={(e) => handleResizeMouseDown(e, 'w')}
                title="Resize from left edge"
              />
              <div
                data-resize-handle="e"
                className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 border-2 border-white rounded-full cursor-e-resize shadow-lg hover:opacity-80 transition-colors z-20"
                style={{ backgroundColor: '#ff4940', pointerEvents: 'auto' }}
                onMouseDown={(e) => handleResizeMouseDown(e, 'e')}
                title="Resize from right edge"
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