import { Achievement, DailyMission } from '../types/chess';

export const ACHIEVEMENTS_LIST: Achievement[] = [
  {
    id: 'first_win',
    name: 'First Checkmate',
    description: 'Deliver your first checkmate against AI or a friend.',
    icon: '🏆',
    xp: 150
  },
  {
    id: 'tactical_warrior',
    name: 'Tactical Warrior',
    description: 'Solve 10 tactical chess puzzles successfully.',
    icon: '⚡',
    xp: 200
  },
  {
    id: 'puzzle_master',
    name: 'Puzzle Master',
    description: 'Achieve a 5-puzzle solving streak without a mistake.',
    icon: '🔥',
    xp: 300
  },
  {
    id: 'streak_5',
    name: '5 Win Streak',
    description: 'Conquer 5 games in a row against AI opponents.',
    icon: '👑',
    xp: 500
  },
  {
    id: 'king_slayer',
    name: 'King Slayer',
    description: 'Defeat Grandmaster X on expert difficulty.',
    icon: '🔮',
    xp: 1000
  },
  {
    id: 'opening_explorer',
    name: 'Opening Explorer',
    description: 'Explore and study 3 different master chess openings.',
    icon: '📖',
    xp: 150
  },
  {
    id: 'school_graduate',
    name: 'Chess Academy Master',
    description: 'Complete all 12 levels in the interactive Chess School.',
    icon: '🎓',
    xp: 600
  },
  {
    id: 'speed_demon',
    name: 'Lightning Striker',
    description: 'Win a blitz or bullet timed game before the clock strikes zero.',
    icon: '⚡',
    xp: 250
  }
];

export const INITIAL_DAILY_MISSIONS: DailyMission[] = [
  {
    id: 'win_game',
    title: 'Conquer the Board',
    description: 'Win 1 game in any game mode.',
    progress: 0,
    target: 1,
    xpReward: 100,
    completed: false
  },
  {
    id: 'solve_puzzles',
    title: 'Tactical Drills',
    description: 'Solve 3 puzzles in the Puzzle Arena.',
    progress: 0,
    target: 3,
    xpReward: 150,
    completed: false
  },
  {
    id: 'study_opening',
    title: 'Theory Specialist',
    description: 'Study 1 master opening in the Opening Explorer.',
    progress: 0,
    target: 1,
    xpReward: 75,
    completed: false
  }
];

export const ACHIEVEMENTS_DATA = ACHIEVEMENTS_LIST;
