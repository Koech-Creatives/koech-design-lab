import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Grid, 
  List,
  Play,
  Palette,
  Code,
  Eye
} from 'lucide-react';
import { htmlTemplates, getTemplatesByPlatform } from '../../data/htmlTemplates';
import { useBrand } from '../../contexts/BrandContext';

const platforms = [
  { id: 'all', name: 'All Platforms', color: 'bg-gray-600' },
  { id: 'instagram', name: 'Instagram', color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
  { id: 'linkedin', name: 'LinkedIn', color: 'bg-blue-600' },
  { id: 'twitter', name: 'Twitter/X', color: 'bg-black' },
  { id: 'facebook', name: 'Facebook', color: 'bg-blue-700' },
];

const categories = [
  'All Categories',
  'Quote',
  'Product', 
  'Marketing',
  'Educational'
];

export function TemplateGallery() {
  const navigate = useNavigate();
  const { brand } = useBrand();
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter templates based on selected filters
  const filteredTemplates = useMemo(() => {
    let filtered = htmlTemplates;

    // Filter by platform
    if (selectedPlatform !== 'all') {
      filtered = getTemplatesByPlatform(selectedPlatform);
    }

    // Filter by category
    if (selectedCategory !== 'All Categories') {
      filtered = filtered.filter(template => template.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(template =>
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [selectedPlatform, selectedCategory, searchQuery]);

  const handleTemplateSelect = (templateId: string) => {
    navigate(`/playground/${templateId}`);
  };

  const generatePreviewHTML = (template: any) => {
    let html = template.html;
    let css = template.css;

    // Replace brand variables
    const brandVariables = {
      '{{logo}}': brand.logoUrl || '/logo.png',
      '{{primaryColor}}': brand.primaryColor || '#ff4940',
      '{{secondaryColor}}': brand.secondaryColor || '#003a63',
      '{{fontHeading}}': brand.fontHeading || 'Inter',
      '{{fontBody}}': brand.fontBody || 'Inter',
      '{{brandName}}': brand.name || 'Your Brand'
    };

    // Replace template field defaults
    template.fields.forEach((field: any) => {
      const placeholder = `{{${field.id}}}`;
      html = html.replace(new RegExp(placeholder, 'g'), field.defaultValue || '');
      css = css.replace(new RegExp(placeholder, 'g'), field.defaultValue || '');
    });

    // Replace brand variables
    Object.entries(brandVariables).forEach(([key, value]) => {
      html = html.replace(new RegExp(key.replace(/[{}]/g, '\\$&'), 'g'), value);
      css = css.replace(new RegExp(key.replace(/[{}]/g, '\\$&'), 'g'), value);
    });

    return { html, css };
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#1a1a1a' }}>
      {/* Header */}
      <div className="border-b" style={{ backgroundColor: '#002e51', borderColor: '#004080' }}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="p-2 rounded-lg text-white hover:opacity-80 transition-colors"
                style={{ backgroundColor: '#003a63' }}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-3">
                <Code className="w-8 h-8" style={{ color: '#ff4940' }} />
                <div>
                  <h1 className="text-xl font-bold text-white">HTML Templates</h1>
                  <p className="text-sm text-gray-400">Choose a template to customize</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-300">{filteredTemplates.length} templates</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="border-b" style={{ backgroundColor: '#002e51', borderColor: '#004080' }}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border text-sm"
                style={{ 
                  backgroundColor: '#003a63', 
                  borderColor: '#004080',
                  color: 'white'
                }}
              />
            </div>

            <div className="flex items-center space-x-4">
              {/* Platform Filter */}
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
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
                  {platforms.map(platform => (
                    <option key={platform.id} value={platform.id}>
                      {platform.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 rounded-lg border text-sm"
                style={{ 
                  backgroundColor: '#003a63', 
                  borderColor: '#004080',
                  color: 'white'
                }}
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              {/* View Mode Toggle */}
              <div className="flex items-center rounded-lg p-1" style={{ backgroundColor: '#003a63' }}>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-red-500 text-white' : 'text-gray-400'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-red-500 text-white' : 'text-gray-400'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" 
                   style={{ backgroundColor: '#003a63' }}>
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No templates found</h3>
              <p className="text-gray-400">Try adjusting your filters or search query</p>
            </div>
          ) : (
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {filteredTemplates.map((template) => {
                const { html, css } = generatePreviewHTML(template);
                
                return (
                  <div
                    key={template.id}
                    className="group cursor-pointer transition-all duration-300 transform hover:scale-105"
                    onClick={() => handleTemplateSelect(template.id)}
                  >
                    <div 
                      className="rounded-xl border-2 border-transparent hover:border-white/20 overflow-hidden transition-all duration-300"
                      style={{ backgroundColor: '#002e51' }}
                    >
                      {/* Preview */}
                      <div className="aspect-square bg-white relative overflow-hidden">
                        <div 
                          className="w-full h-full transform scale-50 origin-top-left"
                          style={{ width: '200%', height: '200%' }}
                          dangerouslySetInnerHTML={{
                            __html: `
                              <style>${css}</style>
                              ${html}
                            `
                          }}
                        />
                        
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="bg-white/90 backdrop-blur-sm rounded-full p-3">
                              <Play className="w-6 h-6 text-gray-800" />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-lg font-semibold text-white mb-1">
                              {template.name}
                            </h3>
                            <p className="text-sm text-gray-400">
                              {template.category}
                            </p>
                          </div>
                          <div className="flex items-center space-x-1">
                            {template.platforms.slice(0, 3).map((platform) => {
                              const platformInfo = platforms.find(p => p.id === platform);
                              return (
                                <div
                                  key={platform}
                                  className={`w-3 h-3 rounded-full ${platformInfo?.color || 'bg-gray-500'}`}
                                  title={platformInfo?.name}
                                />
                              );
                            })}
                            {template.platforms.length > 3 && (
                              <span className="text-xs text-gray-400">
                                +{template.platforms.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-300 mb-4 line-clamp-2">
                          {template.description}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Eye className="w-4 h-4 text-gray-400" />
                            <span className="text-xs text-gray-400">
                              {template.fields.length} customizable fields
                            </span>
                          </div>
                          
                          <button className="px-4 py-2 rounded-lg text-white font-medium transition-colors hover:opacity-80"
                                  style={{ backgroundColor: '#ff4940' }}>
                            Use Template
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 