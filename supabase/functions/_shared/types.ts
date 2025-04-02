
// Common types used across DeepCAL edge functions

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

export interface ShipmentMetrics {
  totalShipments: number;
  shipmentsByMode: Record<string, number>;
  monthlyTrend: Array<{month: string, count: number}>;
  delayedVsOnTimeRate: {onTime: number, delayed: number};
  avgTransitTime: number;
  disruptionProbabilityScore: number;
  shipmentStatusCounts: {active: number, completed: number, failed: number};
  resilienceScore: number;
  noQuoteRatio: number;
}

export interface DeepSightAlert {
  id: string;
  type: 'risk' | 'insight' | 'warning';
  message: string;
  severity: 'low' | 'medium' | 'high';
  relatedEntity?: string;
  timestamp: Date;
  dismissed: boolean;
}

export interface EngineWeights {
  cost: number;
  time: number;
  reliability: number;
  risk: number;
}
