import React, { useState } from 'react';
import { Chess, Square } from 'chess.js';
import {
  BookOpen, ArrowLeft,
  Sun, Moon
} from 'lucide-react';
import { OPENINGS_DATA } from '../data/openings';
import { ChessBoard2D } from './ChessBoard2D';
import { soundManager } from '../utils/audio';
import { useTheme } from '../context/ThemeContext';

interface OpeningExplorerProps {
  onBack: () => void;
}

export const OpeningExplorer: React.FC<OpeningExplorerProps> = ({ onBack }) => {
  const { themeMode, toggleTheme } = useTheme();
  const isDark = themeMode === 'dark';

  const [selectedOpening, setSelectedOpening] = useState(OPENINGS_DATA[0]);
  const [currentStep, setCurrentStep] = useState<number>(0);

  const buildGameToStep = (moves: string[], step: number) => {
    const g = new Chess();
    for (let i = 0; i < step && i < moves.length; i++) {
      try {
        g.move(moves[i]);
      } catch (err) {
        console.error('Opening move playback error:', err);
      }
    }
    return g;
  };

  const game = buildGameToStep(selectedOpening.moves, currentStep);

  const handleStepForward = () => {
    if (currentStep < selectedOpening.moves.length) {
      soundManager.playMove();
      setCurrentStep(currentStep + 1);
    }
  };

  const handleStepBackward = () => {
    if (currentStep > 0) {
      soundManager.playClick();
      setCurrentStep(currentStep - 1);
    }
  };

  const handleReset = () => {
    soundManager.playClick();
    setCurrentStep(0);
  };

  const handleSelectOpening = (op: typeof OPENINGS_DATA[0]) => {
    soundManager.playClick();
    setSelectedOpening(op);
    setCurrentStep(0);
  };

  return (
    <div className={`min-h-screen p-4 max-w-7xl mx-auto flex flex-col transition-colors duration-300 ${
      isDark ? 'bg-[#070305] text-slate-100' : 'bg-slate-100 text-slate-900'
    }`}>
      {/* Header */}
      <div className={`flex items-center justify-between py-3 border-b mb-6 ${
        isDark ? 'border-white/10' : 'border-slate-200'
      }`}>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors border ${
              isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-white/10' : 'bg-white hover:bg-slate-200 text-slate-800 border-slate-300 shadow-sm'
            }`}
          >
            <ArrowLeft className="w-4 h-4" /> Hub
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-display font-bold flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-red-500" />
              Grandmaster Opening Encyclopedia
            </h1>
            <p className="text-xs text-slate-400">Master world championship opening repertoires and theoretical ideas</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            className={`p-2 rounded-xl border transition-all ${
              isDark ? 'bg-slate-800 text-amber-400 border-white/10' : 'bg-amber-100 text-amber-800 border-amber-300'
            }`}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <span className="text-xs font-tech text-red-500 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 font-bold uppercase">
            ECO: {selectedOpening.eco}
          </span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start flex-1">
        {/* Board & Step Controls */}
        <div className="lg:col-span-8 flex flex-col items-center">
          <div className="w-full max-w-[560px]">
            <ChessBoard2D
              game={game}
              theme="crimson"
              pieceStyle="classic"
              playerColor="w"
              selectedSquare={null}
              legalMoves={[]}
              lastMove={null}
              isCheck={game.inCheck()}
              onSquareClick={() => {}}
              disabled={true}
            />
          </div>

          {/* Stepper Bar */}
          <div className={`mt-4 w-full max-w-[560px] p-4 rounded-2xl border shadow-lg flex items-center justify-between gap-4 ${
            isDark ? 'bg-slate-900/80 border-white/10' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleReset}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border ${
                  isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-white/5' : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
                }`}
              >
                Start
              </button>
              <button
                type="button"
                onClick={handleStepBackward}
                disabled={currentStep === 0}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border disabled:opacity-30 ${
                  isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-white/5' : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
                }`}
              >
                ◀ Prev Move
              </button>
              <button
                type="button"
                onClick={handleStepForward}
                disabled={currentStep >= selectedOpening.moves.length}
                className="px-4 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow disabled:opacity-30"
              >
                Next Move ▶
              </button>
            </div>

            <div className="text-xs font-mono text-slate-400">
              Move: <strong className="text-red-500 font-bold">{currentStep}</strong> / {selectedOpening.moves.length}
            </div>
          </div>
        </div>

        {/* Info & Opening List */}
        <div className="lg:col-span-4 space-y-4">
          <div className={`p-5 rounded-3xl border shadow-xl space-y-3 ${
            isDark ? 'bg-slate-900/80 border-white/10' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-tech font-bold text-red-500 uppercase px-2.5 py-0.5 rounded-full bg-red-500/10 border border-red-500/30">
                ECO {selectedOpening.eco}
              </span>
              <span className="text-xs font-semibold capitalize text-slate-400">
                {selectedOpening.difficulty}
              </span>
            </div>
            <h2 className="text-2xl font-display font-bold">
              {selectedOpening.name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              {selectedOpening.description}
            </p>

            <div className={`p-3 rounded-2xl border text-xs space-y-2 ${
              isDark ? 'bg-slate-950/70 border-white/5' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="font-tech uppercase font-bold text-red-500">Master Line:</div>
              <div className="font-mono text-xs flex flex-wrap gap-1.5">
                {selectedOpening.moves.map((mv, idx) => (
                  <span
                    key={idx}
                    className={`px-1.5 py-0.5 rounded ${
                      idx < currentStep ? 'bg-red-600 text-white font-bold' : isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {idx % 2 === 0 ? `${idx / 2 + 1}.` : ''}{mv}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Directory */}
          <div className={`p-5 rounded-3xl border shadow-xl space-y-3 ${
            isDark ? 'bg-slate-900/80 border-white/10' : 'bg-white border-slate-200'
          }`}>
            <h3 className="text-xs font-tech uppercase tracking-wider font-bold text-slate-400">
              Select Opening
            </h3>
            <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
              {OPENINGS_DATA.map((op) => (
                <button
                  key={op.id}
                  type="button"
                  onClick={() => handleSelectOpening(op)}
                  className={`w-full p-2.5 rounded-xl text-left flex items-center justify-between border transition-all text-xs ${
                    selectedOpening.id === op.id
                      ? 'bg-red-600/20 border-red-500 text-red-500 font-bold'
                      : isDark ? 'bg-slate-950/50 border-white/5 text-slate-400 hover:text-white' : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span className="truncate">{op.name}</span>
                  <span className="font-mono text-[11px] text-slate-500">{op.eco}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
