
import { initializeConfiguration } from '@/services/configurationService';
import { loadAllReferenceData } from '@/services/dataIngestionService';
import { initializeIntegration } from './integrationInit';

// Track if the system has been booted
let _systemBooted = false;

// Interface for boot options
interface BootOptions {
  file: string;
  requireShape: string[];
  minRows: number;
  onSuccess?: () => void;
  onFail?: (error: Error) => void;
}

// Check if the system is already booted
export const isSystemBooted = (): boolean => {
  return _systemBooted;
};

// Initialize the decision engine
export const initDecisionEngine = async (): Promise<boolean> => {
  console.log('Initializing decision engine...');
  // Decision engine initialization logic would go here
  return true;
};

// Boot sequence for the application
export async function bootApp() {
  try {
    // Initialize configuration
    const configInitialized = await initializeConfiguration();
    if (!configInitialized) {
      throw new Error('Failed to initialize configuration');
    }

    // Load reference data
    const referenceData = await loadAllReferenceData();
    if (Object.keys(referenceData).length === 0) {
      throw new Error('Failed to load any reference data');
    }
  } catch (error) {
    console.error('App boot failed:', error);
    // Handle boot failure (e.g., display error message to user)
    return;
  }
  
  // Initialize frontend-backend integration
  try {
    await initializeIntegration();
  } catch (error) {
    console.error('Failed to initialize frontend-backend integration:', error);
  }
  
  _systemBooted = true;
}

// Boot with data
export async function boot(
  options: BootOptions,
  data: any[] = []
): Promise<boolean> {
  try {
    console.log(`Booting with ${data.length} rows from ${options.file}`);
    
    // Validate data shape
    if (options.requireShape && options.requireShape.length > 0) {
      const isValidShape = data.every(item => 
        options.requireShape.every(field => field in item)
      );
      
      if (!isValidShape) {
        const error = new Error(`Data does not match required shape: ${options.requireShape.join(', ')}`);
        if (options.onFail) options.onFail(error);
        return false;
      }
    }
    
    // Check minimum rows
    if (data.length < options.minRows) {
      const error = new Error(`Insufficient data: ${data.length} rows, minimum ${options.minRows} required`);
      if (options.onFail) options.onFail(error);
      return false;
    }
    
    // Boot the application
    await bootApp();
    
    // Call success callback if provided
    if (options.onSuccess) {
      options.onSuccess();
    }
    
    _systemBooted = true;
    return true;
  } catch (error) {
    console.error('Boot failed:', error);
    if (options.onFail) {
      options.onFail(error instanceof Error ? error : new Error(String(error)));
    }
    return false;
  }
}
