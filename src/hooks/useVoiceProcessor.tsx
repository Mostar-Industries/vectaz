
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useBaseDataStore } from '@/store/baseState';
import { analyzeShipmentData } from '@/utils/analyticsUtils';
import { blobToBase64, enhanceWithNigerianExpressions } from '@/utils/audioUtils';

// Voice system removed. Replace with your new implementation.
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { shipmentData } = useBaseDataStore();
  
  // Get voice personality and settings from localStorage
  const getVoiceSettings = (): {personality: string, useElevenLabs: boolean} => {
    return {
      personality: localStorage.getItem('deepcal-voice-personality') || 'sassy',
      useElevenLabs: localStorage.getItem('deepcal-use-elevenlabs') !== 'false'
    };
  };

  // Browser's built-in speech synthesis as a fallback
  const useBrowserSpeech = (text: string, personality: string): void => {
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
      }
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const processVoiceQuery = async (audioBlob: Blob): Promise<string> => {
    try {
      setIsProcessing(true);
      
      // Convert audio to base64
      const base64Audio = await blobToBase64(audioBlob);
      
      // Process analytics data
      const analyticsData = analyzeShipmentData(shipmentData);
      
      // Call the voice processor function
      const response = await fetch('/api/voice-processor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          audio: base64Audio,
          context: analyticsData
        }),
      });
      
      if (!response.ok) {
        throw new Error('Voice processing failed');
      }
      
      let data = await response.json();
      
      // Get current settings
      const { personality, useElevenLabs } = getVoiceSettings();
      
      // Check if we should enhance with Nigerian expressions
      if (personality === 'nigerian') {
        data.response = enhanceWithNigerianExpressions(data.response, 0.4);
      }
      
      // If we're using the browser's speech synthesis and not ElevenLabs,
      // trigger speech here (this won't be used for response text)
      if (!useElevenLabs) {
        useBrowserSpeech(data.response, personality);
      }
      
      return data.response;
    } catch (error) {
      console.error("Error processing voice query:", error);
      toast({
        title: "Error",
        description: "Failed to process your voice query. Please try again.",
        variant: "destructive",
      });
      
      // Add Nigerian expression to error message if Nigerian personality is selected
      const { personality } = getVoiceSettings();
      let errorMsg = "I'm sorry, I encountered an error processing your voice query. Please try again or type your question.";
      
      if (personality === 'nigerian') {
        errorMsg = "Chai! I'm sorry, I get problem to process your voice query. Abeg, try again or type your question.";
      }
      
      return errorMsg;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    processVoiceQuery,
    isProcessing,
    useBrowserSpeech
  };
};

export default useVoiceProcessor;
