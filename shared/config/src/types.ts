export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  thumbnail?: string;
  userId: string;
  brandId?: string;
  settings: ProjectSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectSettings {
  width: number;
  height: number;
  backgroundColor: string;
  gridEnabled: boolean;
  snapToGrid: boolean;
}

export interface Template {
  id: string;
  name: string;
  description?: string;
  thumbnail: string;
  category: string;
  tags: string[];
  data: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface Brand {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  colors: BrandColor[];
  fonts: BrandFont[];
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BrandColor {
  id: string;
  name: string;
  hex: string;
  usage: 'primary' | 'secondary' | 'accent' | 'neutral';
}

export interface BrandFont {
  id: string;
  name: string;
  family: string;
  weight: string;
  usage: 'heading' | 'body' | 'accent';
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: 'success' | 'error';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
} 