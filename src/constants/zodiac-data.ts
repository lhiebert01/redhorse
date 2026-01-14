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

// Chinese characters for zodiac animals
export const ZODIAC_CHINESE: Record<ZodiacAnimal, string> = {
  Rat: '鼠',
  Ox: '牛',
  Tiger: '虎',
  Rabbit: '兔',
  Dragon: '龙',
  Snake: '蛇',
  Horse: '马',
  Goat: '羊',
  Monkey: '猴',
  Rooster: '鸡',
  Dog: '狗',
  Pig: '猪',
};

// Chinese characters for elements
export const ELEMENT_CHINESE: Record<ZodiacElement, string> = {
  Wood: '木',
  Fire: '火',
  Earth: '土',
  Metal: '金',
  Water: '水',
};

// Zodiac characteristics and 2026 forecasts
export interface ZodiacProfile {
  characteristics: string;
  strengths: string[];
  forecast2026: string;
}

export const ZODIAC_PROFILES: Record<ZodiacAnimal, ZodiacProfile> = {
  Rat: {
    characteristics:
      'Quick-witted, resourceful, and adaptable. Rats are charming individuals with sharp instincts for opportunity. They possess natural intelligence and excel at finding creative solutions to problems.',
    strengths: ['Clever', 'Resourceful', 'Versatile', 'Ambitious'],
    forecast2026:
      'The Fire Horse year brings turbulent energy that clashes with your Water nature. Exercise caution in financial matters and avoid impulsive decisions. Focus on consolidating existing resources rather than new ventures. Relationships require extra attention. Your natural wit will help you navigate challenges, but patience is essential.',
  },
  Ox: {
    characteristics:
      'Dependable, patient, and hardworking. Oxen are the steadfast pillars of any endeavor. With unwavering determination and methodical approach, they build lasting success through persistent effort.',
    strengths: ['Reliable', 'Patient', 'Determined', 'Honest'],
    forecast2026:
      'The Fire Horse creates friction with your Earth nature. Your hard work may feel underappreciated this year, but do not lose heart. Document your achievements carefully. Mid-year brings recognition if you stay the course. Health matters need attention. Trust your steady nature to outlast the chaos.',
  },
  Tiger: {
    characteristics:
      'Brave, confident, and competitive. Tigers are natural leaders who inspire others with their courage and passion. They possess magnetic charisma and an indomitable spirit that draws people to their cause.',
    strengths: ['Courageous', 'Passionate', 'Confident', 'Charismatic'],
    forecast2026:
      'The Fire Horse is your powerful ally! This is YOUR year to shine. Bold moves are favored, and fortune rewards those who dare. Career advancement is highly likely. Romance flourishes. Your natural leadership abilities are amplified. Seize every opportunity with confidence.',
  },
  Rabbit: {
    characteristics:
      'Gentle, elegant, and diplomatic. Rabbits possess refined sensibilities and a talent for creating harmony. Their intuitive nature and graceful approach make them excellent mediators and trusted confidants.',
    strengths: ['Graceful', 'Diplomatic', 'Intuitive', 'Compassionate'],
    forecast2026:
      'The Fire Horse year swirls with chaos, but you can find peace within the storm. Your gentle nature serves as a sanctuary. Focus on home, family, and creative pursuits. Avoid confrontations and let others compete. Your calm wisdom attracts allies who will support you.',
  },
  Dragon: {
    characteristics:
      'Powerful, ambitious, and charismatic. Dragons are destined for greatness and possess the drive to achieve it. Their natural magnetism and confidence inspire others to follow their visionary leadership.',
    strengths: ['Powerful', 'Ambitious', 'Charismatic', 'Innovative'],
    forecast2026:
      'Your Fire energy harmonizes with the Horse. However, avoid competing for the spotlight. Instead, channel your considerable power into collaboration. Major projects succeed when you support rather than lead. Financial gains come through partnerships. Your dragon wisdom will know when to soar.',
  },
  Snake: {
    characteristics:
      'Wise, intuitive, and sophisticated. Snakes are deep thinkers with penetrating insight. They move through life with strategic grace, often achieving their goals through patience and perfect timing.',
    strengths: ['Wise', 'Strategic', 'Intuitive', 'Elegant'],
    forecast2026:
      'The Fire Horse creates opportunity for the strategic Snake! While others are distracted by flames and chaos, you can advance your position silently. Business dealings favor the patient. Romance deepens through mystery. Use your natural wisdom to strike at precisely the right moment.',
  },
  Horse: {
    characteristics:
      'Free-spirited, energetic, and adventurous. Horses embody the joy of freedom and the thrill of the race. Their enthusiasm is infectious, and their optimism inspires everyone around them.',
    strengths: ['Energetic', 'Independent', 'Optimistic', 'Adventurous'],
    forecast2026:
      'This is YOUR year of DOUBLE FIRE! The intensity is overwhelming but transformative. You stand at a crossroads: conquer the world or burn out trying. Pace yourself carefully. Channel your boundless energy strategically. This rare alignment offers once-in-a-lifetime opportunities, but demands wisdom.',
  },
  Goat: {
    characteristics:
      'Creative, gentle, and artistic. Goats possess a refined aesthetic sense and deep emotional intelligence. Their nurturing nature and creative spirit bring beauty and harmony to everything they touch.',
    strengths: ['Creative', 'Gentle', 'Artistic', 'Empathetic'],
    forecast2026:
      'The Horse is your Secret Friend! This year blesses you with love, creativity, and unexpected support. Romance is highly favored. Artistic endeavors flourish. The Fire Horse protects your gentle spirit while opening doors previously closed. Express yourself freely and watch magic unfold.',
  },
  Monkey: {
    characteristics:
      'Clever, curious, and playful. Monkeys are natural problem-solvers with quick minds and quicker wit. Their adaptability and charm make them successful in any environment they choose.',
    strengths: ['Intelligent', 'Curious', 'Adaptable', 'Witty'],
    forecast2026:
      'The Fire Horse matches your speed perfectly! Your agility serves you well in this fast-moving year. Quick thinking brings rewards. However, guard your health and ensure adequate rest. Your natural cleverness attracts both opportunity and envy. Stay nimble and trust your instincts.',
  },
  Rooster: {
    characteristics:
      'Honest, hardworking, and confident. Roosters take pride in their achievements and present themselves with style. Their attention to detail and strong work ethic earn them respect and success.',
    strengths: ['Honest', 'Observant', 'Hardworking', 'Confident'],
    forecast2026:
      'The Fire Horse brings tests to your relationships. Do not force partnerships or push romantic interests. Focus instead on self-improvement and personal achievements. Career success comes through solo efforts. Family bonds may strain but will strengthen if handled with patience and honesty.',
  },
  Dog: {
    characteristics:
      'Loyal, honest, and protective. Dogs are the most faithful friends one could have. Their strong moral compass and devotion to those they love make them invaluable allies and trusted companions.',
    strengths: ['Loyal', 'Honest', 'Protective', 'Faithful'],
    forecast2026:
      'The Fire Horse recognizes your loyalty and rewards it! This is an excellent year for Dogs. Guard your allies and they will make you prosper. Career advancement comes through trusted connections. New friendships bring unexpected benefits. Your faithful nature attracts fortune.',
  },
  Pig: {
    characteristics:
      'Generous, compassionate, and sincere. Pigs enjoy the pleasures of life and share their abundance freely. Their warm hearts and genuine nature attract friends and good fortune wherever they go.',
    strengths: ['Generous', 'Sincere', 'Tolerant', 'Compassionate'],
    forecast2026:
      'The Fire Horse brings heat, but your cool nature keeps you balanced. Enjoy the celebrations but protect your wealth from impulsive spending. Social opportunities abound. Romance is playful but may lack depth. Focus on genuine connections over superficial ones. Your natural abundance grows when shared wisely.',
  },
};

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
