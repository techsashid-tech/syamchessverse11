import { EndgameDrill } from '../types/chess';

export const ENDGAME_DRILLS: EndgameDrill[] = [
  {
    id: 'kq_vs_k',
    title: 'King + Queen vs King',
    category: 'Mating Technique',
    description: 'Learn the fundamental queen cutoff box technique to drive the enemy king to the rim and deliver checkmate.',
    fen: '8/8/8/4k3/8/8/4Q3/4K3 w - - 0 1',
    turn: 'w',
    goal: 'Checkmate the lone king using the Queen box-constriction technique and bringing your King.',
    instructions: 'Do NOT stalemate! Drive the enemy king to the edge or corner rank, then bring your king up to deliver checkmate.',
    targetFenOrCondition: 'checkmate',
    hint: 'Give check with Qe3+ or Qd3 to shrink the box around the black king.',
    xpReward: 100
  },
  {
    id: 'kr_vs_k',
    title: 'King + Rook vs King',
    category: 'Mating Technique',
    description: 'Master the classic elevator / slicing technique with your rook and king.',
    fen: '8/8/8/4k3/8/8/8/R3K3 w Q - 0 1',
    turn: 'w',
    goal: 'Deliver checkmate with King and Rook by slicing ranks and forcing the enemy king to the perimeter.',
    instructions: 'Build a fence with your rook, meet the enemy king with opposition, and check along ranks until back-rank mate.',
    targetFenOrCondition: 'checkmate',
    hint: 'Cut off the 4th or 5th rank with your rook so the king cannot advance.',
    xpReward: 120
  },
  {
    id: 'opposition',
    title: 'Direct King Opposition',
    category: 'Pawn Endgames',
    description: 'Step into opposition to command key outposts in king and pawn endgames.',
    fen: '8/8/8/4k3/8/4K3/4P3/8 w - - 0 1',
    turn: 'w',
    goal: 'Advance your king and pawn to escort the pawn safely to the 8th rank for promotion.',
    instructions: 'Take the opposition with your king before pushing the pawn! Ke4 maintains key squares.',
    targetFenOrCondition: 'promote',
    hint: 'Move your king to e4 or d4 to take control of key promoting squares.',
    xpReward: 100
  },
  {
    id: 'pawn_promotion',
    title: 'Pawn Promotion Race',
    category: 'Pawn Endgames',
    description: 'Calculated sprint to the 8th rank to queen a champion pawn.',
    fen: '8/8/8/8/8/1k6/1P6/K7 w - - 0 1',
    turn: 'w',
    goal: 'Promote your b2 pawn to a Queen without falling into stalemate.',
    instructions: 'Push the pawn boldly and secure your promotion square.',
    targetFenOrCondition: 'promote',
    hint: 'Advance b4 or b3 to begin the promotion sprint!',
    xpReward: 100
  }
];
