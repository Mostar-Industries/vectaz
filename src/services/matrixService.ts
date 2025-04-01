
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { loadDecisionMatrix, MatrixData } from "@/utils/decisionMatrixParser";

// Retrieve matrix data from database
export const retrieveDecisionMatrix = async (): Promise<MatrixData | null> => {
  try {
    // Initialize the Supabase client with the right method
    const { data, error } = await supabase.rpc('get_latest_decision_matrix');
    
    if (error) throw error;
    if (!data) return null;
    
    return {
      rows: data.matrix || [],
      columnCount: (data.criteria || []).length
    };
  } catch (error) {
    console.error("Error retrieving decision matrix:", error);
    return null;
  }
};

// Store matrix data in database
export const storeDecisionMatrix = async (matrixData: MatrixData): Promise<boolean> => {
  try {
    // Create a minimal DecisionMatrix from MatrixData
    const decisionMatrix = {
      alternatives: matrixData.rows.map((_, idx) => `Alt ${idx + 1}`),
      criteria: Array.from({ length: matrixData.columnCount }, (_, idx) => `Criterion ${idx + 1}`),
      matrix: matrixData.rows
    };
    
    // Use the correct typing for RPC calls
    const response = await supabase.rpc('store_decision_matrix', {
      alternatives_data: decisionMatrix.alternatives,
      criteria_data: decisionMatrix.criteria,
      matrix_data: decisionMatrix.matrix
    });
    
    if (response.error) throw response.error;
    return true;
  } catch (error) {
    console.error("Error storing decision matrix:", error);
    return false;
  }
};

// Run a calculation on the decision matrix
export const runMatrixCalculation = async (matrixData: MatrixData): Promise<any> => {
  if (!matrixData || matrixData.rows.length === 0) {
    toast({
      title: "Error",
      description: "No matrix data available to process",
      variant: "destructive",
    });
    return null;
  }
  
  try {
    // Call the Edge Function to process the matrix
    const response = await supabase.functions.invoke('process-decision-matrix', {
      body: { matrix: matrixData.rows }
    });
    
    if (response.error) throw response.error;
    
    toast({
      title: "Success",
      description: "Matrix calculation completed successfully",
    });
    
    return response.data;
  } catch (error) {
    console.error("Error processing matrix:", error);
    toast({
      title: "Calculation Error",
      description: "Failed to process the matrix. Using TypeScript fallback.",
      variant: "destructive",
    });
    
    // Fallback to simple TypeScript calculation
    const simpleResult = {
      scores: matrixData.rows.map(row => 
        row.reduce((sum, val) => sum + val, 0) / row.length
      ),
      method: "ts-fallback",
      timestamp: new Date().toISOString()
    };
    
    return simpleResult;
  }
};
