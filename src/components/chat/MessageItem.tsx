
import React from 'react';
import { Bot, User, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  personality?: string; // Personality property
  model?: string; // Model property
  isPlaying?: boolean; // Added to track if this message is currently being spoken
}

interface MessageItemProps {
  message: Message;
  onPlayVoice?: (messageText: string) => void;
}

const MessageItem: React.FC<MessageItemProps> = ({ message, onPlayVoice }) => {
  const handlePlayClick = () => {
    if (onPlayVoice && message.sender === 'ai') {
      onPlayVoice(message.text);
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
          "max-w-[95%] sm:max-w-[90%] md:max-w-[80%] rounded-lg px-3 py-2 sm:px-4 sm:py-2 relative",
          message.sender === 'user' 
            ? "bg-blue-500 text-white"
            : "bg-black/40 border border-blue-500/10 text-white"
        )}
      >
        <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-1">
          {message.sender === 'ai' 
            ? <Bot className="h-3 w-3 sm:h-4 sm:w-4 text-cyan-400" /> 
            : <User className="h-3 w-3 sm:h-4 sm:w-4" />
          }
          <span className="text-[10px] sm:text-xs opacity-75">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          {message.personality && (
            <span className="text-[10px] sm:text-xs opacity-75 ml-1 bg-blue-500/20 px-1 rounded">
              {message.personality}
            </span>
          )}
          {message.model && (
            <span className="text-[10px] sm:text-xs opacity-75 ml-1 bg-purple-500/20 px-1 rounded">
              {message.model.replace('eleven_', '')}
            </span>
          )}
          
          {/* Play button for AI messages */}
          {message.sender === 'ai' && onPlayVoice && (
            <button 
              onClick={handlePlayClick}
              className="ml-auto text-cyan-400 hover:text-cyan-300 transition-colors"
              aria-label={message.isPlaying ? "Currently speaking" : "Play voice"}
            >
              {message.isPlaying 
                ? <Volume2 className="h-3 w-3 sm:h-4 sm:w-4 animate-pulse" /> 
                : <Volume2 className="h-3 w-3 sm:h-4 sm:w-4" />
              }
            </button>
          )}
        </div>
        <p className="text-xs sm:text-sm whitespace-pre-line">{message.text}</p>
        
        {message.isPlaying && (
          <div className="absolute bottom-1 right-1 w-6 sm:w-8 h-1">
            <div className="h-full bg-cyan-400/30 rounded-full overflow-hidden">
              <div className="h-full w-1/2 bg-cyan-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageItem;
