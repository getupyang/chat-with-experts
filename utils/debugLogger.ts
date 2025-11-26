

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR';
  action: string;
  
  // Metadata
  context?: {
    promptVersion?: string;
    model?: string;
    networkStatus?: string;
    [key: string]: any;
  };

  // Data
  input?: any;
  output?: any;
  
  // Performance & Errors
  latencyMs: number;
  error?: {
    message: string;
    stack?: string;
    type?: string;
  };
}

export interface LogParams {
  action: string;
  level?: 'INFO' | 'WARN' | 'ERROR';
  context?: Record<string, any>;
  input?: any;
  output?: any;
  latencyMs?: number;
  error?: any;
}

class DebugLogger {
  private logs: LogEntry[] = [];
  private isEnabled: boolean = false;
  private readonly STORAGE_KEY = 'debug_flight_recorder_v2';
  private readonly MAX_LOGS = 100;

  constructor() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        this.logs = JSON.parse(saved);
      }
    } catch (e) {
      console.warn("Failed to load debug logs", e);
    }
  }

  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }

  isEnabledStatus() {
    return this.isEnabled;
  }

  log(params: LogParams) {
    // Always log critical errors even if debug is off, but don't persist unless enabled
    // Actually, for this "Flight Recorder" feature, we probably want to capture everything in memory
    // but only persist/export if enabled. 
    // For now, let's stick to the "enabled" flag to avoid overhead.
    if (!this.isEnabled) return;

    const entry: LogEntry = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
      timestamp: new Date().toISOString(),
      level: params.level || (params.error ? 'ERROR' : 'INFO'),
      action: params.action,
      context: {
        networkStatus: navigator.onLine ? 'online' : 'offline',
        userAgent: navigator.userAgent,
        ...params.context
      },
      input: params.input,
      output: params.output,
      latencyMs: params.latencyMs || 0,
      error: params.error ? {
        message: params.error.message || String(params.error),
        stack: params.error.stack,
        type: params.error.name
      } : undefined
    };

    this.logs.unshift(entry); // Add to beginning (newest first)

    if (this.logs.length > this.MAX_LOGS) {
      this.logs = this.logs.slice(0, this.MAX_LOGS);
    }

    this.persist();
  }

  private persist() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.logs));
    } catch (e) {
      // Ignore storage errors
    }
  }

  clear() {
    this.logs = [];
    localStorage.removeItem(this.STORAGE_KEY);
  }

  getLogs() {
    return this.logs;
  }

  exportLogs() {
    if (this.logs.length === 0) {
      alert("No logs to export.");
      return;
    }

    // @ts-ignore
    const envMode = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env.MODE : 'unknown';

    const exportData = {
      exportedAt: new Date().toISOString(),
      appVersion: "0.2.4", // v0.2.4: Context-aware CoT with deep intent understanding
      environment: envMode,
      totalLogs: this.logs.length,
      logs: this.logs
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat_experts_debug_${new Date().toISOString().slice(0,16).replace(/:/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

export const debugLogger = new DebugLogger();