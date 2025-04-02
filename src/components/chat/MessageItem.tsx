
import React from 'react';
import { Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  personality?: string; // Personality property
  model?: string; // Added model property
}

interface MessageItemProps {
  message: Message;
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  return (
    <div 
      className={cn(
        "flex",
        message.sender === 'user' ? "justify-end" : "justify-start"
      )}
    >
      <div 
        className={cn(
          "max-w-[90%] md:max-w-[80%] rounded-lg px-4 py-2",
          message.sender === 'user' 
            ? "bg-blue-500 text-white"
            : "bg-black/40 border border-blue-500/10 text-white"
        )}
      >
        <div className="flex items-center gap-2 mb-1">
          {message.sender === 'ai' 
            ? <Bot className="h-4 w-4 text-cyan-400" /> 
            : <User className="h-4 w-4" />
          }
          <span className="text-xs opacity-75">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          {message.personality && (
            <span className="text-xs opacity-75 ml-1 bg-blue-500/20 px-1 rounded">
              {message.personality}
            </span>
          )}
          {message.model && (
            <span className="text-xs opacity-75 ml-1 bg-purple-500/20 px-1 rounded">
              {message.model.replace('eleven_', '')}
            </span>
          )}
        </div>
        <p className="text-sm whitespace-pre-line">{message.text}</p>
      </div>
    </div>
  );
};

export default MessageItem;
