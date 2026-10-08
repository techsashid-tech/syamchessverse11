import { PlayerStats, GameHistoryRecord, BoardTheme, PieceStyle } from '../types/chess';
import { INITIAL_DAILY_MISSIONS } from '../data/achievements';

const STATS_KEY = 'chessverse_player_stats_v1';
const SETTINGS_KEY = 'chessverse_user_settings_v1';
const MISSIONS_KEY = 'chessverse_missions_v1';
const THEME_MODE_KEY = 'chessverse_theme_mode_v1';

export type ThemeMode = 'dark' | 'light';

export interface UserSettings {
  boardTheme: BoardTheme;
  pieceStyle: PieceStyle;
  soundEnabled: boolean;
  musicEnabled: boolean;
  reduceMotion: boolean;
  highContrast: boolean;
  showCoordinates: boolean;
  viewMode: '3d' | '2d';
  themeMode: ThemeMode;
}

const DEFAULT_SETTINGS: UserSettings = {
  boardTheme: 'crimson',
  pieceStyle: 'classic',
  soundEnabled: true,
  musicEnabled: false,
  reduceMotion: false,
  highContrast: false,
  showCoordinates: true,
  viewMode: '3d',
  themeMode: 'dark'
};

const DEFAULT_STATS: PlayerStats = {
  gamesPlayed: 0,
  wins: 0,
  losses: 0,
  draws: 0,
  puzzlesSolved: 0,
  puzzleStreak: 0,
  maxPuzzleStreak: 0,
  xp: 0,
  level: 1,
  fastestWinSeconds: null,
  longestGameMoves: 0,
  favoriteOpening: 'Italian Game',
  dailyChallengeCompletedDate: null,
  achievements: [],
  history: []
};

export function getThemeMode(): ThemeMode {
  try {
    const saved = localStorage.getItem(THEME_MODE_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
    return 'dark';
  } catch {
    return 'dark';
  }
}

export function saveThemeMode(mode: ThemeMode): void {
  try {
    localStorage.setItem(THEME_MODE_KEY, mode);
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  } catch {}
}

export function getPlayerStats(): PlayerStats {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return DEFAULT_STATS;
    return { ...DEFAULT_STATS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_STATS;
  }
}

export function savePlayerStats(stats: PlayerStats): void {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch {}
}

export function addXP(amount: number): { stats: PlayerStats; leveledUp: boolean; newLevel: number } {
  const stats = getPlayerStats();
  const oldLevel = stats.level;
  stats.xp += amount;
  stats.level = Math.floor(Math.sqrt(stats.xp / 100)) + 1;
  const leveledUp = stats.level > oldLevel;
  savePlayerStats(stats);
  return { stats, leveledUp, newLevel: stats.level };
}

export function recordGameResult(record: Omit<GameHistoryRecord, 'id' | 'date'>): PlayerStats {
  const stats = getPlayerStats();
  const fullRecord: GameHistoryRecord = {
    ...record,
    id: `game_${Date.now()}`,
    date: new Date().toISOString()
  };

  stats.gamesPlayed += 1;
  if (record.result === 'win') {
    stats.wins += 1;
    addXP(100);
  } else if (record.result === 'loss') {
    stats.losses += 1;
    addXP(30);
  } else {
    stats.draws += 1;
    addXP(50);
  }

  if (record.movesCount > stats.longestGameMoves) {
    stats.longestGameMoves = record.movesCount;
  }

  if (stats.wins >= 1 && !stats.achievements.includes('first_win')) {
    stats.achievements.push('first_win');
    stats.xp += 150;
  }

  stats.history = [fullRecord, ...stats.history].slice(0, 30);
  savePlayerStats(stats);
  return stats;
}

export function recordPuzzleSolved(isCorrect: boolean): { stats: PlayerStats; newStreak: number } {
  const stats = getPlayerStats();
  if (isCorrect) {
    stats.puzzlesSolved += 1;
    stats.puzzleStreak += 1;
    if (stats.puzzleStreak > stats.maxPuzzleStreak) {
      stats.maxPuzzleStreak = stats.puzzleStreak;
    }
    stats.xp += 50;
    if (stats.puzzlesSolved >= 10 && !stats.achievements.includes('tactical_warrior')) {
      stats.achievements.push('tactical_warrior');
      stats.xp += 200;
    }
    if (stats.puzzleStreak >= 5 && !stats.achievements.includes('puzzle_master')) {
      stats.achievements.push('puzzle_master');
      stats.xp += 300;
    }
  } else {
    stats.puzzleStreak = 0;
  }
  stats.level = Math.floor(Math.sqrt(stats.xp / 100)) + 1;
  savePlayerStats(stats);
  return { stats, newStreak: stats.puzzleStreak };
}

export function getUserSettings(): UserSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveUserSettings(settings: UserSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {}
}

export function getDailyMissions(): typeof INITIAL_DAILY_MISSIONS {
  try {
    const raw = localStorage.getItem(MISSIONS_KEY);
    if (!raw) return INITIAL_DAILY_MISSIONS;
    return JSON.parse(raw);
  } catch {
    return INITIAL_DAILY_MISSIONS;
  }
}

export function updateMissionProgress(id: string, amount: number = 1): void {
  try {
    const missions = getDailyMissions();
    const mission = missions.find((m) => m.id === id);
    if (mission && !mission.completed) {
      mission.progress = Math.min(mission.target, mission.progress + amount);
      if (mission.progress >= mission.target) {
        mission.completed = true;
        addXP(mission.xpReward);
      }
      localStorage.setItem(MISSIONS_KEY, JSON.stringify(missions));
    }
  } catch {}
}

export function getPlayerProfile() {
  const stats = getPlayerStats();
  const missions = getDailyMissions();
  return {
    username: 'Guest Master',
    title: stats.level >= 10 ? 'Grandmaster Prodigy' : stats.level >= 5 ? 'Chess Champion' : 'Tactical Apprentice',
    level: stats.level,
    xp: stats.xp,
    completedLessons: (() => {
      try {
        const raw = localStorage.getItem('chessverse_player_profile');
        if (raw) return JSON.parse(raw).completedLessons || [];
        return [];
      } catch {
        return [];
      }
    })(),
    stats,
    achievements: stats.achievements,
    dailyMissions: missions,
    history: stats.history
  };
}
