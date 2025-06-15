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
  Move3D
} from 'lucide-react';

interface AlignmentPanelProps {
  canvasFormat: { width: number; height: number };
}

export function AlignmentPanel({ canvasFormat }: AlignmentPanelProps) {
  const { elements, selectedElement, updateElement } = useCanvas();
  
  const selectedElements = selectedElement 
    ? elements.filter(el => el.id === selectedElement)
    : []; // Support multiple selection in future

  if (selectedElements.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
          <Move3D className="w-4 h-4 mr-2 text-indigo-400" />
          Alignment
        </h3>
        <div className="text-center py-4">
          <p className="text-gray-400 text-xs">Select an element to align</p>
        </div>
      </div>
    );
  }

  // Calculate bounds for selected elements - using flat x, y, width, height properties
  const getElementBounds = (element: any) => ({
    left: element.x,
    right: element.x + element.width,
    top: element.y,
    bottom: element.y + element.height,
    centerX: element.x + element.width / 2,
    centerY: element.y + element.height / 2,
  });

  const getSelectionBounds = () => {
    if (selectedElements.length === 0) return null;
    
    const bounds = selectedElements.map(getElementBounds);
    return {
      left: Math.min(...bounds.map(b => b.left)),
      right: Math.max(...bounds.map(b => b.right)),
      top: Math.min(...bounds.map(b => b.top)),
      bottom: Math.max(...bounds.map(b => b.bottom)),
      centerX: (Math.min(...bounds.map(b => b.left)) + Math.max(...bounds.map(b => b.right))) / 2,
      centerY: (Math.min(...bounds.map(b => b.top)) + Math.max(...bounds.map(b => b.bottom))) / 2,
    };
  };

  // Alignment functions - using flat x, y properties
  const alignToCanvas = (alignment: string) => {
    selectedElements.forEach(element => {
      let updates: any = {};

      switch (alignment) {
        case 'canvas-left':
          updates.x = 0;
          break;
        case 'canvas-center-horizontal':
          updates.x = (canvasFormat.width - element.width) / 2;
          break;
        case 'canvas-right':
          updates.x = canvasFormat.width - element.width;
          break;
        case 'canvas-top':
          updates.y = 0;
          break;
        case 'canvas-center-vertical':
          updates.y = (canvasFormat.height - element.height) / 2;
          break;
        case 'canvas-bottom':
          updates.y = canvasFormat.height - element.height;
          break;
        case 'canvas-center':
          updates.x = (canvasFormat.width - element.width) / 2;
          updates.y = (canvasFormat.height - element.height) / 2;
          break;
      }

      updateElement(element.id, updates);
    });
  };

  const alignToSelection = (alignment: string) => {
    if (selectedElements.length < 2) return;
    
    const selectionBounds = getSelectionBounds();
    if (!selectionBounds) return;

    selectedElements.forEach(element => {
      let updates: any = {};

      switch (alignment) {
        case 'selection-left':
          updates.x = selectionBounds.left;
          break;
        case 'selection-center-horizontal':
          updates.x = selectionBounds.centerX - element.width / 2;
          break;
        case 'selection-right':
          updates.x = selectionBounds.right - element.width;
          break;
        case 'selection-top':
          updates.y = selectionBounds.top;
          break;
        case 'selection-center-vertical':
          updates.y = selectionBounds.centerY - element.height / 2;
          break;
        case 'selection-bottom':
          updates.y = selectionBounds.bottom - element.height;
          break;
      }

      updateElement(element.id, updates);
    });
  };

  const distributeElements = (direction: 'horizontal' | 'vertical') => {
    if (selectedElements.length < 3) return;

    const sortedElements = [...selectedElements].sort((a, b) => {
      if (direction === 'horizontal') {
        return a.x - b.x;
      } else {
        return a.y - b.y;
      }
    });

    const first = sortedElements[0];
    const last = sortedElements[sortedElements.length - 1];
    
    if (direction === 'horizontal') {
      const totalSpace = (last.x + last.width) - first.x;
      const totalElementWidth = sortedElements.reduce((sum, el) => sum + el.width, 0);
      const availableSpace = totalSpace - totalElementWidth;
      const spacing = availableSpace / (sortedElements.length - 1);
      
      let currentX = first.x;
      sortedElements.forEach((element, index) => {
        if (index > 0) {
          updateElement(element.id, { x: currentX });
        }
        currentX += element.width + spacing;
      });
    } else {
      const totalSpace = (last.y + last.height) - first.y;
      const totalElementHeight = sortedElements.reduce((sum, el) => sum + el.height, 0);
      const availableSpace = totalSpace - totalElementHeight;
      const spacing = availableSpace / (sortedElements.length - 1);
      
      let currentY = first.y;
      sortedElements.forEach((element, index) => {
        if (index > 0) {
          updateElement(element.id, { y: currentY });
        }
        currentY += element.height + spacing;
      });
    }
  };

  const alignmentButtons = [
    // Canvas alignment
    { id: 'canvas-left', icon: AlignHorizontalJustifyStart, label: 'Align to Canvas Left', action: () => alignToCanvas('canvas-left') },
    { id: 'canvas-center-horizontal', icon: AlignHorizontalJustifyCenter, label: 'Center Horizontally on Canvas', action: () => alignToCanvas('canvas-center-horizontal') },
    { id: 'canvas-right', icon: AlignHorizontalJustifyEnd, label: 'Align to Canvas Right', action: () => alignToCanvas('canvas-right') },
    { id: 'canvas-top', icon: AlignVerticalJustifyStart, label: 'Align to Canvas Top', action: () => alignToCanvas('canvas-top') },
    { id: 'canvas-center-vertical', icon: AlignVerticalJustifyCenter, label: 'Center Vertically on Canvas', action: () => alignToCanvas('canvas-center-vertical') },
    { id: 'canvas-bottom', icon: AlignVerticalJustifyEnd, label: 'Align to Canvas Bottom', action: () => alignToCanvas('canvas-bottom') },
  ];

  const selectionAlignmentButtons = selectedElements.length > 1 ? [
    { id: 'selection-left', icon: AlignLeft, label: 'Align Left', action: () => alignToSelection('selection-left') },
    { id: 'selection-center-horizontal', icon: AlignCenter, label: 'Center Horizontally', action: () => alignToSelection('selection-center-horizontal') },
    { id: 'selection-right', icon: AlignRight, label: 'Align Right', action: () => alignToSelection('selection-right') },
    { id: 'selection-top', icon: AlignVerticalJustifyStart, label: 'Align Top', action: () => alignToSelection('selection-top') },
    { id: 'selection-center-vertical', icon: AlignVerticalJustifyCenter, label: 'Center Vertically', action: () => alignToSelection('selection-center-vertical') },
    { id: 'selection-bottom', icon: AlignVerticalJustifyEnd, label: 'Align Bottom', action: () => alignToSelection('selection-bottom') },
  ] : [];

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-white mb-3 flex items-center">
        <Move3D className="w-4 h-4 mr-2 text-red-400" />
        Alignment
        <span className="ml-2 text-xs text-gray-400">
          ({selectedElements.length} selected)
        </span>
      </h3>

      {/* Quick Center Button */}
      <div className="mb-4">
        <button
          onClick={() => alignToCanvas('canvas-center')}
          className="w-full px-4 py-2 rounded-lg text-white font-medium transition-all duration-200 hover:opacity-90 flex items-center justify-center space-x-2"
          style={{ backgroundColor: '#ff4940' }}
          title="Center element on canvas (default alignment)"
        >
          <Move3D className="w-4 h-4" />
          <span>Center on Canvas</span>
        </button>
      </div>

      {/* Canvas Alignment */}
      <div className="bg-gray-800 rounded-lg p-3">
        <h4 className="text-xs font-medium text-gray-300 mb-2 uppercase tracking-wide">
          Align to Canvas
        </h4>
        <div className="grid grid-cols-3 gap-2">
          {alignmentButtons.map((button) => {
            const Icon = button.icon;
            return (
              <button
                key={button.id}
                onClick={button.action}
                className="p-2 rounded-lg transition-colors flex items-center justify-center"
                style={{ backgroundColor: '#003a63' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#004080';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#003a63';
                }}
                title={button.label}
              >
                <Icon className="w-4 h-4 text-gray-300 hover:text-white" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Selection Alignment (only show if multiple elements) */}
      {selectedElements.length > 1 && (
        <div>
          <h4 className="text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">
            Align to Selection
          </h4>
          <div className="grid grid-cols-3 gap-2">
            {selectionAlignmentButtons.map((button) => {
              const Icon = button.icon;
              return (
                <button
                  key={button.id}
                  onClick={button.action}
                  className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors flex items-center justify-center"
                  title={button.label}
                >
                  <Icon className="w-4 h-4 text-gray-300 hover:text-white" />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Distribution (only show if 3+ elements) */}
      {selectedElements.length >= 3 && (
        <div>
          <h4 className="text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">
            Distribute
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => distributeElements('horizontal')}
              className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors flex items-center justify-center"
              title="Distribute Horizontally"
            >
              <AlignHorizontalJustifyCenter className="w-4 h-4 text-gray-300 hover:text-white" />
              <span className="ml-1 text-xs">H</span>
            </button>
            <button
              onClick={() => distributeElements('vertical')}
              className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors flex items-center justify-center"
              title="Distribute Vertically"
            >
              <AlignVerticalJustifyCenter className="w-4 h-4 text-gray-300 hover:text-white" />
              <span className="ml-1 text-xs">V</span>
            </button>
          </div>
        </div>
      )}

      {/* Alignment Tips */}
      <div className="text-xs text-gray-500 bg-gray-900 rounded-lg p-3">
        <p className="mb-1">💡 <strong>Tips:</strong></p>
        <ul className="space-y-1 text-gray-400">
          <li>• All elements default to center alignment</li>
          <li>• Use canvas alignment for precise positioning</li>
          {selectedElements.length > 1 && <li>• Selection alignment works with multiple elements</li>}
          {selectedElements.length >= 3 && <li>• Distribution evenly spaces 3+ elements</li>}
        </ul>
      </div>
    </div>
  );
} 