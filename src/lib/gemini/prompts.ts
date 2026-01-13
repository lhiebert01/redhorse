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

  return `You are the Ancient Fire Horse Oracle for the Year 2026. You speak with wisdom, mystery, and power.

USER PROFILE:
- Birth Date: ${params.birthDate}
- Chinese Zodiac Animal: ${params.zodiacSign}
- Zodiac Element: ${params.zodiacElement}
- Fire Horse Year Compatibility: ${params.fireHorseAdvice}
- Selected Oracle Mode: ${mode.name} - ${mode.tagline}

YOUR SACRED TASK: ${mode.textPrompt}

CRITICAL REQUIREMENTS:
- Be mystical, poetic, and commanding in tone
- Reference the powerful Fire Horse energy of 2026 (a rare year occurring every 60 years)
- Personalize deeply to their ${params.zodiacSign} zodiac nature
- The main_text MUST be SHORT (2-6 words maximum) - it will be overlaid on the talisman image
- Ensure PERFECT spelling and grammar - this is sacred text
- The full_reading should weave their zodiac traits with Fire Horse energy

OUTPUT FORMAT - Return ONLY valid JSON (no markdown, no explanation):
{
  "main_text": "SHORT POWERFUL DECREE (2-6 words, perfectly spelled)",
  "sub_text": "${params.zodiacElement} ${params.zodiacSign}, Fire Horse",
  "full_reading": "A mystical 2-3 sentence prophecy for 2026 that references their ${params.zodiacSign} nature and how the Fire Horse year will affect them specifically. Make it personal and powerful."
}`;
}

export function buildImagePrompt(params: {
  focusMode: FocusMode;
  mainText: string;
  subText: string;
  zodiacSign: ZodiacAnimal;
}): string {
  const mode = PRODUCT_MODES[params.focusMode];

  // Map zodiac animals to their visual descriptions for better AI image generation
  const zodiacVisuals: Record<string, string> = {
    Rat: 'clever mouse with bright intelligent eyes',
    Ox: 'powerful water buffalo with strong horns',
    Tiger: 'majestic striped tiger with fierce golden eyes',
    Rabbit: 'elegant white jade rabbit with long ears',
    Dragon: 'magnificent Chinese dragon with scales and whiskers',
    Snake: 'mystical serpent with iridescent scales',
    Horse: 'noble Fire Horse with flaming mane',
    Goat: 'graceful mountain goat with curved horns',
    Monkey: 'wise golden monkey with expressive face',
    Rooster: 'proud phoenix-like rooster with colorful plumage',
    Dog: 'loyal guardian dog with noble bearing',
    Pig: 'prosperous golden pig symbolizing abundance',
  };

  const animalVisual = zodiacVisuals[params.zodiacSign] || params.zodiacSign.toLowerCase();

  return `Create a breathtaking vertical digital talisman artwork (9:16 aspect ratio) for the Year of the Fire Horse 2026.

SCENE COMPOSITION:
- A majestic Fire Horse (primary subject) - rearing dramatically with a flaming mane of red and gold fire, hooves trailing sparks and embers
- The horse should be powerful, ethereal, and mystical - embodying the fierce energy of the Fire Horse year
- Background: Deep crimson and black gradient with swirling smoke, floating embers, and golden light rays
- The scene should feel like a sacred Chinese talisman brought to life

VISUAL THEME FOR ${mode.name.toUpperCase()} MODE:
${mode.visualTheme}

ART STYLE:
- Fusion of traditional Chinese ink wash painting and modern cinematic digital art
- Color palette: Rich crimson red (#8B0000), brilliant gold (#FFD700), ember orange (#FF4500), deep black
- Dramatic cinematic lighting with volumetric golden rays
- Floating embers, fire particles, and mystical smoke effects
- 8K ultra-detailed quality
- The Fire Horse should look divine, powerful, and awe-inspiring

TEXT OVERLAY (CRITICAL - must be perfectly legible and spelled correctly):
- TOP CORNER (small): "2026 | Fire"
- CENTER (large, glowing gold calligraphy): "${params.mainText}"
- BOTTOM (elegant white): "${params.subText}"

IMPORTANT RULES:
- All text must be CRISP, PERFECTLY SPELLED, and LEGIBLE
- The main text "${params.mainText}" must glow with golden divine light
- Integrate text artistically as part of the talisman design
- Create a composition worthy of being a treasured digital talisman`;
}
