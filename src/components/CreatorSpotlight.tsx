import React, { useState, useEffect } from 'react';
import { Camera, Sparkles, Award, Cpu, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const CREATOR_IMAGE_KEY = 'chessverse_creator_photo_url';
const DEFAULT_CREATOR_IMAGE = '/founder.png';

export const CreatorSpotlight: React.FC = () => {
  const { themeMode } = useTheme();
  const isDark = themeMode === 'dark';

  const [photoUrl, setPhotoUrl] = useState<string>(DEFAULT_CREATOR_IMAGE);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [inputUrl, setInputUrl] = useState<string>('');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  useEffect(() => {
    const stored = localStorage.getItem(CREATOR_IMAGE_KEY);
    if (stored && !stored.includes('founder_photo_1791483629174')) {
      setPhotoUrl(stored);
      setInputUrl(stored);
    } else {
      setPhotoUrl(DEFAULT_CREATOR_IMAGE);
    }
  }, []);

  const handleSavePhoto = (urlToSave: string) => {
    const finalUrl = urlToSave.trim() || DEFAULT_CREATOR_IMAGE;
    localStorage.setItem(CREATOR_IMAGE_KEY, finalUrl);
    setPhotoUrl(finalUrl);
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          handleSavePhoto(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <section id="creator-spotlight" className="relative py-20 px-4 max-w-7xl mx-auto overflow-hidden">
      {/* Background Decorative Reddish Gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-red-600/10 blur-[140px] pointer-events-none rounded-full" />

      <div className={`relative z-10 rounded-3xl border p-6 md:p-12 shadow-2xl backdrop-blur-2xl transition-colors ${
        isDark
          ? 'bg-gradient-to-b from-slate-900/90 via-slate-950/90 to-slate-900/90 border-red-500/30 shadow-[0_0_50px_rgba(239,68,68,0.15)]'
          : 'bg-white/95 border-red-200 shadow-xl text-slate-900'
      }`}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* High Definition Inventor Photo Showcase Frame */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative group w-full max-w-[340px] aspect-[4/5] rounded-3xl p-1.5 bg-gradient-to-b from-red-500 via-rose-600 to-amber-500 shadow-2xl">
              {/* Outer Glow Pass */}
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-red-500 to-rose-400 opacity-40 blur-lg group-hover:opacity-80 transition duration-500 pointer-events-none" />

              <div className="relative w-full h-full rounded-[22px] overflow-hidden bg-slate-950 flex flex-col items-center justify-center">
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt="Founder & Architect of Chessverse"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = DEFAULT_CREATOR_IMAGE;
                    }}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-slate-900 to-slate-950 text-white">
                    <div className="w-24 h-24 rounded-full bg-red-500/10 border-2 border-red-500/40 flex items-center justify-center mb-4 shadow-[0_0_25px_rgba(239,68,68,0.4)]">
                      <Cpu className="w-12 h-12 text-red-400 animate-pulse" />
                    </div>
                    <span className="font-display font-bold text-lg text-white mb-1">
                      INVENTOR SPOTLIGHT
                    </span>
                    <p className="text-xs text-slate-400 mb-4 max-w-[200px]">
                      Your high-definition photo will be proudly featured here.
                    </p>
                    <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-semibold text-xs rounded-xl shadow-lg transition-transform active:scale-95">
                      <Camera className="w-4 h-4" />
                      Upload Your Photo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}

                {/* Corner Tech Badges */}
                <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md border border-red-500/40 px-2.5 py-1 rounded-lg flex items-center gap-1.5 text-[10px] text-red-300 font-tech">
                  <Sparkles className="w-3 h-3 text-red-400" />
                  FOUNDER & ARCHITECT
                </div>
              </div>
            </div>

            {/* Photo controls */}
            <div className="mt-4 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="text-xs text-red-500 hover:text-red-400 underline font-tech flex items-center gap-1"
              >
                <Camera className="w-3.5 h-3.5" />
                {photoUrl ? 'Update / Change Photo' : 'Enter Photo URL'}
              </button>
              {photoUrl && (
                <button
                  type="button"
                  onClick={() => {
                    localStorage.removeItem(CREATOR_IMAGE_KEY);
                    setPhotoUrl(DEFAULT_CREATOR_IMAGE);
                    setInputUrl('');
                  }}
                  className="text-xs text-rose-400 hover:text-rose-300 underline font-tech"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Editing Dialog */}
            {isEditing && (
              <div className={`mt-3 w-full max-w-[340px] p-3 rounded-xl border space-y-2 ${
                isDark ? 'bg-slate-900 border-white/10' : 'bg-slate-50 border-slate-200'
              }`}>
                <input
                  type="text"
                  placeholder="Paste high-res image URL..."
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  className={`w-full px-3 py-1.5 border rounded-lg text-xs focus:outline-none focus:border-red-500 ${
                    isDark ? 'bg-slate-950 border-white/20 text-white placeholder-slate-500' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
                <div className="flex items-center gap-2 justify-end">
                  <label className="cursor-pointer px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 rounded-lg border border-white/10">
                    Browse File
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                  <button
                    type="button"
                    onClick={() => handleSavePhoto(inputUrl)}
                    className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white font-semibold text-[11px] rounded-lg shadow"
                  >
                    Save Photo
                  </button>
                </div>
              </div>
            )}

            {savedSuccess && (
              <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1 font-tech">
                <CheckCircle2 className="w-3.5 h-3.5" /> Photo saved successfully!
              </p>
            )}
          </div>

          {/* Statement */}
          <div className="lg:col-span-7 space-y-5 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-semibold uppercase tracking-wider">
              <Award className="w-3.5 h-3.5" />
              Creator & Game Inventor Hall
            </div>

            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight font-display leading-tight">
              Inventor of this Free Robotic <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-500 to-amber-400">
                Chess Gaming Universe
              </span>
            </h2>

            <p className={`text-base md:text-lg leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Conceived, engineered, and dedicated to chess enthusiasts, students, and gamers across the globe. Built on the belief that world-class 3D video-game quality chess should be <strong className={isDark ? 'text-white' : 'text-slate-950'}>100% free, zero login, with instant guest access</strong> for every child, teenager, and grandmaster.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className={`p-4 rounded-2xl border space-y-1 ${
                isDark ? 'bg-slate-900/60 border-white/5' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="text-red-500 font-display font-bold text-xl flex items-center gap-1.5">
                  <ShieldCheck className="w-5 h-5" /> 100% Free
                </div>
                <p className="text-xs text-slate-400">
                  Zero paywalls, no email, no ads blocking gameplay.
                </p>
              </div>

              <div className={`p-4 rounded-2xl border space-y-1 ${
                isDark ? 'bg-slate-900/60 border-white/5' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="text-red-400 font-display font-bold text-xl flex items-center gap-1.5">
                  <Cpu className="w-5 h-5" /> Robotic AI
                </div>
                <p className="text-xs text-slate-400">
                  Adaptive neural engines ranging from Spark to Grandmaster X.
                </p>
              </div>

              <div className={`p-4 rounded-2xl border space-y-1 ${
                isDark ? 'bg-slate-900/60 border-white/5' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="text-rose-500 font-display font-bold text-xl flex items-center gap-1.5">
                  <Sparkles className="w-5 h-5" /> WebGL 3D
                </div>
                <p className="text-xs text-slate-400">
                  Cinematic lighting, dynamic worlds, and tactile chess realism.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-red-500/20 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-widest font-tech">Signature</p>
                <p className="font-display font-bold text-lg text-red-500 tracking-wider">
                  CHIEF ARCHITECT & INVENTOR
                </p>
              </div>
              <div className={`text-xs font-mono px-3 py-1.5 rounded-lg border ${
                isDark ? 'text-slate-400 bg-black/40 border-white/5' : 'text-slate-600 bg-slate-100 border-slate-200'
              }`}>
                VERIFIED ORIGINAL CREATION • 2026
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
