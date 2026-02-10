
import React from 'react';
import { translations } from './translations';
import { Language, User } from './types';

interface NavbarProps {
  user: User | null;
  language: Language;
  onLanguageToggle: () => void;
  onLogout: () => void;
  onNavigate: (page: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, language, onLanguageToggle, onLogout, onNavigate }) => {
  const t = translations[language];
  const isAdmin = user?.username === 'R2';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer group" 
          onClick={() => onNavigate('home')}
        >
          <div className="w-8 h-8 bg-yellow-400 rounded-lg transform group-hover:rotate-12 transition-transform shadow-[0_0_15px_rgba(250,204,21,0.5)]"></div>
          <span className="font-orbitron text-xl font-bold tracking-tighter neon-text">
            NANO BANANA <span className="text-yellow-400">PRO</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <button onClick={() => onNavigate('home')} className="hover:text-yellow-400 transition-colors uppercase tracking-widest">{t.exploreGallery}</button>
          {user && (
            <>
              {!isAdmin && <button onClick={() => onNavigate('generate')} className="hover:text-yellow-400 transition-colors uppercase tracking-widest">{t.generate}</button>}
              {!isAdmin && <button onClick={() => onNavigate('dashboard')} className="hover:text-yellow-400 transition-colors uppercase tracking-widest">{t.dashboard}</button>}
              {isAdmin && <button onClick={() => onNavigate('admin')} className="hover:text-yellow-400 transition-colors uppercase tracking-widest font-bold">{t.admin}</button>}
            </>
          )}
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={onLanguageToggle}
            className="px-3 py-1 rounded border border-white/20 text-xs font-bold hover:bg-white/10 transition-colors"
          >
            {language === 'en' ? 'AR' : 'EN'}
          </button>

          {user ? (
            <div className="flex items-center gap-4">
              <span className="hidden sm:inline text-white/60 text-xs">{t.welcome} {user.username}</span>
              <button 
                onClick={onLogout}
                className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-xs font-bold transition-all"
              >
                {t.logout}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => onNavigate('login')}
                className="hover:bg-white/10 px-4 py-2 rounded-lg text-xs font-bold transition-all"
              >
                {t.login}
              </button>
              <button 
                onClick={() => onNavigate('register')}
                className="bg-yellow-400 text-black px-4 py-2 rounded-lg text-xs font-bold hover:scale-105 transition-all shadow-lg"
              >
                {t.register}
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
