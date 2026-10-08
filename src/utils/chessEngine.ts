import { Chess, Square, Move } from 'chess.js';
import { AIDifficulty, MoveAnalysis } from '../types/chess';

// Standard piece valuation
const PIECE_VALUES: Record<string, number> = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000,
};

// Positional bonuses (Piece-Square Tables)
const PAWN_TABLE = [
  0,  0,  0,  0,  0,  0,  0,  0,
  50, 50, 50, 50, 50, 50, 50, 50,
  10, 10, 20, 30, 30, 20, 10, 10,
   5,  5, 10, 25, 25, 10,  5,  5,
   0,  0,  0, 20, 20,  0,  0,  0,
   5, -5,-10,  0,  0,-10, -5,  5,
   5, 10, 10,-20,-20, 10, 10,  5,
   0,  0,  0,  0,  0,  0,  0,  0
];

const KNIGHT_TABLE = [
  -50,-40,-30,-30,-30,-30,-40,-50,
  -40,-20,  0,  0,  0,  0,-20,-40,
  -30,  0, 10, 15, 15, 10,  0,-30,
  -30,  5, 15, 20, 20, 15,  5,-30,
  -30,  0, 15, 20, 20, 15,  0,-30,
  -30,  5, 10, 15, 15, 10,  5,-30,
  -40,-20,  0,  5,  5,  0,-20,-40,
  -50,-40,-30,-30,-30,-30,-40,-50,
];

const BISHOP_TABLE = [
  -20,-10,-10,-10,-10,-10,-10,-20,
  -10,  0,  0,  0,  0,  0,  0,-10,
  -10,  0,  5, 10, 10,  5,  0,-10,
  -10,  5,  5, 10, 10,  5,  5,-10,
  -10,  0, 10, 10, 10, 10,  0,-10,
  -10, 10, 10, 10, 10, 10, 10,-10,
  -10,  5,  0,  0,  0,  0,  5,-10,
  -20,-10,-10,-10,-10,-10,-10,-20,
];

const ROOK_TABLE = [
    0,  0,  0,  0,  0,  0,  0,  0,
    5, 10, 10, 10, 10, 10, 10,  5,
   -5,  0,  0,  0,  0,  0,  0, -5,
   -5,  0,  0,  0,  0,  0,  0, -5,
   -5,  0,  0,  0,  0,  0,  0, -5,
   -5,  0,  0,  0,  0,  0,  0, -5,
   -5,  0,  0,  0,  0,  0,  0, -5,
    0,  0,  0,  5,  5,  0,  0,  0
];

const QUEEN_TABLE = [
  -20,-10,-10, -5, -5,-10,-10,-20,
  -10,  0,  0,  0,  0,  0,  0,-10,
  -10,  0,  5,  5,  5,  5,  0,-10,
   -5,  0,  5,  5,  5,  5,  0, -5,
    0,  0,  5,  5,  5,  5,  0, -5,
  -10,  5,  5,  5,  5,  5,  0,-10,
  -10,  0,  5,  0,  0,  0,  0,-10,
  -20,-10,-10, -5, -5,-10,-10,-20
];

const KING_TABLE_MID = [
  -30,-40,-40,-50,-50,-40,-40,-30,
  -30,-40,-40,-50,-50,-40,-40,-30,
  -30,-40,-40,-50,-50,-40,-40,-30,
  -30,-40,-40,-50,-50,-40,-40,-30,
  -20,-30,-30,-40,-40,-30,-30,-20,
  -10,-20,-20,-20,-20,-20,-20,-10,
   20, 20,  0,  0,  0,  0, 20, 20,
   20, 30, 10,  0,  0, 10, 30, 20
];

function getSquareIndex(sq: string, isWhite: boolean): number {
  const file = sq.charCodeAt(0) - 97; // 0..7
  const rank = parseInt(sq[1], 10) - 1; // 0..7
  const row = isWhite ? 7 - rank : rank;
  return row * 8 + file;
}

// Board evaluation function
export function evaluateBoard(game: Chess): number {
  if (game.isCheckmate()) {
    return game.turn() === 'w' ? -99999 : 99999;
  }
  if (game.isDraw()) {
    return 0;
  }

  let score = 0;
  const board = game.board();

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (!piece) continue;
      const baseVal = PIECE_VALUES[piece.type] || 0;
      const sq = `${String.fromCharCode(97 + c)}${8 - r}`;
      let posBonus = 0;
      const isW = piece.color === 'w';
      const sqIdx = getSquareIndex(sq, isW);

      switch (piece.type) {
        case 'p':
          posBonus = PAWN_TABLE[sqIdx] || 0;
          break;
        case 'n':
          posBonus = KNIGHT_TABLE[sqIdx] || 0;
          break;
        case 'b':
          posBonus = BISHOP_TABLE[sqIdx] || 0;
          break;
        case 'r':
          posBonus = ROOK_TABLE[sqIdx] || 0;
          break;
        case 'q':
          posBonus = QUEEN_TABLE[sqIdx] || 0;
          break;
        case 'k':
          posBonus = KING_TABLE_MID[sqIdx] || 0;
          break;
      }
      const total = baseVal + posBonus;
      score += isW ? total : -total;
    }
  }
  return score;
}

// Alpha-Beta Minimax with fast pruning
function minimax(
  game: Chess,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean
): number {
  if (depth === 0 || game.isGameOver()) {
    return evaluateBoard(game);
  }

  const moves = game.moves({ verbose: true });
  if (moves.length === 0) {
    return evaluateBoard(game);
  }

  // Fast Move ordering: checks and captures first
  moves.sort((a, b) => {
    let aVal = a.captured ? PIECE_VALUES[a.captured] : 0;
    let bVal = b.captured ? PIECE_VALUES[b.captured] : 0;
    if (a.san.includes('+')) aVal += 50;
    if (b.san.includes('+')) bVal += 50;
    return bVal - aVal;
  });

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of moves) {
      game.move(move);
      const evalScore = minimax(game, depth - 1, alpha, beta, false);
      game.undo();
      maxEval = Math.max(maxEval, evalScore);
      alpha = Math.max(alpha, evalScore);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      game.move(move);
      const evalScore = minimax(game, depth - 1, alpha, beta, true);
      game.undo();
      minEval = Math.min(minEval, evalScore);
      beta = Math.min(beta, evalScore);
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

// Common opening moves for snappy, realistic master play in the first few plies
const OPENING_BOOK_RESPONSES: Record<string, string[]> = {
  // Common responses to 1. e4
  'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1': ['e5', 'c5', 'e6', 'c6', 'd5', 'Nf6'],
  // Common responses to 1. d4
  'rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq d3 0 1': ['d5', 'Nf6', 'e6', 'c5', 'g6'],
  // Common responses to 1. c4 (English)
  'rnbqkbnr/pppppppp/8/8/2P5/8/PP1PPPPP/RNBQKBNR b KQkq c3 0 1': ['e5', 'Nf6', 'c5', 'e6'],
  // Common responses to 1. Nf3
  'rnbqkbnr/pppppppp/8/8/8/5N2/PPPPPPPP/RNBQKB1R b KQkq - 1 1': ['d5', 'Nf6', 'c5', 'g6'],
  // Common responses to 1. f4 (Bird's Opening - user played f4 in screenshot!)
  'rnbqkbnr/pppppppp/8/8/5P2/8/PPPPP1PP/RNBQKBNR b KQkq f3 0 1': ['d5', 'e5', 'Nf6', 'g6', 'c5'],
};

// Choose best AI move based on difficulty - high-speed & pro-level performance
export function getAIMove(game: Chess, difficulty: AIDifficulty): Move | null {
  const moves = game.moves({ verbose: true });
  if (moves.length === 0) return null;

  const isWhite = game.turn() === 'w';

  // Instant Checkmate in 1 if available
  for (const move of moves) {
    if (move.san.includes('#')) {
      return move;
    }
  }

  // Check opening book for instant master-level opening move
  const currentFen = game.fen();
  const bookMoves = OPENING_BOOK_RESPONSES[currentFen];
  if (bookMoves && bookMoves.length > 0) {
    const chosenSan = bookMoves[Math.floor(Math.random() * bookMoves.length)];
    const matchingMove = moves.find((m) => m.san === chosenSan);
    if (matchingMove) return matchingMove;
  }

  // SPARK (Very Easy): Fast and playful, loves attacking and dynamic captures
  if (difficulty === 'very_easy') {
    if (Math.random() < 0.35) {
      const captures = moves.filter((m) => m.captured);
      if (captures.length > 0) return captures[Math.floor(Math.random() * captures.length)];
    }
    return searchBestMove(game, 1, isWhite, 0.2);
  }

  // NEO (Easy): Smart strategic development, plays solid center control quickly
  if (difficulty === 'easy') {
    return searchBestMove(game, 2, isWhite, 0.08);
  }

  // BOLT (Medium): Rapid blitz attacker, checks, forks and fast tactics
  if (difficulty === 'medium') {
    return searchBestMove(game, 2, isWhite, 0.02);
  }

  // QUEEN (Hard): Strong positional squeeze, pro master level
  if (difficulty === 'hard') {
    return searchBestMove(game, 3, isWhite, 0);
  }

  // SHADOW (Very Hard): Sharp tactical precision, ruthless pins & king hunt
  if (difficulty === 'very_hard') {
    return searchBestMove(game, 3, isWhite, 0);
  }

  // GRANDMASTER X (Expert): Fast, top depth calculation, flawless technique
  return searchBestMove(game, 3, isWhite, 0);
}

function searchBestMove(
  game: Chess,
  depth: number,
  isWhite: boolean,
  blunderChance: number = 0
): Move | null {
  const moves = game.moves({ verbose: true });
  if (moves.length === 0) return null;

  if (blunderChance > 0 && Math.random() < blunderChance) {
    return moves[Math.floor(Math.random() * moves.length)];
  }

  // Move sorting: high-value captures and checks first
  moves.sort((a, b) => {
    let aVal = a.captured ? PIECE_VALUES[a.captured] : 0;
    let bVal = b.captured ? PIECE_VALUES[b.captured] : 0;
    if (a.san.includes('+')) aVal += 40;
    if (b.san.includes('+')) bVal += 40;
    return bVal - aVal;
  });

  let bestMove = moves[0];
  let bestValue = isWhite ? -Infinity : Infinity;
  let alpha = -Infinity;
  let beta = Infinity;

  for (const move of moves) {
    game.move(move);
    const score = minimax(game, depth - 1, alpha, beta, !isWhite);
    game.undo();

    if (isWhite) {
      if (score > bestValue) {
        bestValue = score;
        bestMove = move;
      }
      alpha = Math.max(alpha, bestValue);
    } else {
      if (score < bestValue) {
        bestValue = score;
        bestMove = move;
      }
      beta = Math.min(beta, bestValue);
    }
    if (beta <= alpha) break;
  }

  return bestMove;
}

// Compute player move hint
export function getMoveHint(game: Chess): { move: Move; explanation: string } | null {
  const isWhite = game.turn() === 'w';
  const best = searchBestMove(game, 3, isWhite);
  if (!best) return null;

  let reason = '';
  if (best.captured) {
    const pieceNames: Record<string, string> = {
      p: 'pawn', n: 'knight', b: 'bishop', r: 'rook', q: 'queen', k: 'king'
    };
    reason = `Captures opponent's ${pieceNames[best.captured] || 'piece'} on ${best.to}, winning material!`;
  } else if (best.san.includes('+')) {
    reason = `Puts the enemy king in check on ${best.to}, seizing momentum!`;
  } else if (best.san === 'O-O' || best.san === 'O-O-O') {
    reason = `Castles king to safety while activating your rooks!`;
  } else if (best.piece === 'p' && (best.to.includes('4') || best.to.includes('5'))) {
    reason = `Advances central pawn to ${best.to} to command the center!`;
  } else if (best.piece === 'n' || best.piece === 'b') {
    reason = `Develops minor piece to ${best.to} where it exerts high influence!`;
  } else {
    reason = `Improves piece position to ${best.to}, preparing tactical threats!`;
  }

  return { move: best, explanation: reason };
}

// Beginner mode helper: find squares with legal moves
export function getMovableSquares(game: Chess): Square[] {
  const moves = game.moves({ verbose: true });
  const uniqueSquares = new Set<Square>();
  for (const m of moves) {
    uniqueSquares.add(m.from);
  }
  return Array.from(uniqueSquares);
}

// Analyze played move for Smart Chess Coach
export function analyzeMove(gameBefore: Chess, playedMove: Move, isPlayerWhite: boolean): MoveAnalysis {
  const evalBefore = evaluateBoard(gameBefore);
  const testGame = new Chess(gameBefore.fen());
  const best = searchBestMove(testGame, 2, isPlayerWhite);

  let type: MoveAnalysis['type'] = 'good';
  let comment = '';

  const isCheckmate = playedMove.san.includes('#');
  const isCheck = playedMove.san.includes('+');

  if (isCheckmate) {
    type = 'brilliant';
    comment = 'Absolute perfection! Checkmate delivers the ultimate victory!';
    return { san: playedMove.san, type, comment };
  }

  if (best && best.from === playedMove.from && best.to === playedMove.to) {
    if (playedMove.captured === 'q' || isCheck) {
      type = 'brilliant';
      comment = 'Brilliant move! You found the top engine recommendation!';
    } else {
      type = 'great';
      comment = 'Great move! Perfectly aligned with optimal master strategy!';
    }
    return { san: playedMove.san, type, comment };
  }

  testGame.move(playedMove);
  const evalAfter = evaluateBoard(testGame);
  const delta = isPlayerWhite ? evalAfter - evalBefore : evalBefore - evalAfter;

  if (delta < -300) {
    type = 'blunder';
    comment = 'Watch out! That move leaves a piece vulnerable or opens your king.';
  } else if (delta < -120) {
    type = 'mistake';
    comment = 'Missed opportunity. A more active defense was available.';
  } else if (delta < -50) {
    type = 'inaccuracy';
    comment = 'Good effort, though center control could be slightly tighter.';
  } else {
    type = 'good';
    if (playedMove.captured) {
      comment = `Solid capture on ${playedMove.to}! Material gained.`;
    } else if (isCheck) {
      comment = 'Nice check! Forcing the opponent into defense.';
    } else {
      comment = `Solid play on ${playedMove.to}. Developing pieces cleanly.`;
    }
  }

  return { san: playedMove.san, type, comment };
}

// Captured pieces differential
export function getCapturedPieces(game: Chess): { whiteCaptured: string[]; blackCaptured: string[]; advantage: number } {
  const initialPieces: Record<string, number> = { p: 8, n: 2, b: 2, r: 2, q: 1 };
  const currentWhite: Record<string, number> = { p: 0, n: 0, b: 0, r: 0, q: 0 };
  const currentBlack: Record<string, number> = { p: 0, n: 0, b: 0, r: 0, q: 0 };

  const board = game.board();
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (!piece || piece.type === 'k') continue;
      if (piece.color === 'w') {
        currentWhite[piece.type] = (currentWhite[piece.type] || 0) + 1;
      } else {
        currentBlack[piece.type] = (currentBlack[piece.type] || 0) + 1;
      }
    }
  }

  const whiteCaptured: string[] = [];
  const blackCaptured: string[] = [];
  let whitePoints = 0;
  let blackPoints = 0;

  for (const [type, count] of Object.entries(initialPieces)) {
    const blackLost = Math.max(0, count - (currentBlack[type] || 0));
    for (let i = 0; i < blackLost; i++) {
      whiteCaptured.push(type);
      whitePoints += PIECE_VALUES[type] || 0;
    }
    const whiteLost = Math.max(0, count - (currentWhite[type] || 0));
    for (let i = 0; i < whiteLost; i++) {
      blackCaptured.push(type);
      blackPoints += PIECE_VALUES[type] || 0;
    }
  }

  return {
    whiteCaptured,
    blackCaptured,
    advantage: Math.round((whitePoints - blackPoints) / 100),
  };
}
