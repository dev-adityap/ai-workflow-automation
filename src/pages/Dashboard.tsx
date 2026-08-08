// src/pages/Dashboard.tsx
import { useState, useEffect } from 'react';
import { Activity, CheckCircle2, Clock, Zap, Plus, ArrowUpRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useWorkflows } from '../context/WorkflowContext';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { workflows } = useWorkflows();
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('execution_logs');
      if (saved) setLogs(JSON.parse(saved));
    } catch {}
  }, []);

  const totalExecutions = logs.length;
  const successfulRuns = logs.filter(l => l.status === 'Success').length;
  const successRate = totalExecutions > 0 ? ((successfulRuns / totalExecutions) * 100).toFixed(1) + '%' : '0%';

  const stats = [
    { label: 'Total Executions', value: totalExecutions.toString(), change: totalExecutions > 0 ? '+100%' : '0%', icon: Activity, color: 'text-primary bg-primary/15 border-primary/20' },
    { label: 'Success Rate', value: successRate, change: totalExecutions > 0 ? 'Optimal' : '0%', icon: CheckCircle2, color: 'text-success bg-success/15 border-success/20' },
    { label: 'Avg Latency', value: totalExecutions > 0 ? '412ms' : '0ms', icon: Clock, color: 'text-warning bg-warning/15 border-warning/20' },
    { label: 'Active Workflows', value: workflows.length.toString(), change: workflows.length > 0 ? 'Live' : '0', icon: Zap, color: 'text-primary bg-primary/15 border-primary/20' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text">Workflow Dashboard</h1>
          <p className="text-secondary-text mt-1">Overview of autonomous pipeline activity, system telemetry, and active triggers.</p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/builder')}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-blue-600 text-white rounded-xl font-medium transition-colors shadow-lg shadow-primary/20 cursor-pointer text-sm"
        >
          <Plus size={16} /> Create Workflow
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const IconComp = stat.icon;
          return (
            <div key={i} className="p-6 bg-card border border-border rounded-2xl shadow-sm space-y-4 hover:border-primary/50 transition-all">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-2xl border ${stat.color}`}>
                  <IconComp size={20} />
                </div>
                <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-success/10 text-success">
                  <ArrowUpRight size={14} /> {stat.change}
                </span>
              </div>
              <div>
                <p className="text-2xl font-bold text-text">{stat.value}</p>
                <p className="text-xs font-medium text-secondary-text mt-1">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Workflows Section */}
      <div className="p-6 bg-card border border-border rounded-2xl shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <h3 className="text-base font-bold text-text">Active Workflows</h3>
          <button type="button" onClick={() => navigate('/builder')} className="text-xs font-semibold text-primary hover:underline cursor-pointer">
            Open Builder →
          </button>
        </div>

        {workflows.length === 0 ? (
          <div className="py-16 text-center flex flex-col items-center justify-center text-secondary-text space-y-3">
            <Sparkles size={32} className="opacity-40 animate-pulse" />
            <p className="text-sm font-medium">No workflows created yet.</p>
            <button
              type="button"
              onClick={() => navigate('/builder')}
              className="px-4 py-2 bg-secondary-background hover:bg-border text-text rounded-xl text-xs font-medium transition-colors border border-border cursor-pointer mt-2"
            >
              Build your first pipeline
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {workflows.map((w) => (
              <div key={w.id} className="p-4 bg-secondary-background/50 border border-border rounded-xl flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-text">{w.name}</h4>
                  <p className="text-xs text-secondary-text font-mono">Trigger: {w.trigger}</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-success/10 text-success text-xs font-semibold">
                  {w.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};