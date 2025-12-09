import React, { useState, useEffect } from 'react';
import { getAllUserChats, reportMessageToAdmin } from '../services/chatService';
import { ChatSession, Message } from '../types';
import { BAD_WORDS } from '../constants';

export const ModeratorPanel: React.FC = () => {
  const [allUserData, setAllUserData] = useState<{ userId: string; sessions: ChatSession[] }[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);
  const [reportedMessages, setReportedMessages] = useState<Set<string>>(new Set());

  useEffect(() => {
    const data = getAllUserChats();
    setAllUserData(data);
  }, []);

  const handleReport = (msg: Message) => {
    reportMessageToAdmin(msg.id, msg.content, "Moderator detected prohibited content");
    const newSet = new Set(reportedMessages);
    newSet.add(msg.id);
    setReportedMessages(newSet);
    alert("Mesaj başarıyla admine raporlandı.");
  };

  const highlightBadWords = (text: string) => {
    const parts = text.split(new RegExp(`(${BAD_WORDS.join('|')})`, 'gi'));
    return parts.map((part, i) => 
        BAD_WORDS.some(word => word.toLowerCase() === part.toLowerCase()) ? 
        <span key={i} className="bg-red-200 text-red-800 font-bold px-1 rounded">{part}</span> : 
        part
    );
  };

  const containsBadWord = (text: string) => {
      return BAD_WORDS.some(word => text.toLowerCase().includes(word.toLowerCase()));
  };

  return (
    <div className="flex h-full bg-slate-50 overflow-hidden">
      {/* User List Column */}
      <div className="w-1/4 bg-white border-r border-slate-200 overflow-y-auto">
        <div className="p-4 bg-purple-600 text-white font-bold text-sm sticky top-0">
          KULLANICILAR ({allUserData.length})
        </div>
        {allUserData.map(data => (
            <button
                key={data.userId}
                onClick={() => { setSelectedUserId(data.userId); setSelectedSession(null); }}
                className={`w-full text-left p-4 border-b border-slate-100 hover:bg-purple-50 transition-colors ${selectedUserId === data.userId ? 'bg-purple-50 border-purple-200' : ''}`}
            >
                <div className="font-medium text-slate-800 text-sm truncate">ID: {data.userId.slice(0,8)}...</div>
                <div className="text-xs text-slate-500">{data.sessions.length} Sohbet</div>
            </button>
        ))}
      </div>

      {/* Session List Column */}
      <div className="w-1/4 bg-slate-50 border-r border-slate-200 overflow-y-auto">
         <div className="p-4 bg-slate-200 text-slate-700 font-bold text-sm sticky top-0">
            SOHBETLER
         </div>
         {selectedUserId ? (
             allUserData.find(u => u.userId === selectedUserId)?.sessions.map(session => (
                 <button
                    key={session.id}
                    onClick={() => setSelectedSession(session)}
                    className={`w-full text-left p-4 border-b border-slate-200 hover:bg-white transition-colors ${selectedSession?.id === session.id ? 'bg-white border-l-4 border-l-purple-500' : ''}`}
                 >
                    <div className="font-medium text-slate-800 text-sm truncate">{session.title}</div>
                    <div className="text-[10px] text-slate-500">
                        {new Date(session.lastUpdated).toLocaleDateString()}
                    </div>
                 </button>
             ))
         ) : (
             <div className="p-4 text-xs text-slate-400">Kullanıcı seçiniz.</div>
         )}
      </div>

      {/* Message View Column */}
      <div className="w-2/4 bg-white flex flex-col">
          <div className="p-4 bg-slate-100 border-b border-slate-200 font-bold text-sm text-slate-700">
              MESAJ İÇERİĞİ
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {selectedSession ? (
                  selectedSession.messages.map(msg => {
                      const isBad = containsBadWord(msg.content);
                      return (
                        <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                            <div className={`max-w-[80%] rounded-lg p-3 text-sm ${
                                msg.role === 'user' 
                                ? 'bg-blue-100 text-blue-900' 
                                : 'bg-slate-100 text-slate-800'
                            } ${isBad ? 'ring-2 ring-red-500' : ''}`}>
                                <div className="font-bold text-[10px] mb-1 opacity-50 uppercase">{msg.role}</div>
                                <div>{highlightBadWords(msg.content)}</div>
                            </div>
                            
                            {/* Report Controls for User Messages */}
                            {msg.role === 'user' && (
                                <div className="mt-1 flex items-center gap-2">
                                    {isBad && <span className="text-[10px] text-red-500 font-bold">⚠️ Şüpheli İçerik</span>}
                                    <label className="flex items-center gap-1 cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            checked={reportedMessages.has(msg.id)}
                                            onChange={() => !reportedMessages.has(msg.id) && handleReport(msg)}
                                            disabled={reportedMessages.has(msg.id)}
                                            className="w-3 h-3 accent-red-600"
                                        />
                                        <span className="text-[10px] text-slate-400 hover:text-red-500">
                                            {reportedMessages.has(msg.id) ? 'Raporlandı' : 'Admine Bildir'}
                                        </span>
                                    </label>
                                </div>
                            )}
                        </div>
                      );
                  })
              ) : (
                  <div className="text-center text-slate-400 mt-10">Görüntülemek için bir sohbet seçin.</div>
              )}
          </div>
      </div>
    </div>
  );
};