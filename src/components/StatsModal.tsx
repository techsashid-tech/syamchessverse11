import React from 'react';
import { Trophy, Award, Target, Flame, X, Shield, Sparkles } from 'lucide-react';
import { getPlayerProfile } from '../utils/storage';
import { ACHIEVEMENTS_LIST } from '../data/achievements';
import { useTheme } from '../context/ThemeContext';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({ isOpen, onClose }) => {
  const { themeMode } = useTheme();
  const isDark = themeMode === 'dark';

  if (!isOpen) return null;

  const profile = getPlayerProfile();
  const totalGames = profile.stats?.gamesPlayed || 0;
  const wins = profile.stats?.wins || 0;
  const losses = profile.stats?.losses || 0;
  const draws = profile.stats?.draws || 0;
  const winRate = totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0;
  const xpNeeded = profile.level * 250;
  const xpProgress = Math.min(100, Math.round((profile.xp / xpNeeded) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-[fadeIn_0.2s_ease-out]">
      <div className={`relative max-w-2xl w-full rounded-3xl border p-6 md:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto ${
        isDark ? 'bg-slate-900 border-red-500/30 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center text-3xl shadow-lg text-white">
            👑
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-display font-bold">
                Guest Champion
              </h2>
              <span className="text-xs font-tech font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-500 border border-red-500/30">
                LEVEL {profile.level}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Rank: Grandmaster Candidate • 100% Free & Stored Locally
            </p>
          </div>
        </div>

        {/* XP Level Bar */}
        <div className={`p-4 rounded-2xl border space-y-2 ${
          isDark ? 'bg-slate-950/60 border-white/5' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex justify-between text-xs font-tech font-bold">
            <span className="text-red-500 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> XP PROGRESSION
            </span>
            <span className="text-slate-400">
              {profile.xp} / {xpNeeded} XP ({xpProgress}%)
            </span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-red-600 to-rose-500 transition-all duration-500"
              style={{ width: `${xpProgress}%` }}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className={`p-3.5 rounded-2xl border space-y-0.5 ${
            isDark ? 'bg-slate-950/60 border-white/5' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="text-2xl font-extrabold font-display text-white">
              {totalGames}
            </div>
            <div className="text-[11px] font-tech text-slate-400 uppercase">Games Played</div>
          </div>
          <div className={`p-3.5 rounded-2xl border space-y-0.5 ${
            isDark ? 'bg-slate-950/60 border-white/5' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="text-2xl font-extrabold font-display text-emerald-500">
              {wins}
            </div>
            <div className="text-[11px] font-tech text-slate-400 uppercase">Victories ({winRate}%)</div>
          </div>
          <div className={`p-3.5 rounded-2xl border space-y-0.5 ${
            isDark ? 'bg-slate-950/60 border-white/5' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="text-2xl font-extrabold font-display text-rose-500">
              {losses}
            </div>
            <div className="text-[11px] font-tech text-slate-400 uppercase">Defeats</div>
          </div>
          <div className={`p-3.5 rounded-2xl border space-y-0.5 ${
            isDark ? 'bg-slate-950/60 border-white/5' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="text-2xl font-extrabold font-display text-amber-500">
              {profile.stats?.puzzleStreak || 0}
            </div>
            <div className="text-[11px] font-tech text-slate-400 uppercase">Puzzle Streak</div>
          </div>
        </div>

        {/* Badges / Achievements */}
        <div className="space-y-3">
          <h3 className="text-xs font-tech font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-red-500" />
            Badges & Trophies
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[220px] overflow-y-auto pr-1">
            {ACHIEVEMENTS_LIST.map((ach) => {
              const isUnlocked = (profile.achievements || []).includes(ach.id) || (ach.id === 'first_blood' && wins > 0);
              return (
                <div
                  key={ach.id}
                  className={`p-3 rounded-2xl border flex items-center gap-3 ${
                    isUnlocked
                      ? 'bg-red-500/10 border-red-500/40 text-white'
                      : isDark ? 'bg-slate-950/40 border-white/5 text-slate-500 opacity-60' : 'bg-slate-50 border-slate-200 text-slate-400 opacity-70'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-black/40 flex items-center justify-center text-xl flex-shrink-0">
                    {ach.icon}
                  </div>
                  <div className="truncate">
                    <h4 className="font-semibold text-xs text-white truncate">{ach.name}</h4>
                    <p className="text-[11px] text-slate-400 truncate">{ach.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
