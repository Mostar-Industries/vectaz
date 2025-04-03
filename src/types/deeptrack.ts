export interface Shipment {
  /** Date when Freight forwarder was given greenlight to pick up Cargo (ISO 8601 format) */
  date_of_greenlight_to_pickup: string | null;
  
  /** Date when Freight forwarder picked up Cargo from warehouse (ISO 8601 format) */
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
  
  /** Delivery status */
  delivery_status: "Delivered" | "Pending" | "Enroute";
  
  /** Transportation method */
  mode_of_shipment: "Air" | "Road" | "Sea";
}

export interface ShipmentAnalytics {
  /** Key performance indicators */
  metrics: {
    /** Total number of shipments */
    totalShipments: number;
    
    /** Shipments by transportation mode */
    shipmentsByMode: Record<"Air" | "Road" | "Sea", number>;
    
    /** Monthly shipment trends */
    monthlyTrend: Array<{ month: string; count: number }>;
    
    /** On-time vs delayed ratio */
    delayedVsOnTimeRate: { onTime: number; delayed: number };
    
    /** Average transit time in days */
    avgTransitTime: number;
    
    /** Probability of shipment disruption */
    disruptionProbabilityScore: number;
    
    /** Counts by shipment status */
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
    
    /** System resilience score */
    resilienceScore: number;
    
    /** Ratio of shipments without quotes */
    noQuoteRatio: number;
    
    /** Average cost per kilogram */
    avgCostPerKg: number;
  };
}
