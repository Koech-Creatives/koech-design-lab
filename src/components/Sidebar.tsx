import React, { useState } from 'react';
import { ElementsPanel } from './ElementsPanel';
import { ToolsPanel } from './ToolsPanel';
import { TextTab } from './TextTab';
import { useCanvas } from '../contexts/CanvasContext';
import { 
  Type, 
  MousePointer,
  ChevronLeft,
  ChevronRight,
  Layers
} from 'lucide-react';

interface SidebarProps {
  currentFormat: { width: number; height: number };
}

const tabs = [
  { id: 'tools', name: 'Tools', icon: MousePointer },
  { id: 'text', name: 'Text', icon: Type },
  { id: 'elements', name: 'Elements', icon: Layers },
];

export function Sidebar({ currentFormat }: SidebarProps) {
  const [activeTab, setActiveTab] = useState('tools');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { addElement } = useCanvas();

  const renderPanel = () => {
    switch (activeTab) {
      case 'tools':
        return <ToolsPanel />;
      case 'text':
        return <TextTab onAddElement={addElement} />;
      case 'elements':
        return <ElementsPanel onAddElement={addElement} />;
      default:
        return null;
    }
  };

  if (isCollapsed) {
    return (
      <div className="w-12 border-r flex flex-col" style={{ backgroundColor: '#002e51', borderColor: '#004080' }}>
        <div className="flex flex-col space-y-1 p-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsCollapsed(false);
                }}
                className={`p-2 rounded transition-all duration-200 flex items-center justify-center ${
                  activeTab === tab.id
                    ? 'text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
                style={activeTab === tab.id ? { backgroundColor: '#ff4940' } : { backgroundColor: 'transparent' }}
                title={tab.name}
              >
                <Icon className="w-3.5 h-3.5" />
              </button>
            );
          })}
        </div>
        <div className="mt-auto p-1">
          <button 
            onClick={() => setIsCollapsed(false)}
            className="p-2 rounded text-gray-400 hover:text-white transition-colors w-full flex items-center justify-center"
            title="Expand sidebar"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-64 border-r flex flex-col" style={{ backgroundColor: '#002e51', borderColor: '#004080' }}>
      <div className="flex items-center justify-between p-3 border-b" style={{ borderColor: '#004080' }}>
        <h2 className="text-xs font-semibold text-white">Design Tools</h2>
        <button 
          onClick={() => setIsCollapsed(true)}
          className="p-1 rounded text-gray-400 hover:text-white transition-colors"
          title="Collapse sidebar"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
      </div>
      
      <div className="flex border-b" style={{ borderColor: '#004080' }}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-2 py-2 text-xs font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-white border-b-2'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
              style={activeTab === tab.id ? { borderBottomColor: '#ff4940' } : {}}
            >
              <div className="flex items-center justify-center space-x-1">
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">{tab.name}</span>
              </div>
            </button>
          );
        })}
      </div>
      
      <div className="flex-1 overflow-auto">
        {renderPanel()}
      </div>
    </div>
  );
}