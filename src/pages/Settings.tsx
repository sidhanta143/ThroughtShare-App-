import React, { useState } from 'react';
import { useAppState } from '../context/AppContext';
import { 
  Settings as SettingsIcon, Moon, Sun, Bell, Shield, 
  Globe, HardDrive, RefreshCw, Eye, Download, 
  Trash2, FileCode, CheckCircle 
} from 'lucide-react';

export const Settings: React.FC = () => {
  const { theme, toggleTheme, user, files, folders, logout, triggerNotification } = useAppState();

  const [notificationState, setNotificationState] = useState({
    transComplete: true,
    fileShares: false,
    storageWarning: true,
    weeklyLedger: false,
  });

  const [languagePreference, setLanguagePreference] = useState('en-US');
  
  // Security Reset Variables
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [selectedMfa, setSelectedMfa] = useState(false);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      triggerNotification('Fulfill password verification conditions.', 'error');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      triggerNotification('Confirmation password mismatch.', 'error');
      return;
    }
    if (newPassword.length < 6) {
      triggerNotification('Password require at least 6 characters.', 'error');
      return;
    }

    triggerNotification('Security password rotated successfully!', 'success');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
  };

  const handleNotificationsToggle = (key: keyof typeof notificationState) => {
    setNotificationState(prev => {
      const next = { ...prev, [key]: !prev[key] };
      triggerNotification('Notification preferences altered.', 'success');
      return next;
    });
  };

  const exportWorkspaceDetailsState = () => {
    const fullState = {
      system: 'TransForma Engine v3.0 Base Mapped state',
      exportDate: new Date().toISOString(),
      user,
      filesCount: files.length,
      foldersCount: folders.length,
      filesSchema: files.map(f => ({ name: f.name, size: f.size, type: f.type, isShared: f.shared?.isShared || false })),
      foldersSchema: folders.map(fol => ({ name: fol.name }))
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fullState, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href",     dataStr);
    dlAnchor.setAttribute("download", `TransForma_Backup_${Date.now()}.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    document.body.removeChild(dlAnchor);
    triggerNotification('Workspace specs exported successfully!', 'success');
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Overview Block */}
      <div className="flex items-center justify-between bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-805 p-5 rounded-2xl">
        <div>
          <h2 className="text-base font-bold text-gray-900 dark:text-white">Workspace Control center</h2>
          <p className="text-xs text-gray-400">Configure global dark modes overlays, email notification routers and multi-mfa security.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Settings options Column */}
        <div className="lg:col-span-7 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-6 rounded-3xl space-y-6">
          
          {/* Theme overlay configuration */}
          <div className="space-y-4">
            <h4 className="font-bold text-xs text-indigo-650 uppercase tracking-widest flex items-center gap-1.5 pb-2 border-b border-gray-50 dark:border-zinc-850"><Sun className="w-4 h-4 text-indigo-505" /> Visual presets</h4>
            <div className="flex gap-4 items-center justify-between bg-gray-50/50 dark:bg-zinc-950/20 p-4 border border-gray-100 dark:border-zinc-850 rounded-2xl">
              <div>
                <p className="text-xs font-bold text-gray-800 dark:text-zinc-200">Toggle dark overrides</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Adapt screen luminance to minimize ocular stress.</p>
              </div>
              <button
                onClick={toggleTheme}
                className="px-4 py-2 bg-indigo-650 hover:bg-indigo-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                <span>Use {theme === 'light' ? 'Dark theme' : 'Light theme'}</span>
              </button>
            </div>
          </div>

          {/* Email Notification routers */}
          <div className="space-y-4 pt-2">
            <h4 className="font-bold text-xs text-indigo-650 uppercase tracking-widest flex items-center gap-1.5 pb-2 border-b border-gray-50 dark:border-zinc-850"><Bell className="w-4 h-4 text-indigo-550" /> Email Notifications</h4>
            
            <div className="space-y-2 text-xs">
              {[
                { key: 'transComplete', title: 'File transformations completion alerts', desc: 'Recieve active notifications when PDF, DOCX or JPG canvas transforms complete.' },
                { key: 'fileShares', title: 'Asset share download alerts', desc: 'Inform email handles when someone accesses secure sharing links.' },
                { key: 'storageWarning', title: '90% Storage warning alarms', desc: 'Recieve notification cues when reaching standard threshold allocations.' }
              ].map((item) => (
                <label key={item.key} className="flex items-start gap-3 p-3 bg-gray-50/10 dark:bg-zinc-950/20 border border-gray-100 dark:border-zinc-850 rounded-xl cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationState[item.key as keyof typeof notificationState]}
                    onChange={() => handleNotificationsToggle(item.key as any)}
                    className="rounded border-gray-200 text-indigo-605 focus:ring-indigo-500 w-4.5 h-4.5 shrink-0 mt-0.5"
                  />
                  <div>
                    <p className="font-bold text-gray-800 dark:text-zinc-200">{item.title}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Language Preferences */}
          <div className="space-y-4 pt-2">
            <h4 className="font-bold text-xs text-indigo-650 uppercase tracking-widest flex items-center gap-1.5 pb-2 border-b border-gray-50 dark:border-zinc-850"><Globe className="w-4 h-4 text-indigo-550" /> Language Preferences</h4>
            <div className="space-y-1.5">
              <select
                value={languagePreference}
                onChange={(e) => { setLanguagePreference(e.target.value); triggerNotification('Local system language altered.', 'success'); }}
                className="w-full px-4 py-3 border border-gray-105 bg-gray-50/30 dark:border-zinc-800 dark:bg-zinc-950/20 rounded-xl text-xs text-gray-700 dark:text-zinc-250 focus:outline-none focus:border-indigo-500"
              >
                <option value="en-US">English (United States) - US</option>
                <option value="es-ES">Spanish (Castilian) - ES</option>
                <option value="fr-FR">French (Standard) - FR</option>
                <option value="ja-JP">Japanese (Nihongo) - JP</option>
              </select>
            </div>
          </div>

        </div>

        {/* Security configuration column */}
        <div className="lg:col-span-5 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-6 rounded-3xl space-y-6 flex flex-col justify-between">
          
          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-50 dark:border-zinc-850">
              <Shield className="w-4.5 h-4.5 text-indigo-550" />
              <h4 className="font-bold text-xs text-gray-950 dark:text-white">Account security overrides</h4>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4 text-xs text-left">
              <div className="space-y-1.5">
                <label className="font-bold text-gray-550 dark:text-zinc-400">Current Security Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-100 dark:border-zinc-805 bg-gray-50/50 dark:bg-zinc-950/20 rounded-xl focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-gray-550 dark:text-zinc-400">Specify New Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-100 dark:border-zinc-805 bg-gray-50/50 dark:bg-zinc-950/20 rounded-xl focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-gray-550 dark:text-zinc-400">Confirm New Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-100 dark:border-zinc-805 bg-gray-50/50 dark:bg-zinc-950/20 rounded-xl focus:outline-none"
                />
              </div>

              <button 
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow transition-transform hover:scale-102 cursor-pointer"
              >
                Rotate Security Credentials
              </button>
            </form>

            {/* MFA selection block */}
            <div className="space-y-3 pt-4 border-t border-gray-50 dark:border-zinc-850">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedMfa}
                  onChange={(e) => { setSelectedMfa(e.target.checked); triggerNotification(`Multi-factor verification ${e.target.checked ? 'enabled' : 'disabled'}`, 'info'); }}
                  className="rounded border-gray-200 text-indigo-650 focus:ring-indigo-500 w-4.5 h-4.5 shrink-0 mt-0.5"
                />
                <div>
                  <p className="font-bold text-xs text-gray-800 dark:text-zinc-200 leading-none">Enable Multi-factor Auth (MFA)</p>
                  <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">Request secure OTP codes upon account credentials access verification triggers.</p>
                </div>
              </label>
            </div>
          </div>

          {/* Export utility backups trigger */}
          <div className="pt-6 border-t border-gray-50 dark:border-zinc-850 space-y-3 text-left">
            <div>
              <p className="text-xs font-bold text-gray-805 dark:text-zinc-250">Export local telemetry state</p>
              <p className="text-[10px] text-gray-400 leading-tight">Backup file systems mappings and transformation histories logs locally.</p>
            </div>
            <button
              onClick={exportWorkspaceDetailsState}
              className="w-full py-3 bg-gray-900 dark:bg-zinc-800 hover:bg-black text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <FileCode className="w-4 h-4" /> Export Backup specs (.json)
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
