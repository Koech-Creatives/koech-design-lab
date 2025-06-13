import React from 'react';
import { 
  Sparkles,
  Download,
  Palette,
  Square,
  Paintbrush,
  Droplets,
  Type,
  List
} from 'lucide-react';

interface SidebarProps {
  selectedPlatform: string;
  selectedTemplate: any;
  onTemplateSelect: (template: any) => void;
  activeItem: string;
  onItemChange: (item: string) => void;
}

const sidebarItems = [
  { id: 'ai', name: 'AI', icon: Sparkles },
  { id: 'import', name: 'Import', icon: Download },
  { id: 'branding', name: 'Branding', icon: Palette },
  { id: 'canvas', name: 'Canvas', icon: Square },
  { id: 'design', name: 'Design', icon: Paintbrush },
  { id: 'colors', name: 'Colors', icon: Droplets },
  { id: 'text', name: 'Text', icon: Type },
  { id: 'order', name: 'Order', icon: List },
];

export function Sidebar({ selectedPlatform, selectedTemplate, onTemplateSelect, activeItem, onItemChange }: SidebarProps) {
  return (
    <div className="w-16 flex flex-col items-center py-4 space-y-2 bg-slate-800 border-r border-slate-700">
      {sidebarItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeItem === item.id;
        
        return (
          <button
            key={item.id}
            onClick={() => onItemChange(item.id)}
            className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-200 group relative ${
              isActive
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-slate-400 hover:bg-slate-700 hover:text-white'
            }`}
            title={item.name}
          >
            <Icon className="w-5 h-5" />
            
            {/* Tooltip */}
            <div className="absolute left-full ml-2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
              {item.name}
            </div>
          </button>
        );
      })}
    </div>
  );
}