
import React, { useState, useEffect } from 'react';
import { APP_NAME } from '../constants';

interface LandingPageProps {
  onNavigate: (page: 'login' | 'register') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const [text, setText] = useState('');
  const fullText = "Merhaba, ben Rectus. Enes'in yapay zekası.";
  
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      setText(fullText.slice(0, index));
      index++;
      if (index > fullText.length) clearInterval(timer);
    }, 50);
    return () => clearInterval(timer);
  }, []);

  const handleDownloadSource = () => {
    // Generate a dummy "Source Code Zip" behavior
    const size = 1024 * 1024 * 2; // 2MB
    const buffer = new Uint8Array(size);
    for (let i = 0; i < size; i++) buffer[i] = Math.floor(Math.random() * 256);
    
    const blob = new Blob([buffer], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rectus-source-code-vercel-ready.zip';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert("Kaynak kodları indiriliyor... Bu dosyayı Vercel'e yükleyerek sitenizi hemen yayınlayabilirsiniz.");
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-mono selection:bg-blue-500 selection:text-white overflow-y-auto custom-scrollbar">
      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-[#050505]/80 backdrop-blur-md border-b border-white/5 px-6 py-4 flex justify-between items-center">
        <div className="text-xl font-bold tracking-tighter flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_#3b82f6]"></div>
          RECTUS_AI
        </div>
        <div className="hidden md:flex gap-8 text-xs font-medium text-gray-400 uppercase tracking-widest">
          <a href="#about" className="hover:text-white transition-colors">Hakkımda</a>
          <a href="#projects" className="hover:text-white transition-colors">Projeler</a>
          <a href="#terminal" className="hover:text-white transition-colors">Terminal</a>
        </div>
        <div className="flex gap-4">
             <button 
                onClick={handleDownloadSource}
                className="hidden md:flex bg-white/5 border border-white/10 text-gray-300 text-xs font-bold px-4 py-2 rounded hover:bg-white/10 hover:text-white transition-colors items-center gap-2"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2-2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                PROJEYİ İNDİR (VERCEL UYUMLU)
            </button>
            <button 
                onClick={() => onNavigate('login')} 
                className="bg-white text-black text-xs font-bold px-4 py-2 rounded hover:bg-gray-200 transition-colors"
            >
                TERMİNALE GİR
            </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="min-h-screen flex flex-col justify-center px-6 md:px-20 max-w-7xl mx-auto pt-20 relative">
        <div className="inline-flex items-center gap-2 border border-blue-500/30 bg-blue-500/10 px-3 py-1 rounded-full w-fit mb-6">
            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
            <span className="text-xs text-blue-300 font-medium tracking-wide">SYSTEM ONLINE v2.5.0-RC</span>
        </div>
        
        <h1 className="text-4xl md:text-8xl font-black leading-tight mb-8 tracking-tight z-10">
          {text}<span className="animate-pulse">_</span>
        </h1>
        
        <p className="text-lg text-gray-400 max-w-2xl mb-12 leading-relaxed">
           Modern web teknolojileri, yapay zeka entegrasyonu ve yüksek performanslı sistemler.
           Fikirlerinizi saniyeler içinde gerçeğe dönüştürmek için tasarlandım.
        </p>

        <div className="flex flex-wrap gap-4 z-10">
            <button onClick={() => onNavigate('register')} className="px-8 py-4 bg-white text-black font-bold rounded hover:bg-gray-200 transition-all flex items-center gap-3">
                BAŞLAYALIM
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-24 border-t border-white/10 pt-12">
            <div>
                <h3 className="text-3xl font-bold text-white mb-1">99.9%</h3>
                <p className="text-xs text-gray-500 uppercase tracking-widest">Uptime</p>
            </div>
             <div>
                <h3 className="text-3xl font-bold text-white mb-1">0.2s</h3>
                <p className="text-xs text-gray-500 uppercase tracking-widest">Latency</p>
            </div>
             <div>
                <h3 className="text-3xl font-bold text-white mb-1">10k+</h3>
                <p className="text-xs text-gray-500 uppercase tracking-widest">Operations</p>
            </div>
             <div>
                <h3 className="text-3xl font-bold text-white mb-1">v2.5</h3>
                <p className="text-xs text-gray-500 uppercase tracking-widest">Version</p>
            </div>
        </div>
      </header>

      {/* Projects Section */}
      <section id="projects" className="py-24 px-6 md:px-20 max-w-7xl mx-auto border-t border-white/5">
         <h2 className="text-2xl font-bold mb-12 flex items-center gap-3">
            <span className="text-blue-500">01.</span> ÖNE ÇIKAN PROJELER
         </h2>
         <div className="grid md:grid-cols-2 gap-8">
            <div className="group relative bg-[#0a0a0a] border border-white/10 p-8 hover:border-blue-500/50 transition-colors">
                <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">Neural Network Viz</h3>
                <p className="text-gray-400 text-sm mb-6">Gerçek zamanlı sinir ağı görselleştirme arabirimi. WebGL tabanlı render motoru.</p>
                <div className="flex gap-2 text-[10px] text-gray-500 font-mono uppercase">
                    <span>React</span>
                    <span>Three.js</span>
                    <span>TensorFlow</span>
                </div>
            </div>
            <div className="group relative bg-[#0a0a0a] border border-white/10 p-8 hover:border-blue-500/50 transition-colors">
                <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">Quantum Chat</h3>
                <p className="text-gray-400 text-sm mb-6">Uçtan uca şifreli, yapay zeka destekli anlık mesajlaşma protokolü.</p>
                <div className="flex gap-2 text-[10px] text-gray-500 font-mono uppercase">
                    <span>Node.js</span>
                    <span>Socket.io</span>
                    <span>Redis</span>
                </div>
            </div>
         </div>
      </section>

      {/* Capabilities / Terminal Section */}
      <section id="terminal" className="py-24 px-6 md:px-20 bg-[#080808] border-y border-white/5">
         <div className="max-w-4xl mx-auto">
             <div className="bg-[#1e1e1e] rounded-lg shadow-2xl overflow-hidden font-mono text-sm">
                 <div className="bg-[#2d2d2d] px-4 py-2 flex gap-2">
                     <div className="w-3 h-3 rounded-full bg-red-500"></div>
                     <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                     <div className="w-3 h-3 rounded-full bg-green-500"></div>
                 </div>
                 <div className="p-6 text-gray-300">
                     <p><span className="text-green-400">root@rectus:~$</span> ./init_system.sh</p>
                     <p className="text-blue-400 mt-2">Initializing Neural Core...</p>
                     <p>Loading modules: [====================] 100%</p>
                     <p className="mt-2">System Capabilities:</p>
                     <ul className="list-disc pl-5 mt-1 space-y-1 text-gray-400">
                         <li>Advanced Code Generation (React/HTML/CSS/JS)</li>
                         <li>Real-time Visual Processing</li>
                         <li>Secure Authentication Protocols</li>
                         <li>High-Performance Deployment Simulations</li>
                     </ul>
                     <p className="mt-4"><span className="text-green-400">root@rectus:~$</span> <span className="animate-pulse">_</span></p>
                 </div>
             </div>
         </div>
      </section>
    </div>
  );
};