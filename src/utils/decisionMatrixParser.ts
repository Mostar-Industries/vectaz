
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface MatrixData {
  rows: number[][];
  rowCount: number;
  columnCount: number;
}

/**
 * Parse a CSV decision matrix file into a structured format
 * @param csvContent The content of the CSV file
 * @returns Structured matrix data
 */
export const parseDecisionMatrix = (csvContent: string): MatrixData => {
  try {
    // Split the CSV content into lines and parse each line into numbers
    const rows = csvContent
      .trim()
      .split('\n')
      .map(line => 
        line.split(',')
          .map(value => parseFloat(value.trim()))
          .filter(value => !isNaN(value))
      )
      .filter(row => row.length > 0);

    if (rows.length === 0) {
      throw new Error("No valid data found in the CSV");
    }

    return {
      rows,
      rowCount: rows.length,
      columnCount: rows[0].length
    };
  } catch (error) {
    console.error("Failed to parse decision matrix:", error);
    toast({
      title: "Error",
      description: "Failed to parse decision matrix CSV",
      variant: "destructive",
    });
    return { rows: [], rowCount: 0, columnCount: 0 };
  }
}

/**
 * Load the decision matrix from the embedded CSV file
 * @returns Parsed matrix data
 */
export const loadDecisionMatrix = async (): Promise<MatrixData> => {
  try {
    // Fetch the CSV file content
    const response = await fetch('/src/core/base_engine/data/decision_matrix.csv');
    if (!response.ok) {
      throw new Error(`Failed to load CSV file: ${response.statusText}`);
    }

    const csvContent = await response.text();
    return parseDecisionMatrix(csvContent);
  } catch (error) {
    console.error("Failed to load decision matrix:", error);
    toast({
      title: "Error",
      description: "Failed to load decision matrix data",
      variant: "destructive",
    });
    return { rows: [], rowCount: 0, columnCount: 0 };
  }
}

/**
 * Store the decision matrix data in Supabase
 * @param matrixData The matrix data to store
 * @returns Success status
 */
export const storeDecisionMatrix = async (matrixData: MatrixData): Promise<boolean> => {
  try {
    // Store the matrix data in Supabase
    const { error } = await supabase
      .from('decision_matrices')
      .insert({
        matrix_data: matrixData.rows,
        row_count: matrixData.rowCount,
        column_count: matrixData.columnCount,
        created_at: new Date().toISOString()
      });

    if (error) throw error;
    
    toast({
      title: "Success",
      description: "Decision matrix stored successfully",
    });
    
    return true;
  } catch (error) {
    console.error("Failed to store decision matrix:", error);
    toast({
      title: "Error",
      description: "Failed to store matrix in database",
      variant: "destructive",
    });
    return false;
  }
}

/**
 * Retrieve the decision matrix data from Supabase
 * @returns Retrieved matrix data
 */
export const retrieveDecisionMatrix = async (): Promise<MatrixData | null> => {
  try {
    // Get the latest decision matrix from Supabase
    const { data, error } = await supabase
      .from('decision_matrices')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) throw error;
    
    if (!data) {
      return null;
    }
    
    return {
      rows: data.matrix_data,
      rowCount: data.row_count,
      columnCount: data.column_count
    };
  } catch (error) {
    console.error("Failed to retrieve decision matrix:", error);
    toast({
      title: "Error",
      description: "Failed to retrieve matrix data",
      variant: "destructive",
    });
    return null;
  }
}
