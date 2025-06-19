import React from 'react';
import { Hand, Pipette, Type, Minus, PaintBucket, FilePlus } from 'lucide-react';
import { useTools } from '../contexts/ToolsContext';

interface Tool {
  id: string;
  name: string;
  icon: React.ReactNode;
  cursor: string;
  hotkey?: string;
}

export function ToolsPanel() {
  const { selectedTool, setSelectedTool } = useTools();
  const tools: Tool[] = [
    {
      id: 'selection',
      name: 'Selection',
      icon: <img src="/selection-tool.svg" alt="Selection" className="w-3.5 h-3.5" />,
      cursor: 'url(/selection-tool.svg) 2 2, auto',
      hotkey: 'V'
    },
    {
      id: 'direct-selection',
      name: 'Direct',
      icon: <img src="/direct-selection-tool.svg" alt="Direct Selection" className="w-3.5 h-3.5" />,
      cursor: 'url(/direct-selection-tool.svg) 2 2, auto',
      hotkey: 'A'
    },
    {
      id: 'hand',
      name: 'Hand',
      icon: <Hand className="w-3.5 h-3.5" />,
      cursor: 'grab',
      hotkey: 'H'
    },
    {
      id: 'color-picker',
      name: 'Picker',
      icon: <Pipette className="w-3.5 h-3.5" />,
      cursor: 'crosshair',
      hotkey: 'I'
    },
    {
      id: 'text',
      name: 'Text',
      icon: <Type className="w-3.5 h-3.5" />,
      cursor: 'text',
      hotkey: 'T'
    },
    {
      id: 'line',
      name: 'Line',
      icon: <Minus className="w-3.5 h-3.5" />,
      cursor: 'crosshair',
      hotkey: 'L'
    },
    {
      id: 'stroke',
      name: 'Stroke',
      icon: <PaintBucket className="w-3.5 h-3.5" />,
      cursor: 'crosshair',
      hotkey: 'S'
    },
    {
      id: 'page',
      name: 'Page',
      icon: <FilePlus className="w-3.5 h-3.5" />,
      cursor: 'pointer',
      hotkey: 'P'
    }
  ];

  return (
    <div className="p-3 space-y-3">
      <h2 className="text-xs font-semibold text-white">Tools</h2>
      
      <div className="grid grid-cols-2 gap-1">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => setSelectedTool(tool.id)}
            className={`p-2 rounded transition-all duration-200 flex flex-col items-center space-y-1 group ${
              selectedTool === tool.id
                ? 'text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
            style={selectedTool === tool.id ? { backgroundColor: '#ff4940' } : { backgroundColor: '#003a63' }}
            onMouseEnter={(e) => {
              if (selectedTool !== tool.id) {
                e.currentTarget.style.backgroundColor = '#004080';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedTool !== tool.id) {
                e.currentTarget.style.backgroundColor = '#003a63';
              }
            }}
            title={`${tool.name} (${tool.hotkey})`}
          >
            {tool.icon}
            <span className="text-xs font-medium text-center leading-tight">{tool.name}</span>
            {tool.hotkey && (
              <span className="text-xs opacity-60 font-mono">{tool.hotkey}</span>
            )}
          </button>
        ))}
      </div>

      {/* Tool Info */}
      <div className="p-2 rounded text-xs" style={{ backgroundColor: '#003a63' }}>
        <div className="text-gray-300">
          <span className="font-medium">Active:</span> {tools.find(t => t.id === selectedTool)?.name || 'None'}
        </div>
        <div className="text-gray-400 mt-1">
          <span className="font-mono text-white">{tools.find(t => t.id === selectedTool)?.hotkey}</span> key
        </div>
      </div>
    </div>
  );
} 