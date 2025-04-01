
import { Shipment, ForwarderPerformance, RoutePerformance } from "../types/deeptrack";

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

/**
 * AHP-TOPSIS Decision Engine Implementation
 * 
 * This implements a simplified version of the Analytic Hierarchy Process (AHP)
 * combined with the Technique for Order of Preference by Similarity to Ideal Solution (TOPSIS)
 * to rank forwarders based on multiple criteria.
 */
export class DecisionEngine {
  private shipmentData: Shipment[] = [];
  private metadataVersion: string = "v1.0.0-deepbase";
  private isInitialized: boolean = false;

  constructor() {}
  
  /**
   * Initialize the decision engine with shipment data
   * @param data The shipment data to use for decision making
   * @returns true if initialization was successful, false otherwise
   */
  initialize(data: Shipment[]): boolean {
    if (!data || data.length === 0) {
      console.error("Cannot initialize engine with empty data");
      return false;
    }
    
    this.shipmentData = data;
    this.isInitialized = true;
    return true;
  }
  
  /**
   * Check if the engine is initialized with data
   * @returns true if the engine is initialized, false otherwise
   */
  isReady(): boolean {
    return this.isInitialized;
  }
  
  /**
   * Get forwarder performance metrics
   * @returns Array of forwarder performance data
   */
  getForwarderPerformance(): ForwarderPerformance[] {
    if (!this.isInitialized) {
      throw new Error("Decision engine not initialized with data");
    }
    
    // Group shipments by forwarder
    const forwarderMap = new Map<string, Shipment[]>();
    
    this.shipmentData.forEach(shipment => {
      const forwarder = shipment.final_quote_awarded_freight_forwader_Carrier;
      if (!forwarderMap.has(forwarder)) {
        forwarderMap.set(forwarder, []);
      }
      forwarderMap.get(forwarder)?.push(shipment);
    });
    
    // Calculate performance metrics for each forwarder
    const forwarderPerformance: ForwarderPerformance[] = Array.from(forwarderMap.entries())
      .filter(([name, _]) => name && name !== 'Hand carried' && name !== 'UNHAS') // Filter out non-forwarders
      .map(([name, shipments]) => {
        const totalShipments = shipments.length;
        
        // Calculate average transit days
        const completedShipments = shipments.filter(s => 
          s.delivery_status === 'Delivered' && s.date_of_collection && s.date_of_arrival_destination
        );
        
        const transitTimes = completedShipments.map(s => {
          const collectionDate = new Date(s.date_of_collection);
          const arrivalDate = new Date(s.date_of_arrival_destination);
          return (arrivalDate.getTime() - collectionDate.getTime()) / (1000 * 60 * 60 * 24); // days
        });
        
        const avgTransitDays = transitTimes.length > 0 
          ? transitTimes.reduce((sum, days) => sum + days, 0) / transitTimes.length 
          : 0;
        
        // Calculate on-time rate (simplified)
        const onTimeRate = completedShipments.length / Math.max(totalShipments, 1);
        
        // Calculate reliability score based on on-time rate and completed ratio
        const reliabilityScore = (onTimeRate + (completedShipments.length / Math.max(totalShipments, 1))) / 2;
        
        return {
          name,
          totalShipments,
          avgCostPerKg: this.calculateAvgCostPerKg(shipments),
          avgTransitDays,
          onTimeRate,
          reliabilityScore
        };
      });
    
    // Sort by reliability score
    return forwarderPerformance.sort((a, b) => b.reliabilityScore - a.reliabilityScore);
  }
  
  /**
   * Calculate average cost per kg for a set of shipments
   * @param shipments Array of shipments to calculate average cost for
   * @returns Average cost per kg
   */
  private calculateAvgCostPerKg(shipments: Shipment[]): number {
    const shipmentCosts = shipments.filter(s => 
      s.forwarder_quotes[s.final_quote_awarded_freight_forwader_Carrier.toLowerCase()]
    ).map(s => ({
      cost: s.forwarder_quotes[s.final_quote_awarded_freight_forwader_Carrier.toLowerCase()],
      weight: s.weight_kg
    }));
    
    if (shipmentCosts.length === 0) return 0;
    
    const totalCost = shipmentCosts.reduce((sum, item) => sum + item.cost, 0);
    const totalWeight = shipmentCosts.reduce((sum, item) => sum + item.weight, 0);
    
    return totalWeight > 0 ? totalCost / totalWeight : 0;
  }
  
  /**
   * Get top routes by volume
   * @param limit Maximum number of routes to return
   * @returns Array of route performance data
   */
  getTopRoutes(limit: number = 5): RoutePerformance[] {
    if (!this.isInitialized) {
      throw new Error("Decision engine not initialized with data");
    }
    
    // Group shipments by route
    const routeMap = new Map<string, Shipment[]>();
    
    this.shipmentData.forEach(shipment => {
      const routeKey = `${shipment.origin_country}-${shipment.destination_country}`;
      if (!routeMap.has(routeKey)) {
        routeMap.set(routeKey, []);
      }
      routeMap.get(routeKey)?.push(shipment);
    });
    
    // Calculate performance metrics for each route
    const routePerformance: RoutePerformance[] = Array.from(routeMap.entries()).map(([key, shipments]) => {
      const [origin, destination] = key.split('-');
      const totalShipments = shipments.length;
      
      // Calculate average transit days
      const completedShipments = shipments.filter(s => 
        s.delivery_status === 'Delivered' && s.date_of_collection && s.date_of_arrival_destination
      );
      
      const transitTimes = completedShipments.map(s => {
        const collectionDate = new Date(s.date_of_collection);
        const arrivalDate = new Date(s.date_of_arrival_destination);
        return (arrivalDate.getTime() - collectionDate.getTime()) / (1000 * 60 * 60 * 24); // days
      });
      
      const avgTransitDays = transitTimes.length > 0 
        ? transitTimes.reduce((sum, days) => sum + days, 0) / transitTimes.length 
        : 0;
      
      // Calculate disruption score based on delayed shipments
      const delayedShipments = completedShipments.filter(s => {
        const transitDays = transitTimes[completedShipments.indexOf(s)];
        return transitDays > avgTransitDays * 1.2; // 20% above average is considered delayed
      });
      
      const disruptionScore = totalShipments > 0 ? delayedShipments.length / totalShipments : 0;
      
      // Calculate reliability based on completed shipments ratio
      const reliabilityScore = totalShipments > 0 ? completedShipments.length / totalShipments : 0;
      
      return {
        origin,
        destination,
        avgTransitDays,
        avgCostPerKg: this.calculateAvgCostPerKg(shipments),
        disruptionScore,
        reliabilityScore,
        totalShipments
      };
    });
    
    // Sort by total shipments and return top N
    return routePerformance
      .sort((a, b) => b.totalShipments - a.totalShipments)
      .slice(0, limit);
  }
  
  /**
   * Calculate KPIs based on shipment data
   * @returns Object containing KPI metrics
   */
  getKPIs() {
    if (!this.isInitialized) {
      throw new Error("Decision engine not initialized with data");
    }
    
    // Calculate overall KPIs
    const totalShipments = this.shipmentData.length;
    const totalWeight = this.shipmentData.reduce((sum, item) => sum + item.weight_kg, 0);
    const totalVolume = this.shipmentData.reduce((sum, item) => sum + (item.volume_cbm || 0), 0);
    
    // Calculate cost metrics
    const shipmentCosts = this.shipmentData.filter(s => 
      s.forwarder_quotes[s.final_quote_awarded_freight_forwader_Carrier.toLowerCase()]
    ).map(s => ({
      cost: s.forwarder_quotes[s.final_quote_awarded_freight_forwader_Carrier.toLowerCase()],
      weight: s.weight_kg
    }));
    
    const totalCost = shipmentCosts.reduce((sum, item) => sum + item.cost, 0);
    const totalWeightWithCost = shipmentCosts.reduce((sum, item) => sum + item.weight, 0);
    const avgCostPerKg = totalWeightWithCost > 0 ? totalCost / totalWeightWithCost : 0;
    
    // Calculate time metrics
    const completedShipments = this.shipmentData.filter(s => 
      s.delivery_status === 'Delivered' && s.date_of_collection && s.date_of_arrival_destination
    );
    
    const transitTimes = completedShipments.map(s => {
      const collectionDate = new Date(s.date_of_collection);
      const arrivalDate = new Date(s.date_of_arrival_destination);
      return (arrivalDate.getTime() - collectionDate.getTime()) / (1000 * 60 * 60 * 24); // days
    });
    
    const avgTransitDays = transitTimes.length > 0 
      ? transitTimes.reduce((sum, days) => sum + days, 0) / transitTimes.length 
      : 0;
    
    // Calculate mode split
    const airShipments = this.shipmentData.filter(s => s.mode_of_shipment === 'Air').length;
    const roadShipments = this.shipmentData.filter(s => s.mode_of_shipment === 'Road').length;
    const seaShipments = this.shipmentData.filter(s => s.mode_of_shipment === 'Sea').length;
    
    return {
      totalShipments,
      totalWeight,
      totalVolume,
      avgCostPerKg,
      avgTransitDays,
      modeSplit: {
        air: totalShipments > 0 ? (airShipments / totalShipments) * 100 : 0,
        road: totalShipments > 0 ? (roadShipments / totalShipments) * 100 : 0,
        sea: totalShipments > 0 ? (seaShipments / totalShipments) * 100 : 0
      }
    };
  }
  
  /**
   * Get forwarder rankings based on criteria weights
   * @param criteria Weights for different criteria
   * @returns Array of ranked forwarders with scores
   */
  getRankedAlternatives(criteria: CriteriaWeights): Recommendation[] {
    if (!this.isInitialized) {
      throw new Error("Decision engine not initialized with data");
    }
    
    const forwarders = this.getForwarderPerformance();
    
    // Normalize weights
    const totalWeight = criteria.cost + criteria.time + criteria.reliability;
    const normalizedWeights = {
      cost: criteria.cost / totalWeight,
      time: criteria.time / totalWeight,
      reliability: criteria.reliability / totalWeight
    };
    
    // Construct decision matrix
    const decisionMatrix = forwarders.map(forwarder => {
      // Lower cost is better, so invert it for scoring
      const costScore = forwarder.avgCostPerKg > 0 
        ? 1 / forwarder.avgCostPerKg 
        : 1;
      
      // Lower transit time is better, so invert it for scoring
      const timeScore = forwarder.avgTransitDays > 0 
        ? 1 / forwarder.avgTransitDays 
        : 1;
      
      // Higher reliability is better
      const reliabilityScore = forwarder.reliabilityScore;
      
      return {
        forwarder: forwarder.name,
        criteria: {
          cost: costScore,
          time: timeScore,
          reliability: reliabilityScore
        }
      };
    });
    
    // Normalize decision matrix
    const criteriaKeys: (keyof CriteriaWeights)[] = ['cost', 'time', 'reliability'];
    const normalizedMatrix = decisionMatrix.map(alternative => {
      const normalizedCriteria: Record<string, number> = {};
      
      criteriaKeys.forEach(criterion => {
        const values = decisionMatrix.map(alt => alt.criteria[criterion]);
        const sumOfSquares = values.reduce((sum, val) => sum + val * val, 0);
        const normalizationFactor = Math.sqrt(sumOfSquares);
        
        normalizedCriteria[criterion] = normalizationFactor > 0 
          ? alternative.criteria[criterion] / normalizationFactor 
          : 0;
      });
      
      return {
        forwarder: alternative.forwarder,
        normalizedCriteria
      };
    });
    
    // Calculate weighted normalized decision matrix
    const weightedMatrix = normalizedMatrix.map(alternative => {
      const weightedCriteria: Record<string, number> = {};
      
      criteriaKeys.forEach(criterion => {
        weightedCriteria[criterion] = alternative.normalizedCriteria[criterion] * normalizedWeights[criterion];
      });
      
      return {
        forwarder: alternative.forwarder,
        weightedCriteria
      };
    });
    
    // Find ideal and negative-ideal solutions
    const idealSolution: Record<string, number> = {};
    const negativeIdealSolution: Record<string, number> = {};
    
    criteriaKeys.forEach(criterion => {
      const values = weightedMatrix.map(alt => alt.weightedCriteria[criterion]);
      idealSolution[criterion] = Math.max(...values);
      negativeIdealSolution[criterion] = Math.min(...values);
    });
    
    // Calculate separation measures
    const separationMeasures = weightedMatrix.map(alternative => {
      // Distance to ideal solution
      let idealDistance = 0;
      let negativeIdealDistance = 0;
      
      criteriaKeys.forEach(criterion => {
        const value = alternative.weightedCriteria[criterion];
        idealDistance += Math.pow(value - idealSolution[criterion], 2);
        negativeIdealDistance += Math.pow(value - negativeIdealSolution[criterion], 2);
      });
      
      idealDistance = Math.sqrt(idealDistance);
      negativeIdealDistance = Math.sqrt(negativeIdealDistance);
      
      // Calculate relative closeness to ideal solution
      const closeness = negativeIdealDistance / (idealDistance + negativeIdealDistance);
      
      return {
        forwarder: alternative.forwarder,
        idealDistance,
        negativeIdealDistance,
        closeness
      };
    });
    
    // Calculate final scores and prepare recommendations
    const rankings = forwarders.map((forwarder, index) => {
      const separationMeasure = separationMeasures.find(s => s.forwarder === forwarder.name) || {
        forwarder: forwarder.name,
        idealDistance: 0,
        negativeIdealDistance: 0,
        closeness: 0
      };
      
      // Find indices of shipments for this forwarder to provide source data
      const sourceIndices = this.shipmentData
        .map((shipment, idx) => shipment.final_quote_awarded_freight_forwader_Carrier === forwarder.name ? idx : -1)
        .filter(idx => idx !== -1);
      
      return {
        forwarder: forwarder.name,
        score: separationMeasure.closeness,
        closeness: separationMeasure.closeness,
        costPerformance: decisionMatrix[index].criteria.cost,
        timePerformance: decisionMatrix[index].criteria.time,
        reliabilityPerformance: decisionMatrix[index].criteria.reliability,
        sourceRows: sourceIndices.slice(0, 10), // Return first 10 source rows for brevity
        modelVersion: this.metadataVersion,
        computedAt: new Date().toISOString()
      };
    });
    
    return rankings.sort((a, b) => b.score - a.score);
  }
}

// Create singleton instance of the decision engine
export const decisionEngine = new DecisionEngine();
