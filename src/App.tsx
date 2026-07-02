import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { ToastContainer } from './components/ToastContainer';
import { DashboardLayout } from './components/DashboardLayout';

// Sub Page routing imports
import { Landing } from './pages/Landing';
import { Auth } from './pages/Auth';
import { DashboardHome } from './pages/DashboardHome';
import { FileManager } from './pages/FileManager';
import { Transformations } from './pages/Transformations';
import { SharedFiles } from './pages/SharedFiles';
import { Downloads } from './pages/Downloads';
import { ActivityLogs } from './pages/ActivityLogs';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';

export default function App() {
  return (
    <AppProvider>
      <HashRouter>
        <Routes>
          {/* Public Landing route */}
          <Route path="/" element={<Landing />} />
          
          {/* Authentication login/register route */}
          <Route path="/auth" element={<Auth />} />

          {/* Secure Dashboard router indexes */}
          <Route 
            path="/dashboard" 
            element={
              <DashboardLayout>
                <DashboardHome />
              </DashboardLayout>
            } 
          />
          
          <Route 
            path="/dashboard/files" 
            element={
              <DashboardLayout>
                <FileManager />
              </DashboardLayout>
            } 
          />

          <Route 
            path="/dashboard/folders" 
            element={
              <DashboardLayout>
                <FileManager />
              </DashboardLayout>
            } 
          />

          <Route 
            path="/dashboard/transformations" 
            element={
              <DashboardLayout>
                <Transformations />
              </DashboardLayout>
            } 
          />

          <Route 
            path="/dashboard/shared" 
            element={
              <DashboardLayout>
                <SharedFiles />
              </DashboardLayout>
            } 
          />

          <Route 
            path="/dashboard/downloads" 
            element={
              <DashboardLayout>
                <Downloads />
              </DashboardLayout>
            } 
          />

          <Route 
            path="/dashboard/favorites" 
            element={
              <DashboardLayout>
                <FileManager />
              </DashboardLayout>
            } 
          />

          <Route 
            path="/dashboard/activity" 
            element={
              <DashboardLayout>
                <ActivityLogs />
              </DashboardLayout>
            } 
          />

          <Route 
            path="/dashboard/profile" 
            element={
              <DashboardLayout>
                <Profile />
              </DashboardLayout>
            } 
          />

          <Route 
            path="/dashboard/settings" 
            element={
              <DashboardLayout>
                <Settings />
              </DashboardLayout>
            } 
          />

          {/* Clean fallback redirects */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
      
      {/* Dynamic Status Notification Popups list */}
      <ToastContainer />
    </AppProvider>
  );
}
