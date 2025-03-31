
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

// Type for Supabase function response
interface SupabaseFunctionResponse {
  data: CalculationResult | null;
  error: Error | null;
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
    const response: SupabaseFunctionResponse = await supabase.functions.invoke('process-decision-matrix', {
      body: request
    });
    
    if (response.error) throw response.error;
    if (!response.data) throw new Error("No data returned from calculation");
    
    return response.data;
  } catch (error: any) {
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
    // Using the 'rpc' method to call a stored procedure for storing calculation results
    const { error } = await supabase.rpc('store_calculation_result', {
      calc_scores: result.scores,
      calc_method: result.method,
      calc_timestamp: result.timestamp,
      calc_details: result.details || {}
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
    // Using the 'rpc' method to call a stored procedure for retrieving the latest calculation
    const { data, error } = await supabase.rpc('get_latest_calculation_result');
    
    if (error) throw error;
    if (!data) return null;
    
    // Convert the returned data to the expected format
    return {
      scores: data.scores || [],
      method: data.method || "unknown",
      timestamp: data.timestamp || new Date().toISOString(),
      details: data.details || {}
    };
  } catch (error) {
    console.error("Error retrieving calculation result:", error);
    return null;
  }
};
