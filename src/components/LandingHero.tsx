import React, { useState, useEffect } from 'react';
import { Play, Sparkles, Brain, Users, Compass, Zap, Flame, Shield, ChevronRight, BookOpen, Rotate3d } from 'lucide-react';
import { GameMode } from '../types/chess';
import { soundManager } from '../utils/audio';
import { ConstellationBackground } from './ConstellationBackground';

interface LandingHeroProps {
  onStartGame: (mode: GameMode) => void;
  onNavigateSection: (sectionId: string) => void;
  onOpenBeginner?: () => void;
  onOpenGallery?: () => void;
}

// High-voltage trending taglines crafted for youth and aspiring chess champions
const TRENDING_TAGLINES = [
  { text: 'CRUSH THE BOARD • PLAY LIKE A PRO', tag: 'TRENDING NOW' },
  { text: 'WHITE & GOLDEN PREMIER ARENA', tag: 'ROYAL MASTER' },
  { text: 'UNLEASH YOUR INNER GRANDMASTER', tag: 'GEN-Z CHESS' },
  { text: 'SPEED. PRECISION. TOTAL DOMINANCE.', tag: 'RAPID TACTICS' },
  { text: '64 SQUARES. ZERO PAYWALLS. PURE MAGIC.', tag: '100% FREE' },
  { text: 'CHALLENGE SPARK, NEO, BOLT & GM-X', tag: 'PRO ROBOTIC AI' },
  { text: 'INVERTED DOME 3D GALLERY & VERTEX VORTEX', tag: '3D EXPERIENCE' },
  { text: 'WHERE KINGS CLASH AND LEGENDS ARE BORN', tag: 'WORLD ARENA' }
];

export const LandingHero: React.FC<LandingHeroProps> = ({
  onStartGame,
  onOpenBeginner,
  onOpenGallery,
}) => {
  const [taglineIndex, setTaglineIndex] = useState(0);

  // Taglines rotation with 3D animation
  useEffect(() => {
    const timer = setInterval(() => {
      setTaglineIndex((prev) => (prev + 1) % TRENDING_TAGLINES.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  const handlePlayNow = () => {
    soundManager.playClick();
    onStartGame('quick');
  };

  return (
    <div className="relative min-h-[92vh] flex items-center justify-center overflow-hidden pt-24 pb-16 px-4 bg-black">
      {/* Black Background with Golden Constellation / Plexus Effect from Screenshot */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-black">
        {/* Deep Black Canvas with Glowing Amber Nodes & Connection Lines */}
        <ConstellationBackground />

        {/* Subtle royal warmth vignette for visual depth */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.08)_0%,transparent_70%)] pointer-events-none" />
        
        {/* Sweeping White & Golden Royal Light Beam across the Hero Section */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-50">
          <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-amber-400/15 to-transparent skew-x-[-25deg] animate-white-gold-sweep" />
          <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-28deg] animate-royal-sweep" />
        </div>
      </div>

      {/* Hero Central Content */}
      <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center space-y-6">
        
        {/* Redish Glowing Capsule Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-red-950/80 via-black/80 to-amber-950/80 border border-amber-400/40 text-amber-300 text-xs sm:text-sm font-semibold tracking-wider uppercase backdrop-blur-md shadow-[0_0_25px_rgba(245,158,11,0.35)]">
          <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>PRO 3D CHESS ARENA • WHITE & GOLDEN EDITION • PLAY INSTANTLY</span>
        </div>

        {/* 3D ANIMATED TRENDING TAGLINES FOR YOUNGSTERS */}
        <div className="h-14 sm:h-16 flex items-center justify-center overflow-hidden w-full max-w-xl">
          <div
            key={taglineIndex}
            className="animate-3d-tagline flex items-center gap-2 px-5 py-2 rounded-2xl bg-black/70 border border-amber-400/40 backdrop-blur-md shadow-[0_0_30px_rgba(245,158,11,0.3)]"
          >
            <span className="text-[10px] font-tech font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-sm">
              {TRENDING_TAGLINES[taglineIndex].tag}
            </span>
            <span className="text-white sm:text-lg font-tech font-bold tracking-wider uppercase drop-shadow-[0_0_12px_rgba(251,191,36,0.8)]">
              {TRENDING_TAGLINES[taglineIndex].text}
            </span>
          </div>
        </div>

        {/* Impressive Main Headline (White and Golden with Redish Subtext) */}
        <div className="space-y-1">
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black font-display tracking-tight text-white leading-tight drop-shadow-2xl">
            CHESS <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-200 to-amber-400 drop-shadow-[0_0_35px_rgba(245,158,11,0.6)]">UNIVERSE</span>
          </h1>
          <p className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 font-serif italic text-lg sm:text-2xl tracking-wide">
            "Play, Calculate & Conquer in 3D"
          </p>
        </div>

        {/* Subtitle description */}
        <p className="max-w-2xl text-slate-200 text-base sm:text-lg font-normal leading-relaxed">
          Challenge pro-level robotic masters <strong className="text-amber-300">Spark, Neo, Bolt, Queen Aurelia, Shadow, and Grandmaster X</strong> with lightning-fast moves, 4K WebGL visuals, and zero registration.
        </p>

        {/* FULLY FUNCTIONAL "PLAY CHESS NOW" BUTTON WITH 3D LIGHT PASS EFFECT */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
          <button
            type="button"
            id="hero-play-now-button"
            onClick={handlePlayNow}
            className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 font-black text-lg sm:text-xl font-display tracking-wider shadow-[0_10px_45px_rgba(245,158,11,0.6)] hover:shadow-[0_15px_60px_rgba(245,158,11,0.9)] transform hover:-translate-y-1 active:translate-y-0 transition-all duration-300 overflow-hidden cursor-pointer border border-amber-300 pulse-glow-gold"
          >
            {/* 3D Animated Diagonal Light-Pass Beam */}
            <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/80 to-transparent skew-x-[-25deg] animate-lightpass pointer-events-none" />
            
            {/* Play Icon */}
            <span className="relative flex items-center justify-center w-9 h-9 rounded-full bg-black/20 text-slate-950 group-hover:scale-110 transition-transform shadow-inner">
              <Play className="w-5 h-5 fill-current ml-0.5 text-slate-950" />
            </span>
            <span className="relative z-10 drop-shadow-md">
              PLAY CHESS NOW
            </span>
            <span className="relative z-10 text-xs font-tech font-bold uppercase bg-slate-950 text-amber-300 px-2.5 py-0.5 rounded-full ml-1 border border-amber-400/40">
              INSTANT
            </span>
          </button>

          {/* Quick Challenge AI Button */}
          <button
            type="button"
            onClick={() => onStartGame('ai')}
            className="px-8 py-4 rounded-2xl bg-black/80 hover:bg-slate-900 text-white font-display font-bold text-sm sm:text-base border border-amber-500/40 hover:border-amber-400 shadow-lg flex items-center gap-2 transition-all"
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span>SELECT PRO AI MASTER</span>
          </button>
        </div>

        {/* Feature Gateways */}
        <div className="pt-6 w-full max-w-5xl">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <button
              type="button"
              id="action-quick-play"
              onClick={() => onStartGame('quick')}
              className="p-3.5 rounded-2xl bg-black/70 hover:bg-slate-900/90 border border-amber-500/20 hover:border-amber-400 transition-all text-center flex flex-col items-center gap-2 group shadow-lg"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                <Play className="w-5 h-5" />
              </div>
              <span className="font-semibold text-xs text-white group-hover:text-amber-300">
                Play vs AI
              </span>
              <span className="text-[10px] text-slate-400">
                6 Pro Personalities
              </span>
            </button>

            <button
              type="button"
              id="action-puzzles"
              onClick={() => onStartGame('puzzle')}
              className="p-3.5 rounded-2xl bg-black/70 hover:bg-slate-900/90 border border-amber-500/20 hover:border-amber-400 transition-all text-center flex flex-col items-center gap-2 group shadow-lg"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                <Brain className="w-5 h-5" />
              </div>
              <span className="font-semibold text-xs text-white group-hover:text-amber-300">
                Tactics Arena
              </span>
              <span className="text-[10px] text-slate-400">
                33 Pro Puzzles
              </span>
            </button>

            <button
              type="button"
              id="action-beginner"
              onClick={onOpenBeginner}
              className="p-3.5 rounded-2xl bg-black/70 hover:bg-slate-900/90 border border-amber-500/20 hover:border-amber-400 transition-all text-center flex flex-col items-center gap-2 group shadow-lg"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="font-semibold text-xs text-white group-hover:text-amber-300">
                Beginner Guide
              </span>
              <span className="text-[10px] text-slate-400">
                Rules & Tricks
              </span>
            </button>

            <button
              type="button"
              id="action-gallery"
              onClick={onOpenGallery}
              className="p-3.5 rounded-2xl bg-black/70 hover:bg-slate-900/90 border border-amber-500/20 hover:border-amber-400 transition-all text-center flex flex-col items-center gap-2 group shadow-lg"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                <Rotate3d className="w-5 h-5" />
              </div>
              <span className="font-semibold text-xs text-white group-hover:text-amber-300">
                3D Gallery
              </span>
              <span className="text-[10px] text-slate-400">
                Inverted Dome & Vortex
              </span>
            </button>

            <button
              type="button"
              id="action-school"
              onClick={() => onStartGame('school')}
              className="p-3.5 rounded-2xl bg-black/70 hover:bg-slate-900/90 border border-amber-500/20 hover:border-amber-400 transition-all text-center flex flex-col items-center gap-2 group shadow-lg"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                <Compass className="w-5 h-5" />
              </div>
              <span className="font-semibold text-xs text-white group-hover:text-amber-300">
                Chess Academy
              </span>
              <span className="text-[10px] text-slate-400">
                12 Master Lessons
              </span>
            </button>

            <button
              type="button"
              id="action-friend"
              onClick={() => onStartGame('local')}
              className="p-3.5 rounded-2xl bg-black/70 hover:bg-slate-900/90 border border-amber-500/20 hover:border-amber-400 transition-all text-center flex flex-col items-center gap-2 group shadow-lg"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <span className="font-semibold text-xs text-white group-hover:text-amber-300">
                Pass & Play
              </span>
              <span className="text-[10px] text-slate-400">
                2 Players 1 Device
              </span>
            </button>
          </div>
        </div>

        {/* Live Metrics Row */}
        <div className="pt-6 w-full max-w-4xl border-t border-amber-500/20">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-extrabold font-display text-white">
                2600+
              </div>
              <div className="text-[11px] font-tech text-amber-400 tracking-wider uppercase">
                PEAK ENGINE ELO
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-extrabold font-display text-white">
                100%
              </div>
              <div className="text-[11px] font-tech text-amber-400 tracking-wider uppercase">
                FREE & NO LOGIN
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-extrabold font-display text-white">
                6 PRO
              </div>
              <div className="text-[11px] font-tech text-amber-400 tracking-wider uppercase">
                AI BOT MASTERS
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-extrabold font-display text-white">
                3D INVERTED DOME
              </div>
              <div className="text-[11px] font-tech text-amber-400 tracking-wider uppercase">
                VERTEX VORTEX
              </div>
            </div>
          </div>
        </div>

        {/* Live Constellation Status Indicator */}
        <div className="flex items-center gap-2 pt-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 border border-amber-500/30 text-amber-300 text-[11px] font-tech font-bold uppercase tracking-wider backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>INTERACTIVE CONSTELLATION ARENA • DRIFTING REALTIME</span>
          </div>
        </div>
      </div>
    </div>
  );
};

