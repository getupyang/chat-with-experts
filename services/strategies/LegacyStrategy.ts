
import { Type } from "@google/genai";
import { Expert, Message, Language } from "../../types";
import { debugLogger } from "../../utils/debugLogger";
import { ai, retryOperation } from "../geminiClient";
import { DebateStrategy } from "./types";
import { AI_CONFIG } from "../geminiConfig";

export class LegacyStrategy implements DebateStrategy {
  id = "v1_legacy";
  private config = AI_CONFIG.strategies["v1_legacy"];

  async fetchExperts(topic: string, language: Language): Promise<Expert[]> {
    const startTime = Date.now();
    const actionName = 'fetch_experts_legacy';
    const PROMPT_VERSION = "v1.0.6_legacy";
    
    const prompt = `
      You are a world-class knowledge graph and think tank assembly expert. The user's input is a thought or inspiration about a topic.
      Your task is: Identify 2 to 4 real human experts best suited to discuss this topic with the user.

      Selection Rules:
      1. Authenticity: Must be real-world people (historical figures, contemporary scholars, industry KOLs, famous open source authors, etc.).
      2. Diversity:
         - If the view is controversial, choose experts with opposing views.
         - Include at least one "exact match" industry expert.
         - If appropriate, include a "cross-border thinker".
      3. Quantity: 2-4 people.
      4. Reason: Please give a detailed recommendation reason, explaining why this person is suitable for this topic.
      
      IMPORTANT: The output content (Title, Reason, Style) MUST be written in ${language} language.

      User Input: "${topic}"
    `;

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
    const PROMPT_VERSION = "v1.0.6_legacy";

    const existingNames = currentExperts.map(e => e.name).join(", ");
      
    const prompt = `
      Context: The user is discussing "${topic}".
      Current Panel: ${existingNames}.
      Task: The user wants to replace "${excludedExpertName}" with a NEW, different expert.
      
      Requirements:
      1. Find a real-world expert who offers a DIFFERENT perspective than the current panel.
      2. Do NOT suggest anyone already in the panel.
      3. The new expert should be relevant but perhaps from a different field or school of thought compared to the one being removed.
      4. Language: Output Title, Reason, Style in ${language}.

      Return a JSON object for a single expert.
    `;

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
    const PROMPT_VERSION = "v1.0.6_legacy";

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

    const systemInstruction = `
      You are simulating a deep roundtable discussion.
      
      Participants:
      1. User (User): Proposed an idea.
      2. Expert Panel:
      ${expertProfiles}

      Instructions:
      1. You do not need to act as a "host", strictly roleplay these specific experts.
      ${participationInstruction}
      3. **Style Mimicry**: Crucial. Must match the persona.
      4. Allow experts to supplement each other or debate slightly.
      5. Keep the conversation inspiring. Don't just agree; offer counter-intuitive views or deepen the discussion.
      6. **Language**: The entire conversation must be conducted in ${language} language.
      7. **Strict Formatting**:
         Use Markdown.
         Before each expert speaks, you **MUST** start with "**Expert Name**: " (Note the bold and colon).
         Example:
         **Kevin Kelly**: I believe...
         
      Context: The user has just said something or the conversation is ongoing.
    `;

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
