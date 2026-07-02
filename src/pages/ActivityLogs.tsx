import React, { useState } from 'react';
import { useAppState } from '../context/AppContext';
import { Activity, Clock, Trash2, Shield, Calendar, Filter } from 'lucide-react';

export const ActivityLogs: React.FC = () => {
  const { activityLogs, setActivityLogsList, triggerNotification } = useAppState();
  const [activeFilter, setActiveFilter] = useState<'all' | 'upload' | 'download' | 'share' | 'transform' | 'system'>('all');

  const filteredLogs = activityLogs.filter(log => {
    if (activeFilter === 'all') return true;
    return log.type === activeFilter;
  });

  const handleClearActivityLogs = () => {
    localStorage.removeItem('file_trans_activity');
    setActivityLogsList([]);
    triggerNotification('Activity logs history database cleared', 'info');
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Overview Block */}
      <div className="flex items-center justify-between bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-805 p-5 rounded-2xl">
        <div>
          <h2 className="text-base font-bold text-gray-900 dark:text-white">Workspace Activity log</h2>
          <p className="text-xs text-gray-400">Chronological history record tracing operations executed inside your active workspace session.</p>
        </div>
        <button 
          onClick={handleClearActivityLogs}
          className="text-xs text-red-500 font-semibold hover:underline"
        >
          Clear activity logs
        </button>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-6 rounded-3xl space-y-6">
        
        {/* Filter selection bar */}
        <div className="flex flex-wrap items-center gap-2 pb-4 border-b border-gray-50 dark:border-zinc-850">
          <span className="text-xs font-black text-gray-400 uppercase tracking-widest mr-2 flex items-center gap-1"><Filter className="w-4 h-4" /> Filters:</span>
          {[
            { id: 'all', name: 'Show All Actions' },
            { id: 'upload', name: 'Uploaded files' },
            { id: 'download', name: 'Downloaded files' },
            { id: 'share', name: 'Shared files' },
            { id: 'transform', name: 'Transformations' },
            { id: 'system', name: 'Accounts / Systems' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id as any)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                activeFilter === f.id 
                  ? 'bg-indigo-600 border-indigo-650 text-white shadow-sm' 
                  : 'bg-gray-50 dark:bg-zinc-850 border-gray-100 dark:border-zinc-800 text-gray-500 hover:text-gray-800 dark:text-zinc-350'
              }`}
            >
              {f.name}
            </button>
          ))}
        </div>

        {filteredLogs.length === 0 ? (
          <div className="py-16 text-center text-gray-400 space-y-3">
            <Activity className="w-10 h-10 text-gray-300 dark:text-zinc-700 mx-auto" />
            <p className="font-bold text-xs text-gray-700 dark:text-zinc-300">No logs matching selected conditions found</p>
            <p className="text-[11px] text-gray-405 leading-relaxed">System operations will register logs automatically on action execution.</p>
          </div>
        ) : (
          <div className="relative border-l-2 border-gray-100 dark:border-zinc-800/80 ml-4 py-2 space-y-6 text-left">
            {filteredLogs.map((log) => (
              <div key={log.id} className="relative pl-6 group">
                {/* Visual timeline circle indicator */}
                <div className="absolute left-0 -translate-x-[calc(50%+1px)] top-1 w-3 h-3 bg-indigo-500 rounded-full border-4 border-white dark:border-zinc-900 select-none" />
                
                <div>
                  <div className="flex flex-wrap justify-between items-start gap-2">
                    <h5 className="font-bold text-xs text-gray-800 dark:text-zinc-200">{log.action}</h5>
                    <span className="text-[10px] text-gray-405 dark:text-zinc-500 flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {new Date(log.timestamp).toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">{log.details}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
