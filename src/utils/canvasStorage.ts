interface CanvasElement {
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
  originalX?: number;
  originalY?: number;
  originalWidth?: number;
  originalHeight?: number;
  originalFontSize?: number;
}

interface PlatformFormatStorage {
  [platformKey: string]: {
    [formatKey: string]: {
      elements: CanvasElement[];
      canvasBackground: string;
      lastModified: number;
    }
  }
}

const STORAGE_KEY = 'canvas-platform-format-storage';

export class CanvasStorageManager {
  
  static loadStorage(): PlatformFormatStorage {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Error loading platform-format storage:', error);
      return {};
    }
  }

  static saveStorage(storage: PlatformFormatStorage): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
    } catch (error) {
      console.error('Error saving platform-format storage:', error);
    }
  }

  static getPlatformFormatKey(platform: string, format: { name: string; width: number; height: number }): string {
    return `${format.name}_${format.width}x${format.height}`.toLowerCase();
  }

  static getAllStoredDesigns(): Array<{
    platform: string;
    format: string;
    elementCount: number;
    lastModified: Date;
    dimensions: string;
  }> {
    const storage = this.loadStorage();
    const designs: Array<{
      platform: string;
      format: string;
      elementCount: number;
      lastModified: Date;
      dimensions: string;
    }> = [];

    Object.entries(storage).forEach(([platform, formats]) => {
      Object.entries(formats).forEach(([formatKey, data]) => {
        const [formatName, dimensions] = formatKey.split('_');
        designs.push({
          platform: platform.charAt(0).toUpperCase() + platform.slice(1),
          format: formatName.charAt(0).toUpperCase() + formatName.slice(1),
          elementCount: data.elements.length,
          lastModified: new Date(data.lastModified),
          dimensions: dimensions.replace('x', ' × '),
        });
      });
    });

    return designs.sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime());
  }

  static clearStorage(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
      console.log('🗑️ Canvas storage cleared');
    } catch (error) {
      console.error('Error clearing canvas storage:', error);
    }
  }

  static exportStorage(): string {
    const storage = this.loadStorage();
    return JSON.stringify(storage, null, 2);
  }

  static importStorage(jsonData: string): boolean {
    try {
      const storage = JSON.parse(jsonData);
      this.saveStorage(storage);
      console.log('📥 Canvas storage imported successfully');
      return true;
    } catch (error) {
      console.error('Error importing canvas storage:', error);
      return false;
    }
  }

  static getStorageSize(): string {
    try {
      const storage = JSON.stringify(this.loadStorage());
      const sizeInBytes = new Blob([storage]).size;
      const sizeInKB = (sizeInBytes / 1024).toFixed(2);
      const sizeInMB = (sizeInBytes / (1024 * 1024)).toFixed(2);
      
      if (sizeInBytes < 1024) {
        return `${sizeInBytes} bytes`;
      } else if (sizeInBytes < 1024 * 1024) {
        return `${sizeInKB} KB`;
      } else {
        return `${sizeInMB} MB`;
      }
    } catch (error) {
      console.error('Error calculating storage size:', error);
      return 'Unknown';
    }
  }

  static deleteDesign(platform: string, format: { name: string; width: number; height: number }): boolean {
    try {
      const storage = this.loadStorage();
      const platformKey = platform.toLowerCase();
      const formatKey = this.getPlatformFormatKey(platform, format);
      
      if (storage[platformKey] && storage[platformKey][formatKey]) {
        delete storage[platformKey][formatKey];
        
        // Clean up empty platform entries
        if (Object.keys(storage[platformKey]).length === 0) {
          delete storage[platformKey];
        }
        
        this.saveStorage(storage);
        console.log(`🗑️ Deleted design: ${platform} - ${format.name}`);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error deleting design:', error);
      return false;
    }
  }
} 