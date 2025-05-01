import { initializeConfiguration } from '@/services/configurationService';
import { loadAllReferenceData } from '@/services/dataIngestionService';
import { initializeIntegration } from './integrationInit';
import { supabase } from '@/lib/supabaseClient'; // Updated import path

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

    // Sync with Supabase
    const { valid, conflicts } = await synchronizeWithSupabase();
    if (!valid) {
      console.warn('Data conflicts detected:', conflicts);
      // Handle conflicts (e.g., prompt user or auto-resolve)
    }

    // Initialize frontend-backend integration
    await initializeIntegration();

    _systemBooted = true;
  } catch (error) {
    console.error('Boot failed - falling back to offline mode', error);
    await handleOfflineBoot();
  }
}

async function synchronizeWithSupabase() {
  const { data: remoteData, error } = await supabase
    .from('shipments')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  
  return validateAndMergeData(remoteData);
}

async function validateAndMergeData(remoteData: any[]) {
  // TO DO: Implement data validation and merging logic
  return { valid: true, conflicts: [] };
}

async function handleOfflineBoot() {
  // TO DO: Implement offline boot handling logic
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
