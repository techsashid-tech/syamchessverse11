import React, { useState } from 'react';
import {
  ShieldCheck, FileText, Scale, X, Lock, CheckCircle2,
  Trash2, AlertCircle, Sparkles
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { soundManager } from '../utils/audio';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'privacy' | 'terms' | 'fairplay';
}

export const LegalModal: React.FC<LegalModalProps> = ({ isOpen, onClose, defaultTab = 'privacy' }) => {
  const { themeMode } = useTheme();
  const isDark = themeMode === 'dark';

  const [activeTab, setActiveTab] = useState<'privacy' | 'terms' | 'fairplay'>(defaultTab);
  const [resetConfirm, setResetConfirm] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleClearData = () => {
    localStorage.clear();
    soundManager.playCapture();
    setResetConfirm(true);
    setTimeout(() => {
      window.location.reload();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
      <div className={`relative w-full max-w-3xl max-h-[85vh] flex flex-col rounded-3xl border shadow-2xl overflow-hidden transition-colors ${
        isDark ? 'bg-[#0b0805] border-amber-500/30 text-slate-100 shadow-[0_0_50px_rgba(245,158,11,0.15)]' : 'bg-white border-amber-300 text-slate-900'
      }`}>
        {/* Top Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${
          isDark ? 'border-amber-500/20 bg-amber-500/5' : 'border-amber-200 bg-amber-50/50'
        }`}>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-200 to-amber-400">
                LEGAL & TRUST CENTER
              </h2>
              <p className="text-[11px] text-amber-400/80 font-tech">
                Official Privacy Policy, Terms of Service & Fair Play Standards
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className={`p-2 rounded-xl border transition-colors ${
              isDark ? 'bg-slate-900 border-white/10 hover:bg-slate-800 text-slate-400 hover:text-white' : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-600'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className={`flex border-b px-6 pt-2 gap-2 ${
          isDark ? 'border-amber-500/15' : 'border-amber-200'
        }`}>
          {[
            { id: 'privacy', label: 'Privacy Policy', icon: Lock },
            { id: 'terms', label: 'Terms of Service', icon: FileText },
            { id: 'fairplay', label: 'Fair Play Code', icon: Scale },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  setActiveTab(tab.id as any);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-tech font-bold border-b-2 transition-all ${
                  isActive
                    ? 'border-amber-400 text-amber-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-300 leading-relaxed font-sans">
          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-200">
                <span className="font-bold flex items-center gap-1.5 text-sm mb-1 text-amber-300">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Zero Tracker & 100% Local-First Guarantee
                </span>
                We believe privacy is a fundamental human right. This chess platform operates client-side: your games, puzzle ratings, XP, and preferences are stored exclusively in your browser’s local storage. We do NOT harvest, monetize, or sell your personal data.
              </div>

              <div>
                <h3 className="font-display font-bold text-sm text-amber-300 mb-1">1. Information We Collect</h3>
                <p>Because no registration is mandatory, we do not require your real name, phone number, or payment cards. The application stores:</p>
                <ul className="list-disc pl-5 mt-1 space-y-0.5 text-slate-400">
                  <li>Local game histories and PGN notation records.</li>
                  <li>Tactical puzzle solving ratings, streaks, and achievements.</li>
                  <li>Interface preferences (Dark/Light mode, board themes, sound toggle).</li>
                </ul>
              </div>

              <div>
                <h3 className="font-display font-bold text-sm text-amber-300 mb-1">2. 3D WebGL & Hardware Acceleration</h3>
                <p>
                  The 3D Inverted Dome Gallery and Vertex Vortex visualizers utilize your local device's GPU through standard WebGL shaders. No biometric, hardware fingerprinting, or surveillance telemetry is transmitted from your graphics card.
                </p>
              </div>

              <div>
                <h3 className="font-display font-bold text-sm text-amber-300 mb-1">3. Compliance Declarations</h3>
                <p>
                  This service is fully compliant with the Children's Online Privacy Protection Act (COPPA), the General Data Protection Regulation (GDPR), and the California Consumer Privacy Act (CCPA).
                </p>
              </div>

              <div className="pt-4 border-t border-amber-500/20">
                <h4 className="font-bold text-amber-300 mb-2">Manage Your Local Game Data</h4>
                <p className="text-slate-400 mb-3">
                  You can purge all cached game statistics, tactical streaks, and profiles at any time.
                </p>
                {resetConfirm ? (
                  <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Local storage cleared! Reloading platform...
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleClearData}
                    className="px-4 py-2 rounded-xl bg-rose-950/80 hover:bg-rose-900/80 border border-rose-500/40 text-rose-300 font-tech font-bold text-xs flex items-center gap-2 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Clear All Local Game Data
                  </button>
                )}
              </div>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-display font-bold text-sm text-amber-300 mb-1">1. Acceptance of Terms</h3>
                <p>
                  By accessing and playing on this chess application, you agree to be bound by these Terms of Service, standard international chess etiquette, and fair play principles.
                </p>
              </div>

              <div>
                <h3 className="font-display font-bold text-sm text-amber-300 mb-1">2. Permitted Educational Use</h3>
                <p>
                  This platform is provided 100% free of charge for players of all ages, youngsters, students, and chess masters worldwide to study chess, solve tactical puzzles, and test their skills against pro-level AI grandmasters.
                </p>
              </div>

              <div>
                <h3 className="font-display font-bold text-sm text-amber-300 mb-1">3. Intellectual Property</h3>
                <p>
                  Rules of chess are governed by the Fédération Internationale des Échecs (FIDE). The chess move generation engine leverages open-source standards. Custom 3D gallery visuals, inverted dome rendering code, audio synthesizers, and UI branding are proprietary assets protected by copyright laws.
                </p>
              </div>

              <div>
                <h3 className="font-display font-bold text-sm text-amber-300 mb-1">4. Disclaimer of Warranties</h3>
                <p>
                  This application is delivered "as-is" without warranty of continuous uninterrupted availability. We reserve the right to deploy updates, add new pro puzzles, and optimize AI engine weights without prior notice.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'fairplay' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-200">
                <span className="font-bold flex items-center gap-1.5 text-sm mb-1 text-amber-300">
                  <Scale className="w-4 h-4 text-amber-400" />
                  The Grandmaster Spirit of Fair Play
                </span>
                Chess has thrived for over 1,500 years on honor, mutual respect, and pure intellectual truth. We uphold the strictest standards of fair play across our platform.
              </div>

              <div>
                <h3 className="font-display font-bold text-sm text-amber-300 mb-1">1. AI Engine Assistance in PvP Matches</h3>
                <p>
                  Using external chess engines, neural net evaluators, or opening book databases during matches against human players is strictly forbidden. Players must rely solely on their own mind.
                </p>
              </div>

              <div>
                <h3 className="font-display font-bold text-sm text-amber-300 mb-1">2. Learning with AI</h3>
                <p>
                  When playing against Spark, Neo Bolt, Aurelia, Shadow, or Grandmaster X, players are encouraged to study engine analysis and learn from tactical corrections.
                </p>
              </div>

              <div>
                <h3 className="font-display font-bold text-sm text-amber-300 mb-1">3. Sportsmanship & Respect</h3>
                <p>
                  Respect your opponent, win with humility, and lose with grace. Analyze every defeat to forge your next victory!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`px-6 py-3 border-t flex items-center justify-between text-[11px] ${
          isDark ? 'border-amber-500/20 bg-black/40 text-slate-400' : 'border-amber-200 bg-amber-50/50 text-slate-600'
        }`}>
          <span>Last Updated: September 2026</span>
          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-tech font-bold text-xs shadow"
          >
            I UNDERSTAND & AGREE
          </button>
        </div>
      </div>
    </div>
  );
};
