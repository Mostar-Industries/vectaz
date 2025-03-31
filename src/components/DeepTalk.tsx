
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface DeepTalkProps {
  className?: string;
  initialMessage?: string;
  onQueryData?: (query: string) => Promise<string>;
}

const DeepTalk: React.FC<DeepTalkProps> = ({ 
  className,
  initialMessage = "How can I assist with your logistics decisions today?",
  onQueryData 
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      text: initialMessage,
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);
    
    try {
      // In a real implementation, this would call the RASA backend
      // For demo, we use the provided callback or a mock response
      let responseText = "I'm analyzing the logistics data now...";
      
      if (onQueryData) {
        responseText = await onQueryData(input);
      } else {
        // Mock responses based on common queries
        if (input.toLowerCase().includes('most disrupted route')) {
          responseText = "Based on our data, the Kenya to Ethiopia route has experienced the highest disruption with a score of 0.68. This is primarily due to border crossing delays and political instability in the region.";
        } else if (input.toLowerCase().includes('best forwarder')) {
          responseText = "For overall reliability, Kuehne Nagel has the highest performance score (0.89) across all routes. However, for specific East African routes, Kenya Airways offers better transit times.";
        } else if (input.toLowerCase().includes('why')) {
          responseText = "The ranking is based on our AHP-TOPSIS algorithm which evaluates multiple criteria. This forwarder scored highest in reliability (0.92) and had competitive cost metrics (0.78), giving it the best overall closeness coefficient.";
        } else {
          responseText = "I'm not sure I understand that query. You can ask about route disruptions, forwarder performance, or specific logistics metrics.";
        }
      }
      
      // Add AI response after a short delay to simulate thinking
      setTimeout(() => {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: responseText,
          sender: 'ai',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, aiMessage]);
        setIsProcessing(false);
      }, 1000);
    } catch (error) {
      console.error('Error processing query:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I couldn't process that request. Please try again or verify that the data is loaded.",
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      setIsProcessing(false);
    }
  };

  return (
    <div className={cn("flex flex-col h-full overflow-hidden border rounded-lg bg-background", className)}>
      <div className="px-4 py-3 border-b bg-card">
        <div className="flex items-center">
          <Bot className="h-5 w-5 text-primary mr-2" />
          <h3 className="text-sm font-medium">DeepTalk Assistant</h3>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <div 
            key={message.id}
            className={cn(
              "flex",
              message.sender === 'user' ? "justify-end" : "justify-start"
            )}
          >
            <div 
              className={cn(
                "max-w-[80%] rounded-lg px-4 py-2",
                message.sender === 'user' 
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                {message.sender === 'ai' 
                  ? <Bot className="h-4 w-4" /> 
                  : <User className="h-4 w-4" />
                }
                <span className="text-xs opacity-75">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-sm whitespace-pre-line">{message.text}</p>
            </div>
          </div>
        ))}
        
        {isProcessing && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg px-4 py-2 bg-muted">
              <div className="flex items-center gap-2">
                <Bot className="h-4 w-4" />
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-xs">DeepTalk is analyzing...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask about routes, forwarders, or risk metrics..."
            className="flex-1 px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!input.trim() || isProcessing}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeepTalk;
