
import { Type } from "@google/genai";
import { Expert, Message, Language } from "../../types";
import { debugLogger } from "../../utils/debugLogger";
import { ai, retryOperation } from "../geminiClient";
import { DebateStrategy } from "./types";
import { AI_CONFIG } from "../geminiConfig";
import { PROMPTS } from "../prompts";

/**
 * V3 Strategy: Context-Aware Chain-of-Thought
 *
 * Key improvements over V2:
 * 1. Deep user context analysis (role, resources, expectations)
 * 2. Context-aware expert selection (match user's situation, not just topic)
 * 3. Enhanced "no fluff" rule in expert responses
 * 4. Better expert match analysis
 */
export class ContextAwareCoTStrategy implements DebateStrategy {
  id = "v3_context_aware_cot";
  private config = AI_CONFIG.strategies["v3_context_aware_cot"];

  /**
   * Step 1: Analyze user context deeply before selecting experts
   */
  private async analyzeUserContext(
    topic: string,
    history: Message[],
    language: Language
  ): Promise<any> {
    const historyText = history.map(h => `${h.role === 'user' ? 'User' : h.expertName}: ${h.content}`).join("\n");

    // Use V2 deep director for initial context analysis
    const planningPrompt = PROMPTS.director_planning_v2_deep(topic, "", historyText, language);

    const config = {
      model: this.config.planningModel,
      contents: planningPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            userProfile: {
              type: Type.OBJECT,
              properties: {
                role: { type: Type.STRING },
                resourceLevel: { type: Type.STRING },
                emotionalState: { type: Type.STRING },
                expertiseLevel: { type: Type.STRING }
              }
            },
            expectationType: { type: Type.STRING },
            contextSignals: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            expertMatchAnalysis: {
              type: Type.OBJECT,
              properties: {
                shouldAvoid: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                shouldPrefer: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
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
      }, 'v3_context_analysis');

      debugLogger.log({
        action: 'v3_context_analysis',
        context: { role: 'context_analyzer', model: this.config.planningModel },
        input: config,
        output: responseText,
        latencyMs: 0
      });

      return JSON.parse(responseText || "{}");
    } catch (error) {
      console.warn("Context analysis failed, using defaults", error);
      return null;
    }
  }

  /**
   * Step 2: Select experts based on user context
   */
  async fetchExperts(topic: string, language: Language): Promise<Expert[]> {
    const startTime = Date.now();

    // Analyze user context first
    const userContext = await this.analyzeUserContext(topic, [], language);

    // Format context for expert recruiter
    let contextString = "";
    if (userContext) {
      const profile = userContext.userProfile || {};
      contextString = `
User Role: ${profile.role || "Unknown"}
Resource Level: ${profile.resourceLevel || "Unknown"}
Expertise Level: ${profile.expertiseLevel || "Unknown"}
Expectation Type: ${userContext.expectationType || "Unknown"}
Should Avoid: ${userContext.expertMatchAnalysis?.shouldAvoid?.join(", ") || "None"}
Should Prefer: ${userContext.expertMatchAnalysis?.shouldPrefer?.join(", ") || "None"}
Key Signals: ${userContext.contextSignals?.join("; ") || "None"}
      `.trim();
    } else {
      contextString = "Context analysis unavailable, please select based on topic only.";
    }

    // Use V2 context-aware expert recruiter
    const promptContent = PROMPTS.expert_recruiter_v2_context_aware(topic, contextString, language);

    const config = {
      model: this.config.planningModel,
      contents: promptContent,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              title: { type: Type.STRING },
              reason: { type: Type.STRING },
              style: { type: Type.STRING }
            },
            required: ["name", "title", "reason", "style"]
          }
        }
      }
    };

    try {
      const responseText = await retryOperation(async () => {
        const res = await ai.models.generateContent(config);
        return res.text;
      }, 'fetch_experts_v3_context_aware');

      const latency = Date.now() - startTime;

      debugLogger.log({
        action: 'fetch_experts_v3_context_aware',
        context: { model: this.config.planningModel, promptVersion: 'v3.0_context_aware' },
        input: config,
        output: responseText,
        latencyMs: latency
      });

      return JSON.parse(responseText || "[]");
    } catch (error) {
      console.error("Failed to fetch experts:", error);
      throw error;
    }
  }

  async fetchReplacementExpert(
    topic: string,
    currentExperts: Expert[],
    excludedExpertName: string,
    language: Language
  ): Promise<Expert> {
    // For replacement, we still use the legacy prompt for now
    // TODO: Create context-aware replacement in future iteration
    const existingNames = currentExperts.map(e => e.name).join(", ");
    const promptContent = PROMPTS.replacement_expert_v1(topic, existingNames, excludedExpertName, language);

    const config = {
      model: this.config.planningModel,
      contents: promptContent,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            title: { type: Type.STRING },
            reason: { type: Type.STRING },
            style: { type: Type.STRING }
          },
          required: ["name", "title", "reason", "style"]
        }
      }
    };

    try {
      const responseText = await retryOperation(async () => {
        const res = await ai.models.generateContent(config);
        return res.text;
      }, 'fetch_replacement_expert_v3');

      debugLogger.log({
        action: 'fetch_replacement_expert_v3',
        context: { model: this.config.planningModel },
        input: config,
        output: responseText
      });

      return JSON.parse(responseText || "{}");
    } catch (error) {
      console.error("Failed to fetch replacement expert:", error);
      throw error;
    }
  }

  /**
   * Step 3: Deep intent analysis using V2 director
   */
  private async analyzeIntentAndPlan(
    topic: string,
    experts: Expert[],
    history: Message[],
    language: Language
  ): Promise<any> {
    const startTime = Date.now();
    const actionName = 'v3_cot_planning';

    const expertNames = experts.map(e => e.name).join(", ");
    const historyText = history.map(h => `${h.role === 'user' ? 'User' : h.expertName}: ${h.content}`).join("\n");

    // Use V2 deep director prompt
    const planningPrompt = PROMPTS.director_planning_v2_deep(topic, expertNames, historyText, language);

    const config = {
      model: this.config.planningModel,
      contents: planningPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            userProfile: {
              type: Type.OBJECT,
              properties: {
                role: { type: Type.STRING },
                resourceLevel: { type: Type.STRING },
                emotionalState: { type: Type.STRING }
              }
            },
            expectationType: { type: Type.STRING },
            contextSignals: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            expertMatchAnalysis: {
              type: Type.OBJECT,
              properties: {
                currentExpertsGoodFit: { type: Type.BOOLEAN },
                mismatchReason: { type: Type.STRING }
              }
            },
            responseStrategy: {
              type: Type.OBJECT,
              properties: {
                tone: { type: Type.STRING },
                structure: { type: Type.STRING },
                interactionStyle: { type: Type.STRING },
                avoidPatterns: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                }
              }
            },
            nextTurnPlan: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  expertName: { type: Type.STRING },
                  instruction: { type: Type.STRING }
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

  /**
   * Step 4: Generate expert responses with enhanced director notes
   */
  async fetchDebateResponse(
    topic: string,
    experts: Expert[],
    history: Message[],
    language: Language
  ): Promise<string> {
    const startTime = Date.now();
    const actionName = 'fetch_debate_response_v3_context_aware_cot';
    const PROMPT_VERSION = "v3.0_context_aware_cot";

    // Phase 1: Deep Planning
    let plan = null;
    plan = await this.analyzeIntentAndPlan(topic, experts, history, language);

    // Phase 2: Execution with enhanced director notes
    const expertProfiles = experts.map(e => `- ${e.name} (${e.title}): ${e.reason}. Speaking Style: ${e.style}`).join("\n");

    const historyPrompt = history.map(h => {
        if (h.role === 'user') return `User: ${h.content}`;
        return `${h.expertName}: ${h.content}`;
    }).join("\n");

    // Construct enhanced Director's Note
    let directorNote = "";
    if (plan) {
      const profile = plan.userProfile || {};
      const strategy = plan.responseStrategy || {};

      directorNote = `
      \n--- 🎬 DIRECTOR'S NOTES (HIDDEN INSTRUCTION) ---
      > **User Profile**:
      >   - Role: ${profile.role || "Unknown"}
      >   - Resource Level: ${profile.resourceLevel || "Unknown"}
      >   - Emotional State: ${profile.emotionalState || "Unknown"}
      >
      > **Expectation Type**: ${plan.expectationType || "Unknown"}
      >
      > **Context Signals**: ${plan.contextSignals?.join("; ") || "None"}
      >
      > **Expert Match**: ${plan.expertMatchAnalysis?.currentExpertsGoodFit ? "✅ Good fit" : "⚠️ " + (plan.expertMatchAnalysis?.mismatchReason || "Unknown")}
      >
      > **Response Strategy**:
      >   - Tone: ${strategy.tone || "Professional"}
      >   - Structure: ${strategy.structure || "Standard"}
      >   - Interaction: ${strategy.interactionStyle || "Collaborative"}
      >   - AVOID: ${strategy.avoidPatterns?.join(", ") || "Generic fluff"}
      >
      > **Action Plan**:
      ${plan.nextTurnPlan?.map((p: any) => `  - **${p.expertName}**: ${p.instruction}`).join('\n') || "  Standard discussion"}
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
      model: this.config.executionModel,
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

      console.error("Failed to generate debate v3:", error);
      throw error;
    }
  }
}
