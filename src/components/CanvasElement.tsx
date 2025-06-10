import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Trash2, Copy, Lock, Unlock } from 'lucide-react';
import { useCanvas } from '../contexts/CanvasContext';

interface CanvasElementProps {
  element: any;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: any) => void;
}

export function CanvasElement({ element, isSelected, onSelect, onUpdate }: CanvasElementProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [elementStart, setElementStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ width: 0, height: 0 });
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(element.content || '');
  const elementRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);
  const { removeElement, duplicateElement } = useCanvas();

  useEffect(() => {
    setEditContent(element.content || '');
  }, [element.content]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (element.locked || e.button !== 0) return;
    
    e.stopPropagation();
    onSelect();
    
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setElementStart({ x: element.position.x, y: element.position.y });
    
    // Add event listeners to window to handle mouse movement outside the element
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging && !isResizing) return;

    if (isDragging) {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;

      const newX = Math.max(0, elementStart.x + deltaX);
      const newY = Math.max(0, elementStart.y + deltaY);

      onUpdate({
        position: { x: newX, y: newY }
      });
    }

    if (isResizing && resizeHandle) {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;

      let newWidth = resizeStart.width;
      let newHeight = resizeStart.height;
      let newX = element.position.x;
      let newY = element.position.y;

      // Handle different resize corners
      switch (resizeHandle) {
        case 'se':
          newWidth = Math.max(50, resizeStart.width + deltaX);
          newHeight = Math.max(50, resizeStart.height + deltaY);
          break;
        case 'sw':
          newWidth = Math.max(50, resizeStart.width - deltaX);
          newHeight = Math.max(50, resizeStart.height + deltaY);
          newX = elementStart.x + deltaX;
          break;
        case 'ne':
          newWidth = Math.max(50, resizeStart.width + deltaX);
          newHeight = Math.max(50, resizeStart.height - deltaY);
          newY = elementStart.y + deltaY;
          break;
        case 'nw':
          newWidth = Math.max(50, resizeStart.width - deltaX);
          newHeight = Math.max(50, resizeStart.height - deltaY);
          newX = elementStart.x + deltaX;
          newY = elementStart.y + deltaY;
          break;
      }

      // Keep element within bounds
      if (newX < 0) {
        newWidth += newX;
        newX = 0;
      }
      if (newY < 0) {
        newHeight += newY;
        newY = 0;
      }

      onUpdate({
        position: { x: newX, y: newY },
        size: { width: newWidth, height: newHeight }
      });
    }
  }, [isDragging, isResizing, dragStart, elementStart, resizeStart, resizeHandle, onUpdate]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeHandle(null);
    
    // Remove event listeners
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove]);

  useEffect(() => {
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  const handleResizeMouseDown = (e: React.MouseEvent, handle: string) => {
    if (element.locked) return;
    
    e.stopPropagation();
    setIsResizing(true);
    setResizeHandle(handle);
    setDragStart({ x: e.clientX, y: e.clientY });
    setElementStart({ x: element.position.x, y: element.position.y });
    setResizeStart({ width: element.size.width, height: element.size.height });
    
    // Add event listeners to window
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleDoubleClick = () => {
    if (element.type === 'text' && !element.locked) {
      setIsEditing(true);
      setTimeout(() => textRef.current?.focus(), 0);
    }
  };

  const handleTextSubmit = () => {
    onUpdate({ content: editContent });
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleTextSubmit();
    }
    if (e.key === 'Escape') {
      setEditContent(element.content || '');
      setIsEditing(false);
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

  const renderElement = () => {
    switch (element.type) {
      case 'text':
        return (
          <div
            className="w-full h-full"
            style={{
              color: element.style?.color || '#1f2937',
              fontSize: element.style?.fontSize || '24px',
              fontWeight: element.style?.fontWeight || '400',
              textAlign: (element.style?.textAlign as any) || 'left',
              fontFamily: element.style?.fontFamily || 'Inter, sans-serif',
              lineHeight: element.style?.lineHeight || '1.5',
              padding: element.style?.padding || '0',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              overflow: 'hidden',
            }}
            contentEditable={!element.locked}
            suppressContentEditableWarning
            onBlur={(e) => onUpdate({ content: e.currentTarget.textContent || '' })}
          >
            {element.content}
          </div>
        );
      case 'rectangle':
        return (
          <div
            className="w-full h-full"
            style={{
              backgroundColor: element.style?.backgroundColor || '#e5e7eb',
              borderRadius: element.style?.borderRadius || '0px',
              border: element.style?.border || 'none',
            }}
          />
        );
      case 'circle':
        return (
          <div
            className="w-full h-full rounded-full"
            style={{
              backgroundColor: element.style?.backgroundColor || '#e5e7eb',
              border: element.style?.border || 'none',
            }}
          />
        );
      case 'svg':
        return (
          <div className="w-full h-full relative">
            <img
              src={element.content}
              alt="SVG element"
              className="w-full h-full"
              style={{ 
                objectFit: 'contain',
                pointerEvents: 'none',
                borderRadius: element.style?.borderRadius || '0px',
                backgroundColor: 'transparent'
              }}
              draggable={false}
            />
            <div 
              className="absolute inset-0" 
              style={{ pointerEvents: 'auto' }}
              onMouseDown={handleMouseDown}
            />
          </div>
        );
      case 'image':
        return (
          <img
            src={element.content || 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400'}
            alt="Canvas element"
            className="w-full h-full object-cover"
            style={{ borderRadius: element.style?.borderRadius || '0px' }}
            draggable={false}
          />
        );
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
        left: `${element.position.x}px`,
        top: `${element.position.y}px`,
        width: `${element.size.width}px`,
        height: `${element.size.height}px`,
        zIndex: element.zIndex || 1,
        opacity: element.visible === false ? 0.5 : 1,
        display: element.visible === false ? 'none' : 'block',
        transition: isDragging || isResizing ? 'none' : 'all 0.2s ease-in-out',
        transform: `scale(${isDragging || isResizing ? 1.02 : 1})`,
      }}
      onMouseDown={element.type === 'svg' ? undefined : handleMouseDown}
    >
      {renderElement()}
      
      {/* Selection Controls */}
      {isSelected && (
        <>
          {/* Resize handles */}
          {!element.locked && (
            <>
              <div 
                className="absolute -top-1 -left-1 w-3 h-3 rounded-full bg-indigo-500 cursor-nw-resize hover:scale-125 transition-transform z-50"
                onMouseDown={(e) => handleResizeMouseDown(e, 'nw')}
              />
              <div 
                className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-indigo-500 cursor-ne-resize hover:scale-125 transition-transform z-50"
                onMouseDown={(e) => handleResizeMouseDown(e, 'ne')}
              />
              <div 
                className="absolute -bottom-1 -left-1 w-3 h-3 rounded-full bg-indigo-500 cursor-sw-resize hover:scale-125 transition-transform z-50"
                onMouseDown={(e) => handleResizeMouseDown(e, 'sw')}
              />
              <div 
                className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-indigo-500 cursor-se-resize hover:scale-125 transition-transform z-50"
                onMouseDown={(e) => handleResizeMouseDown(e, 'se')}
              />
            </>
          )}
          
          {/* Action buttons */}
          <div className="absolute -top-10 right-0 flex items-center space-x-1 bg-gray-800 rounded-lg shadow-lg px-1 py-1">
            <button
              onClick={toggleLock}
              className="p-1.5 rounded-md hover:bg-gray-700 transition-colors"
              title={element.locked ? 'Unlock' : 'Lock'}
            >
              {element.locked ? <Lock className="w-4 h-4 text-yellow-500" /> : <Unlock className="w-4 h-4 text-green-400" />}
            </button>
            <button
              onClick={handleDuplicate}
              className="p-1.5 rounded-md hover:bg-gray-700 transition-colors"
              title="Duplicate"
            >
              <Copy className="w-4 h-4 text-blue-400" />
            </button>
            <button
              onClick={handleDelete}
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