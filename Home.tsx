
import React from 'react';
import { translations } from '../translations';
import { Language, User } from '../types';
import { GALLERY_IMAGES, PREMIUM_PRICE } from '../constants';

interface HomeProps {
  language: Language;
  user: User | null;
  onNavigate: (page: string) => void;
}

const Home: React.FC<HomeProps> = ({ language, user, onNavigate }) => {
  const t = translations[language];

  return (
    <div className={`pt-24 pb-20 px-6 ${language === 'ar' ? 'font-arabic' : ''}`}>
      {/* Hero Section */}
      <div className="max-w-5xl mx-auto text-center py-12">
        <h1 className="text-5xl md:text-8xl font-orbitron font-bold mb-6 tracking-tight leading-tight">
          <span className="bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 bg-clip-text text-transparent">
            {t.title}
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto mb-8 leading-relaxed">
          {t.tagline} {t.description}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            {t.freeLabel}
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-yellow-400/10 border border-yellow-400/30 rounded-full text-xs text-yellow-400">
            <span className="font-bold">PRO:</span> {PREMIUM_PRICE}
          </div>
        </div>

        <button 
          onClick={() => onNavigate(user ? 'generate' : 'register')}
          className="bg-yellow-400 text-black text-lg font-bold px-12 py-5 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(250,204,21,0.3)] neon-glow mb-20"
        >
          {user ? t.generate : t.register}
        </button>

        {/* Info Grid */}
        <div className="grid md:grid-cols-3 gap-8 text-left max-w-4xl mx-auto">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <h3 className="text-yellow-400 font-bold mb-2">{t.cinematicTitle}</h3>
            <p className="text-sm text-white/60">{t.cinematicDesc}</p>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <h3 className="text-yellow-400 font-bold mb-2">{t.instantTitle}</h3>
            <p className="text-sm text-white/60">{t.instantDesc}</p>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <h3 className="text-yellow-400 font-bold mb-2">{t.secureTitle}</h3>
            <p className="text-sm text-white/60">{t.secureDesc}</p>
          </div>
        </div>
      </div>

      {/* Gallery Section */}
      <div className="max-w-7xl mx-auto mt-20">
        <h2 className="text-3xl font-orbitron font-bold mb-10 text-center uppercase tracking-widest">{t.exploreGallery}</h2>
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4">
          {GALLERY_IMAGES.map((src, i) => (
            <div 
              key={i} 
              className="relative group overflow-hidden rounded-xl border border-white/10 hover:border-yellow-400/50 transition-colors mb-4 break-inside-avoid-column"
            >
              <img 
                src={src} 
                alt="AI Gallery" 
                className="w-full h-auto transition-all duration-700 block" 
                loading="lazy"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=60&w=400&auto=format&fit=crop";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <p className="text-xs font-mono text-yellow-400">NANO_GEN_{String(i+1).padStart(2, '0')}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
