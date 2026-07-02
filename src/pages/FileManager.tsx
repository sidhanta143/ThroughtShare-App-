import React, { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppState } from '../context/AppContext';
import { 
  FolderPlus, FilePlus, Grid, List, Search, ChevronRight, 
  MoreVertical, Download, Edit2, Move, Copy, Share2, 
  Trash2, Star, Eye, Folder, File, ArrowLeft, X, 
  Lock, Check, ExternalLink, Calendar, HardDrive, UploadCloud
} from 'lucide-react';
import { formatBytes } from '../utils/storage';
import { AppFile, AppFolder } from '../types';

export const FileManager: React.FC = () => {
  const { 
    files, folders, searchQuery, createFolder, renameFolder, 
    deleteFolder, addVirtualFile, renameFile, moveFile, moveFolder, copyFile, 
    deleteFile, toggleFavoriteFile, toggleFavoriteFolder, shareFile, 
    startDownload, triggerNotification 
  } = useAppState();

  const location = useLocation();
  const navigate = useNavigate();

  // Root vs nested directories
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);

  // Layout View Switch (Grid vs List)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Modal Dialog states
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const [activeItemMenu, setActiveItemMenu] = useState<{ id: string; type: 'file' | 'folder' } | null>(null);
  
  // Action Modals
  const [showRenameModal, setShowRenameModal] = useState<{ id: string; type: 'file' | 'folder'; name: string } | null>(null);
  const [renameValue, setRenameValue] = useState('');

  const [showMoveModal, setShowMoveModal] = useState<{ id: string; type: 'file' | 'folder' } | null>(null);
  const [selectedDestId, setSelectedDestId] = useState<string | 'root'>('root');

  const [showShareModal, setShowShareModal] = useState<AppFile | null>(null);
  const [sharePassword, setSharePassword] = useState('');
  const [shareExpires, setShareExpires] = useState<number>(7);

  const [showPreviewModal, setShowPreviewModal] = useState<AppFile | null>(null);

  // Upload Simulation
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadingName, setUploadingName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Filter based on routing context
  const isFavoritesPage = location.pathname.includes('favorites');
  const isFoldersOnlyPage = location.pathname.includes('folders');

  // Breadcrumbs calculation
  const getBreadcrumbs = () => {
    const list = [];
    let currentId = currentFolderId;
    while (currentId !== null) {
      const match = folders.find(f => f.id === currentId);
      if (match) {
        list.unshift(match);
        currentId = match.parentId;
      } else {
        break;
      }
    }
    return list;
  };

  const breadcrumbs = getBreadcrumbs();

  // Active items
  const activeFolders = folders.filter(f => {
    if (isFavoritesPage) return f.isFavorite;
    if (isFoldersOnlyPage) return f.parentId === currentFolderId;
    return f.parentId === currentFolderId;
  });

  const activeFiles = files.filter(f => {
    if (isFavoritesPage) return f.isFavorite;
    if (isFoldersOnlyPage) return false; // don't show files on folders-only tab
    return f.folderId === currentFolderId;
  });

  // Apply search query filters
  const filteredFolders = activeFolders.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredFiles = activeFiles.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle Drag & Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processDroppedFile = (file: File) => {
    setUploadingName(file.name);
    setUploadProgress(0);
    
    // Simulate real progress upload ticks
    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          let category = 'text';
          if (file.type.includes('image')) category = 'image';
          else if (file.type.includes('pdf')) category = 'pdf';
          else if (file.type.includes('zip') || file.type.includes('tar') || file.type.includes('zip-compressed')) category = 'zip';
          else if (file.type.includes('audio')) category = 'audio';
          else if (file.type.includes('video')) category = 'video';
          else if (file.type.includes('word') || file.type.includes('officedocument') || file.name.endsWith('.docx')) category = 'word';

          addVirtualFile(file.name, file.size, category, file.type, currentFolderId);
          setUploadProgress(null);
          setUploadingName('');
        }, 300);
      }
    }, 150);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processDroppedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processDroppedFile(e.target.files[0]);
    }
  };

  // Directory upload simulation
  const handleFolderUploadSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesList = Array.from(e.target.files) as any[];
      const firstFile = filesList[0];
      const relativePath = firstFile.webkitRelativePath || '';
      const topFolderName = relativePath.split('/')[0] || 'Uploaded Directory';

      // Create folder locally
      const parentNew = createFolder(topFolderName, currentFolderId);
      
      // Upload files inside newly created mock folder
      filesList.forEach((file: any) => {
        let category = 'text';
        if (file.type.includes('image')) category = 'image';
        else if (file.type.includes('pdf')) category = 'pdf';
        else if (file.name.endsWith('.zip')) category = 'zip';
        addVirtualFile(file.name, file.size, category, file.type, parentNew.id);
      });
      
      triggerNotification(`Folder "${topFolderName}" with ${filesList.length} files successfully structured`, 'success');
    }
  };

  const handleNewFolderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    createFolder(newFolderName.trim(), currentFolderId);
    setNewFolderName('');
    setShowCreateFolderModal(false);
  };

  const handleRenameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showRenameModal || !renameValue.trim()) return;
    if (showRenameModal.type === 'file') {
      renameFile(showRenameModal.id, renameValue.trim());
    } else {
      renameFolder(showRenameModal.id, renameValue.trim());
    }
    setShowRenameModal(null);
    setRenameValue('');
  };

  const handleMoveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showMoveModal) return;
    const destFolderId = selectedDestId === 'root' ? null : selectedDestId;
    if (showMoveModal.type === 'file') {
      moveFile(showMoveModal.id, destFolderId);
    } else {
      moveFolder(showMoveModal.id, destFolderId);
    }
    setShowMoveModal(null);
    setSelectedDestId('root');
  };

  const handleShareSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showShareModal) return;
    shareFile(showShareModal.id, sharePassword || undefined, shareExpires);
    setShowShareModal(null);
    setSharePassword('');
  };

  const downloadSingleFolder = (folder: AppFolder) => {
    const includedFiles = files.filter(f => f.folderId === folder.id);
    const totalSize = includedFiles.reduce((acc, f) => acc + f.size, 0) || 5 * 1024 * 1024;
    startDownload(`${folder.name}_Package.zip`, totalSize);
  };

  // Navigation down
  const enterFolder = (id: string) => {
    setCurrentFolderId(id);
    setActiveItemMenu(null);
  };

  return (
    <div className="space-y-6 text-left relative">

      {/* Main Path Breadcrumbs banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-zinc-900 px-5 py-4 rounded-2xl border border-gray-100 dark:border-zinc-805 shadow-sm">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-zinc-400">
          <button 
            onClick={() => setCurrentFolderId(null)}
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            My Workspace
          </button>
          
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={crumb.id}>
              <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
              <button 
                onClick={() => setCurrentFolderId(crumb.id)}
                className={`hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors truncate max-w-[120px] ${idx === breadcrumbs.length - 1 ? 'text-gray-900 dark:text-white font-bold' : ''}`}
              >
                {crumb.name}
              </button>
            </React.Fragment>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {/* Grid/List views toggles */}
          <button 
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${viewMode === 'grid' ? 'bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-950/40 dark:border-indigo-900' : 'border-gray-150 text-gray-400 hover:text-gray-600 dark:border-zinc-800'}`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${viewMode === 'list' ? 'bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-950/40 dark:border-indigo-900' : 'border-gray-150 text-gray-400 hover:text-gray-600 dark:border-zinc-800'}`}
          >
            <List className="w-4 h-4" />
          </button>

          {!isFavoritesPage && (
            <div className="h-6 w-[1px] bg-gray-100 dark:bg-zinc-800 mx-1" />
          )}

          {/* Quick Upload triggers */}
          {!isFavoritesPage && (
            <div className="flex items-center gap-1.5">
              <button 
                onClick={() => setShowCreateFolderModal(true)}
                className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 dark:bg-indigo-950/20 dark:hover:bg-indigo-950/40 dark:text-indigo-400 px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <FolderPlus className="w-4 h-4" />
                New Folder
              </button>
              
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm shadow-indigo-150/40"
              >
                <FilePlus className="w-4 h-4" />
                Upload
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                onChange={handleFileSelect} 
              />
              
              <button 
                onClick={() => folderInputRef.current?.click()}
                className="bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-750 text-gray-700 dark:text-zinc-255 px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <FolderPlus className="w-4 h-4" />
                Upload Folder
              </button>
              <input 
                type="file" 
                ref={folderInputRef} 
                className="hidden" 
                webkitdirectory="true" 
                onChange={handleFolderUploadSelect}
              />
            </div>
          )}
        </div>
      </div>

      {/* Drag Over Active Overlay */}
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative p-8 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center text-center transition-all min-h-[140px] bg-white dark:bg-zinc-900 ${isDragging ? 'border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/10' : 'border-gray-200 dark:border-zinc-800'}`}
      >
        {uploadProgress !== null ? (
          <div className="w-full max-w-sm space-y-3 p-4">
            <div className="flex justify-between items-center text-xs font-semibold text-gray-700 dark:text-zinc-300">
              <span className="truncate max-w-[200px]">Uploading: {uploadingName}</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="h-2 w-full bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-150" style={{ width: `${uploadProgress}%` }} />
            </div>
            <p className="text-[10px] text-gray-400">Restructured path buffered locally inside client storage cache.</p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-full bg-indigo-50/70 dark:bg-indigo-955/20 text-indigo-500 flex items-center justify-center mx-auto mb-1">
              <UploadCloud className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-gray-750 dark:text-zinc-200">Drag files here to store</h4>
            <p className="text-xs text-gray-400 dark:text-zinc-550">
              Drop directories, PDFs, ZIP archives, or raw text blocks recursively in-browser.
            </p>
          </div>
        )}
      </div>

      {/* Empty States */}
      {filteredFolders.length === 0 && filteredFiles.length === 0 ? (
        <div className="p-16 text-center bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800/80 rounded-3xl space-y-4">
          <Folder className="w-12 h-12 text-gray-300 dark:text-zinc-700 mx-auto" />
          <h4 className="font-bold text-gray-800 dark:text-zinc-200 text-sm">Directory is clean and empty</h4>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">No matching folders or file systems found in this path. Upload new items to see details here.</p>
        </div>
      ) : (
        <>
          {/* Folders display */}
          {filteredFolders.length > 0 && (
            <div className="space-y-3">
              <h5 className="text-xs font-extrabold text-gray-405 dark:text-zinc-500 uppercase tracking-widest px-1">Folders</h5>
              
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {filteredFolders.map((f) => (
                    <div 
                      key={f.id}
                      className="p-4 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-850 rounded-2xl flex items-center justify-between group hover:border-indigo-500/50 hover:shadow-md transition-all relative"
                    >
                      <div className="flex items-center gap-3 cursor-pointer overflow-hidden flex-1" onClick={() => enterFolder(f.id)}>
                        <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/20 text-amber-500 shrink-0">
                          <Folder className="w-5 h-5 fill-amber-500/10" />
                        </div>
                        <div className="overflow-hidden">
                          <p className="font-bold text-xs text-gray-850 dark:text-zinc-200 truncate pr-4">{f.name}</p>
                          <p className="text-[10px] text-gray-400">Created: {new Date(f.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 relative">
                        {/* Download folder option remains permanently visible */}
                        <button 
                          onClick={() => downloadSingleFolder(f)} 
                          className="p-1.5 rounded-lg text-gray-450 hover:text-indigo-600 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                          title="Download Folder"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        
                        <button 
                          onClick={() => toggleFavoriteFolder(f.id)}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${f.isFavorite ? 'text-amber-500' : 'text-gray-350 hover:text-amber-500'}`}
                        >
                          <Star className={`w-4 h-4 ${f.isFavorite ? 'fill-amber-500' : ''}`} />
                        </button>

                        <button 
                          onClick={() => setActiveItemMenu(activeItemMenu?.id === f.id ? null : { id: f.id, type: 'folder' })}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200 transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {/* Menu Popover */}
                        {activeItemMenu?.id === f.id && activeItemMenu?.type === 'folder' && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setActiveItemMenu(null)} />
                            <div className="absolute right-0 top-8 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-1.5 rounded-xl shadow-xl z-20 min-w-[140px]">
                              <button 
                                onClick={() => { setShowRenameModal({ id: f.id, type: 'folder', name: f.name }); setRenameValue(f.name); setActiveItemMenu(null); }}
                                className="w-full text-left px-3 py-1.5 rounded-lg text-xs hover:bg-gray-50 dark:hover:bg-zinc-800 flex items-center gap-2 text-gray-600 dark:text-zinc-300"
                              >
                                <Edit2 className="w-3.5 h-3.5" /> Rename
                              </button>
                              <button 
                                onClick={() => { setShowMoveModal({ id: f.id, type: 'folder' }); setActiveItemMenu(null); }}
                                className="w-full text-left px-3 py-1.5 rounded-lg text-xs hover:bg-gray-50 dark:hover:bg-zinc-800 flex items-center gap-2 text-gray-600 dark:text-zinc-300"
                              >
                                <Move className="w-3.5 h-3.5" /> Move
                              </button>
                              <button 
                                onClick={() => { deleteFolder(f.id); setActiveItemMenu(null); }}
                                className="w-full text-left px-3 py-1.5 rounded-lg text-xs hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20 dark:hover:text-red-400 flex items-center gap-2 text-gray-600 dark:text-zinc-300"
                              >
                                <Trash2 className="w-3.5 h-3.5" /> Delete
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800/80 rounded-2xl overflow-hidden shadow-sm">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-50 dark:border-zinc-850/80 bg-gray-50/50 dark:bg-zinc-950/20 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">
                        <th className="py-3 px-4">Folder Name</th>
                        <th className="py-3 px-4">Created Date</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredFolders.map((f) => (
                        <tr key={f.id} className="border-b border-gray-50 dark:border-zinc-850/50 hover:bg-gray-50/50 dark:hover:bg-zinc-900/40 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3 cursor-pointer" onClick={() => enterFolder(f.id)}>
                              <Folder className="w-4 h-4 text-amber-500 shrink-0" />
                              <span className="font-bold text-xs text-gray-800 dark:text-zinc-250">{f.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-xs text-gray-450 dark:text-zinc-400">
                            {new Date(f.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              {/* Download options permanently visible */}
                              <button onClick={() => downloadSingleFolder(f)} className="p-1.5 rounded-lg text-xs text-gray-450 hover:text-indigo-600 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors" title="Download folder">
                                <Download className="w-3.5 h-3.5" />
                              </button>
                              <button onClick={() => toggleFavoriteFolder(f.id)} className={`p-1.5 rounded-lg transition-colors cursor-pointer ${f.isFavorite ? 'text-amber-500' : 'text-gray-350'}`}>
                                <Star className={`w-3.5 h-3.5 ${f.isFavorite ? 'fill-amber-500' : ''}`} />
                              </button>
                              <button onClick={() => { setShowRenameModal({ id: f.id, type: 'folder', name: f.name }); setRenameValue(f.name); }} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-850 transition-colors">
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button onClick={() => deleteFolder(f.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-650 hover:bg-red-50 dark:hover:bg-red-950/20 dark:hover:text-red-400 transition-colors">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Files display */}
          {filteredFiles.length > 0 && (
            <div className="space-y-3 pt-4">
              <h5 className="text-xs font-extrabold text-gray-405 dark:text-zinc-500 uppercase tracking-widest px-1">Files</h5>
              
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {filteredFiles.map((file) => (
                    <div 
                      key={file.id}
                      className="p-4 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-850 rounded-2xl flex flex-col justify-between group hover:border-indigo-500/50 hover:shadow-md transition-all h-[150px] relative"
                    >
                      <div className="flex justify-between items-start">
                        <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500 shrink-0">
                          <File className="w-5 h-5" />
                        </div>
                        
                        <div className="flex items-center gap-1">
                          {/* Download option remains permanently visible */}
                          <button 
                            onClick={() => startDownload(file.name, file.size)}
                            className="p-1 rounded text-gray-400 hover:text-indigo-600 transition-colors cursor-pointer"
                            title="Download File"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                          
                          <button 
                            onClick={() => toggleFavoriteFile(file.id)}
                            className={`p-1 rounded transition-colors cursor-pointer ${file.isFavorite ? 'text-amber-500' : 'text-gray-350 hover:text-amber-400'}`}
                          >
                            <Star className={`w-3.5 h-3.5 ${file.isFavorite ? 'fill-amber-500' : ''}`} />
                          </button>
                          
                          <button 
                            onClick={() => setActiveItemMenu(activeItemMenu?.id === file.id ? null : { id: file.id, type: 'file' })}
                            className="p-1 rounded text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                          >
                            <MoreVertical className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Menu Popovers */}
                      {activeItemMenu?.id === file.id && activeItemMenu?.type === 'file' && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setActiveItemMenu(null)} />
                          <div className="absolute right-4 top-12 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-1.5 rounded-xl shadow-xl z-25 min-w-[150px]">
                            <button 
                              onClick={() => { setShowPreviewModal(file); setActiveItemMenu(null); }}
                              className="w-full text-left px-3 py-1.5 rounded-lg text-xs hover:bg-gray-50 dark:hover:bg-zinc-800 flex items-center gap-2 text-gray-600 dark:text-zinc-350"
                            >
                              <Eye className="w-3.5 h-3.5" /> View / Inspect
                            </button>
                            <button 
                              onClick={() => { setShowRenameModal({ id: file.id, type: 'file', name: file.name }); setRenameValue(file.name); setActiveItemMenu(null); }}
                              className="w-full text-left px-3 py-1.5 rounded-lg text-xs hover:bg-gray-50 dark:hover:bg-zinc-800 flex items-center gap-2 text-gray-600 dark:text-zinc-350"
                            >
                              <Edit2 className="w-3.5 h-3.5" /> Rename
                            </button>
                            <button 
                              onClick={() => { setShowMoveModal({ id: file.id, type: 'file' }); setActiveItemMenu(null); }}
                              className="w-full text-left px-3 py-1.5 rounded-lg text-xs hover:bg-gray-50 dark:hover:bg-zinc-800 flex items-center gap-2 text-gray-600 dark:text-zinc-350"
                            >
                              <Move className="w-3.5 h-3.5" /> Move
                            </button>
                            <button 
                              onClick={() => { copyFile(file.id, currentFolderId); setActiveItemMenu(null); }}
                              className="w-full text-left px-3 py-1.5 rounded-lg text-xs hover:bg-gray-50 dark:hover:bg-zinc-800 flex items-center gap-2 text-gray-600 dark:text-zinc-350"
                            >
                              <Copy className="w-3.5 h-3.5" /> Make Copy
                            </button>
                            <button 
                              onClick={() => { setShowShareModal(file); setActiveItemMenu(null); }}
                              className="w-full text-left px-3 py-1.5 rounded-lg text-xs hover:bg-gray-50 dark:hover:bg-zinc-800 flex items-center gap-2 text-gray-600 dark:text-zinc-350"
                            >
                              <Share2 className="w-3.5 h-3.5" /> Configure Share
                            </button>
                            <button 
                              onClick={() => { deleteFile(file.id); setActiveItemMenu(null); }}
                              className="w-full text-left px-3 py-1.5 rounded-lg text-xs hover:bg-red-50 hover:text-red-650 dark:hover:bg-red-950/20 dark:hover:text-red-400 flex items-center gap-2 text-gray-600 dark:text-zinc-350"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Delete
                            </button>
                          </div>
                        </>
                      )}

                      <div className="cursor-pointer" onClick={() => setShowPreviewModal(file)}>
                        <h4 className="font-bold text-xs text-gray-800 dark:text-zinc-200 truncate pr-4">{file.name}</h4>
                        <div className="flex justify-between items-center text-[10px] text-gray-400 mt-1">
                          <span>{formatBytes(file.size)}</span>
                          <span className="uppercase text-indigo-500 font-semibold">{file.type}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800/80 rounded-2xl overflow-hidden shadow-sm">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-50 dark:border-zinc-850 bg-gray-50/50 dark:bg-zinc-950/25 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">
                        <th className="py-3 px-4">File Name</th>
                        <th className="py-3 px-4">Type</th>
                        <th className="py-3 px-4">Size</th>
                        <th className="py-3 px-4">Uploaded AT</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredFiles.map((file) => (
                        <tr key={file.id} className="border-b border-gray-50 dark:border-zinc-850/50 hover:bg-gray-50/50 dark:hover:bg-zinc-900/40 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setShowPreviewModal(file)}>
                              <File className="w-4 h-4 text-indigo-500 shrink-0" />
                              <span className="font-bold text-xs text-gray-850 dark:text-zinc-250 truncate max-w-xs">{file.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-xs text-indigo-500 font-bold uppercase">{file.type}</td>
                          <td className="py-3 px-4 text-xs text-gray-500 dark:text-zinc-350">{formatBytes(file.size)}</td>
                          <td className="py-3 px-4 text-xs text-gray-450 dark:text-zinc-400">{new Date(file.createdAt).toLocaleDateString()}</td>
                          <td className="py-3 px-4 text-right shadow-transparent">
                            <div className="flex items-center justify-end gap-1">
                              {/* Download options permanently visible */}
                              <button onClick={() => startDownload(file.name, file.size)} className="p-1.5 rounded-lg text-xs text-gray-450 hover:text-indigo-600 transition-colors cursor-pointer" title="Download File">
                                <Download className="w-3.5 h-3.5" />
                              </button>
                              <button onClick={() => toggleFavoriteFile(file.id)} className={`p-1.5 rounded-lg transition-colors cursor-pointer ${file.isFavorite ? 'text-amber-500' : 'text-gray-350'}`}>
                                <Star className={`w-3.5 h-3.5 ${file.isFavorite ? 'fill-amber-500' : ''}`} />
                              </button>
                              <button onClick={() => setShowPreviewModal(file)} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200 transition-colors">
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button onClick={() => { setShowShareModal(file); }} className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-605 transition-colors">
                                <Share2 className="w-3.5 h-3.5" />
                              </button>
                              <button onClick={() => deleteFile(file.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-650 hover:bg-red-50 dark:hover:bg-red-950/20 dark:hover:text-red-400 transition-colors">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* --- CREATE FOLDER MODAL --- */}
      {showCreateFolderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/30 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl">
            <h4 className="font-extrabold text-sm text-gray-950 dark:text-white mb-4">Create New directory</h4>
            <form onSubmit={handleNewFolderSubmit} className="space-y-4">
              <input
                type="text"
                required
                placeholder="Folder name (e.g. Invoices Q3)"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-950/20 rounded-xl text-xs text-gray-800 dark:text-zinc-100 focus:outline-none focus:border-indigo-500"
              />
              <div className="flex gap-2 justify-end">
                <button type="button" onClick={() => setShowCreateFolderModal(false)} className="px-4 py-2 text-xs font-semibold text-gray-500 rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 shadow-md">Create Folder</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- RENAME MODAL --- */}
      {showRenameModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/30 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl">
            <h4 className="font-extrabold text-sm text-gray-950 dark:text-white mb-4">Rename Item</h4>
            <form onSubmit={handleRenameSubmit} className="space-y-4">
              <input
                type="text"
                required
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                className="w-full px-4 py-3 border border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-950/20 rounded-xl text-xs text-gray-800 dark:text-zinc-100 focus:outline-none focus:border-indigo-505"
              />
              <div className="flex gap-2 justify-end">
                <button type="button" onClick={() => setShowRenameModal(null)} className="px-4 py-2 text-xs font-semibold text-gray-500 rounded-lg hover:bg-gray-55">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700">Save New Name</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MOVE MODAL --- */}
      {showMoveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/30 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl">
            <h4 className="font-extrabold text-sm text-gray-950 dark:text-white mb-4">Choose Destination folder</h4>
            <form onSubmit={handleMoveSubmit} className="space-y-4">
              <select
                value={selectedDestId}
                onChange={(e) => setSelectedDestId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-950/20 rounded-xl text-xs text-gray-800 dark:text-zinc-100 focus:outline-none"
              >
                <option value="root">My Workspace Root</option>
                {folders.filter(f => f.id !== showMoveModal.id).map(f => (
                  <option key={f.id} value={f.id}>📁 {f.name}</option>
                ))}
              </select>
              <div className="flex gap-2 justify-end">
                <button type="button" onClick={() => setShowMoveModal(null)} className="px-4 py-2 text-xs font-semibold text-gray-500 rounded-lg hover:bg-gray-55">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700">Relocate Item</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- SHARE MODAL --- */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/30 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl text-left">
            <h4 className="font-extrabold text-sm text-gray-950 dark:text-white mb-2">Configure secure share link</h4>
            <p className="text-[11px] text-gray-400 mb-4 truncate">File: {showShareModal.name}</p>
            
            <form onSubmit={handleShareSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Set Password protection (optional)</label>
                <input
                  type="text"
                  placeholder="Leave empty for public link"
                  value={sharePassword}
                  onChange={(e) => setSharePassword(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-950/20 rounded-xl text-xs text-gray-800 dark:text-zinc-100 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider font-semibold">Expiration Duration</label>
                <select
                  value={shareExpires}
                  onChange={(e) => setShareExpires(Number(e.target.value))}
                  className="w-full px-4 py-2.5 border border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-950/20 rounded-xl text-xs text-gray-800 dark:text-zinc-105 focus:outline-none"
                >
                  <option value={1}>1 Day</option>
                  <option value={7}>7 Days</option>
                  <option value={30}>30 Days</option>
                  <option value={0}>Never Expire</option>
                </select>
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button type="button" onClick={() => setShowShareModal(null)} className="px-4 py-2 text-xs font-semibold text-gray-500 rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 shadow">Generate Link</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- PREVIEW MODAL --- */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/30 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-3xl p-6 w-full max-w-md shadow-2xl text-left relative">
            <button 
              onClick={() => setShowPreviewModal(null)}
              className="absolute right-4 top-4 p-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200 transition-colors"
            >
              <X className="w-4.5 h-4.5" />
            </button>

            <h4 className="font-extrabold text-base text-gray-950 dark:text-white pr-8 truncate">{showPreviewModal.name}</h4>
            <span className="text-[10px] bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded text-indigo-600 dark:text-indigo-400 font-bold uppercase mt-1 inline-block">{showPreviewModal.type} Document</span>

            {/* Simulated file viewer rendering */}
            <div className="my-6 p-4 rounded-2xl bg-gray-50 dark:bg-zinc-955 border border-gray-100 dark:border-zinc-850 max-h-56 overflow-y-auto text-xs text-gray-500 dark:text-zinc-400 leading-relaxed font-mono">
              {showPreviewModal.type === 'pdf' && (
                <p>--- PORTABLE DOCUMENT CORRESPONDENCE ---\n\nThis file contains compiled client brand graphics, logo grids, colors templates, and typography specifications designed under vector formats. Expirations apply.</p>
              )}
              {showPreviewModal.type === 'image' && (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-full aspect-video bg-gray-200 dark:bg-zinc-800 rounded-xl flex items-center justify-center text-gray-400">🖼️ Image visual assets container</div>
                  <p className="text-[10px] text-gray-450">Format conversions are loaded on image canvas compressor drawers.</p>
                </div>
              )}
              {showPreviewModal.type === 'word' && (
                <p>--- TEXT SPECIFICATION CONTRACT ---\n\nDraft client revision specs details, outline grids, team allocation logs, and meeting timelines compiled organically on our document converters.</p>
              )}
              {showPreviewModal.type === 'zip' && (
                <p>--- COMPILED ZIP CONTAINER ARCHIVE ---\n\nMulti-file document package bundling index summaries, spec templates, logs spreadsheets, and system mockups structures.</p>
              )}
              {!['pdf', 'image', 'word', 'zip'].includes(showPreviewModal.type) && (
                <p>--- PLAIN TEXT BACKEND ASSET BUFFER ---\n\nDynamic raw byte telemetry registers mapped under standard sandboxed client storage schemas.</p>
              )}
            </div>

            {/* File properties drawer */}
            <div className="space-y-2 border-t border-gray-50 dark:border-zinc-800 pt-4 text-xs">
              <div className="flex justify-between"><span className="text-gray-400">File Payload Size:</span> <span className="font-semibold text-gray-800 dark:text-zinc-300">{formatBytes(showPreviewModal.size)}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Uploaded timestamp:</span> <span className="font-semibold text-gray-800 dark:text-zinc-300">{new Date(showPreviewModal.createdAt).toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Public shared:</span> <span className="font-semibold text-gray-800 dark:text-zinc-350">{showPreviewModal.shared?.isShared ? `🔴 Active (${showPreviewModal.shared?.linkId})` : 'Private Session'}</span></div>
            </div>

            {/* Quick action button container with Download remaining visible */}
            <div className="mt-6 flex justify-end gap-2 border-t border-gray-50 dark:border-zinc-800 pt-4">
              <button 
                onClick={() => { startDownload(showPreviewModal.name, showPreviewModal.size); setShowPreviewModal(null); }}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" /> Download File File
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
