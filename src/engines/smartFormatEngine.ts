import { 
  CanvasElement, 
  ElementRole, 
  ResponsiveMode, 
  AnchorPoint, 
  LayoutContext, 
  LayoutPreset, 
  FormatOverride,
  ProjectLayout,
  ResponsiveProperties
} from '../types/canvas';

export class SmartFormatEngine {
  private layoutPresets: Map<string, LayoutPreset> = new Map();
  private worker: Worker | null = null;

  constructor() {
    this.initializeDefaultPresets();
    this.initializeWorker();
  }

  /**
   * Main transformation method - converts elements from one format to another
   */
  async transformLayout(
    elements: CanvasElement[],
    fromContext: LayoutContext,
    toContext: LayoutContext,
    options: {
      usePresets?: boolean;
      preserveOverrides?: boolean;
      enableWorker?: boolean;
    } = {}
  ): Promise<CanvasElement[]> {
    const { usePresets = true, preserveOverrides = true, enableWorker = true } = options;

    console.log(`🎯 Smart Transform: ${fromContext.formatName} → ${toContext.formatName}`);

    try {
      // Use web worker for heavy computations if available
      if (enableWorker && this.worker) {
        return await this.transformWithWorker(elements, fromContext, toContext, { usePresets, preserveOverrides });
      }

      // Fallback to main thread
      return this.transformElements(elements, fromContext, toContext, { usePresets, preserveOverrides });
    } catch (error) {
      console.error('Smart transform failed, falling back to simple resize:', error);
      return this.fallbackTransform(elements, fromContext, toContext);
    }
  }

  /**
   * Main element transformation logic
   */
  private transformElements(
    elements: CanvasElement[],
    fromContext: LayoutContext,
    toContext: LayoutContext,
    options: { usePresets?: boolean; preserveOverrides?: boolean }
  ): CanvasElement[] {
    // 1. Group elements by role and layout relationships
    const elementGroups = this.groupElementsByRole(elements);
    
    // 2. Select appropriate layout preset
    const preset = options.usePresets ? this.selectLayoutPreset(toContext) : null;
    
    // 3. Transform each element based on its responsive mode and role
    const transformedElements = elements.map(element => {
      return this.transformSingleElement(element, fromContext, toContext, preset);
    });

    // 4. Apply layout flow adjustments if using presets
    if (preset) {
      return this.applyLayoutFlow(transformedElements, toContext, preset);
    }

    // 5. Resolve collisions and overlaps
    return this.resolveCollisions(transformedElements, toContext);
  }

  /**
   * Transform a single element based on its responsive properties
   */
  private transformSingleElement(
    element: CanvasElement,
    fromContext: LayoutContext,
    toContext: LayoutContext,
    preset: LayoutPreset | null
  ): CanvasElement {
    const responsive = element.responsive || this.getDefaultResponsiveProps(element.role);
    
    switch (responsive.mode) {
      case 'fixed':
        return this.transformFixed(element, fromContext, toContext);
      
      case 'fluid':
        return this.transformFluid(element, fromContext, toContext);
      
      case 'relative':
        return this.transformRelative(element, fromContext, toContext);
      
      case 'adaptive':
        return this.transformAdaptive(element, fromContext, toContext, preset);
      
      default:
        return this.transformFluid(element, fromContext, toContext); // Default fallback
    }
  }

  /**
   * Fixed mode: Maintain absolute positioning, minimal scaling
   */
  private transformFixed(
    element: CanvasElement,
    fromContext: LayoutContext,
    toContext: LayoutContext
  ): CanvasElement {
    // Apply minimal scaling to fit within new canvas bounds
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
   * Fluid mode: Scale proportionally with container
   */
  private transformFluid(
    element: CanvasElement,
    fromContext: LayoutContext,
    toContext: LayoutContext
  ): CanvasElement {
    const scaleX = toContext.containerWidth / fromContext.containerWidth;
    const scaleY = toContext.containerHeight / fromContext.containerHeight;

    // Use original dimensions if available for more accurate scaling
    const originalX = element.originalX ?? element.x;
    const originalY = element.originalY ?? element.y;
    const originalWidth = element.originalWidth ?? element.width;
    const originalHeight = element.originalHeight ?? element.height;

    const newX = Math.round(originalX * scaleX);
    const newY = Math.round(originalY * scaleY);
    const newWidth = Math.round(originalWidth * scaleX);
    const newHeight = Math.round(originalHeight * scaleY);

    // Apply constraints if defined
    const responsive = element.responsive || {};
    const constrainedWidth = this.applyConstraints(newWidth, responsive.minWidth, responsive.maxWidth);
    const constrainedHeight = this.applyConstraints(newHeight, responsive.minHeight, responsive.maxHeight);

    return {
      ...element,
      x: Math.max(0, Math.min(newX, toContext.containerWidth - constrainedWidth)),
      y: Math.max(0, Math.min(newY, toContext.containerHeight - constrainedHeight)),
      width: constrainedWidth,
      height: constrainedHeight,
      fontSize: element.fontSize ? Math.round((element.originalFontSize ?? element.fontSize) * Math.min(scaleX, scaleY)) : element.fontSize,
      // Preserve original dimensions for future transformations
      originalX: originalX,
      originalY: originalY,
      originalWidth: originalWidth,
      originalHeight: originalHeight,
      originalFontSize: element.originalFontSize ?? element.fontSize
    };
  }

  /**
   * Relative mode: Use percentage-based positioning
   */
  private transformRelative(
    element: CanvasElement,
    fromContext: LayoutContext,
    toContext: LayoutContext
  ): CanvasElement {
    const responsive = element.responsive || {};

    // Calculate percentages from current position if not already set
    const xPercent = responsive.xPercent ?? (element.x / fromContext.containerWidth) * 100;
    const yPercent = responsive.yPercent ?? (element.y / fromContext.containerHeight) * 100;
    const widthPercent = responsive.widthPercent ?? (element.width / fromContext.containerWidth) * 100;
    const heightPercent = responsive.heightPercent ?? (element.height / fromContext.containerHeight) * 100;

    // Apply to new container
    const newX = Math.round((xPercent / 100) * toContext.containerWidth);
    const newY = Math.round((yPercent / 100) * toContext.containerHeight);
    const newWidth = Math.round((widthPercent / 100) * toContext.containerWidth);
    const newHeight = Math.round((heightPercent / 100) * toContext.containerHeight);

    // Apply anchor point adjustments
    const { adjustedX, adjustedY } = this.applyAnchorPoint(
      newX, newY, newWidth, newHeight, 
      responsive.anchor || 'top-left'
    );

    return {
      ...element,
      x: Math.max(0, Math.min(adjustedX, toContext.containerWidth - newWidth)),
      y: Math.max(0, Math.min(adjustedY, toContext.containerHeight - newHeight)),
      width: this.applyConstraints(newWidth, responsive.minWidth, responsive.maxWidth),
      height: this.applyConstraints(newHeight, responsive.minHeight, responsive.maxHeight),
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
   * Adaptive mode: Smart reflow based on role and layout presets
   */
  private transformAdaptive(
    element: CanvasElement,
    fromContext: LayoutContext,
    toContext: LayoutContext,
    preset: LayoutPreset | null
  ): CanvasElement {
    if (!preset || !preset.rules[element.role]) {
      // Fallback to fluid if no preset rule available
      return this.transformFluid(element, fromContext, toContext);
    }

    const rule = preset.rules[element.role]!;
    
    // Apply role-based positioning
    const newX = this.resolveValue(rule.preferredPosition.x, toContext.containerWidth);
    const newY = this.resolveValue(rule.preferredPosition.y, toContext.containerHeight);
    const newWidth = this.resolveValue(rule.preferredSize.width, toContext.containerWidth);
    const newHeight = this.resolveValue(rule.preferredSize.height, toContext.containerHeight);

    // Apply anchor adjustments
    const { adjustedX, adjustedY } = this.applyAnchorPoint(newX, newY, newWidth, newHeight, rule.anchor);

    // Scale font size intelligently for text elements
    let newFontSize = element.fontSize;
    if (element.type === 'text' && element.fontSize) {
      newFontSize = this.calculateAdaptiveFontSize(element, toContext, rule);
    }

    return {
      ...element,
      x: Math.max(0, Math.min(adjustedX, toContext.containerWidth - newWidth)),
      y: Math.max(0, Math.min(adjustedY, toContext.containerHeight - newHeight)),
      width: this.applyConstraints(newWidth, rule.constraints?.minSize, rule.constraints?.maxSize),
      height: this.applyConstraints(newHeight, rule.constraints?.minSize, rule.constraints?.maxSize),
      fontSize: newFontSize,
      responsive: {
        mode: 'adaptive',
        anchor: rule.anchor,
        ...element.responsive
      }
    };
  }

  /**
   * Group elements by their roles for layout flow processing
   */
  private groupElementsByRole(elements: CanvasElement[]): Map<ElementRole, CanvasElement[]> {
    const groups = new Map<ElementRole, CanvasElement[]>();
    
    elements.forEach(element => {
      const role = element.role || 'body'; // Default role
      if (!groups.has(role)) {
        groups.set(role, []);
      }
      groups.get(role)!.push(element);
    });

    return groups;
  }

  /**
   * Select the most appropriate layout preset for the target context
   */
  private selectLayoutPreset(context: LayoutContext): LayoutPreset | null {
    for (const preset of this.layoutPresets.values()) {
      // Check if preset supports this format
      if (preset.targetFormats.includes(context.formatName) || 
          preset.targetFormats.includes(context.platform)) {
        // Check if aspect ratio is compatible
        const isCompatibleAspectRatio = preset.aspectRatios.some(ratio => 
          Math.abs(ratio - context.aspectRatio) < 0.1
        );
        
        if (isCompatibleAspectRatio) {
          return preset;
        }
      }
    }

    // Return default preset based on orientation
    return this.getDefaultPreset(context.orientation);
  }

  /**
   * Apply layout flow rules to arrange elements
   */
  private applyLayoutFlow(
    elements: CanvasElement[],
    context: LayoutContext,
    preset: LayoutPreset
  ): CanvasElement[] {
    const flow = preset.flow;
    
    // Sort elements by layoutOrder and role priority
    const sortedElements = [...elements].sort((a, b) => {
      const orderA = a.layoutOrder ?? this.getRolePriority(a.role);
      const orderB = b.layoutOrder ?? this.getRolePriority(b.role);
      return orderA - orderB;
    });

    // Apply flow-based positioning
    switch (flow.direction) {
      case 'vertical':
        return this.applyVerticalFlow(sortedElements, context, flow);
      case 'horizontal':
        return this.applyHorizontalFlow(sortedElements, context, flow);
      case 'grid':
        return this.applyGridFlow(sortedElements, context, flow);
      default:
        return elements;
    }
  }

  /**
   * Resolve collisions between elements
   */
  private resolveCollisions(elements: CanvasElement[], context: LayoutContext): CanvasElement[] {
    const resolvedElements = [...elements];
    
    // Simple collision detection and resolution
    for (let i = 0; i < resolvedElements.length; i++) {
      for (let j = i + 1; j < resolvedElements.length; j++) {
        const elementA = resolvedElements[i];
        const elementB = resolvedElements[j];
        
        if (this.elementsOverlap(elementA, elementB)) {
          // Move the element with lower priority
          const priorityA = this.getRolePriority(elementA.role);
          const priorityB = this.getRolePriority(elementB.role);
          
          if (priorityA < priorityB) {
            // Move elementB
            resolvedElements[j] = this.resolveElementCollision(elementB, elementA, context);
          } else {
            // Move elementA
            resolvedElements[i] = this.resolveElementCollision(elementA, elementB, context);
          }
        }
      }
    }
    
    return resolvedElements;
  }

  // Utility methods
  private applyConstraints(value: number, min?: number, max?: number): number {
    if (min !== undefined) value = Math.max(value, min);
    if (max !== undefined) value = Math.min(value, max);
    return Math.round(value);
  }

  private applyAnchorPoint(
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

  private resolveValue(value: number | string, containerSize: number): number {
    if (typeof value === 'string' && value.endsWith('%')) {
      const percentage = parseFloat(value);
      return Math.round((percentage / 100) * containerSize);
    }
    return typeof value === 'number' ? value : parseInt(value) || 0;
  }

  private calculateAdaptiveFontSize(
    element: CanvasElement,
    context: LayoutContext,
    rule: any
  ): number {
    if (!element.fontSize) return 16;

    // Base font size scaling on container width for responsive text
    const baseSize = element.originalFontSize ?? element.fontSize;
    const scaleFactor = context.containerWidth / 1080; // Base width reference
    
    // Role-based font size adjustments
    const roleMultiplier = this.getFontSizeMultiplier(element.role);
    
    return Math.round(baseSize * scaleFactor * roleMultiplier);
  }

  private getFontSizeMultiplier(role: ElementRole): number {
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
    return multipliers[role] || 1.0;
  }

  private getRolePriority(role: ElementRole): number {
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

  private getDefaultResponsiveProps(role: ElementRole): ResponsiveProperties {
    // Default responsive properties based on element role
    const defaults: Record<ElementRole, ResponsiveProperties> = {
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

  // Default layout presets
  private initializeDefaultPresets(): void {
    // Story/Vertical layout preset
    const storyPreset: LayoutPreset = {
      id: 'story-vertical',
      name: 'Story Vertical Layout',
      description: 'Optimized for vertical story formats',
      targetFormats: ['story', 'reel', 'vertical'],
      aspectRatios: [9/16, 4/5],
      rules: {
        heading: {
          preferredPosition: { x: '50%', y: '15%' },
          preferredSize: { width: '80%', height: '10%' },
          anchor: 'top-center',
          responsive: 'adaptive'
        },
        subheading: {
          preferredPosition: { x: '50%', y: '25%' },
          preferredSize: { width: '75%', height: '8%' },
          anchor: 'top-center',
          responsive: 'adaptive'
        },
        image: {
          preferredPosition: { x: '50%', y: '50%' },
          preferredSize: { width: '85%', height: '40%' },
          anchor: 'center',
          responsive: 'fluid'
        },
        cta: {
          preferredPosition: { x: '50%', y: '85%' },
          preferredSize: { width: '70%', height: '8%' },
          anchor: 'bottom-center',
          responsive: 'adaptive'
        }
      },
      flow: {
        direction: 'vertical',
        spacing: '5%',
        alignment: 'center'
      }
    };

    // Landscape/Horizontal layout preset
    const landscapePreset: LayoutPreset = {
      id: 'landscape-horizontal',
      name: 'Landscape Horizontal Layout',
      description: 'Optimized for landscape formats',
      targetFormats: ['landscape'],
      aspectRatios: [16/9, 1.91/1],
      rules: {
        heading: {
          preferredPosition: { x: '10%', y: '15%' },
          preferredSize: { width: '40%', height: '12%' },
          anchor: 'top-left',
          responsive: 'adaptive'
        },
        image: {
          preferredPosition: { x: '55%', y: '50%' },
          preferredSize: { width: '40%', height: '60%' },
          anchor: 'center',
          responsive: 'fluid'
        },
        body: {
          preferredPosition: { x: '10%', y: '35%' },
          preferredSize: { width: '40%', height: '40%' },
          anchor: 'top-left',
          responsive: 'relative'
        },
        cta: {
          preferredPosition: { x: '10%', y: '80%' },
          preferredSize: { width: '30%', height: '10%' },
          anchor: 'bottom-left',
          responsive: 'adaptive'
        }
      },
      flow: {
        direction: 'horizontal',
        spacing: '5%',
        alignment: 'start'
      }
    };

    this.layoutPresets.set(storyPreset.id, storyPreset);
    this.layoutPresets.set(landscapePreset.id, landscapePreset);
  }

  private getDefaultPreset(orientation: string): LayoutPreset | null {
    switch (orientation) {
      case 'portrait':
        return this.layoutPresets.get('story-vertical') || null;
      case 'landscape':
        return this.layoutPresets.get('landscape-horizontal') || null;
      default:
        return null;
    }
  }

  // Worker integration methods
  private initializeWorker(): void {
    try {
      this.worker = new Worker(new URL('../workers/formatWorker.ts', import.meta.url));
      this.worker.onmessage = this.handleWorkerMessage.bind(this);
      this.worker.onerror = this.handleWorkerError.bind(this);
    } catch (error) {
      console.warn('Web Worker not available, using main thread for transformations');
    }
  }

  private async transformWithWorker(
    elements: CanvasElement[],
    fromContext: LayoutContext,
    toContext: LayoutContext,
    options: any
  ): Promise<CanvasElement[]> {
    return new Promise((resolve, reject) => {
      if (!this.worker) {
        reject(new Error('Worker not available'));
        return;
      }

      const messageId = Date.now().toString();
      
      const handleMessage = (event: MessageEvent) => {
        if (event.data.id === messageId) {
          this.worker!.removeEventListener('message', handleMessage);
          if (event.data.error) {
            reject(new Error(event.data.error));
          } else {
            resolve(event.data.result);
          }
        }
      };

      this.worker.addEventListener('message', handleMessage);
      
      this.worker.postMessage({
        id: messageId,
        type: 'TRANSFORM_LAYOUT',
        payload: { elements, fromContext, toContext, options }
      });
    });
  }

  private handleWorkerMessage(event: MessageEvent): void {
    // Handle worker messages
  }

  private handleWorkerError(error: ErrorEvent): void {
    console.error('Format worker error:', error);
  }

  // Fallback transformation for error cases
  private fallbackTransform(
    elements: CanvasElement[],
    fromContext: LayoutContext,
    toContext: LayoutContext
  ): CanvasElement[] {
    // Simple proportional scaling as fallback
    const scaleX = toContext.containerWidth / fromContext.containerWidth;
    const scaleY = toContext.containerHeight / fromContext.containerHeight;

    return elements.map(element => ({
      ...element,
      x: Math.round(element.x * scaleX),
      y: Math.round(element.y * scaleY),
      width: Math.round(element.width * scaleX),
      height: Math.round(element.height * scaleY),
      fontSize: element.fontSize ? Math.round(element.fontSize * Math.min(scaleX, scaleY)) : element.fontSize
    }));
  }

  // Additional helper methods for layout flow
  private applyVerticalFlow(elements: CanvasElement[], context: LayoutContext, flow: any): CanvasElement[] {
    // Implementation for vertical flow layout
    // Sort elements and apply vertical stacking with spacing
    let currentY = parseInt(flow.spacing) || 20;
    const spacing = this.resolveValue(flow.spacing, context.containerHeight);
    
    return elements.map(element => {
      const newElement = { ...element, y: currentY };
      currentY += element.height + spacing;
      return newElement;
    });
  }

  private applyHorizontalFlow(elements: CanvasElement[], context: LayoutContext, flow: any): CanvasElement[] {
    // Implementation for horizontal flow layout
    let currentX = parseInt(flow.spacing) || 20;
    const spacing = this.resolveValue(flow.spacing, context.containerWidth);
    
    return elements.map(element => {
      const newElement = { ...element, x: currentX };
      currentX += element.width + spacing;
      return newElement;
    });
  }

  private applyGridFlow(elements: CanvasElement[], context: LayoutContext, flow: any): CanvasElement[] {
    // Implementation for grid flow layout
    const cols = Math.floor(Math.sqrt(elements.length));
    const spacing = this.resolveValue(flow.spacing, context.containerWidth);
    
    return elements.map((element, index) => {
      const row = Math.floor(index / cols);
      const col = index % cols;
      
      return {
        ...element,
        x: col * (element.width + spacing),
        y: row * (element.height + spacing)
      };
    });
  }

  private elementsOverlap(a: CanvasElement, b: CanvasElement): boolean {
    return !(a.x + a.width <= b.x || 
             b.x + b.width <= a.x || 
             a.y + a.height <= b.y || 
             b.y + b.height <= a.y);
  }

  private resolveElementCollision(
    element: CanvasElement,
    obstacle: CanvasElement,
    context: LayoutContext
  ): CanvasElement {
    // Simple collision resolution - move element down
    const newY = obstacle.y + obstacle.height + 10;
    return {
      ...element,
      y: Math.min(newY, context.containerHeight - element.height)
    };
  }
} 