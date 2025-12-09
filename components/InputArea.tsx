import React, { useState, useRef, useEffect } from 'react';

interface InputAreaProps {
  onSendMessage: (text: string, image?: string, isImageGen?: boolean) => void;
  isLoading: boolean;
  isAdmin?: boolean;
  onStartVoice?: () => void;
}

export const InputArea: React.FC<InputAreaProps> = ({ onSendMessage, isLoading, isAdmin, onStartVoice }) => {
  const [text, setText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e?: React.FormEvent, isImageGen: boolean = false) => {
    if (e) e.preventDefault();
    if ((!text.trim() && !selectedImage) || isLoading) return;
    
    const lowerText = text.toLowerCase();
    
    // Aggressive detection for image generation commands
    const isExplicitImageGen = isImageGen || (
        lowerText.includes('görsel oluştur') || 
        lowerText.includes('resim yap') || 
        lowerText.includes('resim çiz') ||
        lowerText.includes('görseli hazırla') ||
        lowerText.includes('fotoğraf oluştur') ||
        lowerText.includes('resim üret') ||
        lowerText.includes('çizim yap') ||
        lowerText.includes('tasarla') ||
        lowerText.includes('yarat') ||
        (lowerText.includes('oluştur') && (lowerText.includes('görsel') || lowerText.includes('resim') || lowerText.includes('logo'))) ||
        lowerText.startsWith('çiz') ||
        lowerText.includes('draw') ||
        lowerText.includes('generate image')
    );

    onSendMessage(text, selectedImage || undefined, isExplicitImageGen);
    setText('');
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleAction = (action: string) => {
    if (action === 'image') {
       setText("Bana [buraya detayları yazın] görseli oluştur");
       if (textareaRef.current) {
         setTimeout(() => {
            textareaRef.current?.focus();
            const start = 5;
            const end = 26;
            textareaRef.current?.setSelectionRange(start, end);
         }, 10);
       }
       return;
    }
    if (action === 'code') setText("Bana HTML ve CSS ile modern bir portfolyo sitesi yap.");
    if (action === 'homework') setText("Şu matematik problemini adım adım çöz: ");
    
    if (textareaRef.current) textareaRef.current.focus();
  };

  const triggerFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setSelectedImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [text]);

  return (
    <div className={`w-full ${isAdmin ? 'bg-slate-900 border-t border-slate-700' : 'bg-white border-t border-slate-200'} px-4 py-4 md:px-6 md:py-6 sticky bottom-0 z-20`}>
      <div className="max-w-4xl mx-auto relative">
        
        {/* Quick Actions */}
        <div className="flex gap-2 mb-3 overflow-x-auto pb-1 no-scrollbar">
            <button onClick={() => handleAction('image')} className={`text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-colors whitespace-nowrap ${isAdmin ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                Görsel Oluştur
            </button>
            <button onClick={() => handleAction('code')} className={`text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-colors whitespace-nowrap ${isAdmin ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
                Kod Yaz
            </button>
            <button onClick={() => handleAction('homework')} className={`text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-colors whitespace-nowrap ${isAdmin ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
                Ödev Çöz
            </button>
        </div>

        {/* Selected Image Preview */}
        {selectedImage && (
           <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center gap-3">
                 <img src={selectedImage} alt="Selected" className="h-16 w-16 rounded-lg object-cover border border-blue-100" />
                 <div>
                    <span className="text-xs font-bold text-blue-800 block">Görsel Yüklendi</span>
                    <span className="text-[10px] text-blue-600">Bu görseli analiz ettirebilirsin.</span>
                 </div>
              </div>
              <button 
                onClick={() => { setSelectedImage(null); if(fileInputRef.current) fileInputRef.current.value = ''; }} 
                className="bg-white text-slate-400 p-2 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
           </div>
        )}

        <div className={`relative flex items-end border rounded-xl transition-all shadow-sm ${isAdmin ? 'bg-slate-800 border-slate-700 focus-within:border-blue-500' : 'bg-slate-50 border-slate-300 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500'}`}>
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isAdmin ? "Komut girin, Efendim..." : "Rectus'a yaz..."}
            className={`w-full bg-transparent border-0 focus:ring-0 resize-none py-3.5 pl-4 pr-32 placeholder-opacity-50 max-h-[150px] min-h-[52px] ${isAdmin ? 'text-white placeholder-slate-400' : 'text-slate-800 placeholder-slate-400'}`}
            rows={1}
            disabled={isLoading}
          />

          {/* Tools Area */}
          <div className="absolute right-2 bottom-2 flex items-center gap-2">
              <input 
                type="file" 
                id="file-upload"
                accept="image/*" 
                ref={fileInputRef} 
                className="hidden" 
                onChange={handleFileSelect}
              />
              
              {/* IMAGE UPLOAD BUTTON (Fixed Visibility) */}
              <button
                type="button"
                onClick={triggerFileUpload}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors cursor-pointer ${isAdmin ? 'text-slate-400 hover:bg-slate-700 hover:text-white' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}
                title="Görsel Yükle"
              >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                  <span className="text-[10px] font-bold hidden md:inline">YÜKLE</span>
              </button>

              {/* VOICE BUTTON */}
              {onStartVoice && (
                <button
                    type="button"
                    onClick={onStartVoice}
                    className={`p-2 rounded-lg transition-colors flex items-center justify-center ${isAdmin ? 'text-slate-400 hover:bg-slate-700 hover:text-white' : 'text-slate-500 hover:bg-slate-200 hover:text-blue-600'}`}
                    title="Sesli Sohbet (Canlı)"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
                </button>
              )}

              <button
                onClick={() => handleSubmit()}
                disabled={(!text.trim() && !selectedImage) || isLoading}
                className={`p-2 rounded-lg transition-colors ${
                  (!text.trim() && !selectedImage) || isLoading
                    ? (isAdmin ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-slate-200 text-slate-400 cursor-not-allowed')
                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                }`}
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                )}
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};