import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Download, 
  Save, 
  Settings, 
  Monitor,
  Smartphone,
  Tablet,
  Eye,
  Code,
  Palette
} from 'lucide-react';
import { getTemplateById } from '../../data/htmlTemplates';
import { useBrand } from '../../contexts/BrandContext';
import { useProject } from '../../contexts/ProjectContext';
import { EditorPanel } from './components/EditorPanel';
import { PreviewPanel } from './components/PreviewPanel';

const platformDimensions = {
  instagram: { width: 1080, height: 1080, name: 'Instagram Post' },
  'instagram-story': { width: 1080, height: 1920, name: 'Instagram Story' },
  linkedin: { width: 1200, height: 627, name: 'LinkedIn Post' },
  twitter: { width: 1200, height: 675, name: 'Twitter Post' },
  facebook: { width: 1200, height: 630, name: 'Facebook Post' },
  tiktok: { width: 1080, height: 1920, name: 'TikTok' },
};

export function RenderStudio() {
  const { templateId } = useParams<{ templateId: string }>();
  const navigate = useNavigate();
  const { brand } = useBrand();
  const { createProject } = useProject();
  
  const [template, setTemplate] = useState<any>(null);
  const [selectedPlatform, setSelectedPlatform] = useState('instagram');
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [projectName, setProjectName] = useState('');

  // Load template
  useEffect(() => {
    if (templateId) {
      const foundTemplate = getTemplateById(templateId);
      if (foundTemplate) {
        setTemplate(foundTemplate);
        
        // Initialize field values with defaults
        const initialValues: Record<string, string> = {};
        foundTemplate.fields.forEach(field => {
          initialValues[field.id] = field.defaultValue || '';
        });
        setFieldValues(initialValues);
        
        // Set default platform
        if (foundTemplate.platforms.length > 0) {
          setSelectedPlatform(foundTemplate.platforms[0]);
        }
      } else {
        navigate('/templates');
      }
      setIsLoading(false);
    }
  }, [templateId, navigate]);

  // Generate final HTML with all replacements
  const generatedHTML = useMemo(() => {
    if (!template) return { html: '', css: '' };

    let html = template.html;
    let css = template.css;

    // Replace field values
    Object.entries(fieldValues).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`;
      html = html.replace(new RegExp(placeholder, 'g'), value);
      css = css.replace(new RegExp(placeholder, 'g'), value);
    });

    // Replace brand variables
    const brandVariables = {
      '{{logo}}': brand.logoUrl || '/logo.png',
      '{{primaryColor}}': brand.primaryColor || '#ff4940',
      '{{secondaryColor}}': brand.secondaryColor || '#003a63',
      '{{fontHeading}}': brand.fontHeading || 'Inter',
      '{{fontBody}}': brand.fontBody || 'Inter',
      '{{brandName}}': brand.name || 'Your Brand',
      // Add RGB versions for transparency effects
      '{{primaryColorRGB}}': hexToRgb(brand.primaryColor || '#ff4940'),
      '{{textColorRGB}}': hexToRgb(fieldValues.textColor || '#333333'),
    };

    Object.entries(brandVariables).forEach(([key, value]) => {
      html = html.replace(new RegExp(key.replace(/[{}]/g, '\\$&'), 'g'), value);
      css = css.replace(new RegExp(key.replace(/[{}]/g, '\\$&'), 'g'), value);
    });

    return { html, css };
  }, [template, fieldValues, brand]);

  const hexToRgb = (hex: string): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result 
      ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
      : '255, 73, 64';
  };

  const handleFieldChange = (fieldId: string, value: string) => {
    setFieldValues(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const handleSaveProject = async () => {
    if (!projectName.trim()) {
      setShowProjectModal(true);
      return;
    }

    try {
      const projectData = {
        name: projectName,
        type: 'html-template',
        template_id: templateId,
        platform: selectedPlatform,
        field_values: fieldValues,
        html: generatedHTML.html,
        css: generatedHTML.css,
        dimensions: platformDimensions[selectedPlatform as keyof typeof platformDimensions]
      };

      await createProject(projectData);
      
      // Show success notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-20 right-6 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      notification.textContent = 'Project saved successfully!';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 3000);
    } catch (error) {
      console.error('Error saving project:', error);
    }
  };

  const handleExport = async () => {
    try {
      // In a real implementation, this would call your render API
      // For now, we'll simulate the export process
      const notification = document.createElement('div');
      notification.className = 'fixed top-20 right-6 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      notification.style.backgroundColor = '#ff4940';
      notification.textContent = 'Generating image... (Feature coming soon)';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 3000);
    } catch (error) {
      console.error('Error exporting:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#1a1a1a' }}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading template...</p>
        </div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#1a1a1a' }}>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Template not found</h2>
          <button
            onClick={() => navigate('/templates')}
            className="px-6 py-3 rounded-lg text-white font-medium"
            style={{ backgroundColor: '#ff4940' }}
          >
            Back to Templates
          </button>
        </div>
      </div>
    );
  }

  const currentDimensions = platformDimensions[selectedPlatform as keyof typeof platformDimensions] || platformDimensions.instagram;

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#1a1a1a' }}>
      {/* Header */}
      <div className="border-b" style={{ backgroundColor: '#002e51', borderColor: '#004080' }}>
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/templates')}
                className="p-2 rounded-lg text-white hover:opacity-80 transition-colors"
                style={{ backgroundColor: '#003a63' }}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-3">
                <Code className="w-8 h-8" style={{ color: '#ff4940' }} />
                <div>
                  <h1 className="text-xl font-bold text-white">{template.name}</h1>
                  <p className="text-sm text-gray-400">
                    {currentDimensions.name} • {currentDimensions.width}×{currentDimensions.height}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Platform Selector */}
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="px-3 py-2 rounded-lg border text-sm"
                style={{ 
                  backgroundColor: '#003a63', 
                  borderColor: '#004080',
                  color: 'white'
                }}
              >
                {template.platforms.map((platform: string) => {
                  const dims = platformDimensions[platform as keyof typeof platformDimensions];
                  return (
                    <option key={platform} value={platform}>
                      {dims?.name || platform} ({dims?.width}×{dims?.height})
                    </option>
                  );
                })}
              </select>

              <button
                onClick={handleSaveProject}
                className="px-4 py-2 rounded-lg text-white font-medium transition-colors hover:opacity-80 flex items-center space-x-2"
                style={{ backgroundColor: '#003a63' }}
              >
                <Save className="w-4 h-4" />
                <span>Save</span>
              </button>
              
              <button
                onClick={handleExport}
                className="px-4 py-2 rounded-lg text-white font-medium transition-colors hover:opacity-80 flex items-center space-x-2"
                style={{ backgroundColor: '#ff4940' }}
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor Panel */}
        <EditorPanel
          template={template}
          fieldValues={fieldValues}
          onFieldChange={handleFieldChange}
        />

        {/* Preview Panel */}
        <PreviewPanel
          html={generatedHTML.html}
          css={generatedHTML.css}
          dimensions={currentDimensions}
        />
      </div>

      {/* Project Name Modal */}
      {showProjectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Save Project</h3>
            <input
              type="text"
              placeholder="Enter project name..."
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 mb-4"
              autoFocus
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowProjectModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowProjectModal(false);
                  handleSaveProject();
                }}
                disabled={!projectName.trim()}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 