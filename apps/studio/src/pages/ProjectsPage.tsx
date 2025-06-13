import React from 'react';
import { Plus, Grid, List } from 'lucide-react';

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Projects</h2>
          <p className="text-gray-600">Manage and organize your design projects</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button className="p-2 text-gray-600 hover:bg-white rounded-md">
              <Grid className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-600 hover:bg-white rounded-md">
              <List className="w-4 h-4" />
            </button>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Plus className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No projects yet</h3>
          <p className="text-gray-600 mb-6">Create your first project to get started with design</p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 mx-auto hover:bg-blue-700 transition-colors">
            <Plus className="w-5 h-5" />
            <span>Create Your First Project</span>
          </button>
        </div>
      </div>
    </div>
  );
} 