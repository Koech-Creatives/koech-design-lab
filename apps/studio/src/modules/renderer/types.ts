export type Platform = 'instagram' | 'linkedin' | 'twitter' | 'tiktok';

export interface PlatformDimensions {
  name: string;
  width: number;
  height: number;
  aspectRatio: string;
}

export const PLATFORM_DIMENSIONS: Record<Platform, PlatformDimensions> = {
  instagram: {
    name: 'Instagram Post',
    width: 1080,
    height: 1350,
    aspectRatio: '4:5'
  },
  linkedin: {
    name: 'LinkedIn Post',
    width: 1200,
    height: 627,
    aspectRatio: '1.91:1'
  },
  twitter: {
    name: 'Twitter Post',
    width: 1600,
    height: 900,
    aspectRatio: '16:9'
  },
  tiktok: {
    name: 'TikTok Video',
    width: 1080,
    height: 1920,
    aspectRatio: '9:16'
  }
};

export interface Brand {
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
}

export interface TemplateField {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'image' | 'color';
  required?: boolean;
  placeholder?: string;
  maxLength?: number;
}

export interface Template {
  id: string;
  name: string;
  description?: string;
  preview: string;
  category: string;
  componentName: string;
  editableFields: TemplateField[];
  supportedPlatforms: Platform[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TemplateContent {
  [key: string]: string | number | boolean;
}

export interface RenderRequest {
  templateId: string;
  brand: Brand;
  content: TemplateContent;
  platform: Platform;
}

export interface RenderResponse {
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

export interface RendererContextType {
  // Current state
  platform: Platform;
  brand: Brand | null;
  currentTemplate: Template | null;
  content: TemplateContent;
  
  // Actions
  setPlatform: (platform: Platform) => void;
  setBrand: (brand: Brand) => void;
  setTemplate: (template: Template) => void;
  updateField: (key: string, value: string | number | boolean) => void;
  resetContent: () => void;
  
  // Rendering
  renderImage: () => Promise<RenderResponse>;
  isRendering: boolean;
} 