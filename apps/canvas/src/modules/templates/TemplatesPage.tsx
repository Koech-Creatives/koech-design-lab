import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { templatesData, getTemplatesByCategory, getRecommendedTemplates } from './templatesData';
import { TemplateCard } from './TemplateCard';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  ArrowLeft,
  Sparkles,
  Palette,
  LayoutTemplate
} from 'lucide-react';

export function TemplatesPage() {
  const navigate = useNavigate();
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Debug: Log templates data
  console.log('TemplatesPage: Available templates:', templatesData);

  // Get unique categories from templates
  const categories = useMemo(() => {
    const cats = ['All', ...new Set(templatesData.map(template => template.category))];
    return cats;
  }, []);

  // Filter templates based on search and category
  const filteredTemplates = useMemo(() => {
    let filtered = templatesData;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = getTemplatesByCategory(selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(template =>
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [searchQuery, selectedCategory]);

  // TODO: Get user-specific recommendations from API
  const recommendedTemplates = getRecommendedTemplates();

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <div style={{ backgroundColor: colors.backgroundSecondary, borderColor: colors.border }} className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="p-2 rounded-lg transition-colors"
                style={{ 
                  color: colors.textSecondary,
                  backgroundColor: 'transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = colors.text;
                  e.currentTarget.style.backgroundColor = colors.backgroundTertiary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = colors.textSecondary;
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-3">
                <LayoutTemplate className="w-8 h-8" style={{ color: colors.primary }} />
                <div>
                  <h1 className="text-xl font-semibold" style={{ color: colors.text }}>Templates</h1>
                  <p className="text-sm" style={{ color: colors.textSecondary }}>Choose a template to customize</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm" style={{ color: colors.textSecondary }}>
                {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div style={{ backgroundColor: colors.backgroundSecondary, borderColor: colors.border }} className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: colors.textMuted }} />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 text-sm"
                style={{
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                  color: colors.text
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = colors.primary;
                  e.currentTarget.style.boxShadow = `0 0 0 2px ${colors.primary}20`;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = colors.border;
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>

            <div className="flex items-center space-x-4">
              {/* Category Filter */}
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${
                    viewMode === 'grid' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${
                    viewMode === 'list' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Recommended Templates Section */}
        {searchQuery === '' && selectedCategory === 'All' && (
          <div className="mb-12">
            <div className="flex items-center space-x-2 mb-6">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              <h2 className="text-lg font-semibold text-gray-900">Recommended for You</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedTemplates.map((template) => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>
          </div>
        )}

        {/* All Templates Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              {selectedCategory === 'All' ? 'All Templates' : `${selectedCategory} Templates`}
            </h2>
            <div className="flex items-center space-x-2">
              <Palette className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-500">
                {filteredTemplates.length} result{filteredTemplates.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {/* Templates Grid/List */}
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
              <p className="text-gray-500 mb-4">
                Try adjusting your search query or category filter
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
            }`}>
              {filteredTemplates.map((template) => (
                <TemplateCard 
                  key={template.id} 
                  template={template}
                  className={viewMode === 'list' ? 'max-w-none' : ''}
                />
              ))}
            </div>
          )}
        </div>

        {/* TODO: Add pagination for large template collections */}
        {/* TODO: Add template creation/upload functionality for premium users */}
      </div>
    </div>
  );
} 