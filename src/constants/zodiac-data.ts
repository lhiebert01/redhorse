export const ZODIAC_ANIMALS = [
  'Rat',
  'Ox',
  'Tiger',
  'Rabbit',
  'Dragon',
  'Snake',
  'Horse',
  'Goat',
  'Monkey',
  'Rooster',
  'Dog',
  'Pig',
] as const;

export type ZodiacAnimal = (typeof ZODIAC_ANIMALS)[number];

export const ZODIAC_ELEMENTS = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'] as const;

export type ZodiacElement = (typeof ZODIAC_ELEMENTS)[number];

export interface FireHorseRelation {
  relation: string;
  tone: string;
  advice: string;
  compatibility: 'ally' | 'neutral' | 'clash' | 'special';
}

export const FIRE_HORSE_RELATIONS: Record<ZodiacAnimal, FireHorseRelation> = {
  Rat: {
    relation: 'Clash (Enemy)',
    tone: 'Warning',
    advice:
      'Lay low this year. The Fire Horse burns your water energy. Avoid risky ventures and major financial decisions.',
    compatibility: 'clash',
  },
  Ox: {
    relation: 'Harm (Friction)',
    tone: 'Caution',
    advice:
      'Your hard work may go unnoticed this year. Patience is your only shield. Document your achievements.',
    compatibility: 'clash',
  },
  Tiger: {
    relation: 'Ally (Harmony)',
    tone: 'Victorious',
    advice:
      "You are the Horse's best ally. Fortune favors the bold in 2026. Run wild and seize opportunities.",
    compatibility: 'ally',
  },
  Rabbit: {
    relation: 'Neutral',
    tone: 'Calm',
    advice:
      'Stay out of the chaos. Let others fight while you secure your home and inner peace.',
    compatibility: 'neutral',
  },
  Dragon: {
    relation: 'Indifferent',
    tone: 'Bold',
    advice:
      "You can match the Horse's fiery energy, but do not compete for the spotlight. Collaborate instead.",
    compatibility: 'neutral',
  },
  Snake: {
    relation: 'Ally (Fire)',
    tone: 'Strategic',
    advice:
      "Use the Horse's chaos as a ladder to climb. Strike while others are distracted by the flames.",
    compatibility: 'ally',
  },
  Horse: {
    relation: 'Self-Penalty (Turmoil)',
    tone: 'Intense',
    advice:
      'Double fire year for you. You will either conquer the world or burn out completely. Pace yourself.',
    compatibility: 'special',
  },
  Goat: {
    relation: 'Secret Friend (Love)',
    tone: 'Blessed',
    advice:
      'The Horse protects you. 2026 is your year for romance, connection, and creative expression.',
    compatibility: 'ally',
  },
  Monkey: {
    relation: 'Neutral',
    tone: 'Witty',
    advice:
      'Move fast. The speed of 2026 suits your natural agility, but watch your health and rest.',
    compatibility: 'neutral',
  },
  Rooster: {
    relation: 'Destruction',
    tone: 'Tested',
    advice:
      'Relationships will be severely tested this year. Do not force love or partnerships.',
    compatibility: 'clash',
  },
  Dog: {
    relation: 'Ally (Harmony)',
    tone: 'Loyal',
    advice:
      'Your loyalty will be rewarded handsomely. Guard your allies and they will make you rich.',
    compatibility: 'ally',
  },
  Pig: {
    relation: 'Neutral',
    tone: 'Enjoyment',
    advice:
      'The fire is hot, but you are cool. Enjoy the party but keep your wallet close and protected.',
    compatibility: 'neutral',
  },
};
