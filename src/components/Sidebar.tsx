import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useAppState } from '../context/AppContext';
import { 
  LayoutDashboard, FolderOpen, Files, RefreshCw, Share2, 
  Download, Heart, Activity, User, Settings, LogOut, 
  Menu, ChevronLeft, Moon, Sun, HardDrive
} from 'lucide-react';
import { formatBytes } from '../utils/storage';

export const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, theme, toggleTheme, logout, files } = useAppState();
  const navigate = useNavigate();
  const location = useLocation();

  const totalUsed = files.reduce((acc, f) => acc + f.size, 0);
  const maxStorage = user?.maxStorage || 10 * 1024 * 1024 * 1024;
  const storagePercentage = Math.min((totalUsed / maxStorage) * 100, 100);

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
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

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <motion.div
      animate={{ width: isCollapsed ? '72px' : '260px' }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="hidden md:flex flex-col h-screen sticky top-0 shrink-0 border-r border-slate-800 bg-[#0F172A] text-slate-300 z-30"
    >
      {/* Brand logo header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800 overflow-hidden">
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => navigate('/dashboard')}
            >
              <div className="flex items-center justify-center p-2 rounded-xl bg-gradient-to-tr from-[#06B6D4] to-[#4F46E5] text-white shadow-md">
                <RefreshCw className="w-5 h-5 animate-spin-slow" />
              </div>
              <span className="font-extrabold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#06B6D4] to-white">
                TransForma
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {isCollapsed && (
          <div className="mx-auto flex items-center justify-center p-2 rounded-xl bg-gradient-to-tr from-[#06B6D4] to-[#4F46E5] text-white shadow-md cursor-pointer" onClick={() => navigate('/dashboard')}>
            <RefreshCw className="w-5 h-5" />
          </div>
        )}

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors hidden md:block"
        >
          {isCollapsed ? <Menu className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* User profile capsule in collapsed size */}
      {!isCollapsed && user && (
        <div className="p-4 mx-3 my-4 rounded-xl bg-slate-800/40 border border-slate-800/60 flex items-center gap-3">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover border border-indigo-500/30"
          />
          <div className="overflow-hidden">
            <h4 className="font-semibold text-sm text-slate-100 truncate">
              {user.name}
            </h4>
            <p className="text-xs text-slate-400 truncate">
              {user.email}
            </p>
          </div>
        </div>
      )}

      {/* Navigation items */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1 scrollbar-thin scrollbar-thumb-slate-800">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative group overflow-hidden ${
                isActive 
                  ? 'text-indigo-300 bg-[#4F46E5]/20 font-semibold' 
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="active-nav-indicator"
                  className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-indigo-500 rounded-r-md"
                />
              )}
              <item.icon className={`w-5 h-5 shrink-0 transition-transform duration-200 ${isActive ? 'scale-110 text-indigo-400' : 'group-hover:scale-105'}`} />
              
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="truncate"
                >
                  {item.name}
                </motion.span>
              )}
            </button>
          );
        })}
      </div>

      {/* Storage and utilities panel */}
      <div className="p-3 border-t border-slate-800 space-y-4">
        {!isCollapsed && (
          <div className="p-3 rounded-xl bg-slate-800/30 border border-slate-800/50">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-2">
              <HardDrive className="w-3.5 h-3.5 text-[#06B6D4]" />
              <span>Storage Space</span>
              <span className="ml-auto text-[#06B6D4] font-bold">{storagePercentage.toFixed(1)}%</span>
            </div>
            
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#4F46E5] to-[#06B6D4] rounded-full"
                style={{ width: `${storagePercentage}%` }}
              />
            </div>
            
            <p className="text-[11px] text-slate-500 mt-1.5 font-medium">
              {formatBytes(totalUsed)} of {formatBytes(maxStorage)} used
            </p>
          </div>
        )}

        <div className="flex flex-col gap-1">
          {/* Light/Dark theme toggle button */}
          <button
            onClick={toggleTheme}
            className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-100 hover:bg-slate-800/40 transition-colors`}
          >
            {theme === 'light' ? (
              <>
                <Moon className="w-5 h-5 shrink-0 text-indigo-400 md:translate-x-0 cursor-pointer" />
                {!isCollapsed && <span>Dark Mode</span>}
              </>
            ) : (
              <>
                <Sun className="w-5 h-5 shrink-0 text-amber-400 md:translate-x-0 cursor-pointer" />
                {!isCollapsed && <span>Light Mode</span>}
              </>
            )}
          </button>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-950/20 transition-colors"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    </motion.div>
  );
};
