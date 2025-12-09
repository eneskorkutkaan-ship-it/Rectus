
import React, { useState, useEffect } from 'react';
import { getSystemConfig } from '../services/authService';
import { User } from '../types';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  const [systemName, setSystemName] = useState('Rectus AI');

  useEffect(() => {
    // Poll for system name changes
    const checkName = () => {
        const config = getSystemConfig();
        setSystemName(config.systemName);
    };
    checkName();
    const timer = setInterval(checkName, 2000);
    return () => clearInterval(timer);
  }, []);

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'creator': return 'bg-yellow-500 text-black';
      case 'admin': return 'bg-red-500 text-white';
      case 'moderator': return 'bg-purple-500 text-white';
      default: return 'bg-blue-500 text-white';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'creator': return 'KURUCU (CREATOR)';
      case 'admin': return 'YÖNETİCİ';
      case 'moderator': return 'MODERATÖR';
      default: return 'KULLANICI';
    }
  };

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-20 px-6 py-3 flex items-center justify-between shadow-sm">
      <div className="flex items-center space-x-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-lg shadow-lg ${user?.role === 'creator' ? 'bg-yellow-500 text-black shadow-yellow-500/30' : 'bg-slate-900 text-white shadow-blue-500/20'}`}>
          {user?.role === 'creator' ? 'C' : 'R'}
        </div>
        <div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">{systemName}</h1>
            <p className="text-[10px] text-slate-500 font-medium -mt-1">INTELLIGENT SYSTEM</p>
        </div>
      </div>

      {user && (
        <div className="flex items-center gap-4">
           <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-semibold text-slate-800">{user.name}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${getRoleColor(user.role)}`}>
                {getRoleLabel(user.role)}
              </span>
           </div>
           <button 
             onClick={onLogout}
             className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
             title="Çıkış Yap"
           >
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
               <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
               <polyline points="16 17 21 12 16 7"></polyline>
               <line x1="21" y1="12" x2="9" y2="12"></line>
             </svg>
           </button>
        </div>
      )}
    </header>
  );
};