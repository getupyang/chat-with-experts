
// Model Registry
export const MODELS = {
  flash: "gemini-2.5-flash",
  pro: "gemini-3-pro-preview"
} as const;

export const AI_CONFIG = {
  // V3: Context-Aware CoT - Deep user understanding + context-aware expert selection
  // V2: Intent-First CoT - Intent analysis + directed responses
  // V1: Legacy - Direct single-stage responses
  activeStrategyId: "v3_context_aware_cot",

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
    },
    "v3_context_aware_cot": {
      id: "v3_context_aware_cot",
      executionModel: MODELS.flash,
      planningModel: MODELS.flash,
      name: "Context-Aware CoT (v0.2.4)"
    }
  }
};