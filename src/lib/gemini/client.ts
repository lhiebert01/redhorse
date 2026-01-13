import { GoogleGenerativeAI } from '@google/generative-ai';

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not set');
}

export const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Text generation model (fast, cheap)
export function getTextModel() {
  return genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
}

// Image generation model
export function getImageModel() {
  return genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
}
