
import React from 'react';
import { RefreshCw } from 'lucide-react';
import { Expert, Language } from '../types';
import { getTranslation } from '../utils/localization';

interface ExpertCardProps {
  expert: Expert;
  language: Language;
  onReplace?: (expertName: string) => void;
  isReplacing?: boolean;
}

export const ExpertCard: React.FC<ExpertCardProps> = ({ 
  expert, 
  language, 
  onReplace,
  isReplacing = false
}) => {
  const t = getTranslation(language);
  
  return (
    <div className={`bg-white border rounded-xl p-4 shadow-sm transition-all flex flex-col gap-2 h-full animate-fade-in relative group ${
      isReplacing ? 'border-indigo-200 ring-2 ring-indigo-100' : 'border-gray-200 hover:shadow-md'
    }`}>
      
      {/* Loading Overlay for Replacement */}
      {isReplacing && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 rounded-xl flex items-center justify-center">
          <RefreshCw className="animate-spin text-indigo-600" size={24} />
        </div>
      )}

      {/* Action Buttons - Visible on Hover/Mobile */}
      {onReplace && !isReplacing && (
        <div className="absolute top-2 right-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity z-20">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onReplace(expert.name);
            }}
            className="p-1.5 bg-white text-gray-400 hover:text-indigo-600 border border-gray-200 hover:border-indigo-200 rounded-lg shadow-sm transition-colors"
            title={t.replaceExpert}
          >
            <RefreshCw size={14} />
          </button>
        </div>
      )}

      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-sm">
          {expert.name[0]}
        </div>
        <div className="min-w-0 flex-1 py-0.5">
          <h3 className="font-bold text-gray-800 text-sm leading-snug break-words">{expert.name}</h3>
          <p className="text-xs text-gray-500 leading-tight mt-0.5 break-words font-medium">{expert.title}</p>
        </div>
      </div>
      
      {/* Changed overflow-hidden to overflow-y-auto and added scrollbar-thin to handle long text */}
      <div className="bg-gray-50 rounded-lg p-3 overflow-y-auto scrollbar-thin flex-1 border border-gray-100/50 mt-1 max-h-[200px] md:max-h-none">
        <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-wrap">
          {expert.reason}
        </p>
      </div>
    </div>
  );
};
