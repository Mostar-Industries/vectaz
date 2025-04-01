
import { toast } from '@/hooks/use-toast';
import { getApiConfig } from './configurationService';
import { validateAgainstSchema } from '@/utils/schemaValidator';
import { getNewPath, fetchJsonData } from '@/utils/pathMapping';

/**
 * Ingests shipment data from the specified source
 * @param source The data source path (optional, will use default if not provided)
 * @returns True if ingestion was successful, false otherwise
 */
export const ingestShipmentData = async (source?: string): Promise<boolean> => {
  try {
    // Get the data ingestion API config
    const apiConfig = getApiConfig('data_ingestion');
    if (!apiConfig) {
      throw new Error('Data ingestion API configuration not found');
    }
    
    // Use provided source or default from config
    const dataSource = source || apiConfig.source;
    
    // Fetch the data
    const data = await fetchJsonData(dataSource);
    
    // Validate the data against the schema
    const inputSchema = apiConfig.input_schema || 'src/core/base_schema/shipmentsField.json';
    const validationErrors = await validateAgainstSchema(data, inputSchema);
    
    if (validationErrors) {
      throw new Error(`Data validation failed: ${JSON.stringify(validationErrors)}`);
    }
    
    // Call the data ingestion API
    const response = await fetch(apiConfig.path, {
      method: apiConfig.method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    
    toast({
      title: 'Data Ingested',
      description: 'Shipment data successfully ingested',
    });
    
    return true;
  } catch (error) {
    console.error('Failed to ingest shipment data:', error);
    toast({
      title: 'Data Ingestion Error',
      description: error instanceof Error ? error.message : 'Failed to ingest shipment data',
      variant: 'destructive',
    });
    
    return false;
  }
};

/**
 * Loads reference data from the specified path
 * @param path The path to the reference data
 * @returns The reference data
 */
export const loadReferenceData = async (path: string): Promise<any> => {
  try {
    return await fetchJsonData(path);
  } catch (error) {
    console.error(`Failed to load reference data from ${path}:`, error);
    toast({
      title: 'Reference Data Error',
      description: `Failed to load reference data from ${path}`,
      variant: 'destructive',
    });
    
    return null;
  }
};

/**
 * Loads all reference data needed for the application
 * @returns An object containing all reference data
 */
export const loadAllReferenceData = async (): Promise<Record<string, any>> => {
  const referenceData: Record<string, any> = {};
  
  // List of reference data files to load
  const referencePaths = [
    'src/core/base_reference/modesOfShipments.json',
    'src/core/base_reference/forwarders.json',
    'src/core/base_reference/carrier.json',
    'src/core/base_reference/destinationCountries.json',
    'src/core/base_reference/forwarder_folklore.json'
  ];
  
  // Load each reference data file
  for (const path of referencePaths) {
    try {
      const data = await fetchJsonData(path);
      const key = path.split('/').pop()?.replace('.json', '') || '';
      referenceData[key] = data;
    } catch (error) {
      console.error(`Failed to load reference data from ${path}:`, error);
    }
  }
  
  return referenceData;
};
