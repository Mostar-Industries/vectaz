
import { Shipment } from "@/types/deeptrack";

// Metadata for the loaded dataset
export interface DatasetMetadata {
  version: string;
  hash: string;
  source: string;
  timestamp: string;
}

// Data validation configuration
export interface DataValidationConfig {
  requireShape: string[];
  minRows: number;
  onSuccess: () => void;
  onFail: (error: Error) => void;
}

// Error type for boot failures
export class BootFailure extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BootFailure";
  }
}

// Validates the data structure against required fields
const validateDataStructure = (data: any[], requiredFields: string[]): boolean => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return false;
  }
  
  return data.every(item => 
    requiredFields.every(field => field in item && item[field] !== null)
  );
};

// Calculates a simple hash of the data for versioning
// In production, this would use a proper SHA256 algorithm
const calculateDataHash = (data: any[]): string => {
  const jsonString = JSON.stringify(data);
  let hash = 0;
  for (let i = 0; i < jsonString.length; i++) {
    const char = jsonString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return 'sha256-' + Math.abs(hash).toString(16);
};

// Main data validation and loading function
export const validateAndLoadData = (data: any[], config: DataValidationConfig): DatasetMetadata | null => {
  try {
    // Check minimum row count
    if (data.length < config.minRows) {
      const error = new BootFailure(`Boot halted: dataset contains only ${data.length} rows, minimum required is ${config.minRows}`);
      config.onFail(error);
      return null;
    }
    
    // Validate required fields
    if (!validateDataStructure(data, config.requireShape)) {
      const error = new BootFailure("Boot halted: data failed validation, required fields missing");
      config.onFail(error);
      return null;
    }
    
    // Process successful validation
    const metadata: DatasetMetadata = {
      version: `v1.0.0-deepbase`,
      hash: calculateDataHash(data),
      source: "deeptrack_2.csv",
      timestamp: new Date().toISOString()
    };
    
    config.onSuccess();
    return metadata;
    
  } catch (error) {
    config.onFail(error instanceof Error ? error : new Error(String(error)));
    return null;
  }
};
