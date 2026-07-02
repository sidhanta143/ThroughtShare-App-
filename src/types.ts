export interface AppUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  coverBanner: string;
  bio: string;
  storageUsed: number; // in bytes
  maxStorage: number;  // in bytes
  joinDate: string;
}

export interface AppFile {
  id: string;
  name: string;
  size: number; // in bytes
  type: string; // e.g. "pdf", "word", "image", "zip", "audio", "video", "text"
  mimeType: string;
  url?: string; // data URL or path
  folderId: string | null; // null means root
  isFavorite: boolean;
  createdAt: string;
  downloads: number;
  shared?: {
    isShared: boolean;
    linkId: string;
    expiresAt?: string;
    isPasswordProtected: boolean;
    password?: string;
    downloadCount: number;
    sharedDate: string;
  };
}

export interface AppFolder {
  id: string;
  name: string;
  parentId: string | null; // null means root
  isFavorite: boolean;
  createdAt: string;
}

export interface TransformationLog {
  id: string;
  fileName: string;
  type: 'pdf_to_word' | 'word_to_pdf' | 'image_compress' | 'image_convert' | 'zip_compress' | 'file_merge' | 'file_split';
  originalSize: number;
  transformedSize: number;
  status: 'pending' | 'transforming' | 'completed' | 'failed';
  progress: number;
  downloadUrl?: string;
  timestamp: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  details: string;
  type: 'upload' | 'download' | 'share' | 'transform' | 'delete' | 'system';
  timestamp: string;
}

export interface DownloadItem {
  id: string;
  name: string;
  size: number;
  progress: number;
  status: 'active' | 'completed' | 'failed';
  speed?: string;
  timeRemaining?: string;
  timestamp: string;
}

export type ThemeMode = 'light' | 'dark';
