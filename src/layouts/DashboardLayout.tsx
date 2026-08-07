// src/layouts/DashboardLayout.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileCode, Clock, BarChart3, Settings, User, Bot, Layers, Search, Globe, ChevronRight } from 'lucide-react';
import { useWorkflows } from '../context/WorkflowContext';
import { useLanguage } from '../context/LanguageContext';

export const DashboardLayout = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [compactSidebar, setCompactSidebar] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('app_settings') || '{}');
      return !!saved.compactSidebar;
    } catch {
      return false;
    }
  });

  const searchRef = useRef<HTMLDivElement>(null);
  const { workflows } = useWorkflows();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  // Listen for settings updates from the Settings page (Compact Sidebar & UI Animations)
  useEffect(() => {
    const handleSettingsChange = () => {
      try {
        const saved = JSON.parse(localStorage.getItem('app_settings') || '{}');
        setCompactSidebar(!!saved.compactSidebar);

        if (saved.animations === false) {
          document.documentElement.classList.add('no-animations');
        } else {
          document.documentElement.classList.remove('no-animations');
        }
      } catch {
        // fallback
      }
    };

    handleSettingsChange();
    window.addEventListener('app-settings-changed', handleSettingsChange);
    return () => window.removeEventListener('app-settings-changed', handleSettingsChange);
  }, []);

  // Close search dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleGlobalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const query = searchQuery.toLowerCase();
    if (query.includes('log')) navigate('/logs');
    else if (query.includes('setting')) navigate('/settings');
    else if (query.includes('analytic')) navigate('/analytics');
    else if (query.includes('app')) navigate('/apps');
    else if (query.includes('template')) navigate('/templates');
    else navigate('/');
    setIsFocused(false);
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
  };

  const filteredWorkflows = workflows.filter(w => 
    w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.trigger.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const navigationPages = [
    { name: t('dashboard'), path: '/', icon: LayoutDashboard },
    { name: t('builder'), path: '/builder', icon: FileCode },
    { name: t('templates'), path: '/templates', icon: Layers },
    { name: t('connectedApps'), path: '/apps', icon: Bot },
    { name: t('executionLogs'), path: '/logs', icon: Clock },
    { name: t('analytics'), path: '/analytics', icon: BarChart3 },
    { name: t('settings'), path: '/settings', icon: Settings },
    { name: t('profile'), path: '/profile', icon: User },
  ].filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="flex h-screen bg-background text-text overflow-hidden">
      {/* Sidebar */}
      <aside className={`border-r border-border bg-card flex flex-col shrink-0 transition-all duration-300 ${compactSidebar ? 'w-20' : 'w-64'}`}>
        <div className={`p-6 font-bold text-xl text-primary flex items-center ${compactSidebar ? 'justify-center' : 'gap-2'}`}>
          <Bot className="text-primary shrink-0" size={compactSidebar ? 24 : 20} />
          {!compactSidebar && <span>AI Automation</span>}
        </div>
        <nav className="flex-1 px-3 space-y-1.5 overflow-y-auto">
          <Link to="/" title={t('dashboard')} className={`flex items-center gap-3 px-3 py-2.5 hover:bg-secondary-background rounded-xl text-secondary-text hover:text-text transition-colors font-medium text-sm ${compactSidebar ? 'justify-center' : ''}`}>
            <LayoutDashboard size={18} className="shrink-0" />
            {!compactSidebar && <span>{t('dashboard')}</span>}
          </Link>
          <Link to="/builder" title={t('builder')} className={`flex items-center gap-3 px-3 py-2.5 hover:bg-secondary-background rounded-xl text-secondary-text hover:text-text transition-colors font-medium text-sm ${compactSidebar ? 'justify-center' : ''}`}>
            <FileCode size={18} className="shrink-0" />
            {!compactSidebar && <span>{t('builder')}</span>}
          </Link>
          <Link to="/templates" title={t('templates')} className={`flex items-center gap-3 px-3 py-2.5 hover:bg-secondary-background rounded-xl text-secondary-text hover:text-text transition-colors font-medium text-sm ${compactSidebar ? 'justify-center' : ''}`}>
            <Layers size={18} className="shrink-0" />
            {!compactSidebar && <span>{t('templates')}</span>}
          </Link>
          <Link to="/apps" title={t('connectedApps')} className={`flex items-center gap-3 px-3 py-2.5 hover:bg-secondary-background rounded-xl text-secondary-text hover:text-text transition-colors font-medium text-sm ${compactSidebar ? 'justify-center' : ''}`}>
            <Bot size={18} className="shrink-0" />
            {!compactSidebar && <span>{t('connectedApps')}</span>}
          </Link>
          
          <div className="pt-4 mt-4 border-t border-border">
            {!compactSidebar && <p className="px-3 text-xs font-semibold text-secondary-text uppercase tracking-wider mb-2">{t('monitoring')}</p>}
            <Link to="/logs" title={t('executionLogs')} className={`flex items-center gap-3 px-3 py-2.5 hover:bg-secondary-background rounded-xl text-secondary-text hover:text-text transition-colors font-medium text-sm ${compactSidebar ? 'justify-center' : ''}`}>
              <Clock size={18} className="shrink-0" />
              {!compactSidebar && <span>{t('executionLogs')}</span>}
            </Link>
            <Link to="/analytics" title={t('analytics')} className={`flex items-center gap-3 px-3 py-2.5 hover:bg-secondary-background rounded-xl text-secondary-text hover:text-text transition-colors font-medium text-sm ${compactSidebar ? 'justify-center' : ''}`}>
              <BarChart3 size={18} className="shrink-0" />
              {!compactSidebar && <span>{t('analytics')}</span>}
            </Link>
          </div>

          <div className="pt-4 mt-4 border-t border-border">
            {!compactSidebar && <p className="px-3 text-xs font-semibold text-secondary-text uppercase tracking-wider mb-2">{t('account')}</p>}
            <Link to="/settings" title={t('settings')} className={`flex items-center gap-3 px-3 py-2.5 hover:bg-secondary-background rounded-xl text-secondary-text hover:text-text transition-colors font-medium text-sm ${compactSidebar ? 'justify-center' : ''}`}>
              <Settings size={18} className="shrink-0" />
              {!compactSidebar && <span>{t('settings')}</span>}
            </Link>
            <Link to="/profile" title={t('profile')} className={`flex items-center gap-3 px-3 py-2.5 hover:bg-secondary-background rounded-xl text-secondary-text hover:text-text transition-colors font-medium text-sm ${compactSidebar ? 'justify-center' : ''}`}>
              <User size={18} className="shrink-0" />
              {!compactSidebar && <span>{t('profile')}</span>}
            </Link>
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="h-16 border-b border-border bg-card px-8 flex items-center justify-between shrink-0 relative z-30">
          <div className="relative w-96" ref={searchRef}>
            <form onSubmit={handleGlobalSearch}>
              <Search className="absolute left-3 top-2.5 text-secondary-text" size={16} />
              <input
                type="text"
                name="global_search"
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsFocused(true);
                }}
                onFocus={() => setIsFocused(true)}
                className="w-full bg-background border border-border rounded-xl pl-9 pr-4 py-2 text-sm text-text focus:outline-none focus:border-primary transition-colors"
              />
            </form>

            {/* Live Search Suggestions Dropdown */}
            {isFocused && (
              <div className="absolute top-12 left-0 right-0 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden z-50 p-2 space-y-3 animate-slide-in max-h-96 overflow-y-auto">
                <div>
                  <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-secondary-text">Matching Pages</p>
                  {navigationPages.length > 0 ? (
                    navigationPages.map((page) => {
                      const IconComp = page.icon;
                      return (
                        <button
                          key={page.path}
                          type="button"
                          onClick={() => {
                            navigate(page.path);
                            setIsFocused(false);
                            setSearchQuery('');
                          }}
                          className="w-full flex items-center justify-between px-3 py-2 hover:bg-secondary-background rounded-xl text-xs font-medium text-text transition-colors cursor-pointer text-left"
                        >
                          <span className="flex items-center gap-2"><IconComp size={14} className="text-primary" /> {page.name}</span>
                          <ChevronRight size={12} className="text-secondary-text" />
                        </button>
                      );
                    })
                  ) : (
                    <p className="px-3 py-1 text-xs text-secondary-text italic">No matching pages</p>
                  )}
                </div>

                <div className="border-t border-border pt-2">
                  <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-secondary-text">Workflows</p>
                  {filteredWorkflows.length > 0 ? (
                    filteredWorkflows.map((w) => (
                      <button
                        key={w.id}
                        type="button"
                        onClick={() => {
                          navigate('/builder');
                          setIsFocused(false);
                          setSearchQuery('');
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 hover:bg-secondary-background rounded-xl text-xs font-medium text-text transition-colors cursor-pointer text-left"
                      >
                        <span className="truncate">{w.name} <span className="text-[10px] text-secondary-text font-mono">({w.trigger})</span></span>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-success/10 text-success">{w.status}</span>
                      </button>
                    ))
                  ) : (
                    <p className="px-3 py-1 text-xs text-secondary-text italic">No matching workflows</p>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-card border border-border rounded-xl px-3 py-1.5 shadow-sm">
              <Globe size={14} className="text-secondary-text" />
              <select
                id="global-language-selector"
                name="global_language"
                value={language}
                onChange={handleLanguageChange}
                className="bg-card text-xs text-text focus:outline-none cursor-pointer"
              >
                <option value="English" className="bg-card text-text py-1">English</option>
                <option value="Spanish" className="bg-card text-text py-1">Spanish</option>
                <option value="French" className="bg-card text-text py-1">French</option>
                <option value="German" className="bg-card text-text py-1">German</option>
              </select>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-success/10 text-success border border-success/20 font-medium">
              {t('systemOnline')} ({workflows.length})
            </span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-background">
          <Outlet />
        </main>
      </div>
    </div>
  );
};