// src/components/ai/AIAssistant.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, Sparkles, X, ChevronUp, ChevronDown } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  explanation?: string;
  generatedNodes?: any[];
}

export const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('ai_chat_history');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* fallback */ }
    }
    return [
      {
        id: 'msg-1',
        sender: 'ai',
        text: 'Hello! I am your AI Workflow Architect. Try prompting me with: "When Gmail arrives -> Summarize -> Send Slack -> Save Database"',
      },
    ];
  });
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();

  useEffect(() => {
    localStorage.setItem('ai_chat_history', JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    const userMsg: ChatMessage = { id: `user-${Date.now()}`, sender: 'user', text: userText };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    let activeKeyType = 'Gemini Pro Sandbox';

    setTimeout(() => {
      let generatedNodes: any[] = [];
      let generatedEdges: any[] = [];
      let explanation = '';
      const lower = userText.toLowerCase();

      // ⭐ Multi-Step Generation Logic
      if (lower.includes('gmail') && lower.includes('summarize') && lower.includes('slack') && lower.includes('database')) {
        generatedNodes = [
          { id: 'ai-1', type: 'custom', position: { x: 50, y: 150 }, data: { label: 'Gmail Arrives', type: 'trigger' } },
          { id: 'ai-2', type: 'custom', position: { x: 350, y: 150 }, data: { label: 'AI Summarize', type: 'action' } },
          { id: 'ai-3', type: 'custom', position: { x: 650, y: 150 }, data: { label: 'Slack Message', type: 'action' } },
          { id: 'ai-4', type: 'custom', position: { x: 950, y: 150 }, data: { label: 'Save Database', type: 'action' } },
        ];
        generatedEdges = [
          { id: `e-${Date.now()}-1`, source: 'ai-1', target: 'ai-2', animated: true },
          { id: `e-${Date.now()}-2`, source: 'ai-2', target: 'ai-3', animated: true },
          { id: `e-${Date.now()}-3`, source: 'ai-3', target: 'ai-4', animated: true },
        ];
        explanation = `Synthesized via ${activeKeyType}. Engineered a sequential 4-step data pipeline: Gmail trigger routed to OpenAI summarization, dispatching to Slack, and logging in Database.`;
      
      } else if (lower.includes('slack') || lower.includes('notification')) {
        generatedNodes = [
          { id: 'ai-t-1', type: 'custom', position: { x: 100, y: 150 }, data: { label: 'Webhook Trigger', type: 'trigger' } },
          { id: 'ai-a-1', type: 'custom', position: { x: 400, y: 150 }, data: { label: 'Send Slack Message', type: 'action' } },
        ];
        generatedEdges = [{ id: `e-${Date.now()}`, source: generatedNodes[0].id, target: generatedNodes[1].id, animated: true }];
        explanation = `Synthesized via ${activeKeyType}. Linked Webhook trigger directly to Slack notification block.`;
      
      } else {
        generatedNodes = [
          { id: 'ai-t-3', type: 'custom', position: { x: 100, y: 150 }, data: { label: 'Webhook Trigger', type: 'trigger' } },
          { id: 'ai-a-3', type: 'custom', position: { x: 400, y: 150 }, data: { label: 'Save Database', type: 'action' } },
        ];
        generatedEdges = [{ id: `e-${Date.now()}`, source: generatedNodes[0].id, target: generatedNodes[1].id, animated: true }];
        explanation = `Synthesized via ${activeKeyType}. Standard workflow generated with Webhook trigger and Database action.`;
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: `I have successfully structured your pipeline based on your prompt.`,
        explanation,
        generatedNodes,
      };

      setMessages((prev) => [...prev, aiMsg]);
      setLoading(false);
      showToast('AI synthesized workflow nodes successfully!', 'success');

      // Dispatch to Builder.tsx
      const event = new CustomEvent('ai-build-workflow', {
        detail: { newNodes: generatedNodes, newEdges: generatedEdges },
      });
      window.dispatchEvent(event);
    }, 1800);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {!isOpen ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 bg-primary hover:bg-blue-600 text-white px-5 py-3 rounded-2xl shadow-2xl transition-all duration-300 font-medium cursor-pointer"
        >
          <Sparkles size={20} className="animate-pulse" /> ✨ Ask AI
        </button>
      ) : (
        <div className="w-96 h-130 bg-card border border-border rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-slide-in">
          <div className="p-4 bg-secondary-background border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-xl text-primary"><Bot size={18} /></div>
              <div>
                <h3 className="text-sm font-bold text-text">Workflow AI Architect</h3>
                <p className="text-xs text-success flex items-center gap-1 font-medium">● Connected</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => setMinimized(!minimized)} className="p-1.5 text-secondary-text hover:text-text rounded-lg transition-colors cursor-pointer">
                {minimized ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              <button type="button" onClick={() => setIsOpen(false)} className="p-1.5 text-secondary-text hover:text-text rounded-lg transition-colors cursor-pointer">
                <X size={16} />
              </button>
            </div>
          </div>

          {!minimized && (
            <>
              <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-background">
                {messages.map((m) => (
                  <div key={m.id} className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm ${m.sender === 'user' ? 'bg-primary text-white rounded-br-none' : 'bg-card text-text border border-border rounded-bl-none shadow-sm'}`}>
                      <p>{m.text}</p>
                      {m.explanation && (
                        <div className="mt-2 pt-2 border-t border-border/50 text-xs text-secondary-text font-mono">
                          {m.explanation}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex items-center gap-2 p-3 bg-card border border-border rounded-2xl w-fit text-xs text-secondary-text font-medium animate-pulse shadow-sm">
                    <Sparkles size={14} className="text-primary animate-spin" /> Synthesizing pipeline...
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSend} className="p-3 border-t border-border bg-card flex items-center gap-2">
                <input
                  type="text"
                  name="ai_chat_prompt"
                  placeholder="Describe workflow (e.g. Gmail to Slack)..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 bg-background border border-border rounded-xl px-3.5 py-2 text-sm text-text focus:outline-none focus:border-primary"
                />
                <button type="submit" className="p-2.5 bg-primary hover:bg-blue-600 text-white rounded-xl transition-colors cursor-pointer shadow-md">
                  <Send size={16} />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
};