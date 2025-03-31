
import Papa from 'papaparse';
import { supabase } from '@/integrations/supabase/client';

// Define interfaces for the decision matrix structure
export interface DecisionMatrix {
  alternatives: string[];
  criteria: string[];
  matrix: number[][];
}

/**
 * Parse CSV data into a decision matrix structure
 * 
 * @param csvData The CSV data to parse
 * @returns The parsed decision matrix or null if parsing failed
 */
export const parseDecisionMatrix = (csvData: string): DecisionMatrix | null => {
  try {
    // Parse the CSV data
    const { data } = Papa.parse(csvData, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true
    });
    
    if (!data || data.length === 0) {
      throw new Error("No data found in CSV");
    }
    
    // Extract the criteria (column headers) excluding the first column which contains alternative names
    const headers = Object.keys(data[0]);
    const criteria = headers.slice(1);
    
    // Extract the alternatives (row identifiers) and matrix values
    const alternatives: string[] = [];
    const matrix: number[][] = [];
    
    data.forEach((row: any) => {
      // Get the alternative name (first column)
      const alternative = row[headers[0]];
      alternatives.push(alternative);
      
      // Get the values for each criterion
      const values = criteria.map(criterion => {
        const value = row[criterion];
        return typeof value === 'number' ? value : 0;
      });
      
      matrix.push(values);
    });
    
    return {
      alternatives,
      criteria,
      matrix
    };
  } catch (error) {
    console.error("Error parsing decision matrix:", error);
    return null;
  }
};

/**
 * Save a decision matrix to Supabase for later use
 * 
 * @param matrix The decision matrix to save
 * @returns True if saved successfully, false otherwise
 */
export const saveDecisionMatrix = async (matrix: DecisionMatrix): Promise<boolean> => {
  try {
    // Call the RPC function to store the matrix data
    // This allows us to work with a procedure instead of direct table access
    const { error } = await supabase.rpc('store_decision_matrix', {
      alternatives_data: matrix.alternatives,
      criteria_data: matrix.criteria,
      matrix_data: JSON.stringify(matrix.matrix)
    });
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error("Error saving decision matrix:", error);
    return false;
  }
};

/**
 * Load a decision matrix from Supabase
 * 
 * @returns The loaded decision matrix or null if loading failed
 */
export const loadDecisionMatrix = async (): Promise<DecisionMatrix | null> => {
  try {
    // Call the RPC function to get the latest matrix
    const { data, error } = await supabase.rpc('get_latest_decision_matrix');
    
    if (error) throw error;
    if (!data) return null;
    
    // Parse the returned data
    const matrixData = JSON.parse(data.matrix_data || "[]");
    
    return {
      alternatives: data.alternatives || [],
      criteria: data.criteria || [],
      matrix: matrixData
    };
  } catch (error) {
    console.error("Error loading decision matrix:", error);
    return null;
  }
};
