import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTemplateById, Template, templatesData } from './templatesData';
import { useBrand } from '../../contexts/BrandContext';
import { useTheme } from '../../contexts/ThemeContext';
import { PlatformSpecs } from '../../utils/platformSpecs';
// import { ReactComponentEditor } from './components/ReactComponentEditor';
// import { satoriImageGenerator } from '../../services/satoriImageGenerator';
import { 
  ArrowLeft, 
  Download, 
  Save, 
  Settings,
  Eye,
  Sparkles,
  Menu,
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw
} from 'lucide-react';

interface TemplateField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'color' | 'image' | 'select';
  value: string;
  placeholder?: string;
  options?: string[];
}

export function TemplateEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { brandAssets } = useBrand();
  const { colors } = useTheme();
  
  const [template, setTemplate] = useState<Template | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [previewScale, setPreviewScale] = useState(0.8);
  const [brandApplied, setBrandApplied] = useState(false);
  // const [editorMode, setEditorMode] = useState<'visual' | 'code'>('visual');
  // const [reactCode, setReactCode] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  // Platform and format state
  const [selectedPlatform, setSelectedPlatform] = useState('instagram');
  const [currentFormat, setCurrentFormat] = useState(PlatformSpecs.instagram.formats[1]); // Default to Portrait
  const [showDimensionsPanel, setShowDimensionsPanel] = useState(true);

  // Dynamic template fields based on template type
  const [templateFields, setTemplateFields] = useState<TemplateField[]>([]);

  // Platform change handler
  const handlePlatformChange = (platform: string) => {
    setSelectedPlatform(platform);
    const specs = PlatformSpecs[platform as keyof typeof PlatformSpecs] || PlatformSpecs.instagram;
    setCurrentFormat(specs.formats[0]);
  };

  // Format change handler
  const handleFormatChange = (format: any) => {
    setCurrentFormat(format);
  };

  // Zoom controls
  const zoomIn = () => {
    setPreviewScale(prev => Math.min(prev + 0.1, 2));
  };

  const zoomOut = () => {
    setPreviewScale(prev => Math.max(prev - 0.1, 0.3));
  };

  const resetZoom = () => {
    setPreviewScale(0.8);
  };

  // Load template data
  useEffect(() => {
    console.log('TemplateEditor: Loading template with ID:', id);
    if (id) {
      const foundTemplate = getTemplateById(id);
      console.log('TemplateEditor: Found template:', foundTemplate);
      if (foundTemplate) {
        setTemplate(foundTemplate);
        initializeFields(foundTemplate);
      } else {
        console.error('TemplateEditor: Template not found for ID:', id);
        navigate('/templates');
      }
      setIsLoading(false);
    }
  }, [id, navigate]);

  // Helper function to generate placeholder images using placehold.co
  const getPlaceholderImage = (fieldId: string, template: Template, width = 400, height = 400) => {
    const primaryColor = template?.defaultStyles?.colors?.primary?.replace('#', '') || '3B82F6';
    const textColor = 'FFFFFF';
    
    const placeholderTexts: { [key: string]: string } = {
      'logoUrl': 'Logo',
      'productImage': 'Product',
      'customerImage': 'Customer',
      'brandImage': 'Brand',
      'eventImage': 'Event',
      'backgroundImage': 'Background'
    };
    
    const text = placeholderTexts[fieldId] || 'Image';
    
    // Use placehold.co with proper format: https://placehold.co/WIDTHxHEIGHT/BACKGROUND/TEXT?text=CUSTOM_TEXT
    const placeholderUrl = `https://placehold.co/${width}x${height}/${primaryColor}/${textColor}/png?text=${encodeURIComponent(text)}&font=roboto`;
    
    console.log(`TemplateEditor: Generated placehold.co URL for ${fieldId}:`, placeholderUrl);
    return placeholderUrl;
  };

  // Initialize editable fields based on template
  const initializeFields = (template: Template) => {
    if (!template || !template.baseHTML) {
      console.error('TemplateEditor: Invalid template provided to initializeFields');
      return;
    }

    const fields: TemplateField[] = [];

    // Extract field placeholders from HTML
    const placeholders = template.baseHTML.match(/\{\{(\w+)\}\}/g);
    const uniquePlaceholders = [...new Set(placeholders?.map(p => p.replace(/[{}]/g, '')) || [])];

    uniquePlaceholders.forEach(placeholder => {
      let fieldType: TemplateField['type'] = 'text';
      let fieldLabel = placeholder.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
      let defaultValue = '';
      let fieldPlaceholder = '';

      // Determine field type and default values based on placeholder name
      if (placeholder.toLowerCase().includes('image') || placeholder.toLowerCase().includes('logo')) {
        fieldType = 'image';
        defaultValue = template?.defaultStyles?.logoUrl || getPlaceholderImage(placeholder, template);
        fieldPlaceholder = 'Enter image URL...';
      } else if (placeholder.toLowerCase().includes('color')) {
        fieldType = 'color';
        defaultValue = template?.defaultStyles?.colors?.primary || '#3B82F6';
      } else if (placeholder.toLowerCase().includes('description') || placeholder.toLowerCase().includes('text')) {
        fieldType = 'textarea';
        fieldPlaceholder = `Enter ${fieldLabel.toLowerCase()}...`;
      } else {
        fieldType = 'text';
        fieldPlaceholder = `Enter ${fieldLabel.toLowerCase()}...`;
      }

      // Set default values based on template type
      switch (placeholder) {
        case 'quoteText':
          defaultValue = 'Success is not final, failure is not fatal: it is the courage to continue that counts.';
          break;
        case 'authorName':
          defaultValue = 'Winston Churchill';
          break;
        case 'authorTitle':
          defaultValue = 'Former Prime Minister';
          break;
        case 'productImage':
          defaultValue = getPlaceholderImage('productImage', template, 600, 400);
          break;
        case 'productTitle':
          defaultValue = 'Amazing Product';
          break;
        case 'productDescription':
          defaultValue = 'Discover the perfect solution for your needs with our innovative design.';
          break;
        case 'productPrice':
          defaultValue = '$99.99';
          break;
        case 'ctaText':
          defaultValue = 'Learn More';
          break;
        case 'eventTitle':
          defaultValue = 'Annual Conference 2024';
          break;
        case 'eventType':
          defaultValue = 'CONFERENCE';
          break;
        case 'eventDate':
          defaultValue = 'March 15, 2024';
          break;
        case 'eventTime':
          defaultValue = '9:00 AM - 5:00 PM';
          break;
        case 'eventLocation':
          defaultValue = 'Convention Center';
          break;
        case 'customerImage':
          defaultValue = getPlaceholderImage('customerImage', template, 100, 100);
          break;
        case 'brandName':
          defaultValue = 'Koech Creatives';
          break;
        case 'logoUrl':
          defaultValue = brandAssets?.logo || template?.defaultStyles?.logoUrl || getPlaceholderImage('logoUrl', template);
          break;
        case 'brandHandle':
          defaultValue = '@koech.creatives';
          break;
        case 'mainHeadline':
          defaultValue = 'Still Doing Tasks';
          break;
        case 'subHeadline':
          defaultValue = 'Manually!?';
          break;
        case 'callToAction':
          defaultValue = "You're moving Slower!";
          break;
        case 'highlightText':
          defaultValue = 'For businesses and Startups';
          break;
        case 'description':
          defaultValue = 'Build smarter systems with AI';
          break;
        case 'largeTextOverlay':
          defaultValue = 'AI FOR BUSINESS';
          break;
        case 'swipeText':
          defaultValue = 'Swipe';
          break;
        default:
          if (!defaultValue) {
            defaultValue = `Sample ${fieldLabel}`;
          }
      }

      fields.push({
        id: placeholder,
        label: fieldLabel,
        type: fieldType,
        value: defaultValue,
        placeholder: fieldPlaceholder
      });
    });

    console.log('TemplateEditor: Initialized fields:', fields);
    setTemplateFields(fields);
  };

  // Generate CSS with current styles
  const generateCSS = () => {
    if (!template) {
      console.log('TemplateEditor: No template for CSS generation');
      return '';
    }

    try {
      const currentColors = brandApplied ? {
        primary: brandAssets?.colors?.[0]?.hex || template?.defaultStyles?.colors?.primary || '#3B82F6',
        background: brandAssets?.colors?.[1]?.hex || template?.defaultStyles?.colors?.background || '#F8FAFC',
        text: template?.defaultStyles?.colors?.text || '#1E293B',
        accent: template?.defaultStyles?.colors?.accent || '#EF4444'
      } : template?.defaultStyles?.colors || {
        primary: '#3B82F6',
        background: '#F8FAFC',
        text: '#1E293B',
        accent: '#EF4444'
      };

      console.log('TemplateEditor: Current colors:', currentColors);

    const currentFont = brandApplied ? 
      (brandAssets?.fonts?.[0]?.family || template?.defaultStyles?.font || 'Inter, sans-serif') : 
      (template?.defaultStyles?.font || 'Inter, sans-serif');

    // Template-specific CSS
    switch (template.id) {
      case 'modern-quote':
        return `
          .quote-container {
            width: ${currentFormat.width}px;
            height: ${currentFormat.height}px;
            background: ${currentColors.background};
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 60px;
            font-family: ${currentFont};
            position: relative;
            box-sizing: border-box;
          }
          .quote-mark {
            font-size: 120px;
            color: ${currentColors.primary};
            opacity: 0.3;
            line-height: 1;
            margin-bottom: -20px;
          }
          .quote-text {
            font-size: 32px;
            color: ${currentColors.text};
            text-align: center;
            margin: 20px 0;
            line-height: 1.4;
          }
          .author-section {
            text-align: center;
            margin-top: 30px;
          }
          .author-name {
            font-size: 18px;
            font-weight: bold;
            color: ${currentColors.primary};
          }
          .author-title {
            font-size: 14px;
            color: ${currentColors.text};
            opacity: 0.7;
            margin-top: 5px;
          }
          .brand-logo {
            position: absolute;
            bottom: 20px;
            right: 20px;
          }
          .brand-logo img {
            width: 40px;
            height: 40px;
            border-radius: 50%;
          }
        `;

      case 'product-showcase':
        return `
          .product-container {
            width: ${currentFormat.width}px;
            height: ${currentFormat.height}px;
            background: ${currentColors.background};
            display: flex;
            font-family: ${currentFont};
            position: relative;
          }
          .product-image-section {
            flex: 1;
            padding: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .product-image {
            max-width: 100%;
            max-height: 100%;
            border-radius: 12px;
          }
          .product-content {
            flex: 1;
            padding: 40px;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }
          .product-title {
            font-size: 28px;
            font-weight: bold;
            color: ${currentColors.text};
            margin-bottom: 15px;
          }
          .product-description {
            font-size: 16px;
            color: ${currentColors.text};
            opacity: 0.8;
            line-height: 1.5;
            margin-bottom: 20px;
          }
          .product-price {
            font-size: 24px;
            font-weight: bold;
            color: ${currentColors.primary};
            margin-bottom: 20px;
          }
          .cta-button {
            background: ${currentColors.primary};
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: bold;
            cursor: pointer;
          }
          .brand-watermark {
            position: absolute;
            top: 20px;
            right: 20px;
          }
          .brand-watermark img {
            width: 30px;
            height: 30px;
            border-radius: 50%;
          }
        `;

      case 'business-automation-post':
        return `
          .business-post-container {
            width: ${currentFormat.width}px;
            height: ${currentFormat.height}px;
            background: ${currentColors.background};
            display: flex;
            flex-direction: column;
            font-family: ${currentFont};
            position: relative;
            box-sizing: border-box;
            padding: 60px;
            border-radius: 24px;
            overflow: hidden;
          }
          
          .brand-header {
            display: flex;
            align-items: center;
            margin-bottom: 80px;
          }
          
          .brand-logo-section {
            margin-right: 20px;
          }
          
          .brand-logo {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            object-fit: cover;
          }
          
          .brand-info {
            color: ${currentColors.text};
          }
          
          .brand-name {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 5px;
          }
          
          .brand-handle {
            font-size: 20px;
            opacity: 0.8;
          }
          
          .main-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            position: relative;
          }
          
          .main-headline {
            font-size: 72px;
            font-weight: 800;
            color: ${currentColors.text};
            line-height: 0.9;
            margin-bottom: 20px;
            text-transform: uppercase;
          }
          
          .sub-headline {
            font-size: 72px;
            font-weight: 800;
            color: ${currentColors.primary};
            line-height: 0.9;
            margin-bottom: 30px;
            text-transform: uppercase;
          }
          
          .call-to-action {
            font-size: 56px;
            font-weight: 700;
            color: ${currentColors.text};
            line-height: 1.1;
            margin-bottom: 40px;
          }
          
          .highlight-badge {
            background: ${currentColors.primary};
            color: ${currentColors.background};
            padding: 12px 24px;
            border-radius: 50px;
            font-size: 18px;
            font-weight: 600;
            display: inline-block;
            margin-bottom: 30px;
            width: fit-content;
          }
          
          .description {
            font-size: 24px;
            color: ${currentColors.text};
            line-height: 1.4;
            margin-bottom: 60px;
            opacity: 0.9;
          }
          
          .large-text-overlay {
            position: absolute;
            bottom: -50px;
            left: -20px;
            font-size: 180px;
            font-weight: 900;
            color: ${currentColors.text};
            opacity: 0.1;
            line-height: 1;
            text-transform: uppercase;
            pointer-events: none;
            z-index: 0;
          }
          
          .footer-section {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            margin-top: 40px;
          }
          
          .swipe-indicator {
            background: ${currentColors.primary};
            color: ${currentColors.background};
            padding: 12px 24px;
            border-radius: 50px;
            font-size: 16px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 10px;
          }
          
          .swipe-indicator::after {
            content: '←';
            font-size: 20px;
          }
        `;

      // Add more template-specific CSS cases here
      default:
        console.log('TemplateEditor: Using default CSS for template:', template.id);
        return `
          body {
            font-family: ${currentFont};
            margin: 0;
            padding: 20px;
            background: ${currentColors.background};
            color: ${currentColors.text};
          }
        `;
    }
    } catch (error) {
      console.error('TemplateEditor: Error generating CSS:', error);
      return `
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          background: #ffffff;
          color: #000000;
        }
      `;
    }
  };

  // Generate live preview HTML
  const previewHTML = useMemo(() => {
    if (!template) {
      console.log('TemplateEditor: No template available for preview');
      return '';
    }

    let html = template.baseHTML;
    let styles = generateCSS();

    console.log('TemplateEditor: Template fields:', templateFields);
    console.log('TemplateEditor: Base HTML:', html);

    // Replace placeholders with field values
    templateFields.forEach(field => {
      const placeholder = `{{${field.id}}}`;
      console.log(`TemplateEditor: Replacing ${placeholder} with:`, field.value);
      html = html.replace(new RegExp(placeholder, 'g'), field.value);
    });

    const finalHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            ${styles}
            /* Image error handling */
            img {
              max-width: 100%;
              height: auto;
            }
            img[src=""], img:not([src]) {
              display: none;
            }
          </style>
          <script>
            // Handle image loading errors
            document.addEventListener('DOMContentLoaded', function() {
              console.log('Iframe DOM loaded, checking images...');
              const images = document.querySelectorAll('img');
              console.log('Found', images.length, 'images');
              
              images.forEach((img, index) => {
                console.log('Image', index, '- src:', img.src, 'alt:', img.alt);
                
                img.onload = function() {
                  console.log('Image loaded successfully:', this.src);
                };
                
                img.onerror = function() {
                  console.log('Image failed to load:', this.src);
                  // Try to extract field name from alt text or class
                  const altText = this.alt || 'Image';
                  const fallbackUrl = 'https://placehold.co/400x300/E5E7EB/9CA3AF/png?text=' + encodeURIComponent(altText) + '&font=roboto';
                  if (this.src !== fallbackUrl) {
                    console.log('Switching to fallback:', fallbackUrl);
                    this.src = fallbackUrl;
                  }
                };
                
                // Force reload if src is empty
                                 if (!img.src || img.src === '' || img.src === window.location.href) {
                   const altText = img.alt || 'Image';
                   const fallbackUrl = 'https://placehold.co/400x300/E5E7EB/9CA3AF/png?text=' + encodeURIComponent(altText) + '&font=roboto';
                   console.log('Empty src detected, using fallback:', fallbackUrl);
                   img.src = fallbackUrl;
                 }
              });
            });
          </script>
        </head>
        <body>
          ${html}
        </body>
      </html>
    `;

    console.log('TemplateEditor: Final HTML:', finalHTML);
    return finalHTML;
  }, [template, templateFields, brandApplied]);

  // Update field value
  const updateField = (fieldId: string, value: string) => {
    setTemplateFields(prev => 
      prev.map(field => 
        field.id === fieldId ? { ...field, value } : field
      )
    );
  };

  // Apply brand theme
  const applyBrandTheme = () => {
    setBrandApplied(!brandApplied);
    
    // Update brand-related fields
    setTemplateFields(prev => 
      prev.map(field => {
        if (field.id === 'logoUrl') {
          return { ...field, value: brandAssets?.logo || field.value };
        }
        if (field.id === 'brandName') {
          return { ...field, value: 'Your Brand' };
        }
        return field;
      })
    );
  };

  // TODO: Save template customization to user's projects
  const handleSave = () => {
    console.log('Saving template customization...', {
      templateId: template?.id,
      fields: templateFields,
      brandApplied
    });
    // TODO: Implement save to Directus/Supabase
  };

  // Export template as image using Satori
  const handleExport = async () => {
    if (!template) return;
    
    setIsExporting(true);
    try {
      // Simple HTML download for now
      const htmlContent = previewHTML;
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${template.name}-template.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export template. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading template...</p>
        </div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Template not found</h2>
          <p className="text-gray-600 mb-4">Template ID: {id}</p>
          <p className="text-gray-600 mb-4">Available templates: {JSON.stringify(templatesData.map(t => t.id))}</p>
          <button
            onClick={() => navigate('/templates')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
          >
            Back to Templates
          </button>
        </div>
      </div>
    );
  }

  // Debug info
  const debugInfo = {
    templateId: id,
    templateFound: !!template,
    templateFieldsCount: templateFields.length,
    previewHTMLLength: previewHTML.length,
    brandApplied
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: colors.background }}>
      {/* Debug Panel - Remove this in production */}
      <div className="bg-yellow-100 border-b border-yellow-200 px-4 py-2 text-sm">
        <details>
          <summary className="cursor-pointer font-medium">Debug Info (Click to expand)</summary>
          <pre className="mt-2 text-xs">{JSON.stringify(debugInfo, null, 2)}</pre>
        </details>
      </div>

      {/* Platform Selector Header */}
      {!showDimensionsPanel && (
        <button
          onClick={() => setShowDimensionsPanel(true)}
          className="fixed top-20 left-1/2 transform -translate-x-1/2 z-30 px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 backdrop-blur-md shadow-lg hover:opacity-80"
          style={{ 
            backgroundColor: `${colors.background}E6`,
            color: colors.text
          }}
          title="Open Platform Menu"
        >
          <Menu className="w-4 h-4" />
          <span className="text-sm font-medium">Platform & Dimensions</span>
        </button>
      )}

      {/* Floating Platform Controls Panel */}
      {showDimensionsPanel && (
        <div 
          className="fixed top-20 left-1/2 transform -translate-x-1/2 z-20 rounded-xl border shadow-xl backdrop-blur-md animate-in fade-in duration-200" 
          style={{ 
            backgroundColor: `${colors.background}CC`,
            borderColor: colors.border
          }}
        >
          <div className="p-4">
            <div className="flex flex-col space-y-3">
              {/* Panel Header with Minimize Button */}
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium flex items-center space-x-2" style={{ color: colors.text }}>
                  <Menu className="w-4 h-4" />
                  <span>Platform & Canvas Dimensions</span>
                </h3>
                <button
                  onClick={() => setShowDimensionsPanel(false)}
                  className="p-1.5 rounded-lg transition-colors"
                  style={{ 
                    backgroundColor: colors.backgroundTertiary,
                    color: colors.textSecondary
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colors.border;
                    e.currentTarget.style.color = colors.text;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = colors.backgroundTertiary;
                    e.currentTarget.style.color = colors.textSecondary;
                  }}
                  title="Minimize Panel"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Platform Selector */}
              <div className="flex justify-center items-center">
                <div className="flex flex-wrap justify-center gap-2 max-w-2xl">
                  {Object.entries(PlatformSpecs).map(([key, platform]) => (
                    <button
                      key={key}
                      onClick={() => handlePlatformChange(key)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                        selectedPlatform === key ? 'shadow-lg' : ''
                      }`}
                      style={{
                        backgroundColor: selectedPlatform === key ? colors.accent : colors.backgroundTertiary,
                        color: selectedPlatform === key ? '#ffffff' : colors.text
                      }}
                    >
                      {platform.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Format Buttons */}
              <div className="flex justify-center items-center">
                <div className="flex flex-wrap justify-center gap-2 max-w-2xl">
                  {PlatformSpecs[selectedPlatform as keyof typeof PlatformSpecs]?.formats.map((format) => (
                    <button
                      key={format.name}
                      onClick={() => handleFormatChange(format)}
                      className={`px-2 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                        currentFormat.name === format.name ? 'shadow-lg' : ''
                      }`}
                      style={{
                        backgroundColor: currentFormat.name === format.name ? colors.primary : colors.backgroundTertiary,
                        color: currentFormat.name === format.name ? '#ffffff' : colors.text
                      }}
                    >
                      {format.name}
                      <span className="ml-1 text-xs opacity-75 hidden lg:inline">
                        {format.width}×{format.height}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Controls */}
              <div className="flex items-center justify-between">
                <div className="text-xs" style={{ color: colors.textMuted }}>
                  {currentFormat.name}
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="text-xs font-medium" style={{ color: colors.accent }}>
                    {currentFormat.width}×{currentFormat.height}px
                  </div>
                  <div className="text-xs" style={{ color: colors.textSecondary }}>
                    Zoom: <span className="font-mono" style={{ color: colors.text }}>{Math.round(previewScale * 100)}%</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={zoomOut}
                    className="p-1.5 rounded-lg transition-colors"
                    style={{ backgroundColor: colors.backgroundTertiary }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.border}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.backgroundTertiary}
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-4 h-4" style={{ color: colors.text }} />
                  </button>
                  <button
                    onClick={zoomIn}
                    className="p-1.5 rounded-lg transition-colors"
                    style={{ backgroundColor: colors.backgroundTertiary }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.border}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.backgroundTertiary}
                    title="Zoom In"
                  >
                    <ZoomIn className="w-4 h-4" style={{ color: colors.text }} />
                  </button>
                  <button
                    onClick={resetZoom}
                    className="p-1.5 rounded-lg transition-colors"
                    style={{ backgroundColor: colors.backgroundTertiary }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.border}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.backgroundTertiary}
                    title="Reset Zoom"
                  >
                    <RotateCcw className="w-4 h-4" style={{ color: colors.text }} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ backgroundColor: colors.backgroundSecondary, borderColor: colors.border }} className="border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/templates')}
                className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{template.name}</h1>
                <p className="text-sm text-gray-500">Customize and preview your template</p>
              </div>
              

            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={applyBrandTheme}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  brandApplied 
                    ? 'bg-green-100 text-green-700 border border-green-200' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>{brandApplied ? 'Brand Applied' : 'Apply Brand Theme'}</span>
              </button>
              
              <button
                onClick={handleSave}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                <Save className="w-4 h-4" />
                <span>Save</span>
              </button>
              
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4" />
                <span>{isExporting ? 'Exporting...' : 'Export'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Side Panel - Editable Fields */}
            <div className="w-80 border-r overflow-y-auto" style={{ backgroundColor: colors.backgroundSecondary, borderColor: colors.border }}>
          <div className="p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Settings className="w-5 h-5" style={{ color: colors.primary }} />
              <h2 className="text-lg font-semibold" style={{ color: colors.text }}>Customize</h2>
            </div>

            {/* Template Info */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">{template.name}</h3>
              <p className="text-sm text-gray-600 mb-3">{template.description}</p>
              <div className="flex items-center space-x-2">
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                  {template.category}
                </span>
              </div>
            </div>

            {/* Editable Fields */}
            <div className="space-y-6">
              {templateFields.map((field) => (
                <div key={field.id}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {field.label}
                  </label>
                  
                  {field.type === 'textarea' ? (
                    <textarea
                      value={field.value}
                      onChange={(e) => updateField(field.id, e.target.value)}
                      placeholder={field.placeholder}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none"
                    />
                  ) : field.type === 'color' ? (
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        value={field.value}
                        onChange={(e) => updateField(field.id, e.target.value)}
                        className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                      />
                      <input
                        type="text"
                        value={field.value}
                        onChange={(e) => updateField(field.id, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                    </div>
                  ) : field.type === 'image' ? (
                    <div className="space-y-2">
                      <div className="flex space-x-2">
                        <input
                          type="url"
                          value={field.value}
                          onChange={(e) => updateField(field.id, e.target.value)}
                          placeholder={field.placeholder}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                        <button
                          onClick={() => updateField(field.id, getPlaceholderImage(field.id, template!))}
                          className="px-3 py-2 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                          title="Use placeholder image"
                        >
                          📷
                        </button>
                      </div>
                      {field.value && (
                        <div className="relative">
                          <img
                            src={field.value}
                            alt="Preview"
                            className="w-full h-20 object-cover rounded border"
                            onError={(e) => {
                              // Fallback to a placeholder if the image fails to load
                              const fallbackUrl = `https://placehold.co/400x200/E5E7EB/9CA3AF/png?text=${encodeURIComponent(field.label)}&font=roboto`;
                              if (e.currentTarget.src !== fallbackUrl) {
                                e.currentTarget.src = fallbackUrl;
                              }
                            }}
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={field.value}
                      onChange={(e) => updateField(field.id, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  )}
                </div>
              ))}
            </div>

            {/* TODO: Add more customization options */}
            {/* TODO: Add undo/redo functionality */}
          </div>
        </div>

        {/* Preview Panel */}
        <div className="flex-1 flex flex-col" style={{ backgroundColor: colors.background }}>
                      <div className="border-b px-6 py-3" style={{ backgroundColor: colors.backgroundSecondary, borderColor: colors.border }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Eye className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Live Preview</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => {
                    console.log('Current preview HTML:', previewHTML);
                    console.log('Template fields:', templateFields);
                  }}
                  className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded"
                  title="Debug HTML"
                >
                  🐛 Debug
                </button>
                <span className="text-sm text-gray-500">Scale:</span>
                <select
                  value={previewScale}
                  onChange={(e) => setPreviewScale(parseFloat(e.target.value))}
                  className="text-sm border border-gray-300 rounded px-2 py-1"
                >
                  <option value={0.5}>50%</option>
                  <option value={0.75}>75%</option>
                  <option value={0.8}>80%</option>
                  <option value={1}>100%</option>
                  <option value={1.25}>125%</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
            <div 
              className="bg-white shadow-lg rounded-lg overflow-hidden"
              style={{ transform: `scale(${previewScale})` }}
            >
              {previewHTML ? (
                <iframe
                  srcDoc={previewHTML}
                  className="border-0"
                  style={{ 
                    width: `${currentFormat.width}px`, 
                    height: `${currentFormat.height}px`,
                    transform: `scale(${previewScale})`,
                    transformOrigin: 'center'
                  }}
                  title="Template Preview"
                  sandbox="allow-scripts allow-same-origin"
                  onLoad={() => console.log('TemplateEditor: Iframe loaded successfully')}
                  onError={(e) => console.error('TemplateEditor: Iframe error:', e)}
                />
              ) : (
                <div 
                  className="flex items-center justify-center"
                  style={{ 
                    width: `${currentFormat.width}px`, 
                    height: `${currentFormat.height}px`,
                    backgroundColor: colors.backgroundTertiary,
                    transform: `scale(${previewScale})`,
                    transformOrigin: 'center'
                  }}
                >
                  <div className="text-center">
                    <div className="mb-2" style={{ color: colors.textMuted }}>⚠️</div>
                    <p style={{ color: colors.textSecondary }}>Preview not available</p>
                    <p className="text-sm" style={{ color: colors.textMuted }}>Check console for errors</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 