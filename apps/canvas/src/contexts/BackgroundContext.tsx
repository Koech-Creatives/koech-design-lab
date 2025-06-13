import React, { createContext, useContext, useState, ReactNode } from 'react';

interface BackgroundContextType {
  editorBackgroundColor: string;
  canvasBackgroundColor: string;
  setEditorBackgroundColor: (color: string) => void;
  setCanvasBackgroundColor: (color: string) => void;
}

const BackgroundContext = createContext<BackgroundContextType | undefined>(undefined);

export function BackgroundProvider({ children }: { children: ReactNode }) {
  const [editorBackgroundColor, setEditorBackgroundColor] = useState('#1a1a1a'); // Almost black
  const [canvasBackgroundColor, setCanvasBackgroundColor] = useState('#ffffff'); // White

  return (
    <BackgroundContext.Provider value={{
      editorBackgroundColor,
      canvasBackgroundColor,
      setEditorBackgroundColor,
      setCanvasBackgroundColor,
    }}>
      {children}
    </BackgroundContext.Provider>
  );
}

export function useBackground() {
  const context = useContext(BackgroundContext);
  if (context === undefined) {
    throw new Error('useBackground must be used within a BackgroundProvider');
  }
  return context;
} 