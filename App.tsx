
import React, { useState, useCallback, useEffect } from 'react';
import type { User, ChatSession, Agent, ApiSetting } from './types';
import { Role } from './types';
import LoginPage from './components/pages/LoginPage';
import ChatPage from './components/pages/ChatPage';
import AdminPage from './components/pages/AdminPage';
import { AGENTS, MOCK_USER_DATABASE, MOCK_API_SETTINGS } from './constants';

type View = 'login' | 'admin' | 'chat';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [view, setView] = useState<View>('login');

  // State is now managed locally, initialized with mock data
  const [agents, setAgents] = useState<Agent[]>(AGENTS);
  const [allUsers, setAllUsers] = useState<User[]>(MOCK_USER_DATABASE);
  const [apiSettings, setApiSettings] = useState<ApiSetting[]>(MOCK_API_SETTINGS);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  const [activeAgent, setActiveAgent] = useState<Agent | null>(agents.length > 0 ? agents[0] : null);
  
  useEffect(() => {
    // Ensure activeAgent is always valid, e.g., after an agent is deleted
    const activeAgentExists = agents.some(a => a.id === activeAgent?.id);
    if (!activeAgentExists && agents.length > 0) {
      setActiveAgent(agents[0]);
    } else if (agents.length === 0 && (!activeAgent || activeAgent.id !== 'fallback')) {
        // A fallback agent if all are deleted
        const fallbackAgent: Agent = { id: 'fallback', name: 'Default Assistant', description: 'A general-purpose assistant.', systemPrompt: 'You are a helpful assistant.', icon: 'ph-bold ph-robot' };
        setActiveAgent(fallbackAgent);
    }
  }, [agents, activeAgent]);

  const handleLogin = useCallback((user: User) => {
    setCurrentUser(user);
    setView('chat');
  }, []);

  const handleLogout = useCallback(() => {
    setCurrentUser(null);
    setView('login');
  }, []);

  const handleNavigate = useCallback((newView: 'chat' | 'admin') => {
    if (currentUser?.role === Role.ADMIN) {
      setView(newView);
    } else {
      setView('chat');
    }
  }, [currentUser]);

  const renderContent = () => {
    if (!currentUser) {
      return <LoginPage onLogin={handleLogin} logoUrl={logoUrl} allUsers={allUsers} />;
    }

    switch (view) {
      case 'admin':
        return (
          <AdminPage 
            user={currentUser} 
            onNavigate={handleNavigate} 
            onLogout={handleLogout}
            agents={agents}
            setAgents={setAgents}
            users={allUsers}
            setUsers={setAllUsers}
            apiSettings={apiSettings}
            setApiSettings={setApiSettings}
            logoUrl={logoUrl}
            setLogoUrl={setLogoUrl}
          />
        );
      case 'chat':
      default:
        return (
          <ChatPage
            user={currentUser}
            onLogout={handleLogout}
            onNavigate={handleNavigate}
            agents={agents}
            activeAgent={activeAgent!}
            setActiveAgent={setActiveAgent}
            logoUrl={logoUrl}
          />
        );
    }
  };

  return (
    <div className="min-h-screen">
      {renderContent()}
    </div>
  );
};

export default App;
