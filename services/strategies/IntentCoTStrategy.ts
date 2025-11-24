
import { Type } from "@google/genai";
import { Expert, Message, Language } from "../../types";
import { debugLogger } from "../../utils/debugLogger";
import { ai, retryOperation } from "../geminiClient";
import { DebateStrategy } from "./types";
import { AI_CONFIG } from "../geminiConfig";
import { LegacyStrategy } from "./LegacyStrategy";

export class IntentCoTStrategy implements DebateStrategy {
  id = "v2_intent_cot";
  private config = AI_CONFIG.strategies["v2_intent_cot"];
  // Fallback to legacy for expert selection for now, as the core innovation is in debate flow
  private legacyStrategy = new LegacyStrategy();

  async fetchExperts(topic: string, language: Language): Promise<Expert[]> {
    return this.legacyStrategy.fetchExperts(topic, language);
  }

  async fetchReplacementExpert(topic: string, currentExperts: Expert[], excludedExpertName: string, language: Language): Promise<Expert> {
    return this.legacyStrategy.fetchReplacementExpert(topic, currentExperts, excludedExpertName, language);
  }

  /**
   * Step 1: The "Director" Agent.
   * Analyzes intent and writes a script/instruction for the actors.
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
    const lastMessage = history[history.length - 1];
    const historyText = history.map(h => `${h.role === 'user' ? 'User' : h.expertName}: ${h.content}`).join("\n");

    const planningPrompt = `
      You are the **Director** of a high-level expert roundtable. 
      
      **Current Situation**:
      Topic: "${topic}"
      Experts: ${expertNames}
      Language Context: ${language}
      
      **Dialogue History**:
      ${historyText}

      **Your Task**:
      1. **Analyze the User**: What is the user's *real* underlying need? (e.g., they complained about "vague advice", so they actually need "concrete steps/tools").
      2. **Critique Context**: Did the previous expert responses fail to hit the mark? Why?
      3. **Direct the Show**: 
         - Who should speak next? (Choose 1-2 experts).
         - What specific angle or tone should they take? (e.g., "Be empathetic but firm", "Give a specific KPI example").
      
      Output valid JSON.
    `;

    const config = {
      model: this.config.planningModel, // Use fast model for reasoning
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
      debugLogger.log(actionName, "v2_cot_director", config, responseText, latency);

      return JSON.parse(responseText || "{}");
    } catch (error) {
      console.warn("Planning step failed, falling back to empty plan", error);
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
    
    // --- Phase 1: Planning (The "Thought" Process) ---
    let plan = null;
    // Only run CoT if there is history (not the first turn), or always if desired.
    // For first turn, "Introduction" is usually standard, but CoT can still help align tone.
    // Let's run it always for consistency.
    plan = await this.analyzeIntentAndPlan(topic, experts, history, language);

    // --- Phase 2: Execution (The "Acting" Process) ---
    
    const expertProfiles = experts.map(e => `- ${e.name} (${e.title}): ${e.reason}. Speaking Style: ${e.style}`).join("\n");
    
    const historyPrompt = history.map(h => {
        if (h.role === 'user') return `User: ${h.content}`;
        return `${h.expertName}: ${h.content}`;
    }).join("\n");

    // Constructing the Director's Note to inject into the model
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

    const systemInstruction = `
      You are simulating a deep roundtable discussion.
      
      Participants:
      1. User (User): Proposed an idea.
      2. Expert Panel:
      ${expertProfiles}

      Instructions:
      1. You do not need to act as a "host", strictly roleplay these specific experts.
      2. **Follow the Director's Notes**: I will provide a hidden "Director's Note" below. You MUST follow its specific instructions on *who* speaks and *what* angle they take.
      3. **Style Mimicry**: Crucial. Must match the persona.
      4. **Language**: The entire conversation must be conducted in ${language} language.
      5. **Strict Formatting**:
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

      ${directorNote}
      
      Please continue the discussion based on the Director's Notes above.
    `;

    const config = {
      model: this.config.model, // Using Pro model for execution
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
      debugLogger.log(actionName, "v2_cot_execution", config, responseText, latency);

      return responseText || "";
    } catch (error) {
      const latency = Date.now() - startTime;
      debugLogger.log(actionName, "v2_cot_execution", config, { error: String(error) }, latency);
      
      console.error("Failed to generate debate v2:", error);
      throw error;
    }
  }
}
