// src/components/builder/NodePalette.tsx
import React from 'react';
import { Zap, MessageSquare, Mail, Bot, Database, Split, Clock, Shield } from 'lucide-react';

export const NodePalette: React.FC = () => {
  const onDragStart = (event: React.DragEvent, nodeType: string, label: string, type: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.setData('application/nodelabel', label);
    event.dataTransfer.setData('application/nodetype', type);
    event.dataTransfer.effectAllowed = 'move';
  };

  const nodeCategories = [
    {
      title: 'Triggers',
      items: [
        { label: 'Webhook', type: 'trigger', icon: Zap, color: 'text-yellow-500 bg-yellow-500/10' },
        { label: 'Gmail Arrives', type: 'trigger', icon: Mail, color: 'text-yellow-500 bg-yellow-500/10' },
        { label: 'Stripe Payment', type: 'trigger', icon: Shield, color: 'text-yellow-500 bg-yellow-500/10' },
      ],
    },
    {
      title: 'Actions',
      items: [
        { label: 'Slack Message', type: 'action', icon: MessageSquare, color: 'text-blue-500 bg-blue-500/10' },
        { label: 'AI Summarize', type: 'action', icon: Bot, color: 'text-blue-500 bg-blue-500/10' },
        { label: 'Save Database', type: 'action', icon: Database, color: 'text-blue-500 bg-blue-500/10' },
      ],
    },
    {
      title: 'Conditions',
      items: [
        { label: 'If/Else Branch', type: 'condition', icon: Split, color: 'text-purple-500 bg-purple-500/10' },
      ],
    },
    {
      title: 'Delays',
      items: [
        { label: 'Wait 5 Mins', type: 'delay', icon: Clock, color: 'text-orange-500 bg-orange-500/10' },
      ],
    }
  ];

  return (
    <div className="w-72 bg-card border-r border-border p-4 flex flex-col space-y-6 overflow-y-auto shrink-0">
      <div>
        <h3 className="text-sm font-bold text-text">Node Palette</h3>
        <p className="text-xs text-secondary-text mt-0.5">Drag and drop blocks onto the canvas</p>
      </div>

      <div className="space-y-6">
        {nodeCategories.map((category, idx) => (
          <div key={idx} className="space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-secondary-text">{category.title}</p>
            <div className="space-y-2">
              {category.items.map((item, itemIdx) => {
                const IconComp = item.icon;
                return (
                  <div
                    key={itemIdx}
                    draggable
                    onDragStart={(e) => onDragStart(e, 'custom', item.label, item.type)}
                    className="flex items-center gap-3 p-3 bg-background border border-border rounded-xl cursor-grab hover:border-primary/50 hover:shadow-md transition-all active:cursor-grabbing"
                  >
                    <div className={`p-2 rounded-lg ${item.color}`}>
                      <IconComp size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-text">{item.label}</p>
                      <span className="text-[10px] text-secondary-text capitalize">{item.type}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};