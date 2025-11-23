
export interface LogEntry {
  id: string;
  timestamp: string;
  action: string;
  promptVersion: string;
  payload: any;
  response: any;
  latencyMs: number;
}

class DebugLogger {
  private logs: LogEntry[] = [];
  private isEnabled: boolean = false;
  private readonly STORAGE_KEY = 'debug_flight_recorder';
  private readonly MAX_LOGS = 50; // Limit to prevent localStorage overflow

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

  log(action: string, promptVersion: string, payload: any, response: any, latencyMs: number) {
    if (!this.isEnabled) return;

    const entry: LogEntry = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      action,
      promptVersion,
      payload, // This contains the runtime constructed prompt
      response,
      latencyMs
    };

    this.logs.push(entry);

    // Keep only last N logs
    if (this.logs.length > this.MAX_LOGS) {
      this.logs = this.logs.slice(this.logs.length - this.MAX_LOGS);
    }

    this.persist();
  }

  private persist() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.logs));
    } catch (e) {
      console.error("Failed to save debug logs to localStorage", e);
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

    const exportData = {
      exportedAt: new Date().toISOString(),
      appVersion: "1.0.0",
      totalLogs: this.logs.length,
      logs: this.logs
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat_experts_debug_${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

export const debugLogger = new DebugLogger();
