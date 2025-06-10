import React from 'react';
import { Plus, X, Eye, EyeOff } from 'lucide-react';
import { usePages } from '../contexts/PagesContext';

interface PagesPanelProps {
  platform: string;
  currentFormat: any;
}

export function PagesPanel({ platform, currentFormat }: PagesPanelProps) {
  const { 
    pages, 
    currentPageId, 
    addPage, 
    removePage, 
    setCurrentPage, 
    canAddPages, 
    getMaxPages 
  } = usePages();

  const maxPages = getMaxPages(platform);
  const canAdd = canAddPages(platform, currentFormat);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-white">Pages</h3>
        <button
          onClick={addPage}
          disabled={!canAdd}
          className={`p-2 rounded-lg transition-colors flex items-center space-x-1 ${
            canAdd 
              ? 'text-white hover:opacity-80' 
              : 'text-gray-500 cursor-not-allowed'
          }`}
          style={canAdd ? { backgroundColor: '#ff4940' } : { backgroundColor: '#374151' }}
          title={canAdd ? 'Add new page' : 'Cannot add more pages for this format/platform'}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {!canAdd && pages.length === 1 && (
        <div className="p-3 rounded-lg" style={{ backgroundColor: '#374151' }}>
          <p className="text-xs text-gray-400">
            {platform === 'tiktok' 
              ? 'TikTok does not support carousels'
              : `Carousel not supported for ${currentFormat.name} format`
            }
          </p>
        </div>
      )}

      <div className="space-y-2">
        {pages.map((page, index) => (
          <div
            key={page.id}
            className={`p-3 rounded-lg transition-all duration-200 cursor-pointer ${
              currentPageId === page.id
                ? 'text-white'
                : 'text-gray-400 hover:text-white'
            }`}
            style={currentPageId === page.id ? { backgroundColor: '#ff4940' } : { backgroundColor: '#003a63' }}
            onClick={() => setCurrentPage(page.id)}
            onMouseEnter={(e) => {
              if (currentPageId !== page.id) {
                e.currentTarget.style.backgroundColor = '#004080';
              }
            }}
            onMouseLeave={(e) => {
              if (currentPageId !== page.id) {
                e.currentTarget.style.backgroundColor = '#003a63';
              }
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-6 border border-gray-500 rounded-sm flex items-center justify-center text-xs">
                    {index + 1}
                  </div>
                  <span className="text-sm font-medium">{page.name}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-1">
                <span className="text-xs opacity-75">
                  {page.elements?.length || 0} items
                </span>
                {pages.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removePage(page.id);
                    }}
                    className="p-1 hover:bg-red-600 rounded transition-colors"
                    title="Delete page"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {pages.length > 1 && (
        <div className="p-3 rounded-lg" style={{ backgroundColor: '#003a63' }}>
          <div className="text-xs text-gray-300">
            <span className="font-medium">Carousel:</span> {pages.length} of {maxPages} pages
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Click pages to switch, use + to add more
          </div>
        </div>
      )}
    </div>
  );
} 