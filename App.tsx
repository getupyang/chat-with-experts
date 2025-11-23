
import React, { useState, useEffect, useRef } from 'react';
import { Menu, Users, Loader2, ArrowUp, BrainCircuit } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { ExpertCard } from './components/ExpertCard';
import { ChatBubble } from './components/ChatBubble';
import { WelcomeScreen } from './components/WelcomeScreen';
import { SettingsModal } from './components/SettingsModal';
import { fetchExperts, fetchDebateResponse, fetchReplacementExpert } from './services/geminiService';
import { ChatSession, Message, Language } from './types';
import { getTranslation } from './utils/localization';
import { debugLogger } from './utils/debugLogger';

const getSystemLanguage = (): Language => {
  const lang = navigator.language.toLowerCase();
  if (lang.startsWith('zh')) return 'zh';
  if (lang.startsWith('es')) return 'es';
  if (lang.startsWith('ja')) return 'ja';
  if (lang.startsWith('fr')) return 'fr';
  return 'en';
};

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [chats, setChats] = useState<ChatSession[]>([]); 
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  
  // State Isolation: Track WHICH chat is loading
  const [loadingChatId, setLoadingChatId] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState("");
  
  // Track which expert is currently being replaced (by name)
  const [replacingExpertName, setReplacingExpertName] = useState<string | null>(null);

  const [language, setLanguage] = useState<Language>('en'); // Default to 'en' initially

  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // Derived state
  const activeChat = chats.find(c => c.id === currentChatId);
  const t = getTranslation(language);
  
  // Check if the CURRENT view is loading (for UI blocking)
  // CRITICAL FIX: Ensure loadingChatId is NOT null before comparing
  const isCurrentChatLoading = loadingChatId !== null && loadingChatId === currentChatId;

  // Initialize
  useEffect(() => {
    // Load Language
    const savedLang = localStorage.getItem('app_language') as Language;
    if (savedLang) {
      setLanguage(savedLang);
    } else {
      setLanguage(getSystemLanguage());
    }

    // Load Debug Mode Preference
    const debugPref = localStorage.getItem('debug_mode_enabled');
    if (debugPref === 'true') {
      debugLogger.setEnabled(true);
    }

    // Load Chats
    try {
      const saved = localStorage.getItem('debate_chats_v2');
      if (saved) setChats(JSON.parse(saved));
    } catch (e) {
      console.error("Failed to load history", e);
    }
    
    // Auto close sidebar on mobile
    if (window.innerWidth < 768) {
        setSidebarOpen(false);
    }
  }, []);

  // Save changes
  useEffect(() => {
    localStorage.setItem('debate_chats_v2', JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    localStorage.setItem('app_language', language);
  }, [language]);

  // Clear input when switching chats to prevent ghost text
  useEffect(() => {
    setInput("");
  }, [currentChatId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
       chatContainerRef.current.scrollTo({
         top: chatContainerRef.current.scrollHeight,
         behavior: 'smooth'
       });
    }
  }, [activeChat?.messages.length, loadingChatId]);

  const createNewChat = () => {
    setCurrentChatId(null);
    setInput("");
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  const handleClearHistory = () => {
    setChats([]);
    setCurrentChatId(null);
    localStorage.removeItem('debate_chats_v2');
  };

  const handleReplaceExpert = async (expertName: string) => {
    if (!activeChat || isCurrentChatLoading || replacingExpertName) return;

    setReplacingExpertName(expertName);
    
    try {
      const newExpert = await fetchReplacementExpert(
        activeChat.topic,
        activeChat.experts,
        expertName,
        language
      );

      setChats(prev => prev.map(c => {
        if (c.id === activeChat.id) {
          const updatedExperts = c.experts.map(e => e.name === expertName ? newExpert : e);
          return { ...c, experts: updatedExperts };
        }
        return c;
      }));

    } catch (error) {
      console.error("Failed to replace expert", error);
      alert("Could not find a replacement expert right now.");
    } finally {
      setReplacingExpertName(null);
    }
  };

  const handleSendMessage = async (textInput: string) => {
    if (!textInput.trim() || isCurrentChatLoading) return;

    const timestamp = Date.now();
    let chatId = currentChatId;
    let chat = activeChat;

    // Initialize new chat if needed
    if (!chatId || !chat) {
      const newChat: ChatSession = {
        id: timestamp.toString(),
        topic: textInput,
        experts: [],
        messages: [], 
        createdAt: new Date().toISOString()
      };
      setChats(prev => [newChat, ...prev]);
      setCurrentChatId(newChat.id);
      chatId = newChat.id;
      chat = newChat;
    }

    // Set loading for THIS chat ID
    setLoadingChatId(chatId);

    // Add user message
    const userMsg: Message = { id: `msg-${Date.now()}`, role: 'user', content: textInput, timestamp };
    
    setChats(prev => prev.map(c => c.id === chatId ? { ...c, messages: [...c.messages, userMsg] } : c));
    setInput("");

    try {
      // Step 1: Fetch Experts if not exists
      let currentExperts = chat.experts;
      if (currentExperts.length === 0) {
        setLoadingMessage(t.loadingExperts);
        
        currentExperts = await fetchExperts(textInput, language);
        
        // Update chat with experts
        setChats(prev => prev.map(c => c.id === chatId ? { ...c, experts: currentExperts, topic: textInput } : c));
      }

      // Step 2: Generate Debate
      setLoadingMessage(t.generatingDebate);
      
      // Get latest history including the new user message
      const updatedHistory = [...(chat.messages || []), userMsg];
      
      const rawResponse = await fetchDebateResponse(textInput, currentExperts, updatedHistory, language);
      
      processAndAddResponse(chatId, rawResponse);

    } catch (err) {
      console.error(err);
      // Ideally show a toast or error message in UI
      alert("Failed to connect to the network. Please try again.");
    } finally {
      setLoadingChatId(null);
      setLoadingMessage("");
    }
  };

  const processAndAddResponse = (chatId: string, rawText: string) => {
    const lines = rawText.split('\n');
    const newMessages: Message[] = [];
    let currentSpeaker: string | null = null;
    let currentBuffer = "";

    const flushBuffer = () => {
      if (currentBuffer.trim()) {
        newMessages.push({
          id: `msg-${Date.now()}-${Math.random()}`,
          role: 'expert',
          expertName: currentSpeaker || "Expert Panel",
          content: currentBuffer.trim(),
          timestamp: Date.now()
        });
      }
      currentBuffer = "";
    };

    // Simple parsing logic for "**Name**: Content" format
    lines.forEach(line => {
      // Regex looks for **Name**: at the start
      const match = line.match(/^\*\*(.*?)\*\*:\s*(.*)/);
      if (match) {
        flushBuffer();
        currentSpeaker = match[1];
        currentBuffer = match[2] + "\n";
      } else {
        currentBuffer += line + "\n";
      }
    });
    flushBuffer();

    // Fallback if no specific speaker detected
    if (newMessages.length === 0 && rawText.trim()) {
      newMessages.push({ 
        id: `msg-${Date.now()}`,
        role: 'expert', 
        expertName: "Panel", 
        content: rawText, 
        timestamp: Date.now() 
      });
    }

    setChats(prev => prev.map(c => c.id === chatId ? { ...c, messages: [...c.messages, ...newMessages] } : c));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(input);
    }
  };

  return (
    <div className="flex h-screen w-full bg-gray-50 font-sans text-gray-900 overflow-hidden">
      
      <SettingsModal 
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        currentLanguage={language}
        onLanguageChange={setLanguage}
        onClearHistory={handleClearHistory}
      />

      <Sidebar 
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        chats={chats}
        currentChatId={currentChatId}
        onSelectChat={setCurrentChatId}
        onNewChat={createNewChat}
        onOpenSettings={() => setSettingsOpen(true)}
        language={language}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full relative min-w-0 bg-white md:bg-gray-50 transition-all duration-300">
        
        {/* Header */}
        <header className="h-16 border-b border-gray-200 bg-white flex items-center px-4 md:px-6 justify-between flex-shrink-0 z-10 shadow-sm md:shadow-none">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-100 rounded-lg md:hidden text-gray-600">
              <Menu size={20} />
            </button>
            <h1 className="font-semibold text-gray-800 truncate max-w-[200px] md:max-w-md text-lg">
              {activeChat ? (activeChat.topic || t.startNew) : t.appTitle}
            </h1>
          </div>
          {activeChat && activeChat.experts.length > 0 && (
             <div className="hidden md:flex items-center text-xs font-medium text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-full shadow-sm animate-fade-in">
                <Users size={14} className="mr-1.5" />
                {activeChat.experts.length} Experts Active
             </div>
          )}
        </header>

        {/* Chat Area */}
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto min-h-0 p-4 md:p-6 lg:p-8 scroll-smooth relative">
          {!activeChat ? (
            <WelcomeScreen onSuggestionClick={handleSendMessage} language={language} />
          ) : (
            <div className="max-w-4xl mx-auto pb-4">
              {/* Expert Cards Row */}
              {activeChat.experts.length > 0 && (
                <div className="mb-10 animate-slide-up">
                  <div className="flex items-center gap-2 mb-4 text-gray-400 text-xs uppercase tracking-widest font-bold ml-1">
                    <Users size={12} />
                    {t.panelMembers}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {activeChat.experts.map((expert, idx) => (
                      <ExpertCard 
                        key={idx} 
                        expert={expert} 
                        language={language}
                        onReplace={handleReplaceExpert}
                        isReplacing={replacingExpertName === expert.name}
                      />
                    ))}
                  </div>
                  <div className="my-8 border-t border-gray-200/60" />
                </div>
              )}

              {/* Messages */}
              <div className="space-y-2">
                {activeChat.messages.length === 0 && loadingChatId === activeChat.id && (
                    <div className="text-center py-20">
                       <div className="animate-pulse flex flex-col items-center">
                          <div className="h-16 w-16 bg-indigo-50 text-indigo-600 rounded-full mb-6 flex items-center justify-center ring-4 ring-indigo-50/50">
                            <BrainCircuit className="animate-spin-slow w-8 h-8" />
                          </div>
                          <p className="text-gray-500 font-medium text-sm tracking-wide">{loadingMessage}</p>
                       </div>
                    </div>
                )}
                
                {activeChat.messages.map((msg) => (
                  <ChatBubble key={msg.id} message={msg} />
                ))}

                {/* Loading Indicator for ongoing chat */}
                {activeChat.messages.length > 0 && loadingChatId === activeChat.id && (
                  <div className="flex gap-4 mb-6 animate-pulse pt-2">
                     <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                        <Users size={18} className="text-gray-400" />
                     </div>
                     <div className="flex items-center">
                        <span className="text-gray-400 text-xs font-medium">{loadingMessage || "Thinking..."}</span>
                        <span className="flex gap-1 ml-2">
                          <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </span>
                     </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 md:p-6 bg-white border-t border-gray-200 z-30 flex-shrink-0">
          <div className="max-w-4xl mx-auto relative group">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={activeChat ? t.inputPlaceholder : t.newTopicPlaceholder}
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-5 pr-14 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 focus:bg-white transition-all resize-none shadow-sm text-sm md:text-base disabled:opacity-60 disabled:cursor-not-allowed"
              rows={1}
              style={{ minHeight: '60px' }} 
              disabled={isCurrentChatLoading}
            />
            <button 
              onClick={() => handleSendMessage(input)}
              disabled={!input.trim() || isCurrentChatLoading}
              className={`absolute right-3 bottom-3 p-2.5 rounded-xl transition-all duration-200 ${
                input.trim() && !isCurrentChatLoading
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg hover:-translate-y-0.5' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isCurrentChatLoading ? <Loader2 size={20} className="animate-spin" /> : <ArrowUp size={20} />}
            </button>
          </div>
          <p className="text-center text-[10px] text-gray-400 mt-3 font-medium tracking-wide">
            {t.disclaimer}
          </p>
        </div>

      </main>
      <style>{`
        .animate-spin-slow { animation: spin 3s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
