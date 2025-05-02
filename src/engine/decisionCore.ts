/**
 * DeepCAL Decision Core
 * 
 * Integrated Neutrosophic-Grey AHP-TOPSIS decision engine for DeepCAL
 * Combines multi-criteria decision making with uncertainty handling
 * through neutrosophic sets and grey relational analysis.
 */

import { MoScript, DecisionRequest, DecisionResult } from './types';
import { computeNeutrosophicWeights, checkNCR } from './ahpEngine';
import { runTopsisWithGrey } from './topsisGrey';

/**
 * Core decision engine MoScript for freight forwarding optimization
 */
export const decisionCore: MoScript = {
  id: 'deepcal-ng-ahp-topsis',
  trigger: 'onDecisionRequest',
  
  /**
   * Main decision logic implementation
   * @param data Decision request data containing matrices and criteria types
   * @returns Decision result with rankings and scores
   */
  logic: (data: DecisionRequest): DecisionResult => {
    const startTime = performance.now();
    
    // Extract inputs
    const { decisionMatrix, pairwiseMatrix, criteriaTypes, alternativeNames = [] } = data;
    
    // Validate inputs
    if (!decisionMatrix || !pairwiseMatrix || !criteriaTypes) {
      throw new Error('Missing required decision inputs');
    }
    
    if (decisionMatrix[0].length !== criteriaTypes.length) {
      throw new Error('Criteria count mismatch between decision matrix and criteria types');
    }
    
    if (!validateMatrix(pairwiseMatrix)) {
      const errors = [];
      // Detailed error checks...
      throw new Error(`Invalid matrix:\n${errors.join('\n')}`);
    }
    
    // Check AHP consistency (Neutrosophic Consistency Ratio)
    const consistencyCheck = checkNCR(pairwiseMatrix);
    if (!consistencyCheck) {
      console.warn('AHP consistency check failed - results may be unreliable');
    }
    
    // Compute criteria weights using Neutrosophic AHP
    const weights = computeNeutrosophicWeights(pairwiseMatrix);
    
    // Run TOPSIS with Grey Relational Analysis
    const result = runTopsisWithGrey(decisionMatrix, weights, criteriaTypes);
    
    // Enrich result with alternative names if provided
    if (alternativeNames.length > 0) {
      result.topAlternative.name = alternativeNames[result.topAlternative.index] || 
                                   `Alternative ${result.topAlternative.index + 1}`;
    }
    
    // Add performance metrics
    const executionTime = performance.now() - startTime;
    
    return {
      ...result,
      executionTime,
      consistencyRatio: consistencyCheck ? 0.05 : 0.15 // Approximation for logging
    };
  },
  
  /**
   * Voice synthesis line for decision results
   * @param result Decision result to vocalize
   * @returns Human-friendly explanation of the decision
   */
  voiceLine: (result: DecisionResult): string => {
    const { topAlternative, allScores } = result;
    const confidenceLevel = topAlternative.score > 0.8 ? 'high' : 
                           topAlternative.score > 0.6 ? 'moderate' : 'cautious';
    
    return `Based on neutrosophic-grey analysis, ${topAlternative.name} emerges as the optimal choice with a ${confidenceLevel} confidence score of ${topAlternative.score.toFixed(2)}. This decision accounts for both performance and uncertainty factors in the evaluation data.`;
  }
} as MoScript;


/**
 * Evaluates freight forwarders based on provided criteria
 * @param forwarders Array of forwarder data objects
 * @param criteria Object containing weights for each criterion
 * @returns Ranked list of forwarders with scores
 */
export function evaluateForwarders(
  forwarders: any[],
  criteria: { [key: string]: number }
): any[] {
  // Map criteria weights to array format
  const criteriaNames = Object.keys(criteria);
  const criteriaWeights = criteriaNames.map(name => criteria[name]);
  const normalizedWeights = normalizeWeights(criteriaWeights);
  
  // Prepare decision matrix
  const decisionMatrix = forwarders.map(forwarder => 
    criteriaNames.map(criterion => forwarder[criterion] || 0)
  );
  
  // All criteria are considered 'benefit' except cost (higher is better)
  const criteriaTypes = criteriaNames.map(name => 
    name.toLowerCase().includes('cost') ? 'cost' : 'benefit'
  );
  
  // Run TOPSIS analysis
  const result = runTopsisWithGrey(decisionMatrix, normalizedWeights, criteriaTypes);
  
  // Return enriched forwarder data with scores
  return forwarders.map((forwarder, index) => ({
    ...forwarder,
    score: result.allScores[index],
    rank: result.allScores.map((s, i) => ({ score: s, index: i }))
            .sort((a, b) => b.score - a.score)
            .findIndex(item => item.index === index) + 1
  })).sort((a, b) => b.score - a.score);
}

/**
 * Normalizes an array of weights to sum to 1
 * @param weights Array of weight values
 * @returns Normalized weights array
 */
function normalizeWeights(weights: number[]): number[] {
  const sum = weights.reduce((acc, weight) => acc + weight, 0);
  return weights.map(weight => weight / sum);
}

/**
 * Generates a pairwise comparison matrix from criteria weights
 * @param weights Object with criteria names and weights
 * @returns Pairwise comparison matrix
 */
export function generatePairwiseMatrix(weights: { [key: string]: number }): number[][] {
  const criteriaNames = Object.keys(weights);
  const n = criteriaNames.length;
  
  // Initialize matrix with 1s on diagonal
  const matrix = Array.from({ length: n }, () => Array(n).fill(1));
  
  // Fill in comparison values
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i !== j) {
        const ratio = weights[criteriaNames[i]] / weights[criteriaNames[j]];
        matrix[i][j] = ratio;
      }
    }
  }
  
  return matrix;
}

export default {
  decisionCore,
  evaluateForwarders,
  generatePairwiseMatrix
};

/**
 * Validates the structure and content of a pairwise comparison matrix
 * @param matrix The pairwise comparison matrix to validate
 * @returns True if the matrix is valid, false otherwise
 */
function validateMatrix(matrix: number[][]): boolean {
  if (!Array.isArray(matrix) || matrix.length === 0) return false;
  const n = matrix.length;
  if (!matrix.every(row => Array.isArray(row) && row.length === n)) return false;
  
  // Check for positive values and 1s on the diagonal
  for (let i = 0; i < n; i++) {
    if (matrix[i][i] !== 1) return false;
    for (let j = 0; j < n; j++) {
      if (matrix[i][j] <= 0) return false;
    }
  }
  return true;
}
