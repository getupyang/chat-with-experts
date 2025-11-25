
import { Type } from "@google/genai";
import { Expert, Message, Language } from "../../types";
import { debugLogger } from "../../utils/debugLogger";
import { ai, retryOperation } from "../geminiClient";
import { DebateStrategy } from "./types";
import { AI_CONFIG } from "../geminiConfig";
import { PROMPTS } from "../prompts";

export class LegacyStrategy implements DebateStrategy {
  id = "v1_legacy";
  private config = AI_CONFIG.strategies["v1_legacy"];

  async fetchExperts(topic: string, language: Language): Promise<Expert[]> {
    const startTime = Date.now();
    const actionName = 'fetch_experts_legacy';
    const PROMPT_VERSION = "v1.1_config_driven";
    
    const prompt = PROMPTS.expert_recruiter_v1(topic, language);

    const config = {
      model: this.config.model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: "Name of the expert" },
              title: { type: Type.STRING, description: `Title or Identity (in ${language})` },
              reason: { type: Type.STRING, description: `Why selected? (in ${language})` },
              style: { type: Type.STRING, description: `Speaking style description (in ${language})` }
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
      }, actionName);
      
      const latency = Date.now() - startTime;
      
      debugLogger.log({
        action: actionName,
        context: { promptVersion: PROMPT_VERSION, model: this.config.model },
        input: config,
        output: responseText,
        latencyMs: latency
      });

      const jsonStr = responseText || "[]";
      return JSON.parse(jsonStr) as Expert[];

    } catch (error) {
      const latency = Date.now() - startTime;
      debugLogger.log({
        action: actionName,
        level: 'ERROR',
        context: { promptVersion: PROMPT_VERSION, model: this.config.model },
        input: config,
        latencyMs: latency,
        error: error
      });
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
    const startTime = Date.now();
    const actionName = 'fetch_replacement_expert_legacy';
    const PROMPT_VERSION = "v1.1_config_driven";

    const existingNames = currentExperts.map(e => e.name).join(", ");
    const prompt = PROMPTS.replacement_expert_v1(topic, existingNames, excludedExpertName, language);

    const config = {
      model: this.config.model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: "Name of the expert" },
            title: { type: Type.STRING, description: `Title or Identity` },
            reason: { type: Type.STRING, description: `Why this specific replacement?` },
            style: { type: Type.STRING, description: `Speaking style` }
          },
          required: ["name", "title", "reason", "style"]
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
        context: { promptVersion: PROMPT_VERSION, model: this.config.model },
        input: config,
        output: responseText,
        latencyMs: latency
      });

      const jsonStr = responseText || "{}";
      return JSON.parse(jsonStr) as Expert;

    } catch (error) {
      const latency = Date.now() - startTime;
      debugLogger.log({
        action: actionName,
        level: 'ERROR',
        context: { promptVersion: PROMPT_VERSION, model: this.config.model },
        input: config,
        latencyMs: latency,
        error: error
      });
      console.error("Failed to fetch replacement:", error);
      throw error;
    }
  }

  async fetchDebateResponse(
    topic: string, 
    experts: Expert[], 
    history: Message[], 
    language: Language
  ): Promise<string> {
    const startTime = Date.now();
    const actionName = 'fetch_debate_response_legacy';
    const PROMPT_VERSION = "v1.1_config_driven";

    const expertProfiles = experts.map(e => `- ${e.name} (${e.title}): ${e.reason}. Speaking Style: ${e.style}`).join("\n");
    
    const historyPrompt = history.map(h => {
        if (h.role === 'user') return `User: ${h.content}`;
        return `${h.expertName}: ${h.content}`;
    }).join("\n");

    const isFirstTurn = history.length <= 1;

    let participationInstruction = "";
    if (isFirstTurn) {
        participationInstruction = `2. **Opening Round**: Since this is the beginning of the discussion, allow **ALL** experts to briefly introduce their stance or initial reaction to the user's topic.`;
    } else {
        participationInstruction = `2. **Discussion Flow**: Do NOT make all experts speak at once. Based on the last message, decide which 1-2 experts would most naturally respond to move the conversation forward.`;
    }

    const systemInstruction = PROMPTS.debate_system_instruction_v1(expertProfiles, participationInstruction, language);

    const fullPrompt = `
      Conversation History:
      ${historyPrompt}
      
      (If history is empty, the topic is: "${topic}")
      
      Please continue the discussion.
    `;

    const config = {
      model: this.config.model,
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
        context: { promptVersion: PROMPT_VERSION, model: this.config.model },
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
        context: { promptVersion: PROMPT_VERSION, model: this.config.model },
        input: config,
        latencyMs: latency,
        error: error
      });
      console.error("Failed to generate debate:", error);
      throw error;
    }
  }
}