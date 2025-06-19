import React, { createContext, useContext, useState, useEffect } from 'react';
// import { brandAPI } from '../lib/directus'; // COMMENTED OUT - Using Supabase directly
import { brandAPI } from '../lib/supabase'; // Using Supabase directly
import { useAuth } from './AuthContext';

interface Color {
  name: string;
  hex: string;
}

interface Font {
  name: string;
  url: string;
  family: string;
}

interface BrandAssets {
  colors: Color[];
  fonts: Font[];
  logo?: string;
}

interface BrandContextType {
  brandAssets: BrandAssets;
  currentBrandId: string | null;
  addColor: (color: Color) => void;
  removeColor: (name: string) => void;
  addFont: (font: Font) => void;
  removeFont: (name: string) => void;
  setLogo: (url: string) => void;
  saveBrandToSupabase: () => Promise<void>; // Using Supabase directly
  loadBrandFromSupabase: () => Promise<void>; // Using Supabase directly
}

const BrandContext = createContext<BrandContextType | undefined>(undefined);

const defaultBrandAssets: BrandAssets = {
  colors: [
    // Provide some starter colors for guests
    { name: 'Koech Red', hex: '#ff4940' },
    { name: 'Koech Navy', hex: '#002e51' },
    { name: 'Koech Blue', hex: '#004080' },
  ],
  fonts: [
    { name: 'Inter', url: '', family: 'Inter, sans-serif' },
    { name: 'Roboto', url: '', family: 'Roboto, sans-serif' },
    { name: 'Poppins', url: '', family: 'Poppins, sans-serif' },
  ],
};

// Load brand assets from localStorage
const loadBrandAssets = (): BrandAssets => {
  try {
    const saved = localStorage.getItem('brandAssets');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...defaultBrandAssets,
        ...parsed,
        // Ensure colors is always an array
        colors: Array.isArray(parsed.colors) ? parsed.colors : [],
      };
    }
  } catch (error) {
    console.error('Error loading brand assets from localStorage:', error);
  }
  return defaultBrandAssets;
};

// Save brand assets to localStorage
const saveBrandAssets = (assets: BrandAssets) => {
  try {
    localStorage.setItem('brandAssets', JSON.stringify(assets));
  } catch (error) {
    console.error('Error saving brand assets to localStorage:', error);
  }
};

export function BrandProvider({ children }: { children: React.ReactNode }) {
  const [brandAssets, setBrandAssets] = useState<BrandAssets>(loadBrandAssets);
  const [currentBrandId, setCurrentBrandId] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();

  // Save to localStorage whenever brandAssets changes
  useEffect(() => {
    saveBrandAssets(brandAssets);
  }, [brandAssets]);

  // Load brand data from Supabase when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      loadBrandFromSupabase();
      
      // Check for pending brand data from signup
      const pendingBrandData = localStorage.getItem('pendingBrandData');
      if (pendingBrandData) {
        try {
          const brandData = JSON.parse(pendingBrandData);
          setBrandAssets(prev => ({
            ...prev,
            colors: brandData.colors || [],
            fonts: brandData.fonts || prev.fonts,
            logo: brandData.logo || prev.logo
          }));
          
          // Save to Supabase immediately
          setTimeout(() => {
            saveBrandToSupabase();
          }, 1000);
          
          // Clear pending data
          localStorage.removeItem('pendingBrandData');
          console.log('✅ [BRAND] Pending brand data applied:', brandData);
        } catch (error) {
          console.error('🔴 [BRAND] Failed to parse pending brand data:', error);
          localStorage.removeItem('pendingBrandData');
        }
      }
    }
  }, [isAuthenticated, user]);

  const addColor = (color: Color) => {
    setBrandAssets(prev => ({
      ...prev,
      colors: [...prev.colors, color],
    }));
    
    // Show helpful tip for guest users
    if (!isAuthenticated && typeof window !== 'undefined') {
      setTimeout(() => {
        const notification = document.createElement('div');
        notification.className = 'fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 text-sm max-w-xs text-center';
        notification.innerHTML = '💡 Brand color added for this session! <br/><span class="text-xs opacity-80">Sign up to save permanently</span>';
        document.body.appendChild(notification);
        
        setTimeout(() => {
          if (notification.parentNode) {
            document.body.removeChild(notification);
          }
        }, 3000);
      }, 100);
    }
  };

  const removeColor = (name: string) => {
    setBrandAssets(prev => ({
      ...prev,
      colors: prev.colors.filter(c => c.name !== name),
    }));
  };

  const addFont = (font: Font) => {
    setBrandAssets(prev => ({
      ...prev,
      fonts: [...prev.fonts, font],
    }));
  };

  const removeFont = (name: string) => {
    setBrandAssets(prev => ({
      ...prev,
      fonts: prev.fonts.filter(f => f.name !== name),
    }));
  };

  const setLogo = (url: string) => {
    setBrandAssets(prev => ({
      ...prev,
      logo: url,
    }));
  };

  const saveBrandToSupabase = async () => {
    if (!user) return;

    try {
      const brandData = {
        user_id: user.id,
        name: 'Default Brand', // You can make this configurable
        colors: brandAssets.colors,
        fonts: brandAssets.fonts,
        logo: brandAssets.logo
      };

      if (currentBrandId) {
        // Update existing brand
        const result = await brandAPI.update(currentBrandId, brandData);
        if (!result.success) {
          console.error('Failed to update brand:', result.error);
        }
      } else {
        // Create new brand
        const result = await brandAPI.create(brandData);
        if (result.success && result.brand) {
          setCurrentBrandId(result.brand.id);
        } else {
          console.error('Failed to create brand:', result.error);
        }
      }
    } catch (error) {
      console.error('Failed to save brand to Supabase:', error);
    }
  };

  const loadBrandFromSupabase = async () => {
    if (!user) return;

    try {
      const result = await brandAPI.getByUserId(user.id);
      if (result.success && result.brands && result.brands.length > 0) {
        const brand = result.brands[0]; // Use the first brand for now
        setCurrentBrandId(brand.id);
        setBrandAssets({
          colors: brand.colors || [],
          fonts: brand.fonts || defaultBrandAssets.fonts,
          logo: brand.logo
        });
      }
    } catch (error) {
      console.error('Failed to load brand from Supabase:', error);
    }
  };

  return (
    <BrandContext.Provider value={{
      brandAssets,
      currentBrandId,
      addColor,
      removeColor,
      addFont,
      removeFont,
      setLogo,
      saveBrandToSupabase,
      loadBrandFromSupabase,
    }}>
      {children}
    </BrandContext.Provider>
  );
}

export function useBrand() {
  const context = useContext(BrandContext);
  if (context === undefined) {
    throw new Error('useBrand must be used within a BrandProvider');
  }
  return context;
}