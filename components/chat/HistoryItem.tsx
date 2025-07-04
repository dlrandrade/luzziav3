
import React, { useState } from 'react';
import type { ChatSession } from '../../types';

interface HistoryItemProps {
  session: ChatSession;
  isActive: boolean;
  onClick: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdateTitle: (id: string, newTitle: string) => void;
  onExport: (id: string) => void;
}

const HistoryItem: React.FC<HistoryItemProps> = ({ session, isActive, onClick, onDelete, onUpdateTitle, onExport }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(session.title);

  const handleTitleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onUpdateTitle(session.id, title.trim());
    }
    setIsEditing(false);
  };
  
  const handleBlur = () => {
    if (title.trim()) {
      onUpdateTitle(session.id, title.trim());
    } else {
        setTitle(session.title); // revert if empty
    }
    setIsEditing(false);
  }

  return (
    <div
      className={`group relative p-3 rounded-lg cursor-pointer transition-colors duration-200 mb-1 ${
        isActive ? 'bg-slate-200' : 'hover:bg-slate-100'
      }`}
      onClick={() => !isEditing && onClick(session.id)}
    >
      {isEditing ? (
        <form onSubmit={handleTitleUpdate}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleBlur}
            className="w-full bg-white text-slate-800 text-sm font-medium p-1 rounded border border-slate-800 focus:outline-none"
            autoFocus
          />
        </form>
      ) : (
        <p className="font-medium text-sm text-slate-700 truncate pr-12">{session.title}</p>
      )}
      <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center opacity-0 group-hover:opacity-100 transition-opacity bg-slate-200 rounded-md">
        <button onClick={(e) => { e.stopPropagation(); setIsEditing(true); }} className="p-1.5 text-slate-500 hover:text-slate-900" aria-label="Edit title"><i className="ph ph-pencil-simple"></i></button>
        <button onClick={(e) => { e.stopPropagation(); onExport(session.id); }} className="p-1.5 text-slate-500 hover:text-slate-900" aria-label="Export chat"><i className="ph ph-download-simple"></i></button>
        <button onClick={(e) => { e.stopPropagation(); onDelete(session.id); }} className="p-1.5 text-slate-500 hover:text-red-500" aria-label="Delete chat"><i className="ph ph-trash"></i></button>
      </div>
    </div>
  );
};

export default HistoryItem;