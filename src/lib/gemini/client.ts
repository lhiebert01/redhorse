import { GoogleGenAI } from '@google/genai';

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not set');
}

// Initialize Gemini AI client
export const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Model constants - migrated to 3.1 after gemini-3-pro deprecation (March 9, 2026)
export const TEXT_MODEL = 'gemini-3.1-pro-preview';
export const IMAGE_MODEL = 'gemini-3.1-pro-image-preview';
