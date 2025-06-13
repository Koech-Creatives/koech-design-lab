import React, { useRef, useEffect, useState } from 'react';
import { 
  Monitor, 
  Smartphone, 
  Tablet, 
  Maximize, 
  Minimize,
  RotateCcw,
  Eye
} from 'lucide-react';

interface PreviewPanelProps {
  html: string;
  css: string;
  dimensions: {
    width: number;
    height: number;
    name: string;
  };
}

export function PreviewPanel({ html, css, dimensions }: PreviewPanelProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [scale, setScale] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Update iframe content when HTML/CSS changes
  useEffect(() => {
    if (iframeRef.current) {
      const iframe = iframeRef.current;
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      
      if (doc) {
        const fullHTML = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Template Preview</title>
            <style>
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
              
              body {
                width: ${dimensions.width}px;
                height: ${dimensions.height}px;
                overflow: hidden;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              }
              
              ${css}
            </style>
          </head>
          <body>
            ${html}
          </body>
          </html>
        `;
        
        doc.open();
        doc.write(fullHTML);
        doc.close();
      }
    }
  }, [html, css, dimensions]);

  // Calculate optimal scale to fit preview
  useEffect(() => {
    if (containerRef.current && !isFullscreen) {
      const container = containerRef.current;
      const containerWidth = container.clientWidth - 40; // padding
      const containerHeight = container.clientHeight - 40; // padding
      
      const scaleX = containerWidth / dimensions.width;
      const scaleY = containerHeight / dimensions.height;
      const optimalScale = Math.min(scaleX, scaleY, 1);
      
      setScale(optimalScale);
    }
  }, [dimensions, isFullscreen]);

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (!isFullscreen) {
      setScale(1);
    }
  };

  const handleFitToScreen = () => {
    if (containerRef.current) {
      const container = containerRef.current;
      const containerWidth = container.clientWidth - 40;
      const containerHeight = container.clientHeight - 40;
      
      const scaleX = containerWidth / dimensions.width;
      const scaleY = containerHeight / dimensions.height;
      const optimalScale = Math.min(scaleX, scaleY, 1);
      
      setScale(optimalScale);
    }
  };

  const scaleOptions = [0.25, 0.5, 0.75, 1, 1.25, 1.5];

  return (
    <div className="flex-1 flex flex-col" style={{ backgroundColor: '#1a1a1a' }}>
      {/* Preview Header */}
      <div className="border-b px-6 py-3" style={{ backgroundColor: '#002e51', borderColor: '#004080' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Eye className="w-5 h-5 text-gray-400" />
              <span className="text-white font-medium">Preview</span>
            </div>
            <div className="text-sm text-gray-400">
              {dimensions.name} • {dimensions.width}×{dimensions.height}
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Scale Selector */}
            <select
              value={scale}
              onChange={(e) => setScale(parseFloat(e.target.value))}
              className="px-2 py-1 rounded text-sm"
              style={{ 
                backgroundColor: '#003a63', 
                borderColor: '#004080',
                color: 'white'
              }}
            >
              {scaleOptions.map(option => (
                <option key={option} value={option}>
                  {Math.round(option * 100)}%
                </option>
              ))}
            </select>

            {/* Fit to Screen */}
            <button
              onClick={handleFitToScreen}
              className="p-2 rounded-lg text-gray-400 hover:text-white transition-colors"
              style={{ backgroundColor: '#003a63' }}
              title="Fit to screen"
            >
              <Maximize className="w-4 h-4" />
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={handleFullscreen}
              className="p-2 rounded-lg text-gray-400 hover:text-white transition-colors"
              style={{ backgroundColor: '#003a63' }}
              title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Monitor className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Preview Content */}
      <div 
        ref={containerRef}
        className={`flex-1 flex items-center justify-center p-5 overflow-auto ${
          isFullscreen ? 'fixed inset-0 z-50 bg-black' : ''
        }`}
        style={{ backgroundColor: isFullscreen ? '#000' : '#1a1a1a' }}
      >
        <div 
          className="relative"
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'center center',
          }}
        >
          {/* Device Frame */}
          <div 
            className="relative bg-white shadow-2xl"
            style={{
              width: dimensions.width,
              height: dimensions.height,
              borderRadius: '8px',
              overflow: 'hidden'
            }}
          >
            {/* Preview iframe */}
            <iframe
              ref={iframeRef}
              className="w-full h-full border-0"
              style={{
                width: dimensions.width,
                height: dimensions.height,
              }}
              title="Template Preview"
            />
          </div>

          {/* Dimension Labels */}
          {!isFullscreen && (
            <>
              {/* Width label */}
              <div 
                className="absolute -bottom-8 left-0 right-0 flex justify-center"
              >
                <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded">
                  {dimensions.width}px
                </div>
              </div>
              
              {/* Height label */}
              <div 
                className="absolute -right-12 top-0 bottom-0 flex items-center"
              >
                <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded transform -rotate-90">
                  {dimensions.height}px
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Preview Info */}
      {!isFullscreen && (
        <div className="border-t px-6 py-3" style={{ backgroundColor: '#002e51', borderColor: '#004080' }}>
          <div className="flex items-center justify-between text-sm">
            <div className="text-gray-400">
              Scale: {Math.round(scale * 100)}% • {dimensions.width}×{dimensions.height}
            </div>
            <div className="text-gray-400">
              Real-time preview with your brand settings
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Exit Hint */}
      {isFullscreen && (
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={handleFullscreen}
            className="bg-black/50 text-white px-4 py-2 rounded-lg backdrop-blur-sm hover:bg-black/70 transition-colors"
          >
            Press ESC or click to exit fullscreen
          </button>
        </div>
      )}
    </div>
  );
} 