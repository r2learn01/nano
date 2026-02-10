
import React, { useState, useRef, useEffect } from 'react';
import { translations } from '../translations';
import { Language, User, GeneratedImage } from '../types';
import { generateImage, editImage, blobToBase64 } from '../services/gemini';
import { FREE_IMAGE_LIMIT, WHATSAPP_NUMBER } from '../constants';

interface GenerateProps {
  language: Language;
  user: User;
  onImageGenerated: (img: GeneratedImage) => void;
  onNavigate: (page: string) => void;
}

const Generate: React.FC<GenerateProps> = ({ language, user, onImageGenerated, onNavigate }) => {
  const t = translations[language];
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isLimitReached = !user.isPremium && user.imagesGenerated >= FREE_IMAGE_LIMIT;

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    if (isLimitReached) return;

    setLoading(true);
    setError(null);
    try {
      let resultUrl = '';
      if (editMode && uploadFile) {
        const base64 = await blobToBase64(uploadFile);
        resultUrl = await editImage(base64, uploadFile.type, prompt);
      } else {
        resultUrl = await generateImage(prompt);
      }

      setLastResult(resultUrl);
      
      const newImg: GeneratedImage = {
        id: Math.random().toString(36).substr(2, 9),
        userId: user.id,
        url: resultUrl,
        prompt: prompt,
        timestamp: new Date().toISOString()
      };
      onImageGenerated(newImg);
    } catch (err: any) {
      console.error(err);
      setError(err.message || (language === 'ar' ? 'فشل الإنشاء. يرجى المحاولة مرة أخرى.' : "Generation failed. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpgradeClick = () => {
    const message = encodeURIComponent("Hello! I want to upgrade my Nano Banana Pro account to Premium.");
    window.open(`https://wa.me/${WHATSAPP_NUMBER.replace(/\+/g, '')}?text=${message}`, '_blank');
  };

  return (
    <div className={`pt-24 pb-20 px-6 max-w-4xl mx-auto ${language === 'ar' ? 'font-arabic' : ''}`}>
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-orbitron font-bold mb-2 uppercase tracking-widest">{t.generate}</h1>
        <p className="text-white/40 text-sm">{t.promptPlaceholder}</p>
      </div>

      {isLimitReached ? (
        <div className="p-8 bg-red-500/10 border border-red-500/20 rounded-3xl text-center">
          <h2 className="text-xl font-bold text-red-500 mb-2">{t.limitReached}</h2>
          <p className="text-white/60 mb-6">{t.limitMessage}</p>
          <button 
            onClick={handleUpgradeClick}
            className="bg-yellow-400 text-black font-bold px-8 py-3 rounded-xl hover:scale-105 transition-all shadow-lg"
          >
            {t.upgradeButton}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Tabs */}
          <div className="flex bg-white/5 p-1 rounded-xl w-fit mx-auto">
            <button 
              onClick={() => setEditMode(false)}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${!editMode ? 'bg-yellow-400 text-black' : 'text-white/60 hover:text-white'}`}
            >
              {t.textToImageTab}
            </button>
            <button 
              onClick={() => setEditMode(true)}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${editMode ? 'bg-yellow-400 text-black' : 'text-white/60 hover:text-white'}`}
            >
              {t.editMode}
            </button>
          </div>

          {/* Prompt Area */}
          <div className="relative">
            {editMode && (
              <div className="mb-4">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full aspect-video md:aspect-auto md:h-64 border-2 border-dashed border-white/20 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-yellow-400/50 transition-colors overflow-hidden relative"
                >
                  {previewUrl ? (
                    <>
                      <img src={previewUrl} className="w-full h-full object-contain" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <span className="text-xs font-bold">{t.uploadImage}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <svg className="w-8 h-8 text-white/40 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      <span className="text-xs text-white/40">{t.uploadImage}</span>
                    </>
                  )}
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                  accept="image/*" 
                />
              </div>
            )}
            
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={editMode ? t.editPrompt : t.promptPlaceholder}
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-lg focus:outline-none focus:border-yellow-400/50 transition-colors resize-none h-40"
              dir={language === 'ar' ? 'rtl' : 'ltr'}
            />
            
            <button
              onClick={handleGenerate}
              disabled={loading || !prompt.trim() || (editMode && !uploadFile)}
              className={`absolute ${language === 'ar' ? 'bottom-4 left-4' : 'bottom-4 right-4'} bg-yellow-400 text-black font-bold px-8 py-3 rounded-xl transition-all shadow-lg ${
                (loading || !prompt.trim() || (editMode && !uploadFile)) ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'
              }`}
            >
              {loading ? t.generating : t.generate}
            </button>
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          {/* Results Area */}
          {lastResult && !loading && (
            <div className="mt-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="relative group rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                <img src={lastResult} alt="Generated" className="w-full h-auto" />
                <div className={`absolute top-4 ${language === 'ar' ? 'left-4' : 'right-4'} flex gap-2`}>
                   <button 
                     onClick={() => {
                       const link = document.createElement('a');
                       link.href = lastResult;
                       link.download = `nano-result-${Date.now()}.png`;
                       link.click();
                     }}
                     className="bg-black/60 backdrop-blur-md text-white p-3 rounded-xl hover:bg-yellow-400 hover:text-black transition-all"
                   >
                     <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                     </svg>
                   </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Generate;
