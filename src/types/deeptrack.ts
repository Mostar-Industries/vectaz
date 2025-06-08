export interface Shipment {
  forwarder_name: string;
  freight_provider: string;
  freight_cost_usd: number;
  shipment_id: string;
  origin: string;
  dest: string;
  expected_delivery_date: string;
  freight_carrier: string;
  forwarder_quotes: Record<string, number>;
  customs_clearance_time_days?: number;
  freight_carrier_cost?: number;
  emergency_grade?: number;
  id?: string;
  request_reference: string;
  cargo_description: string;
  item_category: string;
  origin_country: string;
  origin_latitude: number;
  origin_longitude: number;
  destination_country: string;
  destination_latitude: number;
  destination_longitude: number;
  carrier: string;
  "carrier+cost"?: string;
  kuehne_nagel?: number;
  scan_global_logistics?: number;
  dhl_express?: number;
  dhl_global?: number;
  bwosi?: number;
  agl?: number;
  siginon?: number;
  frieght_in_time?: number;
  weight_kg: number;
  volume_cbm: number;
  initial_quote_awarded?: string;
  final_quote_awarded_freight_forwader_Carrier?: string;
  comments?: string;
  date_of_collection: string;
  date_of_arrival_destination?: string;
  delivery_status?: string;
  mode_of_shipment?: string;
  date_of_greenlight_to_pickup?: string | null;
  distance_km?: number;
}

export interface ForwarderPerformance extends Omit<Shipment, 'customs_clearance_time_days'> {
  avg_transit_days: number;
  shipments: number;
  score: number;
  reliability: number;
  name: string;
  avgCostPerKg: number;
  reliabilityScore: number;
  totalShipments: number;
  avgTransitDays: number;
  onTimeRate: number;
  deepScore: number;
  costScore: number;
  timeScore: number;
  quoteWinRate: number;
}

export interface CarrierPerformance {
  name: string;
  totalShipments: number;
  avgTransitDays: number;
  onTimeRate: number;
  reliabilityScore: number;
  serviceScore?: number;
  punctualityScore?: number;
  handlingScore?: number;
  shipments: number;
  reliability: number;
}

export interface RoutePerformance {
  origin: string;
  destination: string;
  avgTransitDays: number;
  avgCostPerKg: number;
  disruptionScore: number;
  reliabilityScore: number;
  totalShipments: number;
}

export interface CountryPerformance {
  totalWeight: number;
  totalVolume: number;
  totalCost: number;
  avgDelayDays: number;
  country: string;
  totalShipments: number;
  avgCostPerRoute: number;
  avgCustomsClearanceTime: number;
  deliveryFailureRate: number;
  borderDelayIncidents: number;
  resilienceIndex: number;
  preferredMode: string;
  topForwarders: string[];
  reliabilityScore?: number;
  avgTransitDays?: number;
  deliverySuccessRate?: number;
}

export interface WarehousePerformance {
  name: string;
  location: string;
  totalShipments: number;
  avgPickPackTime: number;
  packagingFailureRate: number;
  missedDispatchRate: number;
  rescheduledShipmentsRatio: number;
  reliabilityScore: number;
  preferredForwarders: string[];
  costDiscrepancy: number;
  dispatchSuccessRate?: number;
  avgTransitDays?: number;
}

export interface ShipmentMetrics {
  totalShipments: number;
  shipmentsByMode: Record<string, number>;
  monthlyTrend: Array<{ month: string; count: number }>;
  delayedVsOnTimeRate: { onTime: number; delayed: number };
  avgTransitTime: number;
  disruptionProbabilityScore: number;
  shipmentStatusCounts: {
    active: number;
    completed: number;
    failed: number;
    onTime: number;
    inTransit: number;
    delayed?: number;
    cancelled?: number;
    pending?: number;
  };
  resilienceScore: number;
  noQuoteRatio: number;
  forwarderPerformance?: Record<string, number>;
  carrierPerformance?: Record<string, number>;
  topForwarder?: string;
  topCarrier?: string;
  carrierCount?: number;
  avgCostPerKg: number;
}

export type AppSection = 'map' | 'analytics' | 'deepcal' | 'forms' | 'about' | 'settings';

export interface TabItem {
  id: AppSection;
  label: string;
  icon: React.ComponentType<unknown>;
}

export interface MapPoint {
  lat: number;
  lng: number;
  name: string;
  isOrigin: boolean;
}

export interface Route {
  origin: MapPoint;
  destination: MapPoint;
  weight: number;
  shipmentCount: number;
  deliveryStatus?: string;
}

export type TrendDirection = 'up' | 'down' | 'neutral';

export interface KPIResults {
  onTimeRate: number;
  avgTransitDays: number;
  modeSplit: {
    air: number;
    sea: number;
    road: number;
  };
}

export interface HistoricalTrends {
  totalShipments?: { change: number; direction: TrendDirection };
  onTimeRate?: { baseline: number; change: number };
}

export interface ShipmentAnalyticsProps {
  metrics: ShipmentMetrics;
}

export interface CSVShipment {
  origin_country: string;
  origin_latitude: number;
  origin_longitude: number;
  destination_country: string;
  destination_latitude: number;
  destination_longitude: number;
}

export interface ScoreWeights {
  cost: number;
  time: number;
  reliability: number;
}

export interface ForwarderScore {
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
  metrics?: {
    cost: number;
    deliveryTime: number;
    reliability: number;
  };
  reasoning?: string;
}

export interface DriftLog {
  shipmentId: string;
  forwarder: string;
  predicted: ForwarderScore;
  actual: { deliveryDays: number; cost: number };
  driftMagnitude: number;
  weightAdjustment: Record<string, number>;
  reasoning: string;
}

export function adaptForwarderToShipment(fp: ForwarderPerformance): Shipment {
  return {
  shipment_id: '',
  origin: '',
  dest: '',
  expected_delivery_date: '',
  freight_carrier: fp.name,
  forwarder_quotes: {},
  customs_clearance_time_days: 0,
  freight_carrier_cost: 0,
  emergency_grade: 0,
  id: '',
  request_reference: '',
  cargo_description: '',
  item_category: '',
  origin_country: '',
  origin_latitude: 0,
  origin_longitude: 0,
  destination_country: '',
  destination_latitude: 0,
  destination_longitude: 0,
  carrier: '',
  "carrier+cost": '',
  kuehne_nagel: 0,
  scan_global_logistics: 0,
  dhl_express: 0,
  dhl_global: 0,
  bwosi: 0,
  agl: 0,
  siginon: 0,
  frieght_in_time: 0,
  weight_kg: 0,
  volume_cbm: 0,
  initial_quote_awarded: '',
  final_quote_awarded_freight_forwader_Carrier: '',
  comments: '',
  date_of_collection: '',
  date_of_arrival_destination: '',
  delivery_status: '',
  mode_of_shipment: '',
  date_of_greenlight_to_pickup: null,
  distance_km: 0,
  forwarder_name: "",
  freight_provider: "",
  freight_cost_usd: 0,
};
}
