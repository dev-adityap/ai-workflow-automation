// src/pages/Builder.tsx
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { ReactFlow, MiniMap, Controls, Background, useNodesState, useEdgesState, addEdge } from '@xyflow/react';
import type { Connection, Edge, Node, ReactFlowInstance } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Play, Save, Plus, Trash2, Copy, Sparkles } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useWorkflows } from '../context/WorkflowContext';
import { CustomNode } from '../components/nodes/CustomNode';
import { NodePalette } from '../components/builder/NodePalette';
import { PropertiesPanel } from '../components/builder/PropertiesPanel';

const initialNodes: Node[] = [
  { id: '1', type: 'custom', position: { x: 250, y: 100 }, data: { label: 'Gmail Arrives', type: 'trigger' } },
  { id: '2', type: 'custom', position: { x: 250, y: 280 }, data: { label: 'AI Summarize', type: 'action' } },
];
const initialEdges: Edge[] = [{ id: 'e1-2', source: '1', target: '2', animated: true }];

export const Builder = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);
  const [workflowName, setWorkflowName] = useState('AI Lead Enrichment Pipeline');
  const [isRunning, setIsRunning] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const { showToast } = useToast();
  const { addWorkflow } = useWorkflows();

  const nodeTypes = useMemo(() => ({ custom: CustomNode }), []);

  useEffect(() => {
    const savedFlow = localStorage.getItem('builder_flow');
    if (savedFlow) {
      try {
        const { nodes: savedNodes, edges: savedEdges, name } = JSON.parse(savedFlow);
        if (savedNodes && savedNodes.length > 0) {
          setNodes(savedNodes);
          setEdges(savedEdges || []);
          if (name) setWorkflowName(name);
          return;
        }
      } catch (e) {
        console.error('Failed to parse saved workflow state.');
      }
    }
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [setNodes, setEdges]);

  useEffect(() => {
    const handleAiBuild = (e: any) => {
      if (e.detail && e.detail.newNodes) {
        setNodes(e.detail.newNodes);
        setEdges(e.detail.newEdges || []);
        showToast('AI successfully generated & connected workflow nodes!', 'success');
      }
    };
    window.addEventListener('ai-build-workflow', handleAiBuild);
    return () => window.removeEventListener('ai-build-workflow', handleAiBuild);
  }, [setNodes, setEdges, showToast]);

  const onConnect = useCallback((params: Connection | Edge) => {
    setEdges((eds) => addEdge({ ...params, animated: true } as any, eds));
  }, [setEdges]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow');
      const label = event.dataTransfer.getData('application/nodelabel');
      const nodeType = event.dataTransfer.getData('application/nodetype');

      if (typeof type === 'undefined' || !type || !rfInstance) return;

      const position = rfInstance.screenToFlowPosition({ x: event.clientX, y: event.clientY });
      const newNode: Node = {
        id: `node-${Date.now()}`,
        type,
        position,
        data: { label, type: nodeType },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [rfInstance, setNodes],
  );

  const onSelectionChange = useCallback(({ nodes }: { nodes: Node[] }) => {
    setSelectedNodeId(nodes.length > 0 ? nodes[0].id : null);
  }, []);

  const handleUpdateNodeData = (nodeId: string, newLabel: string) => {
    setNodes((nds) => nds.map((node) => node.id === nodeId ? { ...node, data: { ...node.data, label: newLabel } } : node));
  };

  const handleDeleteNode = (nodeId: string) => {
    setNodes((nds) => nds.filter((n) => n.id !== nodeId));
    setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
    setSelectedNodeId(null);
  };

  const handleAddNode = () => {
    const id = `node-${Date.now()}`;
    const newNode: Node = {
      id,
      type: 'custom',
      position: { x: Math.random() * 300 + 100, y: Math.random() * 200 + 100 },
      data: { label: 'New Action', type: 'action' },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const handleClear = () => {
    setNodes([]);
    setEdges([]);
    setSelectedNodeId(null);
  };

  const handleDuplicate = () => {
    const idMap = new Map();
    const clonedNodes: Node[] = nodes.map(n => {
      const newId = `${n.id}-copy-${Date.now()}`;
      idMap.set(n.id, newId);
      return { ...n, id: newId, position: { x: n.position.x + 50, y: n.position.y + 50 }, selected: false, data: { ...n.data } };
    });
    
    const clonedEdges: Edge[] = edges.map(e => ({
      ...e,
      id: `${e.id}-copy-${Date.now()}`,
      source: idMap.get(e.source) || e.source,
      target: idMap.get(e.target) || e.target,
    }));

    setNodes((nds) => [...nds, ...clonedNodes]);
    setEdges((eds) => [...eds, ...clonedEdges]);
  };

  // Node & Edge Sequential Glowing Animation
  const handleTestRun = async () => {
    if (nodes.length === 0 || isRunning) return;
    setIsRunning(true);
    
    const totalAnimTime = 5000; 
    const timePerNode = Math.min(1200, totalAnimTime / Math.max(nodes.length, 1));
    
    const nodeOrder: string[] = [];
    const visited = new Set<string>();
    let currentId = nodes.find(n => n.data.type === 'trigger')?.id || nodes[0].id;
    
    while (currentId && !visited.has(currentId)) {
      nodeOrder.push(currentId);
      visited.add(currentId);
      const nextEdge = edges.find(e => e.source === currentId);
      currentId = nextEdge ? nextEdge.target : '';
    }
    nodes.forEach(n => !visited.has(n.id) && nodeOrder.push(n.id));

    // Animate Nodes and Edges
    for (let i = 0; i < nodeOrder.length; i++) {
      const currentNode = nodeOrder[i];
      const nextNode = nodeOrder[i + 1];

      setNodes((nds) => nds.map((n) => ({ ...n, data: { ...n.data, isGlowing: n.id === currentNode } })));
      
      if (nextNode) {
        setEdges((eds) => eds.map((e) => 
          (e.source === currentNode && e.target === nextNode)
            ? { ...e, style: { stroke: '#3b82f6', strokeWidth: 3, filter: 'drop-shadow(0 0 5px rgba(59,130,246,0.5))' } }
            : e
        ));
      }

      await new Promise((res) => setTimeout(res, timePerNode));
    }

    await new Promise((res) => setTimeout(res, 400));
    
    // Reset Canvas Visuals
    setNodes((nds) => nds.map((n) => ({ ...n, data: { ...n.data, isGlowing: false } })));
    setEdges((eds) => eds.map((e) => ({ ...e, style: {} })));
    setIsRunning(false);
    
    showToast('✓ Workflow Executed Successfully', 'success');

    try {
      const logs = JSON.parse(localStorage.getItem('execution_logs') || '[]');
      const newLog = {
        id: `log-${Date.now()}`,
        workflowName: workflowName,
        trigger: (nodes.find(n => n.data.type === 'trigger')?.data.label as string) || 'Manual Trigger',
        status: 'Success',
        duration: `${Math.round(nodes.length * timePerNode + 400)}ms`,
        timestamp: 'Just now',
        details: 'Pipeline validated sequentially via Builder Test Run execution.'
      };
      localStorage.setItem('execution_logs', JSON.stringify([newLog, ...logs]));
    } catch (e) {}
  };

  const handleSave = () => {
    if (rfInstance) {
      const flow = rfInstance.toObject();
      localStorage.setItem('builder_flow', JSON.stringify({ ...flow, name: workflowName }));
    }
    addWorkflow({
      id: 'wf-active',
      name: workflowName,
      trigger: (nodes.find(n => n.data.type === 'trigger')?.data.label as string) || 'Webhook Trigger',
      status: 'Active',
      lastRun: 'Just now',
    } as any);
    
    showToast('✓ Workflow Saved', 'success');
  };

  return (
    <div className="flex flex-col h-full bg-background relative">
      <div className="h-16 border-b border-border bg-card px-8 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-4">
          <input
            type="text"
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            className="bg-background border border-border rounded-xl px-4 py-1.5 text-sm font-bold text-text focus:outline-none focus:border-primary w-72"
          />
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium">
              Nodes: {nodes.length}
            </span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium">
              Connections: {edges.length}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button type="button" onClick={handleAddNode} className="flex items-center gap-1.5 px-3.5 py-2 bg-secondary-background hover:bg-border text-text rounded-xl text-xs font-medium transition-colors border border-border cursor-pointer">
            <Plus size={14} /> Add Node
          </button>
          <button type="button" onClick={handleClear} className="flex items-center gap-1.5 px-3.5 py-2 bg-secondary-background hover:bg-border text-text rounded-xl text-xs font-medium transition-colors border border-border cursor-pointer">
            <Trash2 size={14} /> Clear
          </button>
          <button type="button" onClick={handleDuplicate} className="flex items-center gap-1.5 px-3.5 py-2 bg-secondary-background hover:bg-border text-text rounded-xl text-xs font-medium transition-colors border border-border cursor-pointer">
            <Copy size={14} /> Duplicate
          </button>
          <button type="button" onClick={handleTestRun} disabled={isRunning} className="flex items-center gap-1.5 px-4 py-2 bg-secondary-background hover:bg-border text-text rounded-xl text-xs font-medium transition-colors border border-border cursor-pointer shadow-sm">
            <Play size={14} className={isRunning ? 'text-secondary-text' : 'text-success'} /> 
            {isRunning ? 'Running...' : 'Test Run'}
          </button>
          <button type="button" onClick={handleSave} className="flex items-center gap-1.5 px-5 py-2 bg-primary hover:bg-blue-600 text-white rounded-xl text-xs font-medium transition-colors shadow-lg shadow-primary/20 cursor-pointer">
            <Save size={14} /> Save
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden relative">
        <NodePalette />
        <div className="flex-1 relative" ref={reactFlowWrapper}>
          {nodes.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 space-y-2">
              <Sparkles size={36} className="text-secondary-text opacity-40 animate-pulse" />
              <p className="text-sm font-medium text-secondary-text opacity-60">Drop nodes here or Ask AI to build one</p>
            </div>
          )}

          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setRfInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onSelectionChange={onSelectionChange}
            deleteKeyCode={['Backspace', 'Delete']} 
            nodeTypes={nodeTypes}
            fitView
          >
            <Controls />
            <MiniMap style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px' }} zoomable pannable />
            <Background gap={16} size={1} color="var(--border-color)" />
          </ReactFlow>
        </div>
        <PropertiesPanel 
          selectedNode={nodes.find(n => n.id === selectedNodeId) || null} 
          onClose={() => setSelectedNodeId(null)}
          onUpdateNodeData={handleUpdateNodeData}
          onDeleteNode={handleDeleteNode}
        />
      </div>
    </div>
  );
};