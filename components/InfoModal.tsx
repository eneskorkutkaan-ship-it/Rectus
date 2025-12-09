import React from 'react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden animate-[fadeIn_0.2s_ease-out]">
        <div className="p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Deploying This App</h2>
          <p className="text-slate-600 mb-4 text-sm leading-relaxed">
            You asked: <em>"Senın yazacağın kodu sonradan siteye cevırcenmı"</em> (Will you turn the code into a site?).
          </p>
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-4">
            <p className="text-sm text-blue-800 font-medium">
              I generate the <strong>source code</strong> (which is what you are running right now).
            </p>
            <p className="text-sm text-blue-700 mt-2">
              To turn this into a live website accessible to others on the internet, <strong>you</strong> need to deploy it using a service like Vercel, Netlify, or AWS.
            </p>
          </div>
          <p className="text-slate-600 text-sm">
            This application serves as a live demonstration of the code I can build.
          </p>
        </div>
        <div className="bg-slate-50 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};