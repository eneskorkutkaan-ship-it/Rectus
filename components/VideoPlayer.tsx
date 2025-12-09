
import React, { useState } from 'react';
import { SAMPLE_VIDEOS } from '../constants';

export const VideoPlayer: React.FC = () => {
  const [currentVideo, setCurrentVideo] = useState(SAMPLE_VIDEOS[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);

  const filteredVideos = SAMPLE_VIDEOS.filter(video => 
    video.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handleStop = () => {
    setIsPlaying(false);
  };

  // Using Bing Video Search embed as it's more permissive with iframes than Google
  const embedUrl = `https://www.bing.com/videos/search?q=${encodeURIComponent(currentVideo.query)}&sp=-1&ghc=1`;

  return (
    <div className="flex flex-col h-full bg-black text-white">
      {/* Main Display Area */}
      <div className="relative flex-1 bg-black flex flex-col overflow-hidden">
        
        {isPlaying ? (
             <div className="w-full h-full relative">
                 {/* Browser Toolbar Simulation */}
                 <div className="bg-[#1a1a1a] p-2 flex items-center gap-2 border-b border-[#333]">
                     <button onClick={handleStop} className="p-1 hover:bg-[#333] rounded text-slate-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"></path><polyline points="12 19 5 12 12 5"></polyline></svg>
                     </button>
                     <div className="flex-1 bg-[#000] rounded px-3 py-1 text-xs text-green-500 font-mono flex items-center">
                        <svg className="w-3 h-3 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                        https://secure-browser.rectus.ai/watch?v={currentVideo.id}
                     </div>
                 </div>
                 {/* Embedded Browser */}
                 <iframe 
                    src={embedUrl}
                    className="w-full h-full border-0"
                    title="Rectus Browser"
                    sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                    referrerPolicy="no-referrer"
                 />
             </div>
        ) : (
            <div className="relative w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-slate-900 to-black">
                <div className="text-center z-10 animate-in fade-in zoom-in duration-500 flex flex-col items-center">
                   <div className="w-24 h-24 mb-6 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center shadow-2xl shadow-blue-900/50">
                        <span className="text-3xl font-bold">{currentVideo.title.substring(0, 1)}</span>
                   </div>
                   <h2 className="text-4xl md:text-5xl font-black mb-2 tracking-tighter text-white">
                     {currentVideo.title}
                   </h2>
                   <p className="text-slate-400 text-sm mb-8 uppercase tracking-widest font-mono border border-white/10 px-3 py-1 rounded-full">
                     {currentVideo.type} • RECTUS CINEMA
                   </p>

                   <button 
                     onClick={handlePlay}
                     className="group relative inline-flex items-center justify-center px-10 py-4 font-bold text-white transition-all duration-200 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 rounded-xl backdrop-blur-md"
                   >
                     <span className="mr-3 p-1 bg-white text-black rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                     </span>
                     HEMEN OYNAT
                   </button>
                   
                   <p className="mt-6 text-[10px] text-slate-600 max-w-xs mx-auto">
                     Rectus, içerikleri kendi güvenli tarayıcısında arar ve oynatır.
                   </p>
                </div>
                {/* Background Ambient Effect */}
                <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900 via-transparent to-transparent blur-3xl"></div>
            </div>
        )}
      </div>

      {/* Controls & List */}
      <div className="p-4 bg-[#0a0a0a] border-t border-white/10 h-[30%]">
        {/* Search Bar */}
        <div className="mb-4">
             <div className="relative">
                <input 
                    type="text" 
                    placeholder="Film veya Dizi Ara..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg py-3 px-4 pl-10 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
                <svg className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
             </div>
        </div>

        {/* Video List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 h-full overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-700 pb-12">
            {filteredVideos.length > 0 ? (
                filteredVideos.map(video => (
                    <button 
                        key={video.id}
                        onClick={() => { setCurrentVideo(video); setIsPlaying(false); }}
                        className={`text-left p-3 rounded-lg transition-all flex items-center gap-3 ${currentVideo.id === video.id ? 'bg-white/10 ring-1 ring-white/20' : 'hover:bg-white/5'}`}
                    >
                        <div className="w-10 h-10 rounded-md bg-slate-800 bg-cover bg-center shrink-0 border border-white/10" style={{backgroundImage: `url(https://source.unsplash.com/random/100x100?cinema&sig=${video.id})`}}>
                        </div>
                        <div className="overflow-hidden">
                            <p className={`text-sm font-medium truncate ${currentVideo.id === video.id ? 'text-white' : 'text-slate-400'}`}>{video.title}</p>
                            <p className="text-[10px] text-slate-600">{video.type}</p>
                        </div>
                    </button>
                ))
            ) : (
                <div className="col-span-full py-6 text-center text-slate-600">
                    <p className="text-xs">Bulunamadı.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
