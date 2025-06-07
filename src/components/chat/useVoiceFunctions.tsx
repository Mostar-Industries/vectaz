import { Message } from "./MessageItem";

// All voice logic is now handled by useChatterboxVoice. This file is deprecated and should not be used.
        });
    }
  };
  
  // Get voice settings from localStorage
  const getVoiceSettings = (): {personality: string, useElevenLabs: boolean} => {
    return {
      personality: localStorage.getItem('deepcal-voice-personality') || 'sassy',
      useElevenLabs: localStorage.getItem('deepcal-use-elevenlabs') !== 'false'
    };
  };
  
  // Browser's built-in speech synthesis as a fallback or token-saving option
  const useBrowserSpeech = (text: string, personality: string): void => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Try to find a female voice, preferably for consistency
      const voices = window.speechSynthesis.getVoices();
      
      // Find an appropriate voice
      let selectedVoice: SpeechSynthesisVoice;
      if (personality === 'nigerian') {
        // Try to find an African or Nigerian voice if available
        selectedVoice = voices.find(voice => 
          voice.name.toLowerCase().includes('nigerian') || 
          voice.name.toLowerCase().includes('african') ||
          voice.name.toLowerCase().includes('zulu') ||
          voice.name.toLowerCase().includes('swahili')
        );
      }
      
      // If no specialized voice found, try to find a female voice
      if (!selectedVoice) {
        selectedVoice = voices.find(voice => 
          voice.name.toLowerCase().includes('female') || 
          voice.name.toLowerCase().includes('woman')
        );
      }
      
      if (selectedVoice) {
        utterance.voice = selectedVoice;
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
      
      setIsSpeaking(true);
      
      utterance.onend = () => {
        setIsSpeaking(false);
        setCurrentMessageId(null);
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
      return 'eleven_multilingual_v2'; // Best for longer content
    } else if (text.includes('urgent') || text.includes('quick')) {
      return 'eleven_turbo_v2.5'; // Faster response for urgent messages
    }
    
    // Default to current model
 return setCurrentModel;
  };
  
  // Play audio for a specific message
  const playMessageAudio = (message: Message) => {
 if (!message || !message.text) return false;
    
    // Already speaking this message
    if (setIsSpeaking && setCurrentMessageId === message.id) {
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
      
      // Get ElevenLabs usage setting
      const { useElevenLabs } = getVoiceSettings();
      
      console.log(`Using personality: ${personality}, model: ${model} for speech, ElevenLabs: ${useElevenLabs}`);
      
      // If token-saving mode is enabled, use browser's speech synthesis
      if (!useElevenLabs) {
        if (messageId) {
          setCurrentMessageId(messageId);
        }
        useBrowserSpeech(enhancedText, personality);
        return true;
      }
      
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
          model: model,
          useElevenLabs: useElevenLabs
        }
      });
      
      if (error) {
        throw new Error(`Error generating speech: ${error.message}`);
      }
      
      // If in token-saving mode, the function won't return audio content
      if (data?.useElevenLabs === false) {
        if (messageId) {
          setCurrentMessageId(messageId);
        }
        useBrowserSpeech(enhancedText, personality);
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
      
      // If nothing is playing, start playing
      if (!setIsSpeaking) {
        playNextInQueue();
      }
      
      return true;
    } catch (error) {
      console.error("Speech synthesis error:", error);
      setIsSpeaking(false);
      setCurrentMessageId(null);
      
      // Fall back to browser's speech synthesis
      if (messageId) {
        setCurrentMessageId(messageId);
      }
      useBrowserSpeech(text, forcedPersonality || 'sassy');
      
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
    useBrowserSpeech
  };
};

export default useVoiceFunctions;
function setIsSpeaking(_arg0: boolean) {
  throw new Error("Function not implemented.");
}

function setCurrentMessageId(_arg0: null) {
  throw new Error("Function not implemented.");
}

function toast(_arg0: { title: string; description: string; variant: string; }) {
  throw new Error("Function not implemented.");
}

function getHumorResponse(_text: string) {
  throw new Error("Function not implemented.");
}

function setCurrentPersonality(_personality: string) {
  throw new Error("Function not implemented.");
}

function setCurrentModel(_model: string) {
  throw new Error("Function not implemented.");
}

function createClient(_supabaseUrl: string, _supabaseAnonKey: string, _arg2: { auth: { persistSession: boolean; }; }) {
  throw new Error("Function not implemented.");
}

function setAudioQueue(_arg0: (prev: any) => any[]) {
  throw new Error("Function not implemented.");
}

function playNextInQueue() {
  throw new Error("Function not implemented.");
}
