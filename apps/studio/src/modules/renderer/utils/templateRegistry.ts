import React from 'react';
import { Template, Platform } from '../types';
import { MinimalPost } from '../templates/MinimalPost';

// Template component map
export const TEMPLATE_COMPONENTS = {
  'minimal-post': MinimalPost,
} as const;

// Template definitions
export const AVAILABLE_TEMPLATES: Template[] = [
  {
    id: 'minimal-post',
    name: 'Minimal Post',
    description: 'Clean and minimal design perfect for announcements and quotes',
    preview: '/templates/minimal-post-preview.jpg',
    category: 'Social Media',
    componentName: 'minimal-post',
    editableFields: [
      {
        key: 'title',
        label: 'Main Title',
        type: 'text',
        required: true,
        placeholder: 'Your main message here...',
        maxLength: 60,
      },
      {
        key: 'subtitle',
        label: 'Subtitle',
        type: 'text',
        placeholder: 'Supporting text (optional)',
        maxLength: 100,
      },
    ],
    supportedPlatforms: ['instagram', 'linkedin', 'twitter', 'tiktok'] as Platform[],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

export function getTemplateComponent(componentName: string) {
  return TEMPLATE_COMPONENTS[componentName as keyof typeof TEMPLATE_COMPONENTS];
}

export function getTemplateById(id: string): Template | undefined {
  return AVAILABLE_TEMPLATES.find(template => template.id === id);
}

export function getTemplatesByCategory(category: string): Template[] {
  return AVAILABLE_TEMPLATES.filter(template => template.category === category);
}

export function getTemplatesByPlatform(platform: Platform): Template[] {
  return AVAILABLE_TEMPLATES.filter(template => 
    template.supportedPlatforms.includes(platform)
  );
} 