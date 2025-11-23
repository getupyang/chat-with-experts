export type Language = 'en' | 'zh' | 'es' | 'ja' | 'fr';

export interface Expert {
  name: string;
  title: string;
  reason: string;
  style: string;
}

export interface Message {
  id: string;
  role: 'user' | 'expert';
  content: string;
  expertName?: string;
  timestamp: number;
}

export interface ChatSession {
  id: string;
  topic: string;
  experts: Expert[];
  messages: Message[];
  createdAt: string;
}

export type LoadingState = 'idle' | 'finding-experts' | 'generating-debate' | 'error';