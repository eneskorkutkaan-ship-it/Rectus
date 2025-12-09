
import React, { useState, useEffect } from 'react';
import { getSystemConfig, updateSystemConfig, makeUserAdmin } from '../services/authService';
import { SystemConfig } from '../types';

interface CreatorDashboardProps {
  onClose: () => void;
}

export const CreatorDashboard: React.FC<CreatorDashboardProps> = ({ onClose }) => {
  const [config, setConfig] = useState<SystemConfig>(getSystemConfig());
  const [adminEmail, setAdminEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleToggleBots = () => {
    const newCfg = updateSystemConfig({ allowMinecraftBots: !config.allowMinecraftBots });
    setConfig(newCfg);
  };

  const handleChangeName = (name: string) => {
    const newCfg = updateSystemConfig({ systemName: name });
    setConfig(newCfg);
  };

  const handleLimitChange = (limit: number) => {
    const newCfg = updateSystemConfig({ weeklySiteLimit: limit });
    setConfig(newCfg);
  };

  const handleAddAdmin = () => {
    const success = makeUserAdmin(adminEmail);
    if (success) {
        setMessage(`Başarılı: ${adminEmail} artık bir Admin.`);
        setAdminEmail('');
    } else {
        setMessage(`Hata: Kullanıcı bulunamadı.`);
    }
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md animate-in zoom-in duration-200">
      <div className="bg-slate-900 border border-yellow-500/30 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden relative">
         <div className="h-1 bg-gradient-to-r from-yellow-500 via-red-500 to-yellow-500 animate-pulse"></div>
         
         <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
         </button>

         <div className="p-8">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-yellow-500 text-black rounded-lg flex items-center justify-center font-bold text-2xl shadow-lg shadow-yellow-500/20">
                    C
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">SİSTEM ÇEKİRDEĞİ</h2>
                    <p className="text-yellow-500 text-xs font-mono uppercase tracking-widest">Creator (God) Mode // Authorized</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Minecraft Bots Override */}
                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                    <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                        <svg className="text-red-500" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                        Bot Protokolü
                    </h3>
                    <p className="text-xs text-slate-400 mb-4">Minecraft saldırı botlarına global izin ver.</p>
                    <button 
                        onClick={handleToggleBots}
                        className={`w-full py-2 rounded-lg text-xs font-bold transition-all ${config.allowMinecraftBots ? 'bg-red-600 text-white shadow-lg shadow-red-900/50' : 'bg-slate-700 text-slate-400'}`}
                    >
                        {config.allowMinecraftBots ? '⚠️ KORUMA DEVRE DIŞI (BOTLAR AKTİF)' : 'GÜVENLİK AKTİF'}
                    </button>
                </div>

                {/* System Name */}
                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                    <h3 className="text-sm font-bold text-white mb-2">Sistem Adı</h3>
                    <input 
                        type="text" 
                        value={config.systemName}
                        onChange={(e) => handleChangeName(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white text-sm focus:border-yellow-500 outline-none"
                    />
                </div>

                {/* Site Limits */}
                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                    <h3 className="text-sm font-bold text-white mb-2">Haftalık Site Limiti</h3>
                    <div className="flex items-center gap-4">
                        <input 
                            type="range" 
                            min="1" 
                            max="50" 
                            value={config.weeklySiteLimit}
                            onChange={(e) => handleLimitChange(parseInt(e.target.value))}
                            className="flex-1 accent-yellow-500"
                        />
                        <span className="text-xl font-bold text-yellow-400">{config.weeklySiteLimit}</span>
                    </div>
                </div>

                {/* Add Admin */}
                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                    <h3 className="text-sm font-bold text-white mb-2">Admin Ata</h3>
                    <div className="flex gap-2">
                        <input 
                            type="email" 
                            placeholder="user@email.com"
                            value={adminEmail}
                            onChange={(e) => setAdminEmail(e.target.value)}
                            className="flex-1 bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white text-sm focus:border-yellow-500 outline-none"
                        />
                        <button 
                            onClick={handleAddAdmin}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-xs font-bold"
                        >
                            EKLE
                        </button>
                    </div>
                    {message && <p className="text-xs text-green-400 mt-2">{message}</p>}
                </div>
            </div>
         </div>
         
         <div className="bg-slate-950 p-4 text-center">
            <p className="text-[10px] text-slate-600 font-mono">RECTUS KERNEL ACCESS GRANTED // ID: CREATOR-001</p>
         </div>
      </div>
    </div>
  );
};
