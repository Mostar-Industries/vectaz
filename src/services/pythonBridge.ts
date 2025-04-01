
import { fetchJsonData } from '@/utils/pathMapping';

// Interface for Python script configuration
interface PythonScriptConfig {
  path: string;
  args?: string[];
  input?: any;
}

// Interface for Python script result
interface PythonScriptResult<T> {
  success: boolean;
  data: T;
  error?: string;
  logs?: string[];
}

/**
 * Simulates calling a Python script by loading mock data
 */
export async function callPythonScript<T>(config: PythonScriptConfig): Promise<PythonScriptResult<T>> {
  try {
    console.log(`[PythonBridge] Calling script: ${config.path}`);
    
    // In a real implementation, this would execute the Python script
    // For now, we'll simulate the response by loading mock data
    
    // Add a small delay to simulate processing time
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Determine which mock data to return based on the script path
    let mockDataPath = '';
    
    if (config.path.includes('ranking.py')) {
      mockDataPath = 'src/core/base_data/deepcal_oracle.json';
    } else if (config.path.includes('feedback.py')) {
      mockDataPath = 'src/core/base_reference/forwarder_folklore.json';
    } else if (config.path.includes('weighting.py')) {
      // Return a simple weights object
      return {
        success: true,
        data: {
          cost: 0.4,
          time: 0.3,
          reliability: 0.3
        } as unknown as T,
        logs: ['Calculated weights using Neutrosophic AHP']
      };
    } else {
      // Generic mock data
      return {
        success: true,
        data: { result: 'Executed successfully' } as unknown as T,
        logs: ['Script executed with generic response']
      };
    }
    
    // Load the mock data
    const mockData = await fetchJsonData(mockDataPath);
    
    return {
      success: true,
      data: mockData as T,
      logs: [`Successfully executed ${config.path}`]
    };
  } catch (error) {
    console.error('[PythonBridge] Error executing Python script:', error);
    return {
      success: false,
      data: {} as T,
      error: error instanceof Error ? error.message : String(error),
      logs: [`Failed to execute ${config.path}`]
    };
  }
}

/**
 * Runs the TOPSIS ranking algorithm via Python
 */
export async function runTopsisRanking(input: any): Promise<any> {
  try {
    const result = await callPythonScript<any>({
      path: 'src/core/base_engine/py/ranking.py',
      input
    });
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to run TOPSIS ranking');
    }
    
    return result.data;
  } catch (error) {
    console.error('Error running TOPSIS ranking:', error);
    throw error;
  }
}

/**
 * Gets AHP weights via Python
 */
export async function getAhpWeights(): Promise<Record<string, number>> {
  try {
    const result = await callPythonScript<Record<string, number>>({
      path: 'src/core/base_engine/py/weighting.py'
    });
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to get AHP weights');
    }
    
    return result.data;
  } catch (error) {
    console.error('Error getting AHP weights:', error);
    // Return default weights as fallback
    return {
      cost: 0.4,
      time: 0.3,
      reliability: 0.3
    };
  }
}
