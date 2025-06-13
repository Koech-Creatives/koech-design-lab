import React, { useState, useEffect, useMemo } from 'react';
import Editor from '@monaco-editor/react';
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';
import { 
  Code, 
  Eye, 
  Download, 
  RefreshCw, 
  Settings,
  Palette,
  Type,
  Image as ImageIcon
} from 'lucide-react';
import { useBrand } from '../../../contexts/BrandContext';
import { reactTemplates, getReactTemplateById } from '../reactTemplates';

interface ReactComponentEditorProps {
  template: any;
  onCodeChange: (code: string) => void;
  onExport: (html: string) => void;
}

// Default React template for new components
const DEFAULT_TEMPLATE = `function Template({ title = "Hello World", subtitle = "Welcome to KoLab", primaryColor = "#3B82F6", backgroundColor = "#FFFFFF" }) {
  return (
    <div style={{
      width: '600px',
      height: '400px',
      backgroundColor: backgroundColor,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'Inter, sans-serif',
      padding: '40px',
      boxSizing: 'border-box'
    }}>
      <h1 style={{
        fontSize: '32px',
        fontWeight: 'bold',
        color: primaryColor,
        margin: '0 0 16px 0',
        textAlign: 'center'
      }}>
        {title}
      </h1>
      <p style={{
        fontSize: '18px',
        color: '#6B7280',
        margin: 0,
        textAlign: 'center'
      }}>
        {subtitle}
      </p>
    </div>
  );
}`;

export function ReactComponentEditor({ template, onCodeChange, onExport }: ReactComponentEditorProps) {
  const { brand } = useBrand();
  const [code, setCode] = useState(() => {
    if (template?.reactCode) return template.reactCode;
    if (template?.id) {
      const reactTemplate = getReactTemplateById(template.id + '-react');
      if (reactTemplate) return reactTemplate.code;
    }
    return DEFAULT_TEMPLATE;
  });
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [props, setProps] = useState({
    title: 'Hello World',
    subtitle: 'Welcome to KoLab',
    primaryColor: brand.primaryColor || '#3B82F6',
    backgroundColor: '#FFFFFF',
    logoUrl: brand.logoUrl || '',
    brandName: brand.name || 'Your Brand'
  });
  const [error, setError] = useState<string | null>(null);

  // Update code when template changes
  useEffect(() => {
    if (template?.reactCode) {
      setCode(template.reactCode);
    }
  }, [template]);

  // Notify parent of code changes
  useEffect(() => {
    onCodeChange(code);
  }, [code, onCodeChange]);

  // Apply brand theme to props
  const applyBrandTheme = () => {
    setProps(prev => ({
      ...prev,
      primaryColor: brand.primaryColor || prev.primaryColor,
      brandName: brand.name || prev.brandName,
      logoUrl: brand.logoUrl || prev.logoUrl
    }));
  };

  // Reset to default template
  const resetTemplate = () => {
    setCode(DEFAULT_TEMPLATE);
    setError(null);
  };

  // Handle prop changes
  const updateProp = (key: string, value: string) => {
    setProps(prev => ({ ...prev, [key]: value }));
  };

  // Generate HTML for export
  const generateHTML = () => {
    try {
      // This would need server-side rendering for actual export
      // For now, we'll create a basic HTML structure
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>KoLab Template</title>
            <style>
              body { margin: 0; padding: 0; font-family: Inter, sans-serif; }
            </style>
          </head>
          <body>
            <div id="root"></div>
            <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
            <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
            <script>
              ${code}
              
              const props = ${JSON.stringify(props)};
              const element = React.createElement(Template, props);
              ReactDOM.render(element, document.getElementById('root'));
            </script>
          </body>
        </html>
      `;
      return html;
    } catch (err) {
      console.error('Error generating HTML:', err);
      return '';
    }
  };

  const handleExport = () => {
    const html = generateHTML();
    onExport(html);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Code className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">React Component Editor</h2>
          </div>
          
          {/* Tab Switcher */}
          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('editor')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'editor'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Code className="w-4 h-4 inline mr-1" />
              Editor
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'preview'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Eye className="w-4 h-4 inline mr-1" />
              Preview
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={applyBrandTheme}
            className="flex items-center space-x-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
          >
            <Palette className="w-4 h-4" />
            <span>Apply Brand</span>
          </button>
          
          <select
            onChange={(e) => {
              const selectedTemplate = getReactTemplateById(e.target.value);
              if (selectedTemplate) {
                setCode(selectedTemplate.code);
                setProps({ ...props, ...selectedTemplate.defaultProps });
              }
            }}
            className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
          >
            <option value="">Choose Template...</option>
            {reactTemplates.map(template => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </select>
          
          <button
            onClick={resetTemplate}
            className="flex items-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset</span>
          </button>
          
          <button
            onClick={handleExport}
            className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Props Panel */}
        <div className="w-80 bg-gray-50 border-r border-gray-200 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center space-x-2 mb-4">
              <Settings className="w-5 h-5 text-gray-600" />
              <h3 className="text-sm font-semibold text-gray-900">Component Props</h3>
            </div>

            <div className="space-y-4">
              {Object.entries(props).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </label>
                  
                  {key.includes('Color') ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={value}
                        onChange={(e) => updateProp(key, e.target.value)}
                        className="w-10 h-8 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => updateProp(key, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                    </div>
                  ) : key.includes('Url') ? (
                    <div className="space-y-2">
                      <input
                        type="url"
                        value={value}
                        onChange={(e) => updateProp(key, e.target.value)}
                        placeholder="Enter image URL..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                      {value && (
                        <img
                          src={value}
                          alt="Preview"
                          className="w-full h-20 object-cover rounded border"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      )}
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => updateProp(key, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Brand Integration */}
            <div className="mt-6 p-3 bg-blue-50 rounded-lg">
              <h4 className="text-sm font-semibold text-blue-900 mb-2">Brand Integration</h4>
              <div className="space-y-1 text-xs text-blue-700">
                <div className="flex justify-between">
                  <span>Primary Color:</span>
                  <span>{brand.primaryColor || 'Not set'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Brand Name:</span>
                  <span>{brand.name || 'Not set'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Logo:</span>
                  <span>{brand.logoUrl ? 'Available' : 'Not set'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {activeTab === 'editor' ? (
            <div className="flex-1">
              <Editor
                height="100%"
                defaultLanguage="javascript"
                value={code}
                onChange={(value) => setCode(value || '')}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  roundedSelection: false,
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 2,
                  wordWrap: 'on'
                }}
              />
            </div>
          ) : (
            <div className="flex-1 bg-gray-100 flex items-center justify-center p-8">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <LiveProvider code={code} scope={{ React }}>
                  <div className="p-4">
                    <LivePreview 
                      Component={(props: any) => {
                        try {
                          // Create the component with current props
                          const ComponentCode = code;
                          const func = new Function('React', `${ComponentCode}; return Template;`);
                          const Component = func(React);
                          return React.createElement(Component, props);
                        } catch (err) {
                          setError(err instanceof Error ? err.message : 'Unknown error');
                          return React.createElement('div', {
                            style: { color: 'red', padding: '20px' }
                          }, 'Error rendering component');
                        }
                      }}
                      {...props}
                    />
                    <LiveError />
                  </div>
                </LiveProvider>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border-t border-red-200 p-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-sm font-medium text-red-800">Error:</span>
              </div>
              <p className="text-sm text-red-700 mt-1 font-mono">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 