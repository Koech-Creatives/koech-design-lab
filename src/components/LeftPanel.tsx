import React, { useState } from 'react';
import { ChevronRight, FileText, FolderOpen, AlignCenter } from 'lucide-react';
import { PropertiesPanel } from './PropertiesPanel';
import { LayersPanel } from './LayersPanel';
import { AlignmentPanel } from './AlignmentPanel';

interface LeftPanelProps {
  platform: string;
  currentFormat: { name: string; width: number; height: number };
}

export function LeftPanel({ platform, currentFormat }: LeftPanelProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('properties');

  if (isCollapsed) {
    return (
      <div className="w-12 border-l flex flex-col items-center py-3" style={{ backgroundColor: '#002e51', borderColor: '#004080' }}>
        <button 
          onClick={() => setIsCollapsed(false)}
          className="p-2 rounded text-gray-400 hover:text-white transition-colors"
          title="Expand panel"
        >
          <ChevronRight className="w-3.5 h-3.5 rotate-180" />
        </button>
      </div>
    );
  }

  return (
    <div className="w-64 border-l flex flex-col" style={{ backgroundColor: '#002e51', borderColor: '#004080' }}>
      <div className="flex items-center justify-between p-3 border-b" style={{ borderColor: '#004080' }}>
        <h2 className="text-xs font-semibold text-white">Canvas Tools</h2>
        <button 
          onClick={() => setIsCollapsed(true)}
          className="p-1 rounded text-gray-400 hover:text-white transition-colors"
          title="Collapse panel"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
      
      {/* Top Section - Projects & Templates as Icons */}
      <div className="border-b p-3" style={{ borderColor: '#004080' }}>
        <div className="flex space-x-2">
          <button
            className="flex-1 p-3 rounded text-center transition-colors hover:bg-gray-700"
            style={{ backgroundColor: '#003a63' }}
            title="Projects"
          >
            <FolderOpen className="w-4 h-4 mx-auto mb-1 text-gray-300" />
            <div className="text-xs text-white">Projects</div>
          </button>
          <button
            className="flex-1 p-3 rounded text-center transition-colors hover:bg-gray-700"
            style={{ backgroundColor: '#003a63' }}
            title="Templates"
          >
            <FileText className="w-4 h-4 mx-auto mb-1 text-gray-300" />
            <div className="text-xs text-white">Templates</div>
          </button>
        </div>
      </div>

      {/* Bottom Section - Properties, Layers & Alignment Tabs */}
      <div className="flex-1 flex flex-col">
        <div className="flex border-b" style={{ borderColor: '#004080' }}>
          <button
            onClick={() => setActiveTab('properties')}
            className={`flex-1 px-2 py-2 text-xs font-medium transition-colors ${
              activeTab === 'properties'
                ? 'text-white border-b-2'
                : 'text-gray-400 hover:text-gray-300'
            }`}
            style={activeTab === 'properties' ? { borderBottomColor: '#ff4940' } : {}}
          >
            <div className="flex items-center justify-center space-x-1">
              <div className="w-3.5 h-3.5 border border-current rounded-full opacity-70" />
              <span className="hidden lg:inline">Properties</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('layers')}
            className={`flex-1 px-2 py-2 text-xs font-medium transition-colors ${
              activeTab === 'layers'
                ? 'text-white border-b-2'
                : 'text-gray-400 hover:text-gray-300'
            }`}
            style={activeTab === 'layers' ? { borderBottomColor: '#ff4940' } : {}}
          >
            <div className="flex items-center justify-center space-x-1">
              <div className="w-3.5 h-3.5 border border-current rounded opacity-70" />
              <span className="hidden lg:inline">Layers</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('alignment')}
            className={`flex-1 px-2 py-2 text-xs font-medium transition-colors ${
              activeTab === 'alignment'
                ? 'text-white border-b-2'
                : 'text-gray-400 hover:text-gray-300'
            }`}
            style={activeTab === 'alignment' ? { borderBottomColor: '#ff4940' } : {}}
          >
            <div className="flex items-center justify-center space-x-1">
              <AlignCenter className="w-3.5 h-3.5 opacity-70" />
              <span className="hidden lg:inline">Align</span>
            </div>
          </button>
        </div>

        <div className="flex-1 overflow-hidden">
          {activeTab === 'properties' && <PropertiesPanel />}
          {activeTab === 'layers' && <LayersPanel />}
          {activeTab === 'alignment' && <AlignmentPanel canvasFormat={currentFormat} />}
        </div>
      </div>
    </div>
  );
} 