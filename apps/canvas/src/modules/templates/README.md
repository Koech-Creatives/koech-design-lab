# Templates Module

A comprehensive template system for creating and customizing HTML-based design templates with brand integration.

## 📁 Structure

```
src/modules/templates/
├── index.ts                 # Module exports
├── templatesData.ts         # Template data and utilities
├── TemplatesPage.tsx        # Main templates gallery
├── TemplateCard.tsx         # Individual template card component
├── TemplateEditor.tsx       # Template customization editor
├── templateRoutes.tsx       # Routing configuration
├── templates.css           # Additional styles
└── README.md               # This file
```

## 🚀 Features

### Templates Gallery (`TemplatesPage.tsx`)
- **Template Browsing**: Grid/list view of all available templates
- **Search & Filter**: Search by name/description, filter by category
- **Recommendations**: Personalized template suggestions
- **Preview**: Quick preview of template designs
- **Responsive**: Mobile-friendly layout

### Template Editor (`TemplateEditor.tsx`)
- **Live Preview**: Real-time HTML rendering with iframe
- **Dynamic Fields**: Auto-generated form fields based on template placeholders
- **Brand Integration**: Apply user's brand colors, fonts, and logo
- **Scale Controls**: Zoom in/out on preview
- **Export Ready**: Prepared for HTML-to-image conversion

### Template Cards (`TemplateCard.tsx`)
- **Rich Previews**: Template thumbnails with hover effects
- **Metadata Display**: Category, platforms, color palette
- **Quick Actions**: Preview and edit buttons
- **Platform Indicators**: Visual indicators for supported platforms

## 📊 Template Data Structure

```typescript
interface Template {
  id: string;                    // Unique identifier
  name: string;                  // Display name
  previewImage: string;          // Thumbnail URL
  description: string;           // Template description
  baseHTML: string;              // HTML template with placeholders
  defaultStyles: {
    font: string;                // Default font family
    colors: {
      primary: string;           // Primary color
      background: string;        // Background color
      text: string;              // Text color
      accent: string;            // Accent color
    };
    logoUrl: string;             // Default logo URL
  };
  category: string;              // Template category
  platforms: string[];          // Supported platforms
}
```

## 🎨 Template Placeholders

Templates use `{{placeholder}}` syntax for dynamic content:

- `{{brandName}}` - User's brand name
- `{{logoUrl}}` - Brand logo URL
- `{{primaryColor}}` - Brand primary color
- `{{quoteText}}` - Quote content
- `{{authorName}}` - Author name
- `{{productTitle}}` - Product name
- `{{ctaText}}` - Call-to-action text

## 🛠️ Usage

### Adding New Templates

1. Add template data to `templatesData.ts`:
```typescript
{
  id: 'my-template',
  name: 'My Template',
  previewImage: 'https://example.com/preview.jpg',
  description: 'Template description',
  baseHTML: `<div>{{placeholder}}</div>`,
  defaultStyles: { /* styles */ },
  category: 'Category',
  platforms: ['Instagram', 'LinkedIn']
}
```

2. Add corresponding CSS in `TemplateEditor.tsx` `generateCSS()` method

### Navigation

```typescript
import { TEMPLATE_ROUTES, templateNavigation } from './templateRoutes';

// Navigate to templates gallery
navigate(TEMPLATE_ROUTES.TEMPLATES);

// Navigate to specific template editor
navigate(TEMPLATE_ROUTES.TEMPLATE_EDITOR('template-id'));
```

## 🔧 Integration Points

### Brand Context
Templates automatically integrate with the app's `BrandContext`:
- Colors from `brand.primaryColor`, `brand.secondaryColor`
- Fonts from `brand.fontHeading`, `brand.fontBody`
- Logo from `brand.logoUrl`
- Brand name from `brand.name`

### Project Context
Templates can be saved as projects using `ProjectContext`:
- Save customized templates
- Load previous customizations
- Export functionality

## 📱 Responsive Design

- **Desktop**: Full-featured editor with side panel
- **Tablet**: Responsive layout with collapsible panels
- **Mobile**: Stacked layout with optimized controls

## 🎯 TODO Items

### High Priority
- [ ] Connect to Directus/Supabase for template storage
- [ ] Implement HTML-to-image export functionality
- [ ] Add template save/load functionality
- [ ] Add user authentication guards

### Medium Priority
- [ ] Add template creation interface
- [ ] Implement template sharing
- [ ] Add more template categories
- [ ] Add template versioning

### Low Priority
- [ ] Add template analytics
- [ ] Implement template marketplace
- [ ] Add collaborative editing
- [ ] Add template AI suggestions

## 🔗 Dependencies

- React Router for navigation
- Lucide React for icons
- Tailwind CSS for styling
- Brand Context for brand integration
- Project Context for saving (planned)

## 🚀 Future Enhancements

1. **Template Marketplace**: User-generated templates
2. **AI Integration**: AI-powered template suggestions
3. **Collaboration**: Multi-user template editing
4. **Analytics**: Template usage tracking
5. **API Integration**: External template sources 