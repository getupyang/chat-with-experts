import React from 'react';
import { User, Users } from 'lucide-react';
import { Message } from '../types';

interface ChatBubbleProps {
  message: Message;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex gap-4 mb-6 ${isUser ? 'flex-row-reverse' : ''} animate-fade-in`}>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm transition-colors ${
        isUser ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-indigo-600'
      }`}>
        {isUser ? <User size={20} /> : (
           message.expertName ? <span className="font-bold text-sm">{message.expertName[0]}</span> : <Users size={20} />
        )}
      </div>
      <div className={`flex flex-col max-w-[85%] sm:max-w-[75%] ${isUser ? 'items-end' : 'items-start'}`}>
        {!isUser && message.expertName && (
          <span className="text-xs text-gray-500 mb-1 font-medium ml-1 flex items-center gap-1">
            {message.expertName}
          </span>
        )}
        <div className={`px-5 py-3 rounded-2xl text-sm leading-relaxed shadow-sm whitespace-pre-wrap ${
          isUser 
            ? 'bg-gray-900 text-white rounded-tr-none' 
            : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none'
        }`}>
          {message.content}
        </div>
      </div>
    </div>
  );
};