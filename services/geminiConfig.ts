
// Model Registry
export const MODELS = {
  flash: "gemini-2.5-flash",
  pro: "gemini-3-pro-preview"
} as const;

export const AI_CONFIG = {
  // Switch this to 'v1_legacy' to rollback immediately
  // Switch to 'v2_intent_cot' to use the new Chain-of-Thought logic
  activeStrategyId: "v2_intent_cot", 
  
  strategies: {
    "v1_legacy": {
      id: "v1_legacy",
      model: MODELS.flash, // Downgraded from Pro for stability
      name: "Direct Response (Legacy)"
    },
    "v2_intent_cot": {
      id: "v2_intent_cot",
      // EMERGENCY FIX: Downgrading 'executionModel' from Pro to Flash due to Google API 500/Quota errors.
      // Restore to MODELS.pro when quota allows.
      executionModel: MODELS.flash, 
      planningModel: MODELS.flash, 
      name: "Intent-First CoT (Flash Optimized)"
    }
  }
};