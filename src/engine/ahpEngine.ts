/**
 * Neutrosophic Analytic Hierarchy Process (AHP) Engine
 * 
 * Implements advanced neutrosophic-based weight calculation for
 * multi-criteria decision making with uncertainty considerations.
 */

/**
 * Computes criteria weights using Neutrosophic AHP methodology
 * @param pairwise - Matrix of pairwise comparisons between criteria
 * @returns Array of normalized weights for each criterion
 */
export function computeNeutrosophicWeights(pairwise: number[][]): number[] {
  const n = pairwise.length;
  const colSum = Array(n).fill(0);
  const normalized = Array.from({ length: n }, () => Array(n).fill(0));

  // Step 1: Calculate column sums for normalization
  for (let j = 0; j < n; j++) {
    for (let i = 0; i < n; i++) {
      colSum[j] += pairwise[i][j];
    }
  }

  // Step 2: Normalize the pairwise matrix
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      normalized[i][j] = pairwise[i][j] / colSum[j];
    }
  }

  // Step 3: Calculate weights (eigenvector) by row averaging
  const weights = normalized.map(row => 
    row.reduce((sum, val) => sum + val, 0) / n
  );

  return weights;
}

/**
 * Checks the Neutrosophic Consistency Ratio (NCR) to ensure reliable judgments
 * @param pairwise - Matrix of pairwise comparisons
 * @param threshold - Maximum acceptable NCR value (default: 0.1)
 * @returns Boolean indicating if the matrix is consistent
 */
export function checkNCR(pairwise: number[][], threshold = 0.1): boolean {
  const n = pairwise.length;
  const weights = computeNeutrosophicWeights(pairwise);

  // Calculate lambda max (principal eigenvalue)
  const weightedSum = pairwise.map(row => 
    row.map((val, j) => val * weights[j])
      .reduce((sum, val) => sum + val, 0)
  );
  
  const lambdaValues = weightedSum.map((sum, i) => sum / weights[i]);
  const lambdaMax = lambdaValues.reduce((sum, val) => sum + val, 0) / n;

  // Calculate Consistency Index
  const CI = (lambdaMax - n) / (n - 1);
  
  // Random Consistency Index values (from Saaty's research)
  const RI = [0, 0, 0.58, 0.90, 1.12, 1.24, 1.32, 1.41, 1.45, 1.49];
  
  // Use appropriate RI or fallback to 1.5 for matrices larger than 10x10
  const randomIndex = (n <= 10) ? RI[n-1] : 1.5;
  
  // Calculate Consistency Ratio
  const CR = CI / randomIndex;

  return CR < threshold;
}

/**
 * Calculates triangular neutrosophic numbers for measuring uncertainty
 * @param mean - Central tendency value
 * @param uncertainty - Degree of uncertainty (0-1)
 * @returns Triangular neutrosophic representation
 */
export function calculateTNN(mean: number, uncertainty: number = 0.1) {
  const spread = mean * uncertainty;
  return {
    truthMembership: {
      lower: Math.max(0, mean - spread),
      middle: mean,
      upper: Math.min(1, mean + spread)
    },
    indeterminacyMembership: uncertainty,
    falsityMembership: 1 - (mean * (1 - uncertainty))
  };
}

/**
 * Converts neutrosophic weights to crisp weights with uncertainty consideration
 * @param neutrosophicWeights - Array of neutrosophic weight objects
 * @returns Array of crisp weights adjusted for uncertainty
 */
export function defuzzifyWeights(neutrosophicWeights: any[]): number[] {
  return neutrosophicWeights.map(nw => {
    const truthCenter = nw.truthMembership.middle;
    const certainty = 1 - nw.indeterminacyMembership;
    return truthCenter * certainty;
  });
}
