
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useBaseDataStore } from '@/store/baseState';
import { analyzeShipmentData } from '@/utils/analyticsUtils';
import { blobToBase64 } from '@/utils/audioUtils';

export const useVoiceProcessor = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { shipmentData } = useBaseDataStore();

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
      
      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error("Error processing voice query:", error);
      toast({
        title: "Error",
        description: "Failed to process your voice query. Please try again.",
        variant: "destructive",
      });
      return "I'm sorry, I encountered an error processing your voice query. Please try again or type your question.";
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
