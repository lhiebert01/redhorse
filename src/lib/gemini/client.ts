import { GoogleGenAI } from '@google/genai';

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not set');
}

// Initialize Gemini AI client
export const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Model constants - migrated after gemini-3-pro-preview text deprecation (March 9, 2026)
// Note: Only the TEXT model was deprecated (3-pro → 3.1-pro). The IMAGE model is still gemini-3-pro.
export const TEXT_MODEL = 'gemini-3.1-pro-preview';
export const IMAGE_MODEL = 'gemini-3-pro-image-preview';
