import React, { createContext, useContext, useState, useEffect } from 'react';

interface Color {
  name: string;
  hex: string;
}

interface Font {
  name: string;
  url: string;
  family: string;
}

interface BrandAssets {
  colors: Color[];
  fonts: Font[];
  logo?: string;
}

interface BrandContextType {
  brandAssets: BrandAssets;
  addColor: (color: Color) => void;
  removeColor: (name: string) => void;
  addFont: (font: Font) => void;
  removeFont: (name: string) => void;
  setLogo: (url: string) => void;
}

const BrandContext = createContext<BrandContextType | undefined>(undefined);

const defaultBrandAssets: BrandAssets = {
  colors: [], // Start with empty colors array
  fonts: [
    { name: 'Inter', url: '', family: 'Inter, sans-serif' },
    { name: 'Roboto', url: '', family: 'Roboto, sans-serif' },
    { name: 'Poppins', url: '', family: 'Poppins, sans-serif' },
  ],
};

// Load brand assets from localStorage
const loadBrandAssets = (): BrandAssets => {
  try {
    const saved = localStorage.getItem('brandAssets');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...defaultBrandAssets,
        ...parsed,
        // Ensure colors is always an array
        colors: Array.isArray(parsed.colors) ? parsed.colors : [],
      };
    }
  } catch (error) {
    console.error('Error loading brand assets from localStorage:', error);
  }
  return defaultBrandAssets;
};

// Save brand assets to localStorage
const saveBrandAssets = (assets: BrandAssets) => {
  try {
    localStorage.setItem('brandAssets', JSON.stringify(assets));
  } catch (error) {
    console.error('Error saving brand assets to localStorage:', error);
  }
};

export function BrandProvider({ children }: { children: React.ReactNode }) {
  const [brandAssets, setBrandAssets] = useState<BrandAssets>(loadBrandAssets);

  // Save to localStorage whenever brandAssets changes
  useEffect(() => {
    saveBrandAssets(brandAssets);
  }, [brandAssets]);

  const addColor = (color: Color) => {
    setBrandAssets(prev => ({
      ...prev,
      colors: [...prev.colors, color],
    }));
  };

  const removeColor = (name: string) => {
    setBrandAssets(prev => ({
      ...prev,
      colors: prev.colors.filter(c => c.name !== name),
    }));
  };

  const addFont = (font: Font) => {
    setBrandAssets(prev => ({
      ...prev,
      fonts: [...prev.fonts, font],
    }));
  };

  const removeFont = (name: string) => {
    setBrandAssets(prev => ({
      ...prev,
      fonts: prev.fonts.filter(f => f.name !== name),
    }));
  };

  const setLogo = (url: string) => {
    setBrandAssets(prev => ({
      ...prev,
      logo: url,
    }));
  };

  return (
    <BrandContext.Provider value={{
      brandAssets,
      addColor,
      removeColor,
      addFont,
      removeFont,
      setLogo,
    }}>
      {children}
    </BrandContext.Provider>
  );
}

export function useBrand() {
  const context = useContext(BrandContext);
  if (context === undefined) {
    throw new Error('useBrand must be used within a BrandProvider');
  }
  return context;
}