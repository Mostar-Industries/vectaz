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

// Validate dataset shape
const validateDataStructure = (data: Shipment[], requiredFields: string[]): boolean => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return false;
  }
  return data.every(item => 
    requiredFields.every(field => field in item && item[field] !== null)
  );
};

// Numeric parsing helper
const parseNumericOrNull = (value: number): number | null => {
  if (value === null || typeof value === 'undefined') {
    return null;
  }
  const num = parseFloat(String(value));
  return Number.isNaN(num) ? null : num;
};

// Hashing for version control
const calculateDataHash = (data: Shipment[]): string => {
  const jsonString = JSON.stringify(data);
  let hash = 0;
  for (let i = 0; i < jsonString.length; i++) {
    const char = jsonString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return 'sha256-' + Math.abs(hash).toString(16);
};

// Extract forwarder quotes dynamically
const extractForwarderQuotes = (item: Shipment): Record<string, number> => {
  const quotes: Record<string, number> = {};
  Object.entries(item).forEach(([key, value]) => {
    if (typeof value === "number" && key.match(/^(kenya_airways|kuehne_nagel|scan_global_logistics|dhl_express|dhl_global|bwosi|agl|siginon|frieght_in_time)$/i)) {
      quotes[key.toLowerCase()] = value;
    }
  });
  return quotes;
};

// Normalize incoming data structure
export const processRawData = (data: Shipment[]): Shipment[] => {
  return data.map(item => {
    const forwarderQuotes = extractForwarderQuotes(item);
    return {
      shipment_id: item.shipment_id ?? '',
      origin: item.origin ?? '',
      dest: item.dest ?? '',
      expected_delivery_date: item.expected_delivery_date ?? '',
      carrier: item.carrier ?? '',
      date_of_collection: item.date_of_collection,
      request_reference: item.request_reference || item.id,
      cargo_description: item.cargo_description,
      item_category: item.item_category,
      origin_country: item.origin_country ?? item.origin,
      origin_longitude: parseNumericOrNull(item.origin_longitude),
      origin_latitude: parseNumericOrNull(item.origin_latitude),
      destination_country: item.destination_country ?? item.dest,
      destination_longitude: parseNumericOrNull(item.destination_longitude),
      destination_latitude: parseNumericOrNull(item.destination_latitude),
      freight_carrier: item.freight_carrier ?? item.carrier,
      weight_kg: parseNumericOrNull(item.weight_kg),
      volume_cbm: parseNumericOrNull(item.volume_cbm),
      initial_quote_awarded: item.initial_quote_awarded,
      final_quote_awarded_freight_forwader_Carrier: item.final_quote_awarded_freight_forwader_Carrier,
      comments: item.comments,
      date_of_arrival_destination: item.date_of_arrival_destination,
      delivery_status: item.delivery_status,
      mode_of_shipment: item.mode_of_shipment,
      forwarder_quotes: forwarderQuotes
    };
  });
};


// Full validation + metadata
export const validateAndLoadData = (data: Shipment[], config: DataValidationConfig): DatasetMetadata | null => {
  try {
    if (data.length < config.minRows) { 
      const error = new BootFailure(`Boot halted: dataset contains only ${data.length} rows, minimum required is ${config.minRows}`);
      config.onFail(error);
      return null;
    }
    
    if (!validateDataStructure(data, config.requireShape)) {
      const error = new BootFailure("Boot halted: data failed validation, required fields missing");
      config.onFail(error);
      return null;
    }
    
    const metadata: DatasetMetadata = {
      version: `v1.0.0-deepcal++`,
      hash: calculateDataHash(data),
      source: "deeptrack_corex1.csv",
      timestamp: new Date().toISOString()
    };
    
    config.onSuccess();
    return metadata;  
    
  } catch (error) {
    config.onFail(error instanceof Error ? error : new Error(String(error)));
    return null;
  }
};
