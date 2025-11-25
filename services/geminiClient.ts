
import { GoogleGenAI } from "@google/genai";
import { debugLogger } from "../utils/debugLogger";

// --- 1. Helper for Cross-Environment API Key ---
// STRICTLY PRESERVED LOGIC as requested by user
const getApiKey = () => {
  // 1. Try Vite (Vercel) environment variable
  // @ts-ignore - ignore TS error for import.meta if types aren't perfect
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_KEY) {
    // @ts-ignore
    return import.meta.env.VITE_API_KEY;
  }
  
  // 1.5 Try Next.js/Vercel standard public variable (Fallback)
  if (typeof process !== 'undefined' && process.env && process.env.NEXT_PUBLIC_API_KEY) {
    return process.env.NEXT_PUBLIC_API_KEY;
  }

  // 2. Try Standard/Canvas environment variable
  if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
    return process.env.API_KEY;
  }
  return "";
};

const apiKey = getApiKey();

// Initialize the client
export const ai = new GoogleGenAI({ apiKey: apiKey });

/**
 * Diagnostic tool to check connectivity on boot.
 * Logs critical configuration issues to the internal flight recorder.
 */
export const validateConnectivity = async () => {
  const isKeyMissing = !apiKey || apiKey.trim() === "";
  
  if (isKeyMissing) {
    debugLogger.log({
      action: 'system_boot_diagnosis',
      level: 'ERROR',
      context: { networkStatus: navigator.onLine ? 'online' : 'offline' },
      input: { issue: 'API Key is missing or empty' },
      output: null,
      latencyMs: 0,
      error: { message: 'Environment variable VITE_API_KEY is not set.' }
    });
    console.error("CRITICAL: API Key is missing. Check Vercel Environment Variables.");
  } else {
    debugLogger.log({
      action: 'system_boot_diagnosis',
      level: 'INFO',
      context: { networkStatus: navigator.onLine ? 'online' : 'offline' },
      input: { issue: 'None', keyLength: apiKey.length },
      output: { status: 'Ready' },
      latencyMs: 0
    });
  }
};

export type ErrorType = 'NETWORK_ERROR' | 'CONFIG_ERROR' | 'API_ERROR' | 'UNKNOWN';

export const classifyError = (error: any): { type: ErrorType, message: string } => {
  const msg = String(error?.message || error).toLowerCase();
  
  // 1. Configuration Issues
  if (msg.includes("api key") || msg.includes("403")) {
    return { 
      type: 'CONFIG_ERROR', 
      message: 'API Key is invalid or missing. Please check Vercel settings.' 
    };
  }

  // 2. Network / GFW Issues
  if (msg.includes("failed to fetch") || msg.includes("networkerror") || msg.includes("load failed")) {
    return { 
      type: 'NETWORK_ERROR', 
      message: 'Network connection failed. Google API is unreachable (VPN required in CN).' 
    };
  }

  // 3. Google API Limits or Errors
  if (msg.includes("429") || msg.includes("quota")) {
    return { 
      type: 'API_ERROR', 
      message: 'API Quota exceeded. Please try again later.' 
    };
  }

  return { type: 'UNKNOWN', message: 'An unexpected error occurred.' };
};

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
      
      // Don't retry if it's a configuration error (it won't magically fix itself)
      const classification = classifyError(error);
      if (classification.type === 'CONFIG_ERROR') {
        throw error;
      }

      if (attempt < maxRetries) {
        console.warn(`Attempt ${attempt + 1} failed for ${actionName}, retrying...`, error);
        // Exponential backoff: 1s, 2s
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
      }
    }
  }
  throw lastError;
}
