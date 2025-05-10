/**
 * @deprecated TOPSIS functionality has been consolidated into DecisionCore.ts
 * Please use the unified optimization engine instead:
 * import { DecisionCore } from '@/core/DecisionCore';
 * 
 * The new implementation includes enhanced:
 * - Weight normalization
 * - Multi-criteria analysis
 * - Quantum optimization integration
 */

// TOPSIS (Technique for Order of Preference by Similarity to Ideal Solution) Engine
// Implements the core decision-making algorithm using TOPSIS methodology

interface Alternative {
  forwarder: string;
  cost: number;
  time: number;
  reliability: number;
  [key: string]: any;
}

interface NormalizedAlternative extends Alternative {
  sourceRows: string[];
}

interface RankedAlternative {
  forwarder: string;
  Ci: number;
  sourceRows: string[];
  [key: string]: any;
}

// Normalize the decision matrix
export function normalize(matrix: Alternative[]): NormalizedAlternative[] {
  const criteria = ['cost', 'time', 'reliability'];
  
  // Calculate the square root of the sum of squares for each criterion
  const denominators: Record<string, number> = {};
  
  criteria.forEach(criterion => {
    const sumOfSquares = matrix.reduce((sum, alt) => sum + Math.pow(alt[criterion], 2), 0);
    denominators[criterion] = Math.sqrt(sumOfSquares);
  });
  
  // Normalize each value
  return matrix.map(alt => {
    const normalized: any = {
      forwarder: alt.forwarder,
      sourceRows: alt.sourceRows || []
    };
    
    criteria.forEach(criterion => {
      normalized[criterion] = denominators[criterion] !== 0 
        ? alt[criterion] / denominators[criterion] 
        : 0;
    });
    
    return normalized as NormalizedAlternative;
  });
}

// Apply weights to the normalized matrix
export function applyWeights(
  normalizedMatrix: NormalizedAlternative[], 
  weights: Record<string, number>
): NormalizedAlternative[] {
  const criteria = Object.keys(weights);
  
  return normalizedMatrix.map(alt => {
    const weighted = { ...alt };
    
    criteria.forEach(criterion => {
      weighted[criterion] *= weights[criterion];
    });
    
    return weighted;
  });
}

// Get the ideal solution (maximum for benefit criteria, minimum for cost criteria)
export function getIdealSolution(weightedMatrix: NormalizedAlternative[]): Record<string, number> {
  const ideal: Record<string, number> = {};
  
  // Cost is a cost criterion (minimum is better)
  ideal.cost = Math.min(...weightedMatrix.map(alt => alt.cost));
  
  // Time is a cost criterion (minimum is better)
  ideal.time = Math.min(...weightedMatrix.map(alt => alt.time));
  
  // Reliability is a benefit criterion (maximum is better)
  ideal.reliability = Math.max(...weightedMatrix.map(alt => alt.reliability));
  
  return ideal;
}

// Get the anti-ideal solution (minimum for benefit criteria, maximum for cost criteria)
export function getAntiIdealSolution(weightedMatrix: NormalizedAlternative[]): Record<string, number> {
  const antiIdeal: Record<string, number> = {};
  
  // Cost is a cost criterion (maximum is worse)
  antiIdeal.cost = Math.max(...weightedMatrix.map(alt => alt.cost));
  
  // Time is a cost criterion (maximum is worse)
  antiIdeal.time = Math.max(...weightedMatrix.map(alt => alt.time));
  
  // Reliability is a benefit criterion (minimum is worse)
  antiIdeal.reliability = Math.min(...weightedMatrix.map(alt => alt.reliability));
  
  return antiIdeal;
}

// Calculate Euclidean distance between two points
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

// Apply the TOPSIS method to rank alternatives
export function applyTOPSIS(
  matrix: Alternative[], 
  weights: Record<string, number>
): RankedAlternative[] {
  // Normalize the decision matrix
  const normalizedMatrix = normalize(matrix);
  
  // Apply weights to get the weighted normalized matrix
  const weightedMatrix = applyWeights(normalizedMatrix, weights);
  
  // Get ideal and anti-ideal solutions
  const ideal = getIdealSolution(weightedMatrix);
  const antiIdeal = getAntiIdealSolution(weightedMatrix);
  
  // Calculate distances and closeness coefficients
  const results = weightedMatrix.map(row => {
    const dPlus = euclideanDistance(row, ideal);
    const dMinus = euclideanDistance(row, antiIdeal);
    const Ci = dMinus / (dPlus + dMinus);
    
    return {
      forwarder: row.forwarder,
      Ci,
      sourceRows: row.sourceRows,
      dPlus,
      dMinus
    };
  });
  
  // Sort by closeness coefficient (descending)
  return results.sort((a, b) => b.Ci - a.Ci);
}

// Build a decision matrix from forwarder performance data
export function buildDecisionMatrix(forwarderPerformance: any[]): Alternative[] {
  return forwarderPerformance.map(fp => ({
    forwarder: fp.name,
    // Normalize so that higher is always better for TOPSIS
    cost: 1 - fp.costScore, // Inverse, since lower cost is better
    time: 1 - fp.timeScore, // Inverse, since lower time is better
    reliability: fp.reliabilityScore, // Already normalized with higher being better
    sourceRows: [fp.id] // Source identifier for auditing
  }));
}
