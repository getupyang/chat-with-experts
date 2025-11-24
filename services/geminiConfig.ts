
export const AI_CONFIG = {
  // Switch this to 'v1_legacy' to rollback immediately
  // Switch to 'v2_intent_cot' to use the new Chain-of-Thought logic
  activeStrategyId: "v2_intent_cot", 
  
  strategies: {
    "v1_legacy": {
      id: "v1_legacy",
      model: "gemini-3-pro-preview", // Or gemini-2.5-flash if you prefer speed
      name: "Direct Response (Legacy)"
    },
    "v2_intent_cot": {
      id: "v2_intent_cot",
      model: "gemini-3-pro-preview", // The "Actor" model
      planningModel: "gemini-2.5-flash", // The "Director" model (fast reasoning)
      name: "Intent-First CoT (New)"
    }
  }
};
