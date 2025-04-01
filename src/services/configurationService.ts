
import { toast } from '@/hooks/use-toast';
import { getNewPath, fetchJsonData } from '@/utils/pathMapping';

// Configuration service state
let initialized = false;
const configCache: Record<string, any> = {};

/**
 * Initializes the configuration service, loading necessary configuration files
 * @returns True if initialization was successful, false otherwise
 */
export const initializeConfiguration = async (): Promise<boolean> => {
  try {
    // Load the frontend configuration
    const frontendConfig = await fetchJsonData('src/config/frontend-config.yaml');
    configCache['frontend-config'] = frontendConfig;
    
    // Load the component mappings
    const componentMappings = await fetchJsonData('src/config/component-mappings.json');
    configCache['component-mappings'] = componentMappings;
    
    // Load test workflow configuration
    const testWorkflow = await fetchJsonData('src/config/test-workflow.yaml');
    configCache['test-workflow'] = testWorkflow;
    
    // Load schema files
    await preloadSchemas();
    
    initialized = true;
    console.log('Configuration service initialized successfully');
    
    return true;
  } catch (error) {
    console.error('Failed to initialize configuration service:', error);
    toast({
      title: 'Configuration Error',
      description: 'Failed to initialize configuration service',
      variant: 'destructive',
    });
    
    return false;
  }
};

/**
 * Preloads schema files for faster access
 */
const preloadSchemas = async (): Promise<void> => {
  try {
    // Load shipment fields schema
    const shipmentsField = await fetchJsonData('src/core/base_schema/shipmentsField.json');
    configCache['shipments-schema'] = shipmentsField;
    
    // Load field descriptions
    const fieldDescriptions = await fetchJsonData('src/core/base_schema/fieldDescriptions.json');
    configCache['field-descriptions'] = fieldDescriptions;
  } catch (error) {
    console.error('Failed to preload schemas:', error);
  }
};

/**
 * Gets a configuration value by key
 * @param key The configuration key
 * @returns The configuration value
 */
export const getConfig = <T>(key: string): T | null => {
  if (!initialized) {
    console.warn('Configuration service not initialized');
    return null;
  }
  
  return (configCache[key] as T) || null;
};

/**
 * Gets a component mapping by component name
 * @param componentName The name of the component
 * @returns The component mapping configuration
 */
export const getComponentMapping = (componentName: string): any => {
  const mappings = getConfig<Record<string, any>>('component-mappings');
  if (!mappings) return null;
  
  return mappings[componentName] || null;
};

/**
 * Gets an API configuration by API name
 * @param apiName The name of the API
 * @returns The API configuration
 */
export const getApiConfig = (apiName: string): any => {
  const config = getConfig<Record<string, any>>('frontend-config');
  if (!config || !config.apis) return null;
  
  return config.apis[apiName] || null;
};

/**
 * Gets a schema by name
 * @param schemaName The name of the schema
 * @returns The schema
 */
export const getSchema = (schemaName: string): any => {
  return getConfig<any>(schemaName) || null;
};

/**
 * Validates that all required configuration is available
 * @returns True if validation passed, false otherwise
 */
export const validateConfiguration = (): boolean => {
  if (!initialized) {
    console.warn('Configuration service not initialized');
    return false;
  }
  
  // Check required configurations
  const requiredConfigs = [
    'frontend-config',
    'component-mappings',
    'shipments-schema',
    'field-descriptions'
  ];
  
  for (const config of requiredConfigs) {
    if (!configCache[config]) {
      console.error(`Missing required configuration: ${config}`);
      return false;
    }
  }
  
  return true;
};

// Auto-initialize on service import
initializeConfiguration().catch(error => {
  console.error('Failed to auto-initialize configuration service:', error);
});
