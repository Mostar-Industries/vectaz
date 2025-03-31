
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CalculationRequest {
  matrix: number[][];
  weights?: number[];
  method?: string;
}

interface CalculationResult {
  scores: number[];
  method: string;
  timestamp: string;
  details?: any;
}

/**
 * Call the Python calculation backend through Supabase Edge Function
 * 
 * @param request The calculation request parameters
 * @returns The calculation results
 */
export const calculateWithPython = async (
  request: CalculationRequest
): Promise<CalculationResult> => {
  try {
    // Call the Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('process-decision-matrix', {
      body: request
    });
    
    if (error) throw error;
    
    return data as CalculationResult;
  } catch (error) {
    console.error("Error calling Python calculation:", error);
    toast({
      title: "Calculation Error",
      description: "Failed to call Python calculation service",
      variant: "destructive",
    });
    
    // Return a fallback response
    return {
      scores: [],
      method: "error",
      timestamp: new Date().toISOString(),
      details: { error: error.message }
    };
  }
};

/**
 * Store calculation results in Supabase for later retrieval
 * 
 * @param result The calculation result to store
 * @returns Success status
 */
export const storeCalculationResult = async (
  result: CalculationResult
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('calculation_results')
      .insert({
        scores: result.scores,
        method: result.method,
        timestamp: result.timestamp,
        details: result.details || {}
      });
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error("Error storing calculation result:", error);
    return false;
  }
};

/**
 * Retrieve the latest calculation results from Supabase
 * 
 * @returns The latest calculation result or null if not found
 */
export const getLatestCalculationResult = async (): Promise<CalculationResult | null> => {
  try {
    const { data, error } = await supabase
      .from('calculation_results')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(1)
      .single();
    
    if (error) throw error;
    
    return data as CalculationResult;
  } catch (error) {
    console.error("Error retrieving calculation result:", error);
    return null;
  }
};
