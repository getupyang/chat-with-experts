
import { Type } from "@google/genai";
import { Expert, Message, Language } from "../../types";
import { debugLogger } from "../../utils/debugLogger";
import { ai, retryOperation } from "../geminiClient";
import { DebateStrategy } from "./types";
import { AI_CONFIG } from "../geminiConfig";
import { LegacyStrategy } from "./LegacyStrategy";
import { PROMPTS } from "../prompts";

export class IntentCoTStrategy implements DebateStrategy {
  id = "v2_intent_cot";
  private config = AI_CONFIG.strategies["v2_intent_cot"];
  // Fallback to legacy for expert selection
  private legacyStrategy = new LegacyStrategy();

  async fetchExperts(topic: string, language: Language): Promise<Expert[]> {
    return this.legacyStrategy.fetchExperts(topic, language);
  }

  async fetchReplacementExpert(topic: string, currentExperts: Expert[], excludedExpertName: string, language: Language): Promise<Expert> {
    return this.legacyStrategy.fetchReplacementExpert(topic, currentExperts, excludedExpertName, language);
  }

  /**
   * Step 1: The "Director" Agent.
   */
  private async analyzeIntentAndPlan(
    topic: string,
    experts: Expert[],
    history: Message[],
    language: Language
  ): Promise<any> {
    const startTime = Date.now();
    const actionName = 'v2_cot_planning';
    
    const expertNames = experts.map(e => e.name).join(", ");
    const historyText = history.map(h => `${h.role === 'user' ? 'User' : h.expertName}: ${h.content}`).join("\n");

    const planningPrompt = PROMPTS.director_planning_v1(topic, expertNames, historyText, language);

    const config = {
      model: this.config.planningModel, 
      contents: planningPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            userUnderlyingNeed: { type: Type.STRING },
            contextCritique: { type: Type.STRING },
            nextTurnPlan: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  expertName: { type: Type.STRING },
                  instruction: { type: Type.STRING, description: "Specific direction for this expert" }
                }
              }
            }
          }
        }
      }
    };

    try {
      const responseText = await retryOperation(async () => {
         const res = await ai.models.generateContent(config);
         return res.text;
      }, actionName);
      
      const latency = Date.now() - startTime;
      
      debugLogger.log({
        action: actionName,
        context: { role: 'director', model: this.config.planningModel },
        input: config,
        output: responseText,
        latencyMs: latency
      });

      return JSON.parse(responseText || "{}");
    } catch (error) {
      console.warn("Planning step failed, falling back to empty plan", error);
      debugLogger.log({
        action: actionName,
        level: 'WARN',
        context: { role: 'director', model: this.config.planningModel },
        input: config,
        latencyMs: Date.now() - startTime,
        error: error
      });
      return null;
    }
  }

  async fetchDebateResponse(
    topic: string, 
    experts: Expert[], 
    history: Message[], 
    language: Language
  ): Promise<string> {
    const startTime = Date.now();
    const actionName = 'fetch_debate_response_v2_cot';
    const PROMPT_VERSION = "v1.1_config_driven_cot";
    
    // --- Phase 1: Planning ---
    let plan = null;
    plan = await this.analyzeIntentAndPlan(topic, experts, history, language);

    // --- Phase 2: Execution ---
    
    const expertProfiles = experts.map(e => `- ${e.name} (${e.title}): ${e.reason}. Speaking Style: ${e.style}`).join("\n");
    
    const historyPrompt = history.map(h => {
        if (h.role === 'user') return `User: ${h.content}`;
        return `${h.expertName}: ${h.content}`;
    }).join("\n");

    // Constructing the Director's Note
    let directorNote = "";
    if (plan) {
      directorNote = `
      \n--- 🎬 DIRECTOR'S NOTES (HIDDEN INSTRUCTION) ---
      > **User Insight**: ${plan.userUnderlyingNeed}
      > **Context Critique**: ${plan.contextCritique}
      > **Action Plan**:
      ${plan.nextTurnPlan?.map((p: any) => `  - **${p.expertName}**: ${p.instruction}`).join('\n') || "Standard reply"}
      ------------------------------------------------
      `;
    }

    const systemInstruction = PROMPTS.debate_system_instruction_v2_directed(expertProfiles, language);

    const fullPrompt = `
      Conversation History:
      ${historyPrompt}
      
      (If history is empty, the topic is: "${topic}")

      ${directorNote}
      
      Please continue the discussion based on the Director's Notes above.
    `;

    const config = {
      model: this.config.executionModel, // Dynamic model from config
      contents: fullPrompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7 
      }
    };

    try {
      const responseText = await retryOperation(async () => {
         const res = await ai.models.generateContent(config);
         return res.text;
      }, actionName);
      
      const latency = Date.now() - startTime;
      
      debugLogger.log({
        action: actionName,
        context: { role: 'actor', model: this.config.executionModel, promptVersion: PROMPT_VERSION },
        input: config,
        output: responseText,
        latencyMs: latency
      });

      return responseText || "";
    } catch (error) {
      const latency = Date.now() - startTime;
      debugLogger.log({
        action: actionName,
        level: 'ERROR',
        context: { role: 'actor', model: this.config.executionModel, promptVersion: PROMPT_VERSION },
        input: config,
        latencyMs: latency,
        error: error
      });
      
      console.error("Failed to generate debate v2:", error);
      throw error;
    }
  }
}