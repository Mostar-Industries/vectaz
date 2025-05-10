import type { Shipment, ForwarderPerformance, RoutePerformance } from '../types/deeptrack';

// Interface for decision engine criteria weights
export interface CriteriaWeights {
  cost: number;
  time: number;
  reliability: number;
}

// Interface for decision engine recommendation
export interface Recommendation {
  forwarder: string;
  score: number;
  closeness: number;
  costPerformance: number;
  timePerformance: number;
  reliabilityPerformance: number;
  sourceRows?: number[];
  modelVersion: string;
  computedAt: string;
}

export class DecisionEngine {
  constructor(private shipments: Shipment[]) {}

  analyze() {
    return {
      kpis: this.calculateKPIs(),
      risks: this.assessRisks(),
      optimization: this.runOptimization()
    };
  }

  private calculateKPIs() {
    const validShipments = this.shipments.filter(s => 
      s.delivery_status === 'Delivered' && Number(s.forwarder_weight_kg) > 0
    );
    
    const totalWeight = validShipments.reduce((sum, s) => sum + (Number(s.forwarder_weight_kg) || 0), 0);
    const totalCost = validShipments.reduce((sum, s) => sum + (Number(s.forwarder_quotes[s.final_quote_awarded_freight_forwader_Carrier.toLowerCase()]) || 0), 0);
    
    // Calculate transit times
    const totalTransitDays = validShipments.reduce((sum, s) => {
                const transitDays = (Number(new Date(s.date_of_arrival_destination)) - Number(new Date(s.date_of_collection))) / (1000 * 60 * 60 * 24);
      return sum + (transitDays || 0);
    }, 0);
    
    // Calculate disruption metrics
    const disruptedShipments = validShipments.filter(s => s.delay_days > 0);
    const disruptionRatio = validShipments.length > 0 
      ? disruptedShipments.length / validShipments.length 
      : 0;
    
    return {
      total_shipments: validShipments.length,
      total_weight: totalWeight,
      avg_cost_per_kg: totalWeight > 0 ? totalCost / totalWeight : 0,
      avg_transit_days: validShipments.length > 0 ? totalTransitDays / validShipments.length : 0,
      disruption_score: Math.min(10, disruptionRatio * 20), // Scale to 0-10
      resilience_score: 10 - Math.min(10, disruptionRatio * 20) // Inverse of disruption
    };
  }

  private assessRisks() {
    // Combined risk assessment logic
    return {};
  }

  private runOptimization() {
    // Unified optimization logic combining AHP + TOPSIS
    return {};
  }
}
