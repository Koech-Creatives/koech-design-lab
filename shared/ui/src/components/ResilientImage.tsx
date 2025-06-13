import React, { useState } from 'react';

export interface ResilientImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  fallbacks?: string[];
  placeholder?: string;
  alt: string;
}

export const ResilientImage: React.FC<ResilientImageProps> = ({
  src,
  fallbacks = [],
  placeholder = '/logo.png',
  alt,
  onError,
  ...props
}) => {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [fallbackIndex, setFallbackIndex] = useState(-1);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    // Call original onError if provided
    if (onError) {
      onError(e);
    }

    // Try next fallback
    const nextIndex = fallbackIndex + 1;
    
    if (nextIndex < fallbacks.length) {
      setFallbackIndex(nextIndex);
      setCurrentSrc(fallbacks[nextIndex]);
    } else {
      // Use final placeholder fallback
      setCurrentSrc(placeholder);
    }
  };

  return (
    <img
      {...props}
      src={currentSrc}
      alt={alt}
      onError={handleError}
    />
  );
}; 