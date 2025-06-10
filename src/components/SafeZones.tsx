import React from 'react';

interface SafeZonesProps {
  format: {
    width: number;
    height: number;
    name: string;
  };
  platform: string;
}

export function SafeZones({ format, platform }: SafeZonesProps) {
  const getSafeZone = () => {
    // Define safe zones for different platforms
    const safeZones = {
      instagram: {
        marginPercentage: 0.1, // 10% margin from edges
        color: 'rgba(168, 85, 247, 0.2)', // Purple
      },
      linkedin: {
        marginPercentage: 0.08,
        color: 'rgba(59, 130, 246, 0.2)', // Blue
      },
      twitter: {
        marginPercentage: 0.12,
        color: 'rgba(156, 163, 175, 0.2)', // Gray
      },
      tiktok: {
        marginPercentage: 0.15,
        color: 'rgba(239, 68, 68, 0.2)', // Red
      },
    };

    return safeZones[platform as keyof typeof safeZones] || safeZones.instagram;
  };

  const safeZone = getSafeZone();
  const margin = Math.min(format.width, format.height) * safeZone.marginPercentage;

  return (
    <>
      {/* Safe Zone Overlay */}
      <div
        className="absolute border-2 border-dashed pointer-events-none"
        style={{
          top: `${margin}px`,
          left: `${margin}px`,
          right: `${margin}px`,
          bottom: `${margin}px`,
          borderColor: safeZone.color.replace('0.2', '0.5'),
        }}
      />
      
      {/* Corner Guidelines */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-gray-400 opacity-30" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-gray-400 opacity-30" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-gray-400 opacity-30" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-gray-400 opacity-30" />
      
      {/* Center Guidelines */}
      <div
        className="absolute border-l border-dashed border-gray-400 opacity-20"
        style={{
          left: '50%',
          top: '0',
          bottom: '0',
          transform: 'translateX(-50%)',
        }}
      />
      <div
        className="absolute border-t border-dashed border-gray-400 opacity-20"
        style={{
          top: '50%',
          left: '0',
          right: '0',
          transform: 'translateY(-50%)',
        }}
      />
    </>
  );
}