
import { toast } from '@/hooks/use-toast';
import { initializeConfiguration, validateConfiguration } from '@/services/configurationService';
import { loadAllReferenceData } from '@/services/dataIngestionService';

/**
 * Synchronizes the frontend with the backend
 * @param configPath The path to the configuration file
 * @param schemaPath The path to the schema directory
 * @returns True if synchronization was successful, false otherwise
 */
export const syncFrontendWithBackend = async (
  configPath: string = 'src/config/frontend-config.yaml',
  schemaPath: string = 'src/core/base_schema/'
): Promise<boolean> => {
  try {
    console.log('Starting frontend synchronization...');
    
    // Initialize configuration
    const configInitialized = await initializeConfiguration();
    if (!configInitialized) {
      throw new Error('Failed to initialize configuration');
    }
    
    // Validate configuration
    const configValid = validateConfiguration();
    if (!configValid) {
      throw new Error('Configuration validation failed');
    }
    
    // Load reference data
    const referenceData = await loadAllReferenceData();
    if (Object.keys(referenceData).length === 0) {
      throw new Error('Failed to load any reference data');
    }
    
    console.log('Frontend synchronization completed successfully');
    toast({
      title: 'Sync Complete',
      description: 'Frontend synchronized with backend successfully',
    });
    
    return true;
  } catch (error) {
    console.error('Frontend synchronization failed:', error);
    toast({
      title: 'Sync Failed',
      description: error instanceof Error ? error.message : 'Frontend synchronization failed',
      variant: 'destructive',
    });
    
    return false;
  }
};

/**
 * Runs the sync utility from the command line
 * @param args Command line arguments
 */
export const runSync = (args: string[] = []): void => {
  let configPath = 'src/config/frontend-config.yaml';
  let schemaPath = 'src/core/base_schema/';
  
  // Parse command line arguments
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--config' && i + 1 < args.length) {
      configPath = args[i + 1];
      i++;
    } else if (args[i] === '--schema-path' && i + 1 < args.length) {
      schemaPath = args[i + 1];
      i++;
    }
  }
  
  // Run the sync
  syncFrontendWithBackend(configPath, schemaPath)
    .then(success => {
      if (success) {
        console.log('Sync completed successfully');
      } else {
        console.error('Sync failed');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('Sync error:', error);
      process.exit(1);
    });
};

// If this file is being run directly, run the sync
if (typeof window === 'undefined' && require.main === module) {
  runSync(process.argv.slice(2));
}
