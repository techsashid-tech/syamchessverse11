import React from 'react';
import { Chess, Square } from 'chess.js';
import { BoardTheme, PieceStyle } from '../types/chess';

interface ChessBoard2DProps {
  game: Chess;
  theme: BoardTheme;
  pieceStyle: PieceStyle;
  playerColor: 'w' | 'b';
  selectedSquare: Square | null;
  legalMoves: string[];
  lastMove: { from: Square; to: Square } | null;
  isCheck: boolean;
  showCoordinates?: boolean;
  attackedSquares?: Square[];
  defendedSquares?: Square[];
  onSquareClick: (sq: Square) => void;
  disabled?: boolean;
}

const PIECE_SVGS: Record<string, string> = {
  'w-k': `<svg viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22.5 11.63V6M20 8h5" stroke-linejoin="miter"/><path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5" fill="#fff" stroke-linecap="butt"/><path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V23v-1.5c-2.5-7.5-12-10.5-16-4-3 6 6 10.5 6 10.5v7" fill="#fff"/><path d="M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0"/></g></svg>`,
  'w-q': `<svg viewBox="0 0 45 45"><g fill="#fff" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zm16.5-4.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zm16.5 4.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM11 20a2 2 0 1 1-4 0 2 2 0 1 1 4 0zm27 0a2 2 0 1 1-4 0 2 2 0 1 1 4 0z"/><path d="M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11V11l-5.5 13.5-3-15-3 15-5.5-14V25L7 14l2 12z" stroke-linecap="butt"/><path d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 2-1 .5-2.5 0 0 0-1.5-1.5-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z"/><path d="M11.5 30c3.5-1 18.5-1 22 0m-21.5 3.5c3.5-1 18.5-1 22 0m-21 3.5c3.5-1 18.5-1 22 0"/></g></svg>`,
  'w-r': `<svg viewBox="0 0 45 45"><g fill="#fff" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 39h27v-3H9v3zm3-3v-4h21v4H12zm-1-22V9h4v2h5V9h5v2h5V9h4v5" stroke-linecap="butt"/><path d="M34 14l-3 3H14l-3-3"/><path d="M31 17v12.5H14V17" stroke-linecap="butt" stroke-linejoin="miter"/><path d="M31 29.5l1.5 2.5h-20l1.5-2.5"/><path d="M11 14h23"/></g></svg>`,
  'w-b': `<svg viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><g fill="#fff" stroke-linecap="butt"><path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.35.49-2.32.47-3-.5 1.35-1.46 3-2 3-2z"/><path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z"/><path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z"/></g><path d="M17.5 26h10M15 30h15m-7.5-14.5v5M20 18h5" stroke-linejoin="miter"/></g></svg>`,
  'w-n': `<svg viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" fill="#fff"/><path d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0-.693 2.012-3 2.5-.5.1-1.5-.5-1.5-1 0-1.39 1.5-2 1.5-3 0-1.5-1.458-2.5-2.5-2.5-1.5 0-3 1.5-3 2.5 0 1.5 1.5 2.5 1.5 4 0 1.5-1.5 2.5-1.5 4 0 1.5 1 2 2.5 2 2.5 0 3-1.5 5-1.5 1.5 0 2 1 3 2.5 2 3 7.5 3 13 3" fill="#fff"/><path d="M9.5 25.5a.5.5 0 1 1-1 0 .5.5 0 1 1 1 0zm5.5 5a.5.5 0 1 1-1 0 .5.5 0 1 1 1 0z" fill="#000"/><path d="M24.55 10.4s-.45 1.45-1.55 1.7c-1.05.2-2.05-.6-2.05-.6s.7 1.45.2 2.2c-.45.75-1.85.9-1.85.9s.75.8.5 1.6c-.2.75-1.15 1.1-1.15 1.1s.8.6.6 1.4c-.2.75-.85 1.25-.85 1.25" stroke="#000"/></g></svg>`,
  'w-p': `<svg viewBox="0 0 45 45"><path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" fill="#fff" stroke="#000" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  'b-k': `<svg viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22.5 11.63V6M20 8h5" stroke-linejoin="miter"/><path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5" fill="#1e293b" stroke-linecap="butt"/><path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V23v-1.5c-2.5-7.5-12-10.5-16-4-3 6 6 10.5 6 10.5v7" fill="#1e293b"/><path d="M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0" stroke="#fff"/></g></svg>`,
  'b-q': `<svg viewBox="0 0 45 45"><g fill="#1e293b" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zm16.5-4.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zm16.5 4.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM11 20a2 2 0 1 1-4 0 2 2 0 1 1 4 0zm27 0a2 2 0 1 1-4 0 2 2 0 1 1 4 0z"/><path d="M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11V11l-5.5 13.5-3-15-3 15-5.5-14V25L7 14l2 12z" stroke-linecap="butt"/><path d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 2-1 .5-2.5 0 0 0-1.5-1.5-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z"/><path d="M11.5 30c3.5-1 18.5-1 22 0m-21.5 3.5c3.5-1 18.5-1 22 0m-21 3.5c3.5-1 18.5-1 22 0" stroke="#fff"/></g></svg>`,
  'b-r': `<svg viewBox="0 0 45 45"><g fill="#1e293b" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 39h27v-3H9v3zm3-3v-4h21v4H12zm-1-22V9h4v2h5V9h5v2h5V9h4v5" stroke-linecap="butt"/><path d="M34 14l-3 3H14l-3-3"/><path d="M31 17v12.5H14V17" stroke-linecap="butt" stroke-linejoin="miter"/><path d="M31 29.5l1.5 2.5h-20l1.5-2.5"/><path d="M11 14h23" stroke="#fff"/></g></svg>`,
  'b-b': `<svg viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><g fill="#1e293b" stroke-linecap="butt"><path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.35.49-2.32.47-3-.5 1.35-1.46 3-2 3-2z"/><path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z"/><path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z"/></g><path d="M17.5 26h10M15 30h15m-7.5-14.5v5M20 18h5" stroke="#fff" stroke-linejoin="miter"/></g></svg>`,
  'b-n': `<svg viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" fill="#1e293b"/><path d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0-.693 2.012-3 2.5-.5.1-1.5-.5-1.5-1 0-1.39 1.5-2 1.5-3 0-1.5-1.458-2.5-2.5-2.5-1.5 0-3 1.5-3 2.5 0 1.5 1.5 2.5 1.5 4 0 1.5-1.5 2.5-1.5 4 0 1.5 1 2 2.5 2 2.5 0 3-1.5 5-1.5 1.5 0 2 1 3 2.5 2 3 7.5 3 13 3" fill="#1e293b"/><path d="M9.5 25.5a.5.5 0 1 1-1 0 .5.5 0 1 1 1 0zm5.5 5a.5.5 0 1 1-1 0 .5.5 0 1 1 1 0z" fill="#fff"/><path d="M24.55 10.4s-.45 1.45-1.55 1.7c-1.05.2-2.05-.6-2.05-.6s.7 1.45.2 2.2c-.45.75-1.85.9-1.85.9s.75.8.5 1.6c-.2.75-1.15 1.1-1.15 1.1s.8.6.6 1.4c-.2.75-.85 1.25-.85 1.25" stroke="#fff"/></g></svg>`,
  'b-p': `<svg viewBox="0 0 45 45"><path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" fill="#1e293b" stroke="#000" stroke-width="1.5" stroke-linecap="round"/></svg>`
};

const THEME_2D_CLASSES: Record<BoardTheme, { light: string; dark: string; border: string }> = {
  crimson: { light: 'bg-red-200/90', dark: 'bg-red-950', border: 'border-red-600 shadow-[0_0_30px_rgba(239,68,68,0.4)]' },
  classic: { light: 'bg-[#f0d9b5]', dark: 'bg-[#b58863]', border: 'border-[#4a2c11]' },
  neon: { light: 'bg-cyan-900/60', dark: 'bg-slate-950', border: 'border-cyan-500 shadow-[0_0_25px_rgba(6,182,212,0.4)]' },
  space: { light: 'bg-slate-800/80', dark: 'bg-slate-950', border: 'border-indigo-500/50' },
  volcanic: { light: 'bg-amber-900/50', dark: 'bg-[#180f0c]', border: 'border-orange-600' },
  candy: { light: 'bg-pink-100', dark: 'bg-cyan-200', border: 'border-pink-300' },
  ice: { light: 'bg-cyan-50', dark: 'bg-sky-400', border: 'border-cyan-600' },
  royal: { light: 'bg-[#faf8f5]', dark: 'bg-[#1f2430]', border: 'border-amber-400' },
  forest: { light: 'bg-[#cedbb2]', dark: 'bg-[#44633f]', border: 'border-[#243321]' }
};

export const ChessBoard2D: React.FC<ChessBoard2DProps> = ({
  game,
  theme,
  playerColor,
  selectedSquare,
  legalMoves,
  lastMove,
  isCheck,
  showCoordinates = true,
  attackedSquares = [],
  defendedSquares = [],
  onSquareClick,
  disabled = false
}) => {
  const isWhite = playerColor === 'w';
  const themeStyle = THEME_2D_CLASSES[theme] || THEME_2D_CLASSES.crimson;
  const board = game.board();

  const ranks = isWhite ? [8, 7, 6, 5, 4, 3, 2, 1] : [1, 2, 3, 4, 5, 6, 7, 8];
  const files = isWhite ? ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] : ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a'];

  const checkKingSquare = (): Square | null => {
    if (!isCheck) return null;
    const turn = game.turn();
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = board[r][c];
        if (p && p.type === 'k' && p.color === turn) {
          return `${String.fromCharCode(97 + c)}${8 - r}` as Square;
        }
      }
    }
    return null;
  };

  const kingInCheck = checkKingSquare();

  return (
    <div className="relative w-full aspect-square max-w-[620px] mx-auto select-none rounded-2xl overflow-hidden shadow-2xl p-2 md:p-3 bg-slate-900/90 backdrop-blur-xl border border-red-500/20">
      <div className={`w-full h-full grid grid-cols-8 grid-rows-8 rounded-xl overflow-hidden border-2 ${themeStyle.border}`}>
        {ranks.map((rank, rIdx) =>
          files.map((file, fIdx) => {
            const sq = `${file}${rank}` as Square;
            const fileNum = file.charCodeAt(0) - 97;
            const rankNum = rank - 1;
            const isLightSquare = (fileNum + rankNum) % 2 !== 0;
            const piece = game.get(sq);
            const isSelected = selectedSquare === sq;
            const isLegalDest = legalMoves.includes(sq);
            const isLastMoveFrom = lastMove?.from === sq;
            const isLastMoveTo = lastMove?.to === sq;
            const isKingInCheck = kingInCheck === sq;
            const isAttacked = attackedSquares.includes(sq);
            const isDefended = defendedSquares.includes(sq);
            const pieceKey = piece ? `${piece.color}-${piece.type}` : null;
            const svgContent = pieceKey ? PIECE_SVGS[pieceKey] : null;

            return (
              <div
                key={sq}
                id={`sq-${sq}`}
                onClick={() => !disabled && onSquareClick(sq)}
                className={`relative flex items-center justify-center cursor-pointer transition-colors duration-150 ${
                  isLightSquare ? themeStyle.light : themeStyle.dark
                } ${isSelected ? '!bg-red-500/80 shadow-inner' : ''} ${
                  isLastMoveFrom || isLastMoveTo ? '!bg-red-600/30' : ''
                } ${isKingInCheck ? '!bg-rose-600/90 animate-pulse' : ''}`}
              >
                {showCoordinates && fIdx === 0 && (
                  <span className={`absolute top-0.5 left-1 text-[10px] font-mono font-bold pointer-events-none select-none ${
                    isLightSquare ? 'text-black/60' : 'text-white/60'
                  }`}>
                    {rank}
                  </span>
                )}
                {showCoordinates && rIdx === 7 && (
                  <span className={`absolute bottom-0.5 right-1 text-[10px] font-mono font-bold pointer-events-none select-none ${
                    isLightSquare ? 'text-black/60' : 'text-white/60'
                  }`}>
                    {file}
                  </span>
                )}
                {isAttacked && (
                  <div className="absolute inset-0 bg-rose-500/20 pointer-events-none border border-rose-500/40" />
                )}
                {isDefended && (
                  <div className="absolute inset-0 bg-blue-500/20 pointer-events-none border border-blue-500/40" />
                )}
                {isLegalDest && (
                  <div className="absolute z-10 flex items-center justify-center pointer-events-none">
                    {piece ? (
                      <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full border-4 border-emerald-500 animate-pulse bg-emerald-500/20" />
                    ) : (
                      <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-emerald-500/80 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                    )}
                  </div>
                )}
                {svgContent && (
                  <div
                    className={`w-4/5 h-4/5 flex items-center justify-center z-10 transition-transform duration-100 ${
                      isSelected ? '-translate-y-1.5 scale-110 drop-shadow-[0_8px_12px_rgba(0,0,0,0.5)]' : 'hover:scale-105'
                    }`}
                    dangerouslySetInnerHTML={{ __html: svgContent }}
                  />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
