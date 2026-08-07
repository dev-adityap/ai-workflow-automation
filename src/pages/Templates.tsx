// src/pages/Templates.tsx
import { Layers, ArrowRight, Bot, Zap, Shield } from 'lucide-react';
import { useWorkflows } from '../context/WorkflowContext';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';

export const Templates = () => {
  const { addWorkflow } = useWorkflows();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const templates = [
    {
      id: 't-1',
      name: 'AI Lead Enrichment Pipeline',
      trigger: 'Webhook Trigger',
      category: 'Sales & Marketing',
      description: 'Automatically scrape incoming leads, generate AI scoring via OpenAI, and dispatch alerts to Slack.',
      icon: Zap,
    },
    {
      id: 't-2',
      name: 'Customer Support Triage',
      trigger: 'Gmail Received',
      category: 'Customer Success',
      description: 'Parse incoming support emails, categorize priority using LLMs, and create tickets automatically.',
      icon: Bot,
    },
    {
      id: 't-3',
      name: 'GitHub CI/CD Discord Notifier',
      trigger: 'GitHub Commit',
      category: 'Development',
      description: 'Listen to repository push and pull request events, verifying builds and posting status updates to Discord.',
      icon: Layers,
    },
    {
      id: 't-4',
      name: 'Stripe Payment Ingest & Sync',
      trigger: 'Stripe Webhook',
      category: 'Finance',
      description: 'Capture successful subscription and invoice charges, syncing data instantly to your internal database.',
      icon: Shield,
    },
  ];

  const handleUseTemplate = (template: typeof templates[0]) => {
    addWorkflow({
      id: `wf-${Date.now()}`,
      name: template.name,
      trigger: template.trigger,
      status: 'Active',
      lastRun: 'Just now',
    } as any);
    showToast(`Template "${template.name}" loaded into your workflows!`, 'success');
    navigate('/');
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-text">Workflow Templates</h1>
        <p className="text-secondary-text mt-1">Jumpstart your automation pipelines with pre-built, production-ready AI workflow templates.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {templates.map((tpl) => {
          const IconComp = tpl.icon;
          return (
            <div key={tpl.id} className="p-6 bg-card border border-border rounded-2xl shadow-sm flex flex-col justify-between space-y-6 hover:border-primary/50 transition-all">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="p-3 bg-primary/10 rounded-2xl text-primary border border-primary/20">
                    <IconComp size={24} />
                  </div>
                  <span className="text-[10px] font-bold text-primary uppercase tracking-wider bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20">
                    {tpl.category}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text">{tpl.name}</h3>
                  <p className="text-xs font-mono text-secondary-text mt-1">Trigger: {tpl.trigger}</p>
                  <p className="text-xs text-secondary-text mt-3 leading-relaxed">{tpl.description}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => handleUseTemplate(tpl)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-blue-600 text-white rounded-xl text-xs font-medium transition-colors shadow-lg shadow-primary/20 cursor-pointer"
                >
                  Use Template <ArrowRight size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};