import React from 'react';
import { ChatSession } from '../types';

interface SidebarProps {
  sessions: ChatSession[];
  currentSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  sessions, 
  currentSessionId, 
  onSelectSession, 
  onNewChat,
  isOpen,
  onClose
}) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={onClose} />
      )}

      {/* Sidebar Container */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-slate-50 border-r border-slate-200 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:relative
        flex flex-col
      `}>
        {/* Header */}
        <div className="h-16 flex items-center px-4 border-b border-slate-200">
           <button 
             onClick={() => { onNewChat(); if (window.innerWidth < 768) onClose(); }}
             className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm"
           >
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
             Yeni Sohbet
           </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto py-2 px-2 space-y-1">
           {sessions.length === 0 && (
              <div className="text-center py-8 text-xs text-slate-400">
                Geçmiş bulunamadı.
              </div>
           )}
           {sessions.map(session => (
             <button
               key={session.id}
               onClick={() => { onSelectSession(session.id); if (window.innerWidth < 768) onClose(); }}
               className={`w-full text-left px-3 py-3 rounded-lg text-sm transition-colors group relative ${
                 session.id === currentSessionId 
                   ? 'bg-blue-50 text-blue-700 font-medium' 
                   : 'text-slate-600 hover:bg-slate-100'
               }`}
             >
               <div className="truncate pr-4">{session.title}</div>
               <div className="text-[10px] text-slate-400 mt-0.5">
                 {new Date(session.lastUpdated).toLocaleDateString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
               </div>
             </button>
           ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50">
           <div className="text-[10px] text-center text-slate-400 font-medium">
              RECTUS AI v2.5
           </div>
        </div>
      </div>
    </>
  );
};