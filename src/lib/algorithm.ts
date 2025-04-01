
/**
 * DeepCAL Core Algorithm Implementation
 * TOPSIS (Technique for Order of Preference by Similarity to Ideal Solution)
 * Combined with AHP (Analytic Hierarchy Process) for weight determination
 * 
 * This file serves as the brainstem of the DeepCAL application and should not be removed or refactored.
 */

import { Shipment, ForwarderPerformance } from "@/types/deeptrack";

// Interface for criteria weights
export interface CriteriaWeights {
  cost: number;
  time: number;
  reliability: number;
}

// Interface for decision matrix alternatives
export interface Alternative {
  forwarder: string;
  cost: number;
  time: number;
  reliability: number;
  sourceRows: string[];
  [key: string]: any;
}

// Interface for ranked alternatives
export interface RankedAlternative {
  forwarder: string;
  score: number;
  closeness: number;
  costPerformance: number;
  timePerformance: number;
  reliabilityPerformance: number;
  sourceRows?: number[];
  modelVersion?: string;
  computedAt?: string;
}

/**
 * Normalize the decision matrix
 * @param matrix The decision matrix
 * @returns Normalized decision matrix
 */
export function normalize(matrix: Alternative[]): Alternative[] {
  const criteria = ['cost', 'time', 'reliability'];
  
  // Calculate the square root of the sum of squares for each criterion
  const denominators: Record<string, number> = {};
  
  criteria.forEach(criterion => {
    const sumOfSquares = matrix.reduce((sum, alt) => sum + Math.pow(alt[criterion], 2), 0);
    denominators[criterion] = Math.sqrt(sumOfSquares);
  });
  
  // Normalize each value
  return matrix.map(alt => {
    const normalized = { ...alt };
    
    criteria.forEach(criterion => {
      normalized[criterion] = denominators[criterion] !== 0 
        ? alt[criterion] / denominators[criterion] 
        : 0;
    });
    
    return normalized;
  });
}

/**
 * Apply weights to the normalized matrix
 * @param normalizedMatrix The normalized decision matrix
 * @param weights The criteria weights
 * @returns Weighted normalized decision matrix
 */
export function applyWeights(
  normalizedMatrix: Alternative[], 
  weights: CriteriaWeights
): Alternative[] {
  const criteria = Object.keys(weights) as Array<keyof CriteriaWeights>;
  
  return normalizedMatrix.map(alt => {
    const weighted = { ...alt };
    
    criteria.forEach(criterion => {
      weighted[criterion] = alt[criterion] * weights[criterion];
    });
    
    return weighted;
  });
}

/**
 * Get the ideal solution
 * @param weightedMatrix The weighted normalized decision matrix
 * @returns The ideal solution
 */
export function getIdealSolution(weightedMatrix: Alternative[]): Record<string, number> {
  const ideal: Record<string, number> = {};
  
  // Cost is a cost criterion (minimum is better)
  ideal.cost = Math.min(...weightedMatrix.map(alt => alt.cost));
  
  // Time is a cost criterion (minimum is better)
  ideal.time = Math.min(...weightedMatrix.map(alt => alt.time));
  
  // Reliability is a benefit criterion (maximum is better)
  ideal.reliability = Math.max(...weightedMatrix.map(alt => alt.reliability));
  
  return ideal;
}

/**
 * Get the anti-ideal solution
 * @param weightedMatrix The weighted normalized decision matrix
 * @returns The anti-ideal solution
 */
export function getAntiIdealSolution(weightedMatrix: Alternative[]): Record<string, number> {
  const antiIdeal: Record<string, number> = {};
  
  // Cost is a cost criterion (maximum is worse)
  antiIdeal.cost = Math.max(...weightedMatrix.map(alt => alt.cost));
  
  // Time is a cost criterion (maximum is worse)
  antiIdeal.time = Math.max(...weightedMatrix.map(alt => alt.time));
  
  // Reliability is a benefit criterion (minimum is worse)
  antiIdeal.reliability = Math.min(...weightedMatrix.map(alt => alt.reliability));
  
  return antiIdeal;
}

/**
 * Calculate Euclidean distance between two points
 * @param point1 First point
 * @param point2 Second point
 * @returns Euclidean distance
 */
export function euclideanDistance(
  point1: Record<string, any>, 
  point2: Record<string, number>
): number {
  let sumOfSquares = 0;
  
  Object.keys(point2).forEach(key => {
    sumOfSquares += Math.pow((point1[key] - point2[key]), 2);
  });
  
  return Math.sqrt(sumOfSquares);
}

/**
 * Apply the TOPSIS method to rank alternatives
 * @param matrix The decision matrix
 * @param weights The criteria weights
 * @returns Ranked alternatives
 */
export function applyTOPSIS(
  matrix: Alternative[], 
  weights: CriteriaWeights
): RankedAlternative[] {
  // Normalize the decision matrix
  const normalizedMatrix = normalize(matrix);
  
  // Apply weights to get the weighted normalized matrix
  const weightedMatrix = applyWeights(normalizedMatrix, weights);
  
  // Get ideal and anti-ideal solutions
  const ideal = getIdealSolution(weightedMatrix);
  const antiIdeal = getAntiIdealSolution(weightedMatrix);
  
  // Calculate distances and closeness coefficients
  const results = weightedMatrix.map(alt => {
    const dPlus = euclideanDistance(alt, ideal);
    const dMinus = euclideanDistance(alt, antiIdeal);
    const closeness = dMinus / (dPlus + dMinus);
    
    return {
      forwarder: alt.forwarder,
      score: closeness,
      closeness: closeness,
      costPerformance: alt.cost,
      timePerformance: alt.time,
      reliabilityPerformance: alt.reliability,
      sourceRows: alt.sourceRows ? alt.sourceRows.map(Number) : [],
      modelVersion: "v1.0.0-neutrosophic",
      computedAt: new Date().toISOString()
    };
  });
  
  // Sort by closeness coefficient (descending)
  return results.sort((a, b) => b.closeness - a.closeness);
}

/**
 * Build a decision matrix from forwarder performance data
 * @param forwarderPerformance The forwarder performance data
 * @returns Decision matrix
 */
export function buildDecisionMatrix(forwarderPerformance: ForwarderPerformance[]): Alternative[] {
  return forwarderPerformance.map(fp => ({
    forwarder: fp.name,
    // For cost and time, we invert values since lower is better
    cost: fp.avgCostPerKg > 0 ? 1 / fp.avgCostPerKg : 1,
    time: fp.avgTransitDays > 0 ? 1 / fp.avgTransitDays : 1,
    reliability: fp.reliabilityScore, // Higher is better
    sourceRows: [fp.name.toLowerCase().replace(/\s+/g, '_')]
  }));
}

/**
 * Get the default weights if not specified
 * @returns Default criteria weights
 */
export function getDefaultWeights(): CriteriaWeights {
  return {
    cost: 0.4,
    time: 0.3,
    reliability: 0.3
  };
}

/**
 * Compute forwarder rankings based on shipment data
 * @param shipments The shipment data
 * @param weights The criteria weights (optional)
 * @returns Ranked forwarders
 */
export function computeForwarderRankings(
  shipments: Shipment[],
  weights?: CriteriaWeights
): RankedAlternative[] {
  if (!shipments || shipments.length === 0) {
    console.error("Cannot compute rankings without shipment data");
    return [];
  }
  
  // Use provided weights or default weights
  const criteriaWeights = weights || getDefaultWeights();
  
  // Group shipments by forwarder
  const forwarderMap = new Map<string, Shipment[]>();
  
  shipments.forEach(shipment => {
    const forwarder = shipment.final_quote_awarded_freight_forwader_Carrier;
    if (!forwarderMap.has(forwarder)) {
      forwarderMap.set(forwarder, []);
    }
    forwarderMap.get(forwarder)?.push(shipment);
  });
  
  // Calculate performance metrics for each forwarder
  const forwarderPerformance: ForwarderPerformance[] = Array.from(forwarderMap.entries())
    .filter(([name, _]) => name && name !== 'Hand carried' && name !== 'UNHAS')
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
      
      // Calculate on-time rate
      const onTimeRate = completedShipments.length / Math.max(totalShipments, 1);
      
      // Calculate reliability score
      const reliabilityScore = (onTimeRate + (completedShipments.length / Math.max(totalShipments, 1))) / 2;
      
      // Calculate avg cost per kg
      const shipmentCosts = shipments.filter(s => 
        s.forwarder_quotes[name.toLowerCase()]
      ).map(s => ({
        cost: s.forwarder_quotes[name.toLowerCase()],
        weight: s.weight_kg
      }));
      
      const totalCost = shipmentCosts.reduce((sum, item) => sum + item.cost, 0);
      const totalWeight = shipmentCosts.reduce((sum, item) => sum + item.weight, 0);
      
      const avgCostPerKg = totalWeight > 0 ? totalCost / totalWeight : 0;
      
      return {
        name,
        totalShipments,
        avgCostPerKg,
        avgTransitDays,
        onTimeRate,
        reliabilityScore
      };
    });
  
  // Build the decision matrix
  const decisionMatrix = buildDecisionMatrix(forwarderPerformance);
  
  // Apply TOPSIS to generate rankings
  return applyTOPSIS(decisionMatrix, criteriaWeights);
}

export default {
  applyTOPSIS,
  normalize,
  applyWeights,
  getIdealSolution,
  getAntiIdealSolution,
  euclideanDistance,
  buildDecisionMatrix,
  getDefaultWeights,
  computeForwarderRankings
};
