import { ZodiacAnimal } from './zodiac-data';

/**
 * Limited Edition Oracle Configuration
 * Each zodiac sign has a staggered closing date and limited slots
 * Numbers use auspicious Chinese numerology (8 = prosperity)
 */

export interface EditionConfig {
  animal: ZodiacAnimal;
  totalSlots: number;
  closingDate: string; // ISO date
  closingDateDisplay: string; // Human readable
  chineseChar: string;
}

// 888 editions per zodiac sign = 10,656 total oracles EVER
// 888 is the most auspicious Chinese number (prosperity/wealth)
// Staggered closing dates throughout 2026
export const EDITION_CONFIG: Record<ZodiacAnimal, EditionConfig> = {
  Rat: {
    animal: 'Rat',
    totalSlots: 888,
    closingDate: '2026-02-28',
    closingDateDisplay: 'February 28, 2026',
    chineseChar: '鼠',
  },
  Ox: {
    animal: 'Ox',
    totalSlots: 888,
    closingDate: '2026-03-31',
    closingDateDisplay: 'March 31, 2026',
    chineseChar: '牛',
  },
  Tiger: {
    animal: 'Tiger',
    totalSlots: 888,
    closingDate: '2026-04-30',
    closingDateDisplay: 'April 30, 2026',
    chineseChar: '虎',
  },
  Rabbit: {
    animal: 'Rabbit',
    totalSlots: 888,
    closingDate: '2026-05-31',
    closingDateDisplay: 'May 31, 2026',
    chineseChar: '兔',
  },
  Dragon: {
    animal: 'Dragon',
    totalSlots: 888,
    closingDate: '2026-06-30',
    closingDateDisplay: 'June 30, 2026',
    chineseChar: '龙',
  },
  Snake: {
    animal: 'Snake',
    totalSlots: 888,
    closingDate: '2026-07-31',
    closingDateDisplay: 'July 31, 2026',
    chineseChar: '蛇',
  },
  Horse: {
    animal: 'Horse',
    totalSlots: 888,
    closingDate: '2026-08-31',
    closingDateDisplay: 'August 31, 2026',
    chineseChar: '马',
  },
  Goat: {
    animal: 'Goat',
    totalSlots: 888,
    closingDate: '2026-09-30',
    closingDateDisplay: 'September 30, 2026',
    chineseChar: '羊',
  },
  Monkey: {
    animal: 'Monkey',
    totalSlots: 888,
    closingDate: '2026-10-31',
    closingDateDisplay: 'October 31, 2026',
    chineseChar: '猴',
  },
  Rooster: {
    animal: 'Rooster',
    totalSlots: 888,
    closingDate: '2026-11-30',
    closingDateDisplay: 'November 30, 2026',
    chineseChar: '鸡',
  },
  Dog: {
    animal: 'Dog',
    totalSlots: 888,
    closingDate: '2026-12-15',
    closingDateDisplay: 'December 15, 2026',
    chineseChar: '狗',
  },
  Pig: {
    animal: 'Pig',
    totalSlots: 888,
    closingDate: '2026-12-31',
    closingDateDisplay: 'December 31, 2026',
    chineseChar: '猪',
  },
};

/**
 * Simulate remaining slots (in production, this would come from database)
 * Uses deterministic "random" based on animal name for consistency
 */
export function getRemainingSlots(animal: ZodiacAnimal): number {
  const config = EDITION_CONFIG[animal];
  // Simulate ~60-85% sold for urgency
  const seed = animal.charCodeAt(0) + animal.charCodeAt(1);
  const soldPercentage = 0.60 + (seed % 25) / 100;
  const remaining = Math.floor(config.totalSlots * (1 - soldPercentage));
  return Math.max(remaining, 17); // Always show at least 17 remaining
}

/**
 * Get days remaining until closing
 */
export function getDaysRemaining(animal: ZodiacAnimal): number {
  const config = EDITION_CONFIG[animal];
  const closing = new Date(config.closingDate);
  const now = new Date();
  const diffTime = closing.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(diffDays, 0);
}

/**
 * Check if editions are still available
 */
export function isEditionAvailable(animal: ZodiacAnimal): boolean {
  return getDaysRemaining(animal) > 0 && getRemainingSlots(animal) > 0;
}
