
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useBaseDataStore } from '@/store/baseState';
import { analyzeShipmentData } from '@/utils/analyticsUtils';
import { generateInsightFromQuery } from '@/services/deepExplain';
import { decisionEngine } from '@/core/engine';

export const useQueryProcessor = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { shipmentData } = useBaseDataStore();

  const processQuery = async (query: string): Promise<string> => {
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

  return {
    processQuery,
    isProcessing
  };
};

export default useQueryProcessor;
