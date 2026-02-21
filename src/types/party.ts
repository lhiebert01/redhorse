// Types for Fire Horse Trivia Party Game

export type PassType = 'solo' | 'day' | 'weekend' | 'festival';
export type GameStatus = 'lobby' | 'countdown' | 'playing' | 'showing_answer' | 'finished' | 'abandoned';

// ============================================================
// PASS CONFIGURATION
// ============================================================

export interface PassConfig {
  type: PassType;
  name: string;
  price: number; // in cents
  priceDisplay: string;
  durationHours: number;
  maxGames: number;
  maxPlayers: number; // 1 for solo, 20 for party passes
  isSolo: boolean; // true for solo play (no host needed)
  description: string;
}

export const PASS_CONFIGS: Record<PassType, PassConfig> = {
  solo: {
    type: 'solo',
    name: 'Solo Play Pass',
    price: 288,
    priceDisplay: '$2.88',
    durationHours: 24,
    maxGames: 5,
    maxPlayers: 1,
    isSolo: true,
    description: '24 hours • 5 games • Solo play',
  },
  day: {
    type: 'day',
    name: 'Day Pass',
    price: 488,
    priceDisplay: '$4.88',
    durationHours: 24,
    maxGames: 5,
    maxPlayers: 20,
    isSolo: false,
    description: '24 hours • 5 games • Up to 20 players',
  },
  weekend: {
    type: 'weekend',
    name: 'Weekend Pass',
    price: 888,
    priceDisplay: '$8.88',
    durationHours: 48,
    maxGames: 10,
    maxPlayers: 20,
    isSolo: false,
    description: '48 hours • 10 games • Up to 20 players',
  },
  festival: {
    type: 'festival',
    name: 'Festival Pass',
    price: 1488,
    priceDisplay: '$14.88',
    durationHours: 72,
    maxGames: 15,
    maxPlayers: 20,
    isSolo: false,
    description: '72 hours • 15 games • Up to 20 players',
  },
};

// ============================================================
// DATABASE TYPES (matching Supabase schema)
// ============================================================

export interface PartyPass {
  id: string;
  created_at: string;
  stripe_session_id: string;
  stripe_payment_intent?: string;
  host_email: string;
  party_code: string;
  pass_type: PassType;
  expires_at: string;
  games_remaining: number;
  games_total: number;
  games_played: number; // Track how many games have been started (0-indexed for question_sets)
  question_sets: number[][]; // Pre-generated question sets for ALL games
  settings: GameSettings;
  is_active: boolean;
  is_solo: boolean; // true for solo play passes
}

export interface GameSettings {
  timer_seconds: 15 | 30 | 45 | 60;
  questions_per_game: 10 | 15 | 20 | 25;
}

export interface PartyGame {
  id: string;
  party_pass_id: string;
  created_at: string;
  started_at?: string;
  ended_at?: string;
  timer_seconds: number;
  questions_per_game: number;
  question_ids: number[];
  current_question_index: number;
  status: GameStatus;
  game_number?: number; // Which game this is (1, 2, 3, etc.) - corresponds to question_sets index
}

export interface PartyPlayer {
  id: string;
  party_game_id: string;
  nickname: string;
  birth_year?: number;
  zodiac_sign?: string;
  zodiac_element?: string;
  joined_at: string;
  is_connected: boolean;
  last_seen_at: string;
}

export interface PartyAnswer {
  id: string;
  party_game_id: string;
  player_id: string;
  question_index: number;
  question_id: number;
  answer_given: string;
  is_correct: boolean;
  answer_time_ms: number;
  base_points: number;
  speed_bonus: number;
  streak_bonus: number;
  total_points: number;
  current_streak: number;
  answered_at: string;
}

export interface PartyScore {
  id: string;
  party_game_id: string;
  player_id: string;
  nickname: string;
  zodiac_sign?: string;
  zodiac_element?: string;
  total_points: number;
  correct_answers: number;
  total_questions: number;
  accuracy_percent: number;
  best_streak: number;
  fastest_answer_ms?: number;
  rank: number;
  completed_at: string;
}

// ============================================================
// REALTIME EVENT TYPES
// ============================================================

export type RealtimeEvent =
  | 'game_start'
  | 'countdown'
  | 'next_question'
  | 'question_end'
  | 'show_answer'
  | 'game_end'
  | 'player_joined'
  | 'player_left'
  | 'player_answered';

export interface RealtimePayload {
  event: RealtimeEvent;
  data?: unknown;
}

export interface GameStartPayload {
  event: 'game_start';
  data: {
    game_id: string;
    total_questions: number;
    timer_seconds: number;
  };
}

export interface CountdownPayload {
  event: 'countdown';
  data: {
    seconds_remaining: number;
  };
}

export interface QuestionPayload {
  event: 'next_question';
  data: {
    question_index: number;
    question: {
      id: number;
      question: string;
      options: [string, string, string, string];
      category: string;
      difficulty: string;
    };
    timer_seconds: number;
  };
}

export interface QuestionEndPayload {
  event: 'question_end';
  data: {
    question_index: number;
  };
}

export interface ShowAnswerPayload {
  event: 'show_answer';
  data: {
    question_index: number;
    correct_answer: string;
    explanation?: string;
    stats: {
      total_answers: number;
      correct_count: number;
      answer_distribution: Record<string, number>;
    };
  };
}

export interface GameEndPayload {
  event: 'game_end';
  data: {
    game_id: string;
    scores: PartyScore[];
  };
}

export interface PlayerJoinedPayload {
  event: 'player_joined';
  data: {
    player: PartyPlayer;
    total_players: number;
  };
}

export interface PlayerLeftPayload {
  event: 'player_left';
  data: {
    player_id: string;
    nickname: string;
    total_players: number;
  };
}

export interface PlayerAnsweredPayload {
  event: 'player_answered';
  data: {
    player_id: string;
    question_index: number;
    answers_received: number;
    total_players: number;
  };
}

// ============================================================
// SCORING CONSTANTS
// ============================================================

export const SCORING = {
  BASE_CORRECT: 100,
  SPEED_BONUS_FAST: 50, // Answer in first 25% of time
  SPEED_BONUS_MEDIUM: 25, // Answer in first 50% of time
  STREAK_BONUS_3: 25,
  STREAK_BONUS_5: 50,
  STREAK_BONUS_10: 100,
  MAX_PER_QUESTION: 150, // 100 + 50 speed
} as const;

// ============================================================
// UI CONSTANTS
// ============================================================

export const MAX_PLAYERS = 20;
export const PARTY_CODE_LENGTH = 6;
export const COUNTDOWN_SECONDS = 3;

// Color scheme for answer buttons (Kahoot-style)
export const ANSWER_COLORS = [
  { bg: '#E53935', text: 'white', icon: '🔴' }, // Red
  { bg: '#1E88E5', text: 'white', icon: '🔵' }, // Blue
  { bg: '#43A047', text: 'white', icon: '🟢' }, // Green
  { bg: '#FDD835', text: 'black', icon: '🟡' }, // Yellow
] as const;

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Calculate speed bonus based on answer time
 * For manual mode (timerSeconds = 0), uses 60 seconds as baseline for fair speed scoring
 */
export function calculateSpeedBonus(
  answerTimeMs: number,
  timerSeconds: number
): number {
  // Use 60 seconds as default for manual mode (0) to still reward fast answers
  const effectiveTimer = timerSeconds > 0 ? timerSeconds : 60;
  const timerMs = effectiveTimer * 1000;
  const percentOfTime = answerTimeMs / timerMs;

  if (percentOfTime <= 0.25) {
    return SCORING.SPEED_BONUS_FAST;  // Answer in first 25% of time (e.g., <15s for 60s timer)
  } else if (percentOfTime <= 0.5) {
    return SCORING.SPEED_BONUS_MEDIUM;  // Answer in first 50% of time (e.g., <30s for 60s timer)
  }
  return 0;
}

/**
 * Calculate streak bonus based on current streak
 */
export function calculateStreakBonus(streak: number): number {
  if (streak >= 10) return SCORING.STREAK_BONUS_10;
  if (streak >= 5) return SCORING.STREAK_BONUS_5;
  if (streak >= 3) return SCORING.STREAK_BONUS_3;
  return 0;
}

/**
 * Calculate total points for an answer
 */
export function calculatePoints(
  isCorrect: boolean,
  answerTimeMs: number,
  timerSeconds: number,
  currentStreak: number
): { base: number; speed: number; streak: number; total: number } {
  if (!isCorrect) {
    return { base: 0, speed: 0, streak: 0, total: 0 };
  }

  const base = SCORING.BASE_CORRECT;
  const speed = calculateSpeedBonus(answerTimeMs, timerSeconds);
  const streak = calculateStreakBonus(currentStreak + 1); // +1 for this answer

  return {
    base,
    speed,
    streak,
    total: base + speed + streak,
  };
}

/**
 * Format time remaining for display
 */
export function formatTimeRemaining(ms: number): string {
  const seconds = Math.ceil(ms / 1000);
  return seconds.toString().padStart(2, '0');
}

/**
 * Get zodiac sign from birth year (and optionally month/day for accuracy).
 * When month and day are provided, uses the exact CNY date to determine
 * whether the person falls in the current or previous lunar year.
 */
export function getZodiacFromYear(year: number, month?: number, day?: number): {
  sign: string;
  element: string;
} {
  const animals = [
    'Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake',
    'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig',
  ];
  const elements = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];

  // Use lunar year when full date is available
  let lunarYear = year;
  if (month && day) {
    // Import getLunarYear inline to avoid circular dependency issues
    // Replicate the CNY lookup logic here for the party module
    const cnyDates: Record<number, [number, number]> = {
      1920: [2, 20], 1921: [2, 8],  1922: [1, 28], 1923: [2, 16], 1924: [2, 5],
      1925: [1, 25], 1926: [2, 13], 1927: [2, 2],  1928: [1, 23], 1929: [2, 10],
      1930: [1, 30], 1931: [2, 17], 1932: [2, 6],  1933: [1, 26], 1934: [2, 14],
      1935: [2, 4],  1936: [1, 24], 1937: [2, 11], 1938: [1, 31], 1939: [2, 19],
      1940: [2, 8],  1941: [1, 27], 1942: [2, 15], 1943: [2, 5],  1944: [1, 25],
      1945: [2, 13], 1946: [2, 2],  1947: [1, 22], 1948: [2, 10], 1949: [1, 29],
      1950: [2, 17], 1951: [2, 6],  1952: [1, 27], 1953: [2, 14], 1954: [2, 3],
      1955: [1, 24], 1956: [2, 12], 1957: [1, 31], 1958: [2, 18], 1959: [2, 8],
      1960: [1, 28], 1961: [2, 15], 1962: [2, 5],  1963: [1, 25], 1964: [2, 13],
      1965: [2, 2],  1966: [1, 21], 1967: [2, 9],  1968: [1, 30], 1969: [2, 17],
      1970: [2, 6],  1971: [1, 27], 1972: [2, 15], 1973: [2, 3],  1974: [1, 23],
      1975: [2, 11], 1976: [1, 31], 1977: [2, 18], 1978: [2, 7],  1979: [1, 28],
      1980: [2, 16], 1981: [2, 5],  1982: [1, 25], 1983: [2, 13], 1984: [2, 2],
      1985: [2, 20], 1986: [2, 9],  1987: [1, 29], 1988: [2, 17], 1989: [2, 6],
      1990: [1, 27], 1991: [2, 15], 1992: [2, 4],  1993: [1, 23], 1994: [2, 10],
      1995: [1, 31], 1996: [2, 19], 1997: [2, 7],  1998: [1, 28], 1999: [2, 16],
      2000: [2, 5],  2001: [1, 24], 2002: [2, 12], 2003: [2, 1],  2004: [1, 22],
      2005: [2, 9],  2006: [1, 29], 2007: [2, 18], 2008: [2, 7],  2009: [1, 26],
      2010: [2, 14], 2011: [2, 3],  2012: [1, 23], 2013: [2, 10], 2014: [1, 31],
      2015: [2, 19], 2016: [2, 8],  2017: [1, 28], 2018: [2, 16], 2019: [2, 5],
      2020: [1, 25], 2021: [2, 12], 2022: [2, 1],  2023: [1, 22], 2024: [2, 10],
      2025: [1, 29], 2026: [2, 17], 2027: [2, 6],  2028: [1, 26], 2029: [2, 13],
      2030: [2, 3],
    };
    const cny = cnyDates[year];
    if (cny) {
      const [cnyMonth, cnyDay] = cny;
      if (month < cnyMonth || (month === cnyMonth && day < cnyDay)) {
        lunarYear = year - 1;
      }
    }
  }

  const startYear = 1924;
  const offset = lunarYear - startYear;

  const animalIndex = ((offset % 12) + 12) % 12;
  const elementIndex = Math.floor(((offset % 10) + 10) % 10 / 2);

  return {
    sign: animals[animalIndex],
    element: elements[elementIndex],
  };
}

/**
 * Generate a random party code
 */
export function generatePartyCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No I, O, 0, 1
  let code = '';
  for (let i = 0; i < PARTY_CODE_LENGTH; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Check if a party pass is still valid
 */
export function isPassValid(pass: PartyPass): boolean {
  if (!pass.is_active) return false;
  if (pass.games_remaining <= 0) return false;
  if (new Date(pass.expires_at) < new Date()) return false;
  return true;
}

/**
 * Get time remaining until pass expires
 */
export function getPassTimeRemaining(pass: PartyPass): {
  hours: number;
  minutes: number;
  expired: boolean;
} {
  const now = new Date();
  const expires = new Date(pass.expires_at);
  const diffMs = expires.getTime() - now.getTime();

  if (diffMs <= 0) {
    return { hours: 0, minutes: 0, expired: true };
  }

  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  return { hours, minutes, expired: false };
}
