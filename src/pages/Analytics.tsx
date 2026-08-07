// src/pages/Analytics.tsx
import { useState } from 'react';
import { BarChart3, TrendingUp, Zap, CheckCircle2, Clock, Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useWorkflows } from '../context/WorkflowContext';

export const Analytics = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');
  const { workflows } = useWorkflows();

  const stats = [
    { label: 'Total Executions', value: '14,832', change: '+12.4%', isPositive: true, icon: Activity, color: 'text-primary bg-primary/10 border-primary/20' },
    { label: 'Success Rate', value: '98.7%', change: '+0.4%', isPositive: true, icon: CheckCircle2, color: 'text-success bg-success/10 border-success/20' },
    { label: 'Avg Latency', value: '412ms', change: '-32ms', isPositive: true, icon: Clock, color: 'text-warning bg-warning/10 border-warning/20' },
    { label: 'Active Workflows', value: workflows.length.toString(), change: '+2', isPositive: true, icon: Zap, color: 'text-primary bg-primary/10 border-primary/20' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text">Workflow Analytics</h1>
          <p className="text-secondary-text mt-1">Telemetry insights, success metrics, and performance tracking across all active pipelines.</p>
        </div>
        <div className="flex items-center gap-2 bg-card border border-border p-1.5 rounded-2xl shadow-sm">
          {(['7d', '30d', '90d'] as const).map((range) => (
            <button
              key={range}
              type="button"
              onClick={() => setTimeRange(range)}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                timeRange === range
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-secondary-background text-secondary-text hover:text-text'
              }`}
            >
              Last {range}
            </button>
          ))}
        </div>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const IconComp = stat.icon;
          return (
            <div key={i} className="p-6 bg-card border border-border rounded-2xl shadow-sm space-y-4 hover:border-primary/50 transition-all">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-2xl border ${stat.color}`}>
                  <IconComp size={20} />
                </div>
                <span className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
                  stat.isPositive ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
                }`}>
                  {stat.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {stat.change}
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

      {/* Main Graph / Telemetry Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Execution Volume Trend */}
        <div className="lg:col-span-2 p-6 bg-card border border-border rounded-2xl shadow-sm space-y-6 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-text">Execution Volume Trend</h3>
              <p className="text-xs text-secondary-text">Daily trigger invocations over time</p>
            </div>
            <div className="p-2 bg-secondary-background rounded-xl text-secondary-text">
              <BarChart3 size={18} />
            </div>
          </div>

          <div className="h-64 flex items-end justify-between gap-3 pt-6 px-2 border-b border-border">
            {[45, 62, 38, 75, 88, 94, 65, 82, 90, 78, 85, 96].map((height, idx) => (
              <div key={idx} className="h-full flex-1 flex flex-col justify-end items-center gap-2 group">
                <div 
                  className="w-full bg-primary/20 group-hover:bg-primary rounded-t-lg transition-all duration-300 relative"
                  style={{ height: `${height}%` }}
                >
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-card border border-border text-text text-[10px] font-mono px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md z-10">
                    {height * 15} runs
                  </span>
                </div>
                <span className="text-[10px] font-mono text-secondary-text">Day {idx + 1}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-secondary-text">
            <span>Peak: 1,440 runs/day</span>
            <span className="flex items-center gap-1 font-medium text-success"><TrendingUp size={14} /> +18.2% vs previous period</span>
          </div>
        </div>

        {/* Top Active Workflows Performance */}
        <div className="p-6 bg-card border border-border rounded-2xl shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <h3 className="text-base font-bold text-text">Top Workflows</h3>
            <span className="text-xs font-medium text-primary">By Executions</span>
          </div>

          <div className="space-y-4">
            {workflows.slice(0, 4).map((w, index) => (
              <div key={w.id || index} className="p-3.5 bg-secondary-background/50 border border-border rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-text truncate max-w-40">{w.name}</span>
                  <span className="text-[10px] font-semibold text-success bg-success/10 px-2 py-0.5 rounded-md">{w.status}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-secondary-text">
                  <span className="font-mono">{w.trigger}</span>
                  <span className="font-mono text-text font-medium">{Math.floor(Math.random() * 3000 + 500)} runs</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};