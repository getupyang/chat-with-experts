/**
 * Conversation Logger - 自动记录用户对话
 *
 * 设计理念：
 * 1. 本地优先：立即存localStorage，用户刷新后能看历史
 * 2. 自动上传：异步POST到后端，失败不影响用户体验
 * 3. 匿名设计：不收集IP、设备指纹等隐私信息
 */

import { Expert, Message } from '../types';

export interface ConversationRecord {
  // 基础信息
  id: string;
  createdAt: string;
  completedAt?: string;

  // 用户输入
  userQuery: string;

  // 系统输出
  selectedExperts: {
    name: string;
    title: string;
    expertise: string;
  }[];

  debateMessages: {
    role: 'expert' | 'user';
    expertName?: string;
    content: string;
    timestamp: string;
  }[];

  // 元数据
  metadata: {
    strategyVersion: string;  // "v3_context_aware_cot"
    totalDuration: number;     // 毫秒
    expertSelectionTime?: number;
    debateGenerationTime?: number;
    language: string;
  };

  // 用户反馈（可选）
  feedback?: {
    rating?: 1 | 2 | 3 | 4 | 5;
    thumbs?: 'up' | 'down';
    comment?: string;
    submittedAt?: string;
  };

  // 内部debug信息（可选，仅在debug mode开启时记录）
  debug?: {
    contextAnalysis?: any;
    directorNotes?: any;
    errors?: any[];
  };
}

class ConversationLogger {
  private readonly STORAGE_KEY = 'conversation_history_v1';
  private readonly MAX_CONVERSATIONS = 50;
  private readonly UPLOAD_ENDPOINT = import.meta.env.VITE_ANALYTICS_ENDPOINT || null;

  private conversations: ConversationRecord[] = [];

  constructor() {
    this.loadFromStorage();
  }

  /**
   * 开始一个新对话
   */
  startConversation(userQuery: string, language: string): string {
    const id = this.generateId();

    const record: ConversationRecord = {
      id,
      createdAt: new Date().toISOString(),
      userQuery,
      selectedExperts: [],
      debateMessages: [],
      metadata: {
        strategyVersion: 'v3_context_aware_cot',
        totalDuration: 0,
        language
      }
    };

    this.conversations.unshift(record);
    this.persist();

    return id;
  }

  /**
   * 记录专家选择结果
   */
  logExpertSelection(
    conversationId: string,
    experts: Expert[],
    selectionTimeMs: number
  ) {
    const conv = this.findConversation(conversationId);
    if (!conv) return;

    conv.selectedExperts = experts.map(e => ({
      name: e.name,
      title: e.title,
      expertise: e.expertise
    }));

    conv.metadata.expertSelectionTime = selectionTimeMs;
    this.persist();
  }

  /**
   * 记录辩论消息
   */
  logDebateMessage(
    conversationId: string,
    message: Message
  ) {
    const conv = this.findConversation(conversationId);
    if (!conv) return;

    conv.debateMessages.push({
      role: message.role,
      expertName: message.expertName,
      content: message.content,
      timestamp: new Date().toISOString()
    });

    this.persist();
  }

  /**
   * 完成对话
   */
  completeConversation(
    conversationId: string,
    totalDurationMs: number,
    debateTimeMs?: number
  ) {
    const conv = this.findConversation(conversationId);
    if (!conv) return;

    conv.completedAt = new Date().toISOString();
    conv.metadata.totalDuration = totalDurationMs;

    if (debateTimeMs !== undefined) {
      conv.metadata.debateGenerationTime = debateTimeMs;
    }

    this.persist();

    // 异步上传（不阻塞用户）
    this.uploadConversation(conv).catch(err => {
      console.warn('Failed to upload conversation, but saved locally:', err);
    });
  }

  /**
   * 添加用户反馈
   */
  addFeedback(
    conversationId: string,
    feedback: { rating?: number; thumbs?: 'up' | 'down'; comment?: string }
  ) {
    const conv = this.findConversation(conversationId);
    if (!conv) return;

    conv.feedback = {
      ...feedback,
      submittedAt: new Date().toISOString()
    } as any;

    this.persist();

    // 重新上传（包含反馈）
    this.uploadConversation(conv).catch(() => {});
  }

  /**
   * 添加debug信息（仅在debug mode时）
   */
  addDebugInfo(conversationId: string, debugData: any) {
    const conv = this.findConversation(conversationId);
    if (!conv) return;

    conv.debug = {
      ...conv.debug,
      ...debugData
    };

    this.persist();
  }

  /**
   * 获取所有对话历史
   */
  getConversations(): ConversationRecord[] {
    return this.conversations;
  }

  /**
   * 获取单个对话
   */
  getConversation(id: string): ConversationRecord | undefined {
    return this.findConversation(id);
  }

  /**
   * 清空所有对话
   */
  clearAll() {
    this.conversations = [];
    localStorage.removeItem(this.STORAGE_KEY);
  }

  /**
   * 导出所有对话（供用户手动下载）
   */
  exportAll() {
    const data = {
      exportedAt: new Date().toISOString(),
      totalConversations: this.conversations.length,
      conversations: this.conversations
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-experts-history_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // ========== Private Methods ==========

  private findConversation(id: string): ConversationRecord | undefined {
    return this.conversations.find(c => c.id === id);
  }

  private generateId(): string {
    return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private loadFromStorage() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        this.conversations = JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load conversation history', e);
    }
  }

  private persist() {
    try {
      // 限制存储数量
      if (this.conversations.length > this.MAX_CONVERSATIONS) {
        this.conversations = this.conversations.slice(0, this.MAX_CONVERSATIONS);
      }

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.conversations));
    } catch (e) {
      console.error('Failed to save conversation history', e);
    }
  }

  /**
   * 上传到后端（异步，失败不影响用户）
   */
  private async uploadConversation(conv: ConversationRecord): Promise<void> {
    if (!this.UPLOAD_ENDPOINT) {
      // 没有配置endpoint，跳过上传
      return;
    }

    try {
      const response = await fetch(this.UPLOAD_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversation: conv,
          clientTimestamp: new Date().toISOString(),
          // 可以添加一些匿名的环境信息
          environment: {
            language: navigator.language,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            screenSize: `${window.screen.width}x${window.screen.height}`,
            // 不包含IP、User Agent等隐私信息
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }

      console.log('✅ Conversation uploaded:', conv.id);
    } catch (error) {
      // 静默失败，不影响用户体验
      console.warn('Failed to upload conversation:', error);
      throw error;
    }
  }
}

export const conversationLogger = new ConversationLogger();
