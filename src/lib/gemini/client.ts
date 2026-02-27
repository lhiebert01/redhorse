import { GoogleGenAI } from '@google/genai';

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not set');
}

// Initialize Gemini AI client
export const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Model constants - using Gemini 3.1 Pro for high quality
export const TEXT_MODEL = 'gemini-3.1-pro-preview';
export const IMAGE_MODEL = 'gemini-3-pro-image-preview';
