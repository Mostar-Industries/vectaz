// DEPRECATED: All voice logic is now handled by useChatterboxVoice. This file is obsolete and should not be used or imported anywhere in the application.
// Remove any references to useVoiceFunctions and migrate to useChatterboxVoice for seamless, ultra-futuristic voice integration.

import { useState, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { getHumorResponse } from './useDeepCalHumor';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  personality?: string;
  model?: string;
}

interface AudioQueueItem {
  url: string;
  messageId?: string;
}

export const useVoiceFunctions = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentPersonality, setCurrentPersonality] = useState('sassy');
  const [currentModel, setCurrentModel] = useState('eleven_multilingual_v2');
  const [currentMessageId, setCurrentMessageId] = useState<string | null>(null);
  const [audioQueue, setAudioQueue] = useState<AudioQueueItem[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  // Get voice personality and settings from localStorage
  const getVoiceSettings = (): { personality: string, useElevenLabs: boolean } => {
    return {
      personality: localStorage.getItem('deepcal-voice-personality') || 'sassy',
      useElevenLabs: localStorage.getItem('deepcal-use-elevenlabs') !== 'false'
    };
  };

  // Browser's built-in speech synthesis as a fallback
  const browserSpeech = (text: string, personality: string): void => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);

      // Get available voices
      const voices = window.speechSynthesis.getVoices();

      // Try to find a female voice for consistency with ElevenLabs
      const femaleVoice = voices.find(voice =>
        voice.name.toLowerCase().includes('female') ||
        voice.name.toLowerCase().includes('woman')
      );

      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }

      // Adjust settings based on personality
      if (personality === 'nigerian') {
        utterance.pitch = 1.2;  // Slightly higher pitch
        utterance.rate = 0.9;   // Slightly slower for the accent
      } else if (personality === 'sassy') {
        utterance.pitch = 1.1;  // Slightly higher pitch
        utterance.rate = 1.1;   // Slightly faster
      } else if (personality === 'formal') {
        utterance.pitch = 1.0;  // Normal pitch
        utterance.rate = 0.9;   // Slightly slower for formality
      } else if (personality === 'technical') {
        utterance.pitch = 0.9;  // Slightly lower pitch
        utterance.rate = 1.0;   // Normal speed
      } else if (personality === 'excited') {
        utterance.pitch = 1.2;  // Higher pitch
        utterance.rate = 1.2;   // Faster
      } else if (personality === 'casual') {
        utterance.pitch = 1.0;  // Normal pitch
        utterance.rate = 1.0;   // Normal speed
      }
      
      utterance.onend = () => {
        setIsSpeaking(false);
        setCurrentMessageId(null);
        // Play next in queue if available
        playNextInQueue();
      };
      
      utterance.onerror = () => {
        setIsSpeaking(false);
        setCurrentMessageId(null);
        toast({
          title: "Voice Error",
          description: "Could not play the voice response using browser speech synthesis.",
          variant: "destructive",
        });
      };
      
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
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
    
    // Get saved personality from localStorage
    const { personality } = getVoiceSettings();
    return personality; // Default to saved personality
  };
  
  // Determine which ElevenLabs model to use based on the content
  const determineModel = (text: string): string => {
    // For most cases, use the multilingual model for best quality
    if (text.length > 200) {
      return 'eleven_multilingual_v2'; // Best for longer content and multilingual support
    } else if (text.includes('urgent') || text.includes('quick')) {
      return 'eleven_turbo_v2.5'; // Faster response for urgent messages
    }

    // Default to current model
    return currentModel;
  };
  
  // Play audio for a specific message
  const playMessageAudio = (message: Message) => {
    if (!message || !message.text) return false;

    // Already speaking this message
    if (isSpeaking && currentMessageId === message.id) {
      return false; // Don't add to queue if already speaking this one
    }
    
    // Use cached personality and model if available
    const personality = message.personality || determinePersonality(message.text);
    const model = message.model || determineModel(message.text);
    
    return speakResponse(message.text, message.id, personality, model);
  };

  // Play the next audio item in the queue
  const playNextInQueue = () => {
    if (audioQueue.length === 0 || isSpeaking) {
      return;
    }

    const nextItem = audioQueue[0];
    setAudioQueue(prev => prev.slice(1)); // Remove from queue

    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.onended = () => {
        setIsSpeaking(false);
        setCurrentMessageId(null);
        playNextInQueue(); // Play the next one when this one ends
      };
    }

    setCurrentMessageId(nextItem.messageId || null);
    setIsSpeaking(true);
    if (audioRef.current) {
      audioRef.current.src = nextItem.url;
      audioRef.current.play().catch(e => console.error("Audio playback error:", e));
    }
  };
  
  // Main function to speak a response
  const speakResponse = async (text: string, messageId?: string, forcedPersonality?: string, forcedModel?: string) => {
    try {
      // Check if we should inject humor
      const enhancedText = getHumorResponse(text);
      
      // Determine the appropriate personality and model
      const personality = forcedPersonality || determinePersonality(enhancedText);
      setCurrentPersonality(personality);
      
      const model = forcedModel || determineModel(enhancedText);
      setCurrentModel(model);
      
      // Get ElevenLabs usage setting
      const { useElevenLabs } = getVoiceSettings();

      // If ElevenLabs is disabled, use browser's speech synthesis
      if (!useElevenLabs) {
        if (messageId) {
          setCurrentMessageId(messageId);
        }
        browserSpeech(enhancedText, personality);
        return true;
      }
      
      // Create Supabase client
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hpogoxrxcnyxiqjmqtaw.supabase.co';
      const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhwb2dveHJ4Y255eGlxam1xdGF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMyMDEwMjEsImV4cCI6MjA1ODc3NzAyMX0.9JA8cI1FYpyLJGn8VJGSQcUbnBmzNtMH_I_fkI-JMAE'; 
      
      const supabase = createSupabaseClient(
        supabaseUrl,
        supabaseAnonKey,
        { auth: { persistSession: false } }
      );
      
      // Use the Supabase edge function with ElevenLabs API
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: { 
          text: enhancedText, 
          personality: personality,
          model: model,
          useElevenLabs: useElevenLabs
        }
      });
      
      if (error || !data) {
        throw new Error(`Error generating speech: ${error.message}`);
      }
      
      // If in token-saving mode, the function won't return audio content
      if (data?.useElevenLabs === false) {
        if (messageId) {
          setCurrentMessageId(messageId);
        }
        browserSpeech(enhancedText, personality);
        return true;
      }
      
      if (!data?.audioContent) {
        throw new Error('No audio content returned');
      }
      
      // Create a blob URL from the base64 audio content
      const audioBlob = base64ToBlob(data.audioContent, 'audio/mp3');
      const audioUrl = URL.createObjectURL(audioBlob);
      
      // Add to queue
      setAudioQueue(prev => [...prev, { url: audioUrl, messageId }]);
      
      // If nothing is currently speaking, start playing the queue
      if (!isSpeaking) {
        playNextInQueue();
      }
      
      return true;
    } catch (error) {
      console.error("Speech synthesis error:", error);
      setIsSpeaking(false);
      
      // Fall back to browser's speech synthesis
      if (messageId) {
        setCurrentMessageId(messageId);
      }
      browserSpeech(text, forcedPersonality || 'sassy');
      
      toast({
        title: "Voice Generation Issue",
        description: "Using fallback voice. The ElevenLabs voice service is currently unavailable.",
        variant: "default",
        duration: 3000,
      });
      
      return true; // Still succeeded with fallback
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
    currentMessageId,
    browserSpeech
  };
};

export default useVoiceFunctions;


function createClient(_supabaseUrl: string, _supabaseAnonKey: string, _arg2: { auth: { persistSession: boolean; }; }) {
  throw new Error("Function not implemented.");
}

function setAudioQueue(_arg0: (prev: AudioQueueItem[]) => AudioQueueItem[]) {
  throw new Error("Function not implemented.");
}

function playNextInQueue() {
  throw new Error("Function not implemented.");
}
