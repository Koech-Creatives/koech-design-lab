import { useEffect } from 'react';
import { useCanvas } from '../contexts/CanvasContext';
import { usePages } from '../contexts/PagesContext';

export function useCanvasPages() {
  const canvas = useCanvas();
  const pages = usePages();

  // Sync canvas elements with current page when page changes
  useEffect(() => {
    const currentPageElements = pages.getCurrentPageElements();
    
    // Clear canvas first
    canvas.clearCanvas();
    
    // Add elements from current page without triggering history
    currentPageElements.forEach(element => {
      // Use a direct approach to avoid triggering saveToHistory
      canvas.addElement(element);
    });
  }, [pages.currentPageId]);

  // Sync current page elements when canvas elements change
  useEffect(() => {
    if (canvas.elements.length > 0 || pages.getCurrentPageElements().length > 0) {
      pages.updatePageElements(pages.currentPageId, canvas.elements);
    }
  }, [canvas.elements]);

  return {
    ...canvas,
    ...pages,
    // Override clearCanvas to only clear current page
    clearCurrentPage: () => {
      canvas.clearCanvas();
      pages.updatePageElements(pages.currentPageId, []);
    }
  };
} 