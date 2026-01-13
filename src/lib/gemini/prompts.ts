import { PRODUCT_MODES, FocusMode } from '@/constants/modes';
import { ZodiacAnimal, ZodiacElement } from '@/constants/zodiac-data';

export function buildTextPrompt(params: {
  birthDate: string;
  focusMode: FocusMode;
  zodiacSign: ZodiacAnimal;
  zodiacElement: ZodiacElement;
  fireHorseAdvice: string;
}): string {
  // MODE-SPECIFIC PROMPTS - Each mode produces a DIFFERENT type of output

  if (params.focusMode === 'wealth') {
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
    return `You are the Ancient Fire Horse Oracle. Generate a ROMANTIC DESTINY DECREE.

USER: ${params.zodiacSign} (${params.zodiacElement}) born ${params.birthDate}

TASK: Generate a 4-WORD ROMANTIC DESTINY PHRASE about love and relationships.

RULES:
- main_text MUST be exactly 4 WORDS in Title Case or ALL CAPS
- Style: Romantic, destined, passionate, heartfelt
- Examples: "LOVE FINDS YOU WORTHY", "Hearts Unite In Fire", "YOUR SOULMATE APPROACHES NOW"
- Make it personal to their ${params.zodiacSign} romantic nature

RETURN ONLY THIS JSON:
{
  "main_text": "Four Word Love Phrase",
  "sub_text": "${params.zodiacElement} ${params.zodiacSign}, Fire Horse 2026",
  "full_reading": "A 2-sentence prophecy about their love destiny in 2026, mentioning their ${params.zodiacSign} romantic qualities."
}`;
  }

  if (params.focusMode === 'shield') {
    return `You are the Ancient Fire Horse Oracle. Generate a PROTECTIVE SACRED MANTRA.

USER: ${params.zodiacSign} (${params.zodiacElement}) born ${params.birthDate}

TASK: Generate a 3-WORD PROTECTIVE MANTRA for safety and peace.

RULES:
- main_text MUST be exactly 3 WORDS in ALL CAPS
- Style: Protective, sacred, shielding, peaceful
- Examples: "FIRE SHIELDS ME", "CHAOS CANNOT ENTER", "ANCESTORS GUARD ME"
- Make it personal to their ${params.zodiacSign} protective nature

RETURN ONLY THIS JSON:
{
  "main_text": "THREE WORD MANTRA",
  "sub_text": "${params.zodiacElement} ${params.zodiacSign}, Fire Horse 2026",
  "full_reading": "A 2-sentence prophecy about their protection in 2026, mentioning their ${params.zodiacSign} guardian strengths."
}`;
  }

  // Fallback
  return `Generate a mystical prophecy for ${params.zodiacSign}.
Return JSON: {"main_text": "DESTINY AWAITS", "sub_text": "${params.zodiacElement} ${params.zodiacSign}", "full_reading": "The Fire Horse brings change."}`;
}

// ============================================================================
// ART STYLE DEFINITIONS - Historical Chinese Painting Styles
// ============================================================================

interface ArtStyle {
  name: string;
  prompt: string;
  colors: string;
}

const ART_STYLES: ArtStyle[] = [
  {
    name: 'Dunhuang',
    prompt: 'Dunhuang Mogao Cave mural style. Apsaras (flying celestial beings) aesthetic, floating silk ribbons, flowing ornate lines, mystical and religious grandeur. Texture of ancient cracked plaster walls. Ornate circular medallion borders.',
    colors: 'Vibrant mineral pigments: deep azurite blue, malachite green, oxidized vermilion red, heavy gold leaf accents, aged ochre background',
  },
  {
    name: 'Ink Wash',
    prompt: 'Traditional Chinese ink wash painting (shuimo). Ethereal, fluid brush strokes utilizing negative space (liubai). Minimalist but deeply expressive. Silk scroll texture.',
    colors: 'Deep black ink, varying shades of grey wash, with striking accents of cinnabar red and brilliant gold leaf',
  },
  {
    name: 'Song Dynasty',
    prompt: 'Song Dynasty meticulous brushwork (gongbi). Highly realistic, elegant, refined, and subtle. Silk texture background with delicate gradients.',
    colors: 'Muted vintage tones: tea-green, aged ochre, pale rose pink, and rich cinnabar red with gold highlights',
  },
  {
    name: 'Tang Dynasty',
    prompt: 'Tang Dynasty opulent imperial style. Bold, round majestic shapes, confident and ornamental. Reminiscent of Sancai (three-color) glazed pottery. Royal grandeur.',
    colors: 'Rich amber, deep emerald green, creamy ivory white against a backdrop of imperial vermilion red and burnished gold',
  },
];

// ============================================================================
// MODE-SPECIFIC VISUAL THEMES
// ============================================================================

interface ModeTheme {
  atmosphere: string;
  symbols: string;
}

const MODE_THEMES: Record<FocusMode, ModeTheme> = {
  wealth: {
    atmosphere: 'Abundance, luxury, prosperity, and flowing fortune',
    symbols: 'Gold sycee ingots, blooming peony flowers, flowing water or waterfalls, ancient lucky coins, treasure chests, koi fish',
  },
  power: {
    atmosphere: 'Authority, strength, strategy, and dominance',
    symbols: 'Mountain peaks piercing clouds, stylized storm clouds, dragon scales pattern, ancient weaponry or imperial scepters, war banners',
  },
  love: {
    atmosphere: 'Harmony, romance, passion, and destined connection',
    symbols: 'Peach blossoms in full bloom, paired Mandarin ducks or butterflies, red threads of fate, soft glowing lanterns, heart motifs',
  },
  shield: {
    atmosphere: 'Protection, warding, spiritual intensity, and sacred safety',
    symbols: 'Bagua (八卦) mirrors, geometric barrier patterns, guardian Fu lion motifs, armor textures, protective talismanic seals',
  },
};

// ============================================================================
// ZODIAC ANIMAL DEFINITIONS
// ============================================================================

interface ZodiacVisual {
  chinese: string;
  description: string;
  pose: string;
}

const ZODIAC_VISUALS: Record<string, ZodiacVisual> = {
  Rat: {
    chinese: '鼠',
    description: 'A clever, alert rat with sleek fur, bright intelligent eyes, and a graceful long tail. Small but mighty, radiating cunning wisdom.',
    pose: 'perched alertly upon ancient coins or grain stores, whiskers twitching with shrewd intelligence',
  },
  Ox: {
    chinese: '牛',
    description: 'A powerful, majestic water buffalo with massive curved horns, muscular build, and patient wise eyes. Symbol of tireless diligence.',
    pose: 'standing steadfast and immovable on a mountain path, embodying unwavering determination',
  },
  Tiger: {
    chinese: '虎',
    description: 'A magnificent Chinese tiger with bold orange and black stripes, fierce golden eyes, and powerful muscular frame. King of the mountains.',
    pose: 'roaring majestically atop a rocky outcrop or prowling through mystical bamboo forest',
  },
  Rabbit: {
    chinese: '兔',
    description: 'An elegant jade-white rabbit with long graceful ears, soft luminous fur, and gentle knowing eyes. Associated with the Moon Goddess Chang\'e.',
    pose: 'seated serenely beneath a luminous full moon, surrounded by osmanthus flowers and soft clouds',
  },
  Dragon: {
    chinese: '龙',
    description: 'A magnificent Chinese Long dragon with serpentine body covered in golden scales, deer antlers, tiger paws, eagle claws, and flowing whiskers. Five-clawed imperial dragon.',
    pose: 'soaring majestically through swirling clouds, chasing or clutching the flaming pearl of wisdom',
  },
  Snake: {
    chinese: '蛇',
    description: 'A mystical, elegant serpent with iridescent scales shimmering between emerald and gold, wise hypnotic eyes, and graceful coiling form.',
    pose: 'coiled elegantly around a sacred peach branch or ancient wisdom scroll, tongue flickering',
  },
  Horse: {
    chinese: '马',
    description: 'A spirited, noble horse with flowing mane and tail, powerful athletic build, and eyes burning with freedom. As a Fire Horse, wreathed in sacred flames.',
    pose: 'galloping through celestial clouds or rearing triumphantly with mane ablaze in divine fire',
  },
  Goat: {
    chinese: '羊',
    description: 'A gentle, artistic goat (or ram) with elegant curved horns, soft flowing coat, and serene contemplative expression. Symbol of creativity.',
    pose: 'standing peacefully on a misty mountain peak among clouds and ancient pine trees',
  },
  Monkey: {
    chinese: '猴',
    description: 'A clever, playful golden monkey with intelligent mischievous eyes, agile limbs, and expressive face. Inspired by the legendary Sun Wukong.',
    pose: 'leaping dynamically through clouds or perched on a magical cloud, perhaps holding a golden staff',
  },
  Rooster: {
    chinese: '鸡',
    description: 'A proud, magnificent rooster with spectacular iridescent plumage in red, gold, green and blue, impressive tail feathers, and commanding presence.',
    pose: 'crowing triumphantly at dawn atop a rock, feathers catching the first golden rays of sunlight',
  },
  Dog: {
    chinese: '狗',
    description: 'A loyal, noble guardian dog with alert upright ears, intelligent devoted eyes, and strong protective stance. Often depicted as a celestial Fu Dog.',
    pose: 'standing guard with unwavering vigilance, or as a majestic Fu Dog with flowing mane and fierce expression',
  },
  Pig: {
    chinese: '猪',
    description: 'A prosperous, content pig with round friendly face, plump well-fed body symbolizing abundance, and gentle kind eyes.',
    pose: 'resting contentedly among gold ingots and lucky coins, surrounded by symbols of prosperity',
  },
};

// ============================================================================
// MAIN IMAGE PROMPT BUILDER
// ============================================================================

export function buildImagePrompt(params: {
  focusMode: FocusMode;
  mainText: string;
  subText: string;
  zodiacSign: ZodiacAnimal;
}): string {
  // Select random art style for variety
  const artStyle = ART_STYLES[Math.floor(Math.random() * ART_STYLES.length)];

  // Get mode-specific theme
  const modeTheme = MODE_THEMES[params.focusMode];

  // Get zodiac visual description
  const zodiac = ZODIAC_VISUALS[params.zodiacSign] || {
    chinese: '',
    description: `A mythical, sentient ${params.zodiacSign}`,
    pose: 'in a powerful, dignified stance',
  };

  return `Create a stunning, high-definition vertical digital talisman artwork (9:16 aspect ratio) for the Year of the Fire Horse 2026.

=== SUBJECT ===
Primary: A majestic, mythical FIRE HORSE as the central dominant figure. The horse should be wreathed in stylized, swirling vermilion flames and golden clouds, radiating immense power and divine energy. Flaming mane and tail, hooves trailing embers and sparks.

Secondary: A culturally authentic depiction of the ${params.zodiacSign} (${zodiac.chinese}). ${zodiac.description} Depicted ${zodiac.pose}. Position as a smaller complementary element in the lower portion or corner, showing the harmonious relationship with the Fire Horse.

=== ART STYLE ===
${artStyle.prompt}

=== COLOR PALETTE ===
Dominant palette featuring the Vermilion Red of the Fire Horse mixed with:
${artStyle.colors}

=== THEME & ATMOSPHERE ===
The image must radiate the energy of: ${modeTheme.atmosphere}
Integrate subtle visual elements of: ${modeTheme.symbols}

=== COMPOSITION ===
- Center the Fire Horse like a sacred tarot card or divine amulet
- Ornate decorative borders with traditional Chinese patterns
- Leave slight negative space at the top and bottom for text overlays
- Symmetrical, balanced composition befitting a treasured talisman
- Include floating Apsaras (celestial beings) or flowing ribbon motifs in corners

=== TEXT OVERLAYS (CRITICAL - Must be perfectly legible) ===
1. TOP BANNER: "YEAR OF THE FIRE HORSE 2026" (elegant, golden text)
2. CENTER: "${params.mainText}" (large, glowing gold calligraphy - this is the main decree)
3. BOTTOM BANNER: "${params.subText}" (refined white/silver text)

=== TECHNICAL REQUIREMENTS ===
- 8K resolution, hyper-detailed, masterpiece quality
- High contrast with rich, saturated colors
- Texture of aged, precious materials (silk, gold leaf, mineral pigments)
- No blurry borders, crisp edges throughout
- The overall vibe: ancient, mystical, authoritative, opulent, sacred

=== IMPORTANT ===
- Do NOT generate random text or characters inside the image
- All text must match EXACTLY what is specified above
- The Fire Horse must appear divine and awe-inspiring
- This should look like a treasured artifact worth $888, not $8

Make this artwork MUSEUM-QUALITY, utterly BREATHTAKING, and worthy of being a sacred personal talisman.`;
}
