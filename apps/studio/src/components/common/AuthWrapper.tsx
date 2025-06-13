import React, { ReactNode } from 'react';
import { useStudio } from '../../contexts/StudioContext';

interface AuthWrapperProps {
  children: ReactNode;
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  const { state } = useStudio();
  
  // For now, we'll just render children without auth logic
  // This can be enhanced later with proper authentication
  return <>{children}</>;
} 