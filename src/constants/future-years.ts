// 12-Year Chinese Zodiac Cycle (2026-2037)
// Each element+animal combination occurs once every 60 years

export interface ZodiacYear {
  year: number;
  animal: string;
  animalChinese: string;
  element: string;
  elementChinese: string;
  elementColor: string;
  cnyDate: string;
  brandName: string;
  domain: string;
  emoji: string;
  description: string;
  isActive: boolean; // Currently selling
  isCurrent: boolean; // Current calendar year
}

export const ZODIAC_YEARS: ZodiacYear[] = [
  {
    year: 2026,
    animal: 'Horse',
    animalChinese: '馬',
    element: 'Fire',
    elementChinese: '火',
    elementColor: 'text-red-500',
    cnyDate: 'January 29, 2026',
    brandName: 'Red Horse Oracle™',
    domain: 'redhorseoracle.com',
    emoji: '🐴',
    description: 'The Fire Horse blazes with untamed passion and revolutionary spirit. Once every 60 years.',
    isActive: true,
    isCurrent: true,
  },
  {
    year: 2027,
    animal: 'Goat',
    animalChinese: '羊',
    element: 'Fire',
    elementChinese: '火',
    elementColor: 'text-red-500',
    cnyDate: 'February 17, 2027',
    brandName: 'Fire Goat Oracle™',
    domain: 'firegoatoracle.com',
    emoji: '🐐',
    description: 'The Fire Goat brings creative passion and artistic inspiration. Nurturing flames that warm the soul.',
    isActive: false,
    isCurrent: false,
  },
  {
    year: 2028,
    animal: 'Monkey',
    animalChinese: '猴',
    element: 'Earth',
    elementChinese: '土',
    elementColor: 'text-yellow-600',
    cnyDate: 'February 6, 2028',
    brandName: 'Earth Monkey Oracle™',
    domain: 'earthmonkeyoracle.com',
    emoji: '🐵',
    description: 'The Earth Monkey combines wit with stability. Grounded genius and practical innovation.',
    isActive: false,
    isCurrent: false,
  },
  {
    year: 2029,
    animal: 'Rooster',
    animalChinese: '雞',
    element: 'Earth',
    elementChinese: '土',
    elementColor: 'text-yellow-600',
    cnyDate: 'January 26, 2029',
    brandName: 'Earth Rooster Oracle™',
    domain: 'earthroosteroracle.com',
    emoji: '🐓',
    description: 'The Earth Rooster announces truth with unwavering confidence. Grounded pride and honest prosperity.',
    isActive: false,
    isCurrent: false,
  },
  {
    year: 2030,
    animal: 'Dog',
    animalChinese: '狗',
    element: 'Metal',
    elementChinese: '金',
    elementColor: 'text-gray-300',
    cnyDate: 'February 13, 2030',
    brandName: 'Metal Dog Oracle™',
    domain: 'metaldogoracle.com',
    emoji: '🐕',
    description: 'The Metal Dog guards with steely loyalty. Unwavering protection and golden justice.',
    isActive: false,
    isCurrent: false,
  },
  {
    year: 2031,
    animal: 'Pig',
    animalChinese: '豬',
    element: 'Metal',
    elementChinese: '金',
    elementColor: 'text-gray-300',
    cnyDate: 'February 3, 2031',
    brandName: 'Metal Pig Oracle™',
    domain: 'metalpigoracle.com',
    emoji: '🐖',
    description: 'The Metal Pig embodies luxurious abundance. Golden generosity and refined prosperity.',
    isActive: false,
    isCurrent: false,
  },
  {
    year: 2032,
    animal: 'Rat',
    animalChinese: '鼠',
    element: 'Water',
    elementChinese: '水',
    elementColor: 'text-blue-400',
    cnyDate: 'January 23, 2032',
    brandName: 'Water Rat Oracle™',
    domain: 'waterratoracle.com',
    emoji: '🐀',
    description: 'The Water Rat flows with adaptive intelligence. Fluid strategy and resourceful prosperity.',
    isActive: false,
    isCurrent: false,
  },
  {
    year: 2033,
    animal: 'Ox',
    animalChinese: '牛',
    element: 'Water',
    elementChinese: '水',
    elementColor: 'text-blue-400',
    cnyDate: 'February 10, 2033',
    brandName: 'Water Ox Oracle™',
    domain: 'wateroxoracle.com',
    emoji: '🐂',
    description: 'The Water Ox combines strength with depth. Patient power flowing like a mighty river.',
    isActive: false,
    isCurrent: false,
  },
  {
    year: 2034,
    animal: 'Tiger',
    animalChinese: '虎',
    element: 'Wood',
    elementChinese: '木',
    elementColor: 'text-green-500',
    cnyDate: 'January 31, 2034',
    brandName: 'Wood Tiger Oracle™',
    domain: 'woodtigeroracle.com',
    emoji: '🐅',
    description: 'The Wood Tiger grows with fierce ambition. Rooted strength and evergreen courage.',
    isActive: false,
    isCurrent: false,
  },
  {
    year: 2035,
    animal: 'Rabbit',
    animalChinese: '兔',
    element: 'Wood',
    elementChinese: '木',
    elementColor: 'text-green-500',
    cnyDate: 'February 19, 2035',
    brandName: 'Wood Rabbit Oracle™',
    domain: 'woodrabbitoracle.com',
    emoji: '🐇',
    description: 'The Wood Rabbit blossoms with gentle grace. Natural harmony and peaceful growth.',
    isActive: false,
    isCurrent: false,
  },
  {
    year: 2036,
    animal: 'Dragon',
    animalChinese: '龍',
    element: 'Fire',
    elementChinese: '火',
    elementColor: 'text-red-500',
    cnyDate: 'February 8, 2036',
    brandName: 'Fire Dragon Oracle™',
    domain: 'firedragonoracle.com',
    emoji: '🐉',
    description: 'The FIRE DRAGON — The most powerful and auspicious combination. Imperial majesty meets cosmic flame. THE BIG ONE.',
    isActive: false,
    isCurrent: false,
  },
  {
    year: 2037,
    animal: 'Snake',
    animalChinese: '蛇',
    element: 'Fire',
    elementChinese: '火',
    elementColor: 'text-red-500',
    cnyDate: 'January 28, 2037',
    brandName: 'Fire Snake Oracle™',
    domain: 'firesnakeoracle.com',
    emoji: '🐍',
    description: 'The Fire Snake strikes with passionate wisdom. Transformative flames and mystical insight.',
    isActive: false,
    isCurrent: false,
  },
];

// Get future years only (not current)
export const FUTURE_YEARS = ZODIAC_YEARS.filter(y => !y.isCurrent);

// Get the next year
export const NEXT_YEAR = ZODIAC_YEARS.find(y => y.year === 2027);

// Special highlight - Fire Dragon 2036
export const FIRE_DRAGON = ZODIAC_YEARS.find(y => y.year === 2036);

// Element colors for styling
export const ELEMENT_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  Fire: { bg: 'bg-red-900/30', border: 'border-red-500/50', text: 'text-red-400' },
  Earth: { bg: 'bg-yellow-900/30', border: 'border-yellow-600/50', text: 'text-yellow-500' },
  Metal: { bg: 'bg-gray-800/50', border: 'border-gray-400/50', text: 'text-gray-300' },
  Water: { bg: 'bg-blue-900/30', border: 'border-blue-500/50', text: 'text-blue-400' },
  Wood: { bg: 'bg-green-900/30', border: 'border-green-500/50', text: 'text-green-400' },
};
