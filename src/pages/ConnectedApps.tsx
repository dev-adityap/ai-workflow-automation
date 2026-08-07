// src/pages/ConnectedApps.tsx
import { useState } from 'react';
import { CheckCircle2, Link2, Unlink } from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface AppIntegration {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: string;
  connected: boolean;
  account?: string;
}

export const ConnectedApps = () => {
  const { showToast } = useToast();
  const [apps, setApps] = useState<AppIntegration[]>(() => {
    try {
      const saved = localStorage.getItem('connected_apps');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [
      { id: 'slack', name: 'Slack', category: 'Communication', description: 'Send automated messages and alerts to channels.', icon: '🟢', connected: true, account: 'workspace.slack.com' },
      { id: 'gmail', name: 'Google Gmail', category: 'Email', description: 'Read, draft, and send emails via automated workflows.', icon: '✉️', connected: true, account: 'user@gmail.com' },
      { id: 'openai', name: 'OpenAI GPT-4o', category: 'Artificial Intelligence', description: 'Process text, analyze data, and generate smart summaries.', icon: '✨', connected: false },
      { id: 'github', name: 'GitHub', category: 'Development', description: 'Trigger workflows on pull requests, issues, and commits.', icon: '🐙', connected: false },
      { id: 'stripe', name: 'Stripe', category: 'Payments', description: 'Listen to payment events, invoices, and customer subscriptions.', icon: '💳', connected: false },
      { id: 'discord', name: 'Discord', category: 'Communication', description: 'Post rich embeds and notifications to Discord servers.', icon: '🤖', connected: false },
    ];
  });

  const handleToggleConnect = (appId: string) => {
    setApps((prev) => {
      const updated = prev.map((app) => {
        if (app.id === appId) {
          const nextState = !app.connected;
          if (nextState) {
            showToast(`Successfully connected to ${app.name}!`, 'success');
            return { ...app, connected: true, account: `active_${app.id}_account` };
          } else {
            showToast(`Disconnected from ${app.name}.`, 'info');
            return { ...app, connected: false, account: undefined };
          }
        }
        return app;
      });
      localStorage.setItem('connected_apps', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-text">Connected Apps</h1>
          <p className="text-secondary-text mt-1">Manage external platform integrations and OAuth connections for your workflow nodes.</p>
        </div>
        <span className="text-xs px-3 py-1.5 rounded-xl bg-primary/10 text-primary border border-primary/20 font-medium">
          {apps.filter(a => a.connected).length} of {apps.length} Connected
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {apps.map((app) => (
          <div key={app.id} className="p-6 bg-card border border-border rounded-2xl shadow-sm flex flex-col justify-between space-y-4 hover:border-primary/50 transition-all">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-2xl bg-secondary-background flex items-center justify-center text-2xl border border-border">
                  {app.icon}
                </div>
                {app.connected ? (
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success/10 text-success text-xs font-semibold">
                    <CheckCircle2 size={12} /> Connected
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary-background text-secondary-text text-xs font-semibold">
                    Disconnected
                  </span>
                )}
              </div>
              <div>
                <h3 className="text-base font-bold text-text">{app.name}</h3>
                <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">{app.category}</span>
                <p className="text-xs text-secondary-text mt-2 leading-relaxed">{app.description}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-border flex items-center justify-between">
              <span className="text-[11px] text-secondary-text truncate max-w-35">
                {app.account || 'Not authenticated'}
              </span>
              <button
                type="button"
                onClick={() => handleToggleConnect(app.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                  app.connected
                    ? 'bg-secondary-background hover:bg-error/10 text-text hover:text-error border border-border'
                    : 'bg-primary hover:bg-blue-600 text-white shadow-md shadow-primary/20'
                }`}
              >
                {app.connected ? <><Unlink size={14} /> Disconnect</> : <><Link2 size={14} /> Connect</>}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};