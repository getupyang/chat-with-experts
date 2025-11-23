
import React, { useState } from 'react';
import { X, Languages, Trash2, AlertCircle, Code, Download } from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../utils/localization';
import { debugLogger } from '../utils/debugLogger';

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
  // Local state for debug mode to force re-render on toggle
  const [debugEnabled, setDebugEnabled] = useState(debugLogger.isEnabledStatus());

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
      // Also clear logs when history is cleared? Maybe optional, but safer to keep logs unless explicitly cleared.
      onClose();
    }
  };
  
  const handleToggleDebug = () => {
    const newState = !debugEnabled;
    setDebugEnabled(newState);
    debugLogger.setEnabled(newState);
    // Persist preference (simple localStorage for boolean)
    localStorage.setItem('debug_mode_enabled', String(newState));
  };

  const handleExportLogs = () => {
    debugLogger.exportLogs();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 animate-fade-in backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl mx-4 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
          <h3 className="text-lg font-bold text-gray-800">{t.settings}</h3>
          <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto scrollbar-thin">
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
        </div>
      </div>
    </div>
  );
};
