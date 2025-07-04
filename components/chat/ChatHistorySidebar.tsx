
import React from 'react';
import type { ChatSession } from '../../types';
import HistoryItem from './HistoryItem';

interface ChatHistorySidebarProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onDeleteSession: (id:string) => void;
  onUpdateTitle: (id: string, newTitle: string) => void;
  onNewChat: () => void;
  onExport: (id: string) => void;
}

const ChatHistorySidebar: React.FC<ChatHistorySidebarProps> = ({ sessions, activeSessionId, onSelectSession, onDeleteSession, onUpdateTitle, onNewChat, onExport }) => {
  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4 p-2">
        <h2 className="text-xl font-bold text-slate-800">Histórico</h2>
        <button 
          onClick={onNewChat}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm font-semibold"
        >
          <i className="ph-bold ph-plus"></i>
          Novo Chat
        </button>
      </div>
      <div className="flex-grow overflow-y-auto pr-1 scrollbar-thin">
        {sessions.length > 0 ? (
          sessions.map(session => (
            <HistoryItem
              key={session.id}
              session={session}
              isActive={session.id === activeSessionId}
              onClick={onSelectSession}
              onDelete={onDeleteSession}
              onUpdateTitle={onUpdateTitle}
              onExport={onExport}
            />
          ))
        ) : (
          <div className="text-center text-slate-400 mt-10 px-4">
            <i className="ph-bold ph-chats-teardrop text-4xl mb-2"></i>
            <p className="font-medium text-slate-500">Nenhum chat ainda.</p>
            <p className="text-sm">Comece uma nova conversa!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatHistorySidebar;