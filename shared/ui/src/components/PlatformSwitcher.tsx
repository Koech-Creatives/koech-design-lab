import React from 'react';

type Platform = 'instagram' | 'linkedin' | 'twitter' | 'tiktok';

interface PlatformOption {
  id: Platform;
  name: string;
  dimensions: string;
  icon: string;
}

const PLATFORMS: PlatformOption[] = [
  { id: 'instagram', name: 'Instagram', dimensions: '1080×1350', icon: '📸' },
  { id: 'linkedin', name: 'LinkedIn', dimensions: '1200×627', icon: '💼' },
  { id: 'twitter', name: 'Twitter', dimensions: '1600×900', icon: '🐦' },
  { id: 'tiktok', name: 'TikTok', dimensions: '1080×1920', icon: '🎵' },
];

interface PlatformSwitcherProps {
  selected: Platform;
  onChange: (platform: Platform) => void;
  className?: string;
}

export function PlatformSwitcher({ selected, onChange, className = '' }: PlatformSwitcherProps) {
  return (
    <div className={`flex bg-gray-100 rounded-lg p-1 ${className}`}>
      {PLATFORMS.map((platform) => (
        <button
          key={platform.id}
          onClick={() => onChange(platform.id)}
          className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            selected === platform.id
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex flex-col items-center space-y-1">
            <span className="text-lg">{platform.icon}</span>
            <span className="font-medium">{platform.name}</span>
            <span className="text-xs text-gray-500">{platform.dimensions}</span>
          </div>
        </button>
      ))}
    </div>
  );
} 