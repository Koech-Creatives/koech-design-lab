import React, { useState } from 'react';
import { Download, Save, Undo, Redo, Settings, User, LogOut, Shuffle, Layout } from 'lucide-react';
import { useCanvas } from '../contexts/CanvasContext';
import { useAuth } from '../contexts/AuthContext';
import { useBrand } from '../contexts/BrandContext';
import { useProject } from '../contexts/ProjectContext';
import { SettingsModal } from './SettingsModal';

interface HeaderProps {
  selectedPlatform: string;
  onPlatformChange: (platform: string) => void;
  onOpenTemplates?: () => void;
}

const platforms = [
  { id: 'instagram', name: 'Instagram', color: '#E4405F' },
  { id: 'facebook', name: 'Facebook', color: '#1877F2' },
  { id: 'twitter', name: 'Twitter', color: '#1DA1F2' },
  { id: 'linkedin', name: 'LinkedIn', color: '#0A66C2' },
  { id: 'youtube', name: 'YouTube', color: '#FF0000' },
  { id: 'tiktok', name: 'TikTok', color: '#000000' },
];

export function Header({ 
  selectedPlatform, 
  onPlatformChange,
  onOpenTemplates
}: HeaderProps) {
  const { elements, clearCanvas, undo, redo, canUndo, canRedo } = useCanvas();
  const { user, logout } = useAuth();
  const { saveBrandToDirectus } = useBrand();
  const { saveProject } = useProject();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  const handleSave = async () => {
    const designData = {
      platform: selectedPlatform,
      elements: elements,
      timestamp: new Date().toISOString(),
    };
    
    localStorage.setItem('currentDesign', JSON.stringify(designData));
    
    await Promise.all([
      saveBrandToDirectus(),
      saveProject()
    ]);
    
    const notification = document.createElement('div');
    notification.className = 'fixed top-20 right-6 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    notification.textContent = 'Design saved successfully!';
    document.body.appendChild(notification);
    
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 3000);
  };

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
  };

  return (
    <div className="bg-slate-800 text-white">
      {/* Platform Selector Bar */}
      <div className="px-6 py-3 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">K</span>
              </div>
              <div>
                <h1 className="text-lg font-semibold">Koech Canvas</h1>
                <p className="text-xs text-slate-400">Design Studio</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-1">
              <span className="text-sm text-slate-400 mr-3">Platform:</span>
              {platforms.map((platform) => (
                <button
                  key={platform.id}
                  onClick={() => onPlatformChange(platform.id)}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-all duration-200 ${
                    selectedPlatform === platform.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  {platform.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="text-sm text-slate-400">
              {elements.length} elements
            </div>
            
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
              >
                <User className="w-4 h-4" />
                <span>{user?.first_name || 'User'}</span>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-3 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-900">{user?.first_name} {user?.last_name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setSettingsModalOpen(true);
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="px-6 py-3 bg-slate-700">
        <div className="flex items-center justify-between">
          {/* Left Section - Templates and Tools */}
          <div className="flex items-center space-x-4">
            {onOpenTemplates && (
              <button 
                onClick={onOpenTemplates}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-600 rounded-lg transition-colors"
              >
                <Layout className="w-4 h-4" />
                <span>Templates</span>
              </button>
            )}
            
            <button className="flex items-center space-x-2 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-600 rounded-lg transition-colors">
              <Shuffle className="w-4 h-4" />
              <span>Randomize</span>
            </button>
          </div>

          {/* Center Section - Undo/Redo */}
          <div className="flex items-center space-x-2">
            <button 
              onClick={undo}
              disabled={!canUndo}
              className={`p-2 rounded-lg transition-colors ${
                canUndo 
                  ? 'text-slate-300 hover:text-white hover:bg-slate-600' 
                  : 'text-slate-500 cursor-not-allowed'
              }`}
              title="Undo"
            >
              <Undo className="w-4 h-4" />
            </button>
            <button 
              onClick={redo}
              disabled={!canRedo}
              className={`p-2 rounded-lg transition-colors ${
                canRedo 
                  ? 'text-slate-300 hover:text-white hover:bg-slate-600' 
                  : 'text-slate-500 cursor-not-allowed'
              }`}
              title="Redo"
            >
              <Redo className="w-4 h-4" />
            </button>
          </div>

          {/* Right Section - Save and Export */}
          <div className="flex items-center space-x-3">
            <button 
              onClick={handleSave}
              className="px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-600 rounded-lg transition-colors flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>
            
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {settingsModalOpen && (
        <SettingsModal onClose={() => setSettingsModalOpen(false)} />
      )}
    </div>
  );
}