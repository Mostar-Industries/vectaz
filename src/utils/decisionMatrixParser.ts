
import { fetchJsonData } from './pathMapping';

export interface MatrixData {
  rows: number[][];
  columnCount: number;
}

interface CsvMatrixData {
  matrix: number[][];
  criteria: string[];
}

/**
 * Loads a decision matrix from a CSV file or other source
 */
export const loadDecisionMatrix = async (): Promise<CsvMatrixData> => {
  try {
    // In a real app, this might load from an actual CSV file
    // Here, we're loading from our bundled JSON data
    const data = await fetchJsonData('src/core/base_data/decision_matrix.json');
    
    return {
      matrix: data.matrix || [],
      criteria: data.criteria || []
    };
  } catch (error) {
    console.error('Error loading decision matrix:', error);
    return {
      matrix: [],
      criteria: []
    };
  }
};

/**
 * Retrieves a decision matrix from Supabase
 */
export const retrieveDecisionMatrix = async (): Promise<MatrixData | null> => {
  try {
    // Simulate a Supabase query that would fetch the matrix
    // In a real app, this would use the Supabase client
    const matrixData = await fetchJsonData('src/core/base_data/decision_matrix.json');
    
    return {
      rows: matrixData.matrix || [],
      columnCount: (matrixData.criteria || []).length
    };
  } catch (error) {
    console.error('Error retrieving decision matrix from database:', error);
    return null;
  }
};

/**
 * Stores a decision matrix in Supabase
 */
export const storeDecisionMatrix = async (matrixData: MatrixData): Promise<boolean> => {
  try {
    // Simulate storing the matrix in Supabase
    // In a real app, this would use the Supabase client
    console.log('Matrix stored successfully:', matrixData);
    return true;
  } catch (error) {
    console.error('Error storing decision matrix in database:', error);
    return false;
  }
};
