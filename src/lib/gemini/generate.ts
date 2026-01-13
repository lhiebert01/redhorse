import { ai, TEXT_MODEL, IMAGE_MODEL } from './client';
import { buildTextPrompt, buildImagePrompt } from './prompts';
import { GenerateOptions, GenerationResult } from '@/types/prophecy';
import { PRODUCT_MODES } from '@/constants/modes';

export async function generateProphecy(options: GenerateOptions): Promise<GenerationResult> {
  const mode = PRODUCT_MODES[options.focusMode];

  // Step 1: Generate text content using Gemini 3 Pro
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
    textData = JSON.parse(jsonMatch[0]);
  } catch (parseError) {
    console.error('Failed to parse text response:', textResponseText);
    // Fallback defaults based on mode
    textData = {
      main_text: mode.id === 'wealth' ? '88-12-33-07-21-45' : 'SEIZE YOUR DESTINY',
      sub_text: `${options.zodiacElement} ${options.zodiacSign}, Fire Horse`,
      full_reading: `The Fire Horse energy of 2026 brings transformation to all ${options.zodiacSign} signs. Embrace the flames of change.`,
    };
  }

  // Step 2: Generate image using Gemini 3 Pro Image
  console.log('Generating talisman image with Gemini 3 Pro Image...');
  const imagePrompt = buildImagePrompt({
    focusMode: options.focusMode,
    mainText: textData.main_text,
    subText: textData.sub_text,
    zodiacSign: options.zodiacSign,
  });

  const imageResponse = await ai.models.generateContent({
    model: IMAGE_MODEL,
    contents: {
      parts: [{ text: imagePrompt }],
    },
    config: {
      imageConfig: {
        aspectRatio: '9:16', // Vertical talisman format
      },
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
