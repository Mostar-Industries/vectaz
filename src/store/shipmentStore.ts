import { create } from 'zustand';
import type { Shipment } from '@/types/deeptrack';
import { calculateForwarderScores } from '@/engine/forwarderMetrics';
import { updateForwarderMemory } from '@/engine/adaptiveLearning';

interface ForwarderScore {
  forwarder: string;
  score: number;
  components: {
    costPerformance: number;
    timePerformance: number;
    reliabilityPerformance: number;
  };
  trace: {
    shipmentIds: string[];
    influentialFields: string[];
    commentary: string;
  };
}

interface DriftLog {
  [x: string]: string;
  timestamp: any;
  score: any;
  forwarderId: any;
  // Assuming this interface is defined elsewhere, if not, you'll need to define it
}

interface ShipmentStore {
  [x: string]: any;
  shipments: Shipment[];
  forwarderScores: ForwarderScore[];
  forwarderDriftLogs?: DriftLog[];
  traceNodes: Record<string, string>;
  ready: boolean;
  setReady: (ready: boolean) => void;
  setShipments: (data: Shipment[]) => void;
  getFilteredShipments: (filter: Partial<Shipment>) => Shipment[];
  calculateScores: (weights?: any) => void;
  getForwarderExplanation: (forwarder: string) => string;
  registerTrace: (metricId: string, filterDesc: string) => void;
  trackDrift?: (args: {
    forwarderId: string;
    predictedScore: ForwarderScore & { components: Required<ForwarderScore['components']> };
    actualDeliveryDays: number;
    actualCost: number;
    shipmentId: string;
  }) => void;
}

export const useShipmentStore = create<ShipmentStore>((set, get) => ({
  shipments: [],
  forwarderScores: [],
  forwarderDriftLogs: [],
  traceNodes: {},
  ready: false,
  
  setReady: (ready) => set({ ready }),
  
  setShipments: (data) => set({ shipments: data, ready: true }),
  
  getFilteredShipments: (filter) => {
    const { shipments } = get();
    return shipments.filter(shipment => 
      Object.entries(filter).every(([key, value]) => {
        const shipmentValue = shipment[key as keyof Shipment];
        return shipmentValue === value;
      })
    );
  },
  
  calculateScores: (weights) => {
    const { shipments } = get();
    const scores = calculateForwarderScores(shipments, weights);
    set({ forwarderScores: scores });
  },
  
  getForwarderExplanation: (forwarder) => {
    const { forwarderScores } = get();
    const score = forwarderScores.find(s => s.forwarder === forwarder);
    return score?.trace.commentary || 'No explanation available';
  },
  
  registerTrace: (metricId, filterDesc) => 
    set(state => ({
      traceNodes: {
        ...state.traceNodes,
        [metricId]: filterDesc
      }
    })),
  
  trackDrift: (args) => {
    if (args) {
      const drift = updateForwarderMemory(args);
      set(state => ({
        forwarderDriftLogs: [...state.forwarderDriftLogs, drift]
      }));
    }
  }
}));

// Traceability initialization
export const initShipmentTraceNodes = () => {
  const store = useShipmentStore.getState();
  
  // Example trace node for "Cost Efficiency per Forwarder"
  store.registerTrace(
    'cost_efficiency_per_forwarder', 
    "store.shipments where freight_carrier = X and delivery_status = 'Delivered'"
  );
  
  // Additional trace nodes would be registered here
};
