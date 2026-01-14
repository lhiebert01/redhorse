// Example people for the See Examples gallery
// Each person represents one of the 12 Chinese zodiac animals
// Modes rotate: Wealth, Power, Love, Shield (3 each)
// Generated on January 14, 2026

export interface ExamplePerson {
  id: number;
  name: string;
  dob: string;
  age: number;
  zodiac: string;
  zodiacChinese: string;
  element: string;
  mode: 'wealth' | 'power' | 'love' | 'shield';
  modeLabel: string;
  mainText: string;
  testimonial: string;
  talismanImage: string;
  revealLink: string;
}

export const EXAMPLE_PEOPLE: ExamplePerson[] = [
  {
    id: 1,
    name: 'Michael Johnson',
    dob: '03/15/1984',
    age: 42,
    zodiac: 'rat',
    zodiacChinese: '鼠',
    element: 'Wood',
    mode: 'wealth',
    modeLabel: 'Lucky Numbers',
    mainText: '04-15-28-38-68-84',
    testimonial: "The Oracle gave me six numbers that felt deeply connected to my Rat nature. I played them on a whim and won $2,400! The Fire Horse knows something we don't.",
    talismanImage: '/assets/examples/michael-johnson-rat-wealth.png',
    revealLink: 'https://redhorse-omega.vercel.app/reveal?session_id=admin_test_d9efd643-e32f-4dc4-97d1-e10b496993a6',
  },
  {
    id: 2,
    name: 'Jennifer Smith',
    dob: '07/22/1985',
    age: 41,
    zodiac: 'ox',
    zodiacChinese: '牛',
    element: 'Wood',
    mode: 'power',
    modeLabel: 'Strategic Motto',
    mainText: 'BREAK THE RANK',
    testimonial: "My motto 'BREAK THE RANK' became my mantra at work. I landed a promotion within two months. The Ox and Fire Horse alliance is unstoppable.",
    talismanImage: '/assets/examples/jennifer-smith-ox-power.png',
    revealLink: 'https://redhorse-omega.vercel.app/reveal?session_id=admin_test_3ff62289-5db7-4cd5-958a-1aa97b6e8318',
  },
  {
    id: 3,
    name: 'David Williams',
    dob: '11/08/1986',
    age: 40,
    zodiac: 'tiger',
    zodiacChinese: '虎',
    element: 'Fire',
    mode: 'love',
    modeLabel: 'Love Decree',
    mainText: 'FIERCE LOVE CLAIMS YOU',
    testimonial: "The decree 'FIERCE LOVE CLAIMS YOU' appeared right before I met my now-fiancée. As a Tiger, I needed that push to open my heart. Thank you, Fire Horse!",
    talismanImage: '/assets/examples/david-williams-tiger-love.png',
    revealLink: 'https://redhorse-omega.vercel.app/reveal?session_id=admin_test_cefcf13b-6b18-44b3-9fb1-29d4a16c079d',
  },
  {
    id: 4,
    name: 'Sarah Davis',
    dob: '04/03/1987',
    age: 39,
    zodiac: 'rabbit',
    zodiacChinese: '兔',
    element: 'Fire',
    mode: 'shield',
    modeLabel: 'Protective Mantra',
    mainText: 'FLAME SHIELDS PEACE',
    testimonial: "As a sensitive Rabbit, I needed protection. 'FLAME SHIELDS PEACE' has become my daily meditation. The chaos of 2026 hasn't touched me since.",
    talismanImage: '/assets/examples/sarah-davis-rabbit-shield.png',
    revealLink: 'https://redhorse-omega.vercel.app/reveal?session_id=admin_test_edad3cb2-20dd-47ec-926d-a2ff4e2dd103',
  },
  {
    id: 5,
    name: 'James Miller',
    dob: '09/17/1988',
    age: 38,
    zodiac: 'dragon',
    zodiacChinese: '龙',
    element: 'Earth',
    mode: 'wealth',
    modeLabel: 'Lucky Numbers',
    mainText: '08-17-28-58-66-88',
    testimonial: "Dragon and Fire Horse together - pure magic! My lucky numbers hit three times in the first month. The Oracle understands the Dragon's fortune.",
    talismanImage: '/assets/examples/james-miller-dragon-wealth.png',
    revealLink: 'https://redhorse-omega.vercel.app/reveal?session_id=admin_test_91da361a-e284-4b91-877c-d0f2d49e7e5c',
  },
  {
    id: 6,
    name: 'Emily Brown',
    dob: '02/28/1989',
    age: 37,
    zodiac: 'snake',
    zodiacChinese: '蛇',
    element: 'Earth',
    mode: 'power',
    modeLabel: 'Strategic Motto',
    mainText: 'STRIKE FROM SILENCE',
    testimonial: "'STRIKE FROM SILENCE' - three words that transformed my business strategy. As a Snake, I already had cunning. Now I have direction.",
    talismanImage: '/assets/examples/emily-brown-snake-power.png',
    revealLink: 'https://redhorse-omega.vercel.app/reveal?session_id=admin_test_64cece9c-22c5-48c1-ac59-9f0d707b28ba',
  },
  {
    id: 7,
    name: 'Robert Jones',
    dob: '06/12/1990',
    age: 36,
    zodiac: 'horse',
    zodiacChinese: '马',
    element: 'Metal',
    mode: 'love',
    modeLabel: 'Love Decree',
    mainText: 'WILD HEARTS BECOME ONE',
    testimonial: "As a Horse receiving guidance from the Fire Horse - it's like family! 'WILD HEARTS BECOME ONE' led me to reconnect with my soulmate.",
    talismanImage: '/assets/examples/robert-jones-horse-love.png',
    revealLink: 'https://redhorse-omega.vercel.app/reveal?session_id=admin_test_9d132c19-de5d-48fd-9881-ca347b638a28',
  },
  {
    id: 8,
    name: 'Lisa Anderson',
    dob: '08/25/1991',
    age: 35,
    zodiac: 'goat',
    zodiacChinese: '羊',
    element: 'Metal',
    mode: 'shield',
    modeLabel: 'Protective Mantra',
    mainText: 'PEACE IS ARMOR',
    testimonial: "The gentle Goat needs protection in the Fire Horse year. 'PEACE IS ARMOR' has kept my family safe through every storm.",
    talismanImage: '/assets/examples/lisa-anderson-goat-shield.png',
    revealLink: 'https://redhorse-omega.vercel.app/reveal?session_id=admin_test_0c39d3d3-5f74-44eb-b564-d6f8144c1941',
  },
  {
    id: 9,
    name: 'William Taylor',
    dob: '05/10/1980',
    age: 46,
    zodiac: 'monkey',
    zodiacChinese: '猴',
    element: 'Metal',
    mode: 'wealth',
    modeLabel: 'Lucky Numbers',
    mainText: '09-18-28-68-80-88',
    testimonial: "Monkey cleverness plus Fire Horse fortune equals winning! My numbers came up twice. $8.88 for this Oracle was the best investment I've made.",
    talismanImage: '/assets/examples/william-taylor-monkey-wealth.png',
    revealLink: 'https://redhorse-omega.vercel.app/reveal?session_id=admin_test_f7e7b3e2-9f03-47ec-9444-c8acb7275d4c',
  },
  {
    id: 10,
    name: 'Maria Garcia',
    dob: '10/30/1993',
    age: 33,
    zodiac: 'rooster',
    zodiacChinese: '鸡',
    element: 'Water',
    mode: 'power',
    modeLabel: 'Strategic Motto',
    mainText: 'DROWN ALL RIVALS',
    testimonial: "'DROWN ALL RIVALS' - fierce but true. As a Rooster, it reminded me to be first, be bold, be heard. My confidence has never been higher.",
    talismanImage: '/assets/examples/maria-garcia-rooster-power.png',
    revealLink: 'https://redhorse-omega.vercel.app/reveal?session_id=admin_test_4dd8dbc6-67a3-4dcf-9f2b-c83c8baafe71',
  },
  {
    id: 11,
    name: 'Christopher Lee',
    dob: '01/14/1994',
    age: 32,
    zodiac: 'dog',
    zodiacChinese: '狗',
    element: 'Wood',
    mode: 'love',
    modeLabel: 'Love Decree',
    mainText: 'FAITHFUL HEART FINDS HOME',
    testimonial: "Dogs are loyal, and 'FAITHFUL HEART FINDS HOME' confirmed what I needed to hear. I proposed that week. She said yes. The Oracle knew.",
    talismanImage: '/assets/examples/christopher-lee-dog-love.png',
    revealLink: 'https://redhorse-omega.vercel.app/reveal?session_id=admin_test_bbda455f-f989-4da8-b323-6f21d2030926',
  },
  {
    id: 12,
    name: 'Jessica Martinez',
    dob: '12/05/1995',
    age: 31,
    zodiac: 'pig',
    zodiacChinese: '猪',
    element: 'Wood',
    mode: 'shield',
    modeLabel: 'Protective Mantra',
    mainText: 'ROOTS ANCHOR PEACE',
    testimonial: "The Pig attracts abundance but also envy. 'ROOTS ANCHOR PEACE' protects everything I've built. I sleep peacefully knowing the Fire Horse guards me.",
    talismanImage: '/assets/examples/jessica-martinez-pig-shield.png',
    revealLink: 'https://redhorse-omega.vercel.app/reveal?session_id=admin_test_dd6bb61b-24cf-4fe1-9602-8192a39bf478',
  },
];

// Get emoji for mode
export const MODE_EMOJI: Record<string, string> = {
  wealth: '🎲',
  power: '⚔️',
  love: '❤️',
  shield: '🛡️',
};

// Get color class for mode
export const MODE_COLOR: Record<string, string> = {
  wealth: 'text-yellow-400',
  power: 'text-red-500',
  love: 'text-pink-400',
  shield: 'text-blue-400',
};
