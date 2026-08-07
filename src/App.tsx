// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout';
import { Dashboard } from './pages/Dashboard';
import { Builder } from './pages/Builder';
import { ConnectedApps } from './pages/ConnectedApps';
import { ExecutionLogs } from './pages/ExecutionLogs';
import { Analytics } from './pages/Analytics';
import { Settings } from './pages/Settings';
import { Profile } from './pages/Profile';
import { Templates } from './pages/Templates';
import { AIAssistant } from './components/ai/AIAssistant';

// Simple mockup providers for Theme and Language if you haven't created them yet
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { ToastProvider } from './context/ToastContext';
import { WorkflowProvider } from './context/WorkflowContext';

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <ToastProvider>
          <WorkflowProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<DashboardLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="builder" element={<Builder />} />
                  <Route path="apps" element={<ConnectedApps />} />
                  <Route path="logs" element={<ExecutionLogs />} />
                  <Route path="analytics" element={<Analytics />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="templates" element={<Templates />} />
                </Route>
              </Routes>
              {/* AI Assistant is rendered globally above the layout */}
              <AIAssistant />
            </BrowserRouter>
          </WorkflowProvider>
        </ToastProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;