import React from 'react';
import { useAppState } from '../context/AppContext';
import { 
  Download, History, Compass, CheckCircle2, XCircle, 
  RefreshCw, Play, Trash2, ArrowRight
} from 'lucide-react';
import { formatBytes } from '../utils/storage';

export const Downloads: React.FC = () => {
  const { downloads, setDownloads, startDownload, triggerNotification } = useAppState();

  const activeDownloads = downloads.filter(d => d.status === 'active');
  const completedDownloads = downloads.filter(d => d.status === 'completed');
  const failedDownloads = downloads.filter(d => d.status === 'failed');

  const triggerMockDownloadReboot = (name: string, size: number) => {
    startDownload(name, size);
    triggerNotification('Rebooting stream buffer...', 'info');
  };

  const clearDownloadsHistoryList = () => {
    localStorage.removeItem('file_trans_downloads');
    setDownloads([]);
    triggerNotification('Cleared download logs', 'info');
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Overview Block */}
      <div className="flex items-center justify-between bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-5 rounded-2xl">
        <div>
          <h2 className="text-base font-bold text-gray-900 dark:text-white">Active Download manager</h2>
          <p className="text-xs text-gray-400">Track active client-side chunk files fetching outputs and transaction histories.</p>
        </div>
        <button 
          onClick={clearDownloadsHistoryList}
          className="text-xs text-red-500 font-semibold hover:underline"
        >
          Clear histories
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Active download streams */}
        <div className="lg:col-span-7 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-6 rounded-3xl space-y-6">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-50 dark:border-zinc-850">
            <Compass className="w-4.5 h-4.5 text-indigo-505 animate-spin-slow" />
            <h4 className="font-bold text-xs text-gray-950 dark:text-white">Active download channels ({activeDownloads.length})</h4>
          </div>

          {activeDownloads.length === 0 ? (
            <div className="py-12 text-center text-gray-405 text-xs text-left">No ongoing downloads active. Request downloads on file system grids to see pipelines.</div>
          ) : (
            <div className="space-y-4">
              {activeDownloads.map((item) => (
                <div key={item.id} className="p-4 rounded-2xl bg-gray-50/50 dark:bg-zinc-950/20 border border-gray-100 dark:border-zinc-850 space-y-3">
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="truncate max-w-[200px] text-gray-800 dark:text-zinc-200">{item.name}</span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">{item.progress}%</span>
                  </div>
                  
                  <div className="h-2 w-full bg-gray-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all" style={{ width: `${item.progress}%` }} />
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                    <span>Speed: {item.speed || '2.4 MB/s'}</span>
                    <span>Remaining: {item.timeRemaining || 'Calculated...'}</span>
                    <span>Total size: {formatBytes(item.size)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Completed and failed status boards */}
        <div className="lg:col-span-5 bg-gradient-to-tr from-gray-900 to-zinc-950 text-white p-6 rounded-3xl flex flex-col justify-between shadow-xl min-h-[380px]">
          <div>
            <div className="flex justify-between items-center pb-4 border-b border-white/5 mb-4">
              <h4 className="font-extrabold text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400" /> Completed channels ({completedDownloads.length})
              </h4>
            </div>

            {completedDownloads.length === 0 ? (
              <div className="py-8 text-center text-zinc-550 text-xs">No compiled fetching recorded.</div>
            ) : (
              <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                {completedDownloads.slice(0, 4).map((d) => (
                  <div key={d.id} className="flex justify-between items-center bg-white/5 border border-white/5 p-2 rounded-xl text-xs">
                    <div className="truncate max-w-[180px]">
                      <p className="font-bold text-zinc-200 truncate">{d.name}</p>
                      <p className="text-[9px] text-zinc-500">{formatBytes(d.size)} • Fetched</p>
                    </div>
                    {/* Persistent download buttons remain functional */}
                    <button 
                      onClick={() => triggerMockDownloadReboot(d.name, d.size)}
                      className="p-1 px-2.5 bg-white/10 hover:bg-white/20 text-white rounded text-[10px] font-bold uppercase transition-colors shrink-0 cursor-pointer"
                      title="Download element"
                    >
                      Fetch
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Failed streams segment */}
            {failedDownloads.length > 0 && (
              <div className="mt-6 border-t border-white/5 pt-4">
                <h5 className="text-[11px] font-bold uppercase text-red-400 flex items-center gap-1.5 mb-2"><XCircle className="w-3.5 h-3.5" /> Failed transfers ({failedDownloads.length})</h5>
                <div className="space-y-1.5">
                  {failedDownloads.map((f) => (
                    <div key={f.id} className="flex justify-between items-center text-xs">
                      <span className="truncate max-w-[150px] text-zinc-400">{f.name}</span>
                      <button onClick={() => triggerMockDownloadReboot(f.name, f.size)} className="text-[10px] font-bold text-indigo-400 hover:underline">Reboot</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-white/5 pt-4 text-[10px] text-zinc-505 leading-tight">
            Persistent downloads buffers remain active across views.
          </div>
        </div>

      </div>

      {/* Transaction History log list */}
      <div className="p-6 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl space-y-4 text-left">
        <div className="flex items-center gap-2 pb-2 border-b border-gray-50 dark:border-zinc-850">
          <History className="w-4.5 h-4.5 text-indigo-505" />
          <h4 className="font-bold text-xs text-gray-900 dark:text-zinc-100">Historical downloading entries ({downloads.length})</h4>
        </div>

        {downloads.length === 0 ? (
          <div className="py-8 text-center text-gray-400 text-xs">Transactions ledger index is empty. Click files download options.</div>
        ) : (
          <div className="space-y-2 mt-2">
            {downloads.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 border border-gray-50 dark:border-zinc-850 rounded-xl hover:bg-gray-50/50 dark:hover:bg-zinc-950/20 text-xs">
                <div>
                  <p className="font-extrabold text-gray-700 dark:text-zinc-200">{item.name}</p>
                  <div className="flex gap-4 text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-semibold">
                    <span>Task Date: {new Date(item.timestamp).toLocaleString()}</span>
                    <span>Weight: {formatBytes(item.size)}</span>
                    <span className={item.status === 'completed' ? 'text-emerald-500 font-bold' : item.status === 'active' ? 'text-indigo-550 font-bold' : 'text-red-500 font-bold'}>
                      {item.status.toUpperCase()}
                    </span>
                  </div>
                </div>
                
                {/* Download option remains permanently visible */}
                <button 
                  onClick={() => triggerMockDownloadReboot(item.name, item.size)}
                  className="p-1.5 border border-gray-150 rounded-lg text-gray-450 hover:text-indigo-600 hover:bg-gray-50 cursor-pointer"
                  title="Download File"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
