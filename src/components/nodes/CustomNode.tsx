// src/components/builder/CustomNode.tsx
import React, { useState } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';
import { Zap, MessageSquare,  Bot, Split, Clock, Trash2 } from 'lucide-react';

export const CustomNode = ({ id, data, selected }: { id: string; data: any; selected?: boolean }) => {
  const { setNodes, setEdges, updateNodeData } = useReactFlow();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(data.label || 'Node');

  const label = data.label || 'Node';
  const type = (data.type || 'action').toLowerCase();
  const isGlowing = data.isGlowing;

  let badgeColor = 'bg-blue-500/10 text-blue-500 border-blue-500/20';
  let iconSymbol = <MessageSquare size={14} />;
  let displayType = 'Action';

  if (type === 'trigger') {
    badgeColor = 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
    iconSymbol = <Zap size={14} />;
    displayType = 'Trigger';
  } else if (type === 'condition') {
    badgeColor = 'bg-purple-500/10 text-purple-500 border-purple-500/20';
    iconSymbol = <Split size={14} />;
    displayType = 'Condition';
  } else if (type === 'delay') {
    badgeColor = 'bg-orange-500/10 text-orange-500 border-orange-500/20';
    iconSymbol = <Clock size={14} />;
    displayType = 'Delay';
  } else if (label.toLowerCase().includes('ai')) {
    badgeColor = 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    iconSymbol = <Bot size={14} />;
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setNodes((nds) => nds.filter((n) => n.id !== id));
    setEdges((eds) => eds.filter((edge) => edge.source !== id && edge.target !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
      updateNodeData(id, { label: editName });
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    updateNodeData(id, { label: editName });
  };

  return (
    <div className={`group w-64 bg-card border rounded-2xl p-4 shadow-xl transition-all duration-300 relative ${selected ? 'border-primary ring-2 ring-primary/20' : 'border-border'} ${isGlowing ? 'border-primary ring-4 ring-primary/50 shadow-primary/30 scale-105 animate-pulse' : ''}`}>
      
      <button
        onClick={handleDelete}
        title="Delete Node"
        className="absolute -top-3 -right-3 w-8 h-8 bg-card border border-border rounded-full flex items-center justify-center text-secondary-text hover:text-error hover:bg-error/10 hover:border-error/30 opacity-0 group-hover:opacity-100 transition-all shadow-md z-20 cursor-pointer"
      >
        <Trash2 size={14} />
      </button>

      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-primary rounded-full border-2 border-background -top-1.5" />
      
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 w-full">
          <div className={`p-2 rounded-xl border ${badgeColor} flex items-center justify-center font-bold text-sm shrink-0`}>
            {iconSymbol}
          </div>
          <div className="flex-1 min-w-0" onDoubleClick={() => setIsEditing(true)}>
            {isEditing ? (
              <input 
                autoFocus
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
                className="w-full bg-background border border-primary/50 rounded px-1.5 py-0.5 text-sm font-bold text-text focus:outline-none focus:ring-2 ring-primary/20"
              />
            ) : (
              <h4 className="text-sm font-bold text-text truncate cursor-text" title="Double click to rename">{label}</h4>
            )}
            <span className="text-[10px] font-semibold text-secondary-text uppercase tracking-wider">
              {displayType}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-border flex items-center justify-start text-[12px] font-medium text-text">
        <span className="mr-1.5">🟢</span> Ready
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-primary rounded-full border-2 border-background -bottom-1.5" />
    </div>
  );
};