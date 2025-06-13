import React, { useState } from 'react';
import { X, TestTube, AlertCircle } from 'lucide-react';

export function BetaBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div 
      className="relative px-4 py-2 text-center text-sm border-b"
      style={{ 
        backgroundColor: '#ff4940', 
        borderColor: '#ff6b5a',
        color: 'white'
      }}
    >
      <div className="flex items-center justify-center space-x-2">
        <TestTube className="w-4 h-4" />
        <span className="font-medium">
          🧪 Early Access Beta - Your feedback shapes the future!
        </span>
        <AlertCircle className="w-4 h-4" />
      </div>
      
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded hover:bg-red-600 transition-colors"
        title="Dismiss banner"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
} 