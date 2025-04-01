
import { useState } from 'react';
import { useQueryProcessor } from '@/hooks/useQueryProcessor';
import { useVoiceProcessor } from '@/hooks/useVoiceProcessor';

/**
 * Custom hook that provides functions for handling DeepTalk interactions
 * This acts as a facade that combines query and voice processing
 */
export const useDeepTalkHandler = () => {
  const { processQuery, isProcessing: isQueryProcessing } = useQueryProcessor();
  const { processVoiceQuery, isProcessing: isVoiceProcessing } = useVoiceProcessor();
  
  // Combined processing state
  const isProcessing = isQueryProcessing || isVoiceProcessing;

  // Main query handler - can be used directly by components
  const handleQuery = async (query: string): Promise<string> => {
    return processQuery(query);
  };

  // Voice query handler - can be used directly by components
  const handleVoiceQuery = async (audioBlob: Blob): Promise<string> => {
    return processVoiceQuery(audioBlob);
  };

  return { 
    handleQuery, 
    handleVoiceQuery, 
    isProcessing 
  };
};

// Export a typed handler function that matches the expected signature
export const getDeepTalkHandler = (): ((query: string) => Promise<string>) => {
  const { handleQuery } = useDeepTalkHandler();
  return handleQuery;
};

// This hook is for direct use in components
export default useDeepTalkHandler;
