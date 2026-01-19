import { ai, TEXT_MODEL, IMAGE_MODEL } from './client';
import { buildTextPrompt, buildImagePrompt } from './prompts';
import { GenerateOptions, GenerationResult } from '@/types/prophecy';
import { PRODUCT_MODES } from '@/constants/modes';
import {
  getForecast,
  ZodiacElement as ForecastElement,
  ZodiacAnimalType,
} from '@/constants/zodiac-forecasts';

export async function generateProphecy(options: GenerateOptions): Promise<GenerationResult> {
  const mode = PRODUCT_MODES[options.focusMode];

  // Get the accurate zodiac forecast data for this element + animal combination
  const forecast = getForecast(
    options.zodiacElement as ForecastElement,
    options.zodiacSign as ZodiacAnimalType
  );

  // Get the accurate main_text from our pre-defined forecast data
  let accurateMainText: string;
  switch (options.focusMode) {
    case 'wealth':
      accurateMainText = forecast?.modes.wealth.numbers || '08-18-28-38-48-88';
      break;
    case 'power':
      accurateMainText = forecast?.modes.power.motto || 'SEIZE YOUR DESTINY';
      break;
    case 'love':
      accurateMainText = forecast?.modes.love.decree || 'LOVE FINDS YOU WORTHY';
      break;
    case 'shield':
      accurateMainText = forecast?.modes.shield.mantra || 'FIRE SHIELDS ME';
      break;
    default:
      accurateMainText = 'DESTINY AWAITS';
  }

  // Step 1: Generate text content using Gemini 3 Pro
  // AI will generate the full_reading (personalized prophecy), but main_text uses our accurate data
  console.log('Generating text content with Gemini 3 Pro...');
  const textPrompt = buildTextPrompt(options);

  const textResponse = await ai.models.generateContent({
    model: TEXT_MODEL,
    contents: textPrompt,
    config: {
      responseMimeType: 'application/json',
    },
  });

  const textResponseText = textResponse.text;
  if (!textResponseText) {
    throw new Error('No text returned from Gemini');
  }

  // Parse JSON from response
  let textData: { main_text: string; sub_text: string; full_reading: string };
  try {
    // Try to extract JSON from the response
    const jsonMatch = textResponseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }
    const aiResponse = JSON.parse(jsonMatch[0]);

    // Override the AI-generated main_text with our accurate forecast data
    // Keep the AI-generated full_reading for personalized prophecy text
    textData = {
      main_text: accurateMainText, // Use our accurate data
      sub_text: `${options.zodiacElement} ${options.zodiacSign}, Fire Horse 2026`,
      full_reading: aiResponse.full_reading || forecast?.oracleWisdom || `The Fire Horse energy of 2026 brings transformation.`,
    };
  } catch (parseError) {
    console.error('Failed to parse text response:', textResponseText);
    // Fallback defaults using our accurate data
    textData = {
      main_text: accurateMainText,
      sub_text: `${options.zodiacElement} ${options.zodiacSign}, Fire Horse 2026`,
      full_reading: forecast?.oracleWisdom || `The Fire Horse energy of 2026 brings transformation to all ${options.zodiacSign} signs. Embrace the flames of change.`,
    };
  }

  // Step 2: Generate image using Gemini 3 Pro Image
  console.log('Generating talisman image with Gemini 3 Pro Image...');
  const imagePrompt = buildImagePrompt({
    focusMode: options.focusMode,
    mainText: textData.main_text,
    subText: textData.sub_text,
    zodiacSign: options.zodiacSign,
    zodiacElement: options.zodiacElement, // Pass element for visually distinct styling
  });

  const imageResponse = await ai.models.generateContent({
    model: IMAGE_MODEL,
    contents: {
      parts: [{ text: imagePrompt }],
    },
    config: {
      // Note: Aspect ratio is specified in the prompt for vertical 9:16 talisman format
      responseModalities: ['image', 'text'],
    },
  });

  // Extract image from response
  let imageData: string | null = null;
  for (const part of imageResponse.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData?.data) {
      imageData = part.inlineData.data;
      break;
    }
  }

  if (!imageData) {
    throw new Error('No image generated from Gemini');
  }

  return {
    mainText: textData.main_text,
    subText: textData.sub_text,
    fullReading: textData.full_reading,
    imageData: imageData, // base64 encoded
  };
}
