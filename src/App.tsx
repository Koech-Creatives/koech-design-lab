import React, { useState } from 'react';
import { Canvas } from './components/Canvas';
import { Sidebar } from './components/Sidebar';
import { LeftPanel } from './components/LeftPanel';
import { Header } from './components/Header';
import { FloatingColorPalette } from './components/FloatingColorPalette';
import { DebugPanel } from './components/DebugPanel';
import { ProjectsModal } from './components/ProjectsModal';
import { TemplatesModal } from './components/TemplatesModal';
import { AuthProvider } from './contexts/AuthContext';
import { BrandProvider } from './contexts/BrandContext';
import { CanvasProvider } from './contexts/CanvasContext';
import { ToolsProvider } from './contexts/ToolsContext';
import { PagesProvider } from './contexts/PagesContext';
import { BackgroundProvider } from './contexts/BackgroundContext';
import { ProjectProvider } from './contexts/ProjectContext';
import { AuthWrapper } from './components/AuthWrapper';
import { ErrorBoundary } from './components/ErrorBoundary';

function App() {
  const [selectedPlatform, setSelectedPlatform] = useState('instagram');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [currentFormat, setCurrentFormat] = useState({ name: 'Square 1080x1080', width: 1080, height: 1080 });
  const [showProjectsModal, setShowProjectsModal] = useState(false);
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);

  const AppContent = () => (
    <BrandProvider>
      <CanvasProvider>
        <ToolsProvider>
          <PagesProvider>
            <ProjectProvider>
              <BackgroundProvider>
                <div className="flex flex-col h-screen overflow-hidden text-white" style={{ backgroundColor: '#1a1a1a' }}>
                  <Header 
                    selectedPlatform={selectedPlatform}
                    onPlatformChange={setSelectedPlatform}
                    onOpenProjects={() => setShowProjectsModal(true)}
                    onOpenTemplates={() => setShowTemplatesModal(true)}
                  />
                  <div className="flex flex-1 overflow-hidden">
                    <Sidebar 
                      currentFormat={currentFormat}
                    />
                    <main className="flex-1 flex flex-col overflow-hidden" style={{ backgroundColor: '#1a1a1a' }}>
                      <Canvas 
                        platform={selectedPlatform}
                        template={selectedTemplate}
                        onFormatChange={setCurrentFormat}
                      />
                    </main>
                    <LeftPanel platform={selectedPlatform} currentFormat={currentFormat} />
                  </div>
                  
                  {/* Floating Color Palette - Always on top when element is selected */}
                  <FloatingColorPalette />
                  
                  {/* Debug Panel - Only in development */}
                  <DebugPanel />
                  
                  {/* Modal Windows */}
                  <ProjectsModal 
                    isOpen={showProjectsModal}
                    onClose={() => setShowProjectsModal(false)}
                  />
                  <TemplatesModal 
                    isOpen={showTemplatesModal}
                    onClose={() => setShowTemplatesModal(false)}
                    selectedPlatform={selectedPlatform}
                    onTemplateSelect={setSelectedTemplate}
                  />
                </div>
              </BackgroundProvider>
            </ProjectProvider>
          </PagesProvider>
        </ToolsProvider>
      </CanvasProvider>
    </BrandProvider>
  );

  return (
    <ErrorBoundary>
      <AuthProvider>
        <AuthWrapper>
          <AppContent />
        </AuthWrapper>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;