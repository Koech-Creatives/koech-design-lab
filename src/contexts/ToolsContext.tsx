import React, { createContext, useContext, useState, useEffect } from 'react';

interface Tool {
  id: string;
  name: string;
  cursor: string;
  hotkey?: string;
}

interface ToolsContextType {
  selectedTool: string;
  setSelectedTool: (toolId: string) => void;
  getToolCursor: (toolId: string) => string;
  tools: Tool[];
}

const ToolsContext = createContext<ToolsContextType | undefined>(undefined);

const tools: Tool[] = [
  {
    id: 'selection',
    name: 'Selection Tool',
    cursor: 'url(/selection-tool.svg) 12 12, pointer',
    hotkey: 'V'
  },
  {
    id: 'direct-selection',
    name: 'Direct Selection Tool',
    cursor: 'url(/direct-selection-tool.svg) 12 12, pointer',
    hotkey: 'A'
  },
  {
    id: 'hand',
    name: 'Hand Tool',
    cursor: 'grab',
    hotkey: 'H'
  },
  {
    id: 'color-picker',
    name: 'Color Picker',
    cursor: 'crosshair',
    hotkey: 'I'
  },
  {
    id: 'text',
    name: 'Text Tool',
    cursor: 'text',
    hotkey: 'T'
  },
  {
    id: 'line',
    name: 'Line Tool',
    cursor: 'crosshair',
    hotkey: 'L'
  },
  {
    id: 'stroke',
    name: 'Stroke Tool',
    cursor: 'crosshair',
    hotkey: 'S'
  },
  {
    id: 'page',
    name: 'Page Tool',
    cursor: 'pointer',
    hotkey: 'P'
  }
];

export function ToolsProvider({ children }: { children: React.ReactNode }) {
  const [selectedTool, setSelectedTool] = useState('selection');

  const getToolCursor = (toolId: string): string => {
    const tool = tools.find(t => t.id === toolId);
    return tool?.cursor || 'default';
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Only trigger if no input/textarea is focused
      if (document.activeElement?.tagName === 'INPUT' || 
          document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }

      const key = event.key.toLowerCase();
      const tool = tools.find(t => t.hotkey?.toLowerCase() === key);
      
      if (tool) {
        console.log('Keyboard shortcut triggered:', key, 'for tool:', tool.name);
        event.preventDefault();
        setSelectedTool(tool.id);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const value: ToolsContextType = {
    selectedTool,
    setSelectedTool,
    getToolCursor,
    tools
  };

  return (
    <ToolsContext.Provider value={value}>
      {children}
    </ToolsContext.Provider>
  );
}

export function useTools() {
  const context = useContext(ToolsContext);
  if (context === undefined) {
    throw new Error('useTools must be used within a ToolsProvider');
  }
  return context;
} 