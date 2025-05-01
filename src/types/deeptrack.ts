export interface Shipment {
  date_of_collection: string;
  
  /** Stock Release (Shipment Number/ID) */
  request_reference: string;
  
  /** The name of the item that was shipped */
  cargo_description: string;
  
  /** The Category of Item name that was shipped */
  item_category: string;
  
  /** Country location of the warehouse */
  origin_country: string;
  
  /** Warehouse Longitude (Decimal degrees) */
  origin_longitude: number;
  
  /** Warehouse Latitude (Decimal degrees) */
  origin_latitude: number;
  
  /** Destination Country where item arrives */
  destination_country: string;
  
  /** Destination Longitude (Decimal degrees) */
  destination_longitude: number;
  
  /** Destination Latitude (Decimal degrees) */
  destination_latitude: number;
  
  /** Carrier used by Freight forwarder */
  carrier: string;
  
  /** Carrier's total charges (local currency with formatting) */
  "freight_carrier+cost": string;
  
  /** Freight Forwarder quote (0 = No Quote) */
  kuehne_nagel: number;
  
  /** Freight Forwarder quote (0 = No Quote) */
  scan_global_logistics: number;
  
  /** Freight Forwarder quote (0 = No Quote) */
  dhl_express: number;
  
  /** Freight Forwarder quote (0 = No Quote) */
  dhl_global: number;
  
  /** Freight Forwarder quote (0 = No Quote) */
  bwosi: number;
  
  /** Freight Forwarder quote (0 = No Quote) */
  agl: number;
  
  /** Freight Forwarder quote (0 = No Quote) */
  siginon: number;
  
  /** Freight Forwarder quote (0 = No Quote) */
  frieght_in_time: number; // Note: Original spelling preserved
  
  /** Weight in kilograms (with decimal precision) */
  weight_kg: number;
  
  /** Volume in cubic meters (with decimal precision) */
  volume_cbm: number;
  
  /** Initially selected Freight Forwarder */
  initial_quote_awarded: string;
  
  /** Finally selected Freight Forwarder (with typo preserved) */
  final_quote_awarded_freight_forwader_Carrier: string;
  
  /** Comments on shipment (free text) */
  comments: string;
  
  /** Date of arrival at destination (ISO 8601 format) */
  date_of_arrival_destination: string | null;
  delivery_status: string;
  mode_of_shipment: string;
  forwarder_quotes: Record<string, number>;
}

export interface ForwarderPerformance {
  name: string;
  totalShipments: number;
  avgCostPerKg: number;
  avgTransitDays: number;
  onTimeRate: number;
  reliabilityScore: number;
  deepScore?: number;
  costScore?: number;
  timeScore?: number;
  quoteWinRate?: number;
  serviceScore?: number;
  punctualityScore?: number;
  handlingScore?: number;
  // Properties to match ForwarderAnalytics component usage
  shipments?: number;
  reliability?: number;
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
  // Properties to match ForwarderAnalytics component usage
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
  monthlyTrend: Array<{month: string, count: number}>;
  delayedVsOnTimeRate: {onTime: number, delayed: number};
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

export type AppSection = 'map' | 'analytics' | 'deepcal' | 'about' | 'settings' | 'forms';

export interface TabItem {
  id: AppSection;
  label: string;
  icon: React.ComponentType<any>;
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

interface KPIResults {
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
  // Add other metrics as needed
}

export interface ShipmentAnalyticsProps {
  metrics: ShipmentMetrics;
}
