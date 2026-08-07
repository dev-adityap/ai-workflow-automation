
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Plus, Play, CheckCircle2, ArrowRight, Layers, Bot, Activity } from 'lucide-react';
import { useWorkflows } from '../context/WorkflowContext';
import { useToast } from '../context/ToastContext';

export const Dashboard = () => {
  const { workflows, deleteWorkflow } = useWorkflows();
  const { showToast } = useToast();
  const [runningId, setRunningId] = useState<string | null>(null);

  const handleRunWorkflow = async (id: string, name: string) => {
    setRunningId(id);
    showToast(`Running workflow: ${name}...`, 'info');
    await new Promise((res) => setTimeout(res, 1200));
    setRunningId(null);
    showToast(`Workflow "${name}" executed successfully!`, 'success');
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      
      <div className="p-8 bg-linear-to-r from-primary/20 via-card to-card border border-border rounded-3xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 font-semibold uppercase tracking-wider">
            System Operational
          </span>
          <h1 className="text-3xl font-bold text-text">Welcome back, Architect 👋</h1>
          <p className="text-sm text-secondary-text max-w-xl">
            Your AI workflow automation pipelines are running smoothly. Build new integrations, monitor execution logs, or use the AI Assistant to spin up complex automations instantly.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/builder"
            className="flex items-center gap-2 px-5 py-3 bg-primary hover:bg-blue-600 text-white rounded-2xl font-medium transition-all shadow-lg shadow-primary/20 cursor-pointer text-sm"
          >
            <Plus size={18} /> Create Workflow
          </Link>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 bg-card border border-border rounded-2xl shadow-sm space-y-2">
          <div className="flex items-center justify-between text-secondary-text">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Workflows</span>
            <Zap size={18} className="text-primary" />
          </div>
          <p className="text-3xl font-bold text-text">{workflows.length}</p>
          <p className="text-xs text-success flex items-center gap-1 font-medium"><CheckCircle2 size={12} /> All nodes synced</p>
        </div>

        <div className="p-6 bg-card border border-border rounded-2xl shadow-sm space-y-2">
          <div className="flex items-center justify-between text-secondary-text">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Executions</span>
            <Activity size={18} className="text-success" />
          </div>
          <p className="text-3xl font-bold text-text">14,832</p>
          <p className="text-xs text-secondary-text">Last 7 days</p>
        </div>

        <div className="p-6 bg-card border border-border rounded-2xl shadow-sm space-y-2">
          <div className="flex items-center justify-between text-secondary-text">
            <span className="text-xs font-semibold uppercase tracking-wider">Success Rate</span>
            <CheckCircle2 size={18} className="text-success" />
          </div>
          <p className="text-3xl font-bold text-text">98.7%</p>
          <p className="text-xs text-success font-medium">+0.4% from last week</p>
        </div>

        <div className="p-6 bg-card border border-border rounded-2xl shadow-sm space-y-2">
          <div className="flex items-center justify-between text-secondary-text">
            <span className="text-xs font-semibold uppercase tracking-wider">Connected Integrations</span>
            <Bot size={18} className="text-primary" />
          </div>
          <p className="text-3xl font-bold text-text">4 / 6</p>
          <p className="text-xs text-secondary-text">Slack, Gmail, OpenAI, GitHub</p>
        </div>
      </div>

      {/* Recent Workflows Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-text">Active Workflows</h2>
            <p className="text-xs text-secondary-text">Manage and execute your automated pipelines</p>
          </div>
          <Link to="/templates" className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
            Explore Templates <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workflows.map((wf) => (
            <div key={wf.id} className="p-6 bg-card border border-border rounded-2xl shadow-sm flex flex-col justify-between space-y-4 hover:border-primary/50 transition-all">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="p-3 bg-primary/10 rounded-2xl text-primary border border-primary/20">
                    <Layers size={20} />
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-success/10 text-success text-xs font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" /> {wf.status}
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-text">{wf.name}</h3>
                  <p className="text-xs font-mono text-secondary-text mt-1">Trigger: {wf.trigger}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-between">
                <span className="text-[11px] text-secondary-text">Last run: {wf.lastRun || 'Just now'}</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleRunWorkflow(wf.id, wf.name)}
                    disabled={runningId === wf.id}
                    className="flex items-center gap-1 px-3 py-1.5 bg-secondary-background hover:bg-border text-text rounded-xl text-xs font-medium transition-colors border border-border cursor-pointer shadow-sm"
                  >
                    <Play size={12} className="text-success" /> {runningId === wf.id ? 'Running...' : 'Run'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      deleteWorkflow(wf.id);
                      showToast('Workflow deleted successfully', 'info');
                    }}
                    className="px-2.5 py-1.5 bg-secondary-background hover:bg-error/10 text-secondary-text hover:text-error rounded-xl text-xs font-medium transition-colors border border-border cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};