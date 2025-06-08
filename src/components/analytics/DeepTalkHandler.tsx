
import { useState } from 'react';
import { useQueryProcessor } from '@/hooks/useQueryProcessor';
import { useVoiceProcessor } from '@/hooks/useVoiceProcessor';
import { getHumorResponse } from '../chat/useDeepCalHumor';
import { createClient } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

/**
 * Custom hook that provides functions for handling DeepTalk interactions
 * This acts as a facade that combines query and voice processing with DeepCAL's personality
 */
export const useDeepTalkHandler = () => {
  const { processQuery, isProcessing: isQueryProcessing } = useQueryProcessor();
  const { processVoiceQuery, isProcessing: isVoiceProcessing, browserSpeech } = useVoiceProcessor();
  const [useSass, setUseSass] = useState<boolean>(true);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isTranscribing, setIsTranscribing] = useState<boolean>(false);
  const { toast } = useToast();
  
  // Combined processing state
  const isProcessing = isQueryProcessing || isVoiceProcessing || isTranscribing;

  // Toggle sassy responses
  const toggleSass = () => {
    setUseSass(prev => !prev);
  };

  // Main query handler - can be used directly by components
  const handleQuery = async (query: string): Promise<string> => {
    const response = await processQuery(query);
    
    // Add DeepCAL humor if enabled (30% chance)
    return useSass ? getHumorResponse(response) : response;
  };

  // Voice query handler - can be used directly by components
  const handleVoiceQuery = async (audioBlob: Blob): Promise<string> => {
    const response = await processVoiceQuery(audioBlob);
    
    // Add DeepCAL humor if enabled (30% chance)
    return useSass ? getHumorResponse(response) : response;
  };
  
  // Speech-to-speech handler - integrates both speech-to-text and text-to-speech
  const handleSpeechToSpeech = async (audioBlob: Blob): Promise<string> => {
    try {
      setIsTranscribing(true);
      
      // Get voice settings from localStorage
      const useElevenLabs = localStorage.getItem('deepcal-use-elevenlabs') !== 'false';
      const personality = localStorage.getItem('deepcal-voice-personality') || 'sassy';
      
      // Create Supabase client
      const supabaseUrl = 'https://hpogoxrxcnyxiqjmqtaw.supabase.co';
      const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhwb2dveHJ4Y255eGlxam1xdGF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMyMDEwMjEsImV4cCI6MjA1ODc3NzAyMX0.9JA8cI1FYpyLJGn8VJGSQcUbnBmzNtMH_I_fkI-JMAE';
      
      const supabase = createClient(
        supabaseUrl,
        supabaseAnonKey,
        { auth: { persistSession: false } }
      );
      
      // Convert audio to base64
      const base64Audio = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result as string;
          resolve(base64.split(',')[1]);
        };
        reader.readAsDataURL(audioBlob);
      });
      
      // Call the speech-to-text edge function
      const { data: sttData, error: sttError } = await supabase.functions.invoke('speech-to-text', {
        body: { audio: base64Audio }
      });
      
      if (sttError) {
        throw new Error(`Error in speech recognition: ${sttError.message}`);
      }
      
      if (!sttData?.text) {
        throw new Error('No transcript received');
      }
      
      const transcript = sttData.text;
      toast({
        title: 'Transcript',
        description: transcript,
        duration: 3000
      });
      
      // Process the transcript through query processor
      const responseText = await processQuery(transcript);
      
      // Add DeepCAL humor if enabled
      const enhancedResponse = useSass ? getHumorResponse(responseText) : responseText;
      
      // Speak the response using the chosen method
      if (useElevenLabs) {
        // This will be handled by the calling component
      } else {
        // Use browser's built-in speech synthesis
        browserSpeech(enhancedResponse, personality);
      }
      
      return enhancedResponse;
      
    } catch (error) {
      console.error('Error in speech-to-speech processing:', error);
      toast({
        title: 'Processing Error',
        description: 'Could not process your speech. Please try again or type your question.',
        variant: 'destructive'
      });
      
      return "I'm sorry, I couldn't understand that. Please try again or type your question.";
    } finally {
      setIsTranscribing(false);
    }
  };
  
  // Handle speech input from the speech-to-speech component
  const handleSpeechInput = async (text: string): Promise<string> => {
    try {
      // Process the query with the regular query processor
      const response = await processQuery(text);
      
      // Add DeepCAL humor if enabled
      const enhancedResponse = useSass ? getHumorResponse(response) : response;
      
      return enhancedResponse;
    } catch (error) {
      console.error('Error processing speech input:', error);
      return "I'm sorry, I couldn't process that. Please try again.";
    }
  };

  return { 
    handleQuery, 
    handleVoiceQuery,
    handleSpeechToSpeech,
    handleSpeechInput,
    isProcessing,
    isListening,
    setIsListening,
    useSass,
    toggleSass
  };
};

// Export a typed handler function that matches the expected signature
export const getDeepTalkHandler = (): ((query: string) => Promise<string>) => {
  const { handleQuery } = useDeepTalkHandler();
  return handleQuery;
};

// This hook is for direct use in components
export default useDeepTalkHandler;
