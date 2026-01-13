import { ZodiacAnimal, ZodiacElement } from '@/constants/zodiac-data';

export interface ZodiacInfo {
  animal: ZodiacAnimal;
  element: ZodiacElement;
}

export interface ZodiacReading {
  sign: ZodiacAnimal;
  element: ZodiacElement;
  relation: string;
  tone: string;
  advice: string;
  compatibility: 'ally' | 'neutral' | 'clash' | 'special';
}
