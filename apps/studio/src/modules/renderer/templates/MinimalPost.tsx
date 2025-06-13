import React from 'react';
import { Brand, TemplateContent, Platform } from '../types';

interface MinimalPostProps {
  brand: Brand;
  content: TemplateContent;
  platform: Platform;
  width: number;
  height: number;
}

export function MinimalPost({ brand, content, platform, width, height }: MinimalPostProps) {
  const { colors, fonts } = brand;
  
  return (
    <div 
      style={{
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: colors.background || '#ffffff',
        fontFamily: fonts.primary || 'Inter, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '60px',
        position: 'relative',
      }}
    >
      {/* Brand Logo */}
      {brand.logo && (
        <div 
          style={{
            position: 'absolute',
            top: '40px',
            right: '40px',
            width: '60px',
            height: '60px',
          }}
        >
          <img 
            src={brand.logo} 
            alt={brand.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
            }}
          />
        </div>
      )}

      {/* Main Content */}
      <div style={{ textAlign: 'center', maxWidth: '80%' }}>
        {content.title && (
          <h1 
            style={{
              fontSize: platform === 'tiktok' ? '72px' : '64px',
              fontWeight: '700',
              color: colors.primary,
              marginBottom: '24px',
              lineHeight: '1.2',
            }}
          >
            {content.title as string}
          </h1>
        )}
        
        {content.subtitle && (
          <p 
            style={{
              fontSize: platform === 'tiktok' ? '32px' : '28px',
              color: colors.secondary || '#666666',
              lineHeight: '1.4',
              fontWeight: '400',
            }}
          >
            {content.subtitle as string}
          </p>
        )}
      </div>

      {/* Bottom Accent */}
      <div 
        style={{
          position: 'absolute',
          bottom: '0',
          left: '0',
          right: '0',
          height: '8px',
          backgroundColor: colors.accent || colors.primary,
        }}
      />
    </div>
  );
} 