import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Download, Eye, Settings, Wand2 } from 'lucide-react';
import { useRenderer } from '../context/RendererContext';
import { PlatformSwitcher, FieldInput, SlidePreview } from '@koech-design-lab/shared-ui';
import { getTemplateById, getTemplateComponent } from '../utils/templateRegistry';
import { PLATFORM_DIMENSIONS, Brand } from '../types';
import { getSampleBrandLogo } from '../utils/imageUtils';

// Sample brand for testing
const SAMPLE_BRAND: Brand = {
  id: 'sample-brand',
  name: 'Sample Brand',
  logo: getSampleBrandLogo(), // Use utility function for better fallback
  colors: {
    primary: '#3B82F6',
    secondary: '#64748B',
    accent: '#10B981',
    background: '#FFFFFF',
    text: '#1F2937',
  },
  fonts: {
    primary: 'Inter',
    secondary: 'Inter',
  },
};

export default function Playground() {
  const { templateId } = useParams<{ templateId: string }>();
  const {
    platform,
    brand,
    currentTemplate,
    content,
    isRendering,
    setPlatform,
    setBrand,
    setTemplate,
    updateField,
    renderImage,
  } = useRenderer();

  const [renderResult, setRenderResult] = useState<string | null>(null);

  useEffect(() => {
    if (templateId) {
      const template = getTemplateById(templateId);
      if (template) {
        setTemplate(template);
      }
    }
    
    // Set sample brand if none exists
    if (!brand) {
      setBrand(SAMPLE_BRAND);
    }
  }, [templateId, setTemplate, setBrand, brand]);

  const handleRender = async () => {
    const result = await renderImage();
    if (result.success && result.imageUrl) {
      setRenderResult(result.imageUrl);
    } else {
      console.error('Render failed:', result.error);
    }
  };

  if (!currentTemplate) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Wand2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Template not found</h3>
          <p className="text-gray-600">The requested template could not be loaded.</p>
        </div>
      </div>
    );
  }

  const TemplateComponent = getTemplateComponent(currentTemplate.componentName);
  const dimensions = PLATFORM_DIMENSIONS[platform];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{currentTemplate.name}</h1>
          <p className="text-gray-600">{currentTemplate.description}</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleRender}
            disabled={isRendering}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isRendering ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Rendering...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Generate Image</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Controls */}
        <div className="w-80 border-r border-gray-200 bg-gray-50 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Platform Switcher */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Platform</h3>
              <PlatformSwitcher
                selected={platform}
                onChange={setPlatform}
              />
            </div>

            {/* Template Fields */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Content</h3>
              <div className="space-y-4">
                {currentTemplate.editableFields.map((field) => (
                  <FieldInput
                    key={field.key}
                    type={field.type}
                    label={field.label}
                    value={content[field.key] || ''}
                    onChange={(value) => updateField(field.key, value)}
                    placeholder={field.placeholder}
                    required={field.required}
                    maxLength={field.maxLength}
                  />
                ))}
              </div>
            </div>

            {/* Brand Settings */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                <Settings className="w-4 h-4 mr-2" />
                Brand Settings
              </h3>
              <div className="space-y-4">
                <FieldInput
                  type="color"
                  label="Primary Color"
                  value={brand?.colors.primary || '#3B82F6'}
                  onChange={(value) => {
                    if (brand) {
                      setBrand({
                        ...brand,
                        colors: { ...brand.colors, primary: value as string }
                      });
                    }
                  }}
                />
                <FieldInput
                  type="color"
                  label="Secondary Color"
                  value={brand?.colors.secondary || '#64748B'}
                  onChange={(value) => {
                    if (brand) {
                      setBrand({
                        ...brand,
                        colors: { ...brand.colors, secondary: value as string }
                      });
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Preview */}
        <div className="flex-1 p-6 bg-gray-100 overflow-auto">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <Eye className="w-5 h-5 mr-2" />
                Preview
              </h3>
              <div className="text-sm text-gray-600">
                {dimensions.name} • {dimensions.width} × {dimensions.height}
              </div>
            </div>

            <div className="flex justify-center">
              <SlidePreview
                width={dimensions.width}
                height={dimensions.height}
                platform={dimensions.name}
                scale={0.4}
              >
                {TemplateComponent && brand && (
                  <TemplateComponent
                    brand={brand}
                    content={content}
                    platform={platform}
                    width={dimensions.width}
                    height={dimensions.height}
                  />
                )}
              </SlidePreview>
            </div>

            {/* Render Result */}
            {renderResult && (
              <div className="mt-8 p-4 bg-white rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-900 mb-3">Generated Image</h4>
                <img 
                  src={renderResult} 
                  alt="Generated" 
                  className="max-w-full h-auto rounded-lg shadow-sm"
                />
                <div className="mt-3 flex space-x-3">
                  <a 
                    href={renderResult} 
                    download 
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Download Image
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 