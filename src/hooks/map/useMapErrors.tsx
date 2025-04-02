
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface MapError {
  code: string;
  message: string;
  details?: any;
}

export const useMapErrors = () => {
  const [error, setError] = useState<MapError | null>(null);
  const { toast } = useToast();

  const handleMapError = useCallback((code: string, message: string, details?: any) => {
    console.error(`Map Error [${code}]:`, message, details);
    
    const mapError = { code, message, details };
    setError(mapError);
    
    // Show user-friendly toast notification
    toast({
      title: `Map Error: ${code}`,
      description: message,
      variant: 'destructive',
      duration: 5000,
    });
    
    return mapError;
  }, [toast]);

  const clearMapError = useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    handleMapError,
    clearMapError,
    isError: error !== null
  };
};
