import React, { useState, useRef, useEffect } from 'react';
import type { User } from '../../types';
import { Role } from '../../types';

interface ProfileDropdownProps {
  user: User;
  onLogout: () => void;
  onNavigate: (view: 'chat' | 'admin') => void;
  currentView: 'chat' | 'admin';
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ user, onLogout, onNavigate, currentView }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const menuItems = [
    ...(user.role === Role.ADMIN ? [{ label: 'Administração', icon: 'ph-bold ph-gear-six', action: () => onNavigate('admin'), active: currentView === 'admin' }] : []),
    ...(user.role === Role.ADMIN ? [{ label: 'Chat', icon: 'ph-bold ph-chats', action: () => onNavigate('chat'), active: currentView === 'chat' }] : []),
    { label: 'Ajuda', icon: 'ph-bold ph-question', action: () => alert('Help clicked!') },
    { label: 'Sair', icon: 'ph-bold ph-sign-out', action: onLogout },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 p-2 rounded-lg w-full text-left hover:bg-slate-100 transition-colors duration-200"
      >
        <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full" />
        <div className="flex-1">
          <p className="font-semibold text-sm text-slate-800">{user.name}</p>
          <p className="text-xs text-slate-500 capitalize font-medium">{user.role}</p>
        </div>
        <i className={`ph ph-caret-up text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}></i>
      </button>
      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 w-full bg-white rounded-lg shadow-lg border border-slate-200 overflow-hidden animate-fade-in-up">
          <ul className="py-1">
            {menuItems.map((item, index) => (
              <li key={index}>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    item.action && item.action();
                    setIsOpen(false);
                  }}
                  className={`flex items-center px-4 py-2 text-sm ${item.active ? 'bg-slate-100 text-slate-900 font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                  <i className={`${item.icon} mr-3 text-lg`}></i>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;