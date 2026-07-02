import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppState } from '../context/AppContext';
import { 
  Search, Bell, Menu, X, HardDrive, RefreshCw, 
  FolderOpen, Files, Share2, Download, Heart, Activity, User, Settings, LogOut
} from 'lucide-react';
import { formatBytes } from '../utils/storage';

export const Header: React.FC = () => {
  const { user, searchQuery, setSearchQuery, files, logout } = useAppState();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const totalUsed = files.reduce((acc, f) => acc + f.size, 0);
  const maxStorage = user?.maxStorage || 10 * 1024 * 1024 * 1024;
  const storagePercentage = Math.min((totalUsed / maxStorage) * 100, 100);

  const notifications = [
    { id: 1, title: 'Transformation Complete', text: 'Brand_Guidelines_2026.pdf was converted successfully.', time: '5m ago' },
    { id: 2, title: 'Share Link Expiring', text: 'Secure sharing link for "Q2 Report" will expire in 2 days.', time: '1h ago' },
    { id: 3, title: 'Storage Capacity Alert', text: 'You are using 34% of your total workspace allocation.', time: '1d ago' },
  ];

  const handleMobileNav = (path: string) => {
    setIsMobileMenuOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    setIsMobileMenuOpen(false);
    logout();
    navigate('/');
  };

  const mobileMenuItems = [
    { name: 'Dashboard', icon: Files, path: '/dashboard' },
    { name: 'My Files', icon: Files, path: '/dashboard/files' },
    { name: 'My Folders', icon: FolderOpen, path: '/dashboard/folders' },
    { name: 'Transformations', icon: RefreshCw, path: '/dashboard/transformations' },
    { name: 'Shared Files', icon: Share2, path: '/dashboard/shared' },
    { name: 'Downloads', icon: Download, path: '/dashboard/downloads' },
    { name: 'Favorites', icon: Heart, path: '/dashboard/favorites' },
    { name: 'Activity Logs', icon: Activity, path: '/dashboard/activity' },
    { name: 'Profile', icon: User, path: '/dashboard/profile' },
    { name: 'Settings', icon: Settings, path: '/dashboard/settings' },
  ];

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between h-16 px-4 md:px-6 bg-brand-card/85 dark:bg-[#0B0F19]/85 backdrop-blur-md border-b border-[#E2E8F0] dark:border-slate-800">
      
      {/* Search Input */}
      <div className="flex-1 max-w-md hidden sm:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-muted dark:text-slate-400" />
          <input
            type="text"
            placeholder="Search files, folders, and templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-[#E2E8F0] dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 rounded-xl text-sm placeholder-brand-text-muted dark:placeholder-slate-500 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary text-brand-text-main dark:text-slate-200 transition-all"
          />
        </div>
      </div>

      {/* Title block for small screens instead of input */}
      <div className="flex sm:hidden items-center gap-2">
        <RefreshCw className="w-5 h-5 text-indigo-500" />
        <span className="font-bold text-base text-gray-900 dark:text-white">TransForma</span>
      </div>

      {/* Quick Action items */}
      <div className="flex items-center gap-3">
        {/* Toggle search on mobile optionally (can use sidebar fallback) */}
        <div className="sm:hidden relative max-w-36">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-2 py-1.5 border border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50 rounded-xl text-xs placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none text-gray-700 dark:text-zinc-200"
          />
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 dark:text-zinc-500" />
        </div>

        {/* Notifications Dropdown Trigger */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl text-gray-500 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full" />
          </button>

          {showNotifications && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
              <div className="absolute right-0 mt-2 w-80 z-50 p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-850 shadow-xl">
                <div className="flex items-center justify-between pb-2 border-b border-gray-50 dark:border-zinc-800">
                  <h5 className="font-semibold text-sm text-gray-800 dark:text-zinc-200">Alert Center</h5>
                  <button onClick={() => setShowNotifications(false)} className="text-xs text-indigo-500 hover:underline">Clear all</button>
                </div>
                <div className="mt-2 space-y-1 max-h-64 overflow-y-auto">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-2 hover:bg-gray-50 dark:hover:bg-zinc-850 rounded-xl transition-colors cursor-pointer text-left">
                      <div className="flex justify-between items-start gap-2">
                        <p className="font-semibold text-xs text-gray-800 dark:text-zinc-200">{n.title}</p>
                        <span className="text-[10px] text-gray-400 dark:text-zinc-500">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-gray-500 dark:text-zinc-400 mt-1 line-clamp-2">{n.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Quick User Avatar Capsule */}
        {user && (
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard/profile')}>
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 rounded-full border border-gray-100 dark:border-zinc-800 object-cover"
            />
            <span className="hidden md:inline text-xs font-semibold text-gray-700 dark:text-zinc-300">
              {user.name.split(' ')[0]}
            </span>
          </div>
        )}

        {/* Mobile menu trigger */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 rounded-xl text-gray-500 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-zinc-850 transition-colors"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <>
          <div 
            className="fixed inset-0 top-16 bg-gray-900/20 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <nav className="fixed right-0 top-16 bottom-0 w-64 bg-white dark:bg-zinc-950 border-l border-gray-100 dark:border-zinc-900 z-50 md:hidden flex flex-col p-4 overflow-y-auto">
            
            {/* Storage in mobile header */}
            <div className="mb-6 p-3 rounded-2xl bg-gray-50 dark:bg-zinc-900/50 border border-gray-100 dark:border-zinc-900">
              <div className="flex items-center justify-between text-xs font-semibold text-gray-600 dark:text-zinc-350 mb-1.5">
                <span className="flex items-center gap-1"><HardDrive className="w-3.5 h-3.5 text-indigo-500" /> Storage Used</span>
                <span>{storagePercentage.toFixed(0)}%</span>
              </div>
              <div className="h-1.5 w-full bg-gray-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${storagePercentage}%` }} />
              </div>
              <p className="text-[10px] text-gray-400 dark:text-zinc-500 mt-1">
                {formatBytes(totalUsed)} of {formatBytes(maxStorage)}
              </p>
            </div>

            <span className="text-xs font-bold text-gray-400 dark:text-zinc-500 tracking-wider uppercase mb-3 px-2">Navigation</span>
            
            <div className="flex-1 space-y-1">
              {mobileMenuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.name}
                    onClick={() => handleMobileNav(item.path)}
                    className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      isActive 
                        ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20' 
                        : 'text-gray-600 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-900/60'
                    }`}
                  >
                    <item.icon className="w-4 h-4 shrink-0" />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-auto pt-4 border-t border-gray-100 dark:border-zinc-900">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-350 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                <span>Sign Out</span>
              </button>
            </div>
          </nav>
        </>
      )}
    </header>
  );
};
