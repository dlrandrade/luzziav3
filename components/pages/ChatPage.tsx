
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import type { User, ChatSession, Agent, Message } from '../../types';
import { MessageAuthor } from '../../types';
import MainLayout from '../layout/MainLayout';
import AgentSidebar from '../chat/AgentSidebar';
import ChatHistorySidebar from '../chat/ChatHistorySidebar';
import ChatWindow from '../chat/ChatWindow';
import { getAiResponse, generateChatTitle } from '../../services/geminiService';

interface ChatPageProps {
  user: User;
  onLogout: () => void;
  onNavigate: (view: 'chat' | 'admin') => void;
  agents: Agent[];
  activeAgent: Agent;
  setActiveAgent: React.Dispatch<React.SetStateAction<Agent | null>>;
  logoUrl: string | null;
}

const ChatPage: React.FC<ChatPageProps> = (props) => {
  const { user, onLogout, onNavigate, agents, activeAgent, setActiveAgent, logoUrl } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  const agentSessions = useMemo(() => {
    if (!activeAgent) return [];
    return sessions.filter(s => s.agentId === activeAgent.id).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [sessions, activeAgent]);

  const activeSession = agentSessions.find(s => s.id === activeSessionId);

  useEffect(() => {
    // When agent changes, clear the active session
    setActiveSessionId(null);
  }, [activeAgent]);

  const handleNewChat = useCallback(() => {
    setActiveSessionId(null);
  }, []);

  const handleDeleteSession = useCallback(async (id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
    if (activeSessionId === id) {
      handleNewChat();
    }
  }, [activeSessionId, handleNewChat]);

  const handleUpdateTitle = useCallback(async (id: string, newTitle: string) => {
    setSessions(prev => prev.map(s => s.id === id ? {...s, title: newTitle} : s));
  }, []);
  
  const handleSelectAgent = (agent: Agent) => {
    setActiveAgent(agent);
  }
  
  const handleExportSession = useCallback((sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (!session) return;
    
    const agent = agents.find(a => a.id === session.agentId);
    
    let content = `Chat with ${agent ? agent.name : 'Unknown Agent'}\n`;
    content += `Title: ${session.title}\n`;
    content += `Exported on: ${new Date().toLocaleString()}\n\n`;
    content += "----------------------------------------\n\n";

    session.messages.forEach(msg => {
        const author = msg.author === MessageAuthor.USER ? user.name : agent?.name || 'AI';
        const time = new Date(msg.timestamp).toLocaleTimeString();
        content += `[${time}] ${author}:\n${msg.text}\n\n`;
    });

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const safeTitle = session.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    link.download = `luzzia_chat_${safeTitle}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [sessions, agents, user.name]);

  const handleSendMessage = async (text: string) => {
    if (!activeAgent || activeAgent.id === 'fallback') {
        alert("Por favor, selecione um agente válido primeiro.");
        return;
    }
    setIsLoading(true);

    const userMessage: Message = {
      id: `msg-local-${Date.now()}`,
      text,
      author: MessageAuthor.USER,
      timestamp: new Date().toISOString(),
    };
    
    let currentSession: ChatSession;
    let isNewSession = false;

    if (activeSessionId && activeSession) {
        currentSession = activeSession;
        const updatedMessages = [...currentSession.messages, userMessage];
        setSessions(prev => prev.map(s => s.id === activeSessionId ? {...s, messages: updatedMessages } : s));
        currentSession = {...currentSession, messages: updatedMessages};
    } else {
        isNewSession = true;
        currentSession = {
            id: `session-local-${Date.now()}`,
            title: "Gerando título...",
            agentId: activeAgent.id,
            messages: [userMessage],
            createdAt: new Date().toISOString()
        };
        setSessions(prev => [currentSession, ...prev]);
        setActiveSessionId(currentSession.id);
    }

    try {
        const aiText = await getAiResponse(text, activeAgent, currentSession.messages);
        
        const aiMessage: Message = {
            id: `msg-local-${Date.now() + 1}`,
            text: aiText,
            author: MessageAuthor.AI,
            timestamp: new Date().toISOString()
        };
        
        let finalTitle = currentSession.title;
        if (isNewSession) {
            finalTitle = await generateChatTitle(userMessage.text, aiMessage.text);
        }
        
        setSessions(prev => prev.map(s => s.id === currentSession.id ? { ...s, messages: [...s.messages, aiMessage], title: finalTitle } : s));

    } catch (error) {
        console.error("Failed to send message:", error);
        alert('Erro ao enviar mensagem. Por favor, tente novamente.');
        // Revert optimistic user message (optional)
        setSessions(prev => prev.map(s => s.id === currentSession.id ? {...s, messages: s.messages.filter(m => m.id !== userMessage.id)}: s));

    } finally {
        setIsLoading(false);
    }
  };

  return (
    <MainLayout
      leftSidebar={
        <AgentSidebar
          agents={agents}
          activeAgent={activeAgent}
          onSelectAgent={handleSelectAgent}
          user={user}
          onLogout={onLogout}
          onNavigate={onNavigate}
          logoUrl={logoUrl}
        />
      }
      mainContent={
        <ChatWindow
          session={activeSession}
          agent={activeAgent}
          isLoading={isLoading}
          onSendMessage={handleSendMessage}
        />
      }
      rightSidebar={
        <ChatHistorySidebar
          sessions={agentSessions}
          activeSessionId={activeSessionId}
          onSelectSession={setActiveSessionId}
          onDeleteSession={handleDeleteSession}
          onUpdateTitle={handleUpdateTitle}
          onNewChat={handleNewChat}
          onExport={handleExportSession}
        />
      }
    />
  );
};

export default ChatPage;
