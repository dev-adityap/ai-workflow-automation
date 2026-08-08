// src/pages/ConnectedApps.tsx
import { useState, useEffect } from 'react';
import { CheckCircle2, Plus,  Globe } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const initialApps = [
  { id: 'slack', name: 'Slack', category: 'Communication', description: 'Send automated webhook alerts and channel notifications.', connected: false },
  { id: 'gmail', name: 'Gmail', category: 'Productivity', description: 'Trigger workflows automatically when incoming emails arrive.', connected: false },
  { id: 'openai', name: 'OpenAI GPT-4', category: 'Artificial Intelligence', description: 'Perform intelligent text summarization and payload extraction.', connected: false },
  { id: 'stripe', name: 'Stripe', category: 'Billing & Payments', description: 'Capture payment events, subscriptions, and checkout failures.', connected: false },
  { id: 'postgres', name: 'PostgreSQL', category: 'Database', description: 'Execute secure CRUD transactions and audit logging.', connected: false },
  { id: 'github', name: 'GitHub', category: 'Developer Tools', description: 'Automate issue tracking, PR reviews, and CI/CD pipelines.', connected: false },
];

export const ConnectedApps = () => {
  const { showToast } = useToast();
  const [apps, setApps] = useState(() => {
    try {
      const saved = localStorage.getItem('connected_apps_state');
      if (saved) return JSON.parse(saved);
    } catch {}
    return initialApps;
  });

  useEffect(() => {
    localStorage.setItem('connected_apps_state', JSON.stringify(apps));
  }, [apps]);

  const toggleConnect = (id: string, name: string, currentState: boolean) => {
    setApps((prev: any[]) => prev.map(app => app.id === id ? { ...app, connected: !currentState } : app));
    if (!currentState) {
      showToast(`Successfully connected to ${name}!`, 'success');
    } else {
      showToast(`Disconnected from ${name}`, 'info');
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text">Connected Integrations</h1>
          <p className="text-secondary-text mt-1">Manage API credentials, OAuth grants, and third-party service connectors.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1.5 rounded-xl bg-primary/10 text-primary border border-primary/20 font-medium">
            Active Integrations: {apps.filter((a: any) => a.connected).length} / {apps.length}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {apps.map((app: any) => (
          <div key={app.id} className="p-6 bg-card border border-border rounded-2xl shadow-sm flex flex-col justify-between space-y-6 hover:border-primary/50 transition-all">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-secondary-background border border-border rounded-xl text-primary">
                  <Globe size={22} />
                </div>
                {app.connected ? (
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-success/10 text-success text-xs font-semibold">
                    <CheckCircle2 size={14} /> Connected
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-background text-secondary-text text-xs font-semibold">
                    Disconnected
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-base font-bold text-text">{app.name}</h3>
                <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">{app.category}</span>
                <p className="text-xs text-secondary-text mt-2">{app.description}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => toggleConnect(app.id, app.name, app.connected)}
              className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium transition-colors cursor-pointer border ${
                app.connected
                  ? 'bg-secondary-background hover:bg-error/10 text-text hover:text-error border-border'
                  : 'bg-primary hover:bg-blue-600 text-white border-transparent shadow-md shadow-primary/20'
              }`}
            >
              {app.connected ? 'Disconnect' : <><Plus size={14} /> Connect Service</>}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};