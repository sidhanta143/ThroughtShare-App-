import React, { useState } from 'react';
import { useAppState } from '../context/AppContext';
import { 
  Share2, Copy, Mail, Calendar, EyeOff, Lock, CheckCircle, 
  Trash2, ExternalLink, HardDrive, Info, Clock, Check
} from 'lucide-react';
import { formatBytes } from '../utils/storage';

export const SharedFiles: React.FC = () => {
  const { files, updateFile, deleteFile, triggerNotification } = useAppState();
  
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Mock Email Share Dialogue
  const [emailFileDialog, setEmailFileDialog] = useState<typeof files[0] | null>(null);
  const [emailInput, setEmailInput] = useState('');

  const sharedFiles = files.filter(f => f.shared?.isShared);

  const handleCopyLink = (file: typeof files[0]) => {
    const link = `${window.location.origin}/#/share/${file.shared?.linkId}`;
    navigator.clipboard.writeText(link);
    setCopiedId(file.id);
    triggerNotification('Share link copied to clipboard!', 'success');
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleEmailShare = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim() || !emailFileDialog) return;
    
    // Simulate email dispatch
    triggerNotification(`Forward email instructions securely sent to: ${emailInput}`, 'success');
    setEmailFileDialog(null);
    setEmailInput('');
  };

  const unshareFile = (fileId: string) => {
    updateFile(fileId, {
      shared: undefined
    });
    triggerNotification('File public link disabled successfully', 'info');
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Overview Block */}
      <div className="flex items-center justify-between bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-5 rounded-2xl">
        <div>
          <h2 className="text-base font-bold text-gray-900 dark:text-white">Active Security share index</h2>
          <p className="text-xs text-gray-400">Review public hooks, expires markers and passwords locks active on your files.</p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
          {sharedFiles.length} links active
        </span>
      </div>

      {sharedFiles.length === 0 ? (
        <div className="p-16 text-center bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-805 rounded-3xl space-y-4">
          <Share2 className="w-12 h-12 text-gray-300 dark:text-zinc-700 mx-auto" />
          <h4 className="font-bold text-gray-800 dark:text-zinc-200 text-sm">No files shared publicly</h4>
          <p className="text-xs text-gray-450 max-w-sm mx-auto">Configure secure sharing anchors under file property menus to see indexes here.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800/80 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-50 dark:border-zinc-850 bg-gray-50/50 dark:bg-zinc-955 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">
                <th className="py-3.5 px-4">File NAME</th>
                <th className="py-3.5 px-4 font-semibold">Shared timestamp</th>
                <th className="py-3.5 px-4">Expires ON</th>
                <th className="py-3.5 px-4">Pswd Protection</th>
                <th className="py-3.5 px-4">Downloads Count</th>
                <th className="py-3.5 px-4 text-right">Settings</th>
              </tr>
            </thead>
            <tbody>
              {sharedFiles.map((file) => {
                const s = file.shared!;
                return (
                  <tr key={file.id} className="border-b border-gray-50 dark:border-zinc-850/50 hover:bg-gray-50/20 dark:hover:bg-zinc-900/30 transition-colors text-xs text-gray-650 dark:text-zinc-250">
                    <td className="py-4 px-4 font-bold text-gray-800 dark:text-zinc-200">
                      <div className="flex flex-col">
                        <span>{file.name}</span>
                        <span className="text-[10px] text-gray-400 font-normal">{formatBytes(file.size)}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-450">
                      {new Date(s.sharedDate).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4 text-gray-450 font-medium">
                      {s.expiresAt ? (
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-indigo-505" /> {new Date(s.expiresAt).toLocaleDateString()}</span>
                      ) : (
                        <span className="text-emerald-500 font-bold">Never Expire</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      {s.isPasswordProtected ? (
                        <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-semibold"><Lock className="w-3.5 h-3.5 text-indigo-500 shrink-0" /> Password Locked ({s.password})</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-4 px-4 font-bold text-center pl-8">
                      {s.downloadCount} downloads
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button 
                          onClick={() => handleCopyLink(file)}
                          className="p-1.5 rounded-lg border border-gray-100 hover:border-gray-200 dark:border-zinc-800 dark:hover:bg-zinc-800 text-gray-500 hover:text-indigo-600 transition-colors cursor-pointer"
                          title="Copy Share Link"
                        >
                          {copiedId === file.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                        <button 
                          onClick={() => setEmailFileDialog(file)}
                          className="p-1.5 rounded-lg border border-gray-100 hover:border-gray-200 dark:border-zinc-800 dark:hover:bg-zinc-800 text-gray-500 hover:text-indigo-605 transition-colors cursor-pointer"
                          title="Email Link"
                        >
                          <Mail className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => unshareFile(file.id)}
                          className="p-1.5 rounded-lg border border-gray-100 hover:border-red-200 dark:border-zinc-800 dark:hover:bg-red-955/20 text-gray-405 hover:text-red-500 transition-colors cursor-pointer"
                          title="Remove sharing link"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* --- MOCK EMAIL DIALOG --- */}
      {emailFileDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/20 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl">
            <h4 className="font-extrabold text-sm text-gray-950 dark:text-white mb-2">Forward secure share instructions</h4>
            <p className="text-[10px] text-gray-400 mb-4 truncate">Asset target: {emailFileDialog.name}</p>
            
            <form onSubmit={handleEmailShare} className="space-y-4 text-left">
              <div className="space-y-1.5">
                <input
                  type="email"
                  required
                  placeholder="peer@partner-firm.com"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-955 rounded-xl text-xs text-gray-800 dark:text-zinc-100 focus:outline-none"
                />
              </div>

              <div className="flex gap-2 justify-end">
                <button type="button" onClick={() => setEmailFileDialog(null)} className="px-4 py-2 text-xs font-semibold text-gray-500 rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 shadow flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> Dispatch Mail</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
