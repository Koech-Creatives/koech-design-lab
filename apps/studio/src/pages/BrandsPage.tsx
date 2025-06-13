import React from 'react';
import { Palette, Plus } from 'lucide-react';

export default function BrandsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Brand Assets</h2>
          <p className="text-gray-600">Manage your brand colors, fonts, and assets</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" />
          <span>Add Brand</span>
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="text-center">
          <Palette className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No brand assets yet</h3>
          <p className="text-gray-600 mb-6">Add your brand colors, fonts, and assets to maintain consistency</p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 mx-auto hover:bg-blue-700 transition-colors">
            <Plus className="w-5 h-5" />
            <span>Add Your First Brand</span>
          </button>
        </div>
      </div>
    </div>
  );
} 