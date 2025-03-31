
import { Shipment } from "@/types/deeptrack";
import { validateAndLoadData, DataValidationConfig, BootFailure } from "@/core/dataIntake";
import { decisionEngine } from "@/core/engine";
import { toast } from "@/hooks/use-toast";

// Boot configuration interface
export interface BootConfig {
  file: string;
  requireShape: string[];
  minRows: number;
  onSuccess?: () => void;
  onFail?: (error: Error) => void;
}

// Main boot function for the application
export const boot = async (
  config: BootConfig,
  data?: any[]
): Promise<boolean> => {
  // Default config
  const bootConfig: BootConfig = {
    file: './data/deeptrack_2.csv',
    requireShape: [
      'request_reference', 'origin_country', 'destination_country', 
      'freight_carrier', 'weight_kg', 'delivery_status'
    ],
    minRows: 1,
    ...config
  };

  // Handle failure
  const handleFail = (error: Error) => {
    console.error("Boot failure:", error.message);
    toast({
      title: "System Boot Failure",
      description: error.message,
      variant: "destructive",
    });
    
    if (bootConfig.onFail) {
      bootConfig.onFail(error);
    }
    
    return false;
  };
  
  try {
    // Setup validation config
    const validationConfig: DataValidationConfig = {
      requireShape: bootConfig.requireShape,
      minRows: bootConfig.minRows,
      onSuccess: () => {
        if (bootConfig.onSuccess) {
          bootConfig.onSuccess();
        }
      },
      onFail: (error: Error) => {
        handleFail(error);
      }
    };
    
    // If data is provided directly, validate it
    if (data && Array.isArray(data)) {
      const metadata = validateAndLoadData(data, validationConfig);
      
      if (metadata) {
        // Process the data into shipments and initialize the engine
        const processedData: Shipment[] = data.map(item => ({
          date_of_collection: item.date_of_collection,
          request_reference: item.request_reference || item.shipment_id,
          cargo_description: item.cargo_description || "",
          item_category: item.item_category || "",
          origin_country: item.origin_country || item.origin,
          origin_longitude: parseFloat(item.origin_longitude) || 0,
          origin_latitude: parseFloat(item.origin_latitude) || 0,
          destination_country: item.destination_country || item.dest,
          destination_longitude: parseFloat(item.destination_longitude) || 0,
          destination_latitude: parseFloat(item.destination_latitude) || 0,
          freight_carrier: item.freight_carrier || item.carrier,
          weight_kg: parseFloat(item.weight_kg) || 0,
          volume_cbm: parseFloat(item.volume_cbm) || 0,
          initial_quote_awarded: item.initial_quote_awarded || "",
          final_quote_awarded_freight_forwader_Carrier: item.final_quote_awarded_freight_forwader_Carrier || item.freight_carrier || item.carrier,
          comments: item.comments || "",
          date_of_arrival_destination: item.date_of_arrival_destination || "",
          delivery_status: item.delivery_status || "",
          mode_of_shipment: item.mode_of_shipment || "",
          forwarder_quotes: item.forwarder_quotes || {}
        }));
        
        const success = decisionEngine.initialize(processedData);
        
        if (success) {
          toast({
            title: "System Boot Success",
            description: `DeepCAL engine initialized with ${processedData.length} records`,
          });
          return true;
        } else {
          return handleFail(new BootFailure("Failed to initialize decision engine"));
        }
      }
      
      return false;
    }
    
    // If we're supposed to load from a file but no data was provided,
    // we need to show an error. In a real app, we'd load from the file here.
    return handleFail(new BootFailure(`No data provided and file loading not implemented`));
    
  } catch (error) {
    return handleFail(error instanceof Error ? error : new Error(String(error)));
  }
};

// Function to initialize the decision engine
export const initDecisionEngine = () => {
  // This would perform any additional initialization needed after data is loaded
  console.log("Decision engine successfully initialized");
};

// Function to check if the system is booted
export const isSystemBooted = (): boolean => {
  return decisionEngine.isReady();
};
