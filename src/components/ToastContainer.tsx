import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppState } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useAppState();

  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const isSuccess = toast.type === 'success';
          const isError = toast.type === 'error';
          
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8, y: -20, transition: { duration: 0.2 } }}
              className="pointer-events-auto flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 shadow-lg backdrop-blur-md"
            >
              <div className="flex items-center gap-3">
                {isSuccess && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                )}
                {isError && (
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                )}
                {!isSuccess && !isError && (
                  <Info className="w-5 h-5 text-indigo-500 shrink-0" />
                )}
                <span className="text-sm font-medium text-gray-800 dark:text-zinc-200">
                  {toast.message}
                </span>
              </div>
              
              <button 
                onClick={() => removeToast(toast.id)}
                className="ml-4 p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
