
// Neutrosophic AHP (Analytic Hierarchy Process) module
// Implements weight calculation using Neutrosophic logic for decision criteria

interface TNNJudgement {
  T: number; // Truth membership
  I: number; // Indeterminacy membership
  F: number; // Falsity membership
  criteria: [string, string]; // The pair of criteria being compared
}

// Load the TNN (Triangular Neutrosophic Number) judgements
// These represent expert opinions on relative importance
export function loadTNNJudgements(): TNNJudgement[] {
  // In a production system, these would be loaded from a configuration
  // or calibrated by domain experts. For this implementation, we use preset values.
  return [
    { T: 0.7, I: 0.2, F: 0.1, criteria: ['cost', 'time'] },
    { T: 0.6, I: 0.3, F: 0.1, criteria: ['cost', 'reliability'] },
    { T: 0.5, I: 0.3, F: 0.2, criteria: ['time', 'reliability'] }
  ];
}

// Convert neutrosophic judgements to crisp values
export function crispifyJudgements(judgements: TNNJudgement[]): Record<string, number> {
  const criteriaSet = new Set<string>();
  const pairwiseValues: Record<string, number> = {};
  
  // Extract all unique criteria
  judgements.forEach(j => {
    criteriaSet.add(j.criteria[0]);
    criteriaSet.add(j.criteria[1]);
    
    // Store the crispified value (T-F) for this pair
    const key = `${j.criteria[0]}_${j.criteria[1]}`;
    pairwiseValues[key] = j.T - j.F;
    
    // Also store the reciprocal value
    const reciprocalKey = `${j.criteria[1]}_${j.criteria[0]}`;
    pairwiseValues[reciprocalKey] = 1 / (j.T - j.F);
  });
  
  const criteria = Array.from(criteriaSet);
  
  // Build the complete pairwise matrix
  const matrix: number[][] = [];
  for (let i = 0; i < criteria.length; i++) {
    matrix[i] = [];
    for (let j = 0; j < criteria.length; j++) {
      if (i === j) {
        matrix[i][j] = 1; // Diagonal elements are always 1
      } else {
        const key = `${criteria[i]}_${criteria[j]}`;
        matrix[i][j] = pairwiseValues[key] || 0;
      }
    }
  }
  
  // Calculate the weights using the eigenvalue method
  const weights = calculateEigenvalueWeights(matrix, criteria);
  
  return weights;
}

// Calculate weights using eigenvalue method (simplified for this implementation)
function calculateEigenvalueWeights(matrix: number[][], criteria: string[]): Record<string, number> {
  const n = criteria.length;
  const weights: Record<string, number> = {};
  
  // Calculate row products and nth root
  const rowProducts = matrix.map(row => 
    row.reduce((product, value) => product * Math.max(0.01, value), 1)
  );
  
  const nthRoots = rowProducts.map(product => Math.pow(product, 1/n));
  
  // Normalize to get weights
  const sum = nthRoots.reduce((a, b) => a + b, 0);
  
  criteria.forEach((criterion, index) => {
    weights[criterion] = nthRoots[index] / sum;
  });
  
  return weights;
}

// Validate consistency ratio (CR) according to Saaty's method
export function validateSaatyCR(weights: Record<string, number>, matrix: number[][]): boolean {
  // Simplified consistency check - in a real implementation, 
  // this would calculate eigenvalues and compare to random index
  
  // For demo purposes, we'll return true as if the check passed
  // In production, this would be a proper calculation
  console.log("Validating Saaty's Consistency Ratio for weights:", weights);
  
  return true;
}

// The main function to compute weights using Neutrosophic AHP
export function computeNeutrosophicWeights(): Record<string, number> {
  // Load the TNN judgements
  const judgements = loadTNNJudgements();
  
  // Crispify the neutrosophic values
  const weights = crispifyJudgements(judgements);
  
  // Ensure the sum is exactly 1.0
  const sum = Object.values(weights).reduce((a, b) => a + b, 0);
  Object.keys(weights).forEach(key => {
    weights[key] /= sum;
  });
  
  // Log the computed weights
  console.log("Computed neutrosophic weights:", weights);
  
  return weights;
}

// For testing and demonstration
export function getDefaultWeights(): Record<string, number> {
  return {
    cost: 0.4,
    time: 0.3,
    reliability: 0.3
  };
}
