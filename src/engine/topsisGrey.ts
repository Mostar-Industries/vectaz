/**
 * TOPSIS with Grey Relational Analysis Integration
 * 
 * Implements Technique for Order of Preference by Similarity to Ideal Solution
 * enhanced with Grey Relational Analysis for handling uncertainty in logistics decision-making.
 */

/**
 * Runs TOPSIS algorithm with Grey normalization to rank alternatives
 * @param matrix - Decision matrix with alternatives (rows) and criteria (columns)
 * @param weights - Weights for each criterion (normalized)
 * @param criteriaTypes - Array of 'benefit' or 'cost' for each criterion
 * @returns Object containing top alternative and all scores
 */
export function runTopsisWithGrey(
  matrix: number[][],
  weights: number[],
  criteriaTypes: ('benefit' | 'cost')[]
) {
  const n = matrix.length; // Number of alternatives
  const m = matrix[0].length; // Number of criteria

  // Step 1: Grey normalization of the decision matrix
  const normMatrix = greyNormalize(matrix, criteriaTypes);

  // Step 2: Calculate weighted normalized matrix
  const weightedMatrix = normMatrix.map(row =>
    row.map((val, j) => val * weights[j])
  );

  // Step 3: Determine the ideal and anti-ideal solutions
  const idealSolution = determineIdealSolution(weightedMatrix, criteriaTypes);
  const antiIdealSolution = determineAntiIdealSolution(weightedMatrix, criteriaTypes);

  // Step 4: Calculate distances to ideal and anti-ideal solutions
  const separations = calculateSeparations(weightedMatrix, idealSolution, antiIdealSolution);

  // Step 5: Calculate closeness coefficients
  const scores = separations.map(sep => sep.dNeg / (sep.dPos + sep.dNeg));

  // Step 6: Calculate Grey Relational Grades
  const greyGrades = calculateGreyRelationalGrades(normMatrix);

  // Step 7: Combine TOPSIS scores with Grey Relational Grades
  const combinedScores = scores.map((score, i) => 0.6 * score + 0.4 * greyGrades[i]);

  // Find top alternative
  const topIndex = combinedScores.indexOf(Math.max(...combinedScores));

  return {
    topAlternative: {
      index: topIndex,
      name: `Alternative ${topIndex + 1}`,
      score: combinedScores[topIndex]
    },
    allScores: combinedScores,
    rawTopsisScores: scores,
    greyGrades: greyGrades
  };
}

/**
 * Normalizes decision matrix using Grey Relational Analysis approach
 * @param matrix - Original decision matrix
 * @param criteriaTypes - Types of criteria ('benefit' or 'cost')
 * @returns Normalized decision matrix
 */
function greyNormalize(matrix: number[][], criteriaTypes: ('benefit' | 'cost')[]): number[][] {
  const m = matrix[0].length; // Number of criteria
  
  // Extract columns and find min/max values for each criterion
  const mins: number[] = [];
  const maxs: number[] = [];
  
  for (let j = 0; j < m; j++) {
    const column = matrix.map(row => row[j]);
    mins[j] = Math.min(...column);
    maxs[j] = Math.max(...column);
  }
  
  // Apply Grey normalization based on criteria type
  return matrix.map(row => 
    row.map((val, j) => {
      if (criteriaTypes[j] === 'benefit') {
        // For benefit criteria, higher values are better
        return (val - mins[j]) / (maxs[j] - mins[j]);
      } else {
        // For cost criteria, lower values are better
        return (maxs[j] - val) / (maxs[j] - mins[j]);
      }
    })
  );
}

/**
 * Determines the ideal solution for TOPSIS
 * @param weightedMatrix - Weighted normalized decision matrix
 * @param criteriaTypes - Types of criteria ('benefit' or 'cost')
 * @returns Ideal solution array
 */
function determineIdealSolution(
  weightedMatrix: number[][],
  criteriaTypes: ('benefit' | 'cost')[]
): number[] {
  const m = weightedMatrix[0].length; // Number of criteria
  const ideal: number[] = [];
  
  for (let j = 0; j < m; j++) {
    const column = weightedMatrix.map(row => row[j]);
    ideal[j] = criteriaTypes[j] === 'benefit' ? Math.max(...column) : Math.min(...column);
  }
  
  return ideal;
}

/**
 * Determines the anti-ideal solution for TOPSIS
 * @param weightedMatrix - Weighted normalized decision matrix
 * @param criteriaTypes - Types of criteria ('benefit' or 'cost')
 * @returns Anti-ideal solution array
 */
function determineAntiIdealSolution(
  weightedMatrix: number[][],
  criteriaTypes: ('benefit' | 'cost')[]
): number[] {
  const m = weightedMatrix[0].length; // Number of criteria
  const antiIdeal: number[] = [];
  
  for (let j = 0; j < m; j++) {
    const column = weightedMatrix.map(row => row[j]);
    antiIdeal[j] = criteriaTypes[j] === 'benefit' ? Math.min(...column) : Math.max(...column);
  }
  
  return antiIdeal;
}

/**
 * Calculates separation measures from ideal and anti-ideal solutions
 * @param weightedMatrix - Weighted normalized decision matrix
 * @param idealSolution - Ideal solution array
 * @param antiIdealSolution - Anti-ideal solution array
 * @returns Array of separation objects with positive and negative distances
 */
function calculateSeparations(
  weightedMatrix: number[][],
  idealSolution: number[],
  antiIdealSolution: number[]
): Array<{dPos: number, dNeg: number}> {
  return weightedMatrix.map(row => {
    // Calculate Euclidean distance to ideal solution
    const dPos = Math.sqrt(
      row.reduce((sum, val, j) => sum + Math.pow(val - idealSolution[j], 2), 0)
    );
    
    // Calculate Euclidean distance to anti-ideal solution
    const dNeg = Math.sqrt(
      row.reduce((sum, val, j) => sum + Math.pow(val - antiIdealSolution[j], 2), 0)
    );
    
    return { dPos, dNeg };
  });
}

/**
 * Calculates Grey Relational Grades for alternatives
 * @param normMatrix - Normalized decision matrix
 * @returns Array of Grey Relational Grades
 */
function calculateGreyRelationalGrades(normMatrix: number[][]): number[] {
  const n = normMatrix.length; // Number of alternatives
  const m = normMatrix[0].length; // Number of criteria
  const distinguishingCoefficient = 0.5; // Typically used value
  
  // Create reference sequence (ideal solution in Grey theory)
  const referenceSequence = Array(m).fill(0).map((_, j) => {
    // For normalized data, reference is always 1 (maximum)
    return 1;
  });
  
  // Calculate absolute differences
  const differences = normMatrix.map(row =>
    row.map((val, j) => Math.abs(val - referenceSequence[j]))
  );
  
  // Find global min and max differences
  const allDifferences = differences.flat();
  const minDifference = Math.min(...allDifferences);
  const maxDifference = Math.max(...allDifferences);
  
  // Calculate Grey Relational Coefficients
  const greyCoefficients = differences.map(row =>
    row.map(diff => 
      (minDifference + distinguishingCoefficient * maxDifference) / 
      (diff + distinguishingCoefficient * maxDifference)
    )
  );
  
  // Calculate Grey Relational Grades
  const greyGrades = greyCoefficients.map(row => 
    row.reduce((sum, val) => sum + val, 0) / m
  );
  
  return greyGrades;
}
