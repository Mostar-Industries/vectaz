
import React from 'react';
import { Bot, User, Volume2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useVoiceFunctions } from './useVoiceFunctions';

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  personality?: string;
}

interface MessageItemProps {
  message: Message;
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const { speakResponse, isSpeaking } = useVoiceFunctions();
  
  const handleSpeakMessage = () => {
    if (message.sender === 'ai') {
      speakResponse(message.text);
    }
  };
  
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
          
          {/* Add speak button for AI messages */}
          {message.sender === 'ai' && (
            <button 
              onClick={handleSpeakMessage}
              className={cn(
                "ml-2 transition-colors",
                isSpeaking ? "text-green-400 hover:text-green-300" : "text-cyan-400 hover:text-cyan-300"
              )}
              title="Speak this message"
            >
              <Volume2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <p className="text-sm whitespace-pre-line">{message.text}</p>
      </div>
    </div>
  );
};

export default MessageItem;
