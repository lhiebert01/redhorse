import { ZodiacAnimal } from './zodiac-data';

/**
 * Limited Edition Oracle Configuration
 * Each zodiac sign + mode combination has 888 editions
 * Numbers use auspicious Chinese numerology (8 = prosperity)
 */

export interface EditionConfig {
  animal: ZodiacAnimal;
  totalSlots: number; // 888 per mode (Wealth/Power/Love/Shield)
  closingDate: string; // ISO date
  closingDateDisplay: string; // Human readable
  chineseChar: string;
}

export type OracleMode = 'wealth' | 'power' | 'love' | 'shield';

// 888 editions per zodiac sign PER MODE = 42,624 total oracles EVER
// 888 × 12 zodiac signs × 4 modes = 42,624
// 888 is the most auspicious Chinese number (prosperity/wealth)
// ALL editions close when the Year of the Fire Horse ends: February 17, 2027
// (Chinese New Year 2027 begins February 17, ending the Fire Horse year)
export const EDITION_CONFIG: Record<ZodiacAnimal, EditionConfig> = {
  Rat: {
    animal: 'Rat',
    totalSlots: 888,
    closingDate: '2027-02-17',
    closingDateDisplay: 'February 17, 2027',
    chineseChar: '鼠',
  },
  Ox: {
    animal: 'Ox',
    totalSlots: 888,
    closingDate: '2027-02-17',
    closingDateDisplay: 'February 17, 2027',
    chineseChar: '牛',
  },
  Tiger: {
    animal: 'Tiger',
    totalSlots: 888,
    closingDate: '2027-02-17',
    closingDateDisplay: 'February 17, 2027',
    chineseChar: '虎',
  },
  Rabbit: {
    animal: 'Rabbit',
    totalSlots: 888,
    closingDate: '2027-02-17',
    closingDateDisplay: 'February 17, 2027',
    chineseChar: '兔',
  },
  Dragon: {
    animal: 'Dragon',
    totalSlots: 888,
    closingDate: '2027-02-17',
    closingDateDisplay: 'February 17, 2027',
    chineseChar: '龙',
  },
  Snake: {
    animal: 'Snake',
    totalSlots: 888,
    closingDate: '2027-02-17',
    closingDateDisplay: 'February 17, 2027',
    chineseChar: '蛇',
  },
  Horse: {
    animal: 'Horse',
    totalSlots: 888,
    closingDate: '2027-02-17',
    closingDateDisplay: 'February 17, 2027',
    chineseChar: '马',
  },
  Goat: {
    animal: 'Goat',
    totalSlots: 888,
    closingDate: '2027-02-17',
    closingDateDisplay: 'February 17, 2027',
    chineseChar: '羊',
  },
  Monkey: {
    animal: 'Monkey',
    totalSlots: 888,
    closingDate: '2027-02-17',
    closingDateDisplay: 'February 17, 2027',
    chineseChar: '猴',
  },
  Rooster: {
    animal: 'Rooster',
    totalSlots: 888,
    closingDate: '2027-02-17',
    closingDateDisplay: 'February 17, 2027',
    chineseChar: '鸡',
  },
  Dog: {
    animal: 'Dog',
    totalSlots: 888,
    closingDate: '2027-02-17',
    closingDateDisplay: 'February 17, 2027',
    chineseChar: '狗',
  },
  Pig: {
    animal: 'Pig',
    totalSlots: 888,
    closingDate: '2027-02-17',
    closingDateDisplay: 'February 17, 2027',
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
