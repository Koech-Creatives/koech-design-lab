import React from 'react';
import satori from 'satori';
import { html } from 'satori-html';

// Dynamic import for resvg to avoid bundling issues
let Resvg: any = null;

async function loadResvg() {
  if (typeof window === 'undefined') {
    // Server-side: use the actual resvg
    const { Resvg: ResvgClass } = await import('@resvg/resvg-js');
    return ResvgClass;
  } else {
    // Browser-side: use a fallback or mock
    return null;
  }
}

interface ImageGenerationOptions {
  width?: number;
  height?: number;
  format?: 'png' | 'jpeg' | 'webp';
  quality?: number;
  fonts?: Array<{
    name: string;
    data: ArrayBuffer;
    weight?: number;
    style?: 'normal' | 'italic';
  }>;
}

interface ReactComponentToImageOptions extends ImageGenerationOptions {
  component: React.ReactElement;
  props?: Record<string, any>;
}

interface HTMLToImageOptions extends ImageGenerationOptions {
  html: string;
  css?: string;
}

class SatoriImageGenerator {
  private defaultFonts: Array<{
    name: string;
    data: ArrayBuffer;
    weight: number;
    style: 'normal' | 'italic';
  }> = [];

  constructor() {
    this.loadDefaultFonts();
  }

  private async loadDefaultFonts() {
    try {
      // Load Inter font from Google Fonts
      const interRegular = await fetch('https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2');
      const interBold = await fetch('https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hiJ-Ek-_EeA.woff2');
      
      if (interRegular.ok && interBold.ok) {
        this.defaultFonts = [
          {
            name: 'Inter',
            data: await interRegular.arrayBuffer(),
            weight: 400,
            style: 'normal',
          },
          {
            name: 'Inter',
            data: await interBold.arrayBuffer(),
            weight: 700,
            style: 'normal',
          },
        ];
      }
    } catch (error) {
      console.warn('Failed to load default fonts:', error);
      // Fallback to system fonts
      this.defaultFonts = [];
    }
  }

  /**
   * Convert a React component to an image using Satori
   */
  async reactComponentToImage({
    component,
    props = {},
    width = 1200,
    height = 630,
    format = 'png',
    quality = 100,
    fonts = this.defaultFonts
  }: ReactComponentToImageOptions): Promise<Uint8Array | string> {
    try {
      // Create JSX element with props
      const element = React.cloneElement(component, props);
      
      // Convert React element to JSX object for Satori
      const jsxElement = this.reactElementToJSX(element);

      // Generate SVG using Satori
      const svg = await satori(jsxElement, {
        width,
        height,
        fonts: fonts.length > 0 ? fonts : undefined,
      });

      // Try to convert SVG to PNG
      if (typeof window === 'undefined') {
        // Server-side: use resvg
        if (!Resvg) {
          Resvg = await loadResvg();
        }
        if (Resvg) {
          const resvg = new Resvg(svg, {
            fitTo: {
              mode: 'width',
              value: width,
            },
          });
          const pngData = resvg.render();
          return pngData.asPng();
        }
      }
      
      // Browser fallback: return SVG data URL
      return this.svgToDataUrl(svg);
    } catch (error) {
      console.error('Error generating image from React component:', error);
      throw new Error(`Failed to generate image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Convert HTML/CSS to an image using Satori
   */
  async htmlToImage({
    html: htmlString,
    css = '',
    width = 1200,
    height = 630,
    format = 'png',
    quality = 100,
    fonts = this.defaultFonts
  }: HTMLToImageOptions): Promise<Uint8Array | string> {
    try {
      // Combine HTML and CSS
      const fullHtml = css ? `${htmlString}<style>${css}</style>` : htmlString;
      
      // Convert HTML to JSX object using satori-html
      const jsxElement = html(fullHtml);

      // Generate SVG using Satori
      const svg = await satori(jsxElement, {
        width,
        height,
        fonts: fonts.length > 0 ? fonts : undefined,
      });

      // Try to convert SVG to PNG
      if (typeof window === 'undefined') {
        // Server-side: use resvg
        if (!Resvg) {
          Resvg = await loadResvg();
        }
        if (Resvg) {
          const resvg = new Resvg(svg, {
            fitTo: {
              mode: 'width',
              value: width,
            },
          });
          const pngData = resvg.render();
          return pngData.asPng();
        }
      }
      
      // Browser fallback: return SVG data URL
      return this.svgToDataUrl(svg);
    } catch (error) {
      console.error('Error generating image from HTML:', error);
      throw new Error(`Failed to generate image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Convert React element to JSX object for Satori
   */
  private reactElementToJSX(element: React.ReactElement): any {
    if (typeof element.type === 'string') {
      // HTML element
      return {
        type: element.type,
        props: {
          ...element.props,
          children: element.props.children ? this.processChildren(element.props.children) : undefined,
        },
      };
    } else if (typeof element.type === 'function') {
      // React component - render it
      const rendered = element.type(element.props);
      return this.reactElementToJSX(rendered);
    }
    
    return element;
  }

  /**
   * Process children recursively
   */
  private processChildren(children: React.ReactNode): any {
    if (Array.isArray(children)) {
      return children.map(child => {
        if (React.isValidElement(child)) {
          return this.reactElementToJSX(child);
        }
        return child;
      });
    } else if (React.isValidElement(children)) {
      return this.reactElementToJSX(children);
    }
    
    return children;
  }

  /**
   * Convert SVG to data URL for browser fallback
   */
  private svgToDataUrl(svg: string): string {
    const base64 = btoa(unescape(encodeURIComponent(svg)));
    return `data:image/svg+xml;base64,${base64}`;
  }

  /**
   * Convert SVG to PNG using Canvas (browser fallback)
   */
  private async svgToPngCanvas(svg: string, width: number, height: number): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      canvas.width = width;
      canvas.height = height;

      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to convert canvas to blob'));
          }
        }, 'image/png');
      };
      img.onerror = () => reject(new Error('Failed to load SVG image'));
      img.src = this.svgToDataUrl(svg);
    });
  }

  /**
   * Generate a downloadable blob from image data
   */
  createDownloadableBlob(imageData: Uint8Array | string, format: 'png' | 'jpeg' | 'webp' = 'png'): Blob {
    if (typeof imageData === 'string') {
      // SVG data URL
      const base64Data = imageData.split(',')[1];
      const binaryData = atob(base64Data);
      const bytes = new Uint8Array(binaryData.length);
      for (let i = 0; i < binaryData.length; i++) {
        bytes[i] = binaryData.charCodeAt(i);
      }
      return new Blob([bytes], { type: 'image/svg+xml' });
    } else {
      // Binary data
      const mimeType = `image/${format}`;
      return new Blob([imageData], { type: mimeType });
    }
  }

  /**
   * Trigger download of generated image
   */
  async downloadImage(imageData: Uint8Array | string, filename: string = 'template', format: 'png' | 'jpeg' | 'webp' = 'png') {
    let blob: Blob;
    let downloadFormat = format;
    
         if (typeof imageData === 'string') {
       // SVG data - try to convert to PNG in browser
       try {
         // Extract SVG content from data URL
         const svgContent = imageData.startsWith('data:') 
           ? atob(imageData.split(',')[1])
           : imageData;
         blob = await this.svgToPngCanvas(svgContent, 1200, 630);
         downloadFormat = 'png';
       } catch (error) {
         console.warn('Failed to convert SVG to PNG, downloading as SVG:', error);
         blob = this.createDownloadableBlob(imageData, 'svg' as any);
         downloadFormat = 'svg' as any;
       }
     } else {
      blob = this.createDownloadableBlob(imageData, format);
    }
    
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.${downloadFormat}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    URL.revokeObjectURL(url);
  }

  /**
   * Generate social media optimized images
   */
  async generateSocialImages(component: React.ReactElement, props: Record<string, any> = {}) {
    const platforms = {
      instagram: { width: 1080, height: 1080 },
      'instagram-story': { width: 1080, height: 1920 },
      twitter: { width: 1200, height: 675 },
      facebook: { width: 1200, height: 630 },
      linkedin: { width: 1200, height: 627 },
    };

    const results: Record<string, Uint8Array | string> = {};

    for (const [platform, dimensions] of Object.entries(platforms)) {
      try {
        const imageData = await this.reactComponentToImage({
          component,
          props,
          ...dimensions,
        });
        results[platform] = imageData;
      } catch (error) {
        console.error(`Failed to generate image for ${platform}:`, error);
      }
    }

    return results;
  }
}

// Export singleton instance
export const satoriImageGenerator = new SatoriImageGenerator();

// Export types
export type { ImageGenerationOptions, ReactComponentToImageOptions, HTMLToImageOptions }; 