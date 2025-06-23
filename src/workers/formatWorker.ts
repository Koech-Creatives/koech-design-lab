import { 
  CanvasElement, 
  LayoutContext,
  ElementRole,
  ResponsiveMode,
  AnchorPoint
} from '../types/canvas';

// Main message handler
self.onmessage = function(event: MessageEvent) {
  const { id, type, payload } = event.data;

  try {
    switch (type) {
      case 'TRANSFORM_LAYOUT':
        const result = transformLayout(payload.elements, payload.fromContext, payload.toContext, payload.options);
        self.postMessage({ id, result });
        break;

      case 'BATCH_TRANSFORM':
        const batchResult = batchTransform(payload.batches);
        self.postMessage({ id, result: batchResult });
        break;

      case 'VALIDATE_LAYOUT':
        const validationResult = validateLayout(payload.elements, payload.context);
        self.postMessage({ id, result: validationResult });
        break;

      default:
        throw new Error(`Unknown message type: ${type}`);
    }
  } catch (error) {
    self.postMessage({ 
      id, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    });
  }
};

/**
 * Main layout transformation function (worker version)
 */
function transformLayout(
  elements: CanvasElement[],
  fromContext: LayoutContext,
  toContext: LayoutContext,
  options: any
): CanvasElement[] {
  console.log(`🔧 Worker Transform: ${fromContext.formatName} → ${toContext.formatName}`);

  // Perform heavy transformation calculations
  const transformedElements = elements.map(element => {
    return transformSingleElement(element, fromContext, toContext);
  });

  // Apply post-processing optimizations
  return optimizeLayout(transformedElements, toContext);
}

/**
 * Transform a single element (worker optimized version)
 */
function transformSingleElement(
  element: CanvasElement,
  fromContext: LayoutContext,
  toContext: LayoutContext
): CanvasElement {
  const responsive = element.responsive || getDefaultResponsiveProps(element.role);

  switch (responsive.mode) {
    case 'fixed':
      return transformFixed(element, fromContext, toContext);
    case 'fluid':
      return transformFluid(element, fromContext, toContext);
    case 'relative':
      return transformRelative(element, fromContext, toContext);
    case 'adaptive':
      return transformAdaptive(element, fromContext, toContext);
    default:
      return transformFluid(element, fromContext, toContext);
  }
}

/**
 * Fixed transformation
 */
function transformFixed(
  element: CanvasElement,
  fromContext: LayoutContext,
  toContext: LayoutContext
): CanvasElement {
  const scaleX = Math.min(1, toContext.containerWidth / fromContext.containerWidth);
  const scaleY = Math.min(1, toContext.containerHeight / fromContext.containerHeight);
  const scale = Math.min(scaleX, scaleY);

  return {
    ...element,
    x: Math.round(element.x * scale),
    y: Math.round(element.y * scale),
    width: Math.round(element.width * scale),
    height: Math.round(element.height * scale),
    fontSize: element.fontSize ? Math.round(element.fontSize * scale) : element.fontSize
  };
}

/**
 * Fluid transformation with enhanced scaling
 */
function transformFluid(
  element: CanvasElement,
  fromContext: LayoutContext,
  toContext: LayoutContext
): CanvasElement {
  const scaleX = toContext.containerWidth / fromContext.containerWidth;
  const scaleY = toContext.containerHeight / fromContext.containerHeight;

  // Use original dimensions for more accurate scaling
  const originalX = element.originalX ?? element.x;
  const originalY = element.originalY ?? element.y;
  const originalWidth = element.originalWidth ?? element.width;
  const originalHeight = element.originalHeight ?? element.height;

  const newX = Math.round(originalX * scaleX);
  const newY = Math.round(originalY * scaleY);
  const newWidth = Math.round(originalWidth * scaleX);
  const newHeight = Math.round(originalHeight * scaleY);

  // Apply responsive constraints
  const responsive = element.responsive || {};
  const constrainedWidth = applyConstraints(newWidth, responsive.minWidth, responsive.maxWidth);
  const constrainedHeight = applyConstraints(newHeight, responsive.minHeight, responsive.maxHeight);

  return {
    ...element,
    x: Math.max(0, Math.min(newX, toContext.containerWidth - constrainedWidth)),
    y: Math.max(0, Math.min(newY, toContext.containerHeight - constrainedHeight)),
    width: constrainedWidth,
    height: constrainedHeight,
    fontSize: element.fontSize ? Math.round((element.originalFontSize ?? element.fontSize) * Math.min(scaleX, scaleY)) : element.fontSize,
    // Preserve original dimensions
    originalX: originalX,
    originalY: originalY,
    originalWidth: originalWidth,
    originalHeight: originalHeight,
    originalFontSize: element.originalFontSize ?? element.fontSize
  };
}

/**
 * Relative transformation using percentages
 */
function transformRelative(
  element: CanvasElement,
  fromContext: LayoutContext,
  toContext: LayoutContext
): CanvasElement {
  const responsive = element.responsive || {};

  // Calculate or use existing percentages
  const xPercent = responsive.xPercent ?? (element.x / fromContext.containerWidth) * 100;
  const yPercent = responsive.yPercent ?? (element.y / fromContext.containerHeight) * 100;
  const widthPercent = responsive.widthPercent ?? (element.width / fromContext.containerWidth) * 100;
  const heightPercent = responsive.heightPercent ?? (element.height / fromContext.containerHeight) * 100;

  // Apply to new container
  const newX = Math.round((xPercent / 100) * toContext.containerWidth);
  const newY = Math.round((yPercent / 100) * toContext.containerHeight);
  const newWidth = Math.round((widthPercent / 100) * toContext.containerWidth);
  const newHeight = Math.round((heightPercent / 100) * toContext.containerHeight);

  // Apply anchor point
  const { adjustedX, adjustedY } = applyAnchorPoint(
    newX, newY, newWidth, newHeight, 
    responsive.anchor || 'top-left'
  );

  return {
    ...element,
    x: Math.max(0, Math.min(adjustedX, toContext.containerWidth - newWidth)),
    y: Math.max(0, Math.min(adjustedY, toContext.containerHeight - newHeight)),
    width: applyConstraints(newWidth, responsive.minWidth, responsive.maxWidth),
    height: applyConstraints(newHeight, responsive.minHeight, responsive.maxHeight),
    responsive: {
      ...responsive,
      xPercent,
      yPercent,
      widthPercent,
      heightPercent
    }
  };
}

/**
 * Adaptive transformation with role-based intelligence
 */
function transformAdaptive(
  element: CanvasElement,
  fromContext: LayoutContext,
  toContext: LayoutContext
): CanvasElement {
  // Get role-based positioning rules
  const rules = getAdaptiveRules(element.role, toContext);
  
  if (!rules) {
    return transformFluid(element, fromContext, toContext);
  }

  const newX = resolveValue(rules.position.x, toContext.containerWidth);
  const newY = resolveValue(rules.position.y, toContext.containerHeight);
  const newWidth = resolveValue(rules.size.width, toContext.containerWidth);
  const newHeight = resolveValue(rules.size.height, toContext.containerHeight);

  // Apply anchor adjustments
  const { adjustedX, adjustedY } = applyAnchorPoint(newX, newY, newWidth, newHeight, rules.anchor);

  // Smart font scaling for text elements
  let newFontSize = element.fontSize;
  if (element.type === 'text' && element.fontSize) {
    newFontSize = calculateSmartFontSize(element, toContext);
  }

  return {
    ...element,
    x: Math.max(0, Math.min(adjustedX, toContext.containerWidth - newWidth)),
    y: Math.max(0, Math.min(adjustedY, toContext.containerHeight - newHeight)),
    width: applyConstraints(newWidth, rules.constraints?.min, rules.constraints?.max),
    height: applyConstraints(newHeight, rules.constraints?.min, rules.constraints?.max),
    fontSize: newFontSize,
    responsive: {
      mode: 'adaptive',
      anchor: rules.anchor,
      ...element.responsive
    }
  };
}

/**
 * Batch transformation for multiple format conversions
 */
function batchTransform(batches: Array<{
  elements: CanvasElement[];
  fromContext: LayoutContext;
  toContext: LayoutContext;
  options: any;
}>): Array<CanvasElement[]> {
  return batches.map(batch => 
    transformLayout(batch.elements, batch.fromContext, batch.toContext, batch.options)
  );
}

/**
 * Layout validation and optimization
 */
function validateLayout(elements: CanvasElement[], context: LayoutContext): {
  isValid: boolean;
  issues: string[];
  suggestions: string[];
} {
  const issues: string[] = [];
  const suggestions: string[] = [];

  // Check for common layout issues
  elements.forEach((element, index) => {
    // Check bounds
    if (element.x < 0 || element.y < 0) {
      issues.push(`Element ${index} is positioned outside canvas bounds`);
    }
    
    if (element.x + element.width > context.containerWidth || 
        element.y + element.height > context.containerHeight) {
      issues.push(`Element ${index} extends beyond canvas boundaries`);
    }

    // Check for tiny elements
    if (element.width < 10 || element.height < 10) {
      issues.push(`Element ${index} may be too small to be visible`);
      suggestions.push(`Consider increasing minimum size constraints for element ${index}`);
    }

    // Check font readability
    if (element.type === 'text' && element.fontSize && element.fontSize < 12) {
      issues.push(`Element ${index} has very small font size (${element.fontSize}px)`);
      suggestions.push(`Increase font size for better readability`);
    }
  });

  // Check for overlapping critical elements
  const criticalRoles: ElementRole[] = ['heading', 'cta', 'logo'];
  const criticalElements = elements.filter(el => criticalRoles.includes(el.role));
  
  for (let i = 0; i < criticalElements.length; i++) {
    for (let j = i + 1; j < criticalElements.length; j++) {
      if (elementsOverlap(criticalElements[i], criticalElements[j])) {
        issues.push(`Critical elements overlap: ${criticalElements[i].role} and ${criticalElements[j].role}`);
        suggestions.push(`Adjust positioning to prevent overlap of important elements`);
      }
    }
  }

  return {
    isValid: issues.length === 0,
    issues,
    suggestions
  };
}

/**
 * Layout optimization post-processing
 */
function optimizeLayout(elements: CanvasElement[], context: LayoutContext): CanvasElement[] {
  let optimizedElements = [...elements];

  // 1. Resolve critical overlaps
  optimizedElements = resolveOverlaps(optimizedElements, context);

  // 2. Optimize spacing and alignment
  optimizedElements = optimizeSpacing(optimizedElements, context);

  // 3. Ensure readability constraints
  optimizedElements = enforceReadabilityConstraints(optimizedElements, context);

  return optimizedElements;
}

// Utility functions
function applyConstraints(value: number, min?: number, max?: number): number {
  if (min !== undefined) value = Math.max(value, min);
  if (max !== undefined) value = Math.min(value, max);
  return Math.round(value);
}

function applyAnchorPoint(
  x: number, y: number, width: number, height: number, 
  anchor: AnchorPoint
): { adjustedX: number; adjustedY: number } {
  switch (anchor) {
    case 'top-center':
      return { adjustedX: x - width / 2, adjustedY: y };
    case 'top-right':
      return { adjustedX: x - width, adjustedY: y };
    case 'center-left':
      return { adjustedX: x, adjustedY: y - height / 2 };
    case 'center':
      return { adjustedX: x - width / 2, adjustedY: y - height / 2 };
    case 'center-right':
      return { adjustedX: x - width, adjustedY: y - height / 2 };
    case 'bottom-left':
      return { adjustedX: x, adjustedY: y - height };
    case 'bottom-center':
      return { adjustedX: x - width / 2, adjustedY: y - height };
    case 'bottom-right':
      return { adjustedX: x - width, adjustedY: y - height };
    default: // top-left
      return { adjustedX: x, adjustedY: y };
  }
}

function resolveValue(value: number | string, containerSize: number): number {
  if (typeof value === 'string' && value.endsWith('%')) {
    const percentage = parseFloat(value);
    return Math.round((percentage / 100) * containerSize);
  }
  return typeof value === 'number' ? value : parseInt(value) || 0;
}

function getDefaultResponsiveProps(role: ElementRole): { mode: ResponsiveMode; anchor: AnchorPoint } {
  const defaults: Record<ElementRole, { mode: ResponsiveMode; anchor: AnchorPoint }> = {
    heading: { mode: 'adaptive', anchor: 'top-center' },
    subheading: { mode: 'adaptive', anchor: 'top-center' },
    body: { mode: 'relative', anchor: 'top-left' },
    caption: { mode: 'relative', anchor: 'bottom-left' },
    image: { mode: 'fluid', anchor: 'center' },
    logo: { mode: 'fixed', anchor: 'top-left' },
    cta: { mode: 'adaptive', anchor: 'bottom-center' },
    background: { mode: 'fixed', anchor: 'top-left' },
    decoration: { mode: 'fluid', anchor: 'center' },
    divider: { mode: 'relative', anchor: 'center' }
  };
  
  return defaults[role] || { mode: 'fluid', anchor: 'top-left' };
}

function getAdaptiveRules(role: ElementRole, context: LayoutContext): any {
  // Simplified adaptive rules for worker
  const isVertical = context.orientation === 'portrait';
  
  const verticalRules: Record<ElementRole, any> = {
    heading: {
      position: { x: '50%', y: '15%' },
      size: { width: '80%', height: '10%' },
      anchor: 'top-center' as AnchorPoint
    },
    image: {
      position: { x: '50%', y: '50%' },
      size: { width: '85%', height: '40%' },
      anchor: 'center' as AnchorPoint
    },
    cta: {
      position: { x: '50%', y: '85%' },
      size: { width: '70%', height: '8%' },
      anchor: 'bottom-center' as AnchorPoint
    }
  };

  const horizontalRules: Record<ElementRole, any> = {
    heading: {
      position: { x: '10%', y: '15%' },
      size: { width: '40%', height: '12%' },
      anchor: 'top-left' as AnchorPoint
    },
    image: {
      position: { x: '55%', y: '50%' },
      size: { width: '40%', height: '60%' },
      anchor: 'center' as AnchorPoint
    },
    cta: {
      position: { x: '10%', y: '80%' },
      size: { width: '30%', height: '10%' },
      anchor: 'bottom-left' as AnchorPoint
    }
  };

  const rules = isVertical ? verticalRules : horizontalRules;
  return rules[role] || null;
}

function calculateSmartFontSize(element: CanvasElement, context: LayoutContext): number {
  if (!element.fontSize) return 16;

  const baseSize = element.originalFontSize ?? element.fontSize;
  const scaleFactor = context.containerWidth / 1080; // Base reference
  
  // Role-based multipliers
  const multipliers: Record<ElementRole, number> = {
    heading: 1.2,
    subheading: 1.0,
    body: 0.9,
    caption: 0.8,
    cta: 1.1,
    image: 1.0,
    logo: 1.0,
    background: 1.0,
    decoration: 1.0,
    divider: 1.0
  };
  
  const roleMultiplier = multipliers[element.role] || 1.0;
  return Math.round(baseSize * scaleFactor * roleMultiplier);
}

function elementsOverlap(a: CanvasElement, b: CanvasElement): boolean {
  return !(a.x + a.width <= b.x || 
           b.x + b.width <= a.x || 
           a.y + a.height <= b.y || 
           b.y + b.height <= a.y);
}

function resolveOverlaps(elements: CanvasElement[], context: LayoutContext): CanvasElement[] {
  const resolvedElements = [...elements];
  
  // Simple overlap resolution
  for (let i = 0; i < resolvedElements.length; i++) {
    for (let j = i + 1; j < resolvedElements.length; j++) {
      const elementA = resolvedElements[i];
      const elementB = resolvedElements[j];
      
      if (elementsOverlap(elementA, elementB)) {
        // Move element with lower priority
        const priorityA = getRolePriority(elementA.role);
        const priorityB = getRolePriority(elementB.role);
        
        if (priorityA < priorityB) {
          resolvedElements[j] = {
            ...elementB,
            y: Math.min(elementA.y + elementA.height + 10, context.containerHeight - elementB.height)
          };
        } else {
          resolvedElements[i] = {
            ...elementA,
            y: Math.min(elementB.y + elementB.height + 10, context.containerHeight - elementA.height)
          };
        }
      }
    }
  }
  
  return resolvedElements;
}

function optimizeSpacing(elements: CanvasElement[], context: LayoutContext): CanvasElement[] {
  // Basic spacing optimization
  return elements.map(element => ({
    ...element,
    x: Math.max(10, Math.min(element.x, context.containerWidth - element.width - 10)),
    y: Math.max(10, Math.min(element.y, context.containerHeight - element.height - 10))
  }));
}

function enforceReadabilityConstraints(elements: CanvasElement[], context: LayoutContext): CanvasElement[] {
  return elements.map(element => {
    if (element.type === 'text' && element.fontSize && element.fontSize < 12) {
      return { ...element, fontSize: 12 };
    }
    return element;
  });
}

function getRolePriority(role: ElementRole): number {
  const priorities: Record<ElementRole, number> = {
    background: 0,
    decoration: 1,
    image: 2,
    logo: 3,
    heading: 4,
    subheading: 5,
    body: 6,
    caption: 7,
    cta: 8,
    divider: 9
  };
  return priorities[role] || 5;
}

// Export for TypeScript modules (if needed)
export {}; 