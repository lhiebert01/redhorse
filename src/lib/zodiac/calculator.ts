import {
  ZODIAC_ANIMALS,
  ZODIAC_ELEMENTS,
  FIRE_HORSE_RELATIONS,
  ZodiacAnimal,
  ZodiacElement,
} from '@/constants/zodiac-data';
import { ZodiacInfo, ZodiacReading } from '@/types/zodiac';

/**
 * Exact Chinese New Year dates (month, day) for each Gregorian year.
 * CNY falls between Jan 21 and Feb 20. If someone is born BEFORE this date,
 * they belong to the PREVIOUS lunar year's zodiac animal.
 */
const CNY_DATES: Record<number, [number, number]> = {
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

/**
 * Determine the lunar year for a given Gregorian date.
 * If born before CNY of that year, the lunar year is the previous year.
 * Exported so party game code can use it too.
 */
export function getLunarYear(year: number, month: number, day: number): number {
  const cnyDate = CNY_DATES[year];
  if (!cnyDate) {
    // No CNY data for this year — fall back to Gregorian year
    return year;
  }

  const [cnyMonth, cnyDay] = cnyDate;

  // Born before CNY → previous lunar year
  if (month < cnyMonth || (month === cnyMonth && day < cnyDay)) {
    return year - 1;
  }
  return year;
}

/**
 * Calculate animal and element from a lunar year number.
 * The cycle started with Rat in 1924 (Wood Rat).
 */
function zodiacFromLunarYear(lunarYear: number): ZodiacInfo {
  const baseYear = 1924;
  let animalIndex = (lunarYear - baseYear) % 12;
  if (animalIndex < 0) animalIndex += 12;

  const animal = ZODIAC_ANIMALS[animalIndex];

  let elementIndex = Math.floor(((lunarYear - baseYear) % 10 + 10) % 10 / 2);
  const element = ZODIAC_ELEMENTS[elementIndex];

  return { animal, element };
}

/**
 * Calculate Chinese Zodiac sign and element from a birth date string.
 * Uses exact CNY dates for accuracy — someone born Jan 15, 1990 is a Snake (1989),
 * not a Horse (1990), because CNY 1990 was Jan 27.
 */
export function getChineseZodiac(birthDate: string): ZodiacInfo {
  let year: number;
  let month: number | undefined;
  let day: number | undefined;

  // Try to parse the date in various formats
  if (birthDate.includes('/')) {
    // MM/DD/YYYY format
    const parts = birthDate.split('/');
    month = parseInt(parts[0], 10);
    day = parseInt(parts[1], 10);
    year = parseInt(parts[2], 10);
  } else if (birthDate.includes('-')) {
    // YYYY-MM-DD format
    const parts = birthDate.split('-');
    year = parseInt(parts[0], 10);
    month = parseInt(parts[1], 10);
    day = parseInt(parts[2], 10);
  } else {
    // Try direct parsing
    const parsed = new Date(birthDate);
    year = parsed.getFullYear();
    month = parsed.getMonth() + 1;
    day = parsed.getDate();
  }

  // Default to a reasonable year if parsing fails
  if (isNaN(year) || year < 1900 || year > 2100) {
    year = 1990;
    month = undefined;
    day = undefined;
  }

  // Use lunar year calculation when we have full date info
  const lunarYear = (month && day) ? getLunarYear(year, month, day) : year;
  return zodiacFromLunarYear(lunarYear);
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
