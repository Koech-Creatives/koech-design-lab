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

  const [isEditing, setIsEditing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<string>('');
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [showTextToolbar, setShowTextToolbar] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 });
  const [selectedText, setSelectedText] = useState('');
  const [textSelection, setTextSelection] = useState<{ start: number; end: number } | null>(null);

  // Debounce utility function
  function debounce(func: Function, wait: number) {
    let timeout: NodeJS.Timeout;
    return function executedFunction(...args: any[]) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Dynamic text container resizing
  const resizeTextContainer = useCallback(() => {
    if (textRef.current && element.type === 'text' && element.autoWrap !== false) {
      // Get canvas boundaries from parent canvas element
      const canvasElement = document.querySelector('[data-canvas="true"]');
      const canvasWidth = canvasElement ? canvasElement.clientWidth : 1080;
      const canvasHeight = canvasElement ? canvasElement.clientHeight : 1080;
      
      // Create a temporary element to measure text dimensions
      const tempElement = document.createElement('div');
      tempElement.style.position = 'absolute';
      tempElement.style.visibility = 'hidden';
      tempElement.style.whiteSpace = 'pre-wrap'; // Allow wrapping for multi-line text
      tempElement.style.wordWrap = 'break-word';
      tempElement.style.overflowWrap = 'break-word';
      tempElement.style.fontSize = `${element.fontSize || 18}px`;
      tempElement.style.fontWeight = element.fontWeight || 'normal';
      tempElement.style.fontFamily = element.fontFamily || 'Gilmer, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif';
      tempElement.style.padding = '8px';
      tempElement.style.lineHeight = '1.4';
      
      // Set max width based on canvas boundaries and current position
      const maxPossibleWidth = Math.max(200, canvasWidth - element.x - 20);
      tempElement.style.maxWidth = `${Math.min(600, maxPossibleWidth)}px`;
      tempElement.innerHTML = textRef.current.innerHTML || 'Sample Text';
      
      document.body.appendChild(tempElement);
      
      // Get the natural dimensions
      const naturalWidth = tempElement.scrollWidth;
      const naturalHeight = tempElement.scrollHeight;
      
      document.body.removeChild(tempElement);
      
      // Calculate new dimensions with constraints
      const minWidth = 100;
      const minHeight = Math.max(30, (element.fontSize || 18) * 1.4 + 16);
      
      // Constrain to canvas boundaries
      const maxWidth = Math.max(minWidth, canvasWidth - element.x - 10);
      const maxHeight = Math.max(minHeight, canvasHeight - element.y - 10);
      
      const newWidth = Math.max(minWidth, Math.min(maxWidth, naturalWidth + 20));
      const newHeight = Math.max(minHeight, Math.min(maxHeight, naturalHeight + 10));
      
      // Only update if there's a significant change
      if (Math.abs(newWidth - element.width) > 5 || Math.abs(newHeight - element.height) > 5) {
        onUpdate({
          width: newWidth,
          height: newHeight
        });
      }
    }
  }, [element, onUpdate]);

  const saveTextContent = () => {
    if (textRef.current) {
      // Get the innerHTML to preserve formatting and line breaks
      let content = textRef.current.innerHTML;
      
      // Clean up any unnecessary HTML that might be added by contentEditable
      content = content
        .replace(/<div><br><\/div>/g, '<br>')  // Replace empty divs with br
        .replace(/<div>/g, '<br>')             // Replace div starts with br
        .replace(/<\/div>/g, '')               // Remove div ends
        .replace(/^<br>/, '')                  // Remove leading br
        .replace(/<br>$/, '');                 // Remove trailing br
      
      onUpdate({ content: content || 'Double-click to edit' });
    }
  };

  // Debounced resize function to prevent too many updates
  const debouncedResize = useCallback(
    debounce(() => {
      resizeTextContainer();
    }, 100),
    [resizeTextContainer]
  );

  // Text formatting functions
  const applyTextFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    saveTextContent();
    resizeTextContainer();
  };

  // Apply text properties from TextTab to selected text
  const applyTextProperty = useCallback((property: string, value: any) => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0 && textRef.current?.contains(selection.anchorNode)) {
      const range = selection.getRangeAt(0);
      
      if (range.toString().length > 0) {
        // Apply formatting to selected text
        switch (property) {
          case 'fontSize':
            document.execCommand('fontSize', false, '7'); // Use size 7 as base
            // Then apply custom size via CSS
            const selectedElements = textRef.current.querySelectorAll('font[size="7"]');
            selectedElements.forEach(el => {
              el.removeAttribute('size');
              (el as HTMLElement).style.fontSize = `${value}px`;
            });
            break;
          case 'fontWeight':
            if (value === 'bold' || parseInt(value) >= 600) {
              document.execCommand('bold', false);
            } else {
              // Apply custom weight
              const span = document.createElement('span');
              span.style.fontWeight = value;
              range.surroundContents(span);
            }
            break;
          case 'color':
            document.execCommand('foreColor', false, value);
            break;
          case 'fontFamily':
            document.execCommand('fontName', false, value);
            break;
          case 'textTransform':
            const span = document.createElement('span');
            span.style.textTransform = value;
            range.surroundContents(span);
            break;
          case 'textAlign':
            // Text alignment applies to the whole element
            onUpdate({ textAlign: value });
            break;
          case 'italic':
            document.execCommand('italic', false);
            break;
          case 'underline':
            document.execCommand('underline', false);
            break;
          case 'strikethrough':
            document.execCommand('strikeThrough', false);
            break;
          case 'textStyle':
            // Apply custom styles like boxed, neon, etc.
            const styleSpan = document.createElement('span');
            
            // Apply the style properties
            if (value.style) {
              Object.assign(styleSpan.style, value.style);
            }
            
            // Handle special cases for boxed styles
            if (value.value === 'boxed') {
              styleSpan.style.display = 'inline-block';
              styleSpan.style.border = '2px solid currentColor';
              styleSpan.style.padding = '6px 12px';
              styleSpan.style.borderRadius = '4px';
              styleSpan.style.margin = '2px';
            } else if (value.value === 'round-boxed') {
              styleSpan.style.display = 'inline-block';
              styleSpan.style.border = '2px solid currentColor';
              styleSpan.style.padding = '8px 16px';
              styleSpan.style.borderRadius = '20px';
              styleSpan.style.margin = '2px';
            }
            
            try {
              range.surroundContents(styleSpan);
            } catch (e) {
              // If surroundContents fails, try extractContents and appendChild
              const contents = range.extractContents();
              styleSpan.appendChild(contents);
              range.insertNode(styleSpan);
            }
            break;
        }
        
        saveTextContent();
        resizeTextContainer();
        selection.removeAllRanges();
        setShowTextToolbar(false);
      }
    }
  }, [onUpdate]);

  // Expose the applyTextProperty function globally for TextTab to use
  useEffect(() => {
    if (isSelected && element.type === 'text') {
      (window as any).applyTextPropertyToSelected = applyTextProperty;
    }
    
    return () => {
      if ((window as any).applyTextPropertyToSelected === applyTextProperty) {
        delete (window as any).applyTextPropertyToSelected;
      }
    };
  }, [isSelected, element.type, applyTextProperty]);

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
        
        {/* Hint text */}
        <div className="ml-2 text-xs text-gray-400">
          Use TextTab for more options →
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (isEditing && textRef.current) {
      const textElement = textRef.current;
      
      // Focus the element
      textElement.focus();
      
      const handleInput = () => {
        saveTextContent();
        debouncedResize();
      };

      const handlePaste = (e: ClipboardEvent) => {
        e.preventDefault();
        const text = e.clipboardData?.getData('text/plain') || '';
        document.execCommand('insertText', false, text);
        saveTextContent();
        debouncedResize();
      };

      const handleClickOutside = (e: MouseEvent) => {
        if (textElement && !textElement.contains(e.target as Node)) {
          setIsEditing(false);
          setShowTextToolbar(false);
          saveTextContent();
          resizeTextContainer();
        }
      };

      // Add event listeners
      textElement.addEventListener('input', handleInput);
      textElement.addEventListener('paste', handlePaste);
      document.addEventListener('mousedown', handleClickOutside);

      return () => {
        textElement.removeEventListener('input', handleInput);
        textElement.removeEventListener('paste', handlePaste);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isEditing, resizeTextContainer, debouncedResize]);

  // Handle text selection for formatting toolbar
  useEffect(() => {
    if (isEditing && textRef.current) {
      const handleSelectionChange = () => {
        handleTextSelection();
      };

      document.addEventListener('selectionchange', handleSelectionChange);
      
      return () => {
        document.removeEventListener('selectionchange', handleSelectionChange);
      };
    }
  }, [isEditing]);

  // Resize text container when content changes
  useEffect(() => {
    if (element.type === 'text' && element.autoWrap !== false) {
      resizeTextContainer();
    }
  }, [element.content, element.fontSize, element.fontFamily, element.fontWeight, resizeTextContainer]);

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

  const handleResizeMouseDown = (e: React.MouseEvent, direction: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (element.locked) return;
    
    setIsResizing(true);
    setResizeDirection(direction);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: element.width,
      height: element.height
    });
    
    const handleResizeMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      
      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;
      
      let newWidth = resizeStart.width;
      let newHeight = resizeStart.height;
      let newX = element.x;
      let newY = element.y;
      
      // Get canvas boundaries
      const canvasElement = document.querySelector('[data-canvas="true"]');
      const canvasWidth = canvasElement ? canvasElement.clientWidth : 1080;
      const canvasHeight = canvasElement ? canvasElement.clientHeight : 1080;
      
      switch (direction) {
        case 'se': // Southeast
          newWidth = Math.max(50, Math.min(canvasWidth - element.x, resizeStart.width + deltaX));
          newHeight = Math.max(30, Math.min(canvasHeight - element.y, resizeStart.height + deltaY));
          break;
        case 'sw': // Southwest
          newWidth = Math.max(50, resizeStart.width - deltaX);
          newHeight = Math.max(30, Math.min(canvasHeight - element.y, resizeStart.height + deltaY));
          newX = Math.max(0, element.x + (resizeStart.width - newWidth));
          break;
        case 'ne': // Northeast
          newWidth = Math.max(50, Math.min(canvasWidth - element.x, resizeStart.width + deltaX));
          newHeight = Math.max(30, resizeStart.height - deltaY);
          newY = Math.max(0, element.y + (resizeStart.height - newHeight));
          break;
        case 'nw': // Northwest
          newWidth = Math.max(50, resizeStart.width - deltaX);
          newHeight = Math.max(30, resizeStart.height - deltaY);
          newX = Math.max(0, element.x + (resizeStart.width - newWidth));
          newY = Math.max(0, element.y + (resizeStart.height - newHeight));
          break;
      }
      
      // Ensure element stays within canvas bounds
      if (newX + newWidth > canvasWidth) {
        newWidth = canvasWidth - newX;
      }
      if (newY + newHeight > canvasHeight) {
        newHeight = canvasHeight - newY;
      }
      
      onUpdate({
        x: newX,
        y: newY,
        width: newWidth,
        height: newHeight
      });
    };
    
    const handleResizeMouseUp = () => {
      setIsResizing(false);
      setResizeDirection('');
      document.removeEventListener('mousemove', handleResizeMouseMove);
      document.removeEventListener('mouseup', handleResizeMouseUp);
      
      // For text elements, disable auto-wrap when manually resized
      if (element.type === 'text') {
        onUpdate({ autoWrap: false });
      }
    };
    
    document.addEventListener('mousemove', handleResizeMouseMove);
    document.addEventListener('mouseup', handleResizeMouseUp);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (element.type === 'text' && !element.locked) {
      e.stopPropagation();
      setIsEditing(true);
      // Focus the text element after a brief delay to ensure it's ready
      setTimeout(() => {
        if (textRef.current) {
          textRef.current.focus();
          // Place cursor at the end of text
          const range = document.createRange();
          const selection = window.getSelection();
          range.selectNodeContents(textRef.current);
          range.collapse(false);
          selection?.removeAllRanges();
          selection?.addRange(range);
        }
      }, 10);
    }
  };

  const handleTextInput = (e: React.FormEvent) => {
    // Save content on input
    saveTextContent();
    // Debounced resize
    debouncedResize();
  };

  const handleTextBlur = () => {
    setIsEditing(false);
    setShowTextToolbar(false);
    saveTextContent();
    resizeTextContainer();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Don't prevent default for normal text editing keys
    if (isEditing) {
      // Allow all normal text editing
      if (e.key === 'Escape') {
        e.preventDefault();
        setIsEditing(false);
        setShowTextToolbar(false);
        saveTextContent();
        resizeTextContainer();
        return;
      }
      
      // Handle formatting shortcuts
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
          default:
            // Allow other Ctrl/Cmd shortcuts (like Ctrl+A, Ctrl+C, etc.)
            break;
        }
      }
      
      // Don't stop propagation for text editing keys
      return;
    }
    
    // Handle non-editing key events
    e.stopPropagation();
  };

  const handleTextMouseDown = (e: React.MouseEvent) => {
    if (isEditing) {
      // Allow text selection and cursor placement
      e.stopPropagation();
      return;
    }
    // If not editing, handle as normal element
    handleMouseDown(e);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (element.locked || isEditing || isResizing) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    onSelect();
    setIsDragging(true);
    setDragStart({ x: e.clientX - element.x, y: e.clientY - element.y });
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      // Get canvas boundaries
      const canvasElement = document.querySelector('[data-canvas="true"]');
      const canvasWidth = canvasElement ? canvasElement.clientWidth : 1080;
      const canvasHeight = canvasElement ? canvasElement.clientHeight : 1080;
      
      const newX = Math.max(0, Math.min(canvasWidth - element.width, e.clientX - dragStart.x));
      const newY = Math.max(0, Math.min(canvasHeight - element.height, e.clientY - dragStart.y));
      
      onUpdate({ x: newX, y: newY });
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
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
              userSelect: element.locked ? 'none' : (isEditing ? 'text' : 'pointer'),
              cursor: element.locked ? 'not-allowed' : (isEditing ? 'text' : 'pointer'),
              minHeight: `${(element.fontSize || 18) * 1.4 + 16}px`,
              display: 'block',
              overflow: element.autoWrap === false ? 'hidden' : 'visible',
              resize: element.autoWrap === false ? 'both' : 'none',
              outline: isEditing ? '2px solid #6366f1' : 'none',
              outlineOffset: isEditing ? '2px' : '0',
              ...element.customStyle,
            }}
            contentEditable={isEditing && !element.locked}
            suppressContentEditableWarning
            onInput={handleTextInput}
            onBlur={handleTextBlur}
            onKeyDown={handleKeyDown}
            onMouseDown={handleTextMouseDown}
            onMouseUp={(e) => isEditing && e.stopPropagation()}
            onMouseMove={(e) => isEditing && e.stopPropagation()}
            onSelect={handleTextSelection}
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
        element.locked ? 'cursor-not-allowed' : (isEditing ? 'cursor-text' : 'cursor-move')
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
        userSelect: isEditing ? 'text' : 'none',
        WebkitUserSelect: isEditing ? 'text' : 'none',
        touchAction: 'none'
      }}
      onMouseDown={!isEditing ? handleMouseDown : undefined}
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