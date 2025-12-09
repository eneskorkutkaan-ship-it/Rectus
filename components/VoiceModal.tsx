import React, { useEffect, useState, useRef } from 'react';
import { LiveVoiceManager } from '../services/geminiService';

interface VoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VoiceModal: React.FC<VoiceModalProps> = ({ isOpen, onClose }) => {
  const [status, setStatus] = useState('Hazırlanıyor...');
  const [volume, setVolume] = useState(0);
  const managerRef = useRef<LiveVoiceManager | null>(null);

  useEffect(() => {
    if (isOpen) {
      managerRef.current = new LiveVoiceManager();
      managerRef.current.connect(
        (newStatus) => setStatus(newStatus),
        (vol) => setVolume(vol)
      );
    } else {
      if (managerRef.current) {
        managerRef.current.disconnect();
        managerRef.current = null;
      }
    }

    return () => {
      if (managerRef.current) {
        managerRef.current.disconnect();
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="relative w-full max-w-md p-8 flex flex-col items-center">
        {/* Close Button */}
        <button 
            onClick={onClose}
            className="absolute top-0 right-4 text-white/50 hover:text-white p-2"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>

        {/* Visualizer Circle */}
        <div className="relative w-48 h-48 mb-8 flex items-center justify-center">
           {/* Pulsing rings */}
           <div className={`absolute inset-0 rounded-full border-2 border-blue-500/30 animate-[ping_2s_ease-out_infinite]`} style={{ animationDuration: '3s' }}></div>
           <div className={`absolute inset-4 rounded-full border border-purple-500/30 animate-[ping_2s_ease-out_infinite]`} style={{ animationDuration: '2s' }}></div>
           
           {/* Center Core */}
           <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full shadow-[0_0_50px_rgba(37,99,235,0.5)] flex items-center justify-center relative z-10">
               <div className="w-20 h-20 bg-black/20 rounded-full backdrop-blur-sm flex items-center justify-center">
                   <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="white" stroke="none" className="animate-pulse">
                       <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                       <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                       <line x1="12" y1="19" x2="12" y2="23"></line>
                       <line x1="8" y1="23" x2="16" y2="23"></line>
                   </svg>
               </div>
           </div>
        </div>

        {/* Status Text */}
        <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Rectus Live</h2>
        <p className={`text-sm font-mono uppercase tracking-widest mb-8 ${status === 'Bağlandı' ? 'text-green-400' : 'text-slate-400'}`}>
            {status}
        </p>

        {/* Controls */}
        <div className="flex gap-4">
            <button 
                onClick={onClose}
                className="px-8 py-3 bg-red-600/20 hover:bg-red-600 text-red-100 hover:text-white border border-red-600/50 rounded-full font-bold transition-all"
            >
                Aramayı Sonlandır
            </button>
        </div>
        
        <p className="mt-8 text-xs text-white/20 text-center">
            Gerçek zamanlı ses modülü aktiftir.<br/>Gemini 2.5 Flash Audio Preview
        </p>
      </div>
    </div>
  );
};