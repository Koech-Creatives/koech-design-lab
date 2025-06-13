export interface PlaceholderImageOptions {
  width?: number;
  height?: number;
  backgroundColor?: string;
  textColor?: string;
  text?: string;
  font?: string;
}

/**
 * Generate a placeholder image URL with fallback support
 * Uses placehold.co as primary service with fallback to local images
 */
export const getPlaceholderImage = (options: PlaceholderImageOptions = {}): string => {
  const {
    width = 400,
    height = 400,
    backgroundColor = '3B82F6',
    textColor = 'FFFFFF',
    text = 'Image',
    font = 'roboto'
  } = options;

  // Remove # from color codes if present
  const bgColor = backgroundColor.replace('#', '');
  const txtColor = textColor.replace('#', '');

  // Primary: Use placehold.co (more reliable than via.placeholder.com)
  return `https://placehold.co/${width}x${height}/${bgColor}/${txtColor}/png?text=${encodeURIComponent(text)}&font=${font}`;
};

/**
 * Get a sample brand logo with fallback support
 */
export const getSampleBrandLogo = (size: number = 60): string => {
  // First try local logo, then fallback to placeholder
  return '/logo.png';
};

/**
 * Handle image loading errors with automatic fallback
 */
export const handleImageError = (
  e: React.SyntheticEvent<HTMLImageElement>, 
  fallbackOptions?: PlaceholderImageOptions
) => {
  const target = e.currentTarget;
  
  // If it's already a placehold.co URL that failed, fallback to local logo
  if (target.src.includes('placehold.co')) {
    target.src = '/logo.png';
    return;
  }
  
  // Otherwise, try placehold.co
  target.src = getPlaceholderImage(fallbackOptions);
}; 