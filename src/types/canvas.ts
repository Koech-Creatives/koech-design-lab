export type ElementRole = 
  | 'heading' 
  | 'subheading' 
  | 'body' 
  | 'caption'
  | 'image' 
  | 'logo' 
  | 'cta' 
  | 'background' 
  | 'decoration'
  | 'divider';

export type ResponsiveMode = 
  | 'fixed'      // Absolute positioning, no scaling
  | 'fluid'      // Scales with container
  | 'relative'   // Percentage-based positioning
  | 'adaptive';  // Smart reflow based on role

export type AnchorPoint = 
  | 'top-left' 
  | 'top-center' 
  | 'top-right'
  | 'center-left' 
  | 'center' 
  | 'center-right'
  | 'bottom-left' 
  | 'bottom-center' 
  | 'bottom-right';

export interface ResponsiveProperties {
  mode: ResponsiveMode;
  anchor: AnchorPoint;
  
  // Percentage-based positioning (0-100)
  xPercent?: number;
  yPercent?: number;
  widthPercent?: number;
  heightPercent?: number;
  
  // Constraints
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  
  // Margin/padding (percentage or fixed)
  margin?: {
    top: number | string;
    right: number | string;
    bottom: number | string;
    left: number | string;
  };
}

export interface LayoutContext {
  containerWidth: number;
  containerHeight: number;
  aspectRatio: number;
  orientation: 'landscape' | 'portrait' | 'square';
  platform: string;
  formatName: string;
}

export interface CanvasElement {
  // Core Properties (existing)
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  content?: string;
  style?: any;
  visible?: boolean;
  locked?: boolean;
  zIndex?: number;
  
  // Visual Properties (existing)
  fontSize?: number;
  fontWeight?: string;
  fontFamily?: string;
  fontStyle?: string;
  textAlign?: string;
  textTransform?: string;
  textDecoration?: string;
  textStyle?: string;
  customStyle?: any;
  autoWrap?: boolean;
  color?: string;
  backgroundColor?: string;
  borderRadius?: number;
  borderColor?: string;
  src?: string;
  alt?: string;
  ctaType?: string;
  path?: string;
  padding?: number;
  
  // Original Dimensions (existing - for backward compatibility)
  originalX?: number;
  originalY?: number;
  originalWidth?: number;
  originalHeight?: number;
  originalFontSize?: number;
  
  // NEW: Responsive & Layout Properties
  role: ElementRole;
  responsive: ResponsiveProperties;
  
  // NEW: Layout relationships
  groupId?: string;           // For grouping related elements
  layoutOrder?: number;       // Order within layout flow
  stackDirection?: 'horizontal' | 'vertical';
  
  // NEW: Format-specific overrides (stored separately but referenced here)
  hasOverrides?: boolean;
  overrideFormats?: string[]; // List of formats with custom overrides
}

export interface FormatOverride {
  elementId: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  fontSize?: number;
  visible?: boolean;
  responsive?: Partial<ResponsiveProperties>;
  [key: string]: any; // Allow any property override
}

export interface ProjectLayout {
  id: string;
  name: string;
  masterLayout: CanvasElement[];
  canvasBackground: string;
  overrides: {
    [formatKey: string]: {
      elementOverrides: { [elementId: string]: FormatOverride };
      canvasBackground?: string;
      layoutPreset?: string;
    };
  };
  createdAt: number;
  updatedAt: number;
}

export interface LayoutPreset {
  id: string;
  name: string;
  description: string;
  targetFormats: string[];
  aspectRatios: number[];
  
  // Role-based positioning rules
  rules: {
    [role in ElementRole]?: {
      preferredPosition: {
        x: number | string;  // Can be percentage or pixel
        y: number | string;
      };
      preferredSize: {
        width: number | string;
        height: number | string;
      };
      anchor: AnchorPoint;
      responsive: ResponsiveMode;
      constraints?: {
        minSize?: number;
        maxSize?: number;
        maintainAspectRatio?: boolean;
      };
    };
  };
  
  // Layout flow rules
  flow: {
    direction: 'vertical' | 'horizontal' | 'grid';
    spacing: number | string;
    alignment: 'start' | 'center' | 'end' | 'stretch';
    wrap?: boolean;
  };
} 