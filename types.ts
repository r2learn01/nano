
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
  PRO = 'gemini-1.5-flash',
  EDIT = 'gemini-1.5-flash'
}
