import React from 'react';
import { Sparkles, Quote, Zap } from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../utils/localization';

interface WelcomeScreenProps {
  onSuggestionClick: (text: string) => void;
  language: Language;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onSuggestionClick, language }) => {
  const t = getTranslation(language);
  const suggestions = t.suggestions;
  
  // Helper to get icon based on index
  const getIcon = (idx: number) => {
    if (idx === 1) return <Zap size={16} />;
    return <Quote size={16} />;
  };

  const colors = [
    "text-indigo-600",
    "text-purple-600",
    "text-blue-600",
    "text-pink-600"
  ];

  return (
    <div className="min-h-full flex flex-col items-center justify-center max-w-2xl mx-auto animate-fade-in pb-12 px-4">
      <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mb-8 shadow-sm shrink-0 ring-4 ring-indigo-50/50">
        <Sparkles size={40} />
      </div>
      <h2 className="text-3xl font-bold text-gray-900 mb-3 text-center tracking-tight">{t.welcomeTitle}</h2>
      <p className="text-gray-500 mb-12 text-center max-w-lg leading-relaxed">
        {t.welcomeDesc}
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full text-sm">
        {suggestions.map((item, idx) => (
          <button 
            key={idx}
            onClick={() => onSuggestionClick(item.question)}
            className="p-5 bg-white border border-gray-200 rounded-2xl text-left hover:border-indigo-300 hover:shadow-lg hover:-translate-y-0.5 transition-all group duration-300"
          >
            <div className={`flex items-center gap-2 mb-2 ${colors[idx % colors.length]} font-bold`}>
              {getIcon(idx)}
              <span>{item.title}</span>
            </div>
            <p className="text-gray-500 text-xs group-hover:text-gray-700 leading-relaxed font-medium">
              "{item.question}"
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};