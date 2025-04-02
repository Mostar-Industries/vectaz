
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useBaseDataStore } from '@/store/baseState';
import { analyzeShipmentData } from '@/utils/analyticsUtils';
import { blobToBase64, enhanceWithNigerianExpressions } from '@/utils/audioUtils';

export const useVoiceProcessor = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { shipmentData } = useBaseDataStore();
  
  // Get voice personality from localStorage or default to 'sassy'
  const getVoicePersonality = (): string => {
    return localStorage.getItem('deepcal-voice-personality') || 'sassy';
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
      
      // Check if we should enhance with Nigerian expressions
      const personality = getVoicePersonality();
      if (personality === 'nigerian') {
        data.response = enhanceWithNigerianExpressions(data.response, 0.4);
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
      const personality = getVoicePersonality();
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
    isProcessing
  };
};

export default useVoiceProcessor;
