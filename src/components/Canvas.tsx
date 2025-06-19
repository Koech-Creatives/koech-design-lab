import React, { useRef, useEffect, useState, useCallback } from 'react';
import { PlatformSpecs } from '../utils/platformSpecs';
import { SafeZones } from './SafeZones';
import { CanvasElement } from './CanvasElement';
import { useCanvas } from '../contexts/CanvasContext';
import { useTools } from '../contexts/ToolsContext';
import { useBackground } from '../contexts/BackgroundContext';
import { usePages } from '../contexts/PagesContext';
import { RotateCcw, Upload, Link, ZoomIn, ZoomOut, Menu, X } from 'lucide-react';

interface CanvasProps {
  platform: string;
  template?: any;
  onFormatChange?: (format: any) => void;
}

export function Canvas({ platform, template, onFormatChange }: CanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { elements, addElement, updateElement, selectElement, selectedElement, clearCanvas, removeElement, duplicateElement } = useCanvas();
  const { selectedTool, getToolCursor } = useTools();
  const { canvasBackgroundColor, setCanvasBackgroundColor } = useBackground();
  const { currentPageId, updatePageElements, getCurrentPageElements } = usePages();
  
  const specs = PlatformSpecs[platform as keyof typeof PlatformSpecs] || PlatformSpecs.instagram;
  const [currentFormat, setCurrentFormat] = useState(specs.formats[0]);
  const [showSafeZones, setShowSafeZones] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(0.8);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [showDimensionsPanel, setShowDimensionsPanel] = useState(true);
  const isLoadingElementsRef = useRef(false);

  // Fixed editor background - no more customization
  const editorBackgroundStyle = {
    backgroundColor: '#0f172a',
    backgroundImage: 'radial-gradient(#232323 1px,rgb(24, 24, 24) 1px)',
    backgroundSize: '20px 20px'
  };

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

  // Sync elements with current page (only when not loading)
  useEffect(() => {
    if (!isLoadingElementsRef.current) {
      updatePageElements(currentPageId, elements);
    }
  }, [elements, currentPageId]);

  // Load elements for current page
  useEffect(() => {
    isLoadingElementsRef.current = true;
    const pageElements = getCurrentPageElements();
    
    if (pageElements && pageElements.length > 0) {
      clearCanvas();
      pageElements.forEach((element: any) => {
        addElement(element);
      });
    }
    
    // Reset the flag after a brief delay to allow state updates
    setTimeout(() => {
      isLoadingElementsRef.current = false;
    }, 100);
  }, [currentPageId]);

  useEffect(() => {
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, [currentFormat, zoomLevel]);

  const updateCanvasSize = () => {
    if (!containerRef.current) return;
    
    // Calculate fixed canvas area based on viewport size, independent of panel states
    // This ensures canvas size remains consistent when panels open/close
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Header height and other UI elements
    const headerHeight = 64;
    const dimensionsPanelHeight = showDimensionsPanel ? 80 : 40; // Account for dimensions panel
    
    // Calculate available space for canvas
    const availableHeight = viewportHeight - headerHeight - dimensionsPanelHeight;
    
    // Define a fixed canvas area that represents the optimal design space
    // Use a fixed percentage of viewport to ensure consistency
    const fixedCanvasAreaWidth = Math.min(viewportWidth * 0.55, 1200); // Max 1200px width
    const fixedCanvasAreaHeight = Math.min(availableHeight * 0.85, 800); // Max 800px height
    
    // Add padding for better visual spacing
    const canvasAreaWidth = fixedCanvasAreaWidth - 60; // 30px padding on each side
    const canvasAreaHeight = fixedCanvasAreaHeight - 60; // 30px padding top/bottom
    
    // Ensure minimum dimensions
    const minWidth = 400;
    const minHeight = 300;
    const finalCanvasWidth = Math.max(canvasAreaWidth, minWidth);
    const finalCanvasHeight = Math.max(canvasAreaHeight, minHeight);
    
    // Calculate scale to fit the canvas format within the fixed area
    const scaleByWidth = finalCanvasWidth / currentFormat.width;
    const scaleByHeight = finalCanvasHeight / currentFormat.height;
    const baseScale = Math.min(scaleByWidth, scaleByHeight, 1);
    
    // Apply the scale to the canvas
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
          // Add text element at center position by default
          const rect = canvasRef.current?.getBoundingClientRect();
          if (rect) {
            // Center the element on the canvas
            const centerX = (currentFormat.width - 200) / 2;
            const centerY = (currentFormat.height - 40) / 2;
            addElement({
              type: 'text',
              x: centerX,
              y: centerY,
              width: 200,
              height: 40,
              content: 'Click to edit text',
              color: '#000000',
              fontSize: 24,
              fontWeight: '600',
              fontFamily: 'Gilmer, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
              textAlign: 'center',
              autoWrap: true,
            });
          }
          break;
        case 'line':
          // Add line element at center position by default
          const rectLine = canvasRef.current?.getBoundingClientRect();
          if (rectLine) {
            // Center the element on the canvas
            const centerX = (currentFormat.width - 100) / 2;
            const centerY = (currentFormat.height - 2) / 2;
            addElement({
              type: 'line',
              x: centerX,
              y: centerY,
              width: 100,
              height: 2,
              backgroundColor: '#000000',
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
      setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning && selectedTool === 'hand') {
      setPanOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const elementType = e.dataTransfer.getData('text/plain');

    if (files.length > 0) {
      // Handle file uploads
      const file = files[0];
      
      if (file.type.startsWith('image/')) {
        if (file.type === 'image/svg+xml') {
          // Handle SVG files
          const reader = new FileReader();
          reader.onload = (event) => {
            const svgContent = event.target?.result as string;
            const rect = canvasRef.current?.getBoundingClientRect();
            if (rect) {
              const x = (e.clientX - rect.left) / zoomLevel - 75;
              const y = (e.clientY - rect.top) / zoomLevel - 75;
              
              addElement({
                type: 'svg',
                x: Math.max(0, x),
                y: Math.max(0, y),
                width: 150,
                height: 150,
                content: svgContent,
                alt: file.name,
              });
            }
          };
          reader.readAsText(file);
        } else {
          // Handle regular image files
          const imageUrl = URL.createObjectURL(file);
          const rect = canvasRef.current?.getBoundingClientRect();
          if (rect) {
            const x = (e.clientX - rect.left) / zoomLevel - 100;
            const y = (e.clientY - rect.top) / zoomLevel - 75;
            
            addElement({
              type: 'image',
              x: Math.max(0, x),
              y: Math.max(0, y),
              width: 200,
              height: 150,
              src: imageUrl,
              alt: file.name,
            });
          }
        }
      }
    } else if (elementType) {
      // Handle element drops from the elements panel
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const x = (e.clientX - rect.left) / zoomLevel - 50;
        const y = (e.clientY - rect.top) / zoomLevel - 50;
        
        // Create element based on type
        switch (elementType) {
          case 'text':
            addElement({
              type: 'text',
              x: Math.max(0, x),
              y: Math.max(0, y),
              width: 200,
              height: 40,
              content: 'Your text here',
              fontSize: 18,
              color: '#000000',
              fontFamily: 'Gilmer, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
              textAlign: 'center',
              autoWrap: true,
            });
            break;
          case 'image':
            addElement({
              type: 'image',
              x: Math.max(0, x),
              y: Math.max(0, y),
              width: 200,
              height: 150,
              src: 'https://via.placeholder.com/200x150?text=Image',
            });
            break;
          case 'line':
            addElement({
              type: 'line',
              x: Math.max(0, x),
              y: Math.max(0, y),
              width: 150,
              height: 3,
              backgroundColor: '#000000',
            });
            break;
          default:
            addElement({
              type: elementType,
              x: Math.max(0, x),
              y: Math.max(0, y),
              width: 100,
              height: 100,
              color: '#000000',
              backgroundColor: '#000000',
            });
            break;
        }
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  };

  const handleElementDelete = (elementId: string) => {
    removeElement(elementId);
  };

  const handleElementDuplicate = (elementId: string) => {
    duplicateElement(elementId);
  };



  const resetCanvas = () => {
    clearCanvas();
    selectElement(null);
  };

  const handleFormatChange = (format: { name: string; width: number; height: number }) => {
    setCurrentFormat(format);
    if (onFormatChange) {
      onFormatChange(format);
    }
    
    // Reset zoom and pan when changing format
    setZoomLevel(0.8);
    setPanOffset({ x: 0, y: 0 });
    
    // Update canvas size after format change
    setTimeout(() => {
      updateCanvasSize();
    }, 0);
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
          className="fixed top-16 left-1/2 transform -translate-x-1/2 z-30 px-2 py-1 rounded text-white transition-all duration-200 flex items-center space-x-1 backdrop-blur-md shadow-md hover:opacity-80"
          style={{ backgroundColor: 'rgba(26, 26, 26, 0.9)' }}
          title="Open Dimensions Menu"
        >
          <Menu className="w-3 h-3" />
          <span className="text-xs font-medium">Dimensions</span>
        </button>
      )}

      {/* Floating Format Controls Panel */}
      {showDimensionsPanel && (
        <div className="fixed top-16 left-1/2 transform -translate-x-1/2 z-20 rounded-lg border border-gray-600 shadow-lg backdrop-blur-md animate-in fade-in duration-200" style={{ backgroundColor: 'rgba(26, 26, 26, 0.9)' }}>
          <div className="p-2">
            <div className="flex flex-col space-y-2">
              {/* Panel Header with Minimize Button */}
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-xs font-medium text-white flex items-center space-x-1">
                  <Menu className="w-3 h-3" />
                  <span>Canvas Dimensions</span>
                </h3>
                <button
                  onClick={() => setShowDimensionsPanel(false)}
                  className="p-1 rounded bg-gray-700 hover:bg-gray-600 transition-colors text-gray-300 hover:text-white"
                  title="Minimize Panel"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>

              {/* Format Buttons - Centered */}
              <div className="flex justify-center items-center">
                <div className="flex flex-wrap justify-center gap-1 max-w-xl">
                  {specs.formats.map((format) => (
                    <button
                      key={format.name}
                      onClick={() => handleFormatChange(format)}
                      className={`px-2 py-1 rounded text-xs font-medium transition-all duration-200 whitespace-nowrap ${
                        currentFormat.name === format.name
                          ? 'text-white shadow-md'
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
              
              {/* Controls - Compact */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {/* Canvas Background Colors */}
                  <div className="flex items-center space-x-1">
                    <span className="text-xs text-gray-400">BG:</span>
                    <div className="flex space-x-1">
                      {['#ffffff', '#f8f9fa', '#e9ecef', '#000000'].map((color) => (
                        <button
                          key={color}
                          onClick={() => setCanvasBackgroundColor(color)}
                          className={`w-4 h-4 rounded border hover:scale-110 transition-transform ${
                            canvasBackgroundColor === color ? 'border-white border-2' : 'border-gray-600'
                          }`}
                          style={{ backgroundColor: color }}
                          title={`Background: ${color}`}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setShowSafeZones(!showSafeZones)}
                    className={`px-2 py-1 rounded text-xs transition-colors ${
                      showSafeZones 
                        ? 'text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                    style={showSafeZones ? { backgroundColor: '#ff4940' } : {}}
                  >
                    Safe Zones
                  </button>
                  <button
                    onClick={resetCanvas}
                    className="p-1 rounded bg-gray-700 hover:bg-gray-600 transition-colors text-gray-300 hover:text-white"
                    title="Clear Canvas"
                  >
                    <RotateCcw className="w-3 h-3" />
                  </button>
                </div>
                
                {/* Zoom Controls */}
                <div className="flex items-center space-x-1">
                  <button
                    onClick={zoomOut}
                    className="p-1 rounded bg-gray-700 hover:bg-gray-600 transition-colors text-gray-300 hover:text-white"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-3 h-3" />
                  </button>
                  <span className="text-xs text-gray-300 px-1 min-w-0">
                    {Math.round(zoomLevel * 100)}%
                  </span>
                  <button
                    onClick={zoomIn}
                    className="p-1 rounded bg-gray-700 hover:bg-gray-600 transition-colors text-gray-300 hover:text-white"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-hidden pt-4">
        <div 
          ref={containerRef} 
          className="relative w-full h-full"
          style={{ 
            ...editorBackgroundStyle,
            transform: `translate(${panOffset.x}px, ${panOffset.y}px)`
          }}
        >
          {/* Canvas positioned within the container - fixed position to ensure consistency */}
          <div className="absolute inset-0 flex justify-center items-center">
            <div
              ref={canvasRef}
              data-canvas="true"
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
                backgroundColor: isDragOver ? '#ffffff' : canvasBackgroundColor,
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
                  onDelete={() => handleElementDelete(element.id)}
                  onDuplicate={() => handleElementDuplicate(element.id)}
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