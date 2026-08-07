// src/context/WorkflowContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Workflow {
  id: string;
  name: string;
  trigger: string;
  status: string;
  lastRun: string;
}

interface WorkflowContextType {
  workflows: Workflow[];
  addWorkflow: (workflow: Workflow) => void;
  deleteWorkflow: (id: string) => void;
}

const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined);

export const WorkflowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [workflows, setWorkflows] = useState<Workflow[]>(() => {
    try {
      const saved = localStorage.getItem('app_workflows');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [
      { id: '1', name: 'AI Lead Enrichment Pipeline', trigger: 'Webhook Trigger', status: 'Active', lastRun: '2 mins ago' },
      { id: '2', name: 'Customer Support Triage', trigger: 'Gmail Received', status: 'Active', lastRun: '1 hour ago' },
    ];
  });

  useEffect(() => {
    localStorage.setItem('app_workflows', JSON.stringify(workflows));
  }, [workflows]);

  const addWorkflow = (workflow: Workflow) => {
    setWorkflows((prev) => {
      const exists = prev.findIndex((w) => w.id === workflow.id);
      if (exists !== -1) {
        const updated = [...prev];
        updated[exists] = workflow;
        return updated;
      }
      return [workflow, ...prev];
    });
  };

  const deleteWorkflow = (id: string) => {
    setWorkflows((prev) => prev.filter((w) => w.id !== id));
  };

  return (
    <WorkflowContext.Provider value={{ workflows, addWorkflow, deleteWorkflow }}>
      {children}
    </WorkflowContext.Provider>
  );
};

export const useWorkflows = () => {
  const context = useContext(WorkflowContext);
  if (!context) throw new Error('useWorkflows must be used within WorkflowProvider');
  return context;
};