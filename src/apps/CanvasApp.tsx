import React, { useState } from 'react';
import { Canvas } from '../components/Canvas';
import { Sidebar } from '../components/Sidebar';
import { LeftPanel } from '../components/LeftPanel';
import { Header } from '../components/Header';
import { FloatingColorPalette } from '../components/FloatingColorPalette';
import { DebugPanel } from '../components/DebugPanel';
import { TemplateGallery } from '../components/TemplateGallery';
import { AuthProvider } from '../contexts/AuthContext';
import { BrandProvider } from '../contexts/BrandContext';
import { CanvasProvider } from '../contexts/CanvasContext';
import { ToolsProvider } from '../contexts/ToolsContext';
import { PagesProvider } from '../contexts/PagesContext';
import { BackgroundProvider } from '../contexts/BackgroundContext';
import { ProjectProvider } from '../contexts/ProjectContext';
import { AuthWrapper } from '../components/AuthWrapper';
import { ArrowLeft } from 'lucide-react';

interface CanvasAppProps {
  onBack: () => void;
}

export function CanvasApp({ onBack }: CanvasAppProps) {
  const [selectedPlatform, setSelectedPlatform] = useState('instagram');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [currentFormat, setCurrentFormat] = useState({ name: 'Square 1080x1080', width: 1080, height: 1080 });
  const [activeSidebarItem, setActiveSidebarItem] = useState('canvas');
  const [showTemplateGallery, setShowTemplateGallery] = useState(true);

  const handleTemplateSelect = (template: any) => {
    setSelectedTemplate(template);
    setShowTemplateGallery(false);
  };

  const handleCloseTemplateGallery = () => {
    setShowTemplateGallery(false);
  };

  return (
    <AuthProvider>
      <AuthWrapper>
        <BrandProvider>
          <CanvasProvider>
            <ToolsProvider>
              <PagesProvider>
                <ProjectProvider>
                  <BackgroundProvider>
                    <div className="flex h-screen overflow-hidden text-white" style={{ backgroundColor: '#f5f5f5' }}>
                      {/* Left Icon Sidebar */}
                      <Sidebar 
                        selectedPlatform={selectedPlatform}
                        selectedTemplate={selectedTemplate}
                        onTemplateSelect={setSelectedTemplate}
                        activeItem={activeSidebarItem}
                        onItemChange={setActiveSidebarItem}
                      />
                      
                      {/* Main Content Area */}
                      <div className="flex-1 flex flex-col overflow-hidden">
                        <div className="flex items-center justify-between bg-white border-b border-gray-200 px-4 py-2">
                          <button
                            onClick={onBack}
                            className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Back to Koech Labs</span>
                          </button>
                          <div className="text-sm text-gray-600">Koech Canvas</div>
                        </div>
                        
                        <Header 
                          selectedPlatform={selectedPlatform}
                          onPlatformChange={setSelectedPlatform}
                          onOpenTemplates={() => setShowTemplateGallery(true)}
                        />
                        <main className="flex-1 flex overflow-hidden" style={{ backgroundColor: '#f5f5f5' }}>
                          <Canvas 
                            platform={selectedPlatform}
                            template={selectedTemplate}
                            onFormatChange={setCurrentFormat}
                          />
                        </main>
                      </div>
                      
                      {/* Right Contextual Panel */}
                      <LeftPanel 
                        platform={selectedPlatform} 
                        currentFormat={currentFormat}
                        activePanel={activeSidebarItem}
                      />
                      
                      {/* Template Gallery Modal */}
                      <TemplateGallery
                        isOpen={showTemplateGallery}
                        onClose={handleCloseTemplateGallery}
                        onSelectTemplate={handleTemplateSelect}
                      />
                      
                      {/* Floating Color Palette - Always on top when element is selected */}
                      <FloatingColorPalette />
                      
                      {/* Debug Panel - Only in development */}
                      <DebugPanel />
                    </div>
                  </BackgroundProvider>
                </ProjectProvider>
              </PagesProvider>
            </ToolsProvider>
          </CanvasProvider>
        </BrandProvider>
      </AuthWrapper>
    </AuthProvider>
  );
} 