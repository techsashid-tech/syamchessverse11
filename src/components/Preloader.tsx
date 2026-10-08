import React, { useState, useEffect } from 'react';
import { Cpu, ShieldCheck } from 'lucide-react';

interface PreloaderProps {
  onFinish: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('CALIBRATING PRO NEURAL CHESS ENGINES...');

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onFinish, 400);
          return 100;
        }
        if (prev === 24) setStatusText('MATERIALIZING 3D WEBGL CHESS ARENAS...');
        if (prev === 52) setStatusText('ACTIVATING REDISH GLOW & LIGHT PASS AMBIENCE...');
        if (prev === 76) setStatusText('TUNING SPARK, NEO, BOLT, QUEEN & GRANDMASTER X...');
        if (prev === 92) setStatusText('ENTERING THE SUPREME CHESS GAMING UNIVERSE...');
        return prev + 4;
      });
    }, 70); // Bit slower and smoother as requested
    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#070304] text-white p-4 overflow-hidden select-none">
      {/* Redish ambient background glow like the screenshot */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-red-600/15 blur-[120px] pointer-events-none" />
      
      {/* Premier sweeping light beam across loader */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="w-1/3 h-full bg-gradient-to-r from-transparent via-red-500/10 to-transparent skew-x-[-30deg] animate-premier-sweep" />
      </div>

      {/* Central Reddish Holographic Emblem */}
      <div className="relative mb-8">
        <div className="w-28 h-28 rounded-3xl bg-gradient-to-tr from-red-600/30 via-red-950/60 to-rose-600/20 border-2 border-red-500/60 flex items-center justify-center shadow-[0_0_60px_rgba(239,68,68,0.5)] pulse-glow-red">
          <span className="text-6xl select-none filter drop-shadow-[0_0_20px_rgba(239,68,68,0.9)]">
            ♟️
          </span>
        </div>
        <div className="absolute -inset-2.5 rounded-3xl border border-red-500/40 animate-spin duration-[7000ms] pointer-events-none" />
      </div>

      {/* Title with Redish accent */}
      <h1 className="text-2xl sm:text-3xl font-display font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-rose-300 to-red-500 mb-2 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]">
        CHESSVERSE <span className="text-red-500">3D</span>
      </h1>
      <p className="text-xs font-tech tracking-[0.25em] text-red-300 uppercase mb-8 text-center max-w-sm px-2">
        {statusText}
      </p>

      {/* Reddish Tech Progress Bar */}
      <div className="w-64 sm:w-80 h-2 rounded-full bg-slate-950 border border-red-500/40 overflow-hidden relative shadow-[0_0_20px_rgba(239,68,68,0.3)]">
        <div
          className="h-full bg-gradient-to-r from-red-700 via-red-500 to-rose-400 transition-all duration-150 ease-out shadow-[0_0_15px_rgba(239,68,68,0.8)]"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-4 flex items-center gap-4 text-[11px] font-mono text-slate-400">
        <span className="flex items-center gap-1 text-red-300">
          <ShieldCheck className="w-3.5 h-3.5 text-red-400" /> ZERO LOGIN
        </span>
        <span>•</span>
        <span className="flex items-center gap-1 text-red-300">
          <Cpu className="w-3.5 h-3.5 text-red-400" /> PRO CHESS
        </span>
        <span>•</span>
        <span className="font-bold text-red-400">{progress}%</span>
      </div>
    </div>
  );
};
