import React from 'react';

interface SlidePreviewProps {
  width: number;
  height: number;
  children: React.ReactNode;
  scale?: number;
  className?: string;
  platform?: string;
}

export function SlidePreview({ 
  width, 
  height, 
  children, 
  scale = 0.3, 
  className = '',
  platform 
}: SlidePreviewProps) {
  const containerStyle = {
    width: width * scale,
    height: height * scale,
    transform: `scale(${scale})`,
    transformOrigin: 'top left',
  };

  const contentStyle = {
    width: width,
    height: height,
  };

  return (
    <div className={`relative bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm ${className}`}>
      {platform && (
        <div className="absolute top-2 left-2 z-10 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs font-medium">
          {platform}
        </div>
      )}
      <div style={containerStyle}>
        <div style={contentStyle} className="overflow-hidden bg-white">
          {children}
        </div>
      </div>
      <div className="absolute bottom-2 right-2 text-xs text-gray-500 bg-white bg-opacity-90 px-2 py-1 rounded">
        {width} × {height}
      </div>
    </div>
  );
} 