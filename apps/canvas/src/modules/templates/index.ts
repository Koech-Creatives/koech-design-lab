// Templates Module Exports
export { TemplatesPage } from './TemplatesPage';
export { TemplateEditor } from './TemplateEditor';
export { TemplateCard } from './TemplateCard';
export { TemplateRoutes, TEMPLATE_ROUTES, templateNavigation } from './templateRoutes';

// Data and Types
export { 
  templatesData, 
  getTemplateById, 
  getTemplatesByCategory, 
  getRecommendedTemplates,
  type Template 
} from './templatesData';

// TODO: Export additional utilities as they're created
// export { TemplateCreator } from './TemplateCreator';
// export { TemplateExporter } from './TemplateExporter';
// export { TemplateImporter } from './TemplateImporter'; 