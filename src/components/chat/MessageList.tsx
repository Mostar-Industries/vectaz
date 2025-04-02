
import React, { useRef, useEffect } from 'react';
import { Loader2, Bot } from 'lucide-react';
import MessageItem, { Message } from './MessageItem';
import { useVoiceFunctions } from './useVoiceFunctions';

interface MessageListProps {
  messages: Message[];
  isProcessing: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ messages, isProcessing }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { playMessageAudio, currentMessageId } = useVoiceFunctions();

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  // Apply isPlaying flag to messages based on currentMessageId
  const messagesWithPlayingState = messages.map(message => ({
    ...message,
    isPlaying: currentMessageId === message.id
  }));

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messagesWithPlayingState.map(message => (
        <MessageItem 
          key={message.id} 
          message={message} 
          onPlayVoice={() => playMessageAudio(message)}
        />
      ))}
      
      {isProcessing && (
        <div className="flex justify-start">
          <div className="max-w-[80%] rounded-lg px-4 py-2 bg-black/40 border border-blue-500/10 text-white">
            <div className="flex items-center gap-2">
              <Bot className="h-4 w-4 text-cyan-400" />
              <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />
              <span className="text-xs">DeepTalk is analyzing...</span>
            </div>
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
