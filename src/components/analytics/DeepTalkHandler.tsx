
import { useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import { useBaseDataStore } from '@/store/baseState';
import { deepSight } from '@/services/deepExplain';
import { supabase } from '@/integrations/supabase/client';

// Helper function to check if query contains keywords
const containsKeywords = (query: string, keywords: string[]): boolean => {
  return keywords.some(keyword => 
    query.toLowerCase().includes(keyword.toLowerCase())
  );
};

// Helper function to extract forwarder name from query
const extractForwarderName = (query: string): string | null => {
  const forwarders = ['DHL', 'Kuehne Nagel', 'Kenya Airways', 'MSC', 'Maersk', 'CMA CGM'];
  
  for (const forwarder of forwarders) {
    if (query.toLowerCase().includes(forwarder.toLowerCase())) {
      return forwarder;
    }
  }
  
  return null;
};

// Helper function to extract country name from query
const extractCountryName = (query: string): string | null => {
  const countries = ['China', 'USA', 'Germany', 'Kenya', 'South Africa', 'India', 'Brazil'];
  
  for (const country of countries) {
    if (query.toLowerCase().includes(country.toLowerCase())) {
      return country;
    }
  }
  
  return null;
};

// Default responses for when data isn't available
const getFallbackResponse = (query: string): string => {
  // If query mentions performance comparison
  if (containsKeywords(query, ['compare', 'versus', 'vs', 'against'])) {
    const forwarder = extractForwarderName(query);
    if (forwarder) {
      return `I'd be happy to compare ${forwarder} with other forwarders, but I need to sync with the latest data. Please try again in a moment or check that the logistics database is properly connected.`;
    }
    
    const country = extractCountryName(query);
    if (country) {
      return `I'd like to compare ${country}'s logistics performance with other countries, but I need to sync with the latest data. Please try again in a moment or check that the logistics database is properly connected.`;
    }
    
    return `I'd be happy to run that comparison, but I need to sync with the latest data. Please try again in a moment or check that the logistics database is properly connected.`;
  }
  
  // If query mentions optimization
  if (containsKeywords(query, ['optimize', 'improve', 'better', 'enhance', 'efficiency'])) {
    return `To provide optimization recommendations, I need access to the latest logistics data. Please ensure the database connection is active and try again.`;
  }
  
  // If query mentions disruptions or risks
  if (containsKeywords(query, ['disrupt', 'risk', 'delay', 'late', 'problem'])) {
    return `I'd be happy to analyze disruption patterns and risks, but I need to sync with the latest data. Please try again in a moment or check that the logistics database is properly connected.`;
  }
  
  // If query mentions trends
  if (containsKeywords(query, ['trend', 'overtime', 'historical', 'pattern', 'forecast'])) {
    return `To analyze trends accurately, I need access to the historical data. Please ensure the logistics database is properly connected and try again.`;
  }
  
  // Default fallback
  return `I'd be happy to answer that, but I need to sync with the latest logistics data. Please ensure the database connection is active and try again.`;
};

// Function to handle AI query response
export const useDeepTalkHandler = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { isDataLoaded, shipmentData } = useBaseDataStore();
  
  const handleQuery = useCallback(async (query: string): Promise<string> => {
    setIsProcessing(true);
    
    try {
      // If data is not loaded yet, return a helpful message
      if (!isDataLoaded || !shipmentData || shipmentData.length === 0) {
        setIsProcessing(false);
        return getFallbackResponse(query);
      }
      
      // Process the query with local mock data
      // In a real implementation, this might call an API
      const response = await processQuery(query, shipmentData);
      
      // Simulate network latency
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setIsProcessing(false);
      return response;
    } catch (error) {
      console.error("Error processing DeepTalk query:", error);
      
      let errorMessage = "I encountered an issue while processing your request. Please try again.";
      
      // More specific error handling for Supabase
      if (error instanceof Error) {
        if (error.message.includes("network")) {
          errorMessage = "I'm having trouble connecting to the database. Please check your network connection.";
        } else if (error.message.includes("permission")) {
          errorMessage = "I don't have permission to access that data. Please contact your administrator.";
        } else if (error.message.includes("timeout")) {
          errorMessage = "The request timed out. The database might be under heavy load.";
        }
      }
      
      toast({
        title: "DeepTalk Error",
        description: errorMessage,
        variant: "destructive"
      });
      
      setIsProcessing(false);
      return errorMessage;
    }
  }, [isDataLoaded, shipmentData]);
  
  return {
    handleQuery,
    isProcessing
  };
};

// Mock function to process queries based on available data
const processQuery = async (query: string, shipmentData: any[]): Promise<string> => {
  // For demonstration purposes, this is a simplified mock response generator
  // In a real implementation, this would call an NLP service or LLM API
  
  // Check for specific question types and generate appropriate responses
  if (containsKeywords(query, ['most disrupted route', 'worst route', 'problematic route'])) {
    return "Based on our logistics data, the most disrupted route is Shanghai to Nairobi, with 32% of shipments experiencing delays. The primary causes are customs clearance issues (45%) and transportation bottlenecks (30%).";
  }
  
  if (containsKeywords(query, ['compare'])) {
    const forwarder = extractForwarderName(query);
    if (forwarder === 'DHL' && query.toLowerCase().includes('kenya airways')) {
      return "Comparing DHL and Kenya Airways:\n\n• On-time delivery: DHL (94%) vs Kenya Airways (86%)\n• Average transit time: DHL (5.3 days) vs Kenya Airways (6.7 days)\n• Cost efficiency: DHL ($3.21/kg) vs Kenya Airways ($2.95/kg)\n• Documentation accuracy: DHL (98%) vs Kenya Airways (92%)\n\nDHL performs better in reliability metrics, while Kenya Airways offers slight cost advantages.";
    }
  }
  
  if (containsKeywords(query, ['warehouse', 'reliability'])) {
    return "The most reliable warehouse based on our data is Dubai Hub with a 98.5% perfect order rate. It handles an average of 356 shipments per month with minimal discrepancies and maintains the highest inventory accuracy at 99.7%.";
  }
  
  if (containsKeywords(query, ['optimize', 'shipping cost', 'reduce cost'])) {
    return "To optimize shipping costs, I recommend:\n\n1. Consolidate shipments to the EU region - potential 12% savings\n2. Shift 30% of air freight to sea-air combined transport - 15% cost reduction\n3. Renegotiate rates with our top 3 forwarders based on volume commitments - estimated 8-10% savings\n4. Implement packaging optimization for lightweight items - 7% reduction in dimensional weight charges";
  }
  
  if (containsKeywords(query, ['trend', 'performance', 'over time'])) {
    return "Key logistics performance trends over the past 12 months:\n\n• Transit times improved by 8% globally\n• On-time delivery increased from 87% to 91%\n• Air freight costs increased by 12% while ocean freight decreased by 5%\n• Documentation errors decreased by 23%\n• Warehouse efficiency improved by 15% across all locations";
  }
  
  // Default response if no specific pattern is matched
  // In a real implementation, this would be handled by an LLM
  return "I've analyzed the available shipment data. To provide more specific insights, could you clarify whether you're interested in routes, forwarders, timing, costs, or some other aspect of our logistics operations?";
};

// Main component for handling DeepTalk in the analytics section
const DeepTalkHandler = () => {
  const { handleQuery, isProcessing } = useDeepTalkHandler();
  
  return { handleQuery, isProcessing };
};

export default DeepTalkHandler;
