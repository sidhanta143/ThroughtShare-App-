import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  AppUser, AppFile, AppFolder, TransformationLog, ActivityLog, DownloadItem, ThemeMode 
} from '../types';
import * as db from '../utils/storage';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  user: AppUser | null;
  theme: ThemeMode;
  toggleTheme: () => void;
  files: AppFile[];
  folders: AppFolder[];
  transformations: TransformationLog[];
  activityLogs: ActivityLog[];
  downloads: DownloadItem[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isLoading: boolean;
  toasts: Toast[];
  triggerNotification: (message: string, type: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  
  // Auth
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (details: Partial<AppUser>) => void;

  // File system
  addVirtualFile: (name: string, size: number, type: string, mimeType: string, folderId: string | null) => AppFile;
  renameFile: (id: string, newName: string) => void;
  moveFile: (id: string, folderId: string | null) => void;
  copyFile: (id: string, folderId: string | null) => void;
  deleteFile: (id: string) => void;
  toggleFavoriteFile: (id: string) => void;
  toggleFavoriteFolder: (id: string) => void;
  shareFile: (id: string, password?: string, expiresDays?: number) => void;

  // Folders
  createFolder: (name: string, parentId: string | null) => AppFolder;
  renameFolder: (id: string, newName: string) => void;
  moveFolder: (id: string, parentId: string | null) => void;
  deleteFolder: (id: string) => void;

  // Transformation
  addTransformationHistory: (fileName: string, type: TransformationLog['type'], originalSize: number) => string;
  updateTransformationProgress: (id: string, progress: number, status: TransformationLog['status'], transformedSize?: number) => void;

  // Downloads
  startDownload: (fileName: string, bytes: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  db.initializeStorage();

  const [user, setUser] = useState<AppUser | null>(() => db.getCurrentUser());
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const localTheme = localStorage.getItem('file_trans_theme') as ThemeMode;
    return localTheme || 'light';
  });
  
  const [files, setFilesList] = useState<AppFile[]>(() => db.getFiles());
  const [folders, setFoldersList] = useState<AppFolder[]>(() => db.getFolders());
  const [transformations, setTransformationsList] = useState<TransformationLog[]>(() => db.getTransformations());
  const [activityLogs, setActivityLogsList] = useState<ActivityLog[]>(() => db.getActivityLogs());
  const [downloads, setDownloadsList] = useState<DownloadItem[]>(() => db.getDownloads());
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Apply theme to HTML tag
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('file_trans_theme', theme);
  }, [theme]);

  // Sync state modifications back to local storage
  useEffect(() => {
    db.setFiles(files);
    // Dynamic storage trigger calculation
    if (user) {
      const bytesUsed = files.reduce((acc, f) => acc + f.size, 0);
      if (bytesUsed !== user.storageUsed) {
        const updatedUser = { ...user, storageUsed: bytesUsed };
        setUser(updatedUser);
        db.setCurrentUser(updatedUser);
      }
    }
  }, [files]);

  useEffect(() => {
    db.setFolders(folders);
  }, [folders]);

  useEffect(() => {
    db.setTransformations(transformations);
  }, [transformations]);

  useEffect(() => {
    db.setActivityLogs(activityLogs);
  }, [activityLogs]);

  useEffect(() => {
    db.setDownloads(downloads);
  }, [downloads]);

  const triggerNotification = (message: string, type: 'success' | 'error' | 'info') => {
    const id = `toast-${Date.now()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    triggerNotification(`Switched to ${theme === 'light' ? 'Dark' : 'Light'} Mode`, 'info');
  };

  // Auth operations
  const login = async (email: string, pass: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 600)); // smooth visual simulation
    setIsLoading(false);
    
    const users = db.getUsers();
    const existingUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (existingUser) {
      db.setCurrentUser(existingUser);
      setUser(existingUser);
      triggerNotification(`Welcome back, ${existingUser.name}!`, 'success');
      db.addActivity('Logged In', 'Successful sign-in to the portal', 'system');
      setActivityLogsList(db.getActivityLogs());
      return true;
    } else {
      // Allow seamless login auto-generating a secure mock credential for developers' testing convenience
      const newU: AppUser = {
        id: `u-${Date.now()}`,
        name: email.split('@')[0].toUpperCase(),
        email: email,
        avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${email}`,
        coverBanner: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800',
        bio: 'Premium Developer Workspace Member',
        storageUsed: 0,
        maxStorage: 10 * 1024 * 1024 * 1024,
        joinDate: new Date().toISOString().split('T')[0]
      };
      const allUsers = [...users, newU];
      localStorage.setItem('file_trans_users', JSON.stringify(allUsers));
      db.setCurrentUser(newU);
      setUser(newU);
      triggerNotification(`Welcome! Account auto-provisioned for ${email}`, 'success');
      db.addActivity('Auto-Registered', 'Account provisioned on first OAuth-simulated login', 'system');
      setActivityLogsList(db.getActivityLogs());
      return true;
    }
  };

  const register = async (name: string, email: string, pass: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsLoading(false);

    const users = db.getUsers();
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      triggerNotification('Email already registered!', 'error');
      return false;
    }

    const newUser: AppUser = {
      id: `u-${Date.now()}`,
      name,
      email,
      avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${name}`,
      coverBanner: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=800',
      bio: 'Ready to convert, compress, and organize my documents!',
      storageUsed: 0,
      maxStorage: 10 * 1024 * 1024 * 1024,
      joinDate: new Date().toISOString().split('T')[0]
    };

    localStorage.setItem('file_trans_users', JSON.stringify([...users, newUser]));
    db.setCurrentUser(newUser);
    setUser(newUser);
    triggerNotification('Registration successful! Welcome.', 'success');
    db.addActivity('Registered New Account', `Created new security profile for ${name}`, 'system');
    setActivityLogsList(db.getActivityLogs());
    return true;
  };

  const logout = () => {
    db.addActivity('Logged Out', 'Safely closed user session details', 'system');
    db.setCurrentUser(null);
    setUser(null);
    triggerNotification('Successfully logged out.', 'info');
  };

  const updateProfile = (details: Partial<AppUser>) => {
    if (!user) return;
    const updated = { ...user, ...details };
    setUser(updated);
    db.setCurrentUser(updated);
    triggerNotification('Profile details updated successfully', 'success');
    db.addActivity('Updated Profile', 'Edited personal bio and workspace preferences', 'system');
    setActivityLogsList(db.getActivityLogs());
  };

  // Files management
  const addVirtualFile = (name: string, size: number, type: string, mimeType: string, folderId: string | null): AppFile => {
    const newFile: AppFile = {
      id: `fi-${Date.now()}`,
      name,
      size,
      type,
      mimeType,
      folderId,
      isFavorite: false,
      createdAt: new Date().toISOString(),
      downloads: 0
    };
    
    setFilesList((prev) => [newFile, ...prev]);
    db.addActivity('Uploaded File', `Successfully uploaded "${name}" (${db.formatBytes(size)})`, 'upload');
    setActivityLogsList(db.getActivityLogs());
    triggerNotification(`Uploaded ${name}`, 'success');
    return newFile;
  };

  const renameFile = (id: string, newName: string) => {
    setFilesList((prev) => prev.map((f) => {
      if (f.id === id) {
        db.addActivity('Renamed File', `Renamed "${f.name}" to "${newName}"`, 'system');
        setActivityLogsList(db.getActivityLogs());
        return { ...f, name: newName };
      }
      return f;
    }));
    triggerNotification('File renamed successfully', 'success');
  };

  const moveFile = (id: string, folderId: string | null) => {
    const targetFolder = folders.find((f) => f.id === folderId);
    const destName = targetFolder ? `"${targetFolder.name}"` : 'Root directory';
    
    setFilesList((prev) => prev.map((f) => {
      if (f.id === id) {
        db.addActivity('Moved File', `Moved "${f.name}" to ${destName}`, 'system');
        setActivityLogsList(db.getActivityLogs());
        return { ...f, folderId };
      }
      return f;
    }));
    triggerNotification(`File moved to ${targetFolder ? targetFolder.name : 'root'}`, 'success');
  };

  const copyFile = (id: string, folderId: string | null) => {
    const original = files.find((f) => f.id === id);
    if (!original) return;
    
    const targetFolder = folders.find((f) => f.id === folderId);
    const destName = targetFolder ? `"${targetFolder.name}"` : 'Root directory';

    const copy: AppFile = {
      ...original,
      id: `fi-copy-${Date.now()}`,
      name: `Copy of ${original.name}`,
      createdAt: new Date().toISOString(),
      folderId
    };

    setFilesList((prev) => [copy, ...prev]);
    db.addActivity('Copied File', `Created carbon copy of "${original.name}" inside ${destName}`, 'system');
    setActivityLogsList(db.getActivityLogs());
    triggerNotification(`Copied to ${targetFolder ? targetFolder.name : 'root'}`, 'success');
  };

  const deleteFile = (id: string) => {
    const target = files.find((f) => f.id === id);
    if (!target) return;
    setFilesList((prev) => prev.filter((f) => f.id !== id));
    db.addActivity('Deleted File', `Removed "${target.name}" permanently from workspace`, 'delete');
    setActivityLogsList(db.getActivityLogs());
    triggerNotification('File deleted', 'info');
  };

  const toggleFavoriteFile = (id: string) => {
    setFilesList((prev) => prev.map((f) => {
      if (f.id === id) {
        const isFav = !f.isFavorite;
        db.addActivity(isFav ? 'Added Favorite' : 'Removed Favorite', `Toggled bookmarks for "${f.name}"`, 'system');
        setActivityLogsList(db.getActivityLogs());
        return { ...f, isFavorite: isFav };
      }
      return f;
    }));
  };

  const toggleFavoriteFolder = (id: string) => {
    setFoldersList((prev) => prev.map((f) => {
      if (f.id === id) {
        const isFav = !f.isFavorite;
        db.addActivity(isFav ? 'Added Favorite' : 'Removed Favorite', `Toggled bookmarks for folder "${f.name}"`, 'system');
        setActivityLogsList(db.getActivityLogs());
        return { ...f, isFavorite: isFav };
      }
      return f;
    }));
  };

  const shareFile = (id: string, password?: string, expiresDays?: number) => {
    setFilesList((prev) => prev.map((f) => {
      if (f.id === id) {
        const expiresAt = expiresDays 
          ? new Date(Date.now() + expiresDays * 24 * 60 * 60 * 1000).toISOString()
          : undefined;
        
        const shared = {
          isShared: true,
          linkId: `s-${Math.random().toString(36).substring(2, 9)}`,
          expiresAt,
          isPasswordProtected: !!password,
          password,
          downloadCount: 0,
          sharedDate: new Date().toISOString()
        };
        db.addActivity('Shared File', `Configured sharing links for "${f.name}"`, 'share');
        setActivityLogsList(db.getActivityLogs());
        return { ...f, shared };
      }
      return f;
    }));
    triggerNotification('File shared successfully', 'success');
  };

  // Folder Operations
  const createFolder = (name: string, parentId: string | null): AppFolder => {
    const newFolder: AppFolder = {
      id: `f-${Date.now()}`,
      name,
      parentId,
      isFavorite: false,
      createdAt: new Date().toISOString()
    };
    setFoldersList((prev) => [...prev, newFolder]);
    db.addActivity('Created Folder', `Created folder structure "${name}"`, 'system');
    setActivityLogsList(db.getActivityLogs());
    triggerNotification(`Created folder "${name}"`, 'success');
    return newFolder;
  };

  const renameFolder = (id: string, newName: string) => {
    setFoldersList((prev) => prev.map((f) => {
      if (f.id === id) {
        db.addActivity('Renamed Folder', `Renamed "${f.name}" to "${newName}"`, 'system');
        setActivityLogsList(db.getActivityLogs());
        return { ...f, name: newName };
      }
      return f;
    }));
    triggerNotification('Folder renamed successfully', 'success');
  };

  const moveFolder = (id: string, parentId: string | null) => {
    setFoldersList((prev) => prev.map((f) => {
      if (f.id === id) {
        return { ...f, parentId };
      }
      return f;
    }));
    triggerNotification('Folder hierarchy updated', 'success');
  };

  const deleteFolder = (id: string) => {
    const target = folders.find((f) => f.id === id);
    if (!target) return;
    
    // Recursive removal
    setFoldersList((prev) => prev.filter((f) => f.id !== id && f.parentId !== id));
    // Orphan content goes to root
    setFilesList((prev) => prev.map((f) => f.folderId === id ? { ...f, folderId: null } : f));
    
    db.addActivity('Deleted Folder', `Deleted folder tree for "${target.name}" and cleared subfolders`, 'delete');
    setActivityLogsList(db.getActivityLogs());
    triggerNotification(`Deleted folder "${target.name}"`, 'info');
  };

  // Transformations Tracker
  const addTransformationHistory = (fileName: string, type: TransformationLog['type'], originalSize: number): string => {
    const id = `tr-${Date.now()}`;
    const newLog: TransformationLog = {
      id,
      fileName,
      type,
      originalSize,
      transformedSize: 0,
      status: 'pending',
      progress: 0,
      timestamp: new Date().toISOString()
    };

    setTransformationsList((prev) => [newLog, ...prev]);
    return id;
  };

  const updateTransformationProgress = (
    id: string, 
    progress: number, 
    status: TransformationLog['status'], 
    transformedSize?: number
  ) => {
    setTransformationsList((prev) => prev.map((t) => {
      if (t.id === id) {
        const updated = { ...t, progress, status };
        if (transformedSize) {
          updated.transformedSize = transformedSize;
          updated.downloadUrl = '#'; // enable downloading transformed files
        }
        return updated;
      }
      return t;
    }));
    if (status === 'completed') {
      const targetTrans = transformations.find((t) => t.id === id);
      const actionName = targetTrans ? targetTrans.type.replace('_', ' ').toUpperCase() : 'TRANSFORMATION';
      db.addActivity('Completed Transformation', `Finished processing file through engine: ${actionName}`, 'transform');
      setActivityLogsList(db.getActivityLogs());
    }
  };

  const startDownload = (fileName: string, bytes: number) => {
    db.triggerDownload(fileName, bytes);
    // Reload state after delay
    setTimeout(() => {
      setDownloadsList(db.getDownloads());
    }, 100);
    setTimeout(() => {
      setDownloadsList(db.getDownloads());
    }, 1000);
    setTimeout(() => {
      setDownloadsList(db.getDownloads());
    }, 2000);
  };

  return (
    <AppContext.Provider value={{
      user, theme, toggleTheme, files, folders, transformations, activityLogs, downloads, searchQuery, setSearchQuery, isLoading, toasts, triggerNotification, removeToast,
      login, register, logout, updateProfile,
      addVirtualFile, renameFile, moveFile, copyFile, deleteFile, toggleFavoriteFile, toggleFavoriteFolder, shareFile,
      createFolder, renameFolder, moveFolder, deleteFolder,
      addTransformationHistory, updateTransformationProgress,
      startDownload
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppState must be used within AppProvider');
  return context;
};
