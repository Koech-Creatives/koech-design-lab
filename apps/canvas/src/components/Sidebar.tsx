import React, { useState } from 'react';
import { TemplatePanel } from './TemplatePanel';
import { ElementsPanel } from './ElementsPanel';
import { ToolsPanel } from './ToolsPanel';
import { ProjectsPanel } from './ProjectsPanel';
import { 
  Layout, 
  Type, 
  MousePointer,
  ChevronLeft,
  ChevronRight,
  Folder
} from 'lucide-react';

interface SidebarProps {
  selectedPlatform: string;
  selectedTemplate: any;
  onTemplateSelect: (template: any) => void;
}

const tabs = [
  { id: 'projects', name: 'Projects', icon: Folder },
  { id: 'tools', name: 'Tools', icon: MousePointer },
  { id: 'templates', name: 'Templates', icon: Layout },
  { id: 'elements', name: 'Elements', icon: Type },
];

export function Sidebar({ selectedPlatform, selectedTemplate, onTemplateSelect }: SidebarProps) {
  const [activeTab, setActiveTab] = useState('projects');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const renderPanel = () => {
    switch (activeTab) {
      case 'projects':
        return <ProjectsPanel />;
      case 'tools':
        return <ToolsPanel />;
      case 'templates':
        return <TemplatePanel platform={selectedPlatform} onSelect={onTemplateSelect} />;
      case 'elements':
        return <ElementsPanel />;
      default:
        return null;
    }
  };

  if (isCollapsed) {
    return (
      <div className="w-16 border-r flex flex-col" style={{ backgroundColor: '#002e51', borderColor: '#004080' }}>
        <div className="flex flex-col space-y-2 p-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsCollapsed(false);
                }}
                className={`p-3 rounded-lg transition-all duration-200 flex items-center justify-center ${
                  activeTab === tab.id
                    ? 'text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
                style={activeTab === tab.id ? { backgroundColor: '#ff4940' } : { backgroundColor: 'transparent' }}
                onMouseEnter={(e) => {
                  if (activeTab !== tab.id) {
                    e.currentTarget.style.backgroundColor = '#003a63';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== tab.id) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
                title={tab.name}
              >
                <Icon className="w-5 h-5" />
              </button>
            );
          })}
        </div>
        <div className="mt-auto p-2">
          <button 
            onClick={() => setIsCollapsed(false)}
            className="p-3 rounded-lg text-gray-400 hover:text-white transition-colors w-full flex items-center justify-center"
            style={{ backgroundColor: 'transparent' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#003a63';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            title="Expand sidebar"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 border-r flex flex-col" style={{ backgroundColor: '#002e51', borderColor: '#004080' }}>
      <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: '#004080' }}>
        <h2 className="text-lg font-semibold text-white">Design Tools</h2>
        <button 
          onClick={() => setIsCollapsed(true)}
          className="p-1 rounded text-gray-400 hover:text-white transition-colors"
          title="Collapse sidebar"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>
      
      <div className="flex border-b" style={{ borderColor: '#004080' }}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 p-3 text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                activeTab === tab.id
                  ? 'text-white border-b-2'
                  : 'text-gray-400 hover:text-white'
              }`}
              style={{
                backgroundColor: activeTab === tab.id ? '#ff4940' : 'transparent',
                borderBottomColor: activeTab === tab.id ? '#ff4940' : 'transparent'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.backgroundColor = '#003a63';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden lg:inline">{tab.name}</span>
            </button>
          );
        })}
      </div>
      
      <div className="flex-1 overflow-auto p-4">
        {renderPanel()}
      </div>
    </div>
  );
}