import React, { useState } from 'react';
import { LayersPanel } from './LayersPanel';
import { PropertiesPanel } from './PropertiesPanel';
import { BrandPanel } from './BrandPanel';
import { PagesPanel } from './PagesPanel';
import { 
  Layers,
  Settings,
  Palette,
  FileText,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const topTabs = [
  { id: 'layers', name: 'Layers', icon: Layers },
  { id: 'properties', name: 'Properties', icon: Settings },
];

const bottomTabs = [
  { id: 'pages', name: 'Pages', icon: FileText },
  { id: 'brand', name: 'Brand', icon: Palette },
];

interface LeftPanelProps {
  platform: string;
  currentFormat: any;
}

export function LeftPanel({ platform, currentFormat }: LeftPanelProps) {
  const [activeTopTab, setActiveTopTab] = useState('layers');
  const [activeBottomTab, setActiveBottomTab] = useState('pages');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const renderTopPanel = () => {
    switch (activeTopTab) {
      case 'layers':
        return <LayersPanel />;
      case 'properties':
        return <PropertiesPanel />;
      default:
        return null;
    }
  };

  const renderBottomPanel = () => {
    switch (activeBottomTab) {
      case 'pages':
        return <PagesPanel platform={platform} currentFormat={currentFormat} />;
      case 'brand':
        return <BrandPanel />;
      default:
        return null;
    }
  };

  if (isCollapsed) {
    return (
      <div className="w-16 border-l flex flex-col" style={{ backgroundColor: '#002e51', borderColor: '#004080' }}>
        {/* Top tabs collapsed */}
        <div className="flex flex-col space-y-1 p-2">
          {topTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTopTab(tab.id);
                  setIsCollapsed(false);
                }}
                className={`p-2 rounded-lg transition-all duration-200 flex items-center justify-center ${
                  activeTopTab === tab.id
                    ? 'text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
                style={activeTopTab === tab.id ? { backgroundColor: '#ff4940' } : { backgroundColor: 'transparent' }}
                title={tab.name}
              >
                <Icon className="w-4 h-4" />
              </button>
            );
          })}
        </div>
        
        {/* Separator */}
        <div className="border-t mx-2" style={{ borderColor: '#004080' }} />
        
        {/* Bottom tabs collapsed */}
        <div className="flex flex-col space-y-1 p-2">
          {bottomTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveBottomTab(tab.id);
                  setIsCollapsed(false);
                }}
                className={`p-2 rounded-lg transition-all duration-200 flex items-center justify-center ${
                  activeBottomTab === tab.id
                    ? 'text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
                style={activeBottomTab === tab.id ? { backgroundColor: '#ff4940' } : { backgroundColor: 'transparent' }}
                title={tab.name}
              >
                <Icon className="w-4 h-4" />
              </button>
            );
          })}
        </div>
        
        <div className="mt-auto p-2">
          <button 
            onClick={() => setIsCollapsed(false)}
            className="p-3 rounded-lg text-gray-400 hover:text-white transition-colors w-full flex items-center justify-center"
            title="Expand panel"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 border-l flex flex-col" style={{ backgroundColor: '#002e51', borderColor: '#004080' }}>
      <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: '#004080' }}>
        <h2 className="text-lg font-semibold text-white">Canvas Tools</h2>
        <button 
          onClick={() => setIsCollapsed(true)}
          className="p-1 rounded text-gray-400 hover:text-white transition-colors"
          title="Collapse panel"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      
      {/* Top Section - Layers & Properties */}
      <div className="flex-1 flex flex-col">
        <div className="flex border-b" style={{ borderColor: '#004080' }}>
          {topTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTopTab(tab.id)}
                className={`flex-1 p-3 text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                  activeTopTab === tab.id
                    ? 'text-white border-b-2'
                    : 'text-gray-400 hover:text-white'
                }`}
                style={{
                  backgroundColor: activeTopTab === tab.id ? '#ff4940' : 'transparent',
                  borderBottomColor: activeTopTab === tab.id ? '#ff4940' : 'transparent'
                }}
                onMouseEnter={(e) => {
                  if (activeTopTab !== tab.id) {
                    e.currentTarget.style.backgroundColor = '#003a63';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTopTab !== tab.id) {
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
          {renderTopPanel()}
        </div>
      </div>

      {/* Bottom Section - Pages & Brand */}
      <div className="flex-1 flex flex-col border-t" style={{ borderColor: '#004080' }}>
        <div className="flex border-b" style={{ borderColor: '#004080' }}>
          {bottomTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveBottomTab(tab.id)}
                className={`flex-1 p-3 text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                  activeBottomTab === tab.id
                    ? 'text-white border-b-2'
                    : 'text-gray-400 hover:text-white'
                }`}
                style={{
                  backgroundColor: activeBottomTab === tab.id ? '#ff4940' : 'transparent',
                  borderBottomColor: activeBottomTab === tab.id ? '#ff4940' : 'transparent'
                }}
                onMouseEnter={(e) => {
                  if (activeBottomTab !== tab.id) {
                    e.currentTarget.style.backgroundColor = '#003a63';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeBottomTab !== tab.id) {
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
          {renderBottomPanel()}
        </div>
      </div>
    </div>
  );
} 