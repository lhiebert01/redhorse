import { PRODUCT_MODES, FocusMode } from '@/constants/modes';
import { ZodiacAnimal, ZodiacElement } from '@/constants/zodiac-data';

export function buildTextPrompt(params: {
  birthDate: string;
  focusMode: FocusMode;
  zodiacSign: ZodiacAnimal;
  zodiacElement: ZodiacElement;
  fireHorseAdvice: string;
}): string {
  const mode = PRODUCT_MODES[params.focusMode];

  // MODE-SPECIFIC PROMPTS - Each mode produces a DIFFERENT type of output

  if (params.focusMode === 'wealth') {
    // WEALTH MODE: Must generate 6 lucky numbers
    return `You are the Ancient Fire Horse Oracle. Generate LUCKY NUMBERS for gambling and fortune.

USER: ${params.zodiacSign} (${params.zodiacElement}) born ${params.birthDate}

TASK: Generate 6 LUCKY NUMBERS for this person.

RULES:
- main_text MUST be exactly 6 two-digit numbers separated by dashes
- Format: XX-XX-XX-XX-XX-XX (e.g., "08-18-28-38-48-88")
- Numbers between 01 and 99
- Include lucky 8s (prosperity in Chinese culture)
- Make numbers feel mystically connected to their zodiac

RETURN ONLY THIS JSON:
{
  "main_text": "XX-XX-XX-XX-XX-XX",
  "sub_text": "${params.zodiacElement} ${params.zodiacSign}, Fire Horse 2026",
  "full_reading": "A 2-sentence prophecy about their lucky fortune in 2026, mentioning their ${params.zodiacSign} nature."
}`;
  }

  if (params.focusMode === 'power') {
    // POWER MODE: Must generate 3-word strategic motto
    return `You are the Ancient Fire Horse Oracle. Generate a STRATEGIC BATTLE MOTTO.

USER: ${params.zodiacSign} (${params.zodiacElement}) born ${params.birthDate}

TASK: Generate a 3-WORD AGGRESSIVE STRATEGIC MOTTO like Sun Tzu would write.

RULES:
- main_text MUST be exactly 3 WORDS in ALL CAPS
- Style: Military, commanding, aggressive, victorious
- Examples: "STRIKE THE NORTH", "CONQUER THEN REST", "BURN THE BRIDGES", "SEIZE ALL POWER"
- Make it personal to their ${params.zodiacSign} warrior nature

RETURN ONLY THIS JSON:
{
  "main_text": "THREE WORD MOTTO",
  "sub_text": "${params.zodiacElement} ${params.zodiacSign}, Fire Horse 2026",
  "full_reading": "A 2-sentence prophecy about their path to power in 2026, mentioning their ${params.zodiacSign} strategic strengths."
}`;
  }

  if (params.focusMode === 'love') {
    // LOVE MODE: Must generate 4-word romantic phrase
    return `You are the Ancient Fire Horse Oracle. Generate a ROMANTIC DESTINY DECREE.

USER: ${params.zodiacSign} (${params.zodiacElement}) born ${params.birthDate}

TASK: Generate a 4-WORD ROMANTIC DESTINY PHRASE about love and relationships.

RULES:
- main_text MUST be exactly 4 WORDS in Title Case or ALL CAPS
- Style: Romantic, destined, passionate, heartfelt
- Examples: "LOVE FINDS YOU WORTHY", "Hearts Unite In Fire", "YOUR SOULMATE APPROACHES NOW", "Passion Ignites This Year"
- Make it personal to their ${params.zodiacSign} romantic nature

RETURN ONLY THIS JSON:
{
  "main_text": "Four Word Love Phrase",
  "sub_text": "${params.zodiacElement} ${params.zodiacSign}, Fire Horse 2026",
  "full_reading": "A 2-sentence prophecy about their love destiny in 2026, mentioning their ${params.zodiacSign} romantic qualities."
}`;
  }

  if (params.focusMode === 'shield') {
    // SHIELD MODE: Must generate 3-word protective mantra
    return `You are the Ancient Fire Horse Oracle. Generate a PROTECTIVE SACRED MANTRA.

USER: ${params.zodiacSign} (${params.zodiacElement}) born ${params.birthDate}

TASK: Generate a 3-WORD PROTECTIVE MANTRA for safety and peace.

RULES:
- main_text MUST be exactly 3 WORDS in ALL CAPS
- Style: Protective, sacred, shielding, peaceful
- Examples: "FIRE SHIELDS ME", "CHAOS CANNOT ENTER", "ANCESTORS GUARD ME", "PEACE SURROUNDS ME"
- Make it personal to their ${params.zodiacSign} protective nature

RETURN ONLY THIS JSON:
{
  "main_text": "THREE WORD MANTRA",
  "sub_text": "${params.zodiacElement} ${params.zodiacSign}, Fire Horse 2026",
  "full_reading": "A 2-sentence prophecy about their protection in 2026, mentioning their ${params.zodiacSign} guardian strengths."
}`;
  }

  // Fallback (should never reach here)
  return `Generate a mystical prophecy for ${params.zodiacSign} in the Year of the Fire Horse 2026.
Return JSON: {"main_text": "DESTINY AWAITS", "sub_text": "${params.zodiacElement} ${params.zodiacSign}", "full_reading": "The Fire Horse brings change."}`;
}

export function buildImagePrompt(params: {
  focusMode: FocusMode;
  mainText: string;
  subText: string;
  zodiacSign: ZodiacAnimal;
}): string {
  const mode = PRODUCT_MODES[params.focusMode];

  // Authentic Chinese zodiac animal descriptions with cultural accuracy
  const zodiacDescriptions: Record<string, {
    chinese: string;
    description: string;
    symbolism: string;
    pose: string;
  }> = {
    Rat: {
      chinese: '鼠',
      description: 'An intelligent and alert rat with sleek fur, bright knowing eyes, and a long graceful tail. Small but mighty, depicted with cunning wisdom.',
      symbolism: 'wealth, surplus, cleverness',
      pose: 'perched alertly on ancient coins or grain, whiskers twitching with intelligence',
    },
    Ox: {
      chinese: '牛',
      description: 'A powerful and majestic water buffalo with massive curved horns, muscular build, and patient wise eyes. Symbol of diligence and strength.',
      symbolism: 'hard work, reliability, strength',
      pose: 'standing steadfast on a mountain path, embodying unwavering determination',
    },
    Tiger: {
      chinese: '虎',
      description: 'A magnificent Chinese tiger with bold orange and black stripes, fierce golden eyes, and powerful muscular frame. King of the mountains.',
      symbolism: 'bravery, power, protection from evil',
      pose: 'roaring majestically or prowling through bamboo forest with commanding presence',
    },
    Rabbit: {
      chinese: '兔',
      description: 'An elegant jade-white rabbit with long graceful ears, soft luminous fur, and gentle knowing eyes. Associated with the Moon Goddess Chang\'e.',
      symbolism: 'longevity, peace, prosperity, the moon',
      pose: 'seated serenely beneath a full moon, surrounded by osmanthus flowers',
    },
    Dragon: {
      chinese: '龙',
      description: 'A magnificent Chinese Long dragon with serpentine body covered in golden scales, deer antlers, tiger paws, eagle claws, and flowing whiskers. Five-clawed imperial dragon.',
      symbolism: 'power, nobility, luck, success',
      pose: 'soaring through clouds, chasing or holding the flaming pearl of wisdom',
    },
    Snake: {
      chinese: '蛇',
      description: 'A mystical and elegant serpent with iridescent scales that shimmer between emerald and gold, wise hypnotic eyes, and graceful coiling form.',
      symbolism: 'wisdom, mystery, grace, transformation',
      pose: 'coiled around a sacred peach branch or ancient scroll, tongue flickering with ancient knowledge',
    },
    Horse: {
      chinese: '马',
      description: 'A spirited and noble horse with flowing mane and tail, powerful athletic build, and eyes burning with freedom and passion. The Fire Horse blazes with actual flames.',
      symbolism: 'success, loyalty, freedom, travel',
      pose: 'galloping through clouds or rearing triumphantly with mane ablaze in sacred fire',
    },
    Goat: {
      chinese: '羊',
      description: 'A gentle and artistic goat (or ram) with elegant curved horns, soft flowing coat, and serene contemplative expression. Symbol of artistic creativity.',
      symbolism: 'peace, harmony, creativity, good fortune',
      pose: 'standing peacefully on a misty mountain peak among clouds and pine trees',
    },
    Monkey: {
      chinese: '猴',
      description: 'A clever and playful golden monkey with intelligent mischievous eyes, agile limbs, and expressive face. Inspired by the legendary Sun Wukong.',
      symbolism: 'cleverness, curiosity, mischief, problem-solving',
      pose: 'leaping dynamically through clouds or perched on a magical cloud, staff in hand',
    },
    Rooster: {
      chinese: '鸡',
      description: 'A proud and magnificent rooster with spectacular iridescent plumage in red, gold, green and blue, impressive tail feathers, and commanding crow.',
      symbolism: 'confidence, punctuality, honesty, protection',
      pose: 'crowing at dawn atop a rock, feathers catching the first golden rays of sunlight',
    },
    Dog: {
      chinese: '狗',
      description: 'A loyal and noble guardian dog with alert upright ears, intelligent devoted eyes, and strong protective stance. Often depicted as a Fu Dog (lion-dog).',
      symbolism: 'loyalty, protection, justice, faithfulness',
      pose: 'standing guard with unwavering vigilance, or as a celestial Fu Dog with flowing mane',
    },
    Pig: {
      chinese: '猪',
      description: 'A prosperous and content pig with round friendly face, plump well-fed body symbolizing abundance, and gentle kind eyes.',
      symbolism: 'wealth, good fortune, honesty, abundance',
      pose: 'resting contentedly among gold ingots and lucky coins, surrounded by prosperity',
    },
  };

  const zodiac = zodiacDescriptions[params.zodiacSign] || {
    chinese: '',
    description: params.zodiacSign.toLowerCase(),
    symbolism: 'fortune and destiny',
    pose: 'in a powerful stance',
  };

  // Art style variations for uniqueness
  const artStyles = [
    'traditional Chinese ink wash painting (水墨画) with masterful brush strokes',
    'Song Dynasty court painting style with meticulous detail and rich colors',
    'Dunhuang mural art style with flowing celestial aesthetics',
    'modern digital art fusion of traditional Chinese painting and cinematic lighting',
    'Tang Dynasty silk painting style with elegant gold leaf accents',
  ];

  const randomStyle = artStyles[Math.floor(Math.random() * artStyles.length)];

  // Background elements for variety
  const backgroundElements = [
    'swirling auspicious clouds (祥云) in red and gold',
    'sacred mountains shrouded in mystical mist',
    'flowing celestial ribbons and divine light rays',
    'ancient temple architecture silhouetted against a crimson sky',
    'blooming peonies and plum blossoms floating in the air',
  ];

  const randomBackground = backgroundElements[Math.floor(Math.random() * backgroundElements.length)];

  return `Create a breathtaking vertical Chinese zodiac talisman artwork (9:16 aspect ratio) for the Year of the Fire Horse 2026 (丙午年).

=== PRIMARY SUBJECT: THE FIRE HORSE (火马) ===
A magnificent, divine Fire Horse as the central dominant figure:
- Powerful muscular horse rearing dramatically or galloping through the heavens
- Mane and tail made of flowing sacred flames in brilliant orange, red, and gold
- Hooves trailing sparks, embers, and mystical fire
- Eyes blazing with divine power and ancient wisdom
- Body radiating with inner fire energy, partially translucent with flame
- Majestic and awe-inspiring, worthy of worship

=== SECONDARY ELEMENT: ${params.zodiacSign.toUpperCase()} (${zodiac.chinese}) ===
${zodiac.description}
Symbolizing: ${zodiac.symbolism}
Depicted: ${zodiac.pose}
- Position this as a smaller complementary element, perhaps in the lower portion or corner
- Show the relationship between the user's zodiac and the Fire Horse year

=== VISUAL THEME FOR ${mode.name.toUpperCase()} ===
${mode.visualTheme}

=== ART STYLE ===
${randomStyle}
- Color palette: Imperial red (中国红), brilliant gold (金色), deep black (墨黑), ember orange
- Include traditional Chinese artistic elements: flowing clouds, sacred geometry, auspicious patterns
- Background: ${randomBackground}
- Floating embers, sparks, and mystical particles throughout
- Dramatic cinematic lighting with volumetric god rays
- 8K ultra-detailed, museum-quality artwork

=== TEXT OVERLAY (CRITICAL - MUST BE PERFECTLY LEGIBLE) ===
Integrate these text elements as part of the sacred talisman design:

1. TOP: "2026 | ${zodiac.chinese}" (small, elegant)
2. CENTER: "${params.mainText}" (large, glowing gold calligraphy, this is the main decree)
3. BOTTOM: "${params.subText}" (medium, white/silver elegant text)

TEXT REQUIREMENTS:
- All text MUST be crisp, clear, and perfectly spelled
- Main text should appear to glow with golden divine light
- Use elegant calligraphy-style fonts
- Text should feel like it's part of the mystical artwork, not overlaid

=== CULTURAL AUTHENTICITY ===
This artwork must impress Chinese audiences who understand traditional zodiac symbolism:
- Respect traditional depictions while adding modern artistic flair
- Include subtle auspicious elements (clouds, flames, sacred geometry)
- The Fire Horse should evoke the power and rarity of this once-in-60-years event
- Create something worthy of being a treasured personal talisman

Make this image SPECTACULAR, UNIQUE, and PERSONALLY MEANINGFUL.`;
}
