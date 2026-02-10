
import React from 'react';
import { translations } from './translations';
import { GeneratedImage, Language, User } from './types';
import { WHATSAPP_NUMBER } from './constants';

interface DashboardProps {
  language: Language;
  user: User;
  images: GeneratedImage[];
  onNavigate: (page: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ language, user, images, onNavigate }) => {
  const t = translations[language];

  const getRemainingDays = () => {
    if (!user.subscriptionExpiry) return 0;
    const now = new Date();
    const expiry = new Date(user.subscriptionExpiry);
    const diffTime = expiry.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  };

  const handleDownload = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUpgradeClick = () => {
    const message = encodeURIComponent("Hello! I want to upgrade my Nano Banana Pro account to Premium.");
    window.open(`https://wa.me/${WHATSAPP_NUMBER.replace(/\+/g, '')}?text=${message}`, '_blank');
  };

  return (
    <div className={`pt-24 pb-20 px-6 max-w-7xl mx-auto ${language === 'ar' ? 'font-arabic' : ''}`}>
      <div className="flex flex-col md:flex-row gap-8 mb-12">
        {/* Profile Card */}
        <div className="flex-1 p-8 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 shadow-xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center text-black font-bold text-2xl">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user.username}</h1>
              <p className="text-sm text-white/50">{user.isPremium ? t.premiumUser : t.freeUser}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-black/40 rounded-xl">
              <p className="text-xs text-white/40 mb-1 uppercase tracking-wider">{t.imagesCount}</p>
              <p className="text-xl font-orbitron">{user.imagesGenerated}</p>
            </div>
            {user.isPremium && (
              <div className="p-4 bg-black/40 rounded-xl">
                <p className="text-xs text-white/40 mb-1 uppercase tracking-wider">{t.remainingDays}</p>
                <p className="text-xl font-orbitron text-yellow-400">{getRemainingDays()}</p>
              </div>
            )}
          </div>

          {!user.isPremium && (
            <button 
              onClick={handleUpgradeClick}
              className="w-full mt-6 bg-yellow-400 text-black font-bold py-3 rounded-xl hover:scale-[1.02] transition-all shadow-lg"
            >
              {t.upgradeButton}
            </button>
          )}
        </div>

        {/* Stats Placeholder */}
        <div className="hidden lg:flex flex-[1.5] flex-col gap-4">
          <div className="h-full bg-yellow-400/5 rounded-3xl border border-yellow-400/10 p-8 flex items-center justify-center relative overflow-hidden">
            <div className="relative z-10 text-center">
               <h3 className="text-2xl font-orbitron font-bold mb-2 uppercase tracking-widest">{t.nextLevelAi}</h3>
               <p className="text-white/40 text-sm">{t.experienceNano}</p>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/20 blur-[100px]"></div>
          </div>
        </div>
      </div>

      {/* History Grid */}
      <div className="mt-16">
        <h2 className="text-2xl font-orbitron font-bold mb-8 uppercase tracking-widest">{t.history}</h2>
        
        {images.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed border-white/10 rounded-3xl">
            <p className="text-white/40">{t.noImages}</p>
            <button 
              onClick={() => onNavigate('generate')}
              className="mt-4 text-yellow-400 hover:underline"
            >
              {t.generate}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {images.map((img) => (
              <div key={img.id} className="group relative bg-white/5 rounded-2xl overflow-hidden border border-white/10 hover:border-yellow-400/40 transition-all">
                <img src={img.url} alt={img.prompt} className="w-full aspect-square object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                  <p className="text-xs text-white/80 line-clamp-2 mb-3">{img.prompt}</p>
                  <button 
                    onClick={() => handleDownload(img.url, `nano-banana-${img.id}.png`)}
                    className="w-full py-2 bg-yellow-400 text-black text-xs font-bold rounded-lg"
                  >
                    {t.download}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
