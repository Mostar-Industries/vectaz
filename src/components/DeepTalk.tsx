
import React, { useState, useEffect } from 'react';
import { BrainCircuit, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';
import MessageList from './chat/MessageList';
import PromptSuggestions from './chat/PromptSuggestions';
import ChatInput from './chat/ChatInput';
import { Message } from './chat/MessageItem';
import { useVoiceFunctions } from './chat/useVoiceFunctions';

interface DeepTalkProps {
  className?: string;
  initialMessage?: string;
  onQueryData?: (query: string) => Promise<string>;
  onClose?: () => void;
}

const DeepTalk: React.FC<DeepTalkProps> = ({ 
  className,
  initialMessage = "How can I assist with your logistics decisions today? You can ask me about routes, forwarders, costs, or risk analytics.",
  onQueryData,
  onClose 
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
  
  const { speakResponse } = useVoiceFunctions();

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
        
        // Speak the response using the African female voice
        speakResponse(responseText);
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
    <div className={cn("flex flex-col h-full overflow-hidden rounded-lg bg-black/60 backdrop-blur-md border border-blue-500/20", className)}>
      <div className="px-4 py-3 border-b border-blue-500/20 bg-black/50 flex justify-between items-center">
        <div className="flex items-center">
          <BrainCircuit className="h-5 w-5 text-cyan-400 mr-2" />
          <h3 className="text-sm font-medium text-white">DeepTalk Assistant</h3>
          <span className="ml-2 px-1.5 py-0.5 text-xs bg-cyan-500/20 text-cyan-400 rounded-sm">v2.0</span>
        </div>
        {onClose && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="h-8 w-8 rounded-full bg-transparent hover:bg-blue-500/10 text-blue-400"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <MessageList messages={messages} isProcessing={isProcessing} />
      
      <PromptSuggestions promptIdeas={promptIdeas} onPromptClick={handlePromptClick} />
      
      <ChatInput 
        input={input}
        setInput={setInput}
        handleSendMessage={handleSendMessage}
        isProcessing={isProcessing}
      />
    </div>
  );
};

export default DeepTalk;
