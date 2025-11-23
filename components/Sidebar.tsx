import React from 'react';
import { MessageSquare, Plus, BrainCircuit, X, Settings } from 'lucide-react';
import { ChatSession, Language } from '../types';
import { getTranslation } from '../utils/localization';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  chats: ChatSession[];
  currentChatId: string | null;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  onOpenSettings: () => void;
  language: Language;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  setIsOpen, 
  chats, 
  currentChatId, 
  onSelectChat, 
  onNewChat,
  onOpenSettings,
  language
}) => {
  const t = getTranslation(language);

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 md:hidden backdrop-blur-sm" 
          onClick={() => setIsOpen(false)} 
        />
      )}

      <aside className={`
          fixed md:relative z-50 h-full w-[280px] bg-white border-r border-gray-200 flex flex-col flex-shrink-0
          transition-transform duration-300 ease-in-out shadow-xl md:shadow-none
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
        <div className="p-5 border-b border-gray-100 flex items-center justify-between flex-shrink-0 bg-white">
          <div className="flex items-center gap-2.5 font-bold text-gray-800 text-lg tracking-tight">
            <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
                <BrainCircuit size={20} />
            </div>
            <span>{t.appTitle}</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="md:hidden text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 flex-shrink-0">
          <button 
            onClick={() => {
              onNewChat();
              if (window.innerWidth < 768) setIsOpen(false);
            }} 
            className="w-full flex items-center gap-2 justify-center bg-gray-900 hover:bg-gray-800 text-white py-3 px-4 rounded-xl transition-all shadow-sm hover:shadow-md font-medium text-sm group"
          >
            <Plus size={16} className="group-hover:scale-110 transition-transform" />
            <span>{t.startNew}</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-2 min-h-0 scrollbar-thin">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-3 mt-2">
            {t.history}
          </div>
          {chats.length === 0 ? (
            <div className="text-center py-10 px-4">
              <p className="text-sm text-gray-400">{t.noHistory}</p>
            </div>
          ) : (
            chats.map(chat => (
              <button
                key={chat.id}
                onClick={() => {
                  onSelectChat(chat.id);
                  if (window.innerWidth < 768) setIsOpen(false);
                }}
                className={`w-full text-left p-3 rounded-xl mb-1 transition-all flex items-center gap-3 group ${
                  currentChatId === chat.id 
                    ? 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-100' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <MessageSquare size={16} className={`shrink-0 transition-colors ${currentChatId === chat.id ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-500'}`} />
                <div className="truncate text-sm font-medium">
                  {chat.topic || t.startNew}
                </div>
              </button>
            ))
          )}
        </div>
        
        <div className="p-4 border-t border-gray-100 flex justify-between items-center flex-shrink-0 bg-gray-50/50">
           <div className="text-xs text-gray-400 font-medium">© 2025 {t.appTitle}</div>
           <div className="flex gap-2">
             <button 
                onClick={onOpenSettings}
                title={t.settings} 
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
             >
               <Settings size={16} />
             </button>
           </div>
        </div>
      </aside>
    </>
  );
};