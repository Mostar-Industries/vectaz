
import { MatrixData } from '@/utils/decisionMatrixParser';
import { fetchJsonData } from '@/utils/pathMapping';

/**
 * Loads a decision matrix from a data source
 */
export const loadMatrixFromSource = async (): Promise<MatrixData | null> => {
  try {
    // Load from a data source
    const matrixData = await fetchJsonData('src/core/base_data/decision_matrix.json');
    
    if (!matrixData || !matrixData.matrix || !matrixData.criteria) {
      throw new Error('Invalid matrix data format');
    }
    
    return {
      rows: matrixData.matrix,
      columnCount: matrixData.criteria.length
    };
  } catch (error) {
    console.error('Error loading matrix from source:', error);
    return null;
  }
};

/**
 * Retrieves a stored decision matrix
 */
export const retrieveDecisionMatrix = async (): Promise<MatrixData | null> => {
  try {
    // In a real app, this would fetch from a database
    return await loadMatrixFromSource();
  } catch (error) {
    console.error('Error retrieving decision matrix:', error);
    return null;
  }
};

/**
 * Stores a decision matrix
 */
export const storeDecisionMatrix = async (matrixData: MatrixData): Promise<boolean> => {
  try {
    // In a real app, this would store to a database
    console.log('Storing matrix data:', matrixData);
    return true;
  } catch (error) {
    console.error('Error storing decision matrix:', error);
    return false;
  }
};

/**
 * Runs a calculation on a decision matrix
 */
export const runMatrixCalculation = async (matrixData: MatrixData): Promise<any> => {
  try {
    // Simulate a calculation process
    // In a real app, this might call an API or a complex algorithm
    
    const scores = matrixData.rows.map(row => 
      row.reduce((sum, val) => sum + val, 0) / row.length
    );
    
    return {
      scores,
      method: "TOPSIS",
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error calculating matrix result:', error);
    throw error;
  }
};
