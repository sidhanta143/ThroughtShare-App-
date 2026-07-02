import { AppUser, AppFile, AppFolder, TransformationLog, ActivityLog, DownloadItem } from '../types';

const USERS_KEY = 'file_trans_users';
const CURRENT_USER_KEY = 'file_trans_current_user';
const FILES_KEY = 'file_trans_files';
const FOLDERS_KEY = 'file_trans_folders';
const TRANS_KEY = 'file_trans_transformations';
const ACTIVITY_KEY = 'file_trans_activity';
const DOWNLOADS_KEY = 'file_trans_downloads';

// Helper size formatter
export function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

const DEFAULT_USERS: AppUser[] = [
  {
    id: 'u1',
    name: 'Sidhanta Dora',
    email: 'sidhantadora143@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    coverBanner: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800',
    bio: 'Product Designer & Full-Stack Developer. I transform complex ideas into simple, intuitive web experiences.',
    storageUsed: 3.42 * 1024 * 1024 * 1024, // 3.42 GB
    maxStorage: 10 * 1024 * 1024 * 1024,   // 10 GB
    joinDate: '2026-03-12'
  }
];

const DEFAULT_FOLDERS: AppFolder[] = [
  { id: 'f1', name: 'Design Assets', parentId: null, isFavorite: true, createdAt: '2026-06-01T12:00:00Z' },
  { id: 'f2', name: 'Financial Q2 Reports', parentId: null, isFavorite: false, createdAt: '2026-06-10T14:30:00Z' },
  { id: 'f3', name: 'Client Proofs', parentId: null, isFavorite: false, createdAt: '2026-06-15T09:15:00Z' },
  { id: 'f4', name: 'Logo Collections', parentId: 'f1', isFavorite: true, createdAt: '2026-06-02T10:11:00Z' },
  { id: 'f5', name: 'Social Media Banner Sets', parentId: 'f1', isFavorite: false, createdAt: '2026-06-03T11:45:00Z' },
];

const DEFAULT_FILES: AppFile[] = [
  {
    id: 'fi1',
    name: 'Landing_Hero_Layout-v2.png',
    size: 2.1 * 1024 * 1024, // 2.1 MB
    type: 'image',
    mimeType: 'image/png',
    folderId: 'f4',
    isFavorite: true,
    createdAt: '2026-06-03T15:24:00Z',
    downloads: 14,
    shared: {
      isShared: true,
      linkId: 'link-f1-hero',
      expiresAt: '2026-07-22T00:00:00Z',
      isPasswordProtected: false,
      downloadCount: 14,
      sharedDate: '2026-06-04T10:00:00Z'
    }
  },
  {
    id: 'fi2',
    name: 'Brand_Guidelines_2026.pdf',
    size: 12.8 * 1024 * 1024, // 12.8 MB
    type: 'pdf',
    mimeType: 'application/pdf',
    folderId: 'f1',
    isFavorite: true,
    createdAt: '2026-06-01T16:45:00Z',
    downloads: 48,
    shared: {
      isShared: true,
      linkId: 'link-bg-2026',
      isPasswordProtected: true,
      password: 'password123',
      downloadCount: 32,
      sharedDate: '2026-06-02T08:30:00Z'
    }
  },
  {
    id: 'fi3',
    name: 'Annual_Investor_Pitch.pptx',
    size: 45.2 * 1024 * 1024, // 45.2 MB
    type: 'word', // generic doc
    mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    folderId: 'f2',
    isFavorite: false,
    createdAt: '2026-06-11T11:20:00Z',
    downloads: 9
  },
  {
    id: 'fi4',
    name: 'Client_Brief_Revision_D.docx',
    size: 820 * 1024, // 820 KB
    type: 'word',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    folderId: 'f3',
    isFavorite: false,
    createdAt: '2026-06-16T14:10:00Z',
    downloads: 3
  },
  {
    id: 'fi5',
    name: 'Platform_Mockups_Archive.zip',
    size: 145 * 1024 * 1024, // 145 MB
    type: 'zip',
    mimeType: 'application/zip',
    folderId: null,
    isFavorite: false,
    createdAt: '2026-06-18T08:00:00Z',
    downloads: 24,
    shared: {
      isShared: true,
      linkId: 'platform-mockups',
      expiresAt: '2026-06-25T12:00:00Z',
      isPasswordProtected: false,
      downloadCount: 8,
      sharedDate: '2026-06-18T10:15:00Z'
    }
  },
  {
    id: 'fi6',
    name: 'Audio_Walkthrough-Final.mp3',
    size: 8.4 * 1024 * 1024, // 8.4 MB
    type: 'audio',
    mimeType: 'audio/mpeg',
    folderId: null,
    isFavorite: true,
    createdAt: '2026-06-20T17:33:00Z',
    downloads: 5
  },
  {
    id: 'fi7',
    name: 'Interactive_Demo_Reel.mp4',
    size: 124.6 * 1024 * 1024, // 124.6 MB
    type: 'video',
    mimeType: 'video/mp4',
    folderId: null,
    isFavorite: false,
    createdAt: '2026-06-21T02:11:00Z',
    downloads: 1
  }
];

const DEFAULT_TRANSFORMATIONS: TransformationLog[] = [
  {
    id: 'tr1',
    fileName: 'Design_Proposal.pdf',
    type: 'pdf_to_word',
    originalSize: 4.8 * 1024 * 1024,
    transformedSize: 3.2 * 1024 * 1024,
    status: 'completed',
    progress: 100,
    timestamp: '2026-06-21T18:45:00Z',
    downloadUrl: '#'
  },
  {
    id: 'tr2',
    fileName: 'Landing_Hero_Uncompressed.png',
    type: 'image_compress',
    originalSize: 12.4 * 1024 * 1024,
    transformedSize: 1.8 * 1024 * 1024,
    status: 'completed',
    progress: 100,
    timestamp: '2026-06-21T20:12:00Z',
    downloadUrl: '#'
  },
  {
    id: 'tr3',
    fileName: 'System_Specifications.docx',
    type: 'word_to_pdf',
    originalSize: 1.2 * 1024 * 1024,
    transformedSize: 1.5 * 1024 * 1024,
    status: 'completed',
    progress: 100,
    timestamp: '2026-06-22T01:05:00Z',
    downloadUrl: '#'
  }
];

const DEFAULT_ACTIVITY_LOGS: ActivityLog[] = [
  { id: 'a1', action: 'Uploaded File', details: 'Uploaded Landing_Hero_Layout-v2.png to Logo Collections', type: 'upload', timestamp: '2026-06-21T15:20:00Z' },
  { id: 'a2', action: 'Transformed Document', details: 'Converted System_Specifications.docx to PDF format', type: 'transform', timestamp: '2026-06-22T01:05:00Z' },
  { id: 'a3', action: 'Shared Document', details: 'Generated a high-security link for Brand_Guidelines_2026.pdf', type: 'share', timestamp: '2026-06-21T18:30:00Z' },
  { id: 'a4', action: 'Downloaded File', details: 'Downloaded Platform_Mockups_Archive.zip', type: 'download', timestamp: '2026-06-22T02:00:00Z' },
  { id: 'a5', action: 'Created Folder', details: 'Created nested subdirectory Social Media Banner Sets', type: 'system', timestamp: '2026-06-03T11:45:00Z' }
];

const DEFAULT_DOWNLOADS: DownloadItem[] = [
  { id: 'dl1', name: 'Brand_Guidelines_2026.pdf', size: 12.8 * 1024 * 1024, progress: 100, status: 'completed', timestamp: '2026-06-22T01:30:00Z' },
  { id: 'dl2', name: 'Platform_Mockups_Archive.zip', size: 145 * 1024 * 1024, progress: 100, status: 'completed', timestamp: '2026-06-22T02:00:00Z' },
  { id: 'dl3', name: 'Assets_Review_Call.mp4', size: 412 * 1024 * 1024, progress: 45, status: 'active', speed: '4.8 MB/s', timeRemaining: '45s', timestamp: '2026-06-22T02:41:00Z' }
];

export function initializeStorage() {
  if (!localStorage.getItem(USERS_KEY)) {
    localStorage.setItem(USERS_KEY, JSON.stringify(DEFAULT_USERS));
  }
  if (!localStorage.getItem(FILES_KEY)) {
    localStorage.setItem(FILES_KEY, JSON.stringify(DEFAULT_FILES));
  }
  if (!localStorage.getItem(FOLDERS_KEY)) {
    localStorage.setItem(FOLDERS_KEY, JSON.stringify(DEFAULT_FOLDERS));
  }
  if (!localStorage.getItem(TRANS_KEY)) {
    localStorage.setItem(TRANS_KEY, JSON.stringify(DEFAULT_TRANSFORMATIONS));
  }
  if (!localStorage.getItem(ACTIVITY_KEY)) {
    localStorage.setItem(ACTIVITY_KEY, JSON.stringify(DEFAULT_ACTIVITY_LOGS));
  }
  if (!localStorage.getItem(DOWNLOADS_KEY)) {
    localStorage.setItem(DOWNLOADS_KEY, JSON.stringify(DEFAULT_DOWNLOADS));
  }
}

// Getters & Setters
export function getUsers(): AppUser[] {
  initializeStorage();
  return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
}

export function getCurrentUser(): AppUser | null {
  initializeStorage();
  const raw = localStorage.getItem(CURRENT_USER_KEY);
  if (!raw) {
    // default u1 signed in for preview experience ease, but can switch anytime
    const users = getUsers();
    if (users.length > 0) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(users[0]));
      return users[0];
    }
    return null;
  }
  return JSON.parse(raw);
}

export function setCurrentUser(user: AppUser | null) {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    // update in users lists as well
    const users = getUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index !== -1) {
      users[index] = user;
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
}

export function getFiles(): AppFile[] {
  initializeStorage();
  return JSON.parse(localStorage.getItem(FILES_KEY) || '[]');
}

export function setFiles(files: AppFile[]) {
  localStorage.setItem(FILES_KEY, JSON.stringify(files));
}

export function getFolders(): AppFolder[] {
  initializeStorage();
  return JSON.parse(localStorage.getItem(FOLDERS_KEY) || '[]');
}

export function setFolders(folders: AppFolder[]) {
  localStorage.setItem(FOLDERS_KEY, JSON.stringify(folders));
}

export function getTransformations(): TransformationLog[] {
  initializeStorage();
  return JSON.parse(localStorage.getItem(TRANS_KEY) || '[]');
}

export function setTransformations(transLogs: TransformationLog[]) {
  localStorage.setItem(TRANS_KEY, JSON.stringify(transLogs));
}

export function getActivityLogs(): ActivityLog[] {
  initializeStorage();
  return JSON.parse(localStorage.getItem(ACTIVITY_KEY) || '[]');
}

export function setActivityLogs(logs: ActivityLog[]) {
  localStorage.setItem(ACTIVITY_KEY, JSON.stringify(logs));
}

export function addActivity(action: string, details: string, type: ActivityLog['type']) {
  const logs = getActivityLogs();
  const newLog: ActivityLog = {
    id: `act-${Date.now()}`,
    action,
    details,
    type,
    timestamp: new Date().toISOString()
  };
  logs.unshift(newLog);
  // Keep last 100
  setActivityLogs(logs.slice(0, 100));
}

export function getDownloads(): DownloadItem[] {
  initializeStorage();
  return JSON.parse(localStorage.getItem(DOWNLOADS_KEY) || '[]');
}

export function setDownloads(downloads: DownloadItem[]) {
  localStorage.setItem(DOWNLOADS_KEY, JSON.stringify(downloads));
}

export function triggerDownload(fileName: string, fileSize: number) {
  const downloads = getDownloads();
  const id = `dl-${Date.now()}`;
  const newDownload: DownloadItem = {
    id,
    name: fileName,
    size: fileSize,
    progress: 0,
    status: 'active',
    speed: '2.5 MB/s',
    timeRemaining: '3s',
    timestamp: new Date().toISOString()
  };
  
  downloads.unshift(newDownload);
  setDownloads(downloads);
  addActivity('Downloaded File', `Initiated download for ${fileName}`, 'download');

  // Trigger browser simulation download
  const dummyData = 'x'.repeat(Math.min(fileSize, 5000));
  const blob = new Blob([dummyData], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  // Animate progress to complete in local state
  let currentProgress = 0;
  const interval = setInterval(() => {
    const freshDownloads = getDownloads();
    const target = freshDownloads.find(d => d.id === id);
    if (target) {
      currentProgress += 25;
      if (currentProgress >= 100) {
        target.progress = 100;
        target.status = 'completed';
        target.speed = undefined;
        target.timeRemaining = undefined;
        clearInterval(interval);
      } else {
        target.progress = currentProgress;
        target.speed = `${(Math.random() * 5 + 1).toFixed(1)} MB/s`;
        target.timeRemaining = `${Math.ceil((100 - currentProgress) / 25)}s`;
      }
      setDownloads(freshDownloads);
    } else {
      clearInterval(interval);
    }
  }, 400);
}
