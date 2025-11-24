
import { Expert, Message, Language } from "../../types";

export interface DebateStrategy {
  id: string;
  
  /**
   * Identifies and recruits experts based on the topic.
   */
  fetchExperts(topic: string, language: Language): Promise<Expert[]>;
  
  /**
   * Fetches a single replacement expert.
   */
  fetchReplacementExpert(
    topic: string, 
    currentExperts: Expert[], 
    excludedExpertName: string, 
    language: Language
  ): Promise<Expert>;
  
  /**
   * Generates the debate content based on the experts and conversation history.
   */
  fetchDebateResponse(
    topic: string, 
    experts: Expert[], 
    history: Message[], 
    language: Language
  ): Promise<string>;
}
