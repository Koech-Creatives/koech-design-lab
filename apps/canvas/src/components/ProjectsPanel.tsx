import React, { useState } from 'react';
import { Plus, Folder, Trash2, Calendar } from 'lucide-react';
import { useProject } from '../contexts/ProjectContext';

export function ProjectsPanel() {
  const { 
    projects, 
    currentProject, 
    isLoading, 
    createProject, 
    loadProject, 
    deleteProject 
  } = useProject();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    await createProject(newProjectName, 'instagram', { name: 'Square 1080x1080', width: 1080, height: 1080 });
    setNewProjectName('');
    setShowCreateForm(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-white">Projects</h3>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="p-2 rounded-lg transition-colors flex items-center space-x-1 text-white hover:opacity-80"
          style={{ backgroundColor: '#ff4940' }}
          title="Create new project"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Create Project Form */}
      {showCreateForm && (
        <div className="p-3 rounded-lg" style={{ backgroundColor: '#003a63' }}>
          <form onSubmit={handleCreateProject} className="space-y-3">
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="Project name"
              className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              autoFocus
            />
            <div className="flex space-x-2">
              <button
                type="submit"
                disabled={!newProjectName.trim() || isLoading}
                className="flex-1 py-2 px-3 rounded-lg text-white text-sm font-medium transition-colors disabled:opacity-50"
                style={{ backgroundColor: '#ff4940' }}
              >
                {isLoading ? 'Creating...' : 'Create'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  setNewProjectName('');
                }}
                className="px-3 py-2 rounded-lg text-gray-400 hover:text-white transition-colors"
                style={{ backgroundColor: '#374151' }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Projects List */}
      <div className="space-y-2">
        {isLoading && projects.length === 0 ? (
          <div className="p-3 rounded-lg text-center" style={{ backgroundColor: '#003a63' }}>
            <p className="text-sm text-gray-400">Loading projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="p-3 rounded-lg text-center" style={{ backgroundColor: '#003a63' }}>
            <Folder className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-400">No projects yet</p>
            <p className="text-xs text-gray-500 mt-1">Create your first project to get started</p>
          </div>
        ) : (
          projects.map((project) => (
            <div
              key={project.id}
              className={`p-3 rounded-lg transition-all duration-200 cursor-pointer group ${
                currentProject?.id === project.id
                  ? 'text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
              style={currentProject?.id === project.id ? { backgroundColor: '#ff4940' } : { backgroundColor: '#003a63' }}
              onClick={() => project.id && loadProject(project.id)}
              onMouseEnter={(e) => {
                if (currentProject?.id !== project.id) {
                  e.currentTarget.style.backgroundColor = '#004080';
                }
              }}
              onMouseLeave={(e) => {
                if (currentProject?.id !== project.id) {
                  e.currentTarget.style.backgroundColor = '#003a63';
                }
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <Folder className="w-4 h-4 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{project.name}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs opacity-75 capitalize">{project.platform}</span>
                      <span className="text-xs opacity-50">•</span>
                      <span className="text-xs opacity-75">{project.pages?.length || 0} pages</span>
                    </div>
                    {project.date_updated && (
                      <div className="flex items-center space-x-1 mt-1">
                        <Calendar className="w-3 h-3 opacity-50" />
                        <span className="text-xs opacity-50">{formatDate(project.date_updated)}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (project.id) {
                      deleteProject(project.id);
                    }
                  }}
                  className="p-1 hover:bg-red-600 rounded transition-colors opacity-0 group-hover:opacity-100"
                  title="Delete project"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Current Project Info */}
      {currentProject && (
        <div className="p-3 rounded-lg" style={{ backgroundColor: '#003a63' }}>
          <div className="text-xs text-gray-300">
            <span className="font-medium">Current:</span> {currentProject.name}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {currentProject.platform} • {currentProject.format?.name}
          </div>
        </div>
      )}
    </div>
  );
} 