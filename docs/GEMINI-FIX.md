# Gemini Model Fix Instructions

## Status: ✅ RESOLVED

| Event | Date |
|-------|------|
| **Issue discovered** | March 8, 2026 |
| **Fix applied** | March 8, 2026 |
| **Commit** | `48dee67` — Revert Gemini models from 3.1 to 3-pro |
| **Deployed to production** | March 8, 2026 (Vercel auto-deploy) |
| **Fallback model chains** | Deferred (not implemented yet) |

---

## Problem (March 2026)

Google Gemini `3.1` model IDs (`gemini-3.1-pro-preview`, `gemini-3.1-pro-image-preview`) return **404 NOT_FOUND** errors. These models do not exist in the Gemini API. This broke all apps that upgraded from `3-pro` to `3.1-pro`.

**Error message:** `models/gemini-3.1-pro-image-preview is not found for API version vibeta, or is not supported for generateContent`

## Resolution

Reverted `src/lib/gemini/client.ts` from broken `3.1` models back to working `3-pro` models:

```typescript
// BEFORE (broken — 404 NOT_FOUND):
export const TEXT_MODEL = 'gemini-3.1-pro-preview';
export const IMAGE_MODEL = 'gemini-3.1-pro-image-preview';

// AFTER (fixed — working):
export const TEXT_MODEL = 'gemini-3-pro-preview';
export const IMAGE_MODEL = 'gemini-3-pro-image-preview';
```

## Working Models (Verified March 8, 2026)

| Purpose | Model ID | Speed | Cost |
|---------|----------|-------|------|
| **Text/JSON generation** | `gemini-3-pro-preview` | Slower | Higher |
| **Text/JSON generation** | `gemini-3-flash-preview` | Faster | Lower |
| **Image generation** | `gemini-3-pro-image-preview` | Slower | Higher |
| **Image generation** | `gemini-3.1-flash-image-preview` | Faster | Lower |
| **Image generation** | `gemini-2.5-flash-image` | Fast | Lowest |
| **Text-to-Speech** | `gemini-2.5-flash-preview-tts` | — | — |

## How to Find Affected Code

```bash
grep -rn "gemini-3.1" --include="*.ts" --include="*.tsx" --include="*.js" src/ | grep -v node_modules
```

## Future: Fallback Model Chains (Not Yet Implemented)

Instead of a single model, export fallback arrays so if one model goes down, the next is tried automatically:

```typescript
export const TEXT_MODELS = ['gemini-3-pro-preview', 'gemini-3-flash-preview'];
export const IMAGE_MODELS = ['gemini-3-pro-image-preview', 'gemini-3.1-flash-image-preview', 'gemini-2.5-flash-image'];

export async function generateWithFallback(
  ai: GoogleGenAI,
  models: string[],
  contents: any,
  config?: any
) {
  let lastError: Error | null = null;
  for (const model of models) {
    try {
      console.log(`Trying model: ${model}`);
      const response = await ai.models.generateContent({ model, contents, config });
      return response;
    } catch (error) {
      console.error(`Model ${model} failed:`, (error as Error).message);
      lastError = error as Error;
    }
  }
  throw lastError || new Error('All models failed');
}
```

## Already Fixed: Neo-Aesop

The fix was first applied and verified in `C:\src\neo-storyteller` (Neo-Aesop). See `server/index.js` for the working fallback implementation.

## Testing

After making changes, test with:
```bash
node --input-type=module -e "
import { GoogleGenAI } from '@google/genai';
const ai = new GoogleGenAI({ apiKey: 'YOUR_KEY' });
const models = ['gemini-3-pro-preview', 'gemini-3-flash-preview', 'gemini-3-pro-image-preview'];
for (const m of models) {
  try { await ai.models.generateContent({ model: m, contents: 'test' }); console.log('OK', m); }
  catch (e) { console.log('FAIL', m, e.message.slice(0,60)); }
}
"
```
