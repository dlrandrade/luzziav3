
import React from 'react';
import type { Agent, User } from '../../types';
import ProfileDropdown from '../common/ProfileDropdown';

interface AgentSidebarProps {
  agents: Agent[];
  activeAgent: Agent;
  onSelectAgent: (agent: Agent) => void;
  user: User;
  onLogout: () => void;
  onNavigate: (view: 'chat' | 'admin') => void;
  logoUrl: string | null;
}

const AgentSidebar: React.FC<AgentSidebarProps> = ({ agents, activeAgent, onSelectAgent, user, onLogout, onNavigate, logoUrl }) => {
  return (
    <div className="flex flex-col h-full text-slate-800">
      <div className="p-2 mb-6">
         <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center">
                {logoUrl ? <img src={logoUrl} alt="LuzzIA Logo" className="w-full h-full object-cover rounded-full" /> : <i className="ph-bold ph-lightbulb-filament text-white text-lg"></i>}
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tighter">LuzzIA</h1>
          </div>
      </div>

      <div className="flex-grow overflow-y-auto pr-2 scrollbar-thin">
        <h2 className="text-sm font-semibold text-slate-500 mb-3 px-2 uppercase tracking-wider">Agentes</h2>
        <ul>
          {agents.map((agent) => (
            <li key={agent.id}>
              <button
                onClick={() => onSelectAgent(agent)}
                className={`w-full text-left p-3 rounded-lg flex items-start gap-4 transition-all duration-200 mb-2 ${
                  activeAgent.id === agent.id ? 'bg-slate-100' : 'hover:bg-slate-100'
                }`}
              >
                <div className="text-2xl mt-1 text-slate-700"><i className={agent.icon}></i></div>
                <div>
                    <h3 className={`font-semibold ${activeAgent.id === agent.id ? 'text-slate-900' : 'text-slate-700'}`}>{agent.name}</h3>
                    <p className="text-xs text-slate-500">{agent.description}</p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-auto flex-shrink-0 border-t border-slate-200 pt-4">
         <ProfileDropdown user={user} onLogout={onLogout} onNavigate={onNavigate} currentView="chat" />
      </div>
    </div>
  );
};

export default AgentSidebar;