
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

export interface ShipmentWithMeta extends Shipment {
  _meta: {
    source: string;
    validated: boolean;
    lastVerified: string;
  };
}

export interface ForwarderPerformance {
  name: string;
  totalShipments: number;
  avgCostPerKg: number;
  avgTransitDays: number;
  onTimeRate: number;
  reliabilityScore: number;
  _meta?: {
    source: string[];
    validated: boolean;
    lastVerified: string;
  };
}

export interface RoutePerformance {
  origin: string;
  destination: string;
  avgTransitDays: number;
  avgCostPerKg: number;
  disruptionScore: number;
  reliabilityScore: number;
  totalShipments: number;
  _meta?: {
    source: string[];
    validated: boolean;
    lastVerified: string;
  };
}

export interface KPI {
  value: number | string;
  label: string;
  source: string[];
  validated: boolean;
  mappedFrom: string;
  lastVerified: string;
  change?: number;
  trend?: 'up' | 'down' | 'stable';
}

export interface ValidationState {
  isDataLoaded: boolean;
  isDataValidated: boolean;
  dataSource: string;
  lastValidated: string;
  validationErrors: string[];
}
