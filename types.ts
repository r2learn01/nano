
// export type Language = 'en' | 'ar';

// export interface User {
//   id: string;
//   username: string;
//   password?: string; // Added for verification
//   isPremium: boolean;
//   subscriptionExpiry?: string; // ISO string
//   imagesGenerated: number;
// }

// export interface GeneratedImage {
//   id: string;
//   userId: string;
//   url: string;
//   prompt: string;
//   timestamp: string;
// }

// export interface AppState {
//   user: User | null;
//   language: Language;
// }

// export enum ModelType {
//   PRO = 'gemini-2.5-flash-image',
//   EDIT = 'gemini-2.5-flash-image'
// }
export type Language = 'en' | 'ar';

export interface User {
  id: string;
  username: string;
  password?: string; // Added for verification
  isPremium: boolean;
  subscriptionExpiry?: string; // ISO string
  imagesGenerated: number;
}

export interface GeneratedImage {
  id: string;
  userId: string;
  url: string;
  prompt: string;
  timestamp: string;
}

export interface AppState {
  user: User | null;
  language: Language;
}

export enum ModelType {
  // الموديل ده هو المخصص لتوليد الصور (Imagen 3)
  PRO = 'imagen-3.0-generate-001', 
  EDIT = 'imagen-3.0-edit-001'
}
