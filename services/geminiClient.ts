
import { GoogleGenAI } from "@google/genai";

// --- 1. Helper for Cross-Environment API Key ---
const getApiKey = () => {
  // 1. Try Vite (Vercel) environment variable
  // @ts-ignore 
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_KEY) {
    // @ts-ignore
    return import.meta.env.VITE_API_KEY;
  }
  // 2. Try Standard/Canvas environment variable
  if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
    return process.env.API_KEY;
  }
  return "";
};

export const ai = new GoogleGenAI({ apiKey: getApiKey() });

// --- 2. Helper for Retries (Stability Shield) ---
export async function retryOperation<T>(
  operation: () => Promise<T>, 
  actionName: string, 
  maxRetries: number = 2
): Promise<T> {
  let lastError;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (attempt < maxRetries) {
        console.warn(`Attempt ${attempt + 1} failed for ${actionName}, retrying...`, error);
        // Exponential backoff: 1s, 2s
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
      }
    }
  }
  throw lastError;
}
