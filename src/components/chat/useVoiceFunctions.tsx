
import { useState, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { createClient } from '@supabase/supabase-js';
import { getHumorResponse } from './useDeepCalHumor';
import { Message } from './MessageItem';

export const useVoiceFunctions = () => {
  const { toast } = useToast();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioQueue, setAudioQueue] = useState<{ url: string, messageId?: string }[]>([]);
  const [currentPersonality, setCurrentPersonality] = useState<string>('sassy');
  const [currentModel, setCurrentModel] = useState<string>('eleven_multilingual_v2');
  const [currentMessageId, setCurrentMessageId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Create audio element on component mount
  useEffect(() => {
    audioRef.current = new Audio();
    
    // Set up event listeners
    audioRef.current.onended = () => {
      setIsSpeaking(false);
      setCurrentMessageId(null);
      playNextInQueue();
    };
    
    audioRef.current.onerror = (e) => {
      console.error("Audio playback error:", e);
      setIsSpeaking(false);
      setCurrentMessageId(null);
      toast({
        title: "Voice Error",
        description: "Could not play the voice response. Please try again.",
        variant: "destructive",
      });
      playNextInQueue();
    };
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, [toast]);
  
  // Process the audio queue
  const playNextInQueue = () => {
    if (audioQueue.length > 0 && audioRef.current) {
      const nextAudio = audioQueue[0];
      setAudioQueue(prev => prev.slice(1));
      
      if (nextAudio.messageId) {
        setCurrentMessageId(nextAudio.messageId);
      }
      
      audioRef.current.src = nextAudio.url;
      audioRef.current.play()
        .then(() => setIsSpeaking(true))
        .catch(error => {
          console.error("Failed to play audio:", error);
          setIsSpeaking(false);
          setCurrentMessageId(null);
          
          // Try next in queue if this one fails
          playNextInQueue();
        });
    }
  };
  
  // Determine personality based on text content
  const determinePersonality = (text: string): string => {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('error') || lowerText.includes('warning') || lowerText.includes('critical')) {
      return 'formal';
    } else if (lowerText.includes('analysis') || lowerText.includes('algorithm') || lowerText.includes('calculation')) {
      return 'technical';
    } else if (lowerText.includes('great') || lowerText.includes('excellent') || lowerText.includes('amazing')) {
      return 'excited';
    } else if (lowerText.includes('joke') || lowerText.includes('funny') || lowerText.includes('humor')) {
      return 'casual';
    }
    
    // Check if we should inject humor
    if (Math.random() < 0.3) { // 30% chance of sassy humor
      return 'sassy';
    }
    
    return currentPersonality; // Default to current personality
  };
  
  // Determine which ElevenLabs model to use based on the content
  const determineModel = (text: string): string => {
    // For most cases, use the multilingual model for best quality
    if (text.length > 200) {
      return 'eleven_multilingual_v2'; // Best for longer content
    } else if (text.includes('urgent') || text.includes('quick')) {
      return 'eleven_turbo_v2.5'; // Faster response for urgent messages
    }
    
    // Default to current model
    return currentModel;
  };
  
  // Play audio for a specific message
  const playMessageAudio = (message: Message) => {
    if (!message.text) return false;
    
    // Already speaking this message
    if (isSpeaking && currentMessageId === message.id) {
      return true;
    }
    
    // Use cached personality and model if available
    const personality = message.personality || determinePersonality(message.text);
    const model = message.model || determineModel(message.text);
    
    return speakResponse(message.text, message.id, personality, model);
  };
  
  // Main function to speak a response
  const speakResponse = async (text: string, messageId?: string, forcedPersonality?: string, forcedModel?: string) => {
    try {
      console.log("Speaking response:", text.substring(0, 50) + "...");
      
      // Check if we should inject humor
      const enhancedText = getHumorResponse(text);
      
      // Determine the appropriate personality and model
      const personality = forcedPersonality || determinePersonality(enhancedText);
      setCurrentPersonality(personality);
      
      const model = forcedModel || determineModel(enhancedText);
      setCurrentModel(model);
      
      console.log(`Using personality: ${personality}, model: ${model} for speech`);
      
      // Create Supabase client using the environment variables or fallback to local development URL
      const supabaseUrl = 'https://hpogoxrxcnyxiqjmqtaw.supabase.co'; 
      const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhwb2dveHJ4Y255eGlxam1xdGF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMyMDEwMjEsImV4cCI6MjA1ODc3NzAyMX0.9JA8cI1FYpyLJGn8VJGSQcUbnBmzNtMH_I_fkI-JMAE'; 
      
      const supabase = createClient(
        supabaseUrl,
        supabaseAnonKey,
        { auth: { persistSession: false } }
      );
      
      // Use the Supabase edge function with ElevenLabs API
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: { 
          text: enhancedText, 
          personality: personality,
          model: model
        }
      });
      
      if (error) {
        throw new Error(`Error generating speech: ${error.message}`);
      }
      
      if (!data?.audioContent) {
        throw new Error('No audio content returned');
      }
      
      // Create a blob URL from the base64 audio content
      const audioBlob = base64ToBlob(data.audioContent, 'audio/mp3');
      const audioUrl = URL.createObjectURL(audioBlob);
      
      // Add to queue
      setAudioQueue(prev => [...prev, { url: audioUrl, messageId }]);
      
      // If nothing is playing, start playing
      if (!isSpeaking) {
        playNextInQueue();
      }
      
      return true;
    } catch (error) {
      console.error("Speech synthesis error:", error);
      setIsSpeaking(false);
      setCurrentMessageId(null);
      
      // Fall back to browser's speech synthesis
      fallbackSpeakResponse(text);
      
      toast({
        title: "Voice Generation Issue",
        description: "Using fallback voice. The ElevenLabs voice service is currently unavailable.",
        variant: "default",
        duration: 3000,
      });
      
      return false;
    }
  };
  
  // Fallback to browser's speech synthesis if the API fails
  const fallbackSpeakResponse = (text: string) => {
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
  
  // Helper to convert base64 to blob
  const base64ToBlob = (base64: string, mimeType: string) => {
    const byteCharacters = atob(base64);
    const byteArrays = [];
    
    for (let i = 0; i < byteCharacters.length; i += 512) {
      const slice = byteCharacters.slice(i, i + 512);
      
      const byteNumbers = new Array(slice.length);
      for (let j = 0; j < slice.length; j++) {
        byteNumbers[j] = slice.charCodeAt(j);
      }
      
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    
    return new Blob(byteArrays, { type: mimeType });
  };

  return {
    speakResponse,
    playMessageAudio,
    isSpeaking,
    currentPersonality,
    currentModel,
    currentMessageId
  };
};

export default useVoiceFunctions;
