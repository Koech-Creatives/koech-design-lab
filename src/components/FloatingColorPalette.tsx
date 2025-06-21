import React from 'react';
import { useCanvas } from '../contexts/CanvasContext';
import { useBrand } from '../contexts/BrandContext';

export function FloatingColorPalette() {
  const { elements, selectedElement } = useCanvas();
  const { brandAssets } = useBrand();
  
  const selectedEl = elements.find(el => el.id === selectedElement);
  
  // Don't show if no element is selected, if selected element is an image, or if we have the bottom properties panel
  // The bottom properties panel now handles colors, so we hide this to avoid duplication
  if (!selectedEl || selectedEl.type === 'image') {
    return null;
  }
  
  // Hide the floating palette since we now have the bottom properties panel
  return null;
} 