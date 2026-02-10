
import React from 'react';
import { translations } from '../translations';
import { Language } from '../types';
import { PREMIUM_PRICE, WHATSAPP_NUMBER } from '../constants';

interface UpgradeProps {
  language: Language;
}

const Upgrade: React.FC<UpgradeProps> = ({ language }) => {
  const t = translations[language];

  const handleWhatsapp = () => {
    const message = encodeURIComponent("Hello! I want to upgrade to Nano Banana Pro Premium.");
    window.open(`https://wa.me/${WHATSAPP_NUMBER.replace(/\+/g, '')}?text=${message}`, '_blank');
  };

  return (
    <div className={`pt-24 pb-20 px-6 max-w-4xl mx-auto text-center ${language === 'ar' ? 'font-arabic' : ''}`}>
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-orbitron font-bold mb-4 neon-text">
          UPGRADE TO <span className="text-yellow-400">PREMIUM</span>
        </h1>
        <p className="text-white/60 text-lg">{t.tagline}</p>
      </div>

      <div className="bg-gradient-to-br from-white/10 to-transparent border border-white/20 rounded-[40px] p-8 md:p-12 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/10 blur-[120px]"></div>
        
        <div className="relative z-10">
          <div className="inline-block px-4 py-1 bg-yellow-400 text-black text-xs font-bold rounded-full mb-6 uppercase tracking-widest">
            Best Value
          </div>
          <div className="text-5xl md:text-7xl font-orbitron font-bold mb-8">
            {PREMIUM_PRICE}<span className="text-xl text-white/40 font-sans ml-2">/mo</span>
          </div>

          <div className="grid md:grid-cols-2 gap-4 text-left mb-10 max-w-xl mx-auto">
            {t.premiumFeatures.map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-yellow-400 flex items-center justify-center">
                  <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm text-white/80">{feature}</span>
              </div>
            ))}
          </div>

          <button 
            onClick={handleWhatsapp}
            className="w-full bg-yellow-400 text-black text-xl font-bold py-5 rounded-2xl hover:scale-105 transition-all shadow-xl flex items-center justify-center gap-3"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.025 3.207l-.694 2.547 2.601-.682c.847.463 1.803.708 2.836.709h.001c3.182 0 5.767-2.586 5.768-5.766 0-3.18-2.585-5.766-5.769-5.766zm3.426 8.21c-.145.409-.85.76-1.168.81-.284.045-.653.078-1.049-.1-.266-.12-.435-.197-.745-.333-1.312-.576-2.164-1.92-2.228-2.006-.065-.086-.531-.707-.531-1.348s.33-.96.448-1.085c.118-.124.257-.155.343-.155.086 0 .172.001.246.004.081.003.188-.031.294.225.109.264.372.906.405.973.033.067.054.145.011.231-.043.086-.065.14-.13.215-.065.075-.136.168-.194.226-.067.067-.137.14-.059.273.078.134.348.575.746.931.512.457.944.599 1.077.665.134.067.211.056.289-.033.078-.089.333-.388.421-.52.088-.132.177-.11.297-.065.121.045.765.361.897.426.132.065.22.097.252.152.033.055.033.321-.112.73z" />
            </svg>
            {t.whatsappButton}
          </button>
          
          <p className="mt-6 text-xs text-white/30 uppercase tracking-widest font-bold">
            Secure Payments via Vodafone Cash / InstaPay
          </p>
        </div>
      </div>
    </div>
  );
};

export default Upgrade;
