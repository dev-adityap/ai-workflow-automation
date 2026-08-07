import { createContext, useContext, useState, type ReactNode } from 'react';

export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

interface AIContextType {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  messages: Message[];
  addMessage: (message: Omit<Message, 'id'>) => void;
  isGenerating: boolean;
  setIsGenerating: (isGenerating: boolean) => void;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export const AIProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const addMessage = (message: Omit<Message, 'id'>) => {
    setMessages((prev) => [
      ...prev,
      { ...message, id: Math.random().toString(36).substring(7) },
    ]);
  };

  return (
    <AIContext.Provider
      value={{
        isOpen,
        setIsOpen,
        messages,
        addMessage,
        isGenerating,
        setIsGenerating,
      }}
    >
      {children}
    </AIContext.Provider>
  );
};

export const useAI = () => {
  const context = useContext(AIContext);
  if (context === undefined) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
};