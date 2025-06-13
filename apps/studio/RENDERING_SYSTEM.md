# 🎨 Rendering System Documentation

## Overview

The Studio app now includes a comprehensive SVG-to-Image rendering system that allows users to create professional social media content using React templates, brand assets, and dynamic content.

## Architecture

```
Studio App
├── Templates (React Components)
├── Brand Assets (Colors, Fonts, Logos)
├── Content Editor (Dynamic Fields)
├── Platform Previews (Instagram, LinkedIn, etc.)
└── Render API (Satori + Resvg)
```

## Key Features

### ✅ **Multi-Platform Support**
- **Instagram**: 1080×1350 (4:5 ratio)
- **LinkedIn**: 1200×627 (1.91:1 ratio)
- **Twitter**: 1600×900 (16:9 ratio)
- **TikTok**: 1080×1920 (9:16 ratio)

### ✅ **Template System**
- React-based templates with brand theming
- Dynamic content fields (text, images, colors)
- Responsive layouts for different platforms
- Template registry for easy management

### ✅ **Real-time Preview**
- Live preview with brand application
- Platform switching with dimension updates
- Instant field updates
- Scaled preview for optimal viewing

### ✅ **Brand Integration**
- Logo placement and sizing
- Color palette application
- Font family consistency
- Brand asset management

### ✅ **Export Pipeline**
- React → SVG (via Satori)
- SVG → PNG (via Resvg)
- High-resolution output
- Metadata tracking

## File Structure

```
apps/studio/src/modules/renderer/
├── types.ts                 # TypeScript interfaces
├── context/
│   └── RendererContext.tsx  # State management
├── components/
│   ├── ...                  # Renderer-specific components
├── templates/
│   └── MinimalPost.tsx      # Sample template
├── utils/
│   └── templateRegistry.ts  # Template management
└── pages/
    └── Playground.tsx       # Main editor interface

shared/ui/src/components/
├── PlatformSwitcher.tsx     # Platform selection
├── FieldInput.tsx           # Dynamic form inputs
└── SlidePreview.tsx         # Preview container

api/
├── render.ts                # Rendering service
└── package.json             # API dependencies
```

## Usage

### 1. Navigate to Templates
```
/templates
```

### 2. Open Playground
```
/templates/playground/{templateId}
```

### 3. Customize Content
- Select platform
- Edit text fields
- Adjust brand colors
- Upload brand assets

### 4. Generate Image
- Click "Generate Image"
- Download high-resolution PNG
- Use across platforms

## API Reference

### Render Endpoint

**POST** `/api/render`

```typescript
interface RenderRequest {
  templateId: string;
  brand: {
    id: string;
    name: string;
    logo?: string;
    colors: {
      primary: string;
      secondary: string;
      accent?: string;
      background?: string;
      text?: string;
    };
    fonts: {
      primary: string;
      secondary?: string;
    };
  };
  content: {
    [key: string]: string | number | boolean;
  };
  platform: 'instagram' | 'linkedin' | 'twitter' | 'tiktok';
}
```

**Response:**
```typescript
interface RenderResponse {
  success: boolean;
  imageUrl?: string;
  error?: string;
  metadata?: {
    width: number;
    height: number;
    fileSize: number;
    format: string;
  };
}
```

## Template Development

### Creating New Templates

1. **Create Template Component**
```tsx
// apps/studio/src/modules/renderer/templates/MyTemplate.tsx
import React from 'react';
import { Brand, TemplateContent, Platform } from '../types';

interface MyTemplateProps {
  brand: Brand;
  content: TemplateContent;
  platform: Platform;
  width: number;
  height: number;
}

export function MyTemplate({ brand, content, platform, width, height }: MyTemplateProps) {
  return (
    <div style={{ width, height, /* your styles */ }}>
      {/* Your template JSX */}
    </div>
  );
}
```

2. **Register Template**
```tsx
// apps/studio/src/modules/renderer/utils/templateRegistry.ts
export const TEMPLATE_COMPONENTS = {
  'my-template': MyTemplate,
  // ... other templates
};

export const AVAILABLE_TEMPLATES: Template[] = [
  {
    id: 'my-template',
    name: 'My Template',
    description: 'Description of your template',
    componentName: 'my-template',
    editableFields: [
      {
        key: 'title',
        label: 'Title',
        type: 'text',
        required: true,
      },
      // ... other fields
    ],
    supportedPlatforms: ['instagram', 'linkedin', 'twitter', 'tiktok'],
  },
  // ... other templates
];
```

### Template Guidelines

- **Responsive Design**: Use platform dimensions for optimal layout
- **Brand Integration**: Always apply brand colors and fonts
- **Performance**: Keep components lightweight for fast rendering
- **Accessibility**: Use semantic HTML and proper contrast ratios

## Deployment

### Development
```bash
# Start Studio app
npm run dev:studio

# Start render API (in separate terminal)
cd api && npm run dev
```

### Production
```bash
# Build all apps
npm run build

# Deploy Studio app to Vercel/Netlify
# Deploy API to serverless function or container
```

## Integration Options

### Supabase Storage
```typescript
// Upload to Supabase Storage
const { data, error } = await supabase.storage
  .from('rendered-images')
  .upload(`${templateId}/${Date.now()}.png`, pngBuffer);
```

### N8N Webhooks
```typescript
// Trigger automation workflows
await fetch(process.env.N8N_WEBHOOK_URL, {
  method: 'POST',
  body: JSON.stringify({
    imageUrl: result.imageUrl,
    platform,
    brand: brand.name,
  }),
});
```

### CMS Integration
```typescript
// Save to Directus CMS
await directus.items('generated_assets').createOne({
  template_id: templateId,
  platform,
  image_url: result.imageUrl,
  brand_id: brand.id,
});
```

## Future Enhancements

### 🔮 **Coming Soon**
- **AI Content Generation**: Auto-generate captions and text
- **Batch Rendering**: Generate multiple platforms at once
- **Template Marketplace**: Community-contributed templates
- **Advanced Animations**: Video and GIF export
- **Brand Guidelines**: Automated brand compliance checking

### 🎯 **Roadmap**
1. **Q1**: Video template support with motion graphics
2. **Q2**: AI-powered design suggestions
3. **Q3**: Collaborative editing and team features
4. **Q4**: Advanced analytics and performance tracking

## Troubleshooting

### Common Issues

**Fonts not loading:**
- Ensure font files are in `/fonts/` directory
- Check font file paths in API configuration

**CORS errors:**
- Verify API CORS headers are properly set
- Check frontend URL matches allowed origins

**Render timeout:**
- Reduce template complexity
- Optimize image assets
- Check server resources

**Memory issues:**
- Implement image optimization
- Add memory limits to rendering process
- Use streaming for large files

## Support

For technical questions or feature requests:
- 📧 Email: dev@koechdesignlab.com
- 🐛 Issues: GitHub repository
- 💬 Discord: Design Lab Community

---

**Built with ❤️ by the Koech Design Lab team** 