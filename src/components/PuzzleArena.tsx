import React, { useState, useEffect } from 'react';
import { Chess, Square } from 'chess.js';
import confetti from 'canvas-confetti';
import {
  Brain, Sparkles, Lightbulb, RotateCcw, ChevronRight,
  Flame, CheckCircle2, XCircle, ArrowLeft, Sun, Moon,
  ChevronLeft, Award, Zap
} from 'lucide-react';
import { Puzzle } from '../types/chess';
import { PUZZLES_DATA, getDailyPuzzle } from '../data/puzzles';
import { ChessBoard2D } from './ChessBoard2D';
import { soundManager } from '../utils/audio';
import { recordPuzzleSolved } from '../utils/storage';
import { useTheme } from '../context/ThemeContext';

interface PuzzleArenaProps {
  onBack: () => void;
  onOpenStats?: () => void;
}

export const PuzzleArena: React.FC<PuzzleArenaProps> = ({ onBack }) => {
  const { themeMode, toggleTheme } = useTheme();
  const isDark = themeMode === 'dark';

  const [difficultyFilter, setDifficultyFilter] = useState<'all' | 'easy' | 'medium' | 'hard' | 'pro' | 'grandmaster'>('all');
  const [activePuzzleIndex, setActivePuzzleIndex] = useState<number>(0);
  const [filteredPuzzles, setFilteredPuzzles] = useState<Puzzle[]>(PUZZLES_DATA);

  const currentPuzzle = filteredPuzzles[activePuzzleIndex] || PUZZLES_DATA[0];
  const [puzzleGame, setPuzzleGame] = useState<Chess>(new Chess(currentPuzzle.fen));
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [legalMoves, setLegalMoves] = useState<string[]>([]);
  const [lastMove, setLastMove] = useState<{ from: Square; to: Square } | null>(null);
  const [puzzleStatus, setPuzzleStatus] = useState<'unsolved' | 'correct' | 'wrong'>('unsolved');
  const [showHint, setShowHint] = useState<boolean>(false);
  const [streak, setStreak] = useState<number>(0);
  const [moveStep, setMoveStep] = useState<number>(0);

  // Difficulty counts
  const counts = {
    all: PUZZLES_DATA.length,
    easy: PUZZLES_DATA.filter((p) => p.difficulty === 'easy').length,
    medium: PUZZLES_DATA.filter((p) => p.difficulty === 'medium').length,
    hard: PUZZLES_DATA.filter((p) => p.difficulty === 'hard').length,
    pro: PUZZLES_DATA.filter((p) => p.difficulty === 'pro').length,
    grandmaster: PUZZLES_DATA.filter((p) => p.difficulty === 'grandmaster').length,
  };

  useEffect(() => {
    if (difficultyFilter === 'all') {
      setFilteredPuzzles(PUZZLES_DATA);
    } else {
      setFilteredPuzzles(PUZZLES_DATA.filter((p) => p.difficulty === difficultyFilter));
    }
    setActivePuzzleIndex(0);
  }, [difficultyFilter]);

  useEffect(() => {
    if (currentPuzzle) {
      setPuzzleGame(new Chess(currentPuzzle.fen));
      setSelectedSquare(null);
      setLegalMoves([]);
      setLastMove(null);
      setPuzzleStatus('unsolved');
      setShowHint(false);
      setMoveStep(0);
    }
  }, [currentPuzzle]);

  const handleSquareClick = (sq: Square) => {
    if (puzzleStatus === 'correct') return;

    if (selectedSquare) {
      if (selectedSquare === sq) {
        setSelectedSquare(null);
        setLegalMoves([]);
        return;
      }
      const piece = puzzleGame.get(sq);
      if (piece && piece.color === puzzleGame.turn()) {
        setSelectedSquare(sq);
        const moves = puzzleGame.moves({ square: sq, verbose: true });
        setLegalMoves(moves.map((m) => m.to));
        soundManager.playClick();
        return;
      }

      try {
        const gameCopy = new Chess(puzzleGame.fen());
        const move = gameCopy.move({ from: selectedSquare, to: sq, promotion: 'q' });
        if (move) {
          const targetMoveSan = currentPuzzle.moves[moveStep];
          const isExpectedMove = move.san === targetMoveSan;

          if (isExpectedMove) {
            setPuzzleGame(gameCopy);
            setLastMove({ from: selectedSquare, to: sq });
            setSelectedSquare(null);
            setLegalMoves([]);

            if (move.captured) {
              soundManager.playCapture();
            } else {
              soundManager.playMove();
            }

            if (moveStep + 1 >= currentPuzzle.moves.length) {
              setPuzzleStatus('correct');
              soundManager.playPuzzleSuccess();
              confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
              const res = recordPuzzleSolved(true);
              setStreak(res.newStreak);
            } else {
              setMoveStep(moveStep + 1);
              const opponentCounterSan = currentPuzzle.moves[moveStep + 1];
              setTimeout(() => {
                const nextGame = new Chess(gameCopy.fen());
                nextGame.move(opponentCounterSan);
                setPuzzleGame(nextGame);
                setMoveStep(moveStep + 2);
              }, 400);
            }
          } else {
            setPuzzleStatus('wrong');
            soundManager.playPuzzleFail();
            setSelectedSquare(null);
            setLegalMoves([]);
            recordPuzzleSolved(false);
            setStreak(0);
          }
        }
      } catch {
        setSelectedSquare(null);
        setLegalMoves([]);
      }
    } else {
      const piece = puzzleGame.get(sq);
      if (piece && piece.color === puzzleGame.turn()) {
        setSelectedSquare(sq);
        const moves = puzzleGame.moves({ square: sq, verbose: true });
        setLegalMoves(moves.map((m) => m.to));
        soundManager.playClick();
      }
    }
  };

  const handleRetry = () => {
    soundManager.playClick();
    setPuzzleGame(new Chess(currentPuzzle.fen));
    setSelectedSquare(null);
    setLegalMoves([]);
    setLastMove(null);
    setPuzzleStatus('unsolved');
    setMoveStep(0);
  };

  const handleNextPuzzle = () => {
    soundManager.playClick();
    const nextIdx = (activePuzzleIndex + 1) % filteredPuzzles.length;
    setActivePuzzleIndex(nextIdx);
  };

  const handlePrevPuzzle = () => {
    soundManager.playClick();
    const prevIdx = (activePuzzleIndex - 1 + filteredPuzzles.length) % filteredPuzzles.length;
    setActivePuzzleIndex(prevIdx);
  };

  const handleLoadDaily = () => {
    soundManager.playClick();
    const daily = getDailyPuzzle();
    setFilteredPuzzles([daily]);
    setActivePuzzleIndex(0);
  };

  return (
    <div className={`min-h-screen p-4 max-w-7xl mx-auto flex flex-col transition-colors duration-300 ${
      isDark ? 'bg-[#090704] text-slate-100' : 'bg-[#faf8f5] text-slate-900'
    }`}>
      {/* Top Sweep Effect */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
        <div className="w-1/3 h-full bg-gradient-to-r from-transparent via-amber-500/10 to-transparent skew-x-[-25deg] animate-royal-sweep" />
      </div>

      {/* Header */}
      <div className={`relative z-20 flex items-center justify-between py-3 border-b mb-6 ${
        isDark ? 'border-amber-500/20' : 'border-amber-200'
      }`}>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors border ${
              isDark ? 'bg-slate-900 hover:bg-slate-800 text-amber-200 border-amber-500/30' : 'bg-white hover:bg-amber-50 text-slate-800 border-amber-300 shadow-sm'
            }`}
          >
            <ArrowLeft className="w-4 h-4" /> Hub
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-display font-bold flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Brain className="w-5 h-5" />
              </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-200 to-amber-400">
                PUZZLE ARENA
              </span>
            </h1>
            <p className="text-xs text-amber-400/80 font-tech">
              Sharpen tactical calculation & build solving streaks • {counts.all} Master Tactics
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            className={`p-2 rounded-xl border transition-all ${
              isDark ? 'bg-slate-900 text-amber-400 border-amber-500/30' : 'bg-amber-100 text-amber-900 border-amber-300'
            }`}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-400/40 text-amber-400 font-tech font-bold text-xs sm:text-sm shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <Flame className="w-4 h-4 fill-current animate-pulse text-amber-400" />
            <span>STREAK: {streak}</span>
          </div>
          <button
            type="button"
            onClick={handleLoadDaily}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 font-tech font-extrabold text-xs shadow-[0_0_20px_rgba(245,158,11,0.35)] border border-amber-300 hover:scale-102 transition-transform"
          >
            <Sparkles className="w-3.5 h-3.5" /> TODAY'S DAILY (+100 XP)
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="relative z-20 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start flex-1">
        {/* Board Section */}
        <div className="lg:col-span-8 flex flex-col items-center">
          <div className="w-full max-w-[580px] p-2 rounded-3xl border shadow-2xl bg-gradient-to-b from-amber-500/10 to-transparent border-amber-500/30">
            <ChessBoard2D
              game={puzzleGame}
              theme="royal"
              pieceStyle="classic"
              playerColor={currentPuzzle.playerColor}
              selectedSquare={selectedSquare}
              legalMoves={legalMoves}
              lastMove={lastMove}
              isCheck={puzzleGame.inCheck()}
              onSquareClick={handleSquareClick}
            />
          </div>

          {puzzleStatus === 'correct' && (
            <div className="mt-4 w-full max-w-[580px] p-4 rounded-2xl bg-gradient-to-r from-amber-950/80 via-emerald-950/80 to-amber-950/80 border border-amber-400/60 shadow-[0_0_30px_rgba(245,158,11,0.3)] flex items-center justify-between gap-4 animate-[fadeIn_0.3s_ease-out]">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-8 h-8 text-amber-400 flex-shrink-0" />
                <div>
                  <h4 className="font-display font-bold text-amber-300 text-base flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    BRILLIANT! PUZZLE SOLVED!
                  </h4>
                  <p className="text-xs text-slate-200 mt-0.5">
                    {currentPuzzle.explanation}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleNextPuzzle}
                className="px-4 py-2 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg flex items-center gap-1 flex-shrink-0"
              >
                NEXT PUZZLE <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {puzzleStatus === 'wrong' && (
            <div className="mt-4 w-full max-w-[580px] p-4 rounded-2xl bg-rose-950/80 border border-rose-500/50 shadow-xl flex items-center justify-between gap-4 animate-[fadeIn_0.3s_ease-out]">
              <div className="flex items-center gap-3">
                <XCircle className="w-8 h-8 text-rose-400 flex-shrink-0" />
                <div>
                  <h4 className="font-display font-bold text-rose-300 text-base">
                    INCORRECT MOVE
                  </h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    That move allows the defense to escape. Try another tactic!
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRetry}
                className="px-4 py-2 bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-1 flex-shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" /> RETRY
              </button>
            </div>
          )}
        </div>

        {/* Puzzle Info & Filters */}
        <div className="lg:col-span-4 space-y-4">
          <div className={`p-5 rounded-3xl border shadow-xl space-y-4 ${
            isDark ? 'bg-[#0d0905]/90 border-amber-500/25' : 'bg-white border-amber-200'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-tech uppercase font-bold text-amber-400 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-400/40 shadow-sm flex items-center gap-1">
                <Award className="w-3 h-3" />
                {currentPuzzle.theme}
              </span>
              <span className="text-xs font-mono font-bold text-amber-300 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                {currentPuzzle.rating} ELO
              </span>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-200 to-amber-400">
                  {currentPuzzle.title}
                </h2>
                <span className="text-xs font-tech text-amber-400/80 font-bold">
                  #{activePuzzleIndex + 1}/{filteredPuzzles.length}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {currentPuzzle.description}
              </p>
            </div>

            <div className={`p-3 rounded-2xl border text-xs space-y-1 ${
              isDark ? 'bg-black/60 border-amber-500/15 text-slate-300' : 'bg-amber-50/70 border-amber-200 text-slate-700'
            }`}>
              <div className="flex justify-between">
                <span>Side to move:</span>
                <span className="font-bold capitalize text-amber-400">
                  {currentPuzzle.playerColor === 'w' ? 'White' : 'Black'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Objective:</span>
                <span className="font-bold text-emerald-400">Find the best winning move</span>
              </div>
            </div>

            {/* Hint Box */}
            {showHint ? (
              <div className="p-3 rounded-2xl bg-amber-500/15 border border-amber-400/50 text-xs text-amber-300 space-y-1 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                <span className="font-bold uppercase tracking-wider text-[10px] text-amber-200 block flex items-center gap-1">
                  <Lightbulb className="w-3 h-3" /> Tactical Hint:
                </span>
                <p>{currentPuzzle.hint}</p>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  setShowHint(true);
                }}
                className={`w-full py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all border font-semibold ${
                  isDark ? 'bg-slate-900 hover:bg-slate-800 text-amber-300 border-amber-500/30' : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300'
                }`}
              >
                <Lightbulb className="w-4 h-4 text-amber-400" />
                Show Tactical Hint
              </button>
            )}

            {/* Quick Action Navigation */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              <button
                type="button"
                onClick={handlePrevPuzzle}
                className={`py-2 px-2 rounded-xl text-xs flex items-center justify-center gap-1 border font-semibold ${
                  isDark ? 'bg-slate-900 hover:bg-slate-800 text-amber-200 border-amber-500/30' : 'bg-white hover:bg-amber-50 text-slate-800 border-amber-200'
                }`}
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Prev
              </button>
              <button
                type="button"
                onClick={handleRetry}
                className={`py-2 px-2 rounded-xl text-xs flex items-center justify-center gap-1 border font-semibold ${
                  isDark ? 'bg-slate-900 hover:bg-slate-800 text-amber-200 border-amber-500/30' : 'bg-white hover:bg-amber-50 text-slate-800 border-amber-200'
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
              <button
                type="button"
                onClick={handleNextPuzzle}
                className="py-2 px-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 font-bold text-xs shadow-[0_0_15px_rgba(245,158,11,0.3)] flex items-center justify-center gap-1"
              >
                Next <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Difficulty Tier Filters - Styled to match screenshot + Golden Highlights */}
          <div className={`p-5 rounded-3xl border shadow-xl space-y-3 ${
            isDark ? 'bg-[#0d0905]/90 border-amber-500/25' : 'bg-white border-amber-200'
          }`}>
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-tech uppercase tracking-wider font-bold text-amber-400 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" /> SELECT DIFFICULTY TIER
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">
                {filteredPuzzles.length} Tactics
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'all', label: 'All', count: counts.all },
                { id: 'easy', label: 'Easy', count: counts.easy },
                { id: 'medium', label: 'Medium', count: counts.medium },
                { id: 'hard', label: 'Hard', count: counts.hard },
                { id: 'pro', label: 'Pro', count: counts.pro },
                { id: 'grandmaster', label: 'Grandmaster', count: counts.grandmaster },
              ].map((tier) => {
                const isActive = difficultyFilter === tier.id;
                return (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => {
                      setDifficultyFilter(tier.id as any);
                      soundManager.playClick();
                    }}
                    className={`py-2.5 px-2 rounded-2xl text-center text-xs font-semibold transition-all border ${
                      isActive
                        ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 font-black border-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.4)] scale-102'
                        : isDark
                          ? 'bg-slate-900/90 text-slate-300 border-white/10 hover:border-amber-500/40 hover:text-white'
                          : 'bg-amber-50/70 text-slate-700 border-amber-200 hover:bg-amber-100/60'
                    }`}
                  >
                    <span className="block">{tier.label}</span>
                    <span className={`text-[10px] font-mono ${isActive ? 'text-slate-950 font-bold' : 'text-amber-500/90'}`}>
                      ({tier.count})
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Tactical Puzzle List Stepper */}
            <div className="pt-2 border-t border-amber-500/15">
              <span className="text-[11px] font-tech text-slate-400 block mb-2 uppercase font-bold">
                Select Specific Puzzle:
              </span>
              <div className="grid grid-cols-4 gap-1.5 max-h-32 overflow-y-auto pr-1">
                {filteredPuzzles.map((pz, idx) => (
                  <button
                    key={pz.id}
                    type="button"
                    onClick={() => {
                      setActivePuzzleIndex(idx);
                      soundManager.playClick();
                    }}
                    className={`p-1.5 rounded-lg text-center font-mono text-[10px] font-bold border transition-colors ${
                      activePuzzleIndex === idx
                        ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-sm'
                        : isDark ? 'bg-black/50 text-slate-300 border-white/10 hover:bg-slate-800' : 'bg-white text-slate-700 border-slate-200 hover:bg-amber-50'
                    }`}
                    title={`${pz.title} (${pz.rating} ELO)`}
                  >
                    #{idx + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

