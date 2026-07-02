import React, { useState, useRef } from 'react';
import { useAppState } from '../context/AppContext';
import { 
  User, Mail, FileText, Activity, ShieldCheck, 
  Upload, Sparkles, HardDrive, Edit, Check, Calendar 
} from 'lucide-react';
import { formatBytes } from '../utils/storage';

export const Profile: React.FC = () => {
  const { user, files, folders, activityLogs, updateProfile, triggerNotification } = useAppState();

  const [nameVal, setNameVal] = useState(user?.name || '');
  const [emailVal, setEmailVal] = useState(user?.email || '');
  const [bioVal, setBioVal] = useState(user?.bio || '');
  const [avatarVal, setAvatarVal] = useState(user?.avatar || '');
  const [bannerVal, setBannerVal] = useState(user?.coverBanner || '');

  const [isEditing, setIsEditing] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const bytesUsed = files.reduce((acc, f) => acc + f.size, 0);
  const maxStorage = user?.maxStorage || 10 * 1024 * 1024 * 1024;
  const storagePercentage = Math.min((bytesUsed / maxStorage) * 100, 100);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameVal.trim() || !emailVal.trim()) {
      triggerNotification('Specify name and email parameters!', 'error');
      return;
    }

    updateProfile({
      name: nameVal,
      email: emailVal,
      bio: bioVal,
      avatar: avatarVal,
      coverBanner: bannerVal
    });
    setIsEditing(false);
  };

  // Drag and drop / file upload simulated avatars
  const handleAvatarFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const f = e.target.files[0];
      const r = new FileReader();
      r.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setAvatarVal(dataUrl);
        updateProfile({ avatar: dataUrl });
        triggerNotification('Avatar picture updated', 'success');
      };
      r.readAsDataURL(f);
    }
  };

  const handleBannerFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const f = e.target.files[0];
      const r = new FileReader();
      r.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setBannerVal(dataUrl);
        updateProfile({ coverBanner: dataUrl });
        triggerNotification('Cover backdrop updated', 'success');
      };
      r.readAsDataURL(f);
    }
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Cover Banner Drawer block with Profile details */}
      <div className="relative bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
        
        {/* Cover Graphic backdrop */}
        <div className="h-44 w-full relative overflow-hidden bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
          <img 
            src={bannerVal} 
            alt="Profile cover banner background" 
            className="w-full h-full object-cover opacity-80"
          />
          <button 
            onClick={() => bannerInputRef.current?.click()}
            className="absolute right-4 bottom-4 p-2 rounded-xl bg-white/25 hover:bg-white/40 text-white backdrop-blur-md transition-colors text-xs flex items-center gap-1.5 font-bold uppercase truncate"
          >
            <Upload className="w-3.5 h-3.5" /> Modify Cover
          </button>
          <input 
            type="file" 
            ref={bannerInputRef} 
            className="hidden" 
            onChange={handleBannerFileSelect} 
          />
        </div>

        {/* Profile identity overlay */}
        <div className="px-6 pb-6 relative pt-12 md:pt-4 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          
          <div className="flex flex-col md:flex-row items-center md:items-end gap-4 md:-mt-16 relative z-10">
            <div className="relative group cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
              <img
                src={avatarVal}
                alt={user?.name}
                className="w-24 h-24 rounded-3xl border-4 border-white dark:border-zinc-900 object-cover bg-white dark:bg-zinc-800 shadow-lg"
              />
              <div className="absolute inset-0 bg-black/40 rounded-3xl opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] uppercase font-bold transition-opacity">
                Upload
              </div>
            </div>
            
            <input 
              type="file" 
              ref={avatarInputRef} 
              className="hidden" 
              onChange={handleAvatarFileSelect} 
            />

            <div className="text-center md:text-left space-y-1">
              <h2 className="text-xl font-bold text-gray-950 dark:text-white">{user?.name}</h2>
              <p className="text-xs text-gray-450 dark:text-zinc-400">{user?.email}</p>
              <p className="text-xs italic text-gray-500 max-w-sm mt-1">{user?.bio}</p>
            </div>
          </div>

          <button
            onClick={() => {
              if (isEditing) handleProfileSave({} as any);
              else setIsEditing(true);
            }}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-transform hover:scale-103 shadow md:self-end cursor-pointer"
          >
            {isEditing ? (
              <>
                <Check className="w-4 h-4" /> Save Preferences
              </>
            ) : (
              <>
                <Edit className="w-4 h-4" /> Edit Profile Details
              </>
            )}
          </button>
        </div>
      </div>

      {isEditing && (
        <form onSubmit={handleProfileSave} className="p-6 bg-white dark:bg-zinc-900 border border-indigo-150/40 dark:border-zinc-805 rounded-3xl space-y-4">
          <h4 className="font-bold text-xs text-indigo-650 uppercase tracking-widest flex items-center gap-1.5 pb-2 border-b border-gray-50"><Sparkles className="w-4 h-4" /> Editing session specifications</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-500 uppercase">Interactive Screen Name</label>
              <input
                type="text"
                required
                value={nameVal}
                onChange={(e) => setNameVal(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-950/20 rounded-xl text-xs sm:text-xs"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-500 uppercase">Communications Email address</label>
              <input
                type="email"
                required
                value={emailVal}
                onChange={(e) => setEmailVal(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-955 rounded-xl text-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-500 uppercase">Workspace Biography details</label>
            <textarea
              rows={3}
              value={bioVal}
              onChange={(e) => setBioVal(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-955 rounded-xl text-xs leading-relaxed focus:outline-none"
            />
          </div>

          <div className="flex gap-2 justify-end">
            <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 text-xs font-semibold text-gray-400 hover:bg-gray-50">Discard edits</button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 shadow">Update Settings</button>
          </div>
        </form>
      )}

      {/* Storage and Activity stats summary row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Storage stats */}
        <div className="lg:col-span-5 p-6 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-804 rounded-3xl flex flex-col justify-between shadow-sm text-left space-y-4">
          <div>
            <h4 className="font-bold text-xs text-gray-650 uppercase tracking-widest flex items-center gap-1.5 pb-2 border-b border-gray-50 dark:border-zinc-850 mb-4"><HardDrive className="w-4 h-4 text-indigo-505" /> Storage Metrics</h4>
            
            <div className="space-y-3 pt-1">
              <div>
                <p className="text-[10px] text-gray-400">Total bytes used</p>
                <h3 className="text-2xl font-black text-gray-950 dark:text-white">{formatBytes(bytesUsed)}</h3>
              </div>
              <div className="h-2 w-full bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full" style={{ width: `${storagePercentage}%` }} />
              </div>
              <p className="text-[10px] text-gray-400">Allocated cloud node capacity: 10.00 GB</p>
            </div>
          </div>

          <div className="space-y-2 border-t border-gray-50 dark:border-zinc-850 pt-4 text-xs text-gray-405">
            <div className="flex justify-between"><span>Registered Files:</span> <span className="font-bold text-gray-800 dark:text-white">{files.length} uploads</span></div>
            <div className="flex justify-between"><span>Active Folders:</span> <span className="font-bold text-gray-800 dark:text-white">{folders.length} paths</span></div>
            <div className="flex justify-between"><span>Favorites Index:</span> <span className="font-bold text-gray-800 dark:text-white">{files.filter(x => x.isFavorite).length} items</span></div>
          </div>
        </div>

        {/* Timeline Log timeline */}
        <div className="lg:col-span-7 p-6 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-804 rounded-3xl flex flex-col justify-between shadow-sm text-left space-y-4">
          <div>
            <h4 className="font-bold text-xs text-gray-655 uppercase tracking-widest flex items-center gap-1.5 pb-2 border-b border-gray-50 dark:border-zinc-850 mb-4"><Activity className="w-4 h-4 text-indigo-505" /> Timeline Metrics</h4>
            
            {activityLogs.length === 0 ? (
              <div className="py-12 text-center text-gray-400 text-xs">Timeline logs index empty.</div>
            ) : (
              <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                {activityLogs.slice(0, 4).map((log, i) => (
                  <div key={i} className="flex gap-3 text-xs">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 ring-4 ring-indigo-50 dark:ring-indigo-950/25 shrink-0" />
                    <div className="space-y-0.5">
                      <p className="font-bold text-gray-800 dark:text-zinc-250 leading-none">{log.action}</p>
                      <p className="text-[10px] text-gray-400 leading-tight">Details: {log.details}</p>
                      <p className="text-[9px] text-gray-500 uppercase">{new Date(log.timestamp).toLocaleDateString()} @ {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
