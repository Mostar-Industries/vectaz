import { initializeConfiguration } from '@/services/configurationService';
import { loadAllReferenceData } from '@/services/dataIngestionService';
import { initializeIntegration } from './integrationInit';
import supabase from '@/lib/supabaseClient';
import { z } from 'zod';
import type { Shipment } from '@/types/deeptrack';
import { useShipmentStore } from '@/store/shipmentStore';
import { initShipmentTraceNodes } from '@/store/shipmentStore';
import { syncQueuedLogs } from '@/services/driftSync';

// Shipment schema validation
const ShipmentSchema = z.object({
  id: z.string().optional(),
  request_reference: z.string(),
  cargo_description: z.string(),
  item_category: z.string(),
  origin_country: z.string(),
  origin_latitude: z.number(),
  origin_longitude: z.number(),
  destination_country: z.string(),
  destination_latitude: z.number(),
  destination_longitude: z.number(),
  carrier: z.string(),
  "carrier+cost": z.string().optional(),
  kuehne_nagel: z.string().optional(),
  scan_global_logistics: z.string().optional(),
  dhl_express: z.string().optional(),
  dhl_global: z.string().optional(),
  bwosi: z.string().optional(),
  agl: z.string().optional(),
  siginon: z.string().optional(),
  frieght_in_time: z.string().optional(),
  weight_kg: z.string(),
  volume_cbm: z.string(),
  initial_quote_awarded: z.string().optional(),
  final_quote_awarded_freight_forwader_Carrier: z.string().optional(),
  comments: z.string().optional(),
  date_of_collection: z.string(),
  date_of_arrival_destination: z.string().optional(),
  delivery_status: z.string().optional(),
  mode_of_shipment: z.string().optional(),
  date_of_greenlight_to_pickup: z.string().nullable().optional()
});

export const loadShipmentData = (): Shipment[] => {
  try {
    // Check for cached data first
    const cached = localStorage.getItem('deepcal_data');
    if (cached) return JSON.parse(cached);

    const deeptrackData = require('../core/base_data/deeptrack_3.json');
    
    const validated = deeptrackData.map((entry, i) => {
      const fallback = {
        id: entry.id ?? `shipment_${i}`,
        ...entry,
      };

      const parsed = ShipmentSchema.safeParse(fallback);
      if (!parsed.success) {
        console.warn('❌ Invalid shipment at index', i, parsed.error);
        return null;
      }
      return parsed.data;
    }).filter(Boolean);

    // Cache validated data
    localStorage.setItem('deepcal_data', JSON.stringify(validated));
    return validated as Shipment[];
  } catch (error) {
    console.error('Failed to load shipment data:', error);
    return [];
  }
};

// Track if the system has been booted
let _systemBooted = false;

interface BootOptions {
  file: string;
  requireShape: string[];
  minRows: number;
  onSuccess?: () => void;
  onFail?: (error: Error) => void;
}

export const isSystemBooted = (): boolean => _systemBooted;

export const initDecisionEngine = async (): Promise<boolean> => {
  console.log('Initializing decision engine...');
  return true;
};

export async function bootApp() {
  if (_systemBooted) return true;

  try {
    const shipmentStore = useShipmentStore.getState();
    if (!shipmentStore.ready) {
      throw new Error('Store is not ready');
    }
    
    // Initialize configuration
    const configInitialized = await initializeConfiguration();
    if (!configInitialized) throw new Error('Configuration initialization failed');

    // Load reference data
    const referenceData = await loadAllReferenceData();
    if (Object.keys(referenceData).length === 0) {
      throw new Error('No reference data loaded');
    }

    // Load and validate shipment data
    const shipmentData = loadShipmentData();
    
    // Initialize store with validated data
    shipmentStore.setShipments(shipmentData);
    initShipmentTraceNodes();
    
    if (shipmentData.length === 0) {
      console.warn('No valid shipment data loaded');
    }

    // Initialize integrations
    await initializeIntegration();

    // Sync with Supabase
    const { valid, conflicts } = await synchronizeWithSupabase();
    if (!valid) {
      console.warn('Data conflicts detected:', conflicts);
    }

    // Sync any queued drift logs
    await syncQueuedLogs();

    // Initialize decision engine
    await initDecisionEngine();

    useShipmentStore.getState().setReady(true);
    _systemBooted = true;
    return true;
  } catch (err) {
    console.error('Boot failed:', err);
    return false;
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
