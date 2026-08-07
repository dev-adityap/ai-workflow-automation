// src/pages/ExecutionLogs.tsx
import { useState } from 'react';
import { Clock, CheckCircle2, AlertTriangle, RefreshCw, Trash2, Search, Filter } from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface LogItem {
  id: string;
  workflowName: string;
  trigger: string;
  status: 'Success' | 'Failed' | 'Running';
  duration: string;
  timestamp: string;
  details: string;
}

export const ExecutionLogs = () => {
  const { showToast } = useToast();
  const [filter, setFilter] = useState<'All' | 'Success' | 'Failed' | 'Running'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [logs, setLogs] = useState<LogItem[]>(() => {
    try {
      const saved = localStorage.getItem('execution_logs');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [
      { id: 'log-1', workflowName: 'AI Lead Enrichment Pipeline', trigger: 'Webhook Trigger', status: 'Success', duration: '420ms', timestamp: '2 mins ago', details: 'Payload received, OpenAI token generated, Slack message sent successfully.' },
      { id: 'log-2', workflowName: 'Customer Support Triage', trigger: 'Gmail Received', status: 'Success', duration: '850ms', timestamp: '15 mins ago', details: 'Email parsed successfully, categorized as High Priority, Jira ticket created.' },
      { id: 'log-3', workflowName: 'Stripe Payment Ingest', trigger: 'Stripe Webhook', status: 'Failed', duration: '1250ms', timestamp: '1 hour ago', details: 'Error 503: Connection timeout reaching downstream database server.' },
      { id: 'log-4', workflowName: 'GitHub CI/CD Notifier', trigger: 'GitHub Commit', status: 'Success', duration: '310ms', timestamp: '3 hours ago', details: 'Main branch build verified, notification dispatched to Discord channel.' },
    ];
  });

  const handleClearLogs = () => {
    setLogs([]);
    localStorage.removeItem('execution_logs');
    showToast('Execution logs cleared successfully.', 'info');
  };

  const handleRefresh = () => {
    showToast('Refreshed execution telemetry.', 'success');
  };

  const filteredLogs = logs.filter((log) => {
    const matchesFilter = filter === 'All' || log.status === filter;
    const matchesSearch = log.workflowName.toLowerCase().includes(searchQuery.toLowerCase()) || log.trigger.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-text">Execution Logs</h1>
          <p className="text-secondary-text mt-1">Real-time telemetry, trace history, and debugging metrics for your automated pipelines.</p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-secondary-background hover:bg-border text-text rounded-xl font-medium transition-colors border border-border cursor-pointer text-sm"
          >
            <RefreshCw size={16} /> Refresh
          </button>
          <button
            type="button"
            onClick={handleClearLogs}
            className="flex items-center gap-2 px-4 py-2 bg-secondary-background hover:bg-error/10 text-text hover:text-error rounded-xl font-medium transition-colors border border-border cursor-pointer text-sm"
          >
            <Trash2 size={16} /> Clear Logs
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-card border border-border p-4 rounded-2xl shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-3 text-secondary-text" size={16} />
          <input
            type="text"
            placeholder="Search logs by workflow name or trigger..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-background border border-border rounded-xl pl-9 pr-4 py-2 text-sm text-text focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <Filter size={14} className="text-secondary-text ml-1 mr-1" />
          {(['All', 'Success', 'Failed', 'Running'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                filter === tab
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-secondary-background text-secondary-text hover:text-text'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="divide-y divide-border">
          {filteredLogs.length > 0 ? (
            filteredLogs.map((log) => (
              <div key={log.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-secondary-background/50 transition-colors">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                      log.status === 'Success' ? 'bg-success/10 text-success' : log.status === 'Failed' ? 'bg-error/10 text-error' : 'bg-warning/10 text-warning animate-pulse'
                    }`}>
                      {log.status === 'Success' && <CheckCircle2 size={12} />}
                      {log.status === 'Failed' && <AlertTriangle size={12} />}
                      {log.status === 'Running' && <RefreshCw size={12} className="animate-spin" />}
                      {log.status}
                    </span>
                    <h3 className="text-base font-bold text-text">{log.workflowName}</h3>
                    <span className="text-xs font-mono text-secondary-text bg-background px-2 py-0.5 rounded-md border border-border">{log.trigger}</span>
                  </div>
                  <p className="text-xs text-secondary-text font-mono pl-1">{log.details}</p>
                </div>

                <div className="flex items-center gap-6 shrink-0 text-xs text-secondary-text font-medium">
                  <div className="flex items-center gap-1.5">
                    <Clock size={14} /> {log.duration}
                  </div>
                  <div className="bg-background px-3 py-1.5 rounded-xl border border-border">
                    {log.timestamp}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-secondary-text italic text-sm">
              No execution logs found matching your filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};