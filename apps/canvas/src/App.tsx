import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Canvas } from './components/Canvas';
import { Sidebar } from './components/Sidebar';
import { LeftPanel } from './components/LeftPanel';
import { Header } from './components/Header';
import { FloatingColorPalette } from './components/FloatingColorPalette';
import { DebugPanel } from './components/DebugPanel';
import { BetaBanner } from './components/BetaBanner';
import { Dashboard } from './components/Dashboard';
import { DesignEditor } from './components/DesignEditor';
import { AuthProvider } from './contexts/AuthContext';
import { BrandProvider } from './contexts/BrandContext';
import { CanvasProvider } from './contexts/CanvasContext';
import { ToolsProvider } from './contexts/ToolsContext';
import { PagesProvider } from './contexts/PagesContext';
import { BackgroundProvider } from './contexts/BackgroundContext';
import { ProjectProvider } from './contexts/ProjectContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthWrapper } from './components/AuthWrapper';

// HTML Template Playground Components
// import { TemplateGallery } from './modules/htmlPlayground/TemplateGallery';
// import { RenderStudio } from './modules/htmlPlayground/RenderStudio';
import { ModeSelector } from './components/ModeSelector';
import { TestTemplates } from './components/TestTemplates';

// Templates Module
import { TemplateRoutes } from './modules/templates/templateRoutes';

function App() {
  const [selectedPlatform, setSelectedPlatform] = useState('instagram');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [currentFormat, setCurrentFormat] = useState({ name: 'Square 1080x1080', width: 1080, height: 1080 });

  return (
    <AuthProvider>
      <AuthWrapper>
        <ThemeProvider>
          <BrandProvider>
            <CanvasProvider>
              <ToolsProvider>
                <PagesProvider>
                  <ProjectProvider>
                    <BackgroundProvider>
                    <Router>
                      <div className="flex flex-col h-screen overflow-hidden text-white" style={{ backgroundColor: '#1a1a1a' }}>
                        <BetaBanner />
                        
                        <Routes>
                          {/* Mode Selector - Landing page after auth */}
                          <Route path="/" element={<ModeSelector />} />
                          
                          {/* Traditional Canvas Editor Mode */}
                          <Route path="/canvas" element={
                            <>
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
                            </>
                          } />
                          
                          {/* Templates Module Routes */}
                          <Route path="/templates/*" element={<TemplateRoutes />} />
                          
                          {/* Legacy HTML Template Playground Routes */}
                          <Route path="/playground/:templateId" element={<TestTemplates />} />
                          
                          {/* Dashboard Route (for project management) */}
                          <Route path="/dashboard" element={<Dashboard onCreateProject={() => {}} onOpenProject={() => {}} />} />
                          
                          {/* Test Route */}
                          <Route path="/test" element={<TestTemplates />} />
                          
                          {/* Redirect unknown routes to mode selector */}
                          <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                      </div>
                    </Router>
                  </BackgroundProvider>
                </ProjectProvider>
              </PagesProvider>
            </ToolsProvider>
          </CanvasProvider>
        </BrandProvider>
        </ThemeProvider>
      </AuthWrapper>
    </AuthProvider>
  );
}

export default App;