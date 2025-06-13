import React, { createContext, useContext, useState, useCallback } from 'react';

interface Page {
  id: string;
  name: string;
  elements: any[];
}

interface PagesContextType {
  pages: Page[];
  currentPageId: string;
  addPage: () => void;
  removePage: (pageId: string) => void;
  setCurrentPage: (pageId: string) => void;
  getCurrentPage: () => Page | undefined;
  canAddPages: (platform: string, format: any) => boolean;
  getMaxPages: (platform: string) => number;
  updatePageElements: (pageId: string, elements: any[]) => void;
  getCurrentPageElements: () => any[];
}

const PagesContext = createContext<PagesContextType | undefined>(undefined);

// Define which platforms and formats support carousels
const carouselSupport = {
  instagram: {
    maxPages: 10,
    supportedFormats: ['Square', 'Portrait'] // No Stories or Reels
  },
  linkedin: {
    maxPages: 20,
    supportedFormats: ['Landscape', 'Square', 'Vertical']
  },
  twitter: {
    maxPages: 4,
    supportedFormats: ['Landscape', 'Square', 'Portrait']
  },
  tiktok: {
    maxPages: 1, // TikTok doesn't really support carousels
    supportedFormats: []
  }
};

export function PagesProvider({ children }: { children: React.ReactNode }) {
  const [pages, setPages] = useState<Page[]>([
    {
      id: 'page-1',
      name: 'Page 1',
      elements: []
    }
  ]);
  const [currentPageId, setCurrentPageId] = useState('page-1');

  const addPage = useCallback(() => {
    const newPageId = `page-${pages.length + 1}`;
    const newPage: Page = {
      id: newPageId,
      name: `Page ${pages.length + 1}`,
      elements: []
    };
    setPages(prev => [...prev, newPage]);
    setCurrentPageId(newPageId);
  }, [pages.length]);

  const removePage = useCallback((pageId: string) => {
    if (pages.length <= 1) return; // Don't allow removing the last page
    
    setPages(prev => prev.filter(p => p.id !== pageId));
    
    // If we're removing the current page, switch to the first remaining page
    if (currentPageId === pageId) {
      const remainingPages = pages.filter(p => p.id !== pageId);
      if (remainingPages.length > 0) {
        setCurrentPageId(remainingPages[0].id);
      }
    }
  }, [pages, currentPageId]);

  const setCurrentPage = useCallback((pageId: string) => {
    setCurrentPageId(pageId);
  }, []);

  const getCurrentPage = useCallback(() => {
    return pages.find(page => page.id === currentPageId);
  }, [pages, currentPageId]);

  const canAddPages = useCallback((platform: string, format: any): boolean => {
    const support = carouselSupport[platform as keyof typeof carouselSupport];
    if (!support) return false;
    
    // Check if current format supports carousels
    const formatSupported = support.supportedFormats.includes(format.name);
    if (!formatSupported) return false;
    
    // Check if we haven't reached the maximum pages
    return pages.length < support.maxPages;
  }, [pages.length]);

  const getMaxPages = useCallback((platform: string): number => {
    const support = carouselSupport[platform as keyof typeof carouselSupport];
    return support?.maxPages || 1;
  }, []);

  const updatePageElements = useCallback((pageId: string, elements: any[]) => {
    setPages(prev => prev.map(page => 
      page.id === pageId 
        ? { ...page, elements: [...elements] }
        : page
    ));
  }, []);

  const getCurrentPageElements = useCallback(() => {
    const currentPage = pages.find(page => page.id === currentPageId);
    return currentPage?.elements || [];
  }, [pages, currentPageId]);

  const value: PagesContextType = {
    pages,
    currentPageId,
    addPage,
    removePage,
    setCurrentPage,
    getCurrentPage,
    canAddPages,
    getMaxPages,
    updatePageElements,
    getCurrentPageElements
  };

  return (
    <PagesContext.Provider value={value}>
      {children}
    </PagesContext.Provider>
  );
}

export function usePages() {
  const context = useContext(PagesContext);
  if (context === undefined) {
    throw new Error('usePages must be used within a PagesProvider');
  }
  return context;
} 