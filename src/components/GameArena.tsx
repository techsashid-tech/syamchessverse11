import React, { useState, useEffect, useRef } from 'react';
import { Chess, Square } from 'chess.js';
import confetti from 'canvas-confetti';
import {
  RotateCcw, Undo2, Flag, Lightbulb, Volume2, VolumeX,
  Music, Eye, Palette, ChevronLeft,
  ShieldAlert, Cpu, Trophy, Award, MessageSquare, Sun, Moon,
  Check, Sparkles, X
} from 'lucide-react';
import {
  GameMode, BoardTheme, PieceStyle,
  AIOpponent, MoveAnalysis
} from '../types/chess';
import { ThreeChessBoard } from './ThreeChessBoard';
import { ChessBoard2D } from './ChessBoard2D';
import { AI_OPPONENTS } from '../data/aiOpponents';
import { soundManager } from '../utils/audio';
import {
  getAIMove, getMoveHint, getMovableSquares,
  analyzeMove, getCapturedPieces
} from '../utils/chessEngine';
import { recordGameResult, updateMissionProgress } from '../utils/storage';
import { useTheme } from '../context/ThemeContext';

interface BoardThemeConfig {
  id: BoardTheme;
  name: string;
  tag: string;
  lightColor: string;
  darkColor: string;
  borderColor: string;
  isPopular?: boolean;
}

const BOARD_THEME_CONFIGS: BoardThemeConfig[] = [
  { id: 'crimson', name: 'Crimson Pro', tag: 'Premier Red & Onyx', lightColor: '#f87171', darkColor: '#2b070a', borderColor: '#ef4444', isPopular: true },
  { id: 'royal', name: 'Imperial Royal', tag: 'Gold & Pure Velvet', lightColor: '#faf9f6', darkColor: '#1a1a1a', borderColor: '#f59e0b', isPopular: true },
  { id: 'classic', name: 'Grandmaster Wood', tag: 'Walnut & Warm Ivory', lightColor: '#f0d9b5', darkColor: '#b58863', borderColor: '#d97706' },
  { id: 'neon', name: 'Cyber Neon', tag: 'High-Voltage Cyan', lightColor: '#0ef0e4', darkColor: '#111c38', borderColor: '#06b6d4' },
  { id: 'space', name: 'Cosmic Void', tag: 'Starlight Silver & Deep Slate', lightColor: '#93a5cf', darkColor: '#192231', borderColor: '#6366f1' },
  { id: 'volcanic', name: 'Volcanic Core', tag: 'Molten Lava & Basalt', lightColor: '#ff6600', darkColor: '#1e1512', borderColor: '#f97316' },
  { id: 'ice', name: 'Glacial Arctic', tag: 'Frosted Crystal & Cyan', lightColor: '#e0f7fa', darkColor: '#4dd0e1', borderColor: '#38bdf8' },
  { id: 'candy', name: 'Pastel Dream', tag: 'Bubblegum & Cotton Sky', lightColor: '#ffd1dc', darkColor: '#9be2e8', borderColor: '#f472b6' },
  { id: 'forest', name: 'Emerald Forest', tag: 'Jade & Ancient Oak', lightColor: '#cedbb2', darkColor: '#44633f', borderColor: '#10b981' },
];

interface GameArenaProps {
  initialMode: GameMode;
  initialTheme: BoardTheme;
  initialPieceStyle: PieceStyle;
  onExitToHub: () => void;
  onOpenSettings: () => void;
  onOpenStats: () => void;
}

export const GameArena: React.FC<GameArenaProps> = ({
  initialMode,
  initialTheme,
  initialPieceStyle,
  onExitToHub,
  onOpenStats
}) => {
  const { themeMode, toggleTheme } = useTheme();
  const isDark = themeMode === 'dark';

  // Game state
  const [game, setGame] = useState<Chess>(new Chess());
  const [gameMode] = useState<GameMode>(initialMode);
  const [boardTheme, setBoardTheme] = useState<BoardTheme>(initialTheme || 'crimson');
  const [pieceStyle] = useState<PieceStyle>(initialPieceStyle);
  const [viewMode, setViewMode] = useState<'3d' | '2d'>('3d');
  const [playerColor, setPlayerColor] = useState<'w' | 'b'>('w');
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [legalMoves, setLegalMoves] = useState<string[]>([]);
  const [lastMove, setLastMove] = useState<{ from: Square; to: Square } | null>(null);

  // AI Opponent selection
  const [selectedAI, setSelectedAI] = useState<AIOpponent>(AI_OPPONENTS[0]);
  const [aiThinking, setAiThinking] = useState(false);
  const [aiMessage, setAiMessage] = useState<string>(selectedAI.intro);

  // AI execution locks & timer refs to guarantee rock-solid non-hanging moves
  const aiCalculatingRef = useRef(false);
  const aiTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Board Theme Selector Popover State
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);

  // Pending Promotion Dialog state
  const [pendingPromotion, setPendingPromotion] = useState<{ from: Square; to: Square } | null>(null);

  // Game over state
  const [gameOverResult, setGameOverResult] = useState<{
    isOpen: boolean;
    result: 'win' | 'loss' | 'draw';
    title: string;
    subtitle: string;
    xpGained: number;
  } | null>(null);

  // Beginner Assistance Toggles
  const [showMovable, setShowMovable] = useState(false);
  const [showAttacks, setShowAttacks] = useState(false);
  const [activeHint, setActiveHint] = useState<string | null>(null);

  // Coach Analysis state
  const [coachFeedback, setCoachFeedback] = useState<MoveAnalysis | null>(null);

  // Chess Clocks
  const [timerPresetMinutes] = useState<number>(10);
  const [whiteTime, setWhiteTime] = useState<number>(600);
  const [blackTime, setBlackTime] = useState<number>(600);
  const [isClockRunning, setIsClockRunning] = useState<boolean>(true);

  // Sound & Music
  const [soundOn, setSoundOn] = useState(true);
  const [musicOn, setMusicOn] = useState(false);

  // 2-Player Local names
  const [player1Name] = useState('Player One (White)');
  const [player2Name] = useState('Player Two (Black)');

  // Captured pieces
  const captured = getCapturedPieces(game);
  const isCheck = game.inCheck();

  // Clock countdown interval
  useEffect(() => {
    if (!isClockRunning || timerPresetMinutes === 0 || game.isGameOver()) return;
    const timer = setInterval(() => {
      if (game.turn() === 'w') {
        setWhiteTime((prev) => {
          if (prev <= 1) {
            handleTimeOut('w');
            return 0;
          }
          return prev - 1;
        });
      } else {
        setBlackTime((prev) => {
          if (prev <= 1) {
            handleTimeOut('b');
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [isClockRunning, game, timerPresetMinutes]);

  const handleTimeOut = (flaggedColor: 'w' | 'b') => {
    setIsClockRunning(false);
    const playerWon = (flaggedColor === 'b' && playerColor === 'w') || (flaggedColor === 'w' && playerColor === 'b');
    const res = playerWon ? 'win' : 'loss';
    triggerGameOver(res, playerWon ? 'FLAG FALL! YOU WON ON TIME!' : 'TIME EXPIRED! THE CLOCK STRUCK ZERO.');
  };

  // AI Turn trigger - PRO LEVEL, PROPER WORKING CONDITION & RELIABLE SPEED
  useEffect(() => {
    if (game.isGameOver()) {
      setAiThinking(false);
      aiCalculatingRef.current = false;
      if (aiTimeoutRef.current) {
        clearTimeout(aiTimeoutRef.current);
        aiTimeoutRef.current = null;
      }
      return;
    }

    const isAiTurn = (gameMode === 'quick' || gameMode === 'ai') && game.turn() !== playerColor;
    if (!isAiTurn) {
      setAiThinking(false);
      aiCalculatingRef.current = false;
      if (aiTimeoutRef.current) {
        clearTimeout(aiTimeoutRef.current);
        aiTimeoutRef.current = null;
      }
      return;
    }

    // If calculation is already in progress, avoid duplicate triggers
    if (aiCalculatingRef.current) return;

    aiCalculatingRef.current = true;
    setAiThinking(true);

    if (aiTimeoutRef.current) {
      clearTimeout(aiTimeoutRef.current);
    }

    // Realistic yet snappy pro-level response:
    // Spark (600 ELO): 200ms - 320ms (smooth, fast, never hanging)
    // Neo (1200 ELO): 260ms - 380ms
    // Bolt (1600 ELO): 300ms - 420ms
    // Queen Aurelia / Shadow / GM-X: 340ms - 480ms
    const baseDelay = selectedAI.difficulty === 'very_easy' 
      ? 200 
      : selectedAI.difficulty === 'easy' 
        ? 260 
        : 320;
    const thinkDelay = baseDelay + Math.random() * 120;

    aiTimeoutRef.current = setTimeout(() => {
      try {
        const gameCopy = new Chess(game.fen());
        const aiMove = getAIMove(gameCopy, selectedAI.difficulty);
        if (aiMove) {
          gameCopy.move(aiMove);
          setGame(gameCopy);
          setLastMove({ from: aiMove.from as Square, to: aiMove.to as Square });

          if (aiMove.captured) {
            soundManager.playCapture();
          } else {
            soundManager.playMove();
          }

          if (gameCopy.inCheck()) {
            soundManager.playCheck();
            pickRandomQuote(selectedAI.quotes.check);
          }

          checkEndConditions(gameCopy);
        }
      } catch (err) {
        console.error('AI Move calculation error:', err);
      } finally {
        aiCalculatingRef.current = false;
        setAiThinking(false);
        aiTimeoutRef.current = null;
      }
    }, thinkDelay);

    return () => {
      // Do not clear timeout on normal state re-renders to prevent canceling AI move!
    };
  }, [game.fen(), gameMode, playerColor, selectedAI]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (aiTimeoutRef.current) {
        clearTimeout(aiTimeoutRef.current);
      }
    };
  }, []);

  const checkEndConditions = (currentGame: Chess) => {
    if (!currentGame.isGameOver()) return;
    setIsClockRunning(false);
    if (currentGame.isCheckmate()) {
      soundManager.playCheckmate();
      const winner = currentGame.turn() === 'w' ? 'b' : 'w';
      const playerWon = winner === playerColor;
      if (playerWon) {
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
        pickRandomQuote(selectedAI.quotes.loss);
        triggerGameOver('win', 'CHECKMATE! YOU CONQUERED THE BOARD!');
      } else {
        pickRandomQuote(selectedAI.quotes.win);
        triggerGameOver('loss', 'THE KING HAS FALLEN. READY FOR A REMATCH?');
      }
    } else if (currentGame.isDraw()) {
      let reason = 'A PERFECT STALEMATE';
      if (currentGame.isThreefoldRepetition()) reason = 'DRAW BY THREEFOLD REPETITION';
      if (currentGame.isInsufficientMaterial()) reason = 'DRAW BY INSUFFICIENT MATERIAL';
      triggerGameOver('draw', reason);
    }
  };

  const triggerGameOver = (result: 'win' | 'loss' | 'draw', title: string) => {
    const xp = result === 'win' ? 150 : result === 'draw' ? 60 : 30;
    recordGameResult({
      mode: gameMode,
      opponent: gameMode === 'local' ? 'Local Friend' : selectedAI.name,
      result,
      reason: title,
      movesCount: game.history().length,
      pgn: game.pgn(),
      playerColor
    });
    if (result === 'win') {
      updateMissionProgress('win_game', 1);
    }
    setGameOverResult({
      isOpen: true,
      result,
      title,
      subtitle: result === 'win' ? 'Brilliant tactical performance!' : 'Honor in battle. Review and strike back!',
      xpGained: xp
    });
  };

  const pickRandomQuote = (quotes: string[]) => {
    if (!quotes || quotes.length === 0) return;
    const q = quotes[Math.floor(Math.random() * quotes.length)];
    setAiMessage(q);
  };

  const handleSquareClick = (sq: Square) => {
    if (game.isGameOver() || aiThinking) return;

    if (selectedSquare) {
      if (selectedSquare === sq) {
        setSelectedSquare(null);
        setLegalMoves([]);
        return;
      }
      const clickedPiece = game.get(sq);
      if (clickedPiece && clickedPiece.color === game.turn()) {
        setSelectedSquare(sq);
        const moves = game.moves({ square: sq, verbose: true });
        setLegalMoves(moves.map((m) => m.to));
        soundManager.playClick();
        return;
      }
      const piece = game.get(selectedSquare);
      const isPawnPromotion =
        piece?.type === 'p' &&
        ((piece.color === 'w' && sq.endsWith('8')) || (piece.color === 'b' && sq.endsWith('1')));
      if (isPawnPromotion) {
        setPendingPromotion({ from: selectedSquare, to: sq });
        return;
      }
      makePlayerMove(selectedSquare, sq);
    } else {
      const piece = game.get(sq);
      if (piece && piece.color === game.turn()) {
        if ((gameMode === 'quick' || gameMode === 'ai') && piece.color !== playerColor) {
          return;
        }
        setSelectedSquare(sq);
        const moves = game.moves({ square: sq, verbose: true });
        setLegalMoves(moves.map((m) => m.to));
        soundManager.playClick();
      }
    }
  };

  const makePlayerMove = (from: Square, to: Square, promotionPiece: 'q' | 'r' | 'b' | 'n' = 'q') => {
    try {
      const gameCopy = new Chess(game.fen());
      const move = gameCopy.move({ from, to, promotion: promotionPiece });
      if (move) {
        const analysis = analyzeMove(game, move, playerColor === 'w');
        setCoachFeedback(analysis);

        if (move.captured) {
          soundManager.playCapture();
        } else {
          soundManager.playMove();
        }
        if (gameCopy.inCheck()) {
          soundManager.playCheck();
        }
        setGame(gameCopy);
        setLastMove({ from, to });
        setSelectedSquare(null);
        setLegalMoves([]);
        setActiveHint(null);
        checkEndConditions(gameCopy);
      }
    } catch {
      setSelectedSquare(null);
      setLegalMoves([]);
    }
  };

  const handleSelectPromotion = (piece: 'q' | 'r' | 'b' | 'n') => {
    if (pendingPromotion) {
      makePlayerMove(pendingPromotion.from, pendingPromotion.to, piece);
      setPendingPromotion(null);
    }
  };

  const handleGetHint = () => {
    soundManager.playClick();
    const hint = getMoveHint(game);
    if (hint) {
      setActiveHint(hint.explanation);
      setSelectedSquare(hint.move.from as Square);
      const moves = game.moves({ square: hint.move.from as Square, verbose: true });
      setLegalMoves(moves.map((m) => m.to));
    }
  };

  const handleUndo = () => {
    if (game.history().length === 0 || aiThinking) return;
    if (aiTimeoutRef.current) {
      clearTimeout(aiTimeoutRef.current);
      aiTimeoutRef.current = null;
    }
    aiCalculatingRef.current = false;
    setAiThinking(false);
    soundManager.playClick();
    const gameCopy = new Chess(game.fen());
    if (gameMode === 'quick' || gameMode === 'ai') {
      gameCopy.undo();
      if (gameCopy.turn() !== playerColor) {
        gameCopy.undo();
      }
    } else {
      gameCopy.undo();
    }
    setGame(gameCopy);
    setSelectedSquare(null);
    setLegalMoves([]);
    setLastMove(null);
  };

  const handleRestart = () => {
    if (aiTimeoutRef.current) {
      clearTimeout(aiTimeoutRef.current);
      aiTimeoutRef.current = null;
    }
    aiCalculatingRef.current = false;
    setAiThinking(false);
    soundManager.playClick();
    setGame(new Chess());
    setSelectedSquare(null);
    setLegalMoves([]);
    setLastMove(null);
    setGameOverResult(null);
    setCoachFeedback(null);
    setActiveHint(null);
    if (timerPresetMinutes > 0) {
      setWhiteTime(timerPresetMinutes * 60);
      setBlackTime(timerPresetMinutes * 60);
      setIsClockRunning(true);
    }
  };

  const handleResign = () => {
    soundManager.playClick();
    triggerGameOver('loss', 'RESIGNED. REGROUP AND CONQUER NEXT TIME!');
  };

  const formatClock = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 flex flex-col ${
      isDark ? 'bg-[#070305] text-slate-100' : 'bg-slate-100 text-slate-900'
    }`}>
      {/* Royal Premier light sweep effect */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-20">
        <div className="w-1/3 h-full bg-gradient-to-r from-transparent via-amber-500/10 to-transparent skew-x-[-25deg] animate-royal-sweep" />
        <div className="w-1/4 h-full bg-gradient-to-r from-transparent via-red-500/12 to-transparent skew-x-[-30deg] animate-premier-sweep" />
      </div>

      {/* Top Gaming Bar */}
      <header className={`sticky top-0 z-30 backdrop-blur-xl border-b px-4 py-2.5 transition-colors ${
        isDark ? 'bg-slate-900/90 border-white/10' : 'bg-white/90 border-slate-200 shadow-sm'
      }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          
          {/* Back to Hub & Mode Title */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              id="btn-return-hub"
              onClick={onExitToHub}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors border ${
                isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-white/10' : 'bg-slate-200 hover:bg-slate-300 text-slate-800 border-slate-300'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Hub</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              <h1 className="text-sm sm:text-base font-display font-bold tracking-wide truncate max-w-[150px] sm:max-w-none">
                {gameMode === 'local' ? 'Pass & Play (2 Players)' : `vs ${selectedAI.name} (${selectedAI.title})`}
              </h1>
            </div>
          </div>

          {/* Controls: Light/Dark Mode, 3D/2D, Theme, Sound, Music, Stats */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* LIGHT / DARK MODE TOGGLE */}
            <button
              type="button"
              id="toggle-theme-mode"
              onClick={toggleTheme}
              className={`p-2 rounded-xl border transition-all flex items-center gap-1 text-xs font-semibold ${
                isDark
                  ? 'bg-slate-800 hover:bg-slate-700 text-amber-400 border-white/10 shadow-sm'
                  : 'bg-amber-100 hover:bg-amber-200 text-amber-800 border-amber-300 shadow-sm'
              }`}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              <span className="hidden sm:inline font-tech text-[11px] uppercase">{isDark ? 'Light' : 'Dark'}</span>
            </button>

            {/* 3D / 2D Toggle */}
            <button
              type="button"
              id="toggle-view-mode"
              onClick={() => {
                soundManager.playClick();
                setViewMode((prev) => (prev === '3d' ? '2d' : '3d'));
              }}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-tech font-bold border flex items-center gap-1 shadow-sm ${
                isDark ? 'bg-slate-800 hover:bg-slate-700 text-red-400 border-red-500/40' : 'bg-red-50 hover:bg-red-100 text-red-700 border-red-300'
              }`}
              title="Switch between 3D WebGL and 2D Tournament view"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{viewMode.toUpperCase()}</span>
            </button>

            {/* Board Theme Selector - Royal & Premier Floating Popover */}
            <div className="relative">
              <button
                type="button"
                id="btn-board-theme-toggle"
                onClick={() => {
                  setIsThemeMenuOpen((prev) => !prev);
                  soundManager.playClick();
                }}
                className={`p-1.5 sm:px-3 sm:py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all shadow-sm ${
                  isThemeMenuOpen
                    ? 'border-amber-400/80 bg-amber-500/15 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                    : isDark
                      ? 'bg-slate-800/90 hover:bg-slate-700 text-slate-200 border-white/10'
                      : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-300'
                }`}
                title="Change Board Theme"
              >
                {/* Active Theme Mini 2x2 Swatch */}
                {(() => {
                  const currentThm = BOARD_THEME_CONFIGS.find((c) => c.id === boardTheme) || BOARD_THEME_CONFIGS[0];
                  return (
                    <div
                      className="w-3.5 h-3.5 rounded grid grid-cols-2 grid-rows-2 border overflow-hidden shrink-0"
                      style={{ borderColor: currentThm.borderColor }}
                    >
                      <div style={{ backgroundColor: currentThm.lightColor }} />
                      <div style={{ backgroundColor: currentThm.darkColor }} />
                      <div style={{ backgroundColor: currentThm.darkColor }} />
                      <div style={{ backgroundColor: currentThm.lightColor }} />
                    </div>
                  );
                })()}
                <Palette className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden md:inline capitalize font-medium">{boardTheme}</span>
                <span className="text-[9px] font-tech text-amber-500 font-bold ml-0.5">PALETTE</span>
              </button>

              {/* Royal Floating Theme Popover */}
              {isThemeMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsThemeMenuOpen(false)}
                  />
                  <div
                    className={`absolute right-0 top-full mt-2 w-72 sm:w-80 z-50 rounded-2xl border p-3.5 shadow-[0_20px_60px_rgba(0,0,0,0.7)] backdrop-blur-2xl transition-all animate-in fade-in zoom-in-95 duration-150 ${
                      isDark
                        ? 'bg-[#0e0709]/95 border-amber-500/30 text-white'
                        : 'bg-white/95 border-amber-500/30 text-slate-900'
                    }`}
                  >
                    {/* Popover Header */}
                    <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                          <Sparkles className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <h4 className="font-display font-bold text-xs tracking-wider uppercase text-amber-400">
                            BOARD PALETTES
                          </h4>
                          <p className="text-[10px] text-slate-400">
                            Instant 3D & 2D Theme Switch
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsThemeMenuOpen(false)}
                        className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Themes Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-80 overflow-y-auto pr-1">
                      {BOARD_THEME_CONFIGS.map((thm) => {
                        const isSelected = boardTheme === thm.id;
                        return (
                          <button
                            key={thm.id}
                            type="button"
                            onClick={() => {
                              setBoardTheme(thm.id);
                              soundManager.playClick();
                              setIsThemeMenuOpen(false);
                            }}
                            className={`p-2 rounded-xl text-left border flex items-center gap-2.5 transition-all group ${
                              isSelected
                                ? 'bg-gradient-to-r from-red-600/30 to-amber-600/25 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                                : isDark
                                  ? 'bg-slate-900/60 hover:bg-slate-800/80 border-white/5 hover:border-white/20'
                                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            {/* 2x2 Board Preview Swatch */}
                            <div
                              className="w-7 h-7 rounded-lg grid grid-cols-2 grid-rows-2 shrink-0 border overflow-hidden shadow-inner"
                              style={{ borderColor: thm.borderColor }}
                            >
                              <div style={{ backgroundColor: thm.lightColor }} />
                              <div style={{ backgroundColor: thm.darkColor }} />
                              <div style={{ backgroundColor: thm.darkColor }} />
                              <div style={{ backgroundColor: thm.lightColor }} />
                            </div>

                            {/* Theme Details */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <span className={`text-xs font-bold truncate ${
                                  isSelected ? 'text-amber-400' : isDark ? 'text-slate-200' : 'text-slate-800'
                                }`}>
                                  {thm.name}
                                </span>
                                {isSelected && (
                                  <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                )}
                              </div>
                              <span className="text-[9px] text-slate-400 block truncate">
                                {thm.tag}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Sound Toggle */}
            <button
              type="button"
              onClick={() => {
                const next = !soundOn;
                setSoundOn(next);
                soundManager.setSoundEnabled(next);
              }}
              className={`p-1.5 sm:p-2 rounded-xl border transition-colors ${
                soundOn
                  ? isDark ? 'bg-slate-800 border-white/10 text-slate-200' : 'bg-white border-slate-300 text-slate-700'
                  : 'bg-red-500/10 border-red-500/30 text-red-500'
              }`}
              title={soundOn ? 'Mute SFX' : 'Enable SFX'}
            >
              {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-red-500" />}
            </button>

            {/* Ambient Music */}
            <button
              type="button"
              onClick={() => {
                const next = !musicOn;
                setMusicOn(next);
                soundManager.setMusicEnabled(next);
              }}
              className={`p-1.5 sm:p-2 rounded-xl border transition-colors ${
                musicOn
                  ? 'bg-red-500/20 border-red-500/50 text-red-500 animate-pulse'
                  : isDark ? 'bg-slate-800 border-white/10 text-slate-400' : 'bg-white border-slate-300 text-slate-500'
              }`}
              title={musicOn ? 'Stop Ambient Music' : 'Start Ambient Synth Music'}
            >
              <Music className="w-4 h-4" />
            </button>

            {/* Player Stats Modal */}
            <button
              type="button"
              onClick={onOpenStats}
              className={`p-1.5 sm:p-2 rounded-xl border transition-colors ${
                isDark ? 'bg-slate-800 hover:bg-slate-700 border-white/10 text-amber-400' : 'bg-white hover:bg-slate-50 border-slate-300 text-amber-600'
              }`}
              title="Player Stats & Achievements"
            >
              <Trophy className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Gaming Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-2 sm:p-4 grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        
        {/* Left Side: Opponent Info, Board Stage, Clocks */}
        <div className="lg:col-span-8 flex flex-col gap-3">
          
          {/* Top Player Card (Black / AI) */}
          <div className={`flex items-center justify-between p-3 rounded-2xl border shadow-lg transition-colors ${
            isDark ? 'bg-slate-900/85 border-white/10' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center text-xl shadow-md text-white">
                {gameMode === 'local' ? '👤' : selectedAI.avatar}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display font-bold text-sm sm:text-base">
                    {gameMode === 'local' ? player2Name : selectedAI.name}
                  </span>
                  {gameMode !== 'local' && (
                    <span className="text-[10px] font-tech font-bold uppercase px-2 py-0.5 rounded-full bg-red-500/20 text-red-500 border border-red-500/30">
                      {selectedAI.rating} ELO
                    </span>
                  )}
                  {aiThinking && (
                    <span className="text-[11px] text-red-400 font-tech animate-pulse flex items-center gap-1">
                      <Cpu className="w-3 h-3 animate-spin" /> Fast Thinking...
                    </span>
                  )}
                </div>
                {/* Captured White pieces */}
                <div className="flex items-center gap-1 text-xs text-slate-400 font-mono mt-0.5">
                  {captured.whiteCaptured.map((p, i) => (
                    <span key={i} className="font-bold">{p.toUpperCase()}</span>
                  ))}
                  {captured.advantage < 0 && (
                    <span className="text-emerald-500 font-bold ml-1">+{Math.abs(captured.advantage)}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Black Clock */}
            {timerPresetMinutes > 0 && (
              <div className={`px-3 py-1.5 rounded-xl font-mono text-base sm:text-lg font-bold border transition-colors ${
                game.turn() === 'b'
                  ? 'bg-red-600 text-white border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]'
                  : isDark ? 'bg-slate-950 text-slate-300 border-white/10' : 'bg-slate-100 text-slate-700 border-slate-300'
              }`}>
                {formatClock(blackTime)}
              </div>
            )}
          </div>

          {/* The Arena Chessboard (3D or 2D) */}
          <div className="relative w-full aspect-square max-h-[640px] flex items-center justify-center">
            {viewMode === '3d' ? (
              <ThreeChessBoard
                game={game}
                theme={boardTheme}
                pieceStyle={pieceStyle}
                playerColor={playerColor}
                selectedSquare={selectedSquare}
                legalMoves={legalMoves}
                lastMove={lastMove}
                isCheck={isCheck}
                onSquareClick={handleSquareClick}
                disabled={aiThinking}
              />
            ) : (
              <ChessBoard2D
                game={game}
                theme={boardTheme}
                pieceStyle={pieceStyle}
                playerColor={playerColor}
                selectedSquare={selectedSquare}
                legalMoves={legalMoves}
                lastMove={lastMove}
                isCheck={isCheck}
                showCoordinates={true}
                attackedSquares={showAttacks ? getMovableSquares(game) : []}
                onSquareClick={handleSquareClick}
                disabled={aiThinking}
              />
            )}

            {/* Check overlay alert banner */}
            {isCheck && !game.isGameOver() && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 px-4 py-1.5 rounded-full bg-red-600/90 text-white font-tech font-bold text-xs uppercase tracking-widest shadow-xl animate-bounce flex items-center gap-1.5 border border-red-400">
                <ShieldAlert className="w-4 h-4" /> CHECK!
              </div>
            )}

            {/* Active Hint Banner */}
            {activeHint && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 max-w-[90%] px-4 py-2 rounded-xl bg-amber-500 text-black font-semibold text-xs shadow-2xl flex items-center gap-2 border border-yellow-200">
                <Lightbulb className="w-4 h-4 flex-shrink-0" />
                <span>{activeHint}</span>
              </div>
            )}
          </div>

          {/* Bottom Player Card (White / User) */}
          <div className={`flex items-center justify-between p-3 rounded-2xl border shadow-lg transition-colors ${
            isDark ? 'bg-slate-900/85 border-white/10' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-xl shadow-md text-black">
                👑
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display font-bold text-sm sm:text-base">
                    {gameMode === 'local' ? player1Name : 'You (Guest Master)'}
                  </span>
                  <span className="text-[10px] font-tech font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-500 border border-emerald-500/30">
                    WHITE
                  </span>
                </div>
                {/* Captured Black pieces */}
                <div className="flex items-center gap-1 text-xs text-slate-400 font-mono mt-0.5">
                  {captured.blackCaptured.map((p, i) => (
                    <span key={i} className="font-bold">{p.toUpperCase()}</span>
                  ))}
                  {captured.advantage > 0 && (
                    <span className="text-emerald-500 font-bold ml-1">+{captured.advantage}</span>
                  )}
                </div>
              </div>
            </div>

            {/* White Clock */}
            {timerPresetMinutes > 0 && (
              <div className={`px-3 py-1.5 rounded-xl font-mono text-base sm:text-lg font-bold border transition-colors ${
                game.turn() === 'w'
                  ? 'bg-red-600 text-white border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]'
                  : isDark ? 'bg-slate-950 text-slate-300 border-white/10' : 'bg-slate-100 text-slate-700 border-slate-300'
              }`}>
                {formatClock(whiteTime)}
              </div>
            )}
          </div>

          {/* Tactical Action Bar: Undo, Hint, Flip, Restart, Resign */}
          <div className={`flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-2xl border transition-colors ${
            isDark ? 'bg-slate-900/60 border-white/10' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                id="btn-undo-move"
                onClick={handleUndo}
                className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
                  isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-white/5' : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
                }`}
                title="Take back last move"
              >
                <Undo2 className="w-4 h-4 text-red-500" />
                <span>Undo</span>
              </button>
              <button
                type="button"
                id="btn-get-hint"
                onClick={handleGetHint}
                className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
                  isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-white/5' : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
                }`}
                title="Get smart move suggestion"
              >
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <span>Hint</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  setPlayerColor((prev) => (prev === 'w' ? 'b' : 'w'));
                }}
                className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
                  isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-white/5' : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
                }`}
                title="Flip board perspective"
              >
                <RotateCcw className="w-4 h-4 text-cyan-500" />
                <span className="hidden sm:inline">Flip</span>
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                id="btn-restart-game"
                onClick={handleRestart}
                className="px-3 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1.5 shadow transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>New Game</span>
              </button>
              <button
                type="button"
                id="btn-resign-game"
                onClick={handleResign}
                className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-rose-500/30"
              >
                <Flag className="w-4 h-4" />
                <span>Resign</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Pro AI Challengers, Smart Coach, AI Speech, Move History */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          
          {/* SWITCH PRO AI CHALLENGER - HIGHLIGHTED AS REQUESTED */}
          {(gameMode === 'quick' || gameMode === 'ai') && (
            <div className={`p-4 rounded-2xl border shadow-lg space-y-2 transition-colors ${
              isDark ? 'bg-slate-900/85 border-red-500/30' : 'bg-white border-red-200'
            }`}>
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-xs uppercase tracking-wider text-red-500 flex items-center gap-1.5">
                  <Cpu className="w-4 h-4" /> PRO AI CHALLENGERS
                </h3>
                <span className="text-[10px] font-tech text-slate-400">INSTANT SPEED</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {AI_OPPONENTS.map((opp) => (
                  <button
                    key={opp.id}
                    type="button"
                    onClick={() => {
                      if (aiTimeoutRef.current) {
                        clearTimeout(aiTimeoutRef.current);
                        aiTimeoutRef.current = null;
                      }
                      aiCalculatingRef.current = false;
                      setAiThinking(false);
                      setSelectedAI(opp);
                      setAiMessage(opp.intro);
                      soundManager.playClick();
                    }}
                    className={`p-2 rounded-xl text-center flex flex-col items-center gap-1 border transition-all ${
                      selectedAI.id === opp.id
                        ? 'bg-red-600/20 border-red-500 text-red-400 font-bold shadow-md'
                        : isDark ? 'bg-slate-800/60 border-white/5 text-slate-400 hover:text-white' : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span className="text-base">{opp.avatar}</span>
                    <span className="text-[11px] font-semibold truncate w-full">{opp.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* AI Character Speech Bubble */}
          {gameMode !== 'local' && (
            <div className={`p-3.5 rounded-2xl border shadow-lg flex items-start gap-3 transition-colors ${
              isDark ? 'bg-gradient-to-r from-slate-900 to-red-950/30 border-red-500/20' : 'bg-red-50/70 border-red-200'
            }`}>
              <div className="w-9 h-9 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-lg flex-shrink-0">
                {selectedAI.avatar}
              </div>
              <div className="space-y-1">
                <div className="text-[11px] font-tech text-red-500 uppercase font-bold flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" /> {selectedAI.name}
                </div>
                <p className="text-xs italic leading-relaxed">
                  "{aiMessage}"
                </p>
              </div>
            </div>
          )}

          {/* Smart Chess Coach Card */}
          <div className={`p-4 rounded-2xl border shadow-lg space-y-2 transition-colors ${
            isDark ? 'bg-slate-900/85 border-white/10' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-amber-500">✨</span>
                <h3 className="font-display font-bold text-xs uppercase tracking-wider text-amber-500">
                  Smart Chess Coach
                </h3>
              </div>
              {coachFeedback && (
                <span className={`text-[10px] font-tech font-bold px-2 py-0.5 rounded-full uppercase ${
                  coachFeedback.type === 'brilliant' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' :
                  coachFeedback.type === 'great' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' :
                  coachFeedback.type === 'blunder' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' :
                  'bg-slate-800 text-slate-300'
                }`}>
                  {coachFeedback.type}
                </span>
              )}
            </div>
            <p className="text-xs leading-relaxed min-h-[36px]">
              {coachFeedback ? coachFeedback.comment : 'Make your move! The coach analyzes every tactical decision in real time.'}
            </p>
          </div>

          {/* Beginner Mode Tools */}
          <div className={`p-4 rounded-2xl border shadow-lg space-y-3 transition-colors ${
            isDark ? 'bg-slate-900/85 border-white/10' : 'bg-white border-slate-200'
          }`}>
            <h3 className="font-display font-bold text-xs uppercase tracking-wider text-slate-400">
              Beginner Assistance
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  setShowAttacks(!showAttacks);
                }}
                className={`p-2 rounded-xl text-xs font-semibold border transition-all ${
                  showAttacks
                    ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                    : isDark ? 'bg-slate-800/80 border-white/5 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
                }`}
              >
                {showAttacks ? 'Hide Attacks' : 'Show Attacks'}
              </button>
              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  setShowMovable(!showMovable);
                  if (!showMovable) {
                    const movable = getMovableSquares(game);
                    setLegalMoves(movable);
                  } else {
                    setLegalMoves([]);
                  }
                }}
                className={`p-2 rounded-xl text-xs font-semibold border transition-all ${
                  showMovable
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                    : isDark ? 'bg-slate-800/80 border-white/5 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
                }`}
              >
                What Can I Move?
              </button>
            </div>
          </div>

          {/* Move History Log */}
          <div className={`p-4 rounded-2xl border shadow-lg space-y-2 flex-1 flex flex-col min-h-[160px] transition-colors ${
            isDark ? 'bg-slate-900/85 border-white/10' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-tech uppercase font-bold tracking-wider">Move Record</span>
              <span className="font-mono">{Math.ceil(game.history().length / 2)} moves</span>
            </div>
            <div className={`flex-1 overflow-y-auto max-h-[200px] rounded-xl p-2 font-mono text-xs space-y-1 ${
              isDark ? 'bg-slate-950/80' : 'bg-slate-50'
            }`}>
              {game.history().reduce<Array<{ num: number; white: string; black?: string }>>((acc, move, idx) => {
                if (idx % 2 === 0) {
                  acc.push({ num: Math.floor(idx / 2) + 1, white: move });
                } else {
                  acc[acc.length - 1].black = move;
                }
                return acc;
              }, []).map((row) => (
                <div key={row.num} className="grid grid-cols-12 py-0.5 px-1 hover:bg-red-500/10 rounded">
                  <span className="col-span-3 text-slate-400">{row.num}.</span>
                  <span className="col-span-5 font-semibold text-red-500">{row.white}</span>
                  <span className="col-span-4 text-slate-400">{row.black || ''}</span>
                </div>
              ))}
              {game.history().length === 0 && (
                <div className="text-center py-6 text-slate-400 text-xs">
                  Moves will appear here as you play.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Pawn Promotion Modal */}
      {pendingPromotion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-[fadeIn_0.2s_ease-out]">
          <div className={`max-w-sm w-full border-2 border-red-500/50 rounded-3xl p-6 shadow-2xl text-center space-y-4 ${
            isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'
          }`}>
            <h3 className="text-xl font-display font-bold">
              Promote Your Pawn
            </h3>
            <p className="text-xs text-slate-400">
              Choose which piece to elevate your champion pawn into:
            </p>
            <div className="grid grid-cols-4 gap-2 pt-2">
              {[
                { type: 'q', name: 'Queen', icon: '♛' },
                { type: 'r', name: 'Rook', icon: '♜' },
                { type: 'b', name: 'Bishop', icon: '♝' },
                { type: 'n', name: 'Knight', icon: '♞' },
              ].map((p) => (
                <button
                  key={p.type}
                  type="button"
                  onClick={() => handleSelectPromotion(p.type as 'q' | 'r' | 'b' | 'n')}
                  className={`p-3.5 rounded-2xl border text-3xl transition-all shadow-md flex flex-col items-center gap-1 ${
                    isDark ? 'bg-slate-800 hover:bg-red-600 hover:text-white border-white/10' : 'bg-slate-100 hover:bg-red-600 hover:text-white border-slate-200'
                  }`}
                >
                  <span>{p.icon}</span>
                  <span className="text-[10px] font-semibold">{p.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Game Over Modal */}
      {gameOverResult?.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-[fadeIn_0.3s_ease-out]">
          <div className={`max-w-md w-full border-2 border-red-500/60 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(239,68,68,0.4)] text-center space-y-5 ${
            isDark ? 'bg-gradient-to-b from-slate-900 to-slate-950 text-white' : 'bg-white text-slate-900'
          }`}>
            <div className="w-20 h-20 mx-auto rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center text-4xl shadow-lg animate-bounce">
              {gameOverResult.result === 'win' ? '🏆' : gameOverResult.result === 'loss' ? '💔' : '🤝'}
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-display font-extrabold">
                {gameOverResult.title}
              </h2>
              <p className="text-sm text-slate-400">
                {gameOverResult.subtitle}
              </p>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-500 font-tech font-bold text-sm">
              <Award className="w-4 h-4" /> +{gameOverResult.xpGained} XP EARNED
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={handleRestart}
                className="py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-sm shadow-lg transition-transform active:scale-95 font-display"
              >
                Play Rematch
              </button>
              <button
                type="button"
                onClick={onExitToHub}
                className={`py-3 px-4 rounded-xl font-semibold text-sm border transition-colors ${
                  isDark ? 'bg-slate-800 hover:bg-slate-700 text-white border-white/10' : 'bg-slate-200 hover:bg-slate-300 text-slate-800 border-slate-300'
                }`}
              >
                Return to Hub
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
