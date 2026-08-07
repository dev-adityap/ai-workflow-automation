// src/components/builder/PropertiesPanel.tsx
import React from 'react';
import { Settings2, X, Trash2, Sliders, Lock } from 'lucide-react';
import type { Node } from '@xyflow/react';

interface PropertiesPanelProps {
  // Allow null or undefined for when no node is selected on the canvas
  selectedNode: Node | null | undefined;
  onClose: () => void;
  onUpdateNodeData: (nodeId: string, newLabel: string) => void;
  onDeleteNode: (nodeId: string) => void;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedNode,
  onClose,
  onUpdateNodeData,
  onDeleteNode,
}) => {
  if (!selectedNode) {
    return (
      <div className="w-80 bg-card border-l border-border p-6 flex flex-col items-center justify-center text-center shrink-0 text-secondary-text space-y-3">
        <Settings2 size={32} className="opacity-40" />
        <p className="text-xs font-medium">Select a node on the canvas to configure its properties and execution parameters.</p>
      </div>
    );
  }

  // Typecast standard Node data to string since React Flow types data generically
  const label = (selectedNode.data?.label as string) || '';
  const nodeType = (selectedNode.data?.type as string) || 'action';

  return (
    <div className="w-80 bg-card border-l border-border p-6 flex flex-col justify-between shrink-0 space-y-6 overflow-y-auto">
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg text-primary"><Sliders size={16} /></div>
            <h3 className="text-sm font-bold text-text">Node Properties</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-secondary-text hover:text-text rounded-lg transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-secondary-text uppercase tracking-wider mb-2">Node Label</label>
            <input
              type="text"
              value={label}
              onChange={(e) => onUpdateNodeData(selectedNode.id, e.target.value)}
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-text focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-secondary-text uppercase tracking-wider mb-2">Execution Type</label>
            <input
              type="text"
              readOnly
              value={nodeType}
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-text font-mono focus:outline-none opacity-80"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-secondary-text uppercase tracking-wider mb-2">Node ID</label>
            <div className="flex items-center gap-2 bg-background border border-border rounded-xl px-4 py-2 text-xs font-mono text-secondary-text">
              <Lock size={12} /> {selectedNode.id}
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-border">
        <button
          type="button"
          onClick={() => onDeleteNode(selectedNode.id)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-secondary-background hover:bg-error/10 text-text hover:text-error rounded-xl text-xs font-medium transition-colors border border-border cursor-pointer shadow-sm"
        >
          <Trash2 size={14} /> Delete Node
        </button>
      </div>
    </div>
  );
};