import React, { useRef, useEffect, useState, useCallback } from 'react';
import { PlatformSpecs } from '../utils/platformSpecs';
import { SafeZones } from './SafeZones';
import { CanvasElement } from './CanvasElement';
import { useCanvas } from '../contexts/CanvasContext';
import { useTools } from '../contexts/ToolsContext';
import { useBackground } from '../contexts/BackgroundContext';
import { usePages } from '../contexts/PagesContext';
import { Download, RotateCcw, Upload, Link, ZoomIn, ZoomOut, Menu, X } from 'lucide-react';
import html2canvas from 'html2canvas';

interface CanvasProps {
  platform: string;
  template?: any;
  onFormatChange?: (format: any) => void;
}

export function Canvas({ platform, template, onFormatChange }: CanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { elements, addElement, updateElement, selectElement, selectedElement, clearCanvas } = useCanvas();
  const { selectedTool, getToolCursor } = useTools();
  const { editorBackgroundColor, canvasBackgroundColor } = useBackground();
  const { currentPageId, updatePageElements, getCurrentPageElements } = usePages();
  
  const specs = PlatformSpecs[platform as keyof typeof PlatformSpecs] || PlatformSpecs.instagram;
  const [currentFormat, setCurrentFormat] = useState(specs.formats[0]);
  const [showSafeZones, setShowSafeZones] = useState(true);
  const [isDragOver, setIsDragOver] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(0.8);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [showDimensionsPanel, setShowDimensionsPanel] = useState(true);

  useEffect(() => {
    // When platform changes, update to the first format of that platform
    setCurrentFormat(specs.formats[0]);
  }, [platform]);

  useEffect(() => {
    if (template && template.elements) {
      clearCanvas();
      template.elements.forEach((element: any) => {
        addElement({
          ...element,
          id: `${Date.now()}-${Math.random()}`,
        });
      });
    }
  }, [template]);

  // Sync elements with current page
  useEffect(() => {
    updatePageElements(currentPageId, elements);
  }, [elements, currentPageId, updatePageElements]);

  // Load elements when switching pages
  useEffect(() => {
    const pageElements = getCurrentPageElements();
    // Only update if the page has different elements
    if (JSON.stringify(elements) !== JSON.stringify(pageElements)) {
      clearCanvas();
      pageElements.forEach((element: any) => {
        addElement(element);
      });
    }
  }, [currentPageId]);

  // Update container size when format or zoom changes
  useEffect(() => {
    if (containerRef.current) {
      updateCanvasSize();
    }
    
    // Also update on window resize
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, [currentFormat, zoomLevel]);

  // Handle zoom keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Cmd (Mac) or Ctrl (Windows/Linux)
      if (event.metaKey || event.ctrlKey) {
        switch (event.key) {
          case '=':
          case '+':
            event.preventDefault();
            zoomIn();
            break;
          case '-':
            event.preventDefault();
            zoomOut();
            break;
          case '0':
            event.preventDefault();
            setZoomLevel(1); // Reset zoom to 100%
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const updateCanvasSize = () => {
    if (!containerRef.current) return;
    
    // Calculate available space (no need to account for rulers anymore)
    const containerWidth = containerRef.current.clientWidth - 24;
    const containerHeight = containerRef.current.clientHeight - 24;
    
    // Determine which dimension is limiting
    const scaleByWidth = containerWidth / currentFormat.width;
    const scaleByHeight = containerHeight / currentFormat.height;
    const baseScale = Math.min(scaleByWidth, scaleByHeight, 1);
    
    // Apply the scale
    if (canvasRef.current) {
      canvasRef.current.style.width = `${currentFormat.width}px`;
      canvasRef.current.style.height = `${currentFormat.height}px`;
      canvasRef.current.style.transform = `scale(${baseScale * zoomLevel})`;
    }
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      // Handle different tool behaviors
      switch (selectedTool) {
        case 'selection':
        case 'direct-selection':
          selectElement(null);
          break;
        case 'hand':
          // Hand tool doesn't add elements on click, just handles panning
          break;
        case 'text':
          // Add text element at click position
          const rect = canvasRef.current?.getBoundingClientRect();
          if (rect) {
            const x = (e.clientX - rect.left) / zoomLevel;
            const y = (e.clientY - rect.top) / zoomLevel;
            addElement({
              type: 'text',
              position: { x: Math.max(0, x - 50), y: Math.max(0, y - 12) },
              size: { width: 200, height: 40 },
              content: 'Click to edit text',
              style: {
                fontSize: '24px',
                fontWeight: '600',
                color: '#1f2937',
                fontFamily: 'Inter, sans-serif',
              },
            });
          }
          break;
        case 'line':
          // Add line element at click position
          const rectLine = canvasRef.current?.getBoundingClientRect();
          if (rectLine) {
            const x = (e.clientX - rectLine.left) / zoomLevel;
            const y = (e.clientY - rectLine.top) / zoomLevel;
            addElement({
              type: 'rectangle',
              position: { x: Math.max(0, x - 50), y: Math.max(0, y - 1) },
              size: { width: 100, height: 2 },
              content: undefined,
              style: {
                backgroundColor: '#e5e7eb',
                borderRadius: '1px',
              },
            });
          }
          break;
        default:
          selectElement(null);
      }
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (selectedTool === 'hand') {
      setIsPanning(true);
      setPanStart({ x: e.clientX, y: e.clientY });
      e.preventDefault();
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning && selectedTool === 'hand') {
      const deltaX = e.clientX - panStart.x;
      const deltaY = e.clientY - panStart.y;
      setPanOffset(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
      setPanStart({ x: e.clientX, y: e.clientY });
      e.preventDefault();
    }
  };

  const handleMouseUp = () => {
    if (selectedTool === 'hand') {
      setIsPanning(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const elementType = e.dataTransfer.getData('elementType');
    const files = Array.from(e.dataTransfer.files);
    const rect = canvasRef.current?.getBoundingClientRect();
    
    if (rect) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Handle file drops
      if (files.length > 0) {
        files.forEach((file) => {
          if (file.type.startsWith('image/')) {
            const imageUrl = URL.createObjectURL(file);
            const newElement = {
              type: 'image',
              position: { x: Math.max(0, x - 100), y: Math.max(0, y - 75) },
              size: { width: 200, height: 150 },
              content: imageUrl,
              style: { borderRadius: '8px' },
            };
            addElement(newElement);
          }
        });
        return;
      }
      
      // Handle element type drops
      if (elementType) {
        const newElement = {
          type: elementType,
          position: { x: Math.max(0, x - 100), y: Math.max(0, y - 50) },
          size: { width: 200, height: 100 },
          content: getDefaultContent(elementType),
          style: getDefaultStyle(elementType),
        };
        
        addElement(newElement);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const getDefaultContent = (type: string): string | undefined => {
    switch (type) {
      case 'text': return 'Your text here';
      case 'image': return undefined;
      default: return undefined;
    }
  };

  const getDefaultStyle = (type: string) => {
    switch (type) {
      case 'text':
        return {
          fontSize: '24px',
          fontWeight: '600',
          color: '#1f2937', // Dark grey text
          fontFamily: 'Inter, sans-serif',
        };
      case 'rectangle':
        return {
          backgroundColor: '#e5e7eb', // Light grey
          borderRadius: '8px',
        };
      case 'circle':
        return {
          backgroundColor: '#e5e7eb', // Light grey
        };
      default:
        return {};
    }
  };

  const exportCanvas = async () => {
    if (!canvasRef.current) return;
    
    try {
      // Remove any selection UI before export
      selectElement(null);
      
      // Wait for state update to apply
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Use html2canvas to create an image
      const canvas = await html2canvas(canvasRef.current, {
        scale: 2, // Higher quality
        useCORS: true, // Allow cross-origin images
        backgroundColor: null,
        logging: false,
      });
      
      // Convert to image and trigger download
      const image = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.download = `${specs.name}-${currentFormat.name}-${Date.now()}.png`;
      link.href = image;
      link.click();
      
      // Show notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-20 right-6 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      notification.textContent = `Exporting ${currentFormat.name} format (${currentFormat.width}×${currentFormat.height}px) for ${specs.name}`;
      document.body.appendChild(notification);
      
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 3000);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const resetCanvas = () => {
    clearCanvas();
  };

  const handleFormatChange = (format: { name: string; width: number; height: number }) => {
    // Get scale ratios for width and height
    const widthRatio = format.width / currentFormat.width;
    const heightRatio = format.height / currentFormat.height;
    
    // Scale and reposition all elements proportionally
    const updatedElements = elements.map(element => {
      const newPos = {
        x: element.position.x * widthRatio,
        y: element.position.y * heightRatio,
      };
      
      const newSize = {
        width: element.size.width * widthRatio,
        height: element.size.height * heightRatio,
      };
      
      return {
        ...element,
        position: newPos,
        size: newSize,
      };
    });
    
    // Update all elements
    updatedElements.forEach(el => {
      updateElement(el.id, {
        position: el.position,
        size: el.size,
      });
    });
    
    // Set the new format
    setCurrentFormat(format);
    
    // Notify parent component
    if (onFormatChange) {
      onFormatChange(format);
    }
  };

  const zoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.1, 2));
  };
  
  const zoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.1, 0.3));
  };

  return (
    <div className="w-full h-full flex flex-col relative">
      {/* Fixed Dimensions Menu Button */}
      {!showDimensionsPanel && (
        <button
          onClick={() => setShowDimensionsPanel(true)}
          className="fixed top-20 left-1/2 transform -translate-x-1/2 z-30 px-4 py-2 rounded-lg text-white transition-all duration-200 flex items-center space-x-2 backdrop-blur-md shadow-lg hover:opacity-80"
          style={{ backgroundColor: 'rgba(26, 26, 26, 0.9)' }}
          title="Open Dimensions Menu"
        >
          <Menu className="w-4 h-4" />
          <span className="text-sm font-medium">Dimensions</span>
        </button>
      )}

      {/* Floating Format Controls Panel */}
      {showDimensionsPanel && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-20 rounded-xl border border-gray-600 shadow-xl backdrop-blur-md animate-in fade-in duration-200" style={{ backgroundColor: 'rgba(26, 26, 26, 0.4)' }}>
          <div className="p-4">
            <div className="flex flex-col space-y-3">
              {/* Panel Header with Minimize Button */}
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-white flex items-center space-x-2">
                  <Menu className="w-4 h-4" />
                  <span>Canvas Dimensions</span>
                </h3>
                <button
                  onClick={() => setShowDimensionsPanel(false)}
                  className="p-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors text-gray-300 hover:text-white"
                  title="Minimize Panel"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Format Buttons - Centered */}
              <div className="flex justify-center items-center">
                <div className="flex flex-wrap justify-center gap-2 max-w-2xl">
                  {specs.formats.map((format) => (
                    <button
                      key={format.name}
                      onClick={() => handleFormatChange(format)}
                      className={`px-2 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                        currentFormat.name === format.name
                          ? 'text-white shadow-lg'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                      style={currentFormat.name === format.name ? { backgroundColor: '#ff4940' } : {}}
                    >
                      {format.name}
                      <span className="ml-1 text-xs opacity-75 hidden lg:inline">
                        {format.width}×{format.height}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Controls - Between justification */}
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-400">
                  {currentFormat.name}
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="text-xs font-medium" style={{ color: '#ff4940' }}>
                    {currentFormat.width}×{currentFormat.height}px
                  </div>
                  <div className="text-xs text-gray-300">
                    Zoom: <span className="font-mono text-white">{Math.round(zoomLevel * 100)}%</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowSafeZones(!showSafeZones)}
                    className={`px-2 py-1 rounded-lg text-xs sm:text-sm transition-colors ${
                      showSafeZones
                        ? 'text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                    style={showSafeZones ? { backgroundColor: '#ff4940' } : {}}
                  >
                    Safe Zones
                  </button>
                  <button
                    onClick={zoomOut}
                    className="p-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
                    title="Zoom Out (Cmd/Ctrl + -)"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <button
                    onClick={zoomIn}
                    className="p-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
                    title="Zoom In (Cmd/Ctrl + +)"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button
                    onClick={resetCanvas}
                    className="p-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
                    title="Reset Canvas"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={exportCanvas}
                    className="px-3 py-1.5 rounded-lg transition-colors flex items-center space-x-1 text-white hover:opacity-80"
                    style={{ backgroundColor: '#ff4940' }}
                  >
                    <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="text-xs sm:text-sm">Export</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Canvas Container */}
      <div className="flex-1 overflow-hidden pt-4">
        <div 
          ref={containerRef} 
          className="relative w-full h-full"
          style={{ 
            backgroundColor: editorBackgroundColor,
            transform: `translate(${panOffset.x}px, ${panOffset.y}px)`
          }}
        >
          {/* Canvas positioned within the container */}
          <div className="flex justify-center items-center h-full">
            <div
              ref={canvasRef}
              className={`relative border-2 overflow-hidden transition-all duration-300 ${
                isDragOver 
                  ? 'bg-red-50' 
                  : selectedTool === 'hand' 
                    ? 'border-blue-400'
                    : 'border-gray-600'
              }`}
              style={{
                width: `${currentFormat.width}px`,
                height: `${currentFormat.height}px`,
                transformOrigin: 'center',
                transform: `scale(${zoomLevel})`,
                backgroundColor: isDragOver ? '#fef2f2' : canvasBackgroundColor,
                borderColor: isDragOver ? '#ff4940' : selectedTool === 'hand' ? '#60a5fa' : '#6b7280',
                cursor: selectedTool === 'hand' ? (isPanning ? 'grabbing' : 'grab') : getToolCursor(selectedTool)
              }}
              onClick={handleCanvasClick}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              {showSafeZones && <SafeZones format={currentFormat} platform={platform} />}
            
              {elements.map((element) => (
                <CanvasElement
                  key={element.id}
                  element={element}
                  isSelected={selectedElement === element.id}
                  onSelect={() => selectElement(element.id)}
                  onUpdate={(updates) => updateElement(element.id, updates)}
                />
              ))}

              {elements.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <Upload className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-4 opacity-50" />
                    <p className="text-sm sm:text-lg font-medium">Drop elements or images here</p>
                    <p className="text-xs sm:text-sm">or select a template to get started</p>
                  </div>
                </div>
              )}

              {isDragOver && (
                <div className="absolute inset-0 bg-red-100 bg-opacity-50 flex items-center justify-center">
                  <div className="text-center" style={{ color: '#ff4940' }}>
                    <Upload className="w-12 h-12 mx-auto mb-3" />
                    <p className="text-lg font-semibold">Drop to add to canvas</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}