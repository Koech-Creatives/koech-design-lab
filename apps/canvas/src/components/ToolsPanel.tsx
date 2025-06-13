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
      name: 'Selection Tool',
      icon: <img src="/selection-tool.svg" alt="Selection" className="w-5 h-5" />,
      cursor: 'url(/selection-tool.svg) 2 2, auto',
      hotkey: 'V'
    },
    {
      id: 'direct-selection',
      name: 'Direct Selection Tool',
      icon: <img src="/direct-selection-tool.svg" alt="Direct Selection" className="w-5 h-5" />,
      cursor: 'url(/direct-selection-tool.svg) 2 2, auto',
      hotkey: 'A'
    },
    {
      id: 'hand',
      name: 'Hand Tool',
      icon: <Hand className="w-5 h-5" />,
      cursor: 'grab',
      hotkey: 'H'
    },
    {
      id: 'color-picker',
      name: 'Color Picker',
      icon: <Pipette className="w-5 h-5" />,
      cursor: 'crosshair',
      hotkey: 'I'
    },
    {
      id: 'text',
      name: 'Text Tool',
      icon: <Type className="w-5 h-5" />,
      cursor: 'text',
      hotkey: 'T'
    },
    {
      id: 'line',
      name: 'Line Tool',
      icon: <Minus className="w-5 h-5" />,
      cursor: 'crosshair',
      hotkey: 'L'
    },
    {
      id: 'stroke',
      name: 'Stroke Tool',
      icon: <PaintBucket className="w-5 h-5" />,
      cursor: 'crosshair',
      hotkey: 'S'
    },
    {
      id: 'page',
      name: 'Page Tool',
      icon: <FilePlus className="w-5 h-5" />,
      cursor: 'pointer',
      hotkey: 'P'
    }
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-white">Tools</h2>
      
      <div className="grid grid-cols-2 gap-2">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => setSelectedTool(tool.id)}
            className={`p-3 rounded-lg transition-all duration-200 flex flex-col items-center space-y-1 group ${
              selectedTool === tool.id
                ? 'text-white shadow-lg'
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
      <div className="p-3 rounded-lg" style={{ backgroundColor: '#003a63' }}>
        <div className="text-xs text-gray-300">
          <span className="font-medium">Active:</span> {tools.find(t => t.id === selectedTool)?.name || 'None'}
        </div>
        <div className="text-xs text-gray-400 mt-1">
          Hotkey: <span className="font-mono text-white">{tools.find(t => t.id === selectedTool)?.hotkey}</span>
        </div>
        <div className="text-xs text-gray-400 mt-1">
          Click or use keyboard shortcuts to switch
        </div>
      </div>
    </div>
  );
} 