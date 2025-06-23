import React, { createContext, useContext, useState, useCallback } from 'react';
import { SmartFormatEngine } from '../engines/smartFormatEngine';
import { ProjectManager } from '../utils/projectManager';
import { 
  CanvasElement, 
  LayoutContext, 
  ProjectLayout,
  ElementRole,
  ResponsiveMode,
  AnchorPoint,
  ResponsiveProperties
} from '../types/canvas';

interface HistoryState {
  elements: CanvasElement[];
  timestamp: number;
}

// Legacy interface for backward compatibility
interface PlatformFormatStorage {
  [platformKey: string]: {
    [formatKey: string]: {
      elements: CanvasElement[];
      canvasBackground: string;
      lastModified: number;
    }
  }
}

interface CanvasContextType {
  elements: CanvasElement[];
  selectedElement: string | null;
  history: HistoryState[];
  historyIndex: number;
  
  // Core element methods
  addElement: (element: Omit<CanvasElement, 'id'>) => void;
  updateElement: (id: string, updates: Partial<CanvasElement>) => void;
  removeElement: (id: string) => void;
  selectElement: (id: string | null) => void;
  clearCanvas: () => void;
  duplicateElement: (id: string) => void;
  
  // History methods
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  
  // Element management
  setElements: (elements: CanvasElement[]) => void;
  
  // Legacy platform/format methods (for backward compatibility)
  savePlatformFormat: (platform: string, format: any, canvasBackground: string) => void;
  loadPlatformFormat: (platform: string, format: any, currentElements: CanvasElement[]) => CanvasElement[];
  resizeElementsForFormat: (elements: CanvasElement[], fromFormat: any, toFormat: any) => CanvasElement[];
  
  // NEW: Smart Format Engine methods
  smartTransformLayout: (fromFormat: any, toFormat: any, options?: {
    usePresets?: boolean;
    enableWorker?: boolean;
    responsiveMode?: boolean;
  }) => Promise<void>;
  
  // NEW: Project management methods
  currentProject: ProjectLayout | null;
  createProject: (name: string, canvasBackground?: string) => ProjectLayout;
  loadProject: (projectId: string) => Promise<boolean>;
  saveProject: () => void;
  setFormatOverride: (formatKey: string, elements?: CanvasElement[], canvasBackground?: string) => void;
  getResolvedElements: (formatKey: string) => CanvasElement[];
  
  // NEW: Element role management
  setElementRole: (elementId: string, role: ElementRole) => void;
  setElementResponsive: (elementId: string, responsive: Partial<ResponsiveProperties>) => void;
  getElementsByRole: (role: ElementRole) => CanvasElement[];
  
  // NEW: Layout validation
  validateLayout: (format: any) => Promise<{ isValid: boolean; issues: string[]; suggestions: string[] }>;
}

const CanvasContext = createContext<CanvasContextType | undefined>(undefined);

// Legacy storage key for backward compatibility
const LEGACY_STORAGE_KEY = 'canvas-platform-format-storage';

export function CanvasProvider({ children }: { children: React.ReactNode }) {
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryState[]>([{ elements: [], timestamp: Date.now() }]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [currentProject, setCurrentProject] = useState<ProjectLayout | null>(null);
  
  // Initialize smart format engine
  const [smartEngine] = useState(() => new SmartFormatEngine());

  // Load current project on init
  React.useEffect(() => {
    const project = ProjectManager.getCurrentProject();
    if (project) {
      setCurrentProject(project);
      setElements(project.masterLayout);
    }
  }, []);

  // Legacy methods for backward compatibility
  const loadLegacyStorage = useCallback((): PlatformFormatStorage => {
    try {
      const stored = localStorage.getItem(LEGACY_STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Error loading legacy platform-format storage:', error);
      return {};
    }
  }, []);

  const saveLegacyStorage = useCallback((storage: PlatformFormatStorage) => {
    try {
      localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(storage));
    } catch (error) {
      console.error('Error saving legacy platform-format storage:', error);
    }
  }, []);

  // Enhanced element creation with role detection
  const detectElementRole = useCallback((element: Omit<CanvasElement, 'id'>): ElementRole => {
    if (element.type === 'text') {
      const content = element.content?.toLowerCase() || '';
      if (element.fontSize && element.fontSize > 32) return 'heading';
      if (element.fontSize && element.fontSize > 24) return 'subheading';
      if (content.includes('cta') || content.includes('click') || content.includes('buy')) return 'cta';
      return 'body';
    }
    if (element.type === 'image') {
      if (element.width && element.height && element.width < 150 && element.height < 150) return 'logo';
      return 'image';
    }
    if (element.type === 'line') return 'divider';
    return 'decoration';
  }, []);

  // Enhanced add element with responsive properties
  const addElement = useCallback((element: Omit<CanvasElement, 'id'>) => {
    const role = element.role || detectElementRole(element);
    const responsive: ResponsiveProperties = element.responsive || {
      mode: 'fluid' as ResponsiveMode,
      anchor: 'top-left' as AnchorPoint
    };

    const newElement: CanvasElement = {
      ...element,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      visible: element.visible !== false,
      locked: element.locked || false,
      zIndex: element.zIndex || elements.length + 1,
      role,
      responsive,
      // Store original dimensions for accurate scaling
      originalX: element.originalX ?? element.x,
      originalY: element.originalY ?? element.y,
      originalWidth: element.originalWidth ?? element.width,
      originalHeight: element.originalHeight ?? element.height,
      originalFontSize: element.originalFontSize ?? element.fontSize,
    };
    
    const newElements = [...elements, newElement];
    setElements(newElements);
    setSelectedElement(newElement.id);
    saveToHistory(newElements);
    
    // Auto-save to current project
    if (currentProject) {
      ProjectManager.updateMasterLayout(currentProject.id, newElements);
    }
  }, [elements, detectElementRole, currentProject]);

  // Enhanced update element
  const updateElement = useCallback((id: string, updates: Partial<CanvasElement>) => {
    const newElements = elements.map(el => {
      if (el.id === id) {
        const updatedElement = { ...el, ...updates };
        
        // Update original dimensions if position/size is being manually changed
        if (updates.x !== undefined || updates.y !== undefined || 
            updates.width !== undefined || updates.height !== undefined) {
          updatedElement.originalX = updates.x ?? updatedElement.originalX ?? el.x;
          updatedElement.originalY = updates.y ?? updatedElement.originalY ?? el.y;
          updatedElement.originalWidth = updates.width ?? updatedElement.originalWidth ?? el.width;
          updatedElement.originalHeight = updates.height ?? updatedElement.originalHeight ?? el.height;
        }
        
        if (updates.fontSize !== undefined) {
          updatedElement.originalFontSize = updates.fontSize;
        }
        
        return updatedElement;
      }
      return el;
    });
    
    setElements(newElements);
    saveToHistory(newElements);
    
    // Auto-save to current project
    if (currentProject) {
      ProjectManager.updateMasterLayout(currentProject.id, newElements);
    }
  }, [elements, currentProject]);

  // Smart layout transformation
  const smartTransformLayout = useCallback(async (
    fromFormat: any, 
    toFormat: any, 
    options: {
      usePresets?: boolean;
      enableWorker?: boolean;
      responsiveMode?: boolean;
    } = {}
  ) => {
    const { usePresets = true, enableWorker = true, responsiveMode = true } = options;
    
    if (!fromFormat || !toFormat || elements.length === 0) return;

    // Create layout contexts
    const fromContext: LayoutContext = {
      containerWidth: fromFormat.width,
      containerHeight: fromFormat.height,
      aspectRatio: fromFormat.width / fromFormat.height,
      orientation: fromFormat.width > fromFormat.height ? 'landscape' : 
                  fromFormat.width < fromFormat.height ? 'portrait' : 'square',
      platform: fromFormat.platform || 'generic',
      formatName: fromFormat.name || 'unknown'
    };

    const toContext: LayoutContext = {
      containerWidth: toFormat.width,
      containerHeight: toFormat.height,
      aspectRatio: toFormat.width / toFormat.height,
      orientation: toFormat.width > toFormat.height ? 'landscape' : 
                  toFormat.width < toFormat.height ? 'portrait' : 'square',
      platform: toFormat.platform || 'generic',
      formatName: toFormat.name || 'unknown'
    };

    try {
      console.log(`🚀 Smart transform: ${fromContext.formatName} → ${toContext.formatName}`);
      
      const transformedElements = await smartEngine.transformLayout(
        elements,
        fromContext,
        toContext,
        { usePresets, enableWorker }
      );

      setElements(transformedElements);
      saveToHistory(transformedElements);
      
      // Auto-save to current project
      if (currentProject) {
        ProjectManager.updateMasterLayout(currentProject.id, transformedElements);
      }
      
    } catch (error) {
      console.error('Smart transformation failed, using legacy method:', error);
      // Fallback to legacy resize method
      const resizedElements = legacyResizeElementsForFormat(elements, fromFormat, toFormat);
      setElements(resizedElements);
      saveToHistory(resizedElements);
    }
  }, [elements, smartEngine, currentProject]);

  // Project management methods
  const createProject = useCallback((name: string, canvasBackground: string = '#ffffff'): ProjectLayout => {
    const project = ProjectManager.createProject(name, elements, canvasBackground);
    setCurrentProject(project);
    return project;
  }, [elements]);

  const loadProject = useCallback(async (projectId: string): Promise<boolean> => {
    const project = ProjectManager.loadProject(projectId);
    if (project) {
      setCurrentProject(project);
      setElements(project.masterLayout);
      saveToHistory(project.masterLayout);
      return true;
    }
    return false;
  }, []);

  const saveProject = useCallback(() => {
    if (currentProject) {
      const updatedProject = { ...currentProject, masterLayout: elements };
      ProjectManager.saveProject(updatedProject);
      setCurrentProject(updatedProject);
    }
  }, [currentProject, elements]);

  const setFormatOverride = useCallback((
    formatKey: string, 
    elements?: CanvasElement[], 
    canvasBackground?: string
  ) => {
    if (!currentProject) return;

    const overrideElements = elements || [];
    const masterElements = currentProject.masterLayout;
    const masterBackground = currentProject.canvasBackground;
    const currentBackground = canvasBackground || masterBackground;

    const override = ProjectManager.createOverrideFromDifferences(
      masterElements,
      overrideElements,
      masterBackground,
      currentBackground
    );

    ProjectManager.setFormatOverride(
      currentProject.id,
      formatKey,
      override.elementOverrides,
      override.canvasBackground
    );
  }, [currentProject]);

  const getResolvedElements = useCallback((formatKey: string): CanvasElement[] => {
    if (!currentProject) return elements;
    
    const resolved = ProjectManager.getResolvedElements(currentProject, formatKey);
    return resolved.elements;
  }, [currentProject, elements]);

  // Element role management
  const setElementRole = useCallback((elementId: string, role: ElementRole) => {
    updateElement(elementId, { role });
  }, [updateElement]);

  const setElementResponsive = useCallback((elementId: string, responsiveUpdates: any) => {
    const element = elements.find(el => el.id === elementId);
    if (element) {
      const newResponsive = { ...element.responsive, ...responsiveUpdates };
      updateElement(elementId, { responsive: newResponsive });
    }
  }, [elements, updateElement]);

  const getElementsByRole = useCallback((role: ElementRole): CanvasElement[] => {
    return elements.filter(el => el.role === role);
  }, [elements]);

  // Layout validation
  const validateLayout = useCallback(async (format: any) => {
    const context: LayoutContext = {
      containerWidth: format.width,
      containerHeight: format.height,
      aspectRatio: format.width / format.height,
      orientation: format.width > format.height ? 'landscape' : 
                  format.width < format.height ? 'portrait' : 'square',
      platform: format.platform || 'generic',
      formatName: format.name || 'unknown'
    };

    // This would typically use the worker, but for now we'll do basic validation
    const issues: string[] = [];
    const suggestions: string[] = [];

    elements.forEach((element, index) => {
      if (element.x < 0 || element.y < 0) {
        issues.push(`Element ${index + 1} is positioned outside canvas bounds`);
      }
      
      if (element.x + element.width > context.containerWidth || 
          element.y + element.height > context.containerHeight) {
        issues.push(`Element ${index + 1} extends beyond canvas boundaries`);
      }

      if (element.type === 'text' && element.fontSize && element.fontSize < 12) {
        issues.push(`Element ${index + 1} has very small font size (${element.fontSize}px)`);
        suggestions.push(`Increase font size for better readability`);
      }
    });

    return {
      isValid: issues.length === 0,
      issues,
      suggestions
    };
  }, [elements]);

  // Legacy methods for backward compatibility
  const legacyResizeElementsForFormat = useCallback((elements: CanvasElement[], fromFormat: any, toFormat: any): CanvasElement[] => {
    if (!fromFormat || !toFormat || !elements.length) return elements;
    
    const scaleX = toFormat.width / fromFormat.width;
    const scaleY = toFormat.height / fromFormat.height;
    
    return elements.map(element => {
      const originalX = element.originalX ?? element.x;
      const originalY = element.originalY ?? element.y;
      const originalWidth = element.originalWidth ?? element.width;
      const originalHeight = element.originalHeight ?? element.height;
      const originalFontSize = element.originalFontSize ?? element.fontSize;
      
      const newX = Math.round(originalX * scaleX);
      const newY = Math.round(originalY * scaleY);
      const newWidth = Math.round(originalWidth * scaleX);
      const newHeight = Math.round(originalHeight * scaleY);
      
      let newFontSize = element.fontSize;
      if (element.type === 'text' && originalFontSize) {
        newFontSize = Math.round(originalFontSize * Math.min(scaleX, scaleY));
      }
      
      const constrainedX = Math.max(0, Math.min(newX, toFormat.width - newWidth));
      const constrainedY = Math.max(0, Math.min(newY, toFormat.height - newHeight));
      const constrainedWidth = Math.max(20, Math.min(newWidth, toFormat.width - constrainedX));
      const constrainedHeight = Math.max(20, Math.min(newHeight, toFormat.height - constrainedY));
      
      return {
        ...element,
        x: constrainedX,
        y: constrainedY,
        width: constrainedWidth,
        height: constrainedHeight,
        fontSize: newFontSize,
        originalX,
        originalY,
        originalWidth,
        originalHeight,
        originalFontSize,
      };
    });
  }, []);

  const savePlatformFormat = useCallback((platform: string, format: any, canvasBackground: string) => {
    // Legacy method - now also saves to project if available
    if (currentProject) {
      const formatKey = `${format.name}_${format.width}x${format.height}`.toLowerCase();
      setFormatOverride(formatKey, elements, canvasBackground);
    }
    
    // Still maintain legacy storage for backward compatibility
    if (!platform || !format || !elements.length) return;
    
    const storage = loadLegacyStorage();
    const platformKey = platform.toLowerCase();
    const formatKey = `${format.name}_${format.width}x${format.height}`.toLowerCase();
    
    if (!storage[platformKey]) {
      storage[platformKey] = {};
    }
    
    const elementsWithOriginals = elements.map(element => ({
      ...element,
      originalX: element.originalX ?? element.x,
      originalY: element.originalY ?? element.y,
      originalWidth: element.originalWidth ?? element.width,
      originalHeight: element.originalHeight ?? element.height,
      originalFontSize: element.originalFontSize ?? element.fontSize,
      // Ensure new fields have defaults
      role: element.role || detectElementRole(element),
      responsive: element.responsive || { mode: 'fluid' as ResponsiveMode, anchor: 'top-left' as AnchorPoint }
    }));
    
    storage[platformKey][formatKey] = {
      elements: elementsWithOriginals,
      canvasBackground,
      lastModified: Date.now(),
    };
    
    saveLegacyStorage(storage);
    console.log(`💾 Saved ${elements.length} elements for ${platform} - ${format.name}`);
  }, [elements, loadLegacyStorage, saveLegacyStorage, currentProject, setFormatOverride, detectElementRole]);

  const loadPlatformFormat = useCallback((platform: string, format: any, currentElements: CanvasElement[]): CanvasElement[] => {
    // Try to load from project first
    if (currentProject) {
      const formatKey = `${format.name}_${format.width}x${format.height}`.toLowerCase();
      const resolvedElements = getResolvedElements(formatKey);
      if (resolvedElements.length > 0) {
        console.log(`📂 Loading ${resolvedElements.length} elements from project for ${platform} - ${format.name}`);
        return resolvedElements;
      }
    }
    
    // Fallback to legacy storage
    if (!platform || !format) return currentElements;
    
    const storage = loadLegacyStorage();
    const platformKey = platform.toLowerCase();
    const formatKey = `${format.name}_${format.width}x${format.height}`.toLowerCase();
    
    const exactMatch = storage[platformKey]?.[formatKey];
    if (exactMatch && exactMatch.elements.length > 0) {
      console.log(`📂 Loading ${exactMatch.elements.length} elements for ${platform} - ${format.name} (legacy exact match)`);
      return exactMatch.elements.map(element => ({
        ...element,
        // Ensure new fields have defaults for legacy elements
        role: element.role || detectElementRole(element),
        responsive: element.responsive || { mode: 'fluid' as ResponsiveMode, anchor: 'top-left' as AnchorPoint }
      }));
    }
    
    // Try same platform, different format
    const platformStorage = storage[platformKey];
    if (platformStorage) {
      const formatKeys = Object.keys(platformStorage);
      const mostRecentFormat = formatKeys
        .map(key => ({ key, data: platformStorage[key] }))
        .sort((a, b) => b.data.lastModified - a.data.lastModified)[0];
      
      if (mostRecentFormat && mostRecentFormat.data.elements.length > 0) {
        const [sourceName, sourceDimensions] = mostRecentFormat.key.split('_');
        const [sourceWidth, sourceHeight] = sourceDimensions.replace(/x/i, 'x').split('x').map(Number);
        
        const sourceFormat = { name: sourceName, width: sourceWidth, height: sourceHeight };
        
        console.log(`🔄 Smart resizing ${mostRecentFormat.data.elements.length} elements from ${sourceFormat.name} to ${format.name}`);
        
        // Use smart transformation if available
        const elementsWithDefaults = mostRecentFormat.data.elements.map(element => ({
          ...element,
          role: element.role || detectElementRole(element),
          responsive: element.responsive || { mode: 'fluid' as ResponsiveMode, anchor: 'top-left' as AnchorPoint }
        }));
        
        return legacyResizeElementsForFormat(elementsWithDefaults, sourceFormat, format);
      }
    }
    
    console.log(`📭 No stored elements found for ${platform} - ${format.name}`);
    return currentElements;
  }, [currentProject, getResolvedElements, loadLegacyStorage, detectElementRole, legacyResizeElementsForFormat]);

  // History and other existing methods remain the same
  const saveToHistory = useCallback((newElements: CanvasElement[]) => {
    const newHistoryState: HistoryState = {
      elements: JSON.parse(JSON.stringify(newElements)),
      timestamp: Date.now(),
    };
    
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newHistoryState);
    
    if (newHistory.length > 50) {
      newHistory.shift();
    } else {
      setHistoryIndex(newHistory.length - 1);
    }
    
    setHistory(newHistory);
  }, [history, historyIndex]);

  const removeElement = useCallback((id: string) => {
    const newElements = elements.filter(el => el.id !== id);
    setElements(newElements);
    if (selectedElement === id) {
      setSelectedElement(null);
    }
    saveToHistory(newElements);
    
    if (currentProject) {
      ProjectManager.updateMasterLayout(currentProject.id, newElements);
    }
  }, [elements, selectedElement, currentProject]);

  const selectElement = useCallback((id: string | null) => {
    setSelectedElement(id);
  }, []);

  const clearCanvas = useCallback(() => {
    setElements([]);
    setSelectedElement(null);
    saveToHistory([]);
    
    if (currentProject) {
      ProjectManager.updateMasterLayout(currentProject.id, []);
    }
  }, [currentProject]);

  const duplicateElement = useCallback((id: string) => {
    const element = elements.find(el => el.id === id);
    if (element) {
      const duplicated = {
        ...element,
        x: element.x + 20,
        y: element.y + 20,
      };
      delete (duplicated as any).id;
      addElement(duplicated);
    }
  }, [elements, addElement]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setElements(history[newIndex].elements);
      setSelectedElement(null);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setElements(history[newIndex].elements);
      setSelectedElement(null);
    }
  }, [history, historyIndex]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const setElementsDirectly = useCallback((newElements: CanvasElement[]) => {
    // Ensure all elements have required new fields
    const elementsWithDefaults = newElements.map(element => ({
      ...element,
      role: element.role || detectElementRole(element),
      responsive: element.responsive || { mode: 'fluid' as ResponsiveMode, anchor: 'top-left' as AnchorPoint }
    }));
    
    setElements(elementsWithDefaults);
    saveToHistory(elementsWithDefaults);
  }, [saveToHistory, detectElementRole]);

  return (
    <CanvasContext.Provider value={{
      elements,
      selectedElement,
      history,
      historyIndex,
      addElement,
      updateElement,
      removeElement,
      selectElement,
      clearCanvas,
      duplicateElement,
      undo,
      redo,
      canUndo,
      canRedo,
      setElements: setElementsDirectly,
      
      // Legacy methods
      savePlatformFormat,
      loadPlatformFormat,
      resizeElementsForFormat: legacyResizeElementsForFormat,
      
      // New smart methods
      smartTransformLayout,
      
      // Project management
      currentProject,
      createProject,
      loadProject,
      saveProject,
      setFormatOverride,
      getResolvedElements,
      
      // Element role management
      setElementRole,
      setElementResponsive,
      getElementsByRole,
      
      // Layout validation
      validateLayout,
    }}>
      {children}
    </CanvasContext.Provider>
  );
}

export function useCanvas() {
  const context = useContext(CanvasContext);
  if (context === undefined) {
    throw new Error('useCanvas must be used within a CanvasProvider');
  }
  return context;
}