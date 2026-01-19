import { PRODUCT_MODES, FocusMode } from '@/constants/modes';
import { ZodiacAnimal, ZodiacElement } from '@/constants/zodiac-data';

export function buildTextPrompt(params: {
  birthDate: string;
  focusMode: FocusMode;
  zodiacSign: ZodiacAnimal;
  zodiacElement: ZodiacElement;
  fireHorseAdvice: string;
}): string {
  // MODE-SPECIFIC PROMPTS - Each mode produces STRICTLY RELEVANT content only

  if (params.focusMode === 'wealth') {
    return `You are the Ancient Fire Horse Oracle. Generate LUCKY NUMBERS and a WEALTH-ONLY prophecy.

USER: ${params.zodiacSign} (${params.zodiacElement}) born ${params.birthDate}

TASK: Generate 6 LUCKY NUMBERS and a WEALTH-SPECIFIC prophecy.

RULES:
- main_text MUST be exactly 6 two-digit numbers separated by dashes
- Format: XX-XX-XX-XX-XX-XX (e.g., "08-18-28-38-48-88")
- Numbers between 01 and 99
- Include lucky 8s (prosperity in Chinese culture)
- Make numbers feel mystically connected to their ${params.zodiacSign} zodiac

CRITICAL: full_reading must ONLY discuss WEALTH topics:
- Money, finances, investments, gambling luck
- Business opportunities, career earnings, windfalls
- Financial decisions, prosperity timing, lucky months for money
- DO NOT mention love, romance, relationships, health, or protection

RETURN ONLY THIS JSON:
{
  "main_text": "XX-XX-XX-XX-XX-XX",
  "sub_text": "${params.zodiacElement} ${params.zodiacSign}, Fire Horse 2026",
  "full_reading": "A 3-4 sentence WEALTH prophecy for 2026. How does the Fire Horse energy affect the ${params.zodiacSign}'s financial fortune? When are lucky months for money? What financial opportunities await? Only discuss money/wealth/prosperity."
}`;
  }

  if (params.focusMode === 'power') {
    return `You are the Ancient Fire Horse Oracle. Generate a STRATEGIC BATTLE MOTTO and POWER-ONLY prophecy.

USER: ${params.zodiacSign} (${params.zodiacElement}) born ${params.birthDate}

TASK: Generate a 3-WORD STRATEGIC MOTTO and POWER-SPECIFIC prophecy.

RULES:
- main_text MUST be exactly 3 WORDS in ALL CAPS
- Style: Military, commanding, aggressive, victorious
- Examples: "STRIKE THE NORTH", "CONQUER THEN REST", "BURN THE BRIDGES", "SEIZE ALL POWER"
- Make it personal to their ${params.zodiacSign} warrior nature

CRITICAL: full_reading must ONLY discuss POWER topics:
- Career advancement, leadership, authority, dominance
- Strategic moves, competition, rivals, victories
- Professional success, promotions, influence, reputation
- DO NOT mention love, romance, money/gambling, health, or protection

RETURN ONLY THIS JSON:
{
  "main_text": "THREE WORD MOTTO",
  "sub_text": "${params.zodiacElement} ${params.zodiacSign}, Fire Horse 2026",
  "full_reading": "A 3-4 sentence POWER prophecy for 2026. How does the Fire Horse energy affect the ${params.zodiacSign}'s path to dominance? What strategic advantages do they have? When should they strike? Only discuss power/career/authority."
}`;
  }

  if (params.focusMode === 'love') {
    return `You are the Ancient Fire Horse Oracle. Generate a ROMANTIC DESTINY DECREE and LOVE-ONLY prophecy.

USER: ${params.zodiacSign} (${params.zodiacElement}) born ${params.birthDate}

TASK: Generate a 4-WORD ROMANTIC PHRASE and LOVE-SPECIFIC prophecy.

RULES:
- main_text MUST be exactly 4 WORDS in Title Case or ALL CAPS
- Style: Romantic, destined, passionate, heartfelt
- Examples: "LOVE FINDS YOU WORTHY", "Hearts Unite In Fire", "YOUR SOULMATE APPROACHES NOW"
- Make it personal to their ${params.zodiacSign} romantic nature

CRITICAL: full_reading must ONLY discuss LOVE topics:
- Romance, relationships, soulmates, dating, marriage
- Emotional connections, passion, intimacy, partnership
- Lucky months for love, compatible signs, romantic opportunities
- DO NOT mention money, career, power, health, or protection

RETURN ONLY THIS JSON:
{
  "main_text": "Four Word Love Phrase",
  "sub_text": "${params.zodiacElement} ${params.zodiacSign}, Fire Horse 2026",
  "full_reading": "A 3-4 sentence LOVE prophecy for 2026. How does the Fire Horse energy affect the ${params.zodiacSign}'s romantic destiny? When will love bloom? What type of partner is destined? Only discuss love/romance/relationships."
}`;
  }

  if (params.focusMode === 'shield') {
    return `You are the Ancient Fire Horse Oracle. Generate a PROTECTIVE MANTRA and PROTECTION-ONLY prophecy.

USER: ${params.zodiacSign} (${params.zodiacElement}) born ${params.birthDate}

TASK: Generate a 3-WORD PROTECTIVE MANTRA and PROTECTION-SPECIFIC prophecy.

RULES:
- main_text MUST be exactly 3 WORDS in ALL CAPS
- Style: Protective, sacred, shielding, peaceful
- Examples: "FIRE SHIELDS ME", "CHAOS CANNOT ENTER", "ANCESTORS GUARD ME"
- Make it personal to their ${params.zodiacSign} protective nature

CRITICAL: full_reading must ONLY discuss PROTECTION topics:
- Safety, security, health, spiritual protection
- Warding off negativity, avoiding danger, staying safe
- Peaceful periods, times to be cautious, protective actions
- DO NOT mention money, career, power, or romantic love

RETURN ONLY THIS JSON:
{
  "main_text": "THREE WORD MANTRA",
  "sub_text": "${params.zodiacElement} ${params.zodiacSign}, Fire Horse 2026",
  "full_reading": "A 3-4 sentence PROTECTION prophecy for 2026. How does the Fire Horse energy protect the ${params.zodiacSign}? What dangers should they avoid? When should they be cautious? Only discuss protection/safety/health."
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
// ZODIAC ANIMAL BASE DEFINITIONS
// ============================================================================

interface ZodiacVisual {
  chinese: string;
  description: string;
  pose: string;
}

const ZODIAC_BASE: Record<string, ZodiacVisual> = {
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
    description: 'A spirited, noble horse with flowing mane and tail, powerful athletic build, and eyes burning with freedom.',
    pose: 'galloping through celestial clouds or rearing triumphantly',
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
// ELEMENT-SPECIFIC VISUAL MODIFIERS (60 unique Element+Animal combinations)
// These make each zodiac visually DISTINCT from the central Fire Horse
// ============================================================================

interface ElementModifier {
  aura: string;
  texture: string;
  colors: string;
  effect: string;
}

const ELEMENT_MODIFIERS: Record<ZodiacElement, ElementModifier> = {
  Wood: {
    aura: 'surrounded by swirling green life-force energy, sprouting vines and leaves',
    texture: 'bark-like patterns on fur/scales, moss-covered ancient appearance',
    colors: 'deep forest green, jade, spring green, brown bark, emerald highlights',
    effect: 'vines and bamboo shoots growing from hooves/claws, leaves floating around',
  },
  Fire: {
    aura: 'engulfed in sacred orange and crimson flames, smoke wisps rising',
    texture: 'ember-glowing cracks across body, volcanic heat shimmer',
    colors: 'blazing vermilion, orange flame, molten gold, ember red, ash black',
    effect: 'flames dancing from mane/fur, sparks trailing from movement, heat distortion',
  },
  Earth: {
    aura: 'grounded with golden dust particles and crystalline stone energy',
    texture: 'marble-veined patterns, terracotta-like ancient earthen surface',
    colors: 'rich ochre, terracotta, clay brown, sandstone gold, amber crystal',
    effect: 'floating stone fragments, dust motes catching light, mountain solidity',
  },
  Metal: {
    aura: 'gleaming with polished metallic light, silver-white celestial glow',
    texture: 'burnished bronze/gold surface, intricate engraved patterns',
    colors: 'brilliant silver, polished gold, bronze patina, copper sheen, steel grey',
    effect: 'reflective metallic surfaces, light refracting like jewelry, precious gleam',
  },
  Water: {
    aura: 'surrounded by flowing water streams and mist, moon-like luminescence',
    texture: 'scale-like rippling surface, pearl-smooth iridescent sheen',
    colors: 'deep ocean blue, moonlit silver, aquamarine, pearl white, midnight indigo',
    effect: 'water droplets suspended, waves flowing from body, misty atmosphere',
  },
};

// ============================================================================
// 60 MESMERIZING ELEMENT+ANIMAL PROMPT DESCRIPTIONS
// Each combination creates a VISUALLY DISTINCT character from the Fire Horse
// ============================================================================

const ELEMENT_ANIMAL_PROMPTS: Record<string, string> = {
  // === WOOD ELEMENT (Spring, Growth, Vitality) ===
  'Wood-Rat': 'A verdant Wood Rat with forest-green fur interwoven with tiny sprouting leaves, bright eyes like polished jade stones, perched on a living branch that grows golden coins as fruit. Vines curl playfully around its tail. Emanates spring vitality and clever resourcefulness.',
  'Wood-Ox': 'A mighty Wood Ox with bark-textured hide covered in moss and lichen, curved horns wrapped in flowering vines, standing among ancient bamboo groves. Cherry blossoms drift around its patient form. Embodies the unstoppable growth of nature.',
  'Wood-Tiger': 'A fierce Wood Tiger with stripes of deep forest green and bark brown, eyes burning with spring thunder energy, prowling through a bamboo forest. Leaves and flower petals swirl in its wake. The raw power of nature awakening.',
  'Wood-Rabbit': 'A gentle Wood Rabbit with soft jade-green fur, ears adorned with tiny flowering buds, nestled among spring clovers and lucky bamboo. Moonlight filters through forest canopy above. Serene as a forest glade at dawn.',
  'Wood-Dragon': 'A majestic Wood Dragon with scales of overlapping emerald leaves, antlers branching like ancient trees, soaring through clouds of cherry blossom petals. Vines trail from its serpentine body. Living embodiment of forest magic.',
  'Wood-Snake': 'A mystical Wood Snake with scales shimmering like polished jade, coiled around a sacred peach tree bearing golden fruit. Tiny flowers bloom along its spine. Wise keeper of nature\'s eternal secrets.',
  'Wood-Horse': 'A spirited Wood Horse with a mane of flowing green willow branches, hooves leaving trails of sprouting grass. DISTINCTLY DIFFERENT from the Fire Horse - no flames, instead surrounded by swirling leaves, birdsong, and spring energy. Embodies freedom through nature.',
  'Wood-Goat': 'A peaceful Wood Goat with wool like soft moss, curved horns wrapped in flowering wisteria, grazing on a hillside of wildflowers. Butterflies dance around its gentle form. Pure creative harmony with nature.',
  'Wood-Monkey': 'A clever Wood Monkey with golden-green fur, swinging through a canopy of sacred bodhi trees. Carries a staff of living wood that sprouts leaves. Mischievous as the wind through bamboo.',
  'Wood-Rooster': 'A magnificent Wood Rooster with tail feathers of green peacock iridescence, crowing at dawn from atop a blossoming plum tree. Petals scatter with each proud call. Herald of spring\'s renewal.',
  'Wood-Dog': 'A loyal Wood Dog with fur patterned like tree bark, guarding a sacred grove of ancient pines. Mushrooms grow at its steadfast paws. Protector of the forest\'s deepest secrets.',
  'Wood-Pig': 'A prosperous Wood Pig with a coat of soft green velvet, lounging contentedly among bamboo shoots and golden mushrooms. Lucky coins sprout from the earth around it. Abundance through nature\'s generosity.',

  // === FIRE ELEMENT (Summer, Passion, Transformation) ===
  'Fire-Rat': 'A blazing Fire Rat with fur of smoldering ember-orange, bright eyes like twin flames, racing across scattered gold coins that melt slightly at its touch. Smoke trails from its swift movements. Cunning ignited by passion.',
  'Fire-Ox': 'A powerful Fire Ox with hide of volcanic obsidian cracked with glowing lava lines, massive horns wreathed in sacred flames. Steam rises from its breath. Unstoppable force of transformation.',
  'Fire-Tiger': 'A terrifying Fire Tiger with stripes of blazing orange and ash black, eyes of molten gold, roaring flames from its mighty jaws. Sparks fly from its burning claws. The sun\'s ferocity incarnate.',
  'Fire-Rabbit': 'A passionate Fire Rabbit with fur of soft sunrise orange, ears tipped with gentle flames, leaping through rings of sacred fire. Red threads of fate trail behind. Love\'s eternal flame made manifest.',
  'Fire-Dragon': 'An imperial Fire Dragon with scales of blazing vermilion and gold, breathing forth rivers of divine flame, surrounded by swirling clouds of smoke and ember. The ultimate symbol of celestial fire power.',
  'Fire-Snake': 'A dangerous Fire Snake with scales of iridescent flame colors, coiled around a volcanic crystal, eyes hypnotic like dancing fire. Heat shimmers distort the air around it. Transformation through destruction.',
  'Fire-Horse': 'NOTE: When user is Fire Horse, they ARE the central Fire Horse figure. Do not duplicate. Instead, show the Fire Horse as the SOLE magnificent being - double the flames, twice the majesty, absolute divine fire energy.',
  'Fire-Goat': 'A creative Fire Goat with wool of flickering flame-orange, curved horns glowing like heated metal, standing atop volcanic rocks as an artist of destruction and creation. Inspired madness made beautiful.',
  'Fire-Monkey': 'A chaotic Fire Monkey with fur of crackling ember-gold, wielding a staff of pure flame, leaping through explosions of colorful fireworks. Pure mischievous fire energy unleashed.',
  'Fire-Rooster': 'A blazing Fire Rooster with tail feathers of pure flame in red, orange, and gold, crowing forth actual fire at the sunrise. The phoenix\'s cousin, herald of transformation.',
  'Fire-Dog': 'A fierce Fire Dog with fur of burning copper, eyes of protective flame, standing guard wreathed in protective fire. Embers fall like snow around its vigilant form. Guardian of the sacred flame.',
  'Fire-Pig': 'A warm Fire Pig with a coat of glowing sunset orange, contentedly resting beside a hearth of gold coins being forged. Prosperity through the transformative power of fire.',

  // === EARTH ELEMENT (Late Summer, Stability, Nourishment) ===
  'Earth-Rat': 'A prosperous Earth Rat with fur of rich golden-brown clay, bright amber eyes, surrounded by terracotta pots overflowing with ancient gold coins. Crystal formations grow nearby. Wealth buried deep and sure.',
  'Earth-Ox': 'An immovable Earth Ox with hide of ancient granite, horns of polished jade stone, standing like a mountain itself. Precious gems embedded in its mighty form. The foundation of all prosperity.',
  'Earth-Tiger': 'A formidable Earth Tiger with stripes of amber and sandstone, eyes of polished tiger\'s eye gemstone, prowling through a landscape of golden cliffs. Dust swirls around its heavy steps. Mountain king made flesh.',
  'Earth-Rabbit': 'A grounded Earth Rabbit with fur of soft sand-gold, sheltering in a burrow decorated with crystals and jade, surrounded by terracotta lucky charms. Quiet abundance of the centered soul.',
  'Earth-Dragon': 'A primordial Earth Dragon with scales of ancient bronze and jade, coiled around a mountain peak, clutching the pearl of wisdom. Clouds of golden dust swirl around its eternal form. Guardian of hidden treasures.',
  'Earth-Snake': 'A wise Earth Snake with scales of polished amber and brown agate, coiled within an ancient pottery vessel filled with gold coins. Eyes like precious stones. Keeper of buried wisdom.',
  'Earth-Horse': 'A steadfast Earth Horse with coat of rich clay brown, mane of golden wheat, hooves of polished stone. DISTINCTLY DIFFERENT from the Fire Horse - no flames, instead grounded power, dust clouds, mountain stability. Freedom through solid foundation.',
  'Earth-Goat': 'A serene Earth Goat with wool of creamy sandstone color, horns of crystallized minerals, standing atop a terracotta plateau at sunset. Pottery and jade artifacts surround it. Artistry from the earth itself.',
  'Earth-Monkey': 'A grounded Earth Monkey with fur of warm ochre, playing with ancient terracotta warrior figurines and jade jewelry. Surrounded by archaeological treasures. Clever finder of buried riches.',
  'Earth-Rooster': 'A proud Earth Rooster with feathers of bronze, copper, and gold metallic sheen, standing on an ancient bronze bell at sunrise. Precious artifacts scattered below. Herald of enduring prosperity.',
  'Earth-Dog': 'A loyal Earth Dog with fur like polished clay, standing guard before an ancient terracotta tomb entrance. Jade ornaments adorn its noble form. Eternal guardian of sacred grounds.',
  'Earth-Pig': 'A wealthy Earth Pig with skin of warm golden clay, lounging in a pit of ancient gold coins and jade ingots. Terracotta good luck charms surround it. Ultimate symbol of buried treasure found.',

  // === METAL ELEMENT (Autumn, Precision, Value) ===
  'Metal-Rat': 'A precious Metal Rat with fur of burnished silver, eyes like polished diamonds, scampering across a treasury of gold and silver coins. Light refracts brilliantly from its form. Sharp-witted keeper of wealth.',
  'Metal-Ox': 'An indomitable Metal Ox with hide of polished bronze, massive horns of pure gold, standing like a sacred treasury guardian statue. Ancient Chinese bronze vessel patterns adorn its form. Unwavering guardian of value.',
  'Metal-Tiger': 'A lethal Metal Tiger with stripes of silver and gunmetal grey, claws of razor-sharp steel, prowling through a landscape of swords and armor. Its coat reflects light like burnished metal. Precision predator.',
  'Metal-Rabbit': 'A precious Metal Rabbit with fur of soft silver-white, adorned with delicate gold jewelry, surrounded by the finest jade and pearl treasures. Moonlight makes it gleam like a living jewel. Refined elegance.',
  'Metal-Dragon': 'A magnificent Metal Dragon with scales of overlapping gold and silver coins, clutching a sphere of solid platinum, wreathed in clouds of precious metal dust. The ultimate symbol of celestial treasure.',
  'Metal-Snake': 'A deadly Metal Snake with scales of interlocking silver rings, coiled around a sword hilt, eyes like cut rubies. Gold and silver patterns run along its spine. Beautiful and dangerous as a blade.',
  'Metal-Horse': 'A noble Metal Horse with coat of polished silver, mane and tail of flowing golden threads, hooves of burnished bronze. DISTINCTLY DIFFERENT from the Fire Horse - no flames, instead metallic gleam, precision, refined power. Armor-worthy elegance.',
  'Metal-Goat': 'A refined Metal Goat with wool of silver-white silk, curved horns of pure gold, adorned with the finest jewelry and bells. Standing among precious metal artifacts. Artistic perfection in metal form.',
  'Metal-Monkey': 'A clever Metal Monkey with fur of golden bronze, wielding a golden staff, surrounded by glittering treasures and precious jewelry. Eyes sharp as cut gems. Mischievous collector of precious things.',
  'Metal-Rooster': 'A spectacular Metal Rooster with feathers of hammered gold, silver, and copper, crowing atop a pile of ancient coins. Each feather catches light like jewelry. The golden herald.',
  'Metal-Dog': 'A vigilant Metal Dog with fur of polished silver, eyes of golden amber, standing guard in full ceremonial armor. Bronze and gold ornaments adorn its loyal form. Precious guardian.',
  'Metal-Pig': 'An opulent Metal Pig with skin of rose gold, lounging among mountains of gold ingots, silver coins, and precious gems. Pure materialized prosperity. Living treasure made manifest.',

  // === WATER ELEMENT (Winter, Wisdom, Flow) ===
  'Water-Rat': 'A mystical Water Rat with fur of deep blue-black like midnight water, bright eyes reflecting moonlight, swimming through currents of silver coins. Ripples of fortune trail behind. Wisdom that flows like water.',
  'Water-Ox': 'A patient Water Ox with hide of deep indigo, massive horns like frozen waves, standing in a misty river at moonrise. Water lilies float around its calm form. Depth of ancient knowledge.',
  'Water-Tiger': 'A fearsome Water Tiger with stripes of midnight blue and silver, prowling through moonlit bamboo beside a sacred pool. Its reflection ripples with power. Fluid strength, adaptable ferocity.',
  'Water-Rabbit': 'A luminous Water Rabbit with fur of pearl-white iridescence, long ears like silk ribbons, floating serenely on a lotus leaf under the full moon. The Moon Goddess\'s own companion. Pure yin energy.',
  'Water-Dragon': 'A divine Water Dragon with scales of deep sapphire and silver, serpentine body flowing like a river through clouds of sea-foam. Pearls and rain droplets trail from its whiskers. Master of seas and storms.',
  'Water-Snake': 'A hypnotic Water Snake with scales of iridescent blue-green like abalone shell, coiled elegantly around a coral branch, surrounded by floating pearls. Ocean depth wisdom incarnate.',
  'Water-Horse': 'A fluid Water Horse with coat of midnight blue, mane and tail flowing like waterfalls, hooves dancing on wave crests. DISTINCTLY DIFFERENT from the Fire Horse - no flames, instead water spray, moonlight, ocean freedom. Graceful as the tide.',
  'Water-Goat': 'A dreamy Water Goat with wool like soft sea foam, curved horns gleaming with pearl essence, standing peacefully beside a moonlit waterfall. Mist swirls around its artistic form. Creative flow.',
  'Water-Monkey': 'A clever Water Monkey with fur of deep blue-silver, playing among magical fountains and rain, holding a pearl of wisdom. Water droplets freeze mid-splash around its agile form. Playful depth.',
  'Water-Rooster': 'A majestic Water Rooster with feathers of deep blue, silver, and iridescent pearl, crowing at the moon\'s reflection on still water. Ripples spread from its proud call. Dawn over still waters.',
  'Water-Dog': 'A faithful Water Dog with fur of deep navy blue, standing guard beside a sacred well under moonlight. Pearl drops cling to its vigilant form. Guardian of hidden depths.',
  'Water-Pig': 'A content Water Pig with skin of soft indigo, floating peacefully in a pool surrounded by lotus flowers and pearl-laden shells. Moonlight blesses its serene abundance. Prosperity through peaceful flow.',
};

// Helper function to get the full element+animal description
function getElementAnimalDescription(element: ZodiacElement, animal: ZodiacAnimal): string {
  const key = `${element}-${animal}`;
  return ELEMENT_ANIMAL_PROMPTS[key] || ZODIAC_BASE[animal]?.description || `A mystical ${element} ${animal}`;
}

// ============================================================================
// MAIN IMAGE PROMPT BUILDER - CINEMATIC 3D MASTERPIECE STYLE
// Matches the quality of the digital art cards for viral collectibility
// ============================================================================

export function buildImagePrompt(params: {
  focusMode: FocusMode;
  mainText: string;
  subText: string;
  zodiacSign: ZodiacAnimal;
  zodiacElement?: ZodiacElement;
}): string {
  // Get mode-specific theme
  const modeTheme = MODE_THEMES[params.focusMode];

  // Get base zodiac info
  const zodiacBase = ZODIAC_BASE[params.zodiacSign] || {
    chinese: '',
    description: `A mythical ${params.zodiacSign}`,
    pose: 'in a powerful, dignified stance',
  };

  // Get element-specific description
  const userElement = params.zodiacElement || 'Fire';
  const elementModifier = ELEMENT_MODIFIERS[userElement];

  // Mode-specific visual instructions
  const modeVisuals: Record<FocusMode, string> = {
    wealth: `=== WEALTH MODE: PROSPERITY & FORTUNE ===
The entire image RADIATES wealth and abundance:
- Gold coins, ingots, and treasure scattered throughout
- Luxurious golden light bathing the scene
- Symbols of prosperity: koi fish, peonies, lucky coins with square holes
- Rich, opulent atmosphere suggesting infinite wealth
- The Fire Horse and ${params.zodiacSign} are surrounded by flowing gold and riches
- Money symbols, gem stones, and treasure chests visible
- Everything glows with the promise of financial success`,

    power: `=== POWER MODE: DOMINANCE & STRATEGY ===
The entire image RADIATES power and authority:
- Storm clouds, lightning, and dramatic weather
- Military/strategic imagery: banners, mountains to conquer
- Symbols of power: crowns, thrones, mountain peaks, dragon scales
- Intense, commanding atmosphere of absolute authority
- The Fire Horse and ${params.zodiacSign} appear as unstoppable conquerors
- War drums, ancient weapons, imperial symbols visible
- Everything suggests strategic dominance and victory`,

    love: `=== LOVE MODE: ROMANCE & CONNECTION ===
The entire image RADIATES love and romance:
- Soft pink cherry blossoms and peach flowers everywhere
- Romantic moonlight or sunset golden hour lighting
- Symbols of love: paired mandarin ducks, red threads of fate, hearts
- Tender, passionate, destined atmosphere
- The Fire Horse and ${params.zodiacSign} share a romantic connection
- Floating petals, love knots, intertwined destiny symbols
- Everything glows with the warmth of true love`,

    shield: `=== SHIELD MODE: PROTECTION & SAFETY ===
The entire image RADIATES protection and security:
- Protective barriers, shields, and sacred geometry
- Guardian imagery: Fu lions, bagua mirrors, protective seals
- Symbols of safety: armor, fortress walls, sacred talismans
- Powerful, reassuring atmosphere of absolute protection
- The Fire Horse and ${params.zodiacSign} stand as mighty guardians
- Protective runes, barrier spells, ancestral shields visible
- Everything suggests impenetrable divine protection`,
  };

  return `Create a BREATHTAKING vertical digital art masterpiece (9:16 aspect ratio) - a ${params.focusMode.toUpperCase()} talisman for the Year of the Fire Horse 2026.

=== ARTISTIC STYLE: CINEMATIC 3D HYPERREALISM ===
- AAA video game concept art quality (Blizzard / Riot Games level)
- High-end NFT collectible art
- Unreal Engine 5 cinematic render
- ArtStation trending masterpiece

=== DUAL HERO COMPOSITION: FIRE HORSE + ${userElement.toUpperCase()} ${params.zodiacSign.toUpperCase()} ===

TWO magnificent creatures share this epic composition:

**FIRE HORSE (Primary - Upper/Center, 40% of image):**
A MAJESTIC, POWERFUL Fire Horse in full glory:
- Muscular stallion with flowing mane and tail made of ACTUAL FLAMES
- Body wreathed in fire, hooves leaving trails of flame
- Eyes burning with fierce golden-red intensity
- Rearing up or galloping through the sky/clouds
- Embodiment of the Year 2026's wild, transformative Fire energy
- Positioned prominently in upper portion of image

**${userElement.toUpperCase()} ${params.zodiacSign.toUpperCase()} (Secondary - Lower/Center, 40% of image):**
${zodiacBase.description}
- Enhanced with ${userElement} elemental energy
- ${elementModifier.aura}
- ${elementModifier.texture}
- ${zodiacBase.pose}
- Positioned in lower portion, gazing up at or interacting with the Fire Horse

**THEIR RELATIONSHIP:**
The Fire Horse and ${params.zodiacSign} are connected by swirling energy/magic between them.
They share a mystical bond - the Fire Horse blessing/empowering the ${params.zodiacSign}.
Visual energy flows between them showing their cosmic connection.

${modeVisuals[params.focusMode]}

=== MODE-SPECIFIC SYMBOLS (${params.focusMode.toUpperCase()}) ===
Atmosphere: ${modeTheme.atmosphere}
Must include these symbols: ${modeTheme.symbols}

=== COLOR PALETTE ===
- Fire Horse: Blazing oranges, reds, and golden flames
- ${params.zodiacSign}: ${elementModifier.colors}
- Background: Rich, dramatic colors matching ${params.focusMode} theme
- Overall: Warm golden light with mode-specific accent colors

=== DECORATIVE FRAME ===
Elegant golden Chinese-inspired border with ${params.focusMode}-themed corners.

=== TEXT OVERLAYS ===
TOP: "YEAR OF THE FIRE HORSE 2026" - elegant gold font
CENTER: "${params.mainText}" - LARGE, glowing gold text
BOTTOM: "${params.subText}" - smaller refined text

=== CRITICAL REQUIREMENTS ===
- Fire Horse must be PROMINENT and POWERFUL (not tiny silhouettes!)
- ${params.zodiacSign} must be equally impressive
- ${params.focusMode.toUpperCase()} theme must be OBVIOUS throughout
- Mode-specific symbols MUST be visible
- 8K ultra-high resolution
- NO random text or gibberish
- NO watermarks

This talisman should make viewers GASP - a ${params.focusMode.toUpperCase()} blessing from the Fire Horse to the ${userElement} ${params.zodiacSign}.`;
}

// ============================================================================
// 60 ELEMENT+ANIMAL MASTERPIECE DESCRIPTIONS
// Ultra-detailed 3D cinematic descriptions for viral-quality art
// ============================================================================

const ELEMENT_ANIMAL_MASTERPIECES: Record<string, string> = {
  // === WOOD ELEMENT - Organic, Living, Nature's Power ===
  'Wood-Rat': `A supernatural WOOD RAT rendered in stunning 3D hyperrealism. Its body is a living sculpture of ancient twisted wood and bark, with glowing jade-green veins of life energy pulsing beneath the surface. Luminescent moss and tiny bioluminescent mushrooms grow along its spine. Its eyes are brilliant emeralds that gleam with cunning intelligence. Delicate cherry blossom petals and golden leaves swirl around it. Tiny vines curl from its claws, and where it steps, grass instantly sprouts. The atmosphere is a mystical forest at dawn with golden light filtering through ancient trees.`,

  'Wood-Ox': `A colossal WOOD OX of immense power, its body formed from the heart of a thousand-year-old sacred tree. Ancient bark armor covers its muscular form, cracked to reveal glowing emerald life-force within. Massive horns are living branches adorned with cherry blossoms and jade leaves. Moss and flowering vines cascade down its neck like a majestic mane. Its eyes burn with the patient wisdom of ancient forests. It stands in a misty bamboo grove, roots visibly connecting it to the earth, golden pollen and fireflies dancing around its monumental form.`,

  'Wood-Tiger': `A terrifying WOOD TIGER, apex predator of enchanted forests. Its powerful body is sculpted from dark mahogany and living oak, with stripes of glowing jade energy crackling across its form. Luminescent green eyes burn with primal hunger. Its fur is actually thousands of tiny leaves that rustle with each movement. Flowering vines wrap around its muscular legs, and its roar sends a shockwave of petals and leaves. It prowls through a moonlit bamboo forest, every step causing plants to grow in its wake.`,

  'Wood-Rabbit': `An ethereal WOOD RABBIT of otherworldly beauty. Its graceful form is carved from pale birch and flowering cherry wood, with delicate jade filigree running through its translucent ears. Its fur shimmers like sunlight through spring leaves. Eyes like pools of liquid jade reflect the full moon above. It sits serenely on a bed of luminescent moss and clover, surrounded by floating cherry blossoms and dancing butterflies. Tiny flowers bloom wherever its paws touch. The atmosphere is pure magic - a sacred grove bathed in moonlight.`,

  'Wood-Dragon': `A magnificent WOOD DRAGON that IS the forest incarnate. Its serpentine body is a living ecosystem - ancient bark scales, flowering vines for whiskers, antlers that are entire cherry trees in bloom. Glowing jade energy pulses through cracks in its bark-armor. Moss hangs from its form like clouds. Its eyes are twin suns seen through a forest canopy. It coils around a sacred mountain, its body indistinguishable from the landscape, with waterfalls cascading down its spine and birds nesting in its branches.`,

  'Wood-Snake': `A hypnotic WOOD SNAKE of deadly elegance. Its sinuous body is polished jade and living bamboo, with scales that shift between deep forest green and golden amber. Bioluminescent patterns trace along its length like sacred runes. Tiny orchids and ferns grow from between its scales. Its eyes are mesmerizing spirals of emerald and gold. It coils around a sacred peach tree heavy with golden fruit, its forked tongue tasting the air thick with pollen and magic. Fireflies create a halo around its hooded head.`,

  'Wood-Horse': `A wild WOOD HORSE of untamed forest spirit. Its powerful body is sculpted from living willow and oak, with a mane of flowing green leaves and flowering vines. Jade energy crackles through bark-textured muscles. Its eyes are twin forests - deep, green, and infinite. Hooves of polished wood leave trails of sprouting flowers. It rears triumphantly in a sunlit clearing, surrounded by swirling cherry blossoms and golden butterflies, mane and tail flowing like a green waterfall. Pure freedom embodied in living wood.`,

  'Wood-Goat': `A serene WOOD GOAT of artistic perfection. Its graceful form is carved from ancient cherry wood, with curving horns wrapped in flowering wisteria. Soft moss covers its body like wool, dotted with tiny wildflowers. Its eyes hold the peaceful wisdom of mountain meadows. It stands on a misty peak overlooking an endless bamboo sea, surrounded by floating petals and golden light. Butterflies rest on its horns, and where it breathes, flowers bloom. Pure tranquility made manifest.`,

  'Wood-Monkey': `A mischievous WOOD MONKEY crackling with forest trickster energy. Its agile body is woven from golden bamboo and flowering vines, with jade energy sparking from its fingertips. Its expressive face is carved from sacred bodhi wood, eyes gleaming with playful cunning. It leaps through a canopy of glowing trees, trailing leaves and flower petals, clutching a staff of living wood that sprouts golden fruit. Fireflies swirl around it like a personal galaxy. Pure chaotic joy.`,

  'Wood-Rooster': `A magnificent WOOD ROOSTER of breathtaking splendor. Its proud form is sculpted from polished rosewood and jade, with tail feathers that are actually peacock-green fern fronds tipped with gold. Its comb and wattle are carved ruby maple leaves. It stands atop a moss-covered stone at dawn, crowing forth a wave of cherry blossoms and golden light. The forest awakens to its call - flowers blooming, birds taking flight. Majesty and renewal incarnate.`,

  'Wood-Dog': `A noble WOOD DOG, eternal guardian of sacred groves. Its powerful body is ancient oak wrapped in protective bark armor, with jade runes glowing beneath the surface. Its eyes are steady flames of emerald loyalty. Moss and lichen form a natural collar, and flowering vines trail from its legs. It stands vigilant at the entrance to an enchanted forest, roots connecting it to every tree. Fireflies orbit its head like a crown. Unwavering protection.`,

  'Wood-Pig': `A prosperous WOOD PIG of abundant blessings. Its plump, content form is carved from rich mahogany, with veins of jade and gold running through its body. Mushrooms and flowers grow from its back like a living garden. Its eyes twinkle with generous wisdom. It rests among a treasure trove of golden acorns, magical fruits, and glowing seeds, in a sun-dappled forest clearing. Butterflies and songbirds attend it. Pure abundance and contentment.`,

  // === FIRE ELEMENT - Blazing, Passionate, Transformative ===
  'Fire-Rat': `A blazing FIRE RAT of cunning destruction. Its sleek body is living flame given form - molten gold skeleton visible through translucent fire-flesh. Ember-orange eyes burn with fierce intelligence. Sparks fly from its whiskers, and its tail is a whip of pure flame. It races across a sea of scattered gold coins that glow red-hot at its touch. Smoke and embers trail behind it. The background is a volcano's heart. Small but devastatingly powerful.`,

  'Fire-Ox': `A cataclysmic FIRE OX of unstoppable destruction. Its mountainous body is forged from volcanic obsidian and magma, with rivers of lava flowing through cracks in its hide. Horns of solidified flame curve wickedly, dripping molten gold. Its eyes are twin volcanic eruptions. Steam and smoke billow from its nostrils. It charges through a hellscape of fire and ash, leaving a trail of magma. The ground cracks beneath its hooves. Apocalyptic power incarnate.`,

  'Fire-Tiger': `A terrifying FIRE TIGER, the sun's wrath given form. Its muscular body is living flame - stripes of white-hot fire and deep crimson magma. Its eyes are molten gold, and when it roars, it breathes a river of fire. Each step scorches the earth black. Its claws are crystallized flame. It prowls through a burning forest, utterly immune to the inferno it creates. Embers rise around it like a corona. The apex predator of destruction.`,

  'Fire-Rabbit': `A passionate FIRE RABBIT of burning desire. Its graceful form is sculpted from rose-gold flame, with ears like dancing fire and eyes of smoldering ruby. Soft flames ripple across its body like fur. Red threads of fate, burning with eternal fire, trail from its form. It leaps through rings of sacred flame, leaving heart-shaped embers. The atmosphere is a romantic sunset turned to eternal fire. Love's consuming flame made beautiful.`,

  'Fire-Dragon': `An IMPERIAL FIRE DRAGON of absolute divine power. The ultimate symbol of celestial fire. Its serpentine body is a river of flame and molten gold, with scales that are individual fires. Five-clawed and wreathed in inferno, it dominates the sky. Its breath is a supernova. Golden flames pour from every inch of its magnificent form. It coils around a blazing sun, emperor of all fire. The clouds themselves burn. Godlike majesty beyond mortal comprehension.`,

  'Fire-Snake': `A deadly FIRE SNAKE of hypnotic danger. Its sinuous body flows like liquid magma, scales shifting between crimson, orange, and gold. Its eyes are hypnotic flames that entrance prey. Patterns of white-hot fire trace along its length. It coils around a volcanic crystal of immense power, tongue flickering with sparks. Heat distortion warps the air around it. Deadly beautiful, beautiful deadly.`,

  'Fire-Horse': `THE DIVINE FIRE HORSE of 2026 - protagonist of this sacred year. Its magnificent body is PURE CELESTIAL FLAME - not burning, but BEING fire itself. Its mane and tail are solar flares flowing like liquid gold and crimson. Eyes of white-hot divine light. It rears triumphantly against a blazing sunset sky, hooves striking sparks like shooting stars. Embers and flames create a halo of power. This is not just a horse - it is the year's avatar, destiny incarnate, the most powerful Fire Horse in 60 years.`,

  'Fire-Goat': `A creative FIRE GOAT of inspired destruction. Its artistic form is sculpted from rose-gold flames, with horns of crystallized fire that glow like heated metal. Its wool ripples with gentle flames, beautiful rather than destructive. It stands atop volcanic rocks as molten glass flows around it. Its eyes hold the mad genius of creation through destruction. Artist and destroyer in one elegant form.`,

  'Fire-Monkey': `A chaotic FIRE MONKEY of explosive mischief. Its agile body crackles with electrical fire, fur made of dancing sparks and flames. Its manic eyes gleam with firecracker energy. It wields a staff of pure plasma, spinning it to create wheels of fire. Explosions of colorful flame surround its acrobatic movements. It leaps through fireworks and infernos, laughing. Chaos and joy combusting together.`,

  'Fire-Rooster': `A magnificent FIRE ROOSTER, the Phoenix's cousin. Its spectacular form is living flame - tail feathers of pure fire streaming like solar flares. Its crest is a crown of flames. It stands atop a volcanic peak at dawn, crowing forth actual FIRE that becomes the sunrise. Each feather is a unique flame, from deep crimson to brilliant gold. The herald of transformation, burning away the old.`,

  'Fire-Dog': `A fierce FIRE DOG, guardian of sacred flames. Its powerful body is forged from living fire and molten bronze, with eyes of protective flame. Embers fall from its fur like snow. It stands vigilant before a great inferno, completely one with the fire. Ancient fire runes glow on its flanks. Its bark is thunder, its bite is wildfire. Loyal guardian of those worthy of fire's blessing.`,

  'Fire-Pig': `A prosperous FIRE PIG of warm abundance. Its plump form glows with the comfortable fire of hearth and home - rose gold and amber flames. Its eyes twinkle with warmth. It rests beside a forge where gold coins are being minted, perfectly content. The fire is welcoming, not destructive. Golden flames lick harmlessly around its happy form. Prosperity through the transformative power of fire.`,

  // === EARTH ELEMENT - Solid, Ancient, Precious ===
  'Earth-Rat': `A precious EARTH RAT of crystallized wealth. Its compact body is carved from ancient amber and golden quartz, with veins of pure gold running through translucent stone flesh. Its eyes are flawless diamonds that gleam with sharp intelligence. Tiny crystals grow from its spine. It perches atop a mountain of ancient gold coins and jade artifacts, surrounded by floating dust motes that are actually gold particles. The atmosphere is an ancient treasury unearthed.`,

  'Earth-Ox': `A COLOSSAL EARTH OX of immovable mountain power. Its body is literally MOUNTAIN - ancient granite and marble with veins of gold and jade running through solid stone. Its horns are crystalline formations of pure quartz. It stands as if it has been there for millennia, mountains forming around it. Dust and stone float upward around its unshakeable form. Gems embedded in its hide catch the light. It IS the mountain. Absolute, eternal foundation.`,

  'Earth-Tiger': `A devastating EARTH TIGER of tectonic power. Its muscular body is sculpted from golden sandstone and tiger's eye gemstone, with stripes of obsidian and amber. Its eyes are polished gems of terrifying beauty. When it moves, the earth trembles. Stone dust rises around its powerful form. It prowls through a canyon of gold-veined marble, leaving cracked earth in its wake. Ancient, patient, and absolutely lethal.`,

  'Earth-Rabbit': `A precious EARTH RABBIT of gentle abundance. Its delicate form is carved from rose quartz and white jade, with ears of translucent amber. Tiny crystals and gems grow from its fur like flowers. Its eyes are serene pools of liquid gold. It shelters in a burrow lined with precious stones and ancient coins, surrounded by terracotta lucky charms. Soft golden light emanates from within. Quiet treasure, peaceful wealth.`,

  'Earth-Dragon': `A PRIMORDIAL EARTH DRAGON older than mountains. Its titanic body is the earth's core given form - ancient stone, crystal formations, precious metals fused over eons. Gems the size of boulders stud its hide. Its scales are tectonic plates. It coils around the world's foundation, clutching a pearl of pure crystallized wisdom. Golden dust clouds orbit its ancient form. Guardian of everything buried and precious. Eternal.`,

  'Earth-Snake': `A wise EARTH SNAKE of buried treasures. Its sinuous body is polished amber, agate, and bands of precious stone - each segment a different gem. Its scales catch light like a jewelry display. Eyes of polished tiger's eye hold ancient knowing. It coils within an terracotta vessel overflowing with gold coins and jade pieces. Archaeological treasure incarnate. Patient keeper of the earth's secrets.`,

  'Earth-Horse': `A steadfast EARTH HORSE of grounded power. Its muscular body is sculpted from golden sandstone and marble, with a mane of crystallized amber and quartz. Bronze and copper veins run through its stone flesh. Its hooves are polished jade. It stands firm as mountains rise around it, completely unshakeable. Golden dust swirls around its patient form. Not the wild freedom of fire - the eternal strength of stone.`,

  'Earth-Goat': `A serene EARTH GOAT of artistic mastery. Its graceful form is carved from cream-colored marble veined with gold, horns of spiraling crystalline formations. Its wool appears to be soft but is actually fine stone fibers interwoven with gold thread. It stands atop a terracotta plateau surrounded by ancient pottery and jade carvings. Golden light of sunset bathes everything in warm amber. Timeless artistry.`,

  'Earth-Monkey': `A clever EARTH MONKEY of archaeological mischief. Its agile body is formed from ancient terracotta, golden bronze, and polished jade - like a treasure come to life. Its expressive face is carved stone that somehow conveys endless cunning. It plays with priceless artifacts - jade puzzle boxes, golden figurines, crystal spheres. Surrounded by the treasures of a dozen lost civilizations. Finder of all things precious.`,

  'Earth-Rooster': `A proud EARTH ROOSTER of metallic splendor. Its magnificent form is cast from bronze, copper, and gold - a living statue of ancient craftsmanship. Tail feathers are hammered metal sheets that catch light magnificently. It stands on an ancient bronze bell, surrounded by archaeological treasures. Its crow reverberates like a gong. Herald of enduring value, of things that last forever.`,

  'Earth-Dog': `A loyal EARTH DOG of eternal guardianship. Its powerful form is carved from terracotta and granite, adorned with jade armor and gold ornaments. It stands eternal guard before ancient tomb doors, having been there for thousands of years. Dust motes float in golden light around its vigilant form. Stone that has protected treasures since time immemorial. Unbreakable loyalty.`,

  'Earth-Pig': `The ultimate EARTH PIG of material wealth. Its round, content body is warm terracotta and rose gold, lounging in a literal pit of treasure - gold ingots, jade carvings, ancient coins, precious gems. Its skin has a beautiful patina of age and abundance. Everything precious gravitates toward it. It is wealth incarnate - not greedy, just naturally, abundantly prosperous. Living treasure.`,

  // === METAL ELEMENT - Refined, Precious, Sharp ===
  'Metal-Rat': `A deadly METAL RAT of razor precision. Its sleek body is forged from polished silver and white gold, with platinum filigree detailing. Its eyes are cut diamonds of cold, calculating intelligence. Its claws are surgical steel. It stands atop a scattered fortune of silver coins and gemstones, light refracting brilliantly from every surface. Chrome and crystal surround it. Sharp as a blade, precious as platinum.`,

  'Metal-Ox': `An unstoppable METAL OX of industrial might. Its massive body is forged from polished bronze and steel, with gold inlay depicting ancient power symbols. Its horns are tempered metal that gleams wickedly. Hydraulic joints visible at stress points suggest terrifying power. It stands in a forge-like environment, surrounded by molten metal and sparks. Light reflects off its polished surface like a mirror. Unstoppable metal force.`,

  'Metal-Tiger': `A lethal METAL TIGER of killing precision. Its body is chrome and silver, with stripes of dark gunmetal - a predator forged in the finest steel. Its claws are adamantine blades. Eyes of cold blue steel track prey with mechanical precision. It prowls through a landscape of swords, armor, and weaponry, its reflection multiplied endlessly. Every edge is razor sharp. The perfect weapon given life.`,

  'Metal-Rabbit': `A precious METAL RABBIT of refined elegance. Its delicate form is cast from pure silver and white gold, with details of platinum filigree. Its fur is actually thousands of tiny metal strands that shimmer like silk. Pearls and diamonds adorn its form. Its eyes are sapphires of gentle knowing. It sits among the finest jewelry and precious metals, moonlight making everything glow. Refined beauty beyond price.`,

  'Metal-Dragon': `A magnificent METAL DRAGON of imperial treasury. Its serpentine body is clad in scales of overlapping gold coins and silver medals. Its form is platinum and bronze, every surface reflecting light. It clutches spheres of solid platinum and crystal. Precious metals flow around it like liquid. It coils through clouds of gold dust, the ultimate symbol of metallic power and celestial wealth. Incalculable value incarnate.`,

  'Metal-Snake': `A deadly METAL SNAKE of beautiful danger. Its body is interlocking rings of silver, gold, and platinum - like living jewelry. Each scale is a tiny mirror. Eyes of ruby and intelligence colder than steel. It coils around a sword of legendary craftsmanship, its body the hilt. Beautiful and lethal as the finest blade. Light dances along its form in hypnotic patterns.`,

  'Metal-Horse': `A noble METAL HORSE of refined power. Its form is polished silver and white gold, with a mane and tail of flowing platinum threads. Bronze muscles ripple beneath mirror-finish hide. Its hooves are polished steel that ring like bells. It rears majestically, light cascading off its form like water. Surrounded by floating metallic particles. Elegant, powerful, precious beyond measure.`,

  'Metal-Goat': `A refined METAL GOAT of artistic perfection. Its graceful form is cast from silver and adorned with gold filigree. Horns of spiraling platinum catch every light. Its wool appears soft but is actually fine silver wire. Tiny bells of gold and silver chime with each movement. It stands among the finest metalwork art - sculptures, jewelry, treasures. The ultimate fusion of art and precious metal.`,

  'Metal-Monkey': `A clever METAL MONKEY of mechanical mischief. Its agile body is a marvel of clockwork and precious metals - gears of gold, joints of silver, fingers of articulated platinum. Its eyes are spinning mechanical irises. It jugles precious gems and golden artifacts with supernatural dexterity. Surrounded by the treasures it has collected. A steampunk trickster god.`,

  'Metal-Rooster': `A spectacular METAL ROOSTER of blinding brilliance. Its form is hammered gold, silver, and copper in breathtaking detail. Each feather is individually crafted metal that catches light differently. Its crest is a crown of gold flames. It stands atop a pile of medals, coins, and precious metals, crowing at a golden dawn. Light reflects off it like a living disco ball. Blindingly magnificent.`,

  'Metal-Dog': `A vigilant METAL DOG of armored loyalty. Its powerful form is encased in ceremonial armor of gold and silver, with jade and ruby inlays. Eyes of golden amber gleam with unwavering devotion. Its collar is a masterwork of metalsmith art. It stands guard, polished surfaces reflecting everything, missing nothing. Centuries of protection forged into metal form.`,

  'Metal-Pig': `The ultimate METAL PIG of material wealth. Its plump form is rose gold and platinum, lounging atop a mountain of gold bars, silver ingots, and loose gems. Its skin has the warm glow of the finest precious metals. Light refracts endlessly from the treasures surrounding it. This is what pure prosperity looks like - refined, warm, and infinitely valuable.`,

  // === WATER ELEMENT - Fluid, Deep, Mysterious ===
  'Water-Rat': `A mystical WATER RAT of liquid cunning. Its sleek body is formed from living water held in perfect rat-shape, internal currents visible within. Bioluminescent patterns pulse through its translucent form. Its eyes are twin full moons reflected in still pools. It swims through floating streams of silver coins and pearls. Ripples and splashes frozen in crystal surround it. The reflection is more real than reality.`,

  'Water-Ox': `A patient WATER OX of oceanic depth. Its massive body is deep indigo and black, hide textured like the ocean floor. Its horns curve like frozen waves cresting. Bioluminescent spots dot its form like stars. It stands in misty shallows at moonrise, water flowing around and through it. Lotus flowers float past. Its eyes hold the unfathomable wisdom of the deepest seas. Ancient as the first tide.`,

  'Water-Tiger': `A fearsome WATER TIGER of fluid death. Its powerful body is midnight blue and silver, striped with currents of darker water. When it moves, it flows like a wave. Its eyes reflect moonlight with predatory gleam. It prowls along a moonlit shore, paws leaving ripples that never end. Fish and sea creatures flee its presence. Silent as deep water, deadly as a riptide.`,

  'Water-Rabbit': `A luminous WATER RABBIT of pure lunar energy. Its ethereal form is pearl-white and translucent, glowing with inner moonlight. Its long ears are silk ribbons that flow like underwater plants. It floats serenely on a giant lotus leaf under the full moon, reflection perfect below. Chang'e's companion made manifest. Pure yin energy, eternal serenity. Pearls orbit its gentle form.`,

  'Water-Dragon': `A divine WATER DRAGON of storm and sea. Its serpentine body is sapphire blue and silver, flowing like a river given form. It commands every water in existence - rain falls from its whiskers, waves crest at its tail, mist surrounds its head. Pearls and rain droplets orbit it eternally. It rises from the ocean at full moon, master of all water. Typhoons and tides obey its will.`,

  'Water-Snake': `A hypnotic WATER SNAKE of abyssal secrets. Its sinuous body is iridescent blue-green like abalone, scales shimmering with internal light. It glows from within with bioluminescence. Its eyes are hypnotic whirlpools. It coils around coral formations encrusted with pearls, surrounded by floating jellyfish and dancing light. Ocean depth wisdom incarnate. Keeper of drowned treasures.`,

  'Water-Horse': `A fluid WATER HORSE of oceanic freedom. Its body is midnight blue and silver, mane and tail flowing like actual waterfalls. Seafoam and mist comprise its form as much as flesh. Its hooves dance on wave crests, leaving ripples on the ocean's surface. It gallops across a moonlit sea, spray and starlight in its wake. Not fire's wild freedom - water's eternal, flowing freedom.`,

  'Water-Goat': `A dreamy WATER GOAT of creative flow. Its gentle form is soft blues and silvers, wool like sea foam and mist. Its horns gleam with pearl essence. It stands peacefully beside a moonlit waterfall, mist swirling around its artistic form. Water flows from where it steps. Its eyes hold the serene wisdom of still pools. Creativity that flows like water.`,

  'Water-Monkey': `A playful WATER MONKEY of liquid mischief. Its agile body shifts between water and flesh, splashing and reforming constantly. Its eyes gleam with delight. It plays in magical fountains, catching water droplets that are actually pearls. It holds a sphere of pure condensed wisdom-water. Surrounded by suspended splashes and impossible water sculptures. Joy flowing freely.`,

  'Water-Rooster': `A majestic WATER ROOSTER of tidal power. Its form is deep blue and silver, feathers flowing like water. It stands at the ocean's edge at dawn, crowing to the moon that still hangs in the sky. Waves respond to its call. Its tail feathers are cascading water frozen in time. Dawn over still waters, the moment between yin and yang.`,

  'Water-Dog': `A faithful WATER DOG of deep loyalty. Its form is navy blue and silver, standing guard beside a sacred well under a full moon. Pearl drops cling to its fur. Its eyes reflect everything with perfect clarity. It guards hidden depths, secret wisdom, the things that lie below. Eternal guardian of water's mysteries. Loyal as the tide returning.`,

  'Water-Pig': `A content WATER PIG of peaceful prosperity. Its rounded form is soft indigo and pearl white, floating blissfully in a pool of moonlit water. Lotus flowers surround it. Pearls drift around its serene form. The reflection is perfect, doubling the peace. This is prosperity through flow, abundance without effort. The blessing of water's gentle way.`,
};
