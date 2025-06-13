import React, { useRef, useEffect, useState, useCallback } from 'react';
import { PlatformSpecs } from '../utils/platformSpecs';
import { SafeZones } from './SafeZones';
import { CanvasElement } from './CanvasElement';
import { useCanvas } from '../contexts/CanvasContext';
import { useTools } from '../contexts/ToolsContext';
import { useBackground } from '../contexts/BackgroundContext';
import { usePages } from '../contexts/PagesContext';
import { Download, RotateCcw, Upload, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
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
  const { currentPageId, updatePageElements, getCurrentPageElements, pages } = usePages();
  
  const specs = PlatformSpecs[platform as keyof typeof PlatformSpecs] || PlatformSpecs.instagram;
  const [currentFormat, setCurrentFormat] = useState(specs.formats[0]);
  const [showSafeZones, setShowSafeZones] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(0.6);

  useEffect(() => {
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

  useEffect(() => {
    updatePageElements(currentPageId, elements);
  }, [elements, currentPageId, updatePageElements]);

  useEffect(() => {
    const pageElements = getCurrentPageElements();
    if (JSON.stringify(elements) !== JSON.stringify(pageElements)) {
      clearCanvas();
      pageElements.forEach((element: any) => {
        addElement(element);
      });
    }
  }, [currentPageId]);

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      switch (selectedTool) {
        case 'selection':
        case 'direct-selection':
          selectElement(null);
          break;
        case 'text':
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
                fontFamily: 'Inter, system-ui, sans-serif',
              },
            });
          }
          break;
        default:
          selectElement(null);
      }
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
          color: '#1f2937',
          fontFamily: 'Inter, sans-serif',
        };
      case 'rectangle':
        return {
          backgroundColor: '#e5e7eb',
          borderRadius: '8px',
        };
      case 'circle':
        return {
          backgroundColor: '#e5e7eb',
        };
      default:
        return {};
    }
  };

  const exportCanvas = async () => {
    if (!canvasRef.current) return;
    
    try {
      selectElement(null);
      await new Promise(resolve => setTimeout(resolve, 50));
      
      const canvas = await html2canvas(canvasRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
        logging: false,
      });
      
      const image = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.download = `${specs.name}-${currentFormat.name}-${Date.now()}.png`;
      link.href = image;
      link.click();
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const zoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.1, 2));
  };
  
  const zoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.1, 0.3));
  };

  const fitToScreen = () => {
    setZoomLevel(0.6);
  };

  const resetCanvas = () => {
    clearCanvas();
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-900">
      {/* Top Controls */}
      <div className="flex items-center justify-between p-4 bg-slate-800 border-b border-slate-700">
        <div className="flex items-center space-x-4">
          <div className="text-sm text-slate-300">
            {currentFormat.name} • {currentFormat.width} × {currentFormat.height}
          </div>
          
          <div className="h-4 w-px bg-slate-600"></div>
          
          <button
            onClick={() => setShowSafeZones(!showSafeZones)}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              showSafeZones 
                ? 'bg-blue-600 text-white' 
                : 'text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            Safe Zones
          </button>
          
          <button
            onClick={resetCanvas}
            className="flex items-center space-x-2 px-3 py-1.5 text-sm text-slate-300 hover:bg-slate-700 hover:text-white rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={zoomOut}
            className="p-2 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={fitToScreen}
            className="px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white rounded-lg border border-slate-600"
            title="Fit to Screen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <span className="text-sm text-slate-300 min-w-[60px] text-center">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            onClick={zoomIn}
            className="p-2 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={exportCanvas}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="relative">
          {/* Canvas */}
          <div
            ref={canvasRef}
            className="relative bg-white shadow-lg overflow-hidden rounded-lg"
            style={{
              width: `${currentFormat.width * zoomLevel}px`,
              height: `${currentFormat.height * zoomLevel}px`,
              transform: `scale(1)`,
              transformOrigin: 'center',
              cursor: getToolCursor(selectedTool)
            }}
            onClick={handleCanvasClick}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <div
              style={{
                width: `${currentFormat.width}px`,
                height: `${currentFormat.height}px`,
                transform: `scale(${zoomLevel})`,
                transformOrigin: 'top left',
                backgroundColor: canvasBackgroundColor,
              }}
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
                    <Upload className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">Start designing your post</p>
                    <p className="text-sm">Drop elements, images, or select a template</p>
                  </div>
                </div>
              )}

              {isDragOver && (
                <div className="absolute inset-0 bg-blue-100 bg-opacity-50 flex items-center justify-center rounded-lg">
                  <div className="text-center text-blue-600">
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