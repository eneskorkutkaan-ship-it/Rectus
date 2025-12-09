import React, { useState, useEffect } from 'react';
import { Message, UserRole } from '../types';

interface MessageBubbleProps {
  message: Message;
  currentUserRole?: UserRole;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, currentUserRole }) => {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';
  const isAdmin = currentUserRole === 'admin';

  // State to hold the Blob URL for the site link
  const [siteUrl, setSiteUrl] = useState<string | null>(null);
  const [rawHtml, setRawHtml] = useState<string | null>(null);
  const [isExpired, setIsExpired] = useState(false);

  // Check Expiry (15 minutes)
  useEffect(() => {
    if (message.role === 'model' && !isAdmin) {
      const checkExpiry = () => {
        const timeDiff = Date.now() - message.timestamp;
        const fifteenMinutes = 15 * 60 * 1000;
        setIsExpired(timeDiff > fifteenMinutes);
      };
      
      checkExpiry();
      // Check again every minute
      const timer = setInterval(checkExpiry, 60000);
      return () => clearInterval(timer);
    }
  }, [message.timestamp, message.role, isAdmin]);

  if (isSystem) {
    return (
      <div className="flex justify-center my-4">
        <span className="text-xs text-slate-400 font-medium px-2 py-1 bg-slate-50 rounded-md">
          {message.content}
        </span>
      </div>
    );
  }

  // --- Content Processing ---
  const content = message.content;
  const imageMarker = '[IMAGE]:';
  const hasGeneratedImage = content.includes(imageMarker);
  
  let displayText = content;
  let generatedImageUrl = '';

  // 1. Handle Generated Images
  if (hasGeneratedImage) {
    const parts = content.split(imageMarker);
    displayText = parts[0].trim(); 
    if (parts[1]) {
        generatedImageUrl = parts[1].trim();
    }
  }

  // 2. Handle HTML Code (Site Generation)
  // Check if message contains a significant HTML block
  const hasHtmlCode = /```html|<!DOCTYPE html>/.test(displayText);
  
  // If user is NOT admin and there is HTML code, we strip the code and show a button
  if (hasHtmlCode && !isAdmin && !isUser) {
      // Create Blob URL for the site if not already created
      if (!siteUrl && !isExpired) {
          const codeMatch = displayText.match(/```html\s*([\s\S]*?)```/) || displayText.match(/<!DOCTYPE html>[\s\S]*<\/html>/i);
          let rawCode = codeMatch ? codeMatch[1] || codeMatch[0] : '';
          
          if (rawCode) {
              // Inject base target blank for safety
               if (!rawCode.includes('<base target="_blank">')) {
                  rawCode = rawCode.replace('<head>', '<head><base target="_blank">');
               }
              const blob = new Blob([rawCode], { type: 'text/html' });
              setSiteUrl(URL.createObjectURL(blob));
              setRawHtml(rawCode);
          }
      }

      // Remove the code block from display text for non-admins
      displayText = displayText.replace(/```html[\s\S]*?```/g, '')
                               .replace(/<!DOCTYPE html>[\s\S]*<\/html>/i, '')
                               .trim();
      
      if (!displayText) displayText = "Sitenizi hazırladım.";
  }

  const uploadedImageUrl = message.image;

  const handleDownload = () => {
    if (!rawHtml) return;
    const blob = new Blob([rawHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rectus-projesi.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`relative max-w-[90%] md:max-w-[75%] rounded-2xl px-5 py-4 shadow-sm overflow-hidden ${
          isUser
            ? 'bg-blue-600 text-white rounded-tr-sm'
            : 'bg-white text-slate-800 border border-slate-100 rounded-tl-sm'
        }`}
      >
        <div className={`text-xs font-bold mb-1 opacity-70 ${isUser ? 'text-blue-100' : 'text-slate-400'}`}>
          {isUser ? 'YOU' : 'RECTUS'}
        </div>
        
        {/* Uploaded Image (User sent) */}
        {uploadedImageUrl && (
          <div className="mb-3 mt-1">
            <img 
              src={uploadedImageUrl} 
              alt="Uploaded" 
              className="rounded-lg max-h-[300px] object-cover border border-white/20"
            />
          </div>
        )}

        {/* Text Content */}
        {displayText && (
            <div className="whitespace-pre-wrap leading-relaxed text-sm md:text-base break-words">
             {displayText}
            </div>
        )}

        {/* Generated Image (Model sent) */}
        {generatedImageUrl && (
          <div className="mt-3">
             <img 
              src={generatedImageUrl} 
              alt="Generated Result" 
              className="rounded-lg w-full h-auto shadow-md border border-slate-200"
              loading="lazy"
            />
            <div className="mt-2 text-xs text-slate-400 flex items-center justify-between">
                <span>Görsel başarıyla oluşturuldu.</span>
                <a href={generatedImageUrl} download="rectus-ai-generated.png" className="text-blue-500 hover:underline">İndir</a>
            </div>
          </div>
        )}

        {/* Generated SITE Link (Hidden Code View for Users) */}
        {hasHtmlCode && !isAdmin && (
            <div className={`mt-4 border rounded-xl p-4 transition-colors ${isExpired ? 'bg-red-50 border-red-100' : 'bg-slate-50 border-slate-200 hover:border-blue-300'}`}>
                <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isExpired ? 'bg-red-100 text-red-500' : 'bg-blue-100 text-blue-600'}`}>
                        {isExpired ? (
                             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                        ) : (
                             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
                        )}
                    </div>
                    <div>
                        <div className={`font-bold text-sm ${isExpired ? 'text-red-800' : 'text-slate-800'}`}>
                            {isExpired ? 'Bağlantı Süresi Doldu' : 'Web Projesi Hazır'}
                        </div>
                        <div className="text-xs text-slate-500">
                             {isExpired ? '15 dk süre limiti aşıldı.' : '15 Dakika Süreli Önizleme'}
                        </div>
                    </div>
                </div>
                
                {!isExpired && siteUrl && (
                    <div className="flex gap-2">
                        <a 
                            href={siteUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex-1 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
                        >
                            GÖRÜNTÜLE
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                        </a>
                        <button 
                            onClick={handleDownload}
                            className="flex-1 px-4 py-2 bg-slate-200 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-300 transition-colors flex items-center justify-center gap-2"
                        >
                            İNDİR
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                        </button>
                    </div>
                )}
            </div>
        )}
      </div>
    </div>
  );
};