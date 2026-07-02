import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../context/AppContext';
import { 
  File, Folder, Share2, Download, HardDrive, 
  ArrowUpRight, Plus, RefreshCw, UploadCloud, Clock, Eye
} from 'lucide-react';
import { formatBytes } from '../utils/storage';

export const DashboardHome: React.FC = () => {
  const { user, files, folders, activityLogs, downloads, startDownload } = useAppState();
  const navigate = useNavigate();

  // Stats calculation
  const totalFiles = files.length;
  const totalFolders = folders.length;
  const totalShared = files.filter(f => f.shared?.isShared).length;
  const totalDownloads = downloads.filter(d => d.status === 'completed').length;

  const totalUsedBytes = files.reduce((acc, f) => acc + f.size, 0);
  const maxStorageBytes = user?.maxStorage || 10 * 1024 * 1024 * 1024;
  const storagePercentage = Math.min((totalUsedBytes / maxStorageBytes) * 100, 100);

  const quickStats = [
    { title: 'Total Files', count: totalFiles, icon: File, color: 'text-indigo-600 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-950/35', path: '/dashboard/files' },
    { title: 'Total Folders', count: totalFolders, icon: Folder, color: 'text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-950/35', path: '/dashboard/folders' },
    { title: 'Shared Files', count: totalShared, icon: Share2, color: 'text-cyan-600 bg-cyan-50 dark:text-cyan-400 dark:bg-cyan-950/35', path: '/dashboard/shared' },
    { title: 'Completed Downloads', count: totalDownloads, icon: Download, color: 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/35', path: '/dashboard/downloads' },
  ];

  // Latest activities - take first 5
  const quickLogs = activityLogs.slice(0, 5);

  const handleQuickUpload = () => {
    navigate('/dashboard/files');
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Welcome Card & Storage Overview Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Welcome Section */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-gradient-to-tr from-brand-primary via-[#6356E5] to-brand-secondary text-white relative overflow-hidden shadow-xl shadow-brand-primary/15 flex flex-col justify-between min-h-[220px]">
          {/* Wave visuals */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-2xl -ml-20 -mb-20 pointer-events-none" />

          {/* User profile card items */}
          <div className="flex items-center gap-4 relative z-10">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb'}
              alt={user?.name}
              className="w-14 h-14 rounded-2xl border-2 border-white/20 object-cover"
            />
            <div>
              <h2 className="text-xl font-bold tracking-tight">Good day, {user?.name || 'Workspace member'}!</h2>
              <p className="text-xs text-indigo-100 mt-1">Welcome back. Everything in your cloud node is synchronized and secure.</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 pt-6 relative z-10 border-t border-white/10 mt-6 lg:mt-0">
            <div>
              <p className="text-[10px] text-indigo-100 uppercase font-semibold tracking-wider">Storage Used</p>
              <h4 className="font-extrabold text-base">{formatBytes(totalUsedBytes)} of {formatBytes(maxStorageBytes)}</h4>
            </div>
            <div className="ml-auto flex items-center gap-3">
              <button 
                onClick={handleQuickUpload}
                className="px-5 py-2.5 bg-white text-brand-primary hover:bg-slate-50 font-bold text-xs rounded-xl flex items-center gap-2 transition-all hover:scale-103 cursor-pointer shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Upload Files
              </button>
              <button 
                onClick={() => navigate('/dashboard/transformations')}
                className="px-5 py-2.5 bg-indigo-700/50 hover:bg-indigo-700/80 text-white border border-indigo-400/30 font-bold text-xs rounded-xl flex items-center gap-2 transition-all hover:scale-103 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4 animate-spin-slow" />
                Transform Workstation
              </button>
            </div>
          </div>
        </div>

        {/* Circular Storage gauge chart */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-brand-card dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 flex flex-col justify-between items-center text-center shadow-sm">
          <div className="w-full flex justify-between items-center text-xs font-bold text-brand-text-muted dark:text-slate-400">
            <span>Core Storage Allocate</span>
            <span className="text-brand-accent">Cloud Basic</span>
          </div>

          {/* SVG Circular progress loader */}
          <div className="relative my-4 flex items-center justify-center">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="52"
                strokeWidth="10"
                className="stroke-slate-100 dark:stroke-slate-800 fill-transparent"
              />
              <circle
                cx="64"
                cy="64"
                r="52"
                strokeWidth="10"
                className="stroke-brand-primary fill-transparent"
                strokeDasharray={2 * Math.PI * 52}
                strokeDashoffset={2 * Math.PI * 52 * (1 - storagePercentage / 100)}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-2xl font-black text-brand-text-main dark:text-white">
                {storagePercentage.toFixed(0)}%
              </span>
              <p className="text-[9px] font-semibold text-brand-text-muted uppercase tracking-wider mt-0.5">Used</p>
            </div>
          </div>

          <p className="text-xs text-brand-text-muted dark:text-slate-400">
            Using <strong>{formatBytes(totalUsedBytes)}</strong> out of 10.00 GB. Overloading limits restricts sharing outputs.
          </p>
        </div>

      </div>

      {/* Statistics Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => (
          <div 
            key={index}
            onClick={() => navigate(stat.path)}
            className="p-5 bg-brand-card dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 rounded-2xl flex items-center justify-between shadow-sm cursor-pointer hover:border-brand-primary/40 dark:hover:border-indigo-400/30 transition-all group"
          >
            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-brand-text-muted dark:text-zinc-400">{stat.title}</p>
              <h3 className="text-2xl font-black text-brand-text-main dark:text-white group-hover:text-brand-primary transition-colors">
                {stat.count}
              </h3>
            </div>
            <div className={`p-3 rounded-xl shrink-0 ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activities & Quick Guide Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Real-time chronologic logs */}
        <div className="lg:col-span-7 p-6 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-gray-50 dark:border-zinc-850 mb-4">
              <h4 className="font-bold text-sm text-gray-900 dark:text-zinc-100 flex items-center gap-2">
                <Clock className="w-4.5 h-4.5 text-indigo-500" /> Recent Actions
              </h4>
              <button 
                onClick={() => navigate('/dashboard/activity')}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                View all logs
              </button>
            </div>

            {quickLogs.length === 0 ? (
              <div className="py-12 text-center text-gray-405 text-xs">No recent workspace actions logged yet.</div>
            ) : (
              <div className="space-y-4">
                {quickLogs.map((log) => (
                  <div key={log.id} className="flex gap-3">
                    <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full shrink-0 mt-1.5 ring-4 ring-indigo-50 dark:ring-indigo-950/40" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-xs text-gray-800 dark:text-zinc-200 truncate">{log.action}</p>
                        <span className="text-[10px] text-gray-400 dark:text-zinc-500">
                          {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 dark:text-zinc-400 mt-0.5 truncate">{log.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-50 dark:border-zinc-850">
            <p className="text-[11px] text-gray-400">All actions are registered client-side under local cookie configurations.</p>
          </div>
        </div>

        {/* Quick Transformations Workstation Guide card */}
        <div className="lg:col-span-5 p-6 bg-gradient-to-tr from-gray-900 to-zinc-950 text-white rounded-3xl flex flex-col justify-between shadow-xl min-h-[300px]">
          <div className="space-y-3">
            <div className="text-xs font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
              <UploadCloud className="w-4.5 h-4.5 animate-bounce text-indigo-400" />
              <span>Transformation Suite</span>
            </div>
            <h4 className="font-extrabold text-base leading-tight">Need to Compress and Convert Immediately?</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Drop PDFs to compile into Word docs, or feed full images into our custom client-side canvas engines to shrink payload sizes instantly. No data logs leave your browser, ensuring absolute compliance privacy.
            </p>
          </div>
          
          <button 
            onClick={() => navigate('/dashboard/transformations')}
            className="w-full mt-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow transition-transform hover:scale-102 cursor-pointer"
          >
            <span>Launch Transformations Workspace</span>
            <Plus className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
