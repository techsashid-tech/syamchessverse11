import React, { useState } from 'react';
import {
  BookOpen, Lightbulb, Shield, Award, CheckCircle2,
  HelpCircle, ArrowLeft, Sun, Moon, Sparkles, ChevronRight,
  Target, Swords, Crown, Zap, AlertTriangle, Copy, Check
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { soundManager } from '../utils/audio';

interface BeginnerGuideProps {
  onBack: () => void;
  onPlayNow: () => void;
}

export const BeginnerGuide: React.FC<BeginnerGuideProps> = ({ onBack, onPlayNow }) => {
  const { themeMode, toggleTheme } = useTheme();
  const isDark = themeMode === 'dark';

  const [activeTab, setActiveTab] = useState<'rules' | 'tips' | 'quiz'>('rules');
  const [copied, setCopied] = useState<boolean>(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  const pieces = [
    {
      name: 'King',
      symbol: '♔',
      value: 'Infinite (Priceless)',
      move: 'Moves exactly 1 square in any direction (horizontal, vertical, or diagonal).',
      tip: 'The entire game revolves around protecting your king. Never leave him in the center!',
      special: 'Can perform Castling with an unmoved Rook.',
    },
    {
      name: 'Queen',
      symbol: '♕',
      value: '9 Points',
      move: 'Moves any number of squares diagonally, horizontally, or vertically.',
      tip: 'The most powerful attacking weapon on the board. Avoid bringing her out too early where she can be chased.',
      special: 'Cannot jump over other pieces.',
    },
    {
      name: 'Rook',
      symbol: '♖',
      value: '5 Points',
      move: 'Moves any number of squares horizontally or vertically along ranks and files.',
      tip: 'Rooks thrive on open files and on the 7th rank (attacking enemy base pawns).',
      special: 'Participates in Castling with the King.',
    },
    {
      name: 'Bishop',
      symbol: '♗',
      value: '3 Points',
      move: 'Moves any number of squares diagonally. Always stays on its starting square color (light or dark).',
      tip: 'The "Bishop Pair" working together controls huge swaths of the board across both colors.',
      special: 'Long-range sniper piece.',
    },
    {
      name: 'Knight',
      symbol: '♘',
      value: '3 Points',
      move: 'Moves in an "L-shape" (2 squares in one direction, then 1 square perpendicular).',
      tip: 'The ONLY piece on the chessboard that can jump over other pieces! Excels in closed positions.',
      special: 'Unmatched fork creator.',
    },
    {
      name: 'Pawn',
      symbol: '♙',
      value: '1 Point',
      move: 'Moves forward 1 square (or 2 on its very first move). Captures 1 square diagonally forward.',
      tip: 'Pawns are the soul of chess! They define structure and can never move backward.',
      special: 'Capable of En Passant and Pawn Promotion to Queen.',
    },
  ];

  const specialRules = [
    {
      title: '1. Castling (Kingside & Queenside)',
      tag: 'King Safety',
      desc: 'A simultaneous move where the King moves two squares toward a Rook, and the Rook hops over the King. Castling Kingside is O-O, Queenside is O-O-O.',
      rules: [
        'Neither the King nor the participating Rook has moved before.',
        'All squares between the King and Rook must be empty.',
        'The King cannot be in check, nor pass through or land on any square attacked by an enemy piece.',
      ],
    },
    {
      title: '2. En Passant ("In Passing")',
      tag: 'Pawn Special',
      desc: 'If an enemy pawn moves forward 2 squares and lands adjacent to your pawn on the same rank, you may capture that pawn diagonally as if it had only moved 1 square.',
      rules: [
        'Must be executed immediately on the very next turn, or the right to do so is permanently lost.',
        'Only applies to pawn-capturing-pawn.',
      ],
    },
    {
      title: '3. Pawn Promotion',
      tag: 'Endgame Power',
      desc: 'When a pawn successfully marches across the entire board and touches the 8th rank (or 1st rank for Black), it immediately transforms into a Queen, Rook, Bishop, or Knight.',
      rules: [
        'Almost always promoted to Queen ("Queening") for maximum firepower.',
        'You can have multiple Queens on the board simultaneously.',
      ],
    },
    {
      title: '4. Check, Checkmate & Stalemate',
      tag: 'Outcomes',
      desc: 'Understanding the crucial difference between winning and drawing:',
      rules: [
        'Check: The King is under direct attack. You MUST escape (Move king, Block attack, or Capture attacker).',
        'Checkmate (1-0 or 0-1): The King is in check and NO legal escape exists. Game ends with victory!',
        'Stalemate (1/2 - 1/2 Draw): The King is NOT in check, but the player has ZERO legal moves anywhere on the board.',
        'Draw by 50-Move Rule or 3-Fold Repetition of position.',
      ],
    },
  ];

  const tipsAndTricks = [
    {
      category: 'The Opening Golden Rules',
      icon: Crown,
      points: [
        {
          title: 'Rule #1: Control the Central 4 Squares',
          text: 'The squares e4, d4, e5, and d5 are high ground. Whoever controls the center controls the game. Start with 1.e4 or 1.d4.',
        },
        {
          title: 'Rule #2: Knights Before Bishops',
          text: 'Knights generally belong on f3 and c3 (or f6 and c6) where they influence the center immediately. Develop them before bishops.',
        },
        {
          title: 'Rule #3: Castle Before Move 10',
          text: 'Safeguard your King into the castle and bring your Rook to the fight before launching aggressive operations.',
        },
        {
          title: 'Rule #4: Do Not Bring Your Queen Out Early',
          text: 'Opponents will develop their minor pieces while repeatedly harassing your queen, winning free tempi and positional supremacy.',
        },
        {
          title: 'Rule #5: Avoid Moving the Same Piece Twice',
          text: 'In the opening, every single move must mobilize a new soldier to battle. Don’t waste moves repositioning one piece.',
        },
      ],
    },
    {
      category: 'Tactical Superweapons',
      icon: Swords,
      points: [
        {
          title: 'The Fork (Double Attack)',
          text: 'A single piece (especially the Knight) strikes two or more undefended enemy targets at once. The opponent can only save one!',
        },
        {
          title: 'The Pin (Immobilization)',
          text: 'A piece cannot move because moving it would expose a higher-value piece behind it (Absolute Pin if the King is behind).',
        },
        {
          title: 'The Skewer (X-Ray Attack)',
          text: 'An attack on a high-value piece (e.g. King or Queen) that is forced to move, exposing a vulnerable piece behind it to capture.',
        },
        {
          title: 'Discovered Attack & Double Check',
          text: 'Moving one piece unmasks a devastating attack from a piece behind it. Double check is virtually unstoppable without moving the King.',
        },
      ],
    },
    {
      category: 'Common Beginner Traps & How to Defeat Them',
      icon: AlertTriangle,
      points: [
        {
          title: "The Scholar's Mate Trap (Defeat in 4 moves)",
          text: 'White plays 1.e4 e5 2.Qh5 Nc6 3.Bc4. They are threatening Qxf7# checkmate! The antidote: play 3...g6! followed by Nf6, driving the Queen away with tempo.',
        },
        {
          title: "Fool's Mate Danger (The 2-Move Blunder)",
          text: 'Never push your f-pawn (f3 or f4) recklessly on moves 1-2. It exposes the fatal e1-h4 diagonal to the enemy queen.',
        },
        {
          title: 'The Fried Liver Attack Defense',
          text: 'If White aims at f7 with Ng5 and Bc4 against Black’s Two Knights Defense, strike back immediately in the center with 1...d5!',
        },
      ],
    },
  ];

  const quizQuestions = [
    {
      question: 'Which is the ONLY piece on the chessboard that can jump over other pieces?',
      options: ['The Bishop', 'The Knight', 'The Pawn', 'The Rook'],
      correct: 1,
      explanation: 'Correct! The Knight moves in an "L-shape" and leaps over obstacles effortlessly.',
    },
    {
      question: 'If a player’s king is NOT in check, but that player has NO legal moves, what is the result?',
      options: ['Loss for that player', 'Checkmate', 'Stalemate (Draw)', 'Extra move allowed'],
      correct: 2,
      explanation: 'Correct! This is a Stalemate, which results in an immediate 1/2 - 1/2 draw.',
    },
    {
      question: 'Can a player castle if their King is currently in Check?',
      options: ['Yes, always', 'No, never while in check', 'Only kingside', 'Only if the rook is safe'],
      correct: 1,
      explanation: 'Correct! You can never castle out of check, through check, or into check.',
    },
    {
      question: 'What is the recommended move for Black when White threatens Scholar’s Mate with Bc4 and Qh5?',
      options: ['3...Nf6 (blunder)', '3...g6! (blocking the queen)', '3...Ke7', '3...h6'],
      correct: 1,
      explanation: 'Correct! 3...g6 safely blocks the queen from attacking f7 and prepares Bg7.',
    },
  ];

  const handleSelectAnswer = (qIdx: number, optIdx: number) => {
    if (quizSubmitted) return;
    soundManager.playClick();
    setQuizAnswers({ ...quizAnswers, [qIdx]: optIdx });
  };

  const handleCopyCheatSheet = () => {
    const text = `MASTER CHESS QUICK CHEAT SHEET:
1. Piece Values: Pawn (1), Knight (3), Bishop (3), Rook (5), Queen (9), King (Priceless).
2. Opening Rules: Control center (e4/d4), develop knights before bishops, castle early, don't move queen too early.
3. Special Rules: Castling requires clear path & no check. En Passant must happen immediately. Promotion on 8th rank.
4. Tactics: Fork (attacks 2 pieces), Pin (piece trapped in front of king/queen), Skewer (higher piece attacked first).
5. King Safety: Never leave King uncastled when center opens!`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    soundManager.playSuccess();
    setTimeout(() => setCopied(false), 2500);
  };

  const score = Object.entries(quizAnswers).filter(([qIdx, ans]) => quizQuestions[Number(qIdx)].correct === ans).length;

  return (
    <div className={`min-h-screen p-4 max-w-7xl mx-auto flex flex-col transition-colors duration-300 ${
      isDark ? 'bg-[#090704] text-slate-100' : 'bg-[#faf8f5] text-slate-900'
    }`}>
      {/* Light Sweep */}
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
                <BookOpen className="w-5 h-5" />
              </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-200 to-amber-400">
                BEGINNER'S MASTER GUIDE
              </span>
            </h1>
            <p className="text-xs text-amber-400/80 font-tech">
              Official FIDE Rules • Tactical Weapons • Master Tips & Tricks
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleCopyCheatSheet}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              copied
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                : isDark
                  ? 'bg-slate-900 hover:bg-slate-800 text-amber-300 border-amber-500/30'
                  : 'bg-white hover:bg-amber-50 text-slate-800 border-amber-300'
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
            {copied ? 'Copied Cheat Sheet!' : 'Copy Cheat Sheet'}
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            className={`p-2 rounded-xl border transition-all ${
              isDark ? 'bg-slate-900 text-amber-400 border-amber-500/30' : 'bg-amber-100 text-amber-900 border-amber-300'
            }`}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={onPlayNow}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 font-tech font-extrabold text-xs shadow-[0_0_20px_rgba(245,158,11,0.35)] border border-amber-300 hover:scale-102 transition-transform"
          >
            PLAY VS PRO AI
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="relative z-20 flex gap-2 border-b border-amber-500/20 pb-3 mb-6">
        {[
          { id: 'rules', label: 'Rules & Regulations', icon: Shield },
          { id: 'tips', label: 'Tips, Tricks & Traps', icon: Lightbulb },
          { id: 'quiz', label: 'Beginner Mastery Quiz', icon: HelpCircle },
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
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-tech font-bold transition-all border ${
                isActive
                  ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 border-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.3)] scale-102'
                  : isDark
                    ? 'bg-slate-900/80 text-slate-300 border-white/10 hover:border-amber-500/40 hover:text-white'
                    : 'bg-white text-slate-700 border-amber-200 hover:bg-amber-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      <div className="relative z-20 space-y-8 flex-1">
        {activeTab === 'rules' && (
          <div className="space-y-8">
            {/* Pieces Grid */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-200 to-amber-400 flex items-center gap-2">
                  <Crown className="w-5 h-5 text-amber-400" />
                  The 6 Chess Pieces & How They Move
                </h2>
                <span className="text-xs font-mono text-amber-400">Total Force: 39 Points Each</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pieces.map((p) => (
                  <div
                    key={p.name}
                    className={`p-5 rounded-3xl border shadow-lg transition-all hover:scale-[1.01] ${
                      isDark ? 'bg-[#0d0905]/90 border-amber-500/25' : 'bg-white border-amber-200'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-4xl text-amber-400 select-none font-serif">{p.symbol}</span>
                        <div>
                          <h3 className="font-display font-bold text-lg text-amber-300">{p.name}</h3>
                          <span className="text-[11px] font-tech text-slate-400 font-semibold">{p.value}</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                        {p.special}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed mt-2 mb-3">
                      {p.move}
                    </p>
                    <div className={`p-2.5 rounded-xl border text-[11px] flex items-start gap-2 ${
                      isDark ? 'bg-black/50 border-amber-500/15 text-amber-200/90' : 'bg-amber-50 border-amber-200 text-amber-900'
                    }`}>
                      <Zap className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                      <span>{p.tip}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Special Rules */}
            <div>
              <h2 className="text-xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-200 to-amber-400 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-amber-400" />
                Special Chess Rules & Protocols
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {specialRules.map((rule) => (
                  <div
                    key={rule.title}
                    className={`p-5 rounded-3xl border shadow-lg space-y-3 ${
                      isDark ? 'bg-[#0d0905]/90 border-amber-500/25' : 'bg-white border-amber-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-display font-bold text-base text-amber-300">{rule.title}</h3>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        {rule.tag}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{rule.desc}</p>
                    <ul className="space-y-1.5 pt-2 border-t border-amber-500/15">
                      {rule.rules.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-400">
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tips' && (
          <div className="space-y-6">
            {tipsAndTricks.map((sec) => {
              const Icon = sec.icon;
              return (
                <div
                  key={sec.category}
                  className={`p-6 rounded-3xl border shadow-xl space-y-4 ${
                    isDark ? 'bg-[#0d0905]/90 border-amber-500/25' : 'bg-white border-amber-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      <Icon className="w-5 h-5" />
                    </span>
                    <h2 className="text-xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-200 to-amber-400">
                      {sec.category}
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    {sec.points.map((pt, idx) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-2xl border transition-colors ${
                          isDark ? 'bg-black/50 border-white/5 hover:border-amber-500/30' : 'bg-amber-50/60 border-amber-200'
                        }`}
                      >
                        <h3 className="font-display font-bold text-sm text-amber-300 mb-1 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                          {pt.title}
                        </h3>
                        <p className="text-xs text-slate-300 leading-relaxed">{pt.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'quiz' && (
          <div className={`p-6 rounded-3xl border shadow-xl space-y-6 ${
            isDark ? 'bg-[#0d0905]/90 border-amber-500/25' : 'bg-white border-amber-200'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-200 to-amber-400">
                  Beginner Mastery Knowledge Check
                </h2>
                <p className="text-xs text-slate-400">Test your grasp of core rules & tactical survival!</p>
              </div>
              {quizSubmitted && (
                <div className="px-4 py-2 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-300 font-tech font-bold text-sm">
                  SCORE: {score} / {quizQuestions.length} ({score === 4 ? 'Grandmaster Ready!' : 'Keep Practicing!'})
                </div>
              )}
            </div>

            <div className="space-y-6">
              {quizQuestions.map((q, qIdx) => {
                const selectedOpt = quizAnswers[qIdx];
                return (
                  <div key={qIdx} className={`p-4 rounded-2xl border ${
                    isDark ? 'bg-black/50 border-white/5' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <h3 className="font-display font-bold text-sm text-amber-300 mb-3">
                      {qIdx + 1}. {q.question}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options.map((opt, optIdx) => {
                        const isSelected = selectedOpt === optIdx;
                        const isCorrect = q.correct === optIdx;
                        let btnClass = isDark
                          ? 'bg-slate-900 border-white/10 text-slate-300 hover:border-amber-500/40'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-amber-50';

                        if (quizSubmitted) {
                          if (isCorrect) {
                            btnClass = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold';
                          } else if (isSelected && !isCorrect) {
                            btnClass = 'bg-rose-500/20 border-rose-500 text-rose-300';
                          }
                        } else if (isSelected) {
                          btnClass = 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold shadow-sm';
                        }

                        return (
                          <button
                            key={optIdx}
                            type="button"
                            onClick={() => handleSelectAnswer(qIdx, optIdx)}
                            className={`p-3 rounded-xl text-xs text-left border transition-all flex items-center justify-between ${btnClass}`}
                          >
                            <span>{opt}</span>
                            {quizSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                          </button>
                        );
                      })}
                    </div>
                    {quizSubmitted && (
                      <p className="text-xs text-amber-400/90 mt-2 font-tech">
                        💡 {q.explanation}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              {!quizSubmitted ? (
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playSuccess();
                    setQuizSubmitted(true);
                  }}
                  disabled={Object.keys(quizAnswers).length < quizQuestions.length}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 font-tech font-extrabold text-xs shadow-lg disabled:opacity-50"
                >
                  SUBMIT ANSWERS
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setQuizAnswers({});
                    setQuizSubmitted(false);
                    soundManager.playClick();
                  }}
                  className="px-6 py-2.5 rounded-xl bg-slate-800 text-white font-tech font-bold text-xs border border-white/10"
                >
                  RETAKE QUIZ
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
