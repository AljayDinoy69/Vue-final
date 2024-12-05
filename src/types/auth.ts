export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
  confirmPassword: string;
}

export interface Photo {
  id: string;
  userId: string;
  url: string;
  title: string;
  description: string;
  category: string;
  createdAt: string;
}

export const PHOTO_CATEGORIES = [
  'Nature',
  'Architecture',
  'Portrait',
  'Travel',
  'Food',
  'Animals',
  'Art',
  'Other'
] as const;

export type PhotoCategory = typeof PHOTO_CATEGORIES[number];