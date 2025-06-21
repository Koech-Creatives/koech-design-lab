import React from 'react';
import { useCanvas } from '../contexts/CanvasContext';
import { 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignHorizontalJustifyCenter,
  AlignVerticalJustifyCenter,
  AlignHorizontalJustifyStart,
  AlignHorizontalJustifyEnd,
  AlignVerticalJustifyStart,
  AlignVerticalJustifyEnd,
  Target
} from 'lucide-react';

interface AlignmentPanelProps {
  canvasFormat: { width: number; height: number };
}

export function AlignmentPanel({ canvasFormat }: AlignmentPanelProps) {
  const { selectedElement, updateElement, elements } = useCanvas();
  
  const selectedEl = elements.find(el => el.id === selectedElement);

  const alignElement = (alignment: string) => {
    if (!selectedEl) return;

    let newX = selectedEl.x;
    let newY = selectedEl.y;

    switch (alignment) {
      case 'left':
        newX = 0;
        break;
      case 'center-horizontal':
        newX = (canvasFormat.width - selectedEl.width) / 2;
        break;
      case 'right':
        newX = canvasFormat.width - selectedEl.width;
        break;
      case 'top':
        newY = 0;
        break;
      case 'center-vertical':
        newY = (canvasFormat.height - selectedEl.height) / 2;
        break;
      case 'bottom':
        newY = canvasFormat.height - selectedEl.height;
        break;
      case 'center':
        newX = (canvasFormat.width - selectedEl.width) / 2;
        newY = (canvasFormat.height - selectedEl.height) / 2;
        break;
    }

    updateElement(selectedEl.id, { x: newX, y: newY });
  };

  const alignmentButtons = [
    { id: 'left', icon: AlignHorizontalJustifyStart, label: 'Align Left', action: () => alignElement('left') },
    { id: 'center-h', icon: AlignHorizontalJustifyCenter, label: 'Center Horizontal', action: () => alignElement('center-horizontal') },
    { id: 'right', icon: AlignHorizontalJustifyEnd, label: 'Align Right', action: () => alignElement('right') },
    { id: 'top', icon: AlignVerticalJustifyStart, label: 'Align Top', action: () => alignElement('top') },
    { id: 'center-v', icon: AlignVerticalJustifyCenter, label: 'Center Vertical', action: () => alignElement('center-vertical') },
    { id: 'bottom', icon: AlignVerticalJustifyEnd, label: 'Align Bottom', action: () => alignElement('bottom') }
  ];

  return (
    <div className="p-3 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold text-white">Alignment</h2>
        {selectedEl && (
          <div className="text-xs text-gray-400">{selectedEl.type}</div>
        )}
      </div>

      {selectedEl ? (
        <>
          {/* Quick Center Button */}
          <div className="rounded p-3" style={{ backgroundColor: '#003a63' }}>
            <button
              onClick={() => alignElement('center')}
              className="w-full p-3 rounded transition-all duration-200 flex items-center justify-center space-x-2 text-white font-medium"
              style={{ backgroundColor: '#ff4940' }}
              title="Center element on canvas"
            >
              <Target className="w-4 h-4" />
              <span>Quick Center</span>
            </button>
          </div>

          {/* Alignment Grid */}
          <div className="rounded p-3" style={{ backgroundColor: '#003a63' }}>
            <h3 className="text-xs font-medium text-gray-300 mb-3">Canvas Alignment</h3>
            <div className="grid grid-cols-3 gap-2">
              {alignmentButtons.map((button) => {
                const Icon = button.icon;
                return (
                  <button
                    key={button.id}
                    onClick={button.action}
                    className="p-3 rounded transition-all duration-200 flex items-center justify-center hover:bg-gray-600 text-gray-300 hover:text-white"
                    style={{ backgroundColor: '#004080' }}
                    title={button.label}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Position Info */}
          <div className="rounded p-3" style={{ backgroundColor: '#003a63' }}>
            <h3 className="text-xs font-medium text-gray-300 mb-2">Position Info</h3>
            <div className="space-y-1 text-xs text-gray-400">
              <div>X: {Math.round(selectedEl.x || 0)}px</div>
              <div>Y: {Math.round(selectedEl.y || 0)}px</div>
              <div>Size: {Math.round(selectedEl.width || 0)} × {Math.round(selectedEl.height || 0)}px</div>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-8">
          <Target className="w-12 h-12 mx-auto mb-3 text-gray-500" />
          <p className="text-gray-400 text-sm">Select an element</p>
          <p className="text-gray-500 text-xs mt-1">Choose an element to align it on the canvas</p>
        </div>
      )}
    </div>
  );
} 