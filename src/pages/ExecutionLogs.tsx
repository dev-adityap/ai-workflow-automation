
import { useState, useEffect } from 'react';
import { Activity, Clock, CheckCircle2, XCircle, Search, Trash2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';

// Standard fallback data for the very first time the app loads
const defaultLogs = [
  { id: 'log-1', workflowName: 'AI Lead Enrichment Pipeline', trigger: 'Webhook Trigger', status: 'Success', duration: '842ms', timestamp: '2 mins ago', details: 'Payload parsed and AI summarization successful.' },
  { id: 'log-2', workflowName: 'Customer Support Triage', trigger: 'Gmail Received', status: 'Failed', duration: '124ms', timestamp: '1 hour ago', details: 'API Rate limit exceeded on OpenAI connector.' },
];

export const ExecutionLogs = () => {
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  
  // SMARTER INITIALIZATION: 
  // It only loads default logs if the key is strictly null (never created).
  // If it is '[]' (cleared), it will safely load the empty array.
  const [logs, setLogs] = useState(() => {
    try {
      const saved = localStorage.getItem('execution_logs');
      if (saved !== null) {
        return JSON.parse(saved); // Will return [] if cleared
      }
    } catch {
      // Fallback on error
    }
    return defaultLogs;
  });

  // Sync state changes back to LocalStorage
  useEffect(() => {
    localStorage.setItem('execution_logs', JSON.stringify(logs));
  }, [logs]);

  const handleClearLogs = () => {
    setLogs([]); // Set to empty array
    showToast('All execution logs have been cleared', 'info');
  };

  const filteredLogs = logs.filter((log: any) => 
    log.workflowName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.trigger.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text">Execution Logs</h1>
          <p className="text-secondary-text mt-1">Monitor real-time pipeline executions, trace errors, and review payload histories.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-text" />
            <input
              type="text"
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-card border border-border rounded-xl text-sm text-text focus:outline-none focus:border-primary w-64 shadow-sm"
            />
          </div>
          <button
            type="button"
            onClick={handleClearLogs}
            disabled={logs.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-secondary-background hover:bg-error/10 text-secondary-text hover:text-error rounded-xl text-sm font-medium transition-colors border border-border cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 size={16} /> Clear Logs
          </button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        {filteredLogs.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center text-secondary-text space-y-3">
            <Activity size={32} className="opacity-40" />
            <p className="text-sm font-medium">No execution logs found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-secondary-background/50 border-b border-border">
                  <th className="px-6 py-4 text-xs font-bold text-secondary-text uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-secondary-text uppercase tracking-wider">Workflow</th>
                  <th className="px-6 py-4 text-xs font-bold text-secondary-text uppercase tracking-wider">Trigger</th>
                  <th className="px-6 py-4 text-xs font-bold text-secondary-text uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-4 text-xs font-bold text-secondary-text uppercase tracking-wider">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredLogs.map((log: any) => (
                  <tr key={log.id} className="hover:bg-secondary-background/20 transition-colors group">
                    <td className="px-6 py-4">
                      {log.status === 'Success' ? (
                        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success/10 text-success text-xs font-semibold w-fit">
                          <CheckCircle2 size={14} /> Success
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-error/10 text-error text-xs font-semibold w-fit">
                          <XCircle size={14} /> Failed
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-text">{log.workflowName}</p>
                      <p className="text-[11px] text-secondary-text mt-1 max-w-xs truncate">{log.details}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-secondary-text font-mono">{log.trigger}</td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1 text-xs font-mono text-secondary-text">
                        <Clock size={12} /> {log.duration}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-secondary-text">{log.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};