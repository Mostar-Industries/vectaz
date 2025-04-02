
import { useState } from 'react';
import { useQueryProcessor } from '@/hooks/useQueryProcessor';
import { useVoiceProcessor } from '@/hooks/useVoiceProcessor';
import { getHumorResponse } from '../chat/useDeepCalHumor';

/**
 * Custom hook that provides functions for handling DeepTalk interactions
 * This acts as a facade that combines query and voice processing with DeepCAL's personality
 */
export const useDeepTalkHandler = () => {
  const { processQuery, isProcessing: isQueryProcessing } = useQueryProcessor();
  const { processVoiceQuery, isProcessing: isVoiceProcessing } = useVoiceProcessor();
  const [useSass, setUseSass] = useState<boolean>(true);
  
  // Combined processing state
  const isProcessing = isQueryProcessing || isVoiceProcessing;

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

  return { 
    handleQuery, 
    handleVoiceQuery, 
    isProcessing,
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
