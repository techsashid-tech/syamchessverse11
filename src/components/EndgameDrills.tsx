import React, { useState } from 'react';
import { Chess, Square } from 'chess.js';
import confetti from 'canvas-confetti';
import {
  Shield, CheckCircle2, ArrowLeft,
  RotateCcw, ChevronRight, Sun, Moon
} from 'lucide-react';
import { EndgameDrill } from '../types/chess';
import { ENDGAME_DRILLS } from '../data/endgames';
import { ChessBoard2D } from './ChessBoard2D';
import { soundManager } from '../utils/audio';
import { addXP } from '../utils/storage';
import { useTheme } from '../context/ThemeContext';

interface EndgameDrillsProps {
  onBack: () => void;
}

export const EndgameDrills: React.FC<EndgameDrillsProps> = ({ onBack }) => {
  const { themeMode, toggleTheme } = useTheme();
  const isDark = themeMode === 'dark';

  const [activeDrillIndex, setActiveDrillIndex] = useState<number>(0);
  const currentDrill: EndgameDrill = ENDGAME_DRILLS[activeDrillIndex] || ENDGAME_DRILLS[0];
  const [endgame, setEndgame] = useState<Chess>(new Chess(currentDrill.fen));
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [legalMoves, setLegalMoves] = useState<string[]>([]);
  const [lastMove, setLastMove] = useState<{ from: Square; to: Square } | null>(null);
  const [isWon, setIsWon] = useState<boolean>(false);

  const handleSquareClick = (sq: Square) => {
    if (isWon) return;

    if (selectedSquare) {
      if (selectedSquare === sq) {
        setSelectedSquare(null);
        setLegalMoves([]);
        return;
      }
      const piece = endgame.get(sq);
      if (piece && piece.color === endgame.turn()) {
        setSelectedSquare(sq);
        const moves = endgame.moves({ square: sq, verbose: true });
        setLegalMoves(moves.map((m) => m.to));
        soundManager.playClick();
        return;
      }

      try {
        const gameCopy = new Chess(endgame.fen());
        const move = gameCopy.move({ from: selectedSquare, to: sq, promotion: 'q' });
        if (move) {
          setEndgame(gameCopy);
          setLastMove({ from: selectedSquare, to: sq });
          setSelectedSquare(null);
          setLegalMoves([]);

          if (move.captured) {
            soundManager.playCapture();
          } else {
            soundManager.playMove();
          }

          if (gameCopy.isCheckmate()) {
            setIsWon(true);
            soundManager.playCheckmate();
            confetti({ particleCount: 90, spread: 60, origin: { y: 0.6 } });
            addXP(currentDrill.xpReward || 60);
          } else {
            // Quick random defense response for drill practice
            setTimeout(() => {
              const defenseGame = new Chess(gameCopy.fen());
              const possibleMoves = defenseGame.moves({ verbose: true });
              if (possibleMoves.length > 0) {
                const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
                defenseGame.move(randomMove);
                setEndgame(defenseGame);
                setLastMove({ from: randomMove.from as Square, to: randomMove.to as Square });
              }
            }, 300);
          }
        }
      } catch {
        setSelectedSquare(null);
        setLegalMoves([]);
      }
    } else {
      const piece = endgame.get(sq);
      if (piece && piece.color === endgame.turn()) {
        setSelectedSquare(sq);
        const moves = endgame.moves({ square: sq, verbose: true });
        setLegalMoves(moves.map((m) => m.to));
        soundManager.playClick();
      }
    }
  };

  const handleReset = () => {
    soundManager.playClick();
    setEndgame(new Chess(currentDrill.fen));
    setSelectedSquare(null);
    setLegalMoves([]);
    setLastMove(null);
    setIsWon(false);
  };

  const handleNextDrill = () => {
    soundManager.playClick();
    const nextIdx = (activeDrillIndex + 1) % ENDGAME_DRILLS.length;
    setActiveDrillIndex(nextIdx);
    setIsWon(false);
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
              <Shield className="w-6 h-6 text-red-500" />
              Endgame Mastery Drills
            </h1>
            <p className="text-xs text-slate-400">Convert advantages into checkmates under strict technique</p>
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

          <span className="text-xs font-tech text-amber-500 font-bold">
            +{currentDrill.xpReward} XP PER VICTORY
          </span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start flex-1">
        {/* Board */}
        <div className="lg:col-span-8 flex flex-col items-center">
          <div className="w-full max-w-[560px]">
            <ChessBoard2D
              game={endgame}
              theme="crimson"
              pieceStyle="classic"
              playerColor="w"
              selectedSquare={selectedSquare}
              legalMoves={legalMoves}
              lastMove={lastMove}
              isCheck={endgame.inCheck()}
              onSquareClick={handleSquareClick}
            />
          </div>

          {isWon && (
            <div className="mt-4 w-full max-w-[560px] p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 shadow-xl flex items-center justify-between gap-4 animate-[fadeIn_0.3s_ease-out]">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 flex-shrink-0" />
                <div>
                  <h4 className="font-display font-bold text-emerald-300 text-base">
                    CHECKMATE DELIVERED! (+{currentDrill.xpReward} XP)
                  </h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Flawless endgame execution. Keep practicing!
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleNextDrill}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs rounded-xl shadow-lg flex items-center gap-1 flex-shrink-0"
              >
                NEXT DRILL <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="lg:col-span-4 space-y-4">
          <div className={`p-5 rounded-3xl border shadow-xl space-y-3 ${
            isDark ? 'bg-slate-900/80 border-white/10' : 'bg-white border-slate-200'
          }`}>
            <span className="text-xs font-tech font-bold text-red-500 uppercase px-2.5 py-0.5 rounded-full bg-red-500/10 border border-red-500/30">
              {currentDrill.category}
            </span>
            <h2 className="text-2xl font-display font-bold">
              {currentDrill.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              {currentDrill.description || currentDrill.goal}
            </p>
            <div className={`p-3 rounded-2xl border text-xs space-y-1 ${
              isDark ? 'bg-slate-950/70 border-white/5' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="font-bold text-red-500 font-tech uppercase">Key Technique:</div>
              <p className="text-slate-300">{currentDrill.instructions}</p>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className={`w-full py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 border ${
                isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-white/5' : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" /> Restart Drill
            </button>
          </div>

          {/* Drill Selector */}
          <div className={`p-5 rounded-3xl border shadow-xl space-y-3 ${
            isDark ? 'bg-slate-900/80 border-white/10' : 'bg-white border-slate-200'
          }`}>
            <h3 className="text-xs font-tech uppercase tracking-wider font-bold text-slate-400">
              Select Drill
            </h3>
            <div className="space-y-1.5">
              {ENDGAME_DRILLS.map((dr, idx) => (
                <button
                  key={dr.id}
                  type="button"
                  onClick={() => {
                    setActiveDrillIndex(idx);
                    setIsWon(false);
                  }}
                  className={`w-full p-2.5 rounded-xl text-left flex items-center justify-between border transition-all text-xs ${
                    idx === activeDrillIndex
                      ? 'bg-red-600/20 border-red-500 text-red-500 font-bold'
                      : isDark ? 'bg-slate-950/50 border-white/5 text-slate-400 hover:text-white' : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>{dr.title}</span>
                  <span className="capitalize text-[11px] text-slate-500">{dr.category}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
