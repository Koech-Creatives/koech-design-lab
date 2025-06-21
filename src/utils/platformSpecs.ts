export const PlatformSpecs = {
  instagram: {
    name: 'Instagram',
    formats: [
      { name: 'Square', width: 1080, height: 1080 },
      { name: 'Portrait', width: 1080, height: 1350 },
      { name: 'Story', width: 1080, height: 1920 },
      { name: 'Reel', width: 1080, height: 1920 },
    ],
    safeZone: {
      marginPercentage: 0.1,
      color: '#ff4940',
    },
  },
  linkedin: {
    name: 'LinkedIn',
    formats: [
      { name: 'Landscape', width: 1200, height: 627 },
      { name: 'Square', width: 1080, height: 1080 },
      { name: 'Vertical', width: 1080, height: 1350 },
    ],
    safeZone: {
      marginPercentage: 0.08,
      color: '#0077b5',
    },
  },
  twitter: {
    name: 'Twitter/X',
    formats: [
      { name: 'Landscape', width: 1200, height: 675 },
      { name: 'Square', width: 1080, height: 1080 },
      { name: 'Portrait', width: 1080, height: 1350 },
    ],
    safeZone: {
      marginPercentage: 0.12,
      color: '#1da1f2',
    },
  },
  tiktok: {
    name: 'TikTok',
    formats: [
      { name: 'Vertical', width: 1080, height: 1920 },
      { name: 'Square', width: 1080, height: 1080 },
    ],
    safeZone: {
      marginPercentage: 0.15,
      color: '#fe2c55',
    },
  },
};

export const getOptimalFormat = (platform: string, content: 'single' | 'carousel' = 'single') => {
  const specs = PlatformSpecs[platform as keyof typeof PlatformSpecs];
  if (!specs) return PlatformSpecs.instagram.formats[0];
  
  // Return most commonly used format for each platform
  switch (platform) {
    case 'instagram':
      return content === 'carousel' ? specs.formats[0] : specs.formats[1];
    case 'linkedin':
      return specs.formats[0];
    case 'twitter':
      return specs.formats[0];
    case 'tiktok':
      return specs.formats[0];
    default:
      return specs.formats[0];
  }
};