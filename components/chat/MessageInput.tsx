import React, { useState } from 'react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, isLoading, disabled = false }) => {
  const [message, setMessage] = useState('');
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
      if(textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <textarea
        ref={textareaRef}
        value={message}
        onChange={handleInputChange}
        onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
            }
        }}
        placeholder={disabled ? "Selecione um agente para começar" : "Pergunte algo..."}
        className="w-full bg-white border border-slate-300 rounded-lg py-3 pl-4 pr-14 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-800 transition-all resize-none placeholder:text-slate-400 max-h-40"
        rows={1}
        disabled={isLoading || disabled}
      />
      <button
        type="submit"
        disabled={isLoading || disabled || !message.trim()}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-slate-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
        aria-label="Send message"
      >
        {isLoading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <i className="ph-bold ph-arrow-up text-lg"></i>}
      </button>
    </form>
  );
};

export default MessageInput;