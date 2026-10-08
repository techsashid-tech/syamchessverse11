import React, { useState } from 'react';
import {
  Zap, Brain, Compass, BookOpen, Shield,
  Sun, Moon, Trophy, Sparkles, Flame, Play,
  ChevronRight, Volume2, VolumeX, ShieldCheck, Rotate3d,
  FileText, Lock, Scale
} from 'lucide-react';

import { GameMode, BoardTheme, PieceStyle } from './types/chess';
import { Preloader } from './components/Preloader';
import { LandingHero } from './components/LandingHero';
import { GameArena } from './components/GameArena';
import { CreatorSpotlight } from './components/CreatorSpotlight';
import { PuzzleArena } from './components/PuzzleArena';
import { SchoolSection } from './components/SchoolSection';
import { OpeningExplorer } from './components/OpeningExplorer';
import { EndgameDrills } from './components/EndgameDrills';
import { BeginnerGuide } from './components/BeginnerGuide';
import { InvertedDomeGallery } from './components/InvertedDomeGallery';
import { LegalModal } from './components/LegalModal';
import { StatsModal } from './components/StatsModal';
import { AI_OPPONENTS } from './data/aiOpponents';
import { CHESS_TIPS_DATA } from './data/tips';
import { soundManager } from './utils/audio';
import { ThemeProvider, useTheme } from './context/ThemeContext';

type ActiveView = 'hub' | 'play' | 'puzzle' | 'school' | 'openings' | 'endgames' | 'beginner' | 'gallery';

function MainApp() {
  const { themeMode, toggleTheme } = useTheme();
  const isDark = themeMode === 'dark';

  const [isLoading, setIsLoading] = useState(true);
  const [activeView, setActiveView] = useState<ActiveView>('hub');
  const [selectedGameMode, setSelectedGameMode] = useState<GameMode>('quick');
  const [boardTheme, setBoardTheme] = useState<BoardTheme>('crimson');
  const [pieceStyle, setPieceStyle] = useState<PieceStyle>('classic');
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isLegalOpen, setIsLegalOpen] = useState(false);
  const [legalTab, setLegalTab] = useState<'privacy' | 'terms' | 'fairplay'>('privacy');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [dailyTip] = useState(() => CHESS_TIPS_DATA[Math.floor(Math.random() * CHESS_TIPS_DATA.length)]);

  const handleStartGame = (mode: GameMode) => {
    soundManager.playClick();
    if (mode === 'puzzle') {
      setActiveView('puzzle');
    } else if (mode === 'school') {
      setActiveView('school');
    } else {
      setSelectedGameMode(mode);
      setActiveView('play');
    }
  };

  const handleChallengeBot = (botId: string) => {
    soundManager.playClick();
    setSelectedGameMode('ai');
    setActiveView('play');
  };

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundManager.setSoundEnabled(next);
  };

  const handleOpenLegal = (tab: 'privacy' | 'terms' | 'fairplay') => {
    soundManager.playClick();
    setLegalTab(tab);
    setIsLegalOpen(true);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-[#080503] text-slate-100' : 'bg-[#faf8f5] text-slate-900'
    }`}>
      {/* INITIAL PRELOADER */}
      {isLoading && <Preloader onFinish={() => setIsLoading(false)} />}

      {/* GLOBAL WHITE & GOLDEN PREMIER LIGHT SWEEP ACROSS WEBSITE */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-40">
        <div className="w-1/3 h-full bg-gradient-to-r from-transparent via-amber-400/15 to-transparent skew-x-[-25deg] animate-white-gold-sweep" />
        <div className="w-1/4 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-30deg] animate-royal-sweep" />
      </div>

      {/* VIEW ROUTING */}
      {activeView === 'play' ? (
        <GameArena
          initialMode={selectedGameMode}
          initialTheme={boardTheme}
          initialPieceStyle={pieceStyle}
          onExitToHub={() => setActiveView('hub')}
          onOpenSettings={() => {}}
          onOpenStats={() => setIsStatsOpen(true)}
        />
      ) : activeView === 'puzzle' ? (
        <PuzzleArena
          onBack={() => setActiveView('hub')}
          onOpenStats={() => setIsStatsOpen(true)}
        />
      ) : activeView === 'beginner' ? (
        <BeginnerGuide
          onBack={() => setActiveView('hub')}
          onPlayNow={() => handleStartGame('quick')}
        />
      ) : activeView === 'gallery' ? (
        <InvertedDomeGallery
          onBack={() => setActiveView('hub')}
          onPlayNow={() => handleStartGame('quick')}
        />
      ) : activeView === 'school' ? (
        <SchoolSection onBack={() => setActiveView('hub')} />
      ) : activeView === 'openings' ? (
        <OpeningExplorer onBack={() => setActiveView('hub')} />
      ) : activeView === 'endgames' ? (
        <EndgameDrills onBack={() => setActiveView('hub')} />
      ) : (
        /* MAIN HUB HOMEPAGE */
        <div className="relative">
          {/* TOP NAVIGATION BAR WITH WHITE & GOLDEN PALETTE */}
          <nav className={`fixed top-0 left-0 right-0 z-30 backdrop-blur-xl border-b transition-colors px-4 py-3 ${
            isDark ? 'bg-black/85 border-amber-500/25 shadow-[0_4px_30px_rgba(245,158,11,0.1)]' : 'bg-white/90 border-amber-200 shadow-sm'
          }`}>
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
              {/* Brand Logo with White & Golden Glow */}
              <div
                onClick={() => {
                  soundManager.playClick();
                  setActiveView('hub');
                }}
                className="flex items-center gap-2 cursor-pointer select-none group"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-500 flex items-center justify-center text-lg text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.5)] group-hover:scale-105 transition-transform border border-amber-300">
                  ♚
                </div>
                <div>
                  <span className="font-display font-black text-lg sm:text-xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-200 to-amber-400">
                    CHESSVERSE
                  </span>
                  <span className="text-[10px] font-tech font-bold uppercase text-amber-300 ml-1.5 px-1.5 py-0.5 rounded bg-amber-500/20 border border-amber-400/40">
                    WHITE & GOLD
                  </span>
                </div>
              </div>

              {/* Navigation Links (Desktop) */}
              <div className="hidden lg:flex items-center gap-5 text-xs font-tech font-bold tracking-wider">
                <button
                  type="button"
                  onClick={() => handleStartGame('quick')}
                  className="text-slate-300 hover:text-amber-300 transition-colors uppercase"
                >
                  Play vs AI
                </button>
                <button
                  type="button"
                  onClick={() => setActiveView('puzzle')}
                  className="text-slate-300 hover:text-amber-300 transition-colors uppercase"
                >
                  Puzzles (33)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveView('beginner')}
                  className="text-amber-300 hover:text-amber-200 transition-colors uppercase flex items-center gap-1"
                >
                  <BookOpen className="w-3.5 h-3.5" /> Rules & Tricks
                </button>
                <button
                  type="button"
                  onClick={() => setActiveView('gallery')}
                  className="text-amber-300 hover:text-amber-200 transition-colors uppercase flex items-center gap-1"
                >
                  <Rotate3d className="w-3.5 h-3.5" /> 3D Gallery
                </button>
                <button
                  type="button"
                  onClick={() => setActiveView('school')}
                  className="text-slate-300 hover:text-amber-300 transition-colors uppercase"
                >
                  Academy
                </button>
                <button
                  type="button"
                  onClick={() => setActiveView('openings')}
                  className="text-slate-300 hover:text-amber-300 transition-colors uppercase"
                >
                  Openings
                </button>
                <a
                  href="#creator-spotlight"
                  className="text-amber-400 hover:text-amber-300 transition-colors uppercase flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Inventor
                </a>
              </div>

              {/* Right Action Tools: Light/Dark Mode, Sound, Stats, Instant Play */}
              <div className="flex items-center gap-2">
                {/* LIGHT / DARK MODE TOGGLE */}
                <button
                  type="button"
                  id="nav-theme-toggle"
                  onClick={toggleTheme}
                  className={`p-2 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-semibold ${
                    isDark
                      ? 'bg-slate-900 hover:bg-slate-800 text-amber-400 border-amber-500/30 shadow-sm'
                      : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-300 shadow-sm'
                  }`}
                  title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                  {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  <span className="hidden sm:inline font-tech text-[11px] uppercase">
                    {isDark ? 'Light' : 'Dark'}
                  </span>
                </button>

                {/* Sound Toggle */}
                <button
                  type="button"
                  onClick={handleToggleSound}
                  className={`p-2 rounded-xl border transition-colors ${
                    soundEnabled
                      ? isDark ? 'bg-slate-900 border-white/10 text-slate-300' : 'bg-white border-amber-200 text-slate-700'
                      : 'bg-amber-500/10 border-amber-500/30 text-amber-500'
                  }`}
                  title="Toggle Audio"
                >
                  {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-amber-500" />}
                </button>

                {/* Player Profile & Stats */}
                <button
                  type="button"
                  id="nav-stats-button"
                  onClick={() => setIsStatsOpen(true)}
                  className={`p-2 rounded-xl border transition-colors ${
                    isDark ? 'bg-slate-900 hover:bg-slate-800 text-amber-400 border-amber-500/30' : 'bg-white hover:bg-amber-50 text-amber-600 border-amber-300'
                  }`}
                  title="View Trophies & Stats"
                >
                  <Trophy className="w-4 h-4" />
                </button>

                {/* Quick Header Play Button */}
                <button
                  type="button"
                  id="nav-play-button"
                  onClick={() => handleStartGame('quick')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-display font-extrabold text-xs shadow-[0_0_20px_rgba(245,158,11,0.5)] transition-transform active:scale-95 border border-amber-300"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>PLAY NOW</span>
                </button>
              </div>
            </div>
          </nav>

          {/* HERO SECTION WITH REDISH & ROYAL GOLD EFFECT, 3D LOOPING CHESS BACKGROUNDS & TAGLINES */}
          <LandingHero
            onStartGame={handleStartGame}
            onNavigateSection={(sec) => {
              const el = document.getElementById(sec);
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            onOpenBeginner={() => setActiveView('beginner')}
            onOpenGallery={() => setActiveView('gallery')}
          />

          {/* PRO AI CHALLENGERS SHOWCASE: SPARK, NEO BOLT, QUEEN AURELIA, SHADOW, GM-X */}
          <section className="py-16 px-4 max-w-7xl mx-auto">
            <div className="text-center space-y-3 mb-10">
              <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-tech font-bold uppercase tracking-widest shadow-sm ${
                isDark 
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-300' 
                  : 'bg-amber-100 border-amber-300 text-amber-900 font-extrabold'
              }`}>
                <Zap className="w-3.5 h-3.5 fill-current text-amber-400" /> PRO-LEVEL NEURAL BOT ENGINES
              </div>
              <h2 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-black tracking-tight uppercase leading-tight ${
                isDark ? 'text-white' : 'text-slate-950'
              }`}>
                Challenge the{' '}
                <span className={`text-transparent bg-clip-text font-black ${
                  isDark
                    ? 'bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 drop-shadow-[0_0_25px_rgba(245,158,11,0.5)]'
                    : 'bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 drop-shadow-[0_2px_4px_rgba(217,119,6,0.3)]'
                }`}>
                  Pro Masters
                </span>
              </h2>
              <p className={`text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-medium leading-relaxed ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Engineered for rapid, pro-level calculation with zero wait time. Pick your rival and experience fast, dynamic chess gameplay.
              </p>
            </div>

            {/* AI Opponents Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {AI_OPPONENTS.map((bot) => (
                <div
                  key={bot.id}
                  className={`group relative rounded-3xl p-6 border transition-all duration-300 flex flex-col justify-between hover:-translate-y-2 shadow-xl ${
                    isDark
                      ? 'bg-gradient-to-b from-[#140e08]/90 via-[#0d0905]/95 to-[#080503]/95 hover:bg-[#18110a] border-amber-500/25 hover:border-amber-400 shadow-[0_10px_30px_rgba(0,0,0,0.6)] hover:shadow-[0_15px_40px_rgba(245,158,11,0.3)]'
                      : 'bg-white hover:bg-gradient-to-b hover:from-white hover:to-amber-50/70 border-amber-200 hover:border-amber-400 shadow-[0_10px_30px_rgba(217,119,6,0.08)] hover:shadow-[0_18px_40px_rgba(217,119,6,0.22)]'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3.5">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-500 flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform text-slate-950 border-2 border-amber-300 flex-shrink-0">
                          {bot.avatar}
                        </div>
                        <div>
                          <h3 className={`font-display font-black text-xl tracking-wide uppercase transition-colors leading-tight ${
                            isDark 
                              ? 'text-white group-hover:text-amber-300 drop-shadow-sm' 
                              : 'text-slate-950 group-hover:text-amber-800'
                          }`}>
                            {bot.name}
                          </h3>
                          <span className={`text-xs font-tech font-bold uppercase tracking-wider block mt-0.5 ${
                            isDark ? 'text-amber-400' : 'text-amber-700'
                          }`}>
                            {bot.title}
                          </span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full font-tech font-extrabold text-xs tracking-wider flex-shrink-0 border shadow-sm ${
                        isDark 
                          ? 'bg-amber-500/15 border-amber-500/40 text-amber-300' 
                          : 'bg-amber-100 border-amber-300 text-amber-950 font-black'
                      }`}>
                        {bot.rating} ELO
                      </span>
                    </div>

                    <p className={`text-xs sm:text-sm italic font-medium leading-relaxed line-clamp-2 border-l-2 pl-3 py-0.5 ${
                      isDark 
                        ? 'text-slate-300 border-amber-500/40' 
                        : 'text-slate-700 border-amber-400'
                    }`}>
                      "{bot.intro}"
                    </p>

                    <div className="space-y-1.5 text-xs pt-1 border-t border-amber-500/10">
                      <div className="flex justify-between items-center">
                        <span className={`font-tech ${isDark ? 'text-slate-400' : 'text-slate-600 font-medium'}`}>Playstyle:</span>
                        <span className={`font-tech font-bold capitalize ${isDark ? 'text-amber-300' : 'text-amber-800'}`}>{bot.title}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className={`font-tech ${isDark ? 'text-slate-400' : 'text-slate-600 font-medium'}`}>Tactical Depth:</span>
                        <span className={`font-tech font-bold flex items-center gap-1.5 ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
                          Pro Level (Fast Response)
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleChallengeBot(bot.id)}
                    className="mt-6 w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-display font-black text-xs sm:text-sm tracking-wider uppercase shadow-lg flex items-center justify-center gap-2 transition-all duration-300 active:scale-95 border border-amber-300 cursor-pointer"
                  >
                    <span>CHALLENGE NOW</span>
                    <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* DAILY GRANDMASTER TACTIC & WISDOM */}
          <section className="py-8 px-4 max-w-5xl mx-auto">
            <div className={`p-6 rounded-3xl border shadow-xl flex flex-col sm:flex-row items-center gap-5 transition-colors ${
              isDark ? 'bg-gradient-to-r from-amber-950/40 via-[#0d0905] to-black border-amber-500/30' : 'bg-amber-50/80 border-amber-200 text-slate-900'
            }`}>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-2xl flex-shrink-0 text-amber-400">
                💡
              </div>
              <div className="space-y-1 flex-1 text-center sm:text-left">
                <span className="text-[11px] font-tech text-amber-400 font-bold uppercase tracking-wider flex items-center justify-center sm:justify-start gap-1">
                  <Flame className="w-3.5 h-3.5 fill-current text-amber-400" /> DAILY PRO CHESS WISDOM • {dailyTip.category.toUpperCase()}
                </span>
                <h4 className="font-display font-bold text-base sm:text-lg text-white">
                  {dailyTip.title}
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {dailyTip.advice}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveView('puzzle')}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-tech font-bold text-xs shadow-lg flex-shrink-0"
              >
                SOLVE PUZZLE
              </button>
            </div>
          </section>

          {/* CREATOR & GAME INVENTOR HALL OF FAME SPOTLIGHT */}
          <CreatorSpotlight />

          {/* FOOTER WITH WHITE & GOLDEN THEME + PRIVACY & TERMS */}
          <footer className={`py-12 px-4 border-t transition-colors ${
            isDark ? 'border-amber-500/20 bg-[#060402]' : 'border-amber-200 bg-amber-50/50'
          }`}>
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
              <div className="space-y-1">
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <span className="text-xl">♚</span>
                  <span className="font-display font-black text-lg text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-200 to-amber-400">
                    CHESSVERSE 3D
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  100% Free Robotic 3D Chess Game with Inverted Dome Gallery & Pro AI.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400 font-tech">
                <button type="button" onClick={() => handleStartGame('quick')} className="hover:text-amber-400 transition-colors">
                  PLAY QUICK
                </button>
                <span>•</span>
                <button type="button" onClick={() => setActiveView('puzzle')} className="hover:text-amber-400 transition-colors">
                  PUZZLES
                </button>
                <span>•</span>
                <button type="button" onClick={() => setActiveView('beginner')} className="hover:text-amber-400 transition-colors">
                  RULES & TRICKS
                </button>
                <span>•</span>
                <button type="button" onClick={() => setActiveView('gallery')} className="hover:text-amber-400 transition-colors">
                  3D GALLERY
                </button>
                <span>•</span>
                <button type="button" onClick={() => handleOpenLegal('privacy')} className="hover:text-amber-400 transition-colors flex items-center gap-1">
                  <Lock className="w-3 h-3" /> PRIVACY POLICY
                </button>
                <span>•</span>
                <button type="button" onClick={() => handleOpenLegal('terms')} className="hover:text-amber-400 transition-colors flex items-center gap-1">
                  <FileText className="w-3 h-3" /> TERMS OF SERVICE
                </button>
              </div>

              <div className="text-xs text-amber-500/70 font-mono">
                © 2026 Chessverse 3D • Imperial White & Gold Edition
              </div>
            </div>
          </footer>
        </div>
      )}

      {/* STATS MODAL */}
      <StatsModal
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
      />

      {/* LEGAL & PRIVACY POLICY MODAL */}
      <LegalModal
        isOpen={isLegalOpen}
        onClose={() => setIsLegalOpen(false)}
        defaultTab={legalTab}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}
