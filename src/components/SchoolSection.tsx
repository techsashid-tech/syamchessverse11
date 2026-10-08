import React, { useState, useEffect } from 'react';
import { Chess, Square } from 'chess.js';
import confetti from 'canvas-confetti';
import {
  Compass, CheckCircle2, ChevronRight,
  ArrowLeft, RotateCcw, BookOpen, Star, Sun, Moon
} from 'lucide-react';
import { LessonLevel } from '../types/chess';
import { CHESS_SCHOOL_LEVELS } from '../data/lessons';
import { ChessBoard2D } from './ChessBoard2D';
import { soundManager } from '../utils/audio';
import { addXP, getPlayerProfile, updateMissionProgress } from '../utils/storage';
import { useTheme } from '../context/ThemeContext';

interface SchoolSectionProps {
  onBack: () => void;
}

export const SchoolSection: React.FC<SchoolSectionProps> = ({ onBack }) => {
  const { themeMode, toggleTheme } = useTheme();
  const isDark = themeMode === 'dark';

  const [activeLessonIndex, setActiveLessonIndex] = useState<number>(0);
  const currentLesson: LessonLevel = CHESS_SCHOOL_LEVELS[activeLessonIndex] || CHESS_SCHOOL_LEVELS[0];
  const [lessonGame, setLessonGame] = useState<Chess>(new Chess(currentLesson.fen));
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [legalMoves, setLegalMoves] = useState<string[]>([]);
  const [lastMove, setLastMove] = useState<{ from: Square; to: Square } | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [completedIds, setCompletedIds] = useState<number[]>([]);

  useEffect(() => {
    const profile = getPlayerProfile();
    const stored = (profile.completedLessons || []).map((id: string) => Number(id)).filter((n: number) => !isNaN(n));
    setCompletedIds(stored);
  }, []);

  useEffect(() => {
    if (currentLesson) {
      setLessonGame(new Chess(currentLesson.fen));
      setSelectedSquare(null);
      setLegalMoves([]);
      setLastMove(null);
      setIsCompleted(completedIds.includes(currentLesson.id));
    }
  }, [currentLesson, completedIds]);

  const handleSquareClick = (sq: Square) => {
    if (isCompleted) return;

    if (selectedSquare) {
      if (selectedSquare === sq) {
        setSelectedSquare(null);
        setLegalMoves([]);
        return;
      }
      const piece = lessonGame.get(sq);
      if (piece && piece.color === lessonGame.turn()) {
        setSelectedSquare(sq);
        const moves = lessonGame.moves({ square: sq, verbose: true });
        setLegalMoves(moves.map((m) => m.to));
        soundManager.playClick();
        return;
      }

      try {
        const gameCopy = new Chess(lessonGame.fen());
        const move = gameCopy.move({ from: selectedSquare, to: sq, promotion: 'q' });
        if (move) {
          setLessonGame(gameCopy);
          setLastMove({ from: selectedSquare, to: sq });
          setSelectedSquare(null);
          setLegalMoves([]);

          if (move.captured) {
            soundManager.playCapture();
          } else {
            soundManager.playMove();
          }

          const isCorrect = currentLesson.targetMoves.includes(move.san);
          if (isCorrect) {
            setIsCompleted(true);
            soundManager.playPuzzleSuccess();
            confetti({ particleCount: 70, spread: 50, origin: { y: 0.6 } });
            addXP(currentLesson.xpReward);
            updateMissionProgress('study_opening', 1);
            const updated = Array.from(new Set([...completedIds, currentLesson.id]));
            setCompletedIds(updated);
            const prof = getPlayerProfile();
            prof.completedLessons = updated.map(String);
            localStorage.setItem('chessverse_player_profile', JSON.stringify(prof));
          }
        }
      } catch {
        setSelectedSquare(null);
        setLegalMoves([]);
      }
    } else {
      const piece = lessonGame.get(sq);
      if (piece && piece.color === lessonGame.turn()) {
        setSelectedSquare(sq);
        const moves = lessonGame.moves({ square: sq, verbose: true });
        setLegalMoves(moves.map((m) => m.to));
        soundManager.playClick();
      }
    }
  };

  const handleNextLesson = () => {
    soundManager.playClick();
    const nextIdx = (activeLessonIndex + 1) % CHESS_SCHOOL_LEVELS.length;
    setActiveLessonIndex(nextIdx);
  };

  const handleReset = () => {
    soundManager.playClick();
    setLessonGame(new Chess(currentLesson.fen));
    setSelectedSquare(null);
    setLegalMoves([]);
    setLastMove(null);
    setIsCompleted(false);
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
              <Compass className="w-6 h-6 text-emerald-500" />
              Chess School Academy
            </h1>
            <p className="text-xs text-slate-400">Step-by-step master curriculum from fundamentals to grandmaster strategy</p>
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

          <span className="text-xs text-slate-400 font-tech">PROGRESS:</span>
          <span className="font-tech font-bold text-emerald-500 text-sm">
            {completedIds.length} / {CHESS_SCHOOL_LEVELS.length} MASTERED
          </span>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start flex-1">
        {/* Left Board */}
        <div className="lg:col-span-8 flex flex-col items-center">
          <div className="w-full max-w-[560px]">
            <ChessBoard2D
              game={lessonGame}
              theme="forest"
              pieceStyle="classic"
              playerColor="w"
              selectedSquare={selectedSquare}
              legalMoves={legalMoves}
              lastMove={lastMove}
              isCheck={lessonGame.inCheck()}
              onSquareClick={handleSquareClick}
            />
          </div>

          {isCompleted && (
            <div className="mt-4 w-full max-w-[560px] p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 shadow-xl flex items-center justify-between gap-4 animate-[fadeIn_0.3s_ease-out]">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 flex-shrink-0" />
                <div>
                  <h4 className="font-display font-bold text-emerald-300 text-base">
                    LESSON COMPLETE! (+{currentLesson.xpReward} XP)
                  </h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {currentLesson.explanation}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleNextLesson}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs rounded-xl shadow-lg flex items-center gap-1 flex-shrink-0"
              >
                NEXT LESSON <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Right: Instructions */}
        <div className="lg:col-span-4 space-y-4">
          <div className={`p-5 rounded-3xl border shadow-xl space-y-4 ${
            isDark ? 'bg-slate-900/80 border-white/10' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-tech font-bold uppercase text-emerald-500 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                Lesson #{currentLesson.id} • {currentLesson.badge}
              </span>
              <span className="text-xs font-mono text-amber-500 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-current" /> +{currentLesson.xpReward} XP
              </span>
            </div>
            <h2 className="text-2xl font-display font-bold">
              {currentLesson.title}
            </h2>
            <p className="text-xs text-red-500 font-tech">{currentLesson.subtitle}</p>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              {currentLesson.description}
            </p>

            <div className={`p-3 rounded-2xl border text-xs space-y-1 ${
              isDark ? 'bg-slate-950/70 border-emerald-500/20' : 'bg-slate-50 border-emerald-200'
            }`}>
              <span className="font-tech uppercase font-bold text-emerald-500 block">
                YOUR OBJECTIVE:
              </span>
              <p className="text-slate-300">
                {currentLesson.interactiveGoal}
              </p>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className={`w-full py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 border ${
                isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-white/5' : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Lesson Position
            </button>
          </div>

          {/* Syllabus */}
          <div className={`p-5 rounded-3xl border shadow-xl space-y-3 ${
            isDark ? 'bg-slate-900/80 border-white/10' : 'bg-white border-slate-200'
          }`}>
            <h3 className="text-xs font-tech uppercase tracking-wider font-bold text-slate-400 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-500" />
              Course Syllabus
            </h3>
            <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
              {CHESS_SCHOOL_LEVELS.map((ls, idx) => {
                const isFinished = completedIds.includes(ls.id);
                const isCurrent = idx === activeLessonIndex;
                return (
                  <button
                    key={ls.id}
                    type="button"
                    onClick={() => setActiveLessonIndex(idx)}
                    className={`w-full p-2.5 rounded-xl text-left flex items-center justify-between gap-2 border transition-all text-xs ${
                      isCurrent
                        ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-500 font-bold'
                        : isDark ? 'bg-slate-950/50 border-white/5 text-slate-400 hover:text-white' : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-200 text-[10px] font-mono flex items-center justify-center font-bold">
                        {ls.id}
                      </span>
                      <span className="truncate max-w-[190px]">{ls.title}</span>
                    </div>
                    {isFinished && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
