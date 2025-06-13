import React, { useState } from 'react';
import { Canvas } from './Canvas';
import { FloatingColorPalette } from './FloatingColorPalette';
import { DebugPanel } from './DebugPanel';
import { 
  Layers, 
  Settings, 
  Type, 
  Palette, 
  ArrowLeft, 
  Save, 
  Download, 
  Undo, 
  Redo,
  ChevronLeft,
  ChevronRight,
  User,
  LogOut
} from 'lucide-react';
import { useCanvas } from '../contexts/CanvasContext';
import { useAuth } from '../contexts/AuthContext';
import { useBrand } from '../contexts/BrandContext';
import { useProject } from '../contexts/ProjectContext';
import { LayersPanel } from './LayersPanel';
import { PropertiesPanel } from './PropertiesPanel';
import { ElementsPanel } from './ElementsPanel';
import { BrandPanel } from './BrandPanel';
import { SettingsModal } from './SettingsModal';

interface DesignEditorProps {
  project: any;
  onBackToDashboard: () => void;
}

export function DesignEditor({ project, onBackToDashboard }: DesignEditorProps) {
  const { elements, undo, redo, canUndo, canRedo } = useCanvas();
  const { user, logout } = useAuth();
  const { saveBrandToDirectus } = useBrand();
  const { saveProject } = useProject();

  const [leftPanelTab, setLeftPanelTab] = useState('layers');
  const [rightPanelTab, setRightPanelTab] = useState('elements');
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false);
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  const leftTabs = [
    { id: 'layers', name: 'Layers', icon: Layers },
    { id: 'properties', name: 'Properties', icon: Settings },
  ];

  const rightTabs = [
    { id: 'elements', name: 'Elements', icon: Type },
    { id: 'brand', name: 'Brand', icon: Palette },
  ];

  const handleSave = async () => {
    const designData = {
      platform: project.platform,
      elements: elements,
      timestamp: new Date().toISOString(),
    };
    
    localStorage.setItem('currentDesign', JSON.stringify(designData));
    
    await Promise.all([
      saveBrandToDirectus(),
      saveProject()
    ]);
    
    // Show success notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-6 right-6 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    notification.textContent = 'Project saved successfully!';
    document.body.appendChild(notification);
    
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 3000);
  };

  const handleExport = () => {
    const notification = document.createElement('div');
    notification.className = 'fixed top-6 right-6 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    notification.style.backgroundColor = '#ff4940';
    notification.textContent = `Exporting ${project.name} for ${project.platform}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 3000);
  };

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
  };

  const renderLeftPanel = () => {
    switch (leftPanelTab) {
      case 'layers':
        return <LayersPanel />;
      case 'properties':
        return <PropertiesPanel />;
      default:
        return null;
    }
  };

  const renderRightPanel = () => {
    switch (rightPanelTab) {
      case 'elements':
        return <ElementsPanel />;
      case 'brand':
        return <BrandPanel />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden text-white" style={{ backgroundColor: '#1a1a1a' }}>
      {/* Editor Header */}
      <div className="border-b shadow-sm" style={{ backgroundColor: '#002e51', borderColor: '#004080' }}>
        <div className="flex items-center justify-between px-6 py-3">
          {/* Left section */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onBackToDashboard}
              className="p-2 rounded-lg text-gray-400 hover:text-white transition-colors"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-white">{project.name}</h1>
              <p className="text-sm text-gray-400 capitalize">{project.platform} • {project.format?.name}</p>
            </div>
          </div>

          {/* Center section - Actions */}
          <div className="flex items-center space-x-3">
            <div className="text-xs text-gray-300 px-3 py-2 rounded-lg" style={{ backgroundColor: '#003a63' }}>
              {elements.length} elements
            </div>
            
            <button 
              onClick={undo}
              disabled={!canUndo}
              className={`p-2 rounded-lg transition-colors ${
                canUndo 
                  ? 'text-white hover:opacity-80' 
                  : 'text-gray-500 cursor-not-allowed'
              }`}
              style={canUndo ? { backgroundColor: '#003a63' } : { backgroundColor: '#002447' }}
              title="Undo"
            >
              <Undo className="w-5 h-5" />
            </button>
            
            <button 
              onClick={redo}
              disabled={!canRedo}
              className={`p-2 rounded-lg transition-colors ${
                canRedo 
                  ? 'text-white hover:opacity-80' 
                  : 'text-gray-500 cursor-not-allowed'
              }`}
              style={canRedo ? { backgroundColor: '#003a63' } : { backgroundColor: '#002447' }}
              title="Redo"
            >
              <Redo className="w-5 h-5" />
            </button>
            
            <button 
              onClick={handleSave}
              className="px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 text-white hover:opacity-80"
              style={{ backgroundColor: '#003a63' }}
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>
            
            <button 
              onClick={handleExport}
              className="px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 text-white hover:opacity-80"
              style={{ backgroundColor: '#ff4940' }}
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>

          {/* Right section - User */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-white hover:opacity-80 transition-colors"
              style={{ backgroundColor: '#003a63' }}
            >
              <User className="w-4 h-4" />
              <span className="text-sm">{user?.first_name || 'User'}</span>
            </button>

            {userMenuOpen && (
              <div 
                className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg border z-50"
                style={{ backgroundColor: '#003a63', borderColor: '#004080' }}
              >
                <div className="p-3 border-b" style={{ borderColor: '#004080' }}>
                  <p className="text-sm font-medium text-white">{user?.first_name} {user?.last_name}</p>
                  <p className="text-xs text-gray-400">{user?.email}</p>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => {
                      setSettingsModalOpen(true);
                      setUserMenuOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left text-sm text-white hover:bg-gray-600 transition-colors flex items-center space-x-2"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full px-3 py-2 text-left text-sm text-white hover:bg-red-600 transition-colors flex items-center space-x-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel */}
        {!leftPanelCollapsed && (
          <div className="w-80 border-r flex flex-col" style={{ backgroundColor: '#002e51', borderColor: '#004080' }}>
            <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: '#004080' }}>
              <h2 className="text-lg font-semibold text-white">Design Tools</h2>
              <button 
                onClick={() => setLeftPanelCollapsed(true)}
                className="p-1 rounded text-gray-400 hover:text-white transition-colors"
                title="Collapse panel"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex border-b" style={{ borderColor: '#004080' }}>
              {leftTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setLeftPanelTab(tab.id)}
                    className={`flex-1 p-3 text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                      leftPanelTab === tab.id
                        ? 'text-white border-b-2'
                        : 'text-gray-400 hover:text-white'
                    }`}
                    style={{
                      backgroundColor: leftPanelTab === tab.id ? '#ff4940' : 'transparent',
                      borderBottomColor: leftPanelTab === tab.id ? '#ff4940' : 'transparent'
                    }}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </div>
            
            <div className="flex-1 overflow-auto p-4">
              {renderLeftPanel()}
            </div>
          </div>
        )}

        {leftPanelCollapsed && (
          <div className="w-16 border-r flex flex-col" style={{ backgroundColor: '#002e51', borderColor: '#004080' }}>
            <div className="flex flex-col space-y-2 p-2 mt-16">
              {leftTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setLeftPanelTab(tab.id);
                      setLeftPanelCollapsed(false);
                    }}
                    className={`p-3 rounded-lg transition-all duration-200 flex items-center justify-center ${
                      leftPanelTab === tab.id
                        ? 'text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                    style={leftPanelTab === tab.id ? { backgroundColor: '#ff4940' } : { backgroundColor: 'transparent' }}
                    title={tab.name}
                  >
                    <Icon className="w-5 h-5" />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Canvas Area */}
        <main className="flex-1 flex flex-col overflow-hidden" style={{ backgroundColor: '#1a1a1a' }}>
          <Canvas 
            platform={project.platform}
            template={null}
            onFormatChange={() => {}}
          />
        </main>

        {/* Right Panel */}
        {!rightPanelCollapsed && (
          <div className="w-80 border-l flex flex-col" style={{ backgroundColor: '#002e51', borderColor: '#004080' }}>
            <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: '#004080' }}>
              <h2 className="text-lg font-semibold text-white">Resources</h2>
              <button 
                onClick={() => setRightPanelCollapsed(true)}
                className="p-1 rounded text-gray-400 hover:text-white transition-colors"
                title="Collapse panel"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex border-b" style={{ borderColor: '#004080' }}>
              {rightTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setRightPanelTab(tab.id)}
                    className={`flex-1 p-3 text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                      rightPanelTab === tab.id
                        ? 'text-white border-b-2'
                        : 'text-gray-400 hover:text-white'
                    }`}
                    style={{
                      backgroundColor: rightPanelTab === tab.id ? '#ff4940' : 'transparent',
                      borderBottomColor: rightPanelTab === tab.id ? '#ff4940' : 'transparent'
                    }}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </div>
            
            <div className="flex-1 overflow-auto p-4">
              {renderRightPanel()}
            </div>
          </div>
        )}

        {rightPanelCollapsed && (
          <div className="w-16 border-l flex flex-col" style={{ backgroundColor: '#002e51', borderColor: '#004080' }}>
            <div className="flex flex-col space-y-2 p-2 mt-16">
              {rightTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setRightPanelTab(tab.id);
                      setRightPanelCollapsed(false);
                    }}
                    className={`p-3 rounded-lg transition-all duration-200 flex items-center justify-center ${
                      rightPanelTab === tab.id
                        ? 'text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                    style={rightPanelTab === tab.id ? { backgroundColor: '#ff4940' } : { backgroundColor: 'transparent' }}
                    title={tab.name}
                  >
                    <Icon className="w-5 h-5" />
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Floating Elements */}
      <FloatingColorPalette />
      <DebugPanel />
      
      {/* Settings Modal */}
      <SettingsModal 
        isOpen={settingsModalOpen} 
        onClose={() => setSettingsModalOpen(false)} 
      />
    </div>
  );
} 