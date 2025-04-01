
import React, { useState, useRef } from 'react';
import { Send, Mic, MicOff } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  handleSendMessage: () => void;
  isProcessing: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ 
  input, 
  setInput, 
  handleSendMessage, 
  isProcessing 
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const { toast } = useToast();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

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
          // Process audio through voice-to-text service
          const text = await processAudioToText(audioBlob);
          setInput(text);
          
          // Automatically send the transcribed message
          if (text.trim()) {
            setTimeout(() => {
              handleSendMessage();
            }, 500);
          }
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
    // In a real implementation, this would call a speech-to-text service
    
    // Mock implementation for demonstration purposes
    return new Promise((resolve) => {
      setTimeout(() => {
        // This would be replaced with actual API call results
        resolve("What are the logistics trends for Kenya in the last quarter?");
      }, 1000);
    });
  };

  return (
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
  );
};

export default ChatInput;
