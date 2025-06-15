import React from 'react';
import { AlignmentPanel } from './AlignmentPanel';

interface AlignmentTabProps {
  currentFormat: { width: number; height: number };
}

export function AlignmentTab({ currentFormat }: AlignmentTabProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-lg font-semibold text-white mb-2">Alignment Tools</h2>
        <p className="text-sm text-gray-400">
          Professional alignment controls for your design elements
        </p>
      </div>
      
      <AlignmentPanel canvasFormat={currentFormat} />
      
      {/* Additional alignment features can be added here */}
      <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-300 mb-3">Alignment Shortcuts</h3>
        <div className="space-y-2 text-xs text-gray-400">
          <div className="flex justify-between">
            <span>Center on Canvas:</span>
            <span className="text-gray-300">Default for new elements</span>
          </div>
          <div className="flex justify-between">
            <span>Align Left:</span>
            <span className="text-gray-300">Cmd/Ctrl + Shift + L</span>
          </div>
          <div className="flex justify-between">
            <span>Align Center:</span>
            <span className="text-gray-300">Cmd/Ctrl + Shift + C</span>
          </div>
          <div className="flex justify-between">
            <span>Align Right:</span>
            <span className="text-gray-300">Cmd/Ctrl + Shift + R</span>
          </div>
        </div>
      </div>
    </div>
  );
} 