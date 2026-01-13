import {
  ZODIAC_ANIMALS,
  ZODIAC_ELEMENTS,
  FIRE_HORSE_RELATIONS,
  ZodiacAnimal,
  ZodiacElement,
} from '@/constants/zodiac-data';
import { ZodiacInfo, ZodiacReading } from '@/types/zodiac';

/**
 * Calculate Chinese Zodiac sign and element from a birth date
 * Note: This is a simplified calculation that uses the Western calendar year.
 * For precise calculations, Chinese lunar calendar dates should be used.
 */
export function getChineseZodiac(birthDate: string): ZodiacInfo {
  let year: number;

  // Try to parse the date in various formats
  if (birthDate.includes('/')) {
    // MM/DD/YYYY format
    const parts = birthDate.split('/');
    year = parseInt(parts[2], 10);
  } else if (birthDate.includes('-')) {
    // YYYY-MM-DD format
    year = parseInt(birthDate.split('-')[0], 10);
  } else {
    // Try direct parsing
    const parsed = new Date(birthDate);
    year = parsed.getFullYear();
  }

  // Default to a reasonable year if parsing fails
  if (isNaN(year) || year < 1900 || year > 2100) {
    year = 1990;
  }

  // Chinese zodiac cycles every 12 years
  // The cycle started with Rat in 1924
  const baseYear = 1924;
  let animalIndex = (year - baseYear) % 12;
  if (animalIndex < 0) animalIndex += 12;

  const animal = ZODIAC_ANIMALS[animalIndex];

  // Five elements cycle every 2 years within a 10-year cycle
  // The cycle: Wood (0,1), Fire (2,3), Earth (4,5), Metal (6,7), Water (8,9)
  let elementIndex = Math.floor(((year - baseYear) % 10) / 2);
  if (elementIndex < 0) elementIndex += 5;

  const element = ZODIAC_ELEMENTS[elementIndex];

  return { animal, element };
}

/**
 * Get the full zodiac reading for 2026 Fire Horse year
 */
export function getFireHorseReading(animal: ZodiacAnimal, element: ZodiacElement): ZodiacReading {
  const relation = FIRE_HORSE_RELATIONS[animal];

  return {
    sign: animal,
    element,
    relation: relation.relation,
    tone: relation.tone,
    advice: relation.advice,
    compatibility: relation.compatibility,
  };
}

/**
 * Get year range for a zodiac sign (for display purposes)
 */
export function getRecentYears(animal: ZodiacAnimal): number[] {
  const animalIndex = ZODIAC_ANIMALS.indexOf(animal);
  const baseYear = 1924 + animalIndex;
  const years: number[] = [];

  for (let year = baseYear; year <= 2024; year += 12) {
    if (year >= 1960) {
      years.push(year);
    }
  }

  return years;
}
