
import React, { useState } from 'react';
import { translations } from './translations';
import { Language } from './types';
import { GALLERY_IMAGES } from './constants';

interface GalleryProps {
  language: Language;
}

const Gallery: React.FC<GalleryProps> = ({ language }) => {
  const t = translations[language];
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());

  const handleImageError = (index: number) => {
    setFailedImages(prev => {
      const next = new Set(prev);
      next.add(index);
      return next;
    });
  };

  const getFallbackUrl = (index: number) => {
    const fallbackOptions = [
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe",
      "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e",
      "https://images.unsplash.com/photo-1550684848-fac1c5b4e853"
    ];
    return `${fallbackOptions[index % fallbackOptions.length]}?auto=format&fit=crop&q=60&w=800`;
  };

  return (
    <div id="gallery" className="max-w-7xl mx-auto mt-20 px-6">
      <h2 className="text-3xl font-orbitron font-bold mb-10 text-center uppercase tracking-widest neon-text">
        {t.exploreGallery}
      </h2>
      <div className="columns-2 md:columns-3 lg:columns-4 gap-4">
        {GALLERY_IMAGES.map((src, i) => (
          <div 
            key={i} 
            className="relative group overflow-hidden rounded-xl border border-white/10 hover:border-yellow-400/50 transition-colors mb-4 break-inside-avoid-column cursor-zoom-in bg-white/5 min-h-[150px]"
          >
            <img 
              src={failedImages.has(i) ? getFallbackUrl(i) : src} 
              alt={`AI Gallery Image ${i + 1}`} 
              className="w-full h-auto transition-all duration-700 block group-hover:scale-110" 
              loading="lazy"
              onError={() => handleImageError(i)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
              <p className="text-xs font-mono text-yellow-400">NANO_GEN_{String(i+1).padStart(2, '0')}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
