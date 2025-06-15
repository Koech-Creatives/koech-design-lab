import React, { createContext, useContext, useState, useCallback } from 'react';

interface CanvasElement {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  content?: string;
  style?: any;
  visible?: boolean;
  locked?: boolean;
  zIndex?: number;
  // Text-specific properties
  fontSize?: number;
  fontWeight?: string;
  fontFamily?: string;
  textAlign?: string;
  textTransform?: string;
  textStyle?: string;
  customStyle?: any;
  autoWrap?: boolean;
  color?: string;
  backgroundColor?: string;
  borderRadius?: number;
  borderColor?: string;
  // Other element properties
  src?: string;
  alt?: string;
  ctaType?: string;
  path?: string;
  padding?: number;
}

interface HistoryState {
  elements: CanvasElement[];
  timestamp: number;
}

interface CanvasContextType {
  elements: CanvasElement[];
  selectedElement: string | null;
  history: HistoryState[];
  historyIndex: number;
  addElement: (element: Omit<CanvasElement, 'id'>) => void;
  updateElement: (id: string, updates: Partial<CanvasElement>) => void;
  removeElement: (id: string) => void;
  selectElement: (id: string | null) => void;
  clearCanvas: () => void;
  duplicateElement: (id: string) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const CanvasContext = createContext<CanvasContextType | undefined>(undefined);

export function CanvasProvider({ children }: { children: React.ReactNode }) {
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryState[]>([{ elements: [], timestamp: Date.now() }]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const saveToHistory = useCallback((newElements: CanvasElement[]) => {
    const newHistoryState: HistoryState = {
      elements: JSON.parse(JSON.stringify(newElements)),
      timestamp: Date.now(),
    };
    
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newHistoryState);
    
    // Limit history to 50 states
    if (newHistory.length > 50) {
      newHistory.shift();
    } else {
      setHistoryIndex(newHistory.length - 1);
    }
    
    setHistory(newHistory);
  }, [history, historyIndex]);

  const addElement = useCallback((element: Omit<CanvasElement, 'id'>) => {
    const newElement: CanvasElement = {
      ...element,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      visible: element.visible !== false,
      locked: element.locked || false,
      zIndex: element.zIndex || elements.length + 1,
    };
    const newElements = [...elements, newElement];
    setElements(newElements);
    setSelectedElement(newElement.id);
    saveToHistory(newElements);
  }, [elements, saveToHistory]);

  const updateElement = useCallback((id: string, updates: Partial<CanvasElement>) => {
    const newElements = elements.map(el => el.id === id ? { ...el, ...updates } : el);
    setElements(newElements);
    saveToHistory(newElements);
  }, [elements, saveToHistory]);

  const removeElement = useCallback((id: string) => {
    const newElements = elements.filter(el => el.id !== id);
    setElements(newElements);
    if (selectedElement === id) {
      setSelectedElement(null);
    }
    saveToHistory(newElements);
  }, [elements, selectedElement, saveToHistory]);

  const selectElement = useCallback((id: string | null) => {
    setSelectedElement(id);
  }, []);

  const clearCanvas = useCallback(() => {
    setElements([]);
    setSelectedElement(null);
    saveToHistory([]);
  }, [saveToHistory]);

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