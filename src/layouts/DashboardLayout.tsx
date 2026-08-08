// src/layouts/DashboardLayout.tsx
import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  LayoutGrid, Zap, Layers, Link as LinkIcon, 
  Clock, BarChart3, Settings, User, 
  Search, Globe, Bot, Menu, X 
} from 'lucide-react';
import { AIAssistant } from '../components/ai/AIAssistant';

export const DashboardLayout = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Auto-close the mobile menu whenever the user clicks a link and the route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navGroups = [
    {
      items: [
        { name: 'Dashboard', path: '/', icon: LayoutGrid },
        { name: 'Builder', path: '/builder', icon: Zap },
        { name: 'Templates', path: '/templates', icon: Layers },
        { name: 'Connected Apps', path: '/apps', icon: LinkIcon },
      ]
    },
    {
      title: 'MONITORING',
      items: [
        { name: 'Execution Logs', path: '/logs', icon: Clock },
        { name: 'Analytics', path: '/analytics', icon: BarChart3 },
      ]
    },
    {
      title: 'ACCOUNT',
      items: [
        { name: 'Settings', path: '/settings', icon: Settings },
        { name: 'Profile', path: '/profile', icon: User },
      ]
    }
  ];

  return (
    <div className="flex h-screen bg-background overflow-hidden relative">
      
      {/* Mobile Menu Overlay - Darkens the background when sidebar is open on phones */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Fixed on mobile (slides in), relative on desktop */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border flex flex-col
        transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-border shrink-0">
          <div className="flex items-center gap-2.5 text-primary font-bold text-lg tracking-tight">
            <Bot size={24} /> AI Automation
          </div>
          {/* Close button for mobile inside the sidebar */}
          <button 
            className="md:hidden text-secondary-text hover:text-text cursor-pointer p-1"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-8 no-scrollbar">
          {navGroups.map((group, idx) => (
            <div key={idx} className="space-y-1">
              {group.title && (
                <h4 className="px-3 mb-3 text-[10px] font-bold uppercase tracking-wider text-secondary-text">
                  {group.title}
                </h4>
              )}
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-secondary-text hover:bg-secondary-background hover:text-text'
                    }`}
                  >
                    <Icon size={18} className={isActive ? 'text-primary' : 'text-secondary-text'} />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content Area - 'min-w-0' is the flexbox magic that prevents horizontal blowing out */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* Top Header */}
        <header className="h-16 bg-card border-b border-border px-4 md:px-8 flex items-center justify-between shrink-0 z-10">
          
          {/* Mobile Hamburger Button */}
          <button 
            className="md:hidden p-2 -ml-2 text-secondary-text hover:text-text rounded-lg"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>

          <div className="hidden md:flex flex-1 max-w-xl relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-text" />
            <input
              type="text"
              placeholder="Search workflows, logs, settings..."
              className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-2 text-sm text-text focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div className="flex items-center gap-3 md:gap-4 ml-auto">
            <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-secondary-background text-sm font-medium text-text transition-colors">
              <Globe size={16} className="text-secondary-text" /> English
            </button>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-background border border-border rounded-xl">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-xs font-semibold text-text hidden sm:inline-block">System Online</span>
              <span className="text-xs font-semibold text-text sm:hidden">Online</span>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="flex-1 overflow-y-auto bg-background">
          <Outlet />
        </div>
      </main>

      <AIAssistant />
    </div>
  );
};