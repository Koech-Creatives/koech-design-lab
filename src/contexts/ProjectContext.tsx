import React, { createContext, useContext, useState, useEffect } from 'react';
// import { projectAPI } from '../lib/directus'; // COMMENTED OUT - Using Supabase directly
import { projectAPI } from '../lib/supabase'; // Using Supabase directly
import { useAuth } from './AuthContext';
import { useCanvas } from './CanvasContext';
import { usePages } from './PagesContext';

interface Project {
  id?: string;
  name: string;
  platform: string;
  format: {
    name: string;
    width: number;
    height: number;
  };
  pages: Array<{
    id: string;
    name: string;
    elements: any[];
  }>;
  current_page_id: string;
  thumbnail?: string;
  date_created?: string;
  date_updated?: string;
}

interface ProjectContextType {
  currentProject: Project | null;
  projects: Project[];
  isLoading: boolean;
  createProject: (name: string, platform: string, format: any) => Promise<void>;
  saveProject: () => Promise<void>;
  loadProject: (projectId: string) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
  loadUserProjects: () => Promise<void>;
  updateProjectName: (name: string) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const { elements } = useCanvas();
  const { pages, currentPageId } = usePages();

  // Load user projects when authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      loadUserProjects();
    }
  }, [isAuthenticated, user]);

  const createProject = async (name: string, platform: string, format: any) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const projectData = {
        user_id: user.id,
        name,
        platform,
        format,
        pages: pages,
        current_page_id: currentPageId
      };

      const result = await projectAPI.create(projectData);
      if (result.success && result.project) {
        const newProject: Project = {
          id: result.project.id,
          name,
          platform,
          format,
          pages,
          current_page_id: currentPageId
        };
        setCurrentProject(newProject);
        setProjects(prev => [...prev, newProject]);
      } else {
        console.error('Failed to create project:', result.error);
      }
    } catch (error) {
      console.error('Failed to create project:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveProject = async () => {
    if (!currentProject || !currentProject.id || !user) return;

    setIsLoading(true);
    try {
      const updates = {
        pages: pages,
        current_page_id: currentPageId,
        // You could also save a thumbnail here
      };

      const result = await projectAPI.update(currentProject.id, updates);
      if (result.success) {
        setCurrentProject(prev => prev ? { ...prev, ...updates } : null);
        // Update in projects list
        setProjects(prev => prev.map(p => 
          p.id === currentProject.id ? { ...p, ...updates } : p
        ));
      } else {
        console.error('Failed to save project:', result.error);
      }
    } catch (error) {
      console.error('Failed to save project:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadProject = async (projectId: string) => {
    setIsLoading(true);
    try {
      const project = projects.find(p => p.id === projectId);
      if (project) {
        setCurrentProject(project);
        // You would also need to update the canvas and pages contexts here
        // This would require additional methods in those contexts
      }
    } catch (error) {
      console.error('Failed to load project:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProject = async (projectId: string) => {
    setIsLoading(true);
    try {
      const result = await projectAPI.delete(projectId);
      if (result.success) {
        setProjects(prev => prev.filter(p => p.id !== projectId));
        if (currentProject?.id === projectId) {
          setCurrentProject(null);
        }
      } else {
        console.error('Failed to delete project:', result.error);
      }
    } catch (error) {
      console.error('Failed to delete project:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserProjects = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const result = await projectAPI.getByUserId(user.id);
      if (result.success && result.projects) {
        setProjects(result.projects);
      } else {
        console.error('Failed to load projects:', result.error);
      }
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProjectName = (name: string) => {
    if (currentProject) {
      setCurrentProject(prev => prev ? { ...prev, name } : null);
    }
  };

  const value: ProjectContextType = {
    currentProject,
    projects,
    isLoading,
    createProject,
    saveProject,
    loadProject,
    deleteProject,
    loadUserProjects,
    updateProjectName,
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
} 