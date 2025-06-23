import { CanvasElement, LayoutContext, ElementRole } from '../types/canvas';

interface AIOptimizationRequest {
  elements: CanvasElement[];
  sourceContext: LayoutContext;
  targetContext: LayoutContext;
  objectives: string[];
  constraints: string[];
}

interface AIOptimizationResponse {
  optimizedElements: CanvasElement[];
  reasoning: string;
  confidence: number;
  alternatives?: CanvasElement[][];
}

export class AILayoutOptimizer {
  private apiKey: string | null = null;
  private baseUrl: string = 'https://api.openai.com/v1';

  constructor(apiKey?: string) {
    this.apiKey = apiKey || this.getApiKeyFromEnv();
  }

  /**
   * Main AI optimization method
   */
  async optimizeLayout(
    elements: CanvasElement[],
    sourceContext: LayoutContext,
    targetContext: LayoutContext,
    options: {
      objectives?: string[];
      constraints?: string[];
      model?: string;
      temperature?: number;
    } = {}
  ): Promise<AIOptimizationResponse> {
    if (!this.apiKey) {
      throw new Error('AI Layout Optimizer requires an OpenAI API key');
    }

    const {
      objectives = [
        'Maintain visual hierarchy',
        'Optimize readability',
        'Ensure proper spacing',
        'Adapt to new aspect ratio',
        'Preserve brand consistency'
      ],
      constraints = [
        'Keep elements within canvas bounds',
        'Maintain minimum font sizes for readability',
        'Preserve element relationships',
        'Respect safe zones'
      ],
      model = 'gpt-4',
      temperature = 0.7
    } = options;

    const prompt = this.generateOptimizationPrompt({
      elements,
      sourceContext,
      targetContext,
      objectives,
      constraints
    });

    try {
      const response = await this.callOpenAI(prompt, model, temperature);
      return this.parseAIResponse(response, elements);
    } catch (error) {
      console.error('AI Layout Optimization failed:', error);
      throw error;
    }
  }

  /**
   * Generate a comprehensive prompt for the AI
   */
  private generateOptimizationPrompt(request: AIOptimizationRequest): string {
    const { elements, sourceContext, targetContext, objectives, constraints } = request;

    const elementDescriptions = elements.map(el => ({
      id: el.id,
      type: el.type,
      role: el.role,
      position: { x: el.x, y: el.y },
      size: { width: el.width, height: el.height },
      content: el.content?.substring(0, 50) || 'N/A',
      fontSize: el.fontSize,
      importance: this.getElementImportance(el.role)
    }));

    return `
You are an expert UI/UX designer specializing in responsive layout optimization. Your task is to optimize a design layout when adapting from one format to another.

## Source Format
- Platform: ${sourceContext.platform}
- Format: ${sourceContext.formatName}
- Dimensions: ${sourceContext.containerWidth}×${sourceContext.containerHeight}
- Aspect Ratio: ${sourceContext.aspectRatio.toFixed(2)}
- Orientation: ${sourceContext.orientation}

## Target Format
- Platform: ${targetContext.platform}
- Format: ${targetContext.formatName}
- Dimensions: ${targetContext.containerWidth}×${targetContext.containerHeight}
- Aspect Ratio: ${targetContext.aspectRatio.toFixed(2)}
- Orientation: ${targetContext.orientation}

## Current Elements
${JSON.stringify(elementDescriptions, null, 2)}

## Optimization Objectives
${objectives.map(obj => `- ${obj}`).join('\n')}

## Constraints
${constraints.map(con => `- ${con}`).join('\n')}

## Layout Guidelines
1. **Visual Hierarchy**: Maintain the importance order (heading > subheading > body > caption)
2. **Readability**: Ensure text elements have appropriate size and spacing
3. **Balance**: Distribute elements harmoniously across the available space
4. **Adaptation**: Account for the change in aspect ratio and orientation
5. **Accessibility**: Maintain minimum touch targets and text sizes

## Format-Specific Considerations
${this.getFormatSpecificGuidelines(targetContext)}

## Task
Optimize the layout by suggesting new positions, sizes, and font sizes for each element. Consider:
- How the aspect ratio change affects element arrangement
- Whether elements should be repositioned for better flow
- If font sizes need adjustment for the new format
- Any elements that might need visibility changes

Respond with a JSON object containing:
1. "optimizedElements": Array of elements with updated properties
2. "reasoning": Explanation of your optimization decisions
3. "confidence": Your confidence level (0-1) in this optimization
4. "alternatives": Optional array of alternative layout arrangements

Format your response as valid JSON without any markdown formatting.
`;
  }

  /**
   * Get format-specific design guidelines
   */
  private getFormatSpecificGuidelines(context: LayoutContext): string {
    const guidelines = [];

    // Platform-specific guidelines
    switch (context.platform.toLowerCase()) {
      case 'instagram':
        if (context.orientation === 'portrait') {
          guidelines.push('- Instagram Stories: Focus on vertical hierarchy, use upper and lower thirds effectively');
          guidelines.push('- Keep CTAs in the lower third for thumb accessibility');
        } else {
          guidelines.push('- Instagram Posts: Center important content, leave breathing room');
        }
        break;
      
      case 'linkedin':
        guidelines.push('- Professional tone: Emphasize text readability and clean layout');
        guidelines.push('- Business focus: Ensure logos and headlines are prominent');
        break;
      
      case 'twitter':
        guidelines.push('- Concise content: Prioritize key message visibility');
        guidelines.push('- Mobile-first: Ensure elements work well on small screens');
        break;
      
      case 'tiktok':
        guidelines.push('- Vertical video format: Use full height effectively');
        guidelines.push('- Young audience: Bold, dynamic layouts work well');
        break;
    }

    // Orientation-specific guidelines
    if (context.orientation === 'landscape') {
      guidelines.push('- Horizontal layout: Consider side-by-side arrangements');
      guidelines.push('- Use width advantage for multi-column layouts');
    } else if (context.orientation === 'portrait') {
      guidelines.push('- Vertical layout: Stack elements with clear hierarchy');
      guidelines.push('- Utilize the height for storytelling flow');
    }

    return guidelines.length > 0 ? guidelines.join('\n') : '- No specific guidelines for this format';
  }

  /**
   * Get element importance for AI consideration
   */
  private getElementImportance(role: ElementRole): number {
    const importance: Record<ElementRole, number> = {
      logo: 0.9,
      heading: 0.85,
      cta: 0.8,
      subheading: 0.7,
      image: 0.6,
      body: 0.5,
      caption: 0.4,
      divider: 0.3,
      decoration: 0.2,
      background: 0.1
    };
    return importance[role] || 0.5;
  }

  /**
   * Call OpenAI API
   */
  private async callOpenAI(prompt: string, model: string, temperature: number): Promise<any> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'system',
            content: 'You are an expert UI/UX designer. Always respond with valid JSON only, no markdown formatting.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  /**
   * Parse AI response and validate the result
   */
  private parseAIResponse(response: string, originalElements: CanvasElement[]): AIOptimizationResponse {
    try {
      // Clean the response in case it has markdown formatting
      const cleanedResponse = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsed = JSON.parse(cleanedResponse);

      // Validate the response structure
      if (!parsed.optimizedElements || !Array.isArray(parsed.optimizedElements)) {
        throw new Error('Invalid response: missing or invalid optimizedElements');
      }

      // Ensure all original elements are present and validate properties
      const optimizedElements = originalElements.map(originalElement => {
        const aiElement = parsed.optimizedElements.find((el: any) => el.id === originalElement.id);
        
        if (!aiElement) {
          console.warn(`AI did not provide optimization for element ${originalElement.id}, keeping original`);
          return originalElement;
        }

        // Validate and merge AI suggestions with original element
        const optimized = { ...originalElement };

        // Position validation
        if (typeof aiElement.x === 'number' && aiElement.x >= 0) {
          optimized.x = Math.round(aiElement.x);
        }
        if (typeof aiElement.y === 'number' && aiElement.y >= 0) {
          optimized.y = Math.round(aiElement.y);
        }

        // Size validation
        if (typeof aiElement.width === 'number' && aiElement.width > 0) {
          optimized.width = Math.round(Math.max(10, aiElement.width));
        }
        if (typeof aiElement.height === 'number' && aiElement.height > 0) {
          optimized.height = Math.round(Math.max(10, aiElement.height));
        }

        // Font size validation for text elements
        if (originalElement.type === 'text' && typeof aiElement.fontSize === 'number') {
          optimized.fontSize = Math.round(Math.max(8, Math.min(200, aiElement.fontSize)));
        }

        // Visibility validation
        if (typeof aiElement.visible === 'boolean') {
          optimized.visible = aiElement.visible;
        }

        return optimized;
      });

      return {
        optimizedElements,
        reasoning: parsed.reasoning || 'No reasoning provided',
        confidence: Math.max(0, Math.min(1, parsed.confidence || 0.5)),
        alternatives: parsed.alternatives || []
      };

    } catch (error) {
      console.error('Failed to parse AI response:', error);
      throw new Error(`Invalid AI response format: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get API key from environment or prompt user
   */
  private getApiKeyFromEnv(): string | null {
    // In a real app, this would check environment variables
    // For now, return null to require explicit API key
    return null;
  }

  /**
   * Quick layout health check using AI
   */
  async analyzeLayout(
    elements: CanvasElement[],
    context: LayoutContext
  ): Promise<{
    score: number;
    issues: string[];
    suggestions: string[];
  }> {
    if (!this.apiKey) {
      // Fallback to basic analysis without AI
      return this.basicLayoutAnalysis(elements, context);
    }

    const prompt = `
Analyze this layout for design quality and provide a score out of 100 plus specific issues and suggestions.

Canvas: ${context.containerWidth}×${context.containerHeight} (${context.platform} ${context.formatName})
Elements: ${JSON.stringify(elements.map(el => ({
  type: el.type,
  role: el.role,
  position: [el.x, el.y],
  size: [el.width, el.height],
  fontSize: el.fontSize
})))}

Evaluate based on:
- Visual hierarchy
- Spacing and alignment
- Readability
- Balance and composition
- Platform appropriateness

Respond with JSON: {"score": number, "issues": string[], "suggestions": string[]}
    `;

    try {
      const response = await this.callOpenAI(prompt, 'gpt-3.5-turbo', 0.3);
      const parsed = JSON.parse(response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim());
      
      return {
        score: Math.max(0, Math.min(100, parsed.score || 50)),
        issues: parsed.issues || [],
        suggestions: parsed.suggestions || []
      };
    } catch (error) {
      console.error('AI layout analysis failed:', error);
      return this.basicLayoutAnalysis(elements, context);
    }
  }

  /**
   * Basic layout analysis fallback
   */
  private basicLayoutAnalysis(elements: CanvasElement[], context: LayoutContext): {
    score: number;
    issues: string[];
    suggestions: string[];
  } {
    const issues: string[] = [];
    const suggestions: string[] = [];
    let score = 100;

    // Check for elements outside bounds
    elements.forEach(el => {
      if (el.x < 0 || el.y < 0 || el.x + el.width > context.containerWidth || el.y + el.height > context.containerHeight) {
        issues.push(`Element ${el.type} is outside canvas bounds`);
        suggestions.push('Reposition elements to fit within canvas');
        score -= 10;
      }
    });

    // Check for tiny elements
    const tinyElements = elements.filter(el => el.width < 10 || el.height < 10);
    if (tinyElements.length > 0) {
      issues.push(`${tinyElements.length} elements are too small to be visible`);
      suggestions.push('Increase size of small elements');
      score -= 5 * tinyElements.length;
    }

    // Check font sizes
    const textElements = elements.filter(el => el.type === 'text');
    const smallText = textElements.filter(el => el.fontSize && el.fontSize < 12);
    if (smallText.length > 0) {
      issues.push(`${smallText.length} text elements have small font sizes`);
      suggestions.push('Increase font sizes for better readability');
      score -= 5 * smallText.length;
    }

    return {
      score: Math.max(0, score),
      issues,
      suggestions
    };
  }

  /**
   * Set API key for the optimizer
   */
  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
  }

  /**
   * Check if AI optimization is available
   */
  isAvailable(): boolean {
    return !!this.apiKey;
  }
} 