import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { StudioContextProvider } from './contexts/StudioContext';
import { RendererProvider } from './modules/renderer/context/RendererContext';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import ProjectsPage from './pages/ProjectsPage';
import TemplatesPage from './pages/TemplatesPage';
import BrandsPage from './pages/BrandsPage';
import SettingsPage from './pages/SettingsPage';
import Playground from './modules/renderer/pages/Playground';
import { AuthWrapper } from './components/common/AuthWrapper';

function App() {
  return (
    <Router>
      <StudioContextProvider>
        <RendererProvider>
          <AuthWrapper>
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/projects/:id" element={<ProjectsPage />} />
                <Route path="/templates" element={<TemplatesPage />} />
                <Route path="/templates/playground/:templateId" element={<Playground />} />
                <Route path="/brands" element={<BrandsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Routes>
            </Layout>
          </AuthWrapper>
        </RendererProvider>
      </StudioContextProvider>
    </Router>
  );
}

export default App; 