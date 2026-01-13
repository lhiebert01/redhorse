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

  return `You are the Ancient Fire Horse Oracle for the Year 2026.

USER PROFILE:
- Birth Date: ${params.birthDate}
- Chinese Zodiac: ${params.zodiacSign} (${params.zodiacElement})
- 2026 Fire Horse Compatibility: ${params.fireHorseAdvice}
- Selected Focus: ${mode.name} - ${mode.tagline}

YOUR TASK: ${mode.textPrompt}

REQUIREMENTS:
- Be mystical and commanding in tone
- Reference the Fire Horse energy of 2026
- Make it personal to their zodiac sign
- Keep the main_text SHORT and IMPACTFUL (this will be rendered on the image)

RESPOND ONLY WITH VALID JSON (no markdown, no code blocks):
{
  "main_text": "THE PRIMARY TEXT TO DISPLAY ON IMAGE (keep it short, 2-6 words max)",
  "sub_text": "Secondary supporting text (their zodiac + year)",
  "full_reading": "A detailed 2-3 sentence prophecy for 2026 incorporating their zodiac sign and the Fire Horse energy"
}`;
}

export function buildImagePrompt(params: {
  focusMode: FocusMode;
  mainText: string;
  subText: string;
  zodiacSign: ZodiacAnimal;
}): string {
  const mode = PRODUCT_MODES[params.focusMode];

  return `Create a stunning vertical digital art scroll (9:16 aspect ratio) for the Year of the Fire Horse 2026.

VISUAL THEME: ${mode.visualTheme}

STYLE REQUIREMENTS:
- Ancient Chinese ink wash painting meets modern digital art
- Color palette: Deep crimson red (#8B0000), glowing gold (#FFD700), pure black background
- Embers, smoke, and fire particles floating in the air
- Cinematic dramatic lighting with golden highlights
- 8K quality, hyper-detailed, mystical atmosphere
- The Fire Horse should be majestic, powerful, and ethereal

TEXT OVERLAY REQUIREMENTS (CRITICAL - text must be perfectly readable):
1. CENTER OF IMAGE - Large glowing gold calligraphy text: "${params.mainText}"
2. BOTTOM OF IMAGE - Smaller elegant white text: "${params.subText}"
3. TOP CORNER - Small text: "2026 | ${params.zodiacSign}"

IMPORTANT: The text must be crisp, legible, and artistically integrated into the composition. The main text should glow with golden light.`;
}
