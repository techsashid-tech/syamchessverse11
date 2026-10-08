export type GameMode = 
  | 'quick' 
  | 'ai' 
  | 'local' 
  | 'online' 
  | 'puzzle' 
  | 'daily' 
  | 'school' 
  | 'openings' 
  | 'endgame' 
  | 'sandbox';

export type BoardTheme = 
  | 'classic' 
  | 'neon' 
  | 'space' 
  | 'volcanic' 
  | 'candy' 
  | 'ice' 
  | 'royal' 
  | 'forest'
  | 'crimson';

export type PieceStyle = 
  | 'classic' 
  | 'royal' 
  | 'cyber' 
  | 'crystal' 
  | 'cartoon' 
  | 'space';

export type AIDifficulty = 'very_easy' | 'easy' | 'medium' | 'hard' | 'very_hard' | 'expert';

export interface AIOpponent {
  id: string;
  name: string;
  avatar: string;
  title: string;
  difficulty: AIDifficulty;
  rating: number;
  personality: string;
  intro: string;
  quotes: {
    start: string[];
    goodMove: string[];
    playerAdvantage: string[];
    aiAdvantage: string[];
    check: string[];
    win: string[];
    loss: string[];
  };
}

export interface PlayerStats {
  gamesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
  puzzlesSolved: number;
  puzzleStreak: number;
  maxPuzzleStreak: number;
  xp: number;
  level: number;
  fastestWinSeconds: number | null;
  longestGameMoves: number;
  favoriteOpening: string;
  dailyChallengeCompletedDate: string | null;
  achievements: string[];
  history: GameHistoryRecord[];
}

export interface GameHistoryRecord {
  id: string;
  date: string;
  mode: GameMode;
  opponent: string;
  result: 'win' | 'loss' | 'draw' | 'aborted';
  reason: string;
  movesCount: number;
  pgn: string;
  playerColor: 'w' | 'b';
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  xp: number;
}

export interface DailyMission {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  xpReward: number;
  completed: boolean;
}

export interface Puzzle {
  id: string;
  title: string;
  fen: string;
  moves: string[]; // sequence of UCI or SAN moves: [aiMove, playerMove, aiMove, playerMove...] or starting with player turn
  playerColor: 'w' | 'b';
  difficulty: 'easy' | 'medium' | 'hard' | 'pro' | 'grandmaster';
  rating: number;
  theme: string;
  description: string;
  hint: string;
  explanation: string;
}

export interface PlayerProfile {
  username: string;
  title: string;
  level: number;
  xp: number;
  completedLessons?: string[];
  stats: PlayerStats;
  achievements: string[];
  dailyMissions: DailyMission[];
  history: GameHistoryRecord[];
}

export interface OpeningGuide {
  id: string;
  name: string;
  eco: string;
  moves: string[];
  color: 'w' | 'b';
  summary: string;
  description?: string;
  difficulty?: string;
  mainIdeas: string[];
  keyIdeas?: string[];
  beginnerTips: string;
  mistakesToAvoid: string[];
}

export interface Lesson {
  id: string;
  level: number;
  title: string;
  category: string;
  instructions: string;
  goal: string;
  fen: string;
  solutionMove?: string;
  xpReward: number;
}

export interface LessonLevel {
  id: number;
  title: string;
  subtitle: string;
  badge: string;
  description: string;
  fen: string;
  interactiveGoal: string;
  targetMoves: string[];
  explanation: string;
  xpReward: number;
}

export interface EndgameDrill {
  id: string;
  title: string;
  category: string;
  description?: string;
  fen: string;
  turn: 'w' | 'b';
  goal: string;
  instructions: string;
  targetFenOrCondition: string;
  hint: string;
  xpReward?: number;
}

export interface MoveAnalysis {
  san: string;
  type: 'brilliant' | 'great' | 'good' | 'inaccuracy' | 'mistake' | 'blunder';
  comment: string;
}

export interface ClockSettings {
  initialMinutes: number;
  incrementSeconds: number;
}
