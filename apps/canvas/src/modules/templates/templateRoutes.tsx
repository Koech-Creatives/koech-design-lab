import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { TemplatesPage } from './TemplatesPage';
import { TemplateEditor } from './TemplateEditor';

/**
 * Template Routes Configuration
 * 
 * This component defines all routes for the templates module:
 * - /templates - Main templates gallery page
 * - /templates/:id - Individual template editor page
 * 
 * TODO: Add authentication guards for premium templates
 * TODO: Add route guards for user access levels
 */
export function TemplateRoutes() {
  return (
    <Routes>
      {/* Templates Gallery - Browse all available templates */}
      <Route path="/" element={<TemplatesPage />} />
      
      {/* Template Editor - Edit specific template by ID */}
      <Route path="/:id" element={<TemplateEditor />} />
      
      {/* TODO: Add additional routes */}
      {/* <Route path="/create" element={<TemplateCreator />} /> */}
      {/* <Route path="/my-templates" element={<UserTemplates />} /> */}
      {/* <Route path="/categories/:category" element={<CategoryTemplates />} /> */}
    </Routes>
  );
}

/**
 * Template Route Definitions
 * Export route paths as constants for consistent navigation
 */
export const TEMPLATE_ROUTES = {
  TEMPLATES: '/templates',
  TEMPLATE_EDITOR: (id: string) => `/templates/${id}`,
  // TODO: Add more route constants as needed
  // TEMPLATE_CREATE: '/templates/create',
  // USER_TEMPLATES: '/templates/my-templates',
  // CATEGORY_TEMPLATES: (category: string) => `/templates/categories/${category}`,
} as const;

/**
 * Navigation Helper Functions
 * TODO: Add navigation helpers for programmatic routing
 */
export const templateNavigation = {
  goToTemplates: () => TEMPLATE_ROUTES.TEMPLATES,
  goToEditor: (templateId: string) => TEMPLATE_ROUTES.TEMPLATE_EDITOR(templateId),
  // TODO: Add more navigation helpers
}; 