import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../context/AppContext';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, isLoading } = useAppState();
  const navigate = useNavigate();

  // Authentication validation wrapper
  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-bg dark:bg-[#0B0F19] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-brand-primary rounded-full animate-spin" />
        <p className="text-xs font-semibold text-brand-text-muted">Loading secure workspace files session...</p>
      </div>
    );
  }

  if (!user) {
    return null; // Route redirect will override
  }

  return (
    <div className="flex h-screen bg-brand-bg dark:bg-[#0B0F19] overflow-hidden font-sans">
      
      {/* Collapsible Sidebar */}
      <Sidebar />

      {/* Main Panel Content wrapper */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Unified Search Header */}
        <Header />

        {/* Scrollable contents card block */}
        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-6 md:py-8 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-zinc-800">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>

    </div>
  );
};
