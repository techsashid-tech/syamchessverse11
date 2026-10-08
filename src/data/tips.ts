export interface ChessTip {
  title: string;
  category: 'beginner' | 'intermediate' | 'advanced';
  icon: string;
  concept: string;
  advice: string;
  demonstrationFen: string;
}

export const CHESS_TIPS_DATA: ChessTip[] = [
  {
    title: 'Control the Center',
    category: 'beginner',
    icon: '🎯',
    concept: 'Squares e4, d4, e5, d5 are the focal high ground of the board.',
    advice: 'Pieces placed in the center command twice as many squares as pieces tucked on the rim. "A knight on the rim is dim!"',
    demonstrationFen: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1'
  },
  {
    title: 'Develop Pieces Rapidly',
    category: 'beginner',
    icon: '⚡',
    concept: 'Bring out knights and bishops before launching attacks.',
    advice: 'Do not charge ahead with just your Queen. An army marching together will easily overwhelm an isolated piece.',
    demonstrationFen: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4'
  },
  {
    title: 'Castle Early',
    category: 'beginner',
    icon: '🏰',
    concept: 'Shield your King into the corner and connect your rooks.',
    advice: 'A king stuck in the open center is vulnerable to central pawn breaks and discovered checks. Castle within the first 7 moves.',
    demonstrationFen: 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQ1RK1 b kq - 5 5'
  },
  {
    title: 'Look for Knight Forks',
    category: 'intermediate',
    icon: '🐴',
    concept: 'Attack two high-value pieces simultaneously with a single knight leap.',
    advice: 'Knights are especially deadly because their jumping trajectory cannot be blocked by any interposing piece.',
    demonstrationFen: 'r1b1k2r/pppp1ppp/8/4N3/1b1q4/8/PPP2PPP/RNBQKB1R w KQkq - 0 6'
  },
  {
    title: 'The Power of the Absolute Pin',
    category: 'intermediate',
    icon: '🔒',
    concept: 'Freeze an enemy piece because moving it would expose their King to check.',
    advice: 'Target and add pressure to pinned pieces with your pawns. A pinned piece cannot defend its neighbors.',
    demonstrationFen: 'r1bqk2r/pppp1ppp/2n2n2/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 2 4'
  },
  {
    title: 'Prophylaxis',
    category: 'advanced',
    icon: '🛡️',
    concept: "Thinking from your opponent's shoes: stop their dream plan before it starts.",
    advice: 'Championed by Tigran Petrosian and Anatoly Karpov. Playing small pawn moves like h3 or a3 prevents annoying pins.',
    demonstrationFen: 'r1bq1rk1/ppp2ppp/2n1pn2/3p4/2PP4/2N1PN2/PP3PPP/R1BQKB1R w KQ - 0 6'
  }
];
