import React, { createContext, useContext, useState, ReactNode } from 'react';
import { 
  Platform, 
  Brand, 
  Template, 
  TemplateContent, 
  RendererContextType, 
  RenderResponse,
  RenderRequest 
} from '../types';

const RendererContext = createContext<RendererContextType | undefined>(undefined);

interface RendererProviderProps {
  children: ReactNode;
}

export function RendererProvider({ children }: RendererProviderProps) {
  const [platform, setPlatform] = useState<Platform>('instagram');
  const [brand, setBrand] = useState<Brand | null>(null);
  const [currentTemplate, setCurrentTemplate] = useState<Template | null>(null);
  const [content, setContent] = useState<TemplateContent>({});
  const [isRendering, setIsRendering] = useState(false);

  const setTemplate = (template: Template) => {
    setCurrentTemplate(template);
    // Initialize content with default values from template fields
    const initialContent: TemplateContent = {};
    template.editableFields.forEach(field => {
      initialContent[field.key] = '';
    });
    setContent(initialContent);
  };

  const updateField = (key: string, value: string | number | boolean) => {
    setContent(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const resetContent = () => {
    if (currentTemplate) {
      const initialContent: TemplateContent = {};
      currentTemplate.editableFields.forEach(field => {
        initialContent[field.key] = '';
      });
      setContent(initialContent);
    }
  };

  const renderImage = async (): Promise<RenderResponse> => {
    if (!currentTemplate || !brand) {
      return {
        success: false,
        error: 'Template and brand are required for rendering'
      };
    }

    setIsRendering(true);
    
    try {
      const renderRequest: RenderRequest = {
        templateId: currentTemplate.id,
        brand,
        content,
        platform
      };

      const response = await fetch('/api/render', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(renderRequest)
      });

      if (!response.ok) {
        throw new Error(`Render failed: ${response.statusText}`);
      }

      const result: RenderResponse = await response.json();
      return result;
    } catch (error) {
      console.error('Render error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown render error'
      };
    } finally {
      setIsRendering(false);
    }
  };

  const value: RendererContextType = {
    // State
    platform,
    brand,
    currentTemplate,
    content,
    isRendering,
    
    // Actions
    setPlatform,
    setBrand,
    setTemplate,
    updateField,
    resetContent,
    renderImage
  };

  return (
    <RendererContext.Provider value={value}>
      {children}
    </RendererContext.Provider>
  );
}

export function useRenderer() {
  const context = useContext(RendererContext);
  if (!context) {
    throw new Error('useRenderer must be used within a RendererProvider');
  }
  return context;
} 