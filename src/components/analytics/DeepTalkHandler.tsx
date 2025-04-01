
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useBaseDataStore } from '@/store/baseState';
import { analyzeShipmentData } from '@/utils/analyticsUtils';
import { generateInsightFromQuery } from '@/services/deepExplain';
import { decisionEngine } from '@/core/engine';

export const useDeepTalkHandler = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { shipmentData } = useBaseDataStore();

  const handleQuery = async (query: string): Promise<string> => {
    try {
      setIsProcessing(true);
      
      // Initialize the decision engine if not already initialized
      if (!decisionEngine.isReady() && shipmentData.length > 0) {
        decisionEngine.initialize(shipmentData);
      }
      
      // Process analytics data
      const analyticsData = analyzeShipmentData(shipmentData);
      
      // Generate insights
      const response = await generateInsightFromQuery(query, analyticsData);
      
      return response;
    } catch (error) {
      console.error("Error processing query:", error);
      toast({
        title: "Error",
        description: "Failed to process your query. Please try again.",
        variant: "destructive",
      });
      return "I'm sorry, I encountered an error processing your query. Please try again or rephrase your question.";
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVoiceQuery = async (audioBlob: Blob): Promise<string> => {
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

  // Helper function to convert Blob to base64
  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        resolve(base64String.split(',')[1]); // Remove the data URL prefix
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  return { handleQuery, handleVoiceQuery, isProcessing };
};

// Export a typed handler function that matches the expected signature
export const getDeepTalkHandler = (): ((query: string) => Promise<string>) => {
  const { handleQuery } = useDeepTalkHandler();
  return handleQuery;
};

// This hook is for direct use in components
export default useDeepTalkHandler;
