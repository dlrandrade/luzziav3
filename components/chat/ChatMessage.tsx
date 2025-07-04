
import React, { useState } from 'react';
import type { Message } from '../../types';
import { MessageAuthor } from '../../types';
import type { Agent } from '../../types';

interface ChatMessageProps {
  message: Message;
  agent: Agent;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, agent }) => {
  const isUser = message.author === MessageAuthor.USER;
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    if (isCopied) return;
    navigator.clipboard.writeText(message.text).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    });
  };


  return (
    <div className={`flex items-start gap-3 px-4 py-3`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center bg-slate-200 text-slate-600 text-xl">
          <i className={agent.icon}></i>
        </div>
      )}
      <div className={`group relative max-w-2xl flex flex-col w-full ${isUser ? 'items-end' : 'items-start'}`}>
        {!isUser && <p className="font-semibold text-slate-800 mb-1 text-sm px-1">{agent.name}</p>}
        <div className={`px-4 py-2.5 rounded-lg inline-block ${isUser ? 'bg-slate-900 text-white' : 'bg-white text-slate-800 border border-slate-200'}`}>
          <p className="whitespace-pre-wrap leading-relaxed">{message.text}</p>
        </div>
        <button 
            onClick={handleCopy}
            className={`absolute top-0 -translate-y-1/2 mt-1 p-1 bg-white border border-slate-300 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all opacity-0 group-hover:opacity-100
             ${isUser ? 'left-0 -ml-3' : 'right-0 -mr-3'}`}
            aria-label="Copy message"
        >
            {isCopied ? <i className="ph-bold ph-check text-green-600"></i> : <i className="ph-bold ph-copy"></i>}
        </button>
      </div>
       {isUser && (
        <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center bg-slate-200 text-xl text-slate-500">
          <i className="ph-bold ph-user"></i>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;