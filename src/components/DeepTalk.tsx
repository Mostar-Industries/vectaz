
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, BrainCircuit, X, Mic, MicOff } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";

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
  const [isRecording, setIsRecording] = useState(false);
  const [promptIdeas, setPromptIdeas] = useState<string[]>([
    "What's our most disrupted route?",
    "Compare DHL and Kenya Airways performance",
    "Which warehouse has the best reliability?",
    "How can we optimize our shipping costs?",
    "What are the trends in our logistics performance?"
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

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

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        try {
          // Process audio through Rasa/voice-to-text service
          const text = await processAudioToText(audioBlob);
          setInput(text);
          
          // Automatically send the transcribed message
          setTimeout(() => {
            if (text.trim()) {
              const userMessage: Message = {
                id: Date.now().toString(),
                text,
                sender: 'user',
                timestamp: new Date()
              };
              
              setMessages(prev => [...prev, userMessage]);
              setInput('');
              
              // Process the voice input
              handleVoiceInput(text);
            }
          }, 500);
        } catch (error) {
          console.error('Error processing audio:', error);
          toast({
            title: "Speech Recognition Error",
            description: "We couldn't understand that. Please try again or type your question.",
            variant: "destructive",
          });
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      
      toast({
        title: "Recording Started",
        description: "I'm listening. Speak clearly...",
      });
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        title: "Microphone Error",
        description: "Could not access your microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      
      toast({
        title: "Processing Your Voice",
        description: "Converting your speech to text...",
      });
    }
  };

  const processAudioToText = async (audioBlob: Blob): Promise<string> => {
    // This is a placeholder for the actual implementation
    // In a real implementation, this would call the Rasa NLU service or other speech-to-text service
    
    // Mock implementation for demonstration purposes
    return new Promise((resolve) => {
      setTimeout(() => {
        // This would be replaced with actual API call results
        resolve("What are the logistics trends for Kenya in the last quarter?");
      }, 1000);
    });
  };

  const handleVoiceInput = async (text: string) => {
    setIsProcessing(true);
    
    try {
      let responseText = "I'm analyzing your voice query...";
      
      if (onQueryData) {
        responseText = await onQueryData(text);
      } else {
        responseText = "Voice processing is currently unavailable. Please try again later.";
      }
      
      // Generate new prompt ideas based on the current conversation context
      generateNewPromptIdeas(text, responseText);
      
      // Add AI response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsProcessing(false);
      
      // Speak the response
      speakResponse(responseText);
    } catch (error) {
      console.error('Error processing voice query:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I couldn't process your voice query. Please try again or type your question.",
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      setIsProcessing(false);
    }
  };

  const speakResponse = (text: string) => {
    // This is a placeholder for the actual implementation
    // In a real implementation, this would use the African female voice
    // through a text-to-speech service

    // For demonstration, we'll use the browser's built-in speech synthesis
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Try to find a female voice, preferably African if available
      const voices = window.speechSynthesis.getVoices();
      const femaleVoice = voices.find(voice => 
        voice.name.toLowerCase().includes('female') || 
        voice.name.toLowerCase().includes('woman')
      );
      
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }
      
      // Set other properties to make it sound more natural
      utterance.pitch = 1.1;  // Slightly higher pitch for female voice
      utterance.rate = 0.9;   // Slightly slower for clarity
      
      window.speechSynthesis.speak(utterance);
    }
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
              </div>
              <p className="text-sm whitespace-pre-line">{message.text}</p>
            </div>
          </div>
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
      
      {/* Prompt suggestions */}
      <div className="px-4 py-2 border-t border-blue-500/20 bg-black/30">
        <div className="flex overflow-x-auto pb-2 gap-2 hide-scrollbar">
          {promptIdeas.map((prompt, index) => (
            <button
              key={index}
              onClick={() => handlePromptClick(prompt)}
              className="text-xs shrink-0 px-2 py-1 rounded-full bg-blue-500/10 hover:bg-blue-500/20 transition-colors text-blue-400"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
      
      <div className="p-4 border-t border-blue-500/20">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask about routes, forwarders, or risk metrics..."
            className="flex-1 px-4 py-2 rounded-lg border border-blue-500/20 bg-black/30 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button 
            onClick={isRecording ? stopRecording : startRecording}
            size="icon"
            variant="outline"
            className={cn(
              "bg-transparent border border-blue-500/20",
              isRecording ? "text-red-400 hover:text-red-500" : "text-blue-400 hover:text-blue-500"
            )}
          >
            {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
          <Button 
            onClick={handleSendMessage}
            disabled={!input.trim() || isProcessing}
            size="icon"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeepTalk;
