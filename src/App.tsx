import React, { useState } from 'react';
import { Canvas } from './components/Canvas';
import { Sidebar } from './components/Sidebar';
import { LeftPanel } from './components/LeftPanel';
import { Header } from './components/Header';
import { FloatingColorPalette } from './components/FloatingColorPalette';
import { DebugPanel } from './components/DebugPanel';
import { AuthProvider } from './contexts/AuthContext';
import { BrandProvider } from './contexts/BrandContext';
import { CanvasProvider } from './contexts/CanvasContext';
import { ToolsProvider } from './contexts/ToolsContext';
import { PagesProvider } from './contexts/PagesContext';
import { BackgroundProvider } from './contexts/BackgroundContext';
import { ProjectProvider } from './contexts/ProjectContext';
import { AuthWrapper } from './components/AuthWrapper';

function App() {
  const [selectedPlatform, setSelectedPlatform] = useState('instagram');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [currentFormat, setCurrentFormat] = useState({ name: 'Square 1080x1080', width: 1080, height: 1080 });

  return (
    <AuthProvider>
      <AuthWrapper>
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
                      />
                      <div className="flex flex-1 overflow-hidden">
                        <Sidebar 
                          selectedPlatform={selectedPlatform}
                          selectedTemplate={selectedTemplate}
                          onTemplateSelect={setSelectedTemplate}
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

export default App;