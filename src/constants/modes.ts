export const PRODUCT_MODES = {
  wealth: {
    id: 'wealth',
    name: 'Wealth Mode',
    emoji: '🎲',
    tagline: 'The Gambler',
    description: 'Your 6 Personal Lucky Numbers',
    hook: 'Beat the House',
    visualTheme: 'Golden Fire Horse surrounded by falling coins, treasure chests, and golden light',
    textPrompt: 'Generate 6 Lucky Numbers (range 01-99) and one Power Date in 2026 (month and day)',
    outputFormat: 'numbers + date',
  },
  power: {
    id: 'power',
    name: 'Power Mode',
    emoji: '⚔️',
    tagline: 'The Mogul',
    description: 'Your 2026 Strategy Motto',
    hook: 'Dominate the Market',
    visualTheme:
      'Fire Horse scaling a mountain peak with lightning, storm clouds, and golden crown',
    textPrompt: 'Generate a 3-word aggressive Sun Tzu style strategic motto (e.g., STRIKE THE NORTH)',
    outputFormat: 'motto',
  },
  love: {
    id: 'love',
    name: 'Love Mode',
    emoji: '❤️',
    tagline: 'The Romantic',
    description: 'Your Relationship Decree',
    hook: 'Secure the Heart',
    visualTheme: 'Fire Horse and Phoenix dancing together in the sky with hearts and red ribbons',
    textPrompt: 'Generate a 4-word romantic destiny phrase about love and relationships',
    outputFormat: 'phrase',
  },
  shield: {
    id: 'shield',
    name: 'Shield Mode',
    emoji: '🛡️',
    tagline: 'The Guardian',
    description: 'Your Protective Mantra',
    hook: 'Survive the Chaos',
    visualTheme:
      'Fire Horse standing guard in an ancient temple with protective golden aura and incense',
    textPrompt: 'Generate a 3-word protective mantra for safety and peace',
    outputFormat: 'mantra',
  },
} as const;

export type FocusMode = keyof typeof PRODUCT_MODES;
