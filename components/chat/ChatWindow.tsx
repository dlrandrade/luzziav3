
import React, { useRef, useEffect } from 'react';
import type { Message, Agent, ChatSession } from '../../types';
import ChatMessage from './ChatMessage';
import MessageInput from './MessageInput';
import Spinner from '../ui/Spinner';

interface ChatWindowProps {
  session: ChatSession | undefined;
  agent: Agent;
  isLoading: boolean;
  onSendMessage: (message: string) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ session, agent, isLoading, onSendMessage }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [session?.messages, isLoading]);

  return (
    <div className="flex-1 flex flex-col h-full bg-white border border-slate-200 rounded-2xl overflow-hidden">
      <header className="flex-shrink-0 p-4 border-b border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 truncate">
          {session?.title || 'Nova Conversa'}
        </h2>
        {agent && <p className="text-sm text-slate-500">com {agent.name}</p>}
      </header>

      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {session && session.messages.length > 0 ? (
          session.messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} agent={agent} />
          ))
        ) : (
          agent ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 p-8">
              <div className="text-6xl mb-4 text-slate-700"><i className={agent.icon}></i></div>
              <h3 className="text-3xl font-bold text-slate-800 mb-2">
                {agent.name}
              </h3>
              <p className="max-w-md text-slate-600">{agent.description}</p>
            </div>
          ) : (
             <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 p-8">
                <i className="ph-bold ph-hand-pointing text-4xl mb-4"></i>
                <h3 className="text-2xl font-bold text-slate-800">Selecione um Agente</h3>
                <p>Escolha um agente na barra lateral para começar.</p>
             </div>
          )
        )}
        {isLoading && (
          <div className="flex items-start gap-3 px-4 py-3">
             <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center bg-slate-200 text-slate-600 text-xl">
               <i className={agent.icon}></i>
             </div>
             <div className="flex-1 pt-1.5">
               <div className="px-4 py-2.5 rounded-lg inline-block bg-white text-slate-800 border border-slate-200">
                 <Spinner size="sm" />
               </div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex-shrink-0 p-3 border-t border-slate-200 bg-white/50">
        <MessageInput onSendMessage={onSendMessage} isLoading={isLoading} disabled={!agent} />
      </div>
    </div>
  );
};

export default ChatWindow;