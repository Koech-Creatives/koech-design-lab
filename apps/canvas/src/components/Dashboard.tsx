import { useState, useEffect } from 'react';
import { 
  Plus, 
  Folder, 
  LayoutTemplate, 
  ArrowRight, 
  Search,
  Grid,
  List,
  HelpCircle
} from 'lucide-react';
import { useProject } from '../contexts/ProjectContext';
import { useAuth } from '../contexts/AuthContext';
import { OnboardingTour } from './OnboardingTour';
import { ProjectNameModal } from './ProjectNameModal';

interface DashboardProps {
  onCreateProject: (template?: any, projectName?: string) => void;
  onOpenProject: (project: any) => void;
}

export function Dashboard({ onCreateProject, onOpenProject }: DashboardProps) {
  const { projects } = useProject();
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showProjectNameModal, setShowProjectNameModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

  // Check if user is new and should see onboarding
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    const isNewUser = !projects || projects.length === 0;
    
    if (!hasSeenOnboarding && isNewUser) {
      setShowOnboarding(true);
    }
  }, [projects]);

  const handleOnboardingComplete = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    setShowOnboarding(false);
  };

  const handleCreateProject = (template?: any) => {
    setSelectedTemplate(template || null);
    setShowProjectNameModal(true);
  };

  const handleProjectNameConfirm = (projectName: string) => {
    // Create the project with the provided name
    onCreateProject(selectedTemplate, projectName);
    setShowProjectNameModal(false);
    setSelectedTemplate(null);
  };

  const handleProjectNameCancel = () => {
    setShowProjectNameModal(false);
    setSelectedTemplate(null);
  };

  const quickStartTemplates = [
    { id: 'instagram-post', name: 'Instagram Post', platform: 'instagram', format: '1080x1080' },
    { id: 'linkedin-post', name: 'LinkedIn Post', platform: 'linkedin', format: '1200x627' },
    { id: 'twitter-header', name: 'Twitter Header', platform: 'twitter', format: '1500x500' },
    { id: 'tiktok-story', name: 'TikTok Story', platform: 'tiktok', format: '1080x1920' },
  ];

  const recentProjects = projects?.slice(0, 4) || [];
  const filteredProjects = projects?.filter(project => 
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#002e51' }}>
      {/* Header */}
      <div className="border-b" style={{ backgroundColor: '#002e51', borderColor: '#004080' }}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Welcome back, {user?.first_name}!</h1>
              <p className="text-gray-400 mt-1">Let's create something amazing today</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowOnboarding(true)}
                className="px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 text-gray-300 hover:text-white"
                style={{ backgroundColor: '#003a63' }}
                title="Take a tour of the features"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Take Tour</span>
              </button>
              <button
                onClick={() => handleCreateProject()}
                className="px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 hover:opacity-90"
                style={{ backgroundColor: '#ff4940', color: 'white' }}
              >
                <Plus className="w-5 h-5" />
                <span>New Project</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Quick Start Section */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-white mb-6">Quick Start</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickStartTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => handleCreateProject(template)}
                className="p-6 rounded-xl border transition-all duration-200 hover:border-red-500 group"
                style={{ backgroundColor: '#003a63', borderColor: '#004080' }}
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: '#ff4940' }}
                  >
                    <LayoutTemplate className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">{template.name}</h3>
                    <p className="text-sm text-gray-400">{template.format}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Recent Projects */}
        {recentProjects.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Recent Projects</h2>
              <button className="text-red-400 hover:text-red-300 text-sm font-medium">
                View All
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {recentProjects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => onOpenProject(project)}
                  className="p-4 rounded-xl border transition-all duration-200 hover:border-red-500 text-left group"
                  style={{ backgroundColor: '#003a63', borderColor: '#004080' }}
                >
                  <div className="aspect-video rounded-lg mb-3 flex items-center justify-center"
                       style={{ backgroundColor: '#002e51' }}>
                    <Folder className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="font-medium text-white truncate">{project.name}</h3>
                  <p className="text-sm text-gray-400 capitalize">{project.platform}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500">
                      {new Date(project.date_updated || project.date_created || Date.now()).toLocaleDateString()}
                    </span>
                    <ArrowRight className="w-3 h-3 text-gray-400 group-hover:text-white transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* All Projects */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">All Projects</h2>
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 rounded-lg border text-sm"
                  style={{ 
                    backgroundColor: '#003a63', 
                    borderColor: '#004080',
                    color: 'white'
                  }}
                />
              </div>
              
              {/* View Toggle */}
              <div className="flex items-center rounded-lg p-1" style={{ backgroundColor: '#003a63' }}>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-red-500 text-white' : 'text-gray-400'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-red-500 text-white' : 'text-gray-400'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <Folder className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No projects yet</h3>
              <p className="text-gray-400 mb-6">Start by creating your first project</p>
              <button
                onClick={() => handleCreateProject()}
                className="px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 mx-auto"
                style={{ backgroundColor: '#ff4940', color: 'white' }}
              >
                <Plus className="w-5 h-5" />
                <span>Create Project</span>
              </button>
            </div>
          ) : (
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
              : "space-y-2"
            }>
              {filteredProjects.map((project) => 
                viewMode === 'grid' ? (
                  <button
                    key={project.id}
                    onClick={() => onOpenProject(project)}
                    className="p-4 rounded-xl border transition-all duration-200 hover:border-red-500 text-left group"
                    style={{ backgroundColor: '#003a63', borderColor: '#004080' }}
                  >
                    <div className="aspect-video rounded-lg mb-3 flex items-center justify-center"
                         style={{ backgroundColor: '#002e51' }}>
                      <Folder className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="font-medium text-white truncate">{project.name}</h3>
                    <p className="text-sm text-gray-400 capitalize">{project.platform}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">
                        {new Date(project.date_updated || project.date_created || Date.now()).toLocaleDateString()}
                      </span>
                      <ArrowRight className="w-3 h-3 text-gray-400 group-hover:text-white transition-colors" />
                    </div>
                  </button>
                ) : (
                  <button
                    key={project.id}
                    onClick={() => onOpenProject(project)}
                    className="w-full p-4 rounded-lg border transition-all duration-200 hover:border-red-500 flex items-center space-x-4"
                    style={{ backgroundColor: '#003a63', borderColor: '#004080' }}
                  >
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center"
                         style={{ backgroundColor: '#002e51' }}>
                      <Folder className="w-6 h-6 text-gray-400" />
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="font-medium text-white">{project.name}</h3>
                      <p className="text-sm text-gray-400 capitalize">{project.platform}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">
                        {new Date(project.date_updated || project.date_created || Date.now()).toLocaleDateString()}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </button>
                )
              )}
            </div>
          )}
        </section>
      </div>

      {/* Onboarding Tour */}
      <OnboardingTour
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onComplete={handleOnboardingComplete}
      />

      {/* Project Name Modal */}
      <ProjectNameModal
        isOpen={showProjectNameModal}
        onClose={handleProjectNameCancel}
        onConfirm={handleProjectNameConfirm}
        template={selectedTemplate}
      />
    </div>
  );
} 