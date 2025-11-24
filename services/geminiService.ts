
import { Expert, Message, Language } from "../types";
import { AI_CONFIG } from "./geminiConfig";
import { DebateStrategy } from "./strategies/types";
import { LegacyStrategy } from "./strategies/LegacyStrategy";
import { IntentCoTStrategy } from "./strategies/IntentCoTStrategy";

// --- Strategy Registry ---
const strategies: Record<string, DebateStrategy> = {
  "v1_legacy": new LegacyStrategy(),
  "v2_intent_cot": new IntentCoTStrategy()
};

// --- Strategy Resolver ---
const getStrategy = (): DebateStrategy => {
  const id = AI_CONFIG.activeStrategyId;
  const strategy = strategies[id];
  if (!strategy) {
    console.warn(`Strategy ${id} not found, falling back to legacy.`);
    return strategies["v1_legacy"];
  }
  return strategy;
};

/**
 * Identifies and recruits experts based on the topic.
 */
export const fetchExperts = async (topic: string, language: Language): Promise<Expert[]> => {
  return getStrategy().fetchExperts(topic, language);
};

/**
 * Fetches a single replacement expert.
 */
export const fetchReplacementExpert = async (
  topic: string, 
  currentExperts: Expert[], 
  excludedExpertName: string,
  language: Language
): Promise<Expert> => {
  return getStrategy().fetchReplacementExpert(topic, currentExperts, excludedExpertName, language);
};

/**
 * Generates the debate content based on the experts and conversation history.
 */
export const fetchDebateResponse = async (
  topic: string, 
  experts: Expert[], 
  history: Message[],
  language: Language
): Promise<string> => {
  return getStrategy().fetchDebateResponse(topic, experts, history, language);
};
