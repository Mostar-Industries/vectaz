
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, BrainCircuit } from 'lucide-react';
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
  initialMessage = "How can I assist with your logistics decisions today? You can ask me about routes, forwarders, costs, or risk analytics.",
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
  const [promptIdeas, setPromptIdeas] = useState<string[]>([
    "What's our most disrupted route?",
    "Compare DHL and Kenya Airways performance",
    "Which warehouse has the best reliability?",
    "How can we optimize our shipping costs?",
    "What are the trends in our logistics performance?"
  ]);
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
      // Call the NLU processor via the provided callback
      let responseText = "I'm analyzing the logistics data now...";
      
      if (onQueryData) {
        responseText = await onQueryData(input);
      } else {
        // Mock responses if no handler is provided
        responseText = "I don't have access to the logistics data right now. Please ensure the DeepTalk handler is properly connected.";
      }
      
      // Generate new prompt ideas based on the current conversation context
      generateNewPromptIdeas(input, responseText);
      
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

  // Generate new prompt ideas based on conversation context
  const generateNewPromptIdeas = (userQuery: string, aiResponse: string) => {
    const lowerQuery = userQuery.toLowerCase();
    const lowerResponse = aiResponse.toLowerCase();
    
    // Contextual prompt suggestions based on the conversation flow
    if (lowerQuery.includes('risk') || lowerQuery.includes('disruption')) {
      setPromptIdeas([
        "How can we reduce disruption risk?",
        "What factors contribute to our delivery delays?",
        "Which routes have improved reliability recently?",
        "What's our contingency plan for high-risk corridors?",
        "Predict disruption probability for next month"
      ]);
    } else if (lowerQuery.includes('forwarder') || lowerQuery.includes('carrier')) {
      setPromptIdeas([
        "Who should we use for high-value shipments?",
        "Which forwarder has the best cost-to-reliability ratio?",
        "Should we consolidate our carrier base?",
        "Compare transit times between our top carriers",
        "What's our optimal forwarder allocation strategy?"
      ]);
    } else if (lowerQuery.includes('cost') || lowerQuery.includes('expense')) {
      setPromptIdeas([
        "Where can we find the biggest cost savings?",
        "What's the ROI on premium shipping options?",
        "How can we optimize our shipping modes?",
        "Compare costs between our top corridors",
        "What's driving our logistics cost increases?"
      ]);
    } else if (lowerResponse.includes('recommend') || lowerResponse.includes('suggest')) {
      setPromptIdeas([
        "Tell me more about that recommendation",
        "What's the expected impact of these changes?",
        "How long would implementation take?",
        "What are the risks of this approach?",
        "Are there alternative strategies we should consider?"
      ]);
    } else {
      // General follow-up questions
      setPromptIdeas([
        "Why is that happening?",
        "How does that compare to industry benchmarks?",
        "What's the trend over the last quarter?",
        "How can we improve those metrics?",
        "What's the root cause analysis?"
      ]);
    }
  };

  const handlePromptClick = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <div className={cn("flex flex-col h-full overflow-hidden border rounded-lg bg-background", className)}>
      <div className="px-4 py-3 border-b bg-card">
        <div className="flex items-center">
          <BrainCircuit className="h-5 w-5 text-primary mr-2" />
          <h3 className="text-sm font-medium">DeepTalk Assistant</h3>
          <span className="ml-2 px-1.5 py-0.5 text-xs bg-primary/10 text-primary rounded-sm">v2.0</span>
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
      
      {/* Prompt suggestions */}
      <div className="px-4 py-2 border-t bg-muted/30">
        <div className="flex flex-wrap gap-2">
          {promptIdeas.map((prompt, index) => (
            <button
              key={index}
              onClick={() => handlePromptClick(prompt)}
              className="text-xs px-2 py-1 rounded-full bg-muted hover:bg-muted/80 transition-colors text-muted-foreground"
            >
              {prompt}
            </button>
          ))}
        </div>
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
            className="bg-primary hover:bg-primary/90"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeepTalk;
