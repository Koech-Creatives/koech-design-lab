import React, { createContext, useContext } from 'react';

interface DragDropContextType {
  onDrop: (item: any, position: { x: number; y: number }) => void;
}

const DragDropContext = createContext<DragDropContextType | undefined>(undefined);

export function DragDropProvider({ children }: { children: React.ReactNode }) {
  const onDrop = (item: any, position: { x: number; y: number }) => {
    console.log('Item dropped:', item, 'at position:', position);
    // Handle drop logic here
  };

  return (
    <DragDropContext.Provider value={{ onDrop }}>
      {children}
    </DragDropContext.Provider>
  );
}

export function useDragDrop() {
  const context = useContext(DragDropContext);
  if (context === undefined) {
    throw new Error('useDragDrop must be used within a DragDropProvider');
  }
  return context;
}