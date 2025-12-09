
import React, { useState } from 'react';
import { login, register } from '../services/authService';
import { User } from '../types';

interface AuthProps {
  onLogin: (user: User) => void;
  defaultTab?: 'login' | 'register';
  onBackToHome?: () => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin, defaultTab = 'login', onBackToHome }) => {
  const [isLogin, setIsLogin] = useState(defaultTab === 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [inviteCode, setInviteCode] = useState(''); 
  const [error, setError] = useState('');
  const [showInviteField, setShowInviteField] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      const result = login(email, password);
      if (result.success && result.user) {
        onLogin(result.user);
      } else {
        setError(result.error || 'Giriş başarısız');
      }
    } else {
      if (password !== confirmPassword) {
        setError('Şifreler eşleşmiyor.');
        return;
      }
      if (name.length < 3) {
        setError('İsim en az 3 karakter olmalı.');
        return;
      }
      
      const result = register(name, email, password, inviteCode.trim()); 
      
      if (result.success && result.user) {
        onLogin(result.user);
      } else {
        setError(result.error || 'Kayıt başarısız');
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 p-4 relative">
      {onBackToHome && (
        <button 
            onClick={onBackToHome}
            className="absolute top-6 left-6 text-slate-500 hover:text-slate-800 flex items-center gap-2 font-medium"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            Ana Sayfaya Dön
        </button>
      )}

      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-slate-100 z-10">
        <div className="px-8 pt-8 pb-6 text-center">
            <div className="w-12 h-12 bg-slate-900 rounded-xl mx-auto flex items-center justify-center text-white font-bold text-xl shadow-lg mb-4">
                R
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Rectus'a Hoşgeldiniz</h2>
            <p className="text-slate-500 text-sm mt-1">Yapay zeka destekli geliştirme ortamı</p>
        </div>

        <div className="flex border-b border-slate-100">
          <button
            className={`flex-1 py-3 text-sm font-medium transition-colors ${isLogin ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
            onClick={() => setIsLogin(true)}
          >
            Giriş Yap
          </button>
          <button
            className={`flex-1 py-3 text-sm font-medium transition-colors ${!isLogin ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
            onClick={() => setIsLogin(false)}
          >
            Kayıt Ol
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100 animate-pulse">
              {error}
            </div>
          )}

          {!isLogin && (
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">İSİM</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="Adınız"
                required={!isLogin}
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">E-POSTA</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="ornek@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">ŞİFRE</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          {!isLogin && (
            <>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">ŞİFRE TEKRAR</label>
                  <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      placeholder="••••••••"
                      required={!isLogin}
                  />
                </div>
                
                {/* Simplified Invite Code Section */}
                <div className="pt-2">
                  {!showInviteField ? (
                    <button 
                      type="button" 
                      onClick={() => setShowInviteField(true)}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                      Davet Kodum Var
                    </button>
                  ) : (
                    <div className="animate-[fadeIn_0.3s_ease-out]">
                      <label className="block text-xs font-semibold text-purple-600 mb-1">DAVET KODU (Özel)</label>
                      <input
                          type="text"
                          value={inviteCode}
                          onChange={(e) => setInviteCode(e.target.value)}
                          className="w-full px-4 py-2 rounded-lg border border-purple-200 bg-purple-50 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all placeholder-purple-300 text-purple-900"
                          placeholder="Kodu buraya girin"
                      />
                    </div>
                  )}
                </div>
            </>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg transition-all shadow-lg shadow-slate-900/20 mt-4"
          >
            {isLogin ? 'Giriş Yap' : 'Hesap Oluştur'}
          </button>
        </form>
      </div>

      {/* Footer Link */}
      <div className="mt-8 text-center z-10">
          <a href="#" className="text-slate-500 text-sm font-bold tracking-widest hover:text-blue-600 transition-colors opacity-70 hover:opacity-100">
             WWW.RECTUS.AI
          </a>
      </div>
    </div>
  );
};
