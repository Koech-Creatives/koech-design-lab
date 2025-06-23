import React, { useState, useEffect } from 'react';
import { Download, Undo, Redo, Menu, X, Palette, Settings, Folder, Layout, Info, Share, ChevronDown, Archive } from 'lucide-react';
import { useCanvas } from '../contexts/CanvasContext';
import { useBrand } from '../contexts/BrandContext';
import { useProject } from '../contexts/ProjectContext';
import { useAuth } from '../contexts/AuthContext';
import { useBackground } from '../contexts/BackgroundContext';
import { useGuest } from '../contexts/GuestContext';
import { SettingsModal } from './SettingsModal';
import { SavedDesignsModal } from './SavedDesignsModal';
import html2canvas from 'html2canvas';

interface HeaderProps {
  selectedPlatform: string;
  onPlatformChange: (platform: string) => void;
  onOpenProjects: () => void;
  onOpenTemplates: () => void;
}

const platforms = [
  { id: 'instagram', name: 'Instagram', color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
  { id: 'linkedin', name: 'LinkedIn', color: 'bg-blue-600' },
  { id: 'twitter', name: 'Twitter/X', color: 'bg-black' },
  { id: 'tiktok', name: 'TikTok', color: 'bg-gradient-to-r from-cyan-500 to-black-500 to-pink-500' },
];

export function Header({ 
  selectedPlatform, 
  onPlatformChange,
  onOpenProjects,
  onOpenTemplates
}: HeaderProps) {
  const { elements, undo, redo, canUndo, canRedo } = useCanvas();
  const { saveBrandToSupabase } = useBrand();
  const { saveProject } = useProject();
  const { user, logout, isAuthenticated } = useAuth();
  const { canvasBackgroundColor } = useBackground();
  const { promptForAuth } = useGuest();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoMenuOpen, setLogoMenuOpen] = useState(false);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const [savedDesignsModalOpen, setSavedDesignsModalOpen] = useState(false);

  // Auto-save functionality
  useEffect(() => {
    const autoSave = async () => {
      if (elements.length > 0) {
        const designData = {
          platform: selectedPlatform,
          elements: elements,
          timestamp: new Date().toISOString(),
        };
        
        localStorage.setItem('currentDesign', JSON.stringify(designData));
        
        // Save both brand and project data to Supabase
        try {
          await Promise.all([
            saveBrandToSupabase(),
            saveProject()
          ]);
        } catch (error) {
          console.log('Auto-save error:', error);
        }
      }
    };

    // Auto-save every 30 seconds
    const interval = setInterval(autoSave, 30000);
    
    // Also auto-save when elements change (debounced)
    const timeoutId = setTimeout(autoSave, 2000);
    
    return () => {
      clearInterval(interval);
      clearTimeout(timeoutId);
    };
  }, [elements, selectedPlatform, saveBrandToSupabase, saveProject]);

  const exportCanvas = async (format: 'png' | 'jpg' | 'pdf' | 'svg' = 'png') => {
    // Check if canvas is empty (no elements)
    if (elements.length === 0) {
      showNotification('Cannot export empty canvas. Add some elements first!', '#dc2626');
      setExportMenuOpen(false);
      return;
    }

    const canvasElement = document.querySelector('[data-canvas="true"]') as HTMLElement;
    if (!canvasElement) {
      showNotification('Canvas not found. Please try again.', '#dc2626');
      setExportMenuOpen(false);
      return;
    }
    
    try {
      let fileName = `${selectedPlatform}-design-${Date.now()}`;
      
      // Show loading notification
      showNotification('Preparing export...', '#003a63');
      
      if (format === 'svg') {
        // Enhanced SVG export
        const svgContent = await generateSVG(canvasElement);
        const blob = new Blob([svgContent], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `${fileName}.svg`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
      } else {
        // Enhanced PNG/JPG/PDF export using html2canvas
        
        // Temporarily hide all UI elements that shouldn't be in export
        const elementsToHide = canvasElement.querySelectorAll(
          '.ring-2, .ring-red-500, .absolute.bg-red-500, .absolute.-top-10, ' +
          '.group-hover\\:opacity-100, .opacity-0, [class*="hover:"], ' +
          '.resize-handle, .selection-controls, .element-controls'
        );
        
        const originalStyles: { element: HTMLElement; display: string; opacity: string }[] = [];
        
        elementsToHide.forEach(el => {
          const htmlEl = el as HTMLElement;
          originalStyles.push({
            element: htmlEl,
            display: htmlEl.style.display,
            opacity: htmlEl.style.opacity
          });
          htmlEl.style.display = 'none';
          htmlEl.style.opacity = '0';
        });
        
        // Also hide any editing states
        const editingElements = canvasElement.querySelectorAll('[contenteditable="true"]');
        editingElements.forEach(el => {
          (el as HTMLElement).blur();
        });
        
        // Wait a moment for any animations to complete
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const canvas = await html2canvas(canvasElement, {
          backgroundColor: format === 'jpg' ? '#ffffff' : (canvasBackgroundColor || 'transparent'),
          scale: format === 'pdf' ? 3 : 2, // Higher resolution for PDF
          useCORS: true,
          allowTaint: true,
          logging: false,
          width: canvasElement.offsetWidth,
          height: canvasElement.offsetHeight,
          ignoreElements: (element) => {
            // Additional filter for elements to ignore
            return element.classList.contains('ring-2') || 
                   element.classList.contains('selection-indicator') ||
                   element.classList.contains('resize-handle');
          }
        });
        
        // Restore original styles
        originalStyles.forEach(({ element, display, opacity }) => {
          element.style.display = display;
          element.style.opacity = opacity;
        });
        
        const link = document.createElement('a');
        link.download = `${fileName}.${format === 'pdf' ? 'png' : format}`;
        link.href = canvas.toDataURL(`image/${format === 'pdf' ? 'png' : format}`, format === 'jpg' ? 0.9 : 1.0);
        link.click();
        
        if (format === 'pdf') {
          showNotification('PDF export coming soon! Exported as high-res PNG for now.', '#003a63');
        }
      }
      
      setExportMenuOpen(false);
      showNotification(`Design exported as ${format.toUpperCase()}!`, '#10b981');
      
    } catch (error) {
      console.error('Export failed:', error);
      showNotification('Export failed. Please try again.', '#dc2626');
      setExportMenuOpen(false);
    }
  };

  const generateSVG = async (canvasElement: HTMLElement): Promise<string> => {
    const width = canvasElement.offsetWidth;
    const height = canvasElement.offsetHeight;
    
    let svgElements = '';
    
    // Generate SVG elements from canvas elements
    elements.forEach(element => {
      switch (element.type) {
        case 'text':
          const fontSize = element.fontSize || 18;
          const fontFamily = element.fontFamily || 'Arial, sans-serif';
          const color = element.color || '#000000';
          const textAlign = element.textAlign || 'left';
          
          let textAnchor = 'start';
          let x = element.x;
          if (textAlign === 'center') {
            textAnchor = 'middle';
            x = element.x + element.width / 2;
          } else if (textAlign === 'right') {
            textAnchor = 'end';
            x = element.x + element.width;
          }
          
          svgElements += `
            <text x="${x}" y="${element.y + fontSize}" 
                  font-family="${fontFamily}" 
                  font-size="${fontSize}" 
                  fill="${color}"
                  text-anchor="${textAnchor}"
                  font-weight="${element.fontWeight || 'normal'}"
                  font-style="${element.fontStyle || 'normal'}"
                  text-decoration="${element.textDecoration || 'none'}">
              ${escapeXml(element.content || '')}
            </text>`;
          break;
          
        case 'rectangle':
        case 'square':
          svgElements += `
            <rect x="${element.x}" y="${element.y}" 
                  width="${element.width}" height="${element.height}" 
                  fill="${element.backgroundColor || element.color || '#000000'}"
                  rx="${element.borderRadius || 0}"/>`;
          break;
          
        case 'circle':
          const radius = Math.min(element.width, element.height) / 2;
          const cx = element.x + element.width / 2;
          const cy = element.y + element.height / 2;
          svgElements += `
            <circle cx="${cx}" cy="${cy}" r="${radius}" 
                    fill="${element.backgroundColor || element.color || '#000000'}"/>`;
          break;
          
        case 'line':
          svgElements += `
            <line x1="${element.x}" y1="${element.y + element.height / 2}" 
                  x2="${element.x + element.width}" y2="${element.y + element.height / 2}" 
                  stroke="${element.backgroundColor || element.color || '#000000'}" 
                  stroke-width="${element.height || 2}"/>`;
          break;
          
        case 'image':
          // For images, we'll add a placeholder rectangle for now
          svgElements += `
            <rect x="${element.x}" y="${element.y}" 
                  width="${element.width}" height="${element.height}" 
                  fill="#f0f0f0" stroke="#ccc" stroke-width="1"/>
            <text x="${element.x + element.width / 2}" y="${element.y + element.height / 2}" 
                  text-anchor="middle" dominant-baseline="middle" 
                  font-size="12" fill="#666">Image</text>`;
          break;
          
        default:
          // Generic shape
          svgElements += `
            <rect x="${element.x}" y="${element.y}" 
                  width="${element.width}" height="${element.height}" 
                  fill="${element.backgroundColor || element.color || '#000000'}"/>`;
      }
    });
    
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="${canvasBackgroundColor || '#ffffff'}"/>
  ${svgElements}
</svg>`;
  };

  const escapeXml = (unsafe: string): string => {
    return unsafe.replace(/[<>&'"]/g, (c) => {
      switch (c) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case "'": return '&apos;';
        case '"': return '&quot;';
        default: return c;
      }
    });
  };

  const showNotification = (message: string, color: string) => {
    const notification = document.createElement('div');
    notification.className = 'fixed top-16 right-4 text-white px-3 py-1.5 rounded text-sm shadow-lg z-50';
    notification.style.backgroundColor = color;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (notification.parentNode) {
        document.body.removeChild(notification);
      }
    }, 3000);
  };

  const handlePost = () => {
    // Require authentication for posting
    if (!isAuthenticated) {
      promptForAuth('post to social media');
      return;
    }
    
    // Coming soon functionality
    showNotification('Post feature coming soon!', '#003a63');
  };

  const handleLogout = async () => {
    await logout();
    setLogoMenuOpen(false);
  };

  const exportOptions = [
    { format: 'png' as const, label: 'PNG (Transparent)', description: 'Best for web, transparent background' },
    { format: 'jpg' as const, label: 'JPG (Compressed)', description: 'Smaller file size, white background' },
    { format: 'svg' as const, label: 'SVG (Vector)', description: 'Scalable vector format, perfect quality' },
    { format: 'pdf' as const, label: 'PDF (Print)', description: 'High quality for printing (coming soon)' },
  ];

  const AboutModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setAboutModalOpen(false)}>
      <div className="rounded-lg p-6 w-96 max-w-[90vw]" style={{ backgroundColor: '#002e51', border: '1px solid #004080' }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">About Koech Design Lab</h2>
          <button 
            onClick={() => setAboutModalOpen(false)}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-3 text-sm text-gray-300">
          <div className="flex items-center space-x-2">
            <Palette className="w-5 h-5" style={{ color: '#ff4940' }} />
            <div>
              <p className="text-white font-medium">Koech Design Lab</p>
              <p className="text-xs">by Koech Creatives</p>
            </div>
          </div>
          <div className="pt-2 border-t" style={{ borderColor: '#004080' }}>
            <p>A modern design platform for creating stunning social media graphics.</p>
            <p className="mt-2">Build beautiful designs for Instagram, LinkedIn, Twitter/X, and TikTok with our intuitive tools.</p>
          </div>
          <div className="pt-2 border-t text-xs" style={{ borderColor: '#004080' }}>
            <div className="flex items-center space-x-2">
              <span 
                className="px-2 py-1 rounded-full font-medium"
                style={{ backgroundColor: '#ff4940', color: 'white' }}
              >
                BETA
              </span>
              <span className="text-gray-400">Version 0.1.0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="sticky top-0 left-0 right-0 z-50 border-b shadow-sm" style={{ backgroundColor: '#002e51', borderColor: '#004080' }}>
      {/* Desktop Header */}
      <div className="hidden md:flex items-center justify-between px-4 py-2">
        {/* Left - Logo Only */}
        <div className="flex items-center">
          {/* Logo Menu */}
          <div className="relative">
            <button
              onClick={() => setLogoMenuOpen(!logoMenuOpen)}
              className="flex items-center space-x-2 p-1 rounded hover:opacity-80 transition-opacity"
            >
              <img 
                src="/logo.png" 
                alt="Logo" 
                className="w-8 h-8 rounded-full"
                onError={(e) => {
                  // Fallback to icon if image not found
                  e.currentTarget.style.display = 'none';
                  const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                  if (nextElement) {
                    nextElement.style.display = 'block';
                  }
                }}
              />
              <Palette className="w-6 h-6 hidden" style={{ color: '#ff4940' }} />
              <div className="flex items-center space-x-1.5">
                <a 
                  href="https://koech-labs.onrender.com/" 
                  className="text-s font-bold text-white opacity-60 hover:opacity-80 transition-opacity"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Back to Koech Labs"
                >
                  Frames
                </a>
                <span 
                  className="px-1.5 py-0.5 text-xs font-medium rounded-full"
                  style={{ 
                    backgroundColor: '#ff4940', 
                    color: 'white' 
                  }}
                >
                  BETA
                </span>
              </div>
            </button>
            
            {logoMenuOpen && (
              <div className="absolute left-0 top-full mt-1 w-48 rounded-md shadow-lg py-1 z-50" style={{ backgroundColor: '#002e51', border: '1px solid #004080' }}>
                <a
                  href="https://koech-labs.onrender.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-left px-3 py-2 text-xs text-gray-300 hover:text-white flex items-center space-x-2"
                  onClick={() => setLogoMenuOpen(false)}
                >
                  <Share className="w-3.5 h-3.5" />
                  <span>← Back to Koech Labs</span>
                </a>
                <div className="border-t border-gray-600 my-1"></div>
                <button
                  onClick={() => {
                    onOpenProjects();
                    setLogoMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-gray-300 hover:text-white flex items-center space-x-2"
                >
                  <Folder className="w-3.5 h-3.5" />
                  <span>Projects</span>
                </button>
                <button
                  onClick={() => {
                    onOpenTemplates();
                    setLogoMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-gray-300 hover:text-white flex items-center space-x-2"
                >
                  <Layout className="w-3.5 h-3.5" />
                  <span>Templates</span>
                </button>
                <button
                  onClick={() => {
                    setSavedDesignsModalOpen(true);
                    setLogoMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-gray-300 hover:text-white flex items-center space-x-2"
                >
                  <Archive className="w-3.5 h-3.5" />
                  <span>Saved Designs</span>
                </button>
                <button
                  onClick={() => {
                    setSettingsModalOpen(true);
                    setLogoMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-gray-300 hover:text-white flex items-center space-x-2"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Settings</span>
                </button>
                <button
                  onClick={() => {
                    setAboutModalOpen(true);
                    setLogoMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-gray-300 hover:text-white flex items-center space-x-2"
                >
                  <Info className="w-3.5 h-3.5" />
                  <span>About</span>
                </button>
                {user && (
                  <>
                    <div className="border-t my-1" style={{ borderColor: '#004080' }}></div>
                    <div className="px-3 py-2 text-xs text-gray-400">
                      {user.email}
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-xs text-gray-300 hover:text-white"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Center - Social Media Platforms */}
        <div className="flex items-center space-x-1">
          {platforms.map((platform) => (
            <button
              key={platform.id}
              onClick={() => onPlatformChange(platform.id)}
              className={`px-2.5 py-1.5 rounded text-xs font-medium transition-all duration-200 ${
                selectedPlatform === platform.id
                  ? `${platform.color} text-white shadow-md`
                  : 'text-gray-300 hover:text-white'
              }`}
              style={selectedPlatform !== platform.id ? { backgroundColor: '#003a63' } : {}}
            >
              {platform.name}
            </button>
          ))}
        </div>

        {/* Right - Guest Badge, Undo/Redo, Post, Export */}
        <div className="flex items-center space-x-1.5">
          {/* Guest Mode Indicator */}
          {!isAuthenticated && (
            <div className="px-2 py-1 rounded-full text-xs font-medium bg-blue-600 text-white">
              Guest Mode
            </div>
          )}
          <button 
            onClick={undo}
            disabled={!canUndo}
            className={`p-1.5 rounded transition-colors ${
              canUndo 
                ? 'text-white hover:opacity-80' 
                : 'text-gray-500 cursor-not-allowed'
            }`}
            style={canUndo ? { backgroundColor: '#003a63' } : { backgroundColor: '#002447' }}
            title="Undo"
          >
            <Undo className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={redo}
            disabled={!canRedo}
            className={`p-1.5 rounded transition-colors ${
              canRedo 
                ? 'text-white hover:opacity-80' 
                : 'text-gray-500 cursor-not-allowed'
            }`}
            style={canRedo ? { backgroundColor: '#003a63' } : { backgroundColor: '#002447' }}
            title="Redo"
          >
            <Redo className="w-3.5 h-3.5" />
          </button>
          <div className="relative">
            <button 
              onClick={handlePost}
              className="px-2 py-1.5 rounded transition-colors flex items-center space-x-1 text-white hover:opacity-80"
              style={{ backgroundColor: '#003a63' }}
              title="Post to social media - Coming Soon!"
            >
              <Share className="w-3.5 h-3.5" />
              <span className="text-xs">Post</span>
            </button>
          </div>
          
          {/* Enhanced Export Button with Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setExportMenuOpen(!exportMenuOpen)}
              className="px-2 py-1.5 rounded transition-colors flex items-center space-x-1 text-white hover:opacity-80"
              style={{ backgroundColor: '#ff4940' }}
            >
              <Download className="w-3.5 h-3.5" />
              <span className="text-xs">Export</span>
              <ChevronDown className="w-3 h-3" />
            </button>
            
            {exportMenuOpen && (
              <div className="absolute right-0 top-full mt-1 w-64 rounded-md shadow-lg py-1 z-50" style={{ backgroundColor: '#002e51', border: '1px solid #004080' }}>
                {elements.length === 0 && (
                  <div className="px-3 py-2 text-xs text-gray-400 border-b border-gray-600">
                    <span className="font-medium text-red-400">⚠️ Canvas is empty</span>
                    <div className="text-xs mt-1">Add elements to enable export</div>
                  </div>
                )}
                {exportOptions.map((option) => (
                  <button
                    key={option.format}
                    onClick={() => exportCanvas(option.format)}
                    disabled={elements.length === 0}
                    className={`w-full text-left px-3 py-2 text-xs transition-colors ${
                      elements.length === 0 
                        ? 'text-gray-500 cursor-not-allowed opacity-50' 
                        : 'text-gray-300 hover:text-white hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{option.label}</span>
                      <span className="text-xs opacity-75">{option.description}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between px-4 py-2">
        {/* Left - Logo */}
        <div className="relative">
          <button
            onClick={() => setLogoMenuOpen(!logoMenuOpen)}
            className="flex items-center space-x-2"
          >
            <img 
              src="/logo.png" 
              alt="Logo" 
              className="w-8 h-8 rounded-full"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                if (nextElement) {
                  nextElement.style.display = 'block';
                }
              }}
            />
            <Palette className="w-6 h-6 hidden" style={{ color: '#ff4940' }} />
            <div className="flex items-center space-x-1">
              <a 
                href="https://koech-labs.onrender.com/" 
                className="text-xs font-bold text-white opacity-60 hover:opacity-80 transition-opacity"
                title="Back to Koech Labs"
              >
                Frames
              </a>
              <span 
                className="px-1 py-0.5 text-xs font-medium rounded-full"
                style={{ 
                  backgroundColor: '#ff4940', 
                  color: 'white' 
                }}
              >
                BETA
              </span>
            </div>
          </button>
          
          {logoMenuOpen && (
            <div className="absolute left-0 top-full mt-1 w-48 rounded-md shadow-lg py-1 z-50" style={{ backgroundColor: '#002e51', border: '1px solid #004080' }}>
              <a
                href="https://koechlabs.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-left px-3 py-2 text-xs text-gray-300 hover:text-white flex items-center space-x-2"
                onClick={() => setLogoMenuOpen(false)}
              >
                <Share className="w-3.5 h-3.5" />
                <span>← Back to Koech Labs</span>
              </a>
              <div className="border-t border-gray-600 my-1"></div>
              <button
                onClick={() => {
                  onOpenProjects();
                  setLogoMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-xs text-gray-300 hover:text-white flex items-center space-x-2"
              >
                <Folder className="w-3.5 h-3.5" />
                <span>Projects</span>
              </button>
              <button
                onClick={() => {
                  onOpenTemplates();
                  setLogoMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-xs text-gray-300 hover:text-white flex items-center space-x-2"
              >
                <Layout className="w-3.5 h-3.5" />
                <span>Templates</span>
              </button>
              <button
                onClick={() => {
                  setSettingsModalOpen(true);
                  setLogoMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-xs text-gray-300 hover:text-white flex items-center space-x-2"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Settings</span>
              </button>
              <button
                onClick={() => {
                  setAboutModalOpen(true);
                  setLogoMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-xs text-gray-300 hover:text-white flex items-center space-x-2"
              >
                <Info className="w-3.5 h-3.5" />
                <span>About</span>
              </button>
              {user && (
                <>
                  <div className="border-t my-1" style={{ borderColor: '#004080' }}></div>
                  <div className="px-3 py-2 text-xs text-gray-400">
                    {user.email}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-xs text-gray-300 hover:text-white"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          )}
        </div>
        
        {/* Right - Controls and Menu */}
        <div className="flex items-center space-x-1">
          <button 
            onClick={undo}
            disabled={!canUndo}
            className={`p-1.5 rounded transition-colors ${
              canUndo 
                ? 'text-white hover:opacity-80' 
                : 'text-gray-500 cursor-not-allowed'
            }`}
            style={canUndo ? { backgroundColor: '#003a63' } : { backgroundColor: '#002447' }}
            title="Undo"
          >
            <Undo className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={redo}
            disabled={!canRedo}
            className={`p-1.5 rounded transition-colors ${
              canRedo 
                ? 'text-white hover:opacity-80' 
                : 'text-gray-500 cursor-not-allowed'
            }`}
            style={canRedo ? { backgroundColor: '#003a63' } : { backgroundColor: '#002447' }}
            title="Redo"
          >
            <Redo className="w-3.5 h-3.5" />
          </button>
          <div className="relative">
            <button 
              onClick={handlePost}
              className="p-1.5 rounded transition-colors text-white hover:opacity-80"
              style={{ backgroundColor: '#003a63' }}
              title="Post - Coming Soon!"
            >
              <Share className="w-3.5 h-3.5" />
            </button>
          </div>
          <button 
            onClick={() => exportCanvas('png')}
            disabled={elements.length === 0}
            className={`p-1.5 rounded transition-colors ${
              elements.length === 0 
                ? 'text-gray-500 cursor-not-allowed opacity-50' 
                : 'text-white hover:opacity-80'
            }`}
            style={{ 
              backgroundColor: elements.length === 0 ? '#666666' : '#ff4940' 
            }}
            title={elements.length === 0 ? "Add elements to enable export" : "Export as PNG"}
          >
            <Download className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded transition-colors text-white hover:opacity-80"
            style={{ backgroundColor: '#003a63' }}
          >
            {mobileMenuOpen ? <X className="w-3.5 h-3.5" /> : <Menu className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t" style={{ backgroundColor: '#002e51', borderColor: '#004080' }}>
          <div className="px-4 py-2">
            <div className="space-y-1">
              {platforms.map((platform) => (
                <button
                  key={platform.id}
                  onClick={() => {
                    onPlatformChange(platform.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-2 py-1.5 rounded text-xs font-medium transition-all duration-200 ${
                    selectedPlatform === platform.id
                      ? `${platform.color} text-white`
                      : 'text-gray-300 hover:text-white'
                  }`}
                  style={selectedPlatform !== platform.id ? { backgroundColor: '#003a63' } : {}}
                >
                  {platform.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {settingsModalOpen && (
        <SettingsModal 
          isOpen={settingsModalOpen} 
          onClose={() => setSettingsModalOpen(false)} 
        />
      )}

      {/* About Modal */}
      {aboutModalOpen && <AboutModal />}

      {/* Saved Designs Modal */}
      <SavedDesignsModal 
        isOpen={savedDesignsModalOpen}
        onClose={() => setSavedDesignsModalOpen(false)}
        onLoadDesign={(platform: string, format: string) => {
          // Switch to the requested platform and format
          onPlatformChange(platform);
          // The canvas will automatically load the elements when platform/format changes
        }}
      />
    </div>
  );
}