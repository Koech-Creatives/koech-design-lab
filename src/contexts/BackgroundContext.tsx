import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useBrand } from './BrandContext';
import { useAuth } from './AuthContext';

interface BackgroundContextType {
  editorBackgroundColor: string;
  canvasBackgroundColor: string;
  setEditorBackgroundColor: (color: string) => void;
  setCanvasBackgroundColor: (color: string) => void;
  getDefaultCanvasColor: () => string;
}

const BackgroundContext = createContext<BackgroundContextType | undefined>(undefined);

// Koech Labs default colors
const KOECH_DEFAULTS = {
  primary: '#ff4940',    // Koech Red
  secondary: '#002e51',  // Koech Navy
  accent: '#6366f1',     // Koech Blue
  white: '#ffffff'       // Clean white
};

export function BackgroundProvider({ children }: { children: ReactNode }) {
  const [editorBackgroundColor, setEditorBackgroundColor] = useState('#1a1a1a'); // Almost black
  const [canvasBackgroundColor, setCanvasBackgroundColor] = useState('#ffffff'); // White default
  const { brandAssets } = useBrand();
  const { isAuthenticated } = useAuth();

  // Function to get the default canvas color based on user state and brand
  const getDefaultCanvasColor = (): string => {
    if (isAuthenticated && brandAssets.colors && brandAssets.colors.length > 0) {
      // Use the first brand color (usually primary) as default
      const primaryBrandColor = brandAssets.colors.find(color => 
        color.name.toLowerCase().includes('primary') || 
        color.name.toLowerCase().includes('main')
      );
      
      if (primaryBrandColor) {
        return primaryBrandColor.hex;
      }
      
      // If no primary found, use the first color
      return brandAssets.colors[0].hex;
    }
    
    // For unauthenticated users or users without brand colors, use Koech defaults
    return KOECH_DEFAULTS.white; // Clean white background as default
  };

  // Update canvas background when brand assets change or user authentication changes
  useEffect(() => {
    // Only auto-update if canvas is at default white and user just logged in with brand colors
    if (canvasBackgroundColor === '#ffffff' && isAuthenticated && brandAssets.colors && brandAssets.colors.length > 0) {
      // Check if user has a preferred background color from their brand
      const lightBrandColor = brandAssets.colors.find(color => {
        // Look for light colors that work well as backgrounds
        const hex = color.hex.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness > 180; // Light enough for text to be readable
      });
      
      // For now, keep white as default to maintain design flexibility
      // Users can manually select brand colors from the picker
      console.log('🎨 [BACKGROUND] Brand colors available for canvas background selection');
    }
  }, [brandAssets.colors, isAuthenticated]);

  return (
    <BackgroundContext.Provider value={{
      editorBackgroundColor,
      canvasBackgroundColor,
      setEditorBackgroundColor,
      setCanvasBackgroundColor,
      getDefaultCanvasColor,
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