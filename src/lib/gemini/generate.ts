import { getTextModel, getImageModel } from './client';
import { buildTextPrompt, buildImagePrompt } from './prompts';
import { GenerateOptions, GenerationResult } from '@/types/prophecy';
import { PRODUCT_MODES } from '@/constants/modes';

export async function generateProphecy(options: GenerateOptions): Promise<GenerationResult> {
  const mode = PRODUCT_MODES[options.focusMode];

  // Step 1: Generate text content
  console.log('Generating text content...');
  const textModel = getTextModel();
  const textPrompt = buildTextPrompt(options);

  const textResult = await textModel.generateContent(textPrompt);
  const textResponse = textResult.response.text();

  // Parse JSON from response (handle potential markdown code blocks)
  let textData: { main_text: string; sub_text: string; full_reading: string };
  try {
    // Try to extract JSON from the response
    const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }
    textData = JSON.parse(jsonMatch[0]);
  } catch (parseError) {
    console.error('Failed to parse text response:', textResponse);
    // Fallback defaults based on mode
    textData = {
      main_text: mode.id === 'wealth' ? '88-12-33-07-21-45' : 'SEIZE YOUR DESTINY',
      sub_text: `${options.zodiacSign} | 2026`,
      full_reading: `The Fire Horse energy of 2026 brings transformation to all ${options.zodiacSign} signs. Embrace the flames of change.`,
    };
  }

  // Step 2: Generate image
  console.log('Generating talisman image...');
  const imageModel = getImageModel();
  const imagePrompt = buildImagePrompt({
    focusMode: options.focusMode,
    mainText: textData.main_text,
    subText: textData.sub_text,
    zodiacSign: options.zodiacSign,
  });

  const imageResult = await imageModel.generateContent({
    contents: [{ role: 'user', parts: [{ text: imagePrompt }] }],
    generationConfig: {
      responseModalities: ['image', 'text'],
    } as Record<string, unknown>,
  });

  // Extract image from response
  const candidate = imageResult.response.candidates?.[0];
  const imagePart = candidate?.content?.parts?.find(
    (part: { inlineData?: { mimeType?: string } }) =>
      part.inlineData?.mimeType?.startsWith('image/')
  );

  if (!imagePart?.inlineData?.data) {
    throw new Error('No image generated from Gemini');
  }

  return {
    mainText: textData.main_text,
    subText: textData.sub_text,
    fullReading: textData.full_reading,
    imageData: imagePart.inlineData.data, // base64 encoded
  };
}
