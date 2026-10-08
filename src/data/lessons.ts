import { LessonLevel } from '../types/chess';

export const CHESS_SCHOOL_LEVELS: LessonLevel[] = [
  {
    id: 1,
    title: 'Meet the Pieces',
    subtitle: 'The Royal Court of 64 Squares',
    badge: '♟️',
    description: 'Chess is played on an 8x8 grid between two armies: White and Black. The 6 piece types are King, Queen, Rook, Bishop, Knight, and Pawn.',
    fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    interactiveGoal: 'Make your very first move by advancing a center pawn two squares forward (e4 or d4).',
    targetMoves: ['e4', 'd4'],
    explanation: 'Terrific! Advancing a central pawn opens pathways for your queen and bishop while controlling the center.',
    xpReward: 50
  },
  {
    id: 2,
    title: 'How Pieces Move',
    subtitle: 'Diagonal, Straight, and L-Shapes',
    badge: '♞',
    description: 'Rooks move along straight ranks and files. Bishops move diagonally on their color. Knights jump in an "L" shape (two squares then one). Queens combine Rook and Bishop powers!',
    fen: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1',
    interactiveGoal: 'Respond by developing your black knight into the action with Nf6 or Nc6.',
    targetMoves: ['Nf6', 'Nc6', 'e5'],
    explanation: 'Awesome! Knights are unique because they can jump over other pieces.',
    xpReward: 50
  },
  {
    id: 3,
    title: 'Capturing',
    subtitle: 'Removing Opposing Forces',
    badge: '⚔️',
    description: 'When an enemy piece stands on a square your piece can move to, you can capture it and remove it from the board.',
    fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 3',
    interactiveGoal: 'Capture the undefended black pawn on e5 with your knight (Nxe5).',
    targetMoves: ['Nxe5'],
    explanation: 'Brilliant capture! Always look for undefended pieces before your opponent protects them.',
    xpReward: 75
  },
  {
    id: 4,
    title: 'Check',
    subtitle: 'The King Under Direct Threat',
    badge: '🛡️',
    description: 'When a piece directly attacks the enemy King, it is called Check. The King is never captured—it must immediately escape, block, or capture the attacker!',
    fen: 'rnbqkbnr/ppppp1pp/8/5p2/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
    interactiveGoal: 'Deliver a powerful early check with Qh5+!',
    targetMoves: ['Qh5+'],
    explanation: 'Check! The Black king is attacked along the open e8-h5 diagonal.',
    xpReward: 75
  },
  {
    id: 5,
    title: 'Checkmate',
    subtitle: 'The Ultimate Victory Condition',
    badge: '👑',
    description: 'When the King is in check and cannot escape, block the attack, or capture the checking piece, it is Checkmate and the game is won!',
    fen: 'r1bqkb1r/pppp1ppp/2n5/4p3/2B1n3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 0 4',
    interactiveGoal: 'Deliver the knockout checkmate blow with Qxf7#!',
    targetMoves: ['Qxf7#'],
    explanation: 'CHECKMATE! The Black king has zero legal moves and cannot capture your queen because of bishop protection.',
    xpReward: 100
  },
  {
    id: 6,
    title: 'Castling',
    subtitle: 'King Safety and Rook Activation',
    badge: '🏰',
    description: 'Castling is a special move where the King moves two squares toward a rook, and the rook hops over to the square the king crossed.',
    fen: 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 5',
    interactiveGoal: 'Castle your king safely kingside with O-O!',
    targetMoves: ['O-O'],
    explanation: 'Castling complete! Your monarch is safely nestled behind a wall of pawns and your rook is mobilized.',
    xpReward: 100
  },
  {
    id: 7,
    title: 'Opening Principles',
    subtitle: 'Center, Development, King Safety',
    badge: '🧭',
    description: 'Golden rules of the opening: 1. Control the center (e4, d4, e5, d5). 2. Develop knights and bishops. 3. Castle early. 4. Don\'t move the same piece twice.',
    fen: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
    interactiveGoal: 'Develop your kingside knight actively to Nf3, attacking the e5 pawn.',
    targetMoves: ['Nf3'],
    explanation: 'Textbook chess! Nf3 attacks the e5 pawn while preparing for kingside castling.',
    xpReward: 100
  },
  {
    id: 8,
    title: 'Tactics: Forks & Pins',
    subtitle: 'Double Attacks and Frozen Pieces',
    badge: '⚡',
    description: 'A Fork attacks two enemy pieces at once. A Pin immobilizes an enemy piece because moving it would expose a more valuable piece behind it.',
    fen: 'r1bqkb1r/pppp1ppp/2n5/4p3/2B5/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 4',
    interactiveGoal: 'Strike at the weak f7 square with Ng5, threatening a fork on f7!',
    targetMoves: ['Ng5', 'd4'],
    explanation: 'Great tactical pressure! The bishop on c4 and knight on g5 combine forces against f7.',
    xpReward: 125
  },
  {
    id: 9,
    title: 'Middle Game Mastery',
    subtitle: 'Outposts, Open Files, and Weaknesses',
    badge: '🎯',
    description: 'In the middlegame, formulate plans: seize open files with your rooks, plant knights on protected outposts, and target pawn weaknesses.',
    fen: 'r4rk1/ppp2ppp/2n1pn2/3p4/3P4/2N1PN2/PPP2PPP/R2Q1RK1 w - - 0 9',
    interactiveGoal: 'Occupy the open c-file or central square by playing Ne5 or Rc1.',
    targetMoves: ['Ne5', 'Rc1'],
    explanation: 'Excellent strategic play! Anchoring pieces on central outposts paralyzes opponent plans.',
    xpReward: 125
  },
  {
    id: 10,
    title: 'Endgame Essentials',
    subtitle: 'King Activity and Pawn Promotion',
    badge: '🏆',
    description: 'When most pieces are exchanged, the King becomes an aggressive attacking warrior! Push passed pawns to the 8th rank to promote into Queens.',
    fen: '8/4k3/8/4P3/8/4K3/8/8 w - - 0 1',
    interactiveGoal: 'Step your king forward into the opposition with Ke4 or Kd4.',
    targetMoves: ['Ke4', 'Kd4'],
    explanation: 'Perfect! In pawn endgames, king activity and taking the opposition is the key to victory.',
    xpReward: 150
  },
  {
    id: 11,
    title: 'Advanced Strategy',
    subtitle: 'Prophylaxis and Pawn Breaks',
    badge: '🧠',
    description: "Prophylaxis means anticipating your opponent's desires and shutting them down before they can even start. Combine this with timely pawn breaks.",
    fen: 'r1bqr1k1/ppp2ppp/2np1n2/4p3/2PPP3/2N2N2/PP2BPPP/R1BQK2R w KQ - 0 8',
    interactiveGoal: 'Close the center or advance the pawn break with d5!',
    targetMoves: ['d5'],
    explanation: 'Outstanding! Pushing d5 gains vast space and kicks the black knight away from its ideal square.',
    xpReward: 175
  },
  {
    id: 12,
    title: 'Become a Chess Master',
    subtitle: 'The Synthesis of Art and Calculation',
    badge: '✨',
    description: 'You now command the fundamentals, tactics, strategy, and endgame wisdom. Every game you play is an original masterpiece waiting to unfold!',
    fen: '6k1/5ppp/8/8/8/8/4RPPP/6K1 w - - 0 1',
    interactiveGoal: 'Deliver the championship checkmate on e8!',
    targetMoves: ['Re8#'],
    explanation: 'HONOR TO THE MASTER! You have graduated Chess School. Step into the Arena and claim your glory!',
    xpReward: 250
  }
];

export const CHESS_LESSONS = CHESS_SCHOOL_LEVELS;
