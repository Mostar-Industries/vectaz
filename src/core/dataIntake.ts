
import { Shipment } from "@/types/deeptrack";
import shipmentFields from "@/schemas/shipmentFields.json";
import destinationCountries from "@/schemas/destinationCountries.json";
import forwarders from "@/schemas/forwarders.json";
import modesOfShipment from "@/schemas/modesOfShipment.json";
import itemCategory from "@/schemas/itemCategory.json";

// Metadata for the loaded dataset
export interface DatasetMetadata {
  version: string;
  hash: string;
  source: string;
  timestamp: string;
  validationResults: ValidationResults;
}

export interface ValidationResults {
  isValid: boolean;
  fieldValidation: Record<string, boolean>;
  valueValidation: Record<string, { isValid: boolean; details: string[] }>;
  missingRequiredFields: string[];
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

// Validates data values against allowed schemas
const validateDataValues = (data: any[]): Record<string, { isValid: boolean; details: string[] }> => {
  const results: Record<string, { isValid: boolean; details: string[] }> = {};
  
  // Validate destination countries
  results.destination_country = { isValid: true, details: [] };
  data.forEach((item, index) => {
    if (!destinationCountries.includes(item.destination_country)) {
      results.destination_country.isValid = false;
      results.destination_country.details.push(
        `Row ${index}: Invalid destination country "${item.destination_country}"`
      );
    }
  });
  
  // Validate freight forwarders
  results.final_quote_awarded_freight_forwader_Carrier = { isValid: true, details: [] };
  data.forEach((item, index) => {
    if (!forwarders.includes(item.final_quote_awarded_freight_forwader_Carrier)) {
      results.final_quote_awarded_freight_forwader_Carrier.isValid = false;
      results.final_quote_awarded_freight_forwader_Carrier.details.push(
        `Row ${index}: Invalid freight forwarder "${item.final_quote_awarded_freight_forwader_Carrier}"`
      );
    }
  });
  
  // Validate mode of shipment
  results.mode_of_shipment = { isValid: true, details: [] };
  data.forEach((item, index) => {
    if (!modesOfShipment.includes(item.mode_of_shipment)) {
      results.mode_of_shipment.isValid = false;
      results.mode_of_shipment.details.push(
        `Row ${index}: Invalid mode of shipment "${item.mode_of_shipment}"`
      );
    }
  });
  
  // Validate item category
  results.item_category = { isValid: true, details: [] };
  data.forEach((item, index) => {
    if (!itemCategory.includes(item.item_category)) {
      results.item_category.isValid = false;
      results.item_category.details.push(
        `Row ${index}: Invalid item category "${item.item_category}"`
      );
    }
  });
  
  return results;
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

// Process raw data into our Shipment format
export const processRawData = (data: any[]): Shipment[] => {
  return data.map(item => {
    // Parse forwarder quotes from columns
    const forwarderQuotes: Record<string, number> = {};
    const knownForwarders = [
      'kenya_airways', 'kuehne_nagel', 'scan_global_logistics', 
      'dhl_express', 'dhl_global', 'bwosi', 'agl', 'siginon', 'frieght_in_time'
    ];
    
    knownForwarders.forEach(forwarder => {
      if (item[forwarder] && typeof item[forwarder] === 'number') {
        forwarderQuotes[forwarder] = item[forwarder];
      }
    });
    
    return {
      date_of_collection: item.date_of_collection || "",
      request_reference: item.request_reference || item.shipment_id || "",
      cargo_description: item.cargo_description || "",
      item_category: item.item_category || "",
      origin_country: item.origin_country || item.origin || "",
      origin_longitude: parseFloat(item.origin_longitude) || 0,
      origin_latitude: parseFloat(item.origin_latitude) || 0,
      destination_country: item.destination_country || item.dest || "",
      destination_longitude: parseFloat(item.destination_longitude) || 0,
      destination_latitude: parseFloat(item.destination_latitude) || 0,
      freight_carrier: item.freight_carrier || item.carrier || "",
      weight_kg: parseFloat(item.weight_kg) || 0,
      volume_cbm: parseFloat(item.volume_cbm) || 0,
      initial_quote_awarded: item.initial_quote_awarded || "",
      final_quote_awarded_freight_forwader_Carrier: item.final_quote_awarded_freight_forwader_Carrier || "",
      comments: item.comments || "",
      date_of_arrival_destination: item.date_of_arrival_destination || "",
      delivery_status: item.delivery_status || "",
      mode_of_shipment: item.mode_of_shipment || "",
      forwarder_quotes: forwarderQuotes
    };
  });
};

// Output validation log to console
const logValidationResults = (metadata: DatasetMetadata): void => {
  console.group("DeepCAL Data Validation Log");
  console.log(`Version: ${metadata.version}`);
  console.log(`Source: ${metadata.source}`);
  console.log(`Timestamp: ${metadata.timestamp}`);
  console.log(`Data hash: ${metadata.hash}`);
  console.log(`Validation result: ${metadata.validationResults.isValid ? 'PASSED' : 'FAILED'}`);
  
  if (!metadata.validationResults.isValid) {
    console.group("Validation Failures");
    
    if (metadata.validationResults.missingRequiredFields.length > 0) {
      console.group("Missing Required Fields");
      metadata.validationResults.missingRequiredFields.forEach(field => {
        console.log(`- ${field}`);
      });
      console.groupEnd();
    }
    
    console.group("Value Validation Failures");
    Object.entries(metadata.validationResults.valueValidation)
      .filter(([_, result]) => !result.isValid)
      .forEach(([field, result]) => {
        console.group(`Field: ${field}`);
        result.details.forEach(detail => {
          console.log(`- ${detail}`);
        });
        console.groupEnd();
      });
    console.groupEnd();
    
    console.groupEnd();
  }
  
  console.groupEnd();
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
    
    // Create field validation result
    const fieldValidation: Record<string, boolean> = {};
    const missingRequiredFields: string[] = [];
    
    // Validate all fields from schema
    shipmentFields.forEach(field => {
      const isValid = data.every(item => field in item);
      fieldValidation[field] = isValid;
      
      if (!isValid && config.requireShape.includes(field)) {
        missingRequiredFields.push(field);
      }
    });
    
    // Validate required fields
    const requiredFieldsValid = validateDataStructure(data, config.requireShape);
    
    // Validate values against schemas
    const valueValidation = validateDataValues(data);
    
    // Check if all value validations passed
    const valuesValid = Object.values(valueValidation).every(result => result.isValid);
    
    // Overall validation result
    const isValid = requiredFieldsValid && valuesValid && missingRequiredFields.length === 0;
    
    // Validation results
    const validationResults: ValidationResults = {
      isValid,
      fieldValidation,
      valueValidation,
      missingRequiredFields
    };
    
    // Create metadata
    const metadata: DatasetMetadata = {
      version: `v1.0.0-deepbase`,
      hash: calculateDataHash(data),
      source: "deeptrack_3.csv",
      timestamp: new Date().toISOString(),
      validationResults
    };
    
    // Log validation results
    logValidationResults(metadata);
    
    if (isValid) {
      config.onSuccess();
    } else {
      const error = new BootFailure("Boot halted: data failed validation, see console for details");
      config.onFail(error);
      return metadata; // Return metadata even if validation fails for diagnostics
    }
    
    return metadata;
    
  } catch (error) {
    config.onFail(error instanceof Error ? error : new Error(String(error)));
    return null;
  }
};
