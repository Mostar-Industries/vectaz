
export interface Shipment {
  date_of_collection: string;
  request_reference: string;
  cargo_description: string;
  item_category: string;
  origin_country: string;
  origin_longitude: number;
  origin_latitude: number;
  destination_country: string;
  destination_longitude: number;
  destination_latitude: number;
  freight_carrier: string;
  weight_kg: number;
  volume_cbm: number;
  initial_quote_awarded: string;
  final_quote_awarded_freight_forwader_Carrier: string;
  comments: string;
  date_of_arrival_destination: string;
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

export type AppSection = 'map' | 'analytics' | 'deepcal' | 'about' | 'settings';

export interface TabItem {
  id: AppSection;
  label: string;
  icon: React.ComponentType<any>;
}
