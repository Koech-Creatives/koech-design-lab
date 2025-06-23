import { CanvasElement, ProjectLayout, FormatOverride, LayoutContext } from '../types/canvas';

export class ProjectManager {
  private static readonly STORAGE_KEY = 'design-projects';
  private static readonly CURRENT_PROJECT_KEY = 'current-project-id';

  /**
   * Create a new project from current canvas state
   */
  static createProject(
    name: string,
    masterLayout: CanvasElement[],
    canvasBackground: string = '#ffffff'
  ): ProjectLayout {
    const project: ProjectLayout = {
      id: this.generateId(),
      name,
      masterLayout: this.sanitizeElements(masterLayout),
      canvasBackground,
      overrides: {},
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    this.saveProject(project);
    this.setCurrentProject(project.id);
    
    console.log(`📁 Created project: ${name} (${project.id})`);
    return project;
  }

  /**
   * Load an existing project
   */
  static loadProject(projectId: string): ProjectLayout | null {
    const projects = this.getAllProjects();
    const project = projects.find(p => p.id === projectId);
    
    if (project) {
      this.setCurrentProject(projectId);
      console.log(`📂 Loaded project: ${project.name} (${projectId})`);
    }
    
    return project || null;
  }

  /**
   * Save project changes
   */
  static saveProject(project: ProjectLayout): void {
    const projects = this.getAllProjects();
    const existingIndex = projects.findIndex(p => p.id === project.id);
    
    project.updatedAt = Date.now();
    
    if (existingIndex >= 0) {
      projects[existingIndex] = project;
    } else {
      projects.push(project);
    }
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(projects));
  }

  /**
   * Get all saved projects
   */
  static getAllProjects(): ProjectLayout[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load projects:', error);
      return [];
    }
  }

  /**
   * Delete a project
   */
  static deleteProject(projectId: string): boolean {
    const projects = this.getAllProjects();
    const filteredProjects = projects.filter(p => p.id !== projectId);
    
    if (filteredProjects.length !== projects.length) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredProjects));
      
      // Clear current project if it was deleted
      if (this.getCurrentProjectId() === projectId) {
        localStorage.removeItem(this.CURRENT_PROJECT_KEY);
      }
      
      console.log(`🗑️ Deleted project: ${projectId}`);
      return true;
    }
    
    return false;
  }

  /**
   * Get current project ID
   */
  static getCurrentProjectId(): string | null {
    return localStorage.getItem(this.CURRENT_PROJECT_KEY);
  }

  /**
   * Set current project
   */
  static setCurrentProject(projectId: string): void {
    localStorage.setItem(this.CURRENT_PROJECT_KEY, projectId);
  }

  /**
   * Get current project data
   */
  static getCurrentProject(): ProjectLayout | null {
    const currentId = this.getCurrentProjectId();
    return currentId ? this.loadProject(currentId) : null;
  }

  /**
   * Update master layout
   */
  static updateMasterLayout(
    projectId: string, 
    elements: CanvasElement[], 
    canvasBackground?: string
  ): ProjectLayout | null {
    const project = this.loadProject(projectId);
    if (!project) return null;

    project.masterLayout = this.sanitizeElements(elements);
    if (canvasBackground) {
      project.canvasBackground = canvasBackground;
    }

    this.saveProject(project);
    console.log(`📝 Updated master layout for: ${project.name}`);
    return project;
  }

  /**
   * Add or update format override
   */
  static setFormatOverride(
    projectId: string,
    formatKey: string,
    elementOverrides: { [elementId: string]: FormatOverride },
    canvasBackground?: string,
    layoutPreset?: string
  ): ProjectLayout | null {
    const project = this.loadProject(projectId);
    if (!project) return null;

    project.overrides[formatKey] = {
      elementOverrides,
      canvasBackground,
      layoutPreset
    };

    // Update element override tracking
    Object.keys(elementOverrides).forEach(elementId => {
      const element = project.masterLayout.find(el => el.id === elementId);
      if (element) {
        element.hasOverrides = true;
        element.overrideFormats = element.overrideFormats || [];
        if (!element.overrideFormats.includes(formatKey)) {
          element.overrideFormats.push(formatKey);
        }
      }
    });

    this.saveProject(project);
    console.log(`🎨 Added override for format: ${formatKey} in project: ${project.name}`);
    return project;
  }

  /**
   * Remove format override
   */
  static removeFormatOverride(projectId: string, formatKey: string): ProjectLayout | null {
    const project = this.loadProject(projectId);
    if (!project) return null;

    delete project.overrides[formatKey];

    // Update element override tracking
    project.masterLayout.forEach(element => {
      if (element.overrideFormats) {
        element.overrideFormats = element.overrideFormats.filter(f => f !== formatKey);
        element.hasOverrides = element.overrideFormats.length > 0;
      }
    });

    this.saveProject(project);
    console.log(`🗑️ Removed override for format: ${formatKey} from project: ${project.name}`);
    return project;
  }

  /**
   * Get resolved elements for a specific format (master + overrides)
   */
  static getResolvedElements(
    project: ProjectLayout,
    formatKey: string
  ): { elements: CanvasElement[]; canvasBackground: string } {
    const baseElements = [...project.masterLayout];
    const override = project.overrides[formatKey];

    if (!override) {
      return {
        elements: baseElements,
        canvasBackground: project.canvasBackground
      };
    }

    // Apply element overrides
    const resolvedElements = baseElements.map(element => {
      const elementOverride = override.elementOverrides[element.id];
      if (elementOverride) {
        return { ...element, ...elementOverride };
      }
      return element;
    });

    return {
      elements: resolvedElements,
      canvasBackground: override.canvasBackground || project.canvasBackground
    };
  }

  /**
   * Create format override from current differences
   */
  static createOverrideFromDifferences(
    masterElements: CanvasElement[],
    currentElements: CanvasElement[],
    masterBackground: string,
    currentBackground: string
  ): { 
    elementOverrides: { [elementId: string]: FormatOverride };
    canvasBackground?: string;
  } {
    const elementOverrides: { [elementId: string]: FormatOverride } = {};

    // Compare elements and create overrides for differences
    currentElements.forEach(currentElement => {
      const masterElement = masterElements.find(el => el.id === currentElement.id);
      if (!masterElement) return;

      const override = this.calculateElementDifferences(masterElement, currentElement);
      if (Object.keys(override).length > 1) { // More than just elementId
        elementOverrides[currentElement.id] = override;
      }
    });

    const result: any = { elementOverrides };
    
    if (currentBackground !== masterBackground) {
      result.canvasBackground = currentBackground;
    }

    return result;
  }

  /**
   * Export project for sharing/backup
   */
  static exportProject(projectId: string): string | null {
    const project = this.loadProject(projectId);
    if (!project) return null;

    return JSON.stringify(project, null, 2);
  }

  /**
   * Import project from JSON
   */
  static importProject(jsonData: string): ProjectLayout | null {
    try {
      const project: ProjectLayout = JSON.parse(jsonData);
      
      // Validate project structure
      if (!project.id || !project.name || !project.masterLayout) {
        throw new Error('Invalid project structure');
      }

      // Generate new ID to avoid conflicts
      project.id = this.generateId();
      project.name = `${project.name} (Imported)`;
      project.updatedAt = Date.now();

      this.saveProject(project);
      console.log(`📥 Imported project: ${project.name}`);
      return project;
    } catch (error) {
      console.error('Failed to import project:', error);
      return null;
    }
  }

  /**
   * Duplicate an existing project
   */
  static duplicateProject(projectId: string, newName?: string): ProjectLayout | null {
    const originalProject = this.loadProject(projectId);
    if (!originalProject) return null;

    const duplicatedProject: ProjectLayout = {
      ...originalProject,
      id: this.generateId(),
      name: newName || `${originalProject.name} (Copy)`,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    this.saveProject(duplicatedProject);
    console.log(`📋 Duplicated project: ${duplicatedProject.name}`);
    return duplicatedProject;
  }

  /**
   * Get project statistics
   */
  static getProjectStats(projectId: string): {
    elementCount: number;
    overrideCount: number;
    formatCount: number;
    lastModified: Date;
  } | null {
    const project = this.loadProject(projectId);
    if (!project) return null;

    const overrideCount = Object.values(project.overrides).reduce(
      (total, override) => total + Object.keys(override.elementOverrides).length,
      0
    );

    return {
      elementCount: project.masterLayout.length,
      overrideCount,
      formatCount: Object.keys(project.overrides).length,
      lastModified: new Date(project.updatedAt)
    };
  }

  // Private helper methods
  private static generateId(): string {
    return `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private static sanitizeElements(elements: CanvasElement[]): CanvasElement[] {
    return elements.map(element => ({
      ...element,
      // Ensure required fields are present with defaults
      role: element.role || 'body',
      responsive: element.responsive || {
        mode: 'fluid',
        anchor: 'top-left'
      },
      // Preserve original dimensions if not already set
      originalX: element.originalX ?? element.x,
      originalY: element.originalY ?? element.y,
      originalWidth: element.originalWidth ?? element.width,
      originalHeight: element.originalHeight ?? element.height,
      originalFontSize: element.originalFontSize ?? element.fontSize
    }));
  }

  private static calculateElementDifferences(
    master: CanvasElement,
    current: CanvasElement
  ): FormatOverride {
    const override: FormatOverride = {
      elementId: current.id
    };

    // Check position changes
    if (master.x !== current.x) override.x = current.x;
    if (master.y !== current.y) override.y = current.y;

    // Check size changes
    if (master.width !== current.width) override.width = current.width;
    if (master.height !== current.height) override.height = current.height;

    // Check text properties
    if (master.fontSize !== current.fontSize) override.fontSize = current.fontSize;

    // Check visibility
    if (master.visible !== current.visible) override.visible = current.visible;

    // Check responsive properties
    if (JSON.stringify(master.responsive) !== JSON.stringify(current.responsive)) {
      override.responsive = current.responsive;
    }

    // Add other property comparisons as needed
    const propertiesToCheck = [
      'color', 'backgroundColor', 'borderRadius', 'borderColor',
      'fontWeight', 'fontFamily', 'textAlign', 'content'
    ];

    propertiesToCheck.forEach(prop => {
      if ((master as any)[prop] !== (current as any)[prop]) {
        (override as any)[prop] = (current as any)[prop];
      }
    });

    return override;
  }

  /**
   * Cleanup old or unused projects
   */
  static cleanupProjects(maxAge: number = 30 * 24 * 60 * 60 * 1000): number { // 30 days default
    const projects = this.getAllProjects();
    const cutoffTime = Date.now() - maxAge;
    
    const activeProjects = projects.filter(project => project.updatedAt > cutoffTime);
    const removedCount = projects.length - activeProjects.length;
    
    if (removedCount > 0) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(activeProjects));
      console.log(`🧹 Cleaned up ${removedCount} old projects`);
    }
    
    return removedCount;
  }
} 