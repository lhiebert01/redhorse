import { GoogleGenAI } from '@google/genai';

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not set');
}

// Initialize Gemini AI client
export const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Model constants - migrated after gemini-3-pro-preview text deprecation (March 9, 2026)
// Flash first for speed, Pro as fallback. Only text model was deprecated — image model is still 3-pro.
export const TEXT_MODELS = ['gemini-3-flash-preview', 'gemini-3.1-pro-preview'];
export const IMAGE_MODEL = 'gemini-3-pro-image-preview';
