
import React, { useState, useEffect } from 'react';
import { X, Languages, Trash2, AlertCircle, Code, Download, Activity, ChevronDown, ChevronRight } from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../utils/localization';
import { debugLogger, LogEntry } from '../utils/debugLogger';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  onClearHistory: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  currentLanguage, 
  onLanguageChange,
  onClearHistory
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'logs'>('general');
  const [debugEnabled, setDebugEnabled] = useState(debugLogger.isEnabledStatus());
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && activeTab === 'logs') {
      setLogs(debugLogger.getLogs());
      // Auto refresh logs every 2s while open
      const interval = setInterval(() => {
        setLogs([...debugLogger.getLogs()]);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isOpen, activeTab]);

  if (!isOpen) return null;

  const t = getTranslation(currentLanguage);

  const languages: { code: Language; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'zh', label: '中文 (Chinese)' },
    { code: 'es', label: 'Español' },
    { code: 'fr', label: 'Français' },
    { code: 'ja', label: '日本語' },
  ];

  const handleClear = () => {
    if (window.confirm(t.clearHistoryConfirm)) {
      onClearHistory();
      onClose();
    }
  };
  
  const handleToggleDebug = () => {
    const newState = !debugEnabled;
    setDebugEnabled(newState);
    debugLogger.setEnabled(newState);
    localStorage.setItem('debug_mode_enabled', String(newState));
  };

  const handleExportLogs = () => {
    debugLogger.exportLogs();
  };

  const renderLogs = () => {
    if (logs.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-48 text-gray-400 text-sm">
          <Activity size={32} className="mb-2 opacity-20" />
          <p>No logs recorded yet.</p>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {logs.map(log => {
          const isError = log.level === 'ERROR';
          const isWarn = log.level === 'WARN';
          const isExpanded = expandedLogId === log.id;

          return (
            <div key={log.id} className={`border rounded-lg text-xs font-mono overflow-hidden ${isError ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-gray-50'}`}>
              <button 
                onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                className="w-full flex items-center p-2 text-left hover:bg-black/5 transition-colors gap-2"
              >
                {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                <span className={`font-bold ${isError ? 'text-red-600' : isWarn ? 'text-amber-600' : 'text-blue-600'}`}>
                  [{log.level}]
                </span>
                <span className="text-gray-500">{log.timestamp.split('T')[1].split('.')[0]}</span>
                <span className="flex-1 font-semibold truncate text-gray-700">{log.action}</span>
                {log.latencyMs > 0 && <span className="text-gray-400">{log.latencyMs}ms</span>}
              </button>
              
              {isExpanded && (
                <div className="p-2 border-t border-gray-200/50 bg-white overflow-x-auto">
                   <div className="grid grid-cols-[80px_1fr] gap-1 mb-2">
                      <span className="text-gray-400">Status:</span>
                      <span className={log.context?.networkStatus === 'offline' ? 'text-red-500 font-bold' : 'text-green-600'}>
                         {log.context?.networkStatus || 'unknown'}
                      </span>
                      {log.error && (
                        <>
                           <span className="text-red-500 font-bold">Error:</span>
                           <span className="text-red-600 break-words">{log.error.message}</span>
                        </>
                      )}
                   </div>
                   <pre className="text-[10px] text-gray-600 whitespace-pre-wrap leading-tight">
                     {JSON.stringify({ input: log.input, output: log.output, error: log.error }, null, 2)}
                   </pre>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 animate-fade-in backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl mx-4 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex gap-4">
             <button 
               onClick={() => setActiveTab('general')}
               className={`text-sm font-bold pb-1 border-b-2 transition-colors ${activeTab === 'general' ? 'text-gray-800 border-indigo-600' : 'text-gray-400 border-transparent hover:text-gray-600'}`}
             >
               {t.settings}
             </button>
             <button 
               onClick={() => setActiveTab('logs')}
               className={`text-sm font-bold pb-1 border-b-2 transition-colors ${activeTab === 'logs' ? 'text-gray-800 border-indigo-600' : 'text-gray-400 border-transparent hover:text-gray-600'}`}
             >
               System Logs
             </button>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto scrollbar-thin">
          
          {activeTab === 'general' ? (
            <>
              {/* Language Section */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-3 text-indigo-600 font-semibold text-sm uppercase tracking-wider">
                   <Languages size={16} />
                   <span>{t.language}</span>
                </div>
                <div className="space-y-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        onLanguageChange(lang.code);
                      }}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-between ${
                        currentLanguage === lang.code
                          ? 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200'
                          : 'bg-white border border-gray-100 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <span>{lang.label}</span>
                      {currentLanguage === lang.code && <div className="w-2 h-2 rounded-full bg-indigo-600"></div>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Developer Mode Section */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-3 text-gray-600 font-semibold text-sm uppercase tracking-wider">
                   <Code size={16} />
                   <span>{t.devMode}</span>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{t.enableDebugLog}</span>
                    <button 
                      onClick={handleToggleDebug}
                      className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
                        debugEnabled ? 'bg-indigo-600' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${
                        debugEnabled ? 'translate-x-5' : ''
                      }`} />
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 leading-snug">
                    {t.debugLogDesc}
                  </p>
                  
                  {debugEnabled && (
                    <button 
                      onClick={handleExportLogs}
                      className="w-full py-2.5 bg-white border border-indigo-200 text-indigo-600 rounded-lg text-sm font-semibold hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <Download size={16} />
                      {t.exportDebugData}
                    </button>
                  )}
                </div>
              </div>

              {/* Data Management Section */}
              <div>
                <div className="flex items-center gap-2 mb-3 text-red-500 font-semibold text-sm uppercase tracking-wider">
                   <Trash2 size={16} />
                   <span>{t.dataManagement}</span>
                </div>
                <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                  <div className="flex gap-3 mb-3">
                     <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
                     <p className="text-xs text-red-600 leading-relaxed">
                       {t.clearHistoryConfirm}
                     </p>
                  </div>
                  <button 
                    onClick={handleClear}
                    className="w-full py-2.5 bg-white border border-red-200 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-600 hover:text-white transition-colors"
                  >
                    {t.clearHistory}
                  </button>
                </div>
              </div>
            </>
          ) : (
            // LOGS TAB
            <div className="space-y-4">
               <div className="flex justify-between items-center">
                 <h4 className="text-sm font-bold text-gray-800">Flight Recorder</h4>
                 <button onClick={handleExportLogs} className="text-xs text-indigo-600 hover:underline">
                   Export JSON
                 </button>
               </div>
               {renderLogs()}
               {!debugEnabled && (
                 <div className="p-3 bg-amber-50 text-amber-800 text-xs rounded-lg border border-amber-200">
                   Debug logging is currently <strong>disabled</strong>. Only critical boot errors are shown. Enable it in the General tab to capture full traffic.
                 </div>
               )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
