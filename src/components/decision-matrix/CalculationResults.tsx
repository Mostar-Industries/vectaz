import React from 'react';

type NeutrosophicJudgment = {
  truth: number;
  indeterminacy: number;
  falsity: number;
};

type CriteriaWeights = number[];
type DecisionMatrix = number[][];

interface CalculationResult {
  method: string;
  timestamp: string;
  scores: number[];
  weights?: CriteriaWeights;
  idealSolution?: number[];
  distances?: {
    positive: number[];
    negative: number[];
  };
}

interface CalculationResultProps {
  calculationResult: CalculationResult | null;
  judgments?: NeutrosophicJudgment[];
  decisionMatrix?: DecisionMatrix;
  benefitCriteria?: number[];
}

const CalculationResults: React.FC<CalculationResultProps> = ({
  calculationResult,
  judgments,
  decisionMatrix,
  benefitCriteria = []
}) => {
  if (!calculationResult) return null;

  // Neutrosophic AHP: Calculate weights from judgments
  const calculateWeights = (judgments: NeutrosophicJudgment[]): CriteriaWeights => {
    const scores = judgments.map(j => j.truth - j.falsity);
    const sum = scores.reduce((a, b) => a + b, 0);
    return scores.map(score => score / sum);
  };

  // TOPSIS: Calculate closeness coefficients
  const calculateTopsis = (matrix: DecisionMatrix, weights: CriteriaWeights, benefitIndices: number[]) => {
    // Normalize matrix
    const normalized = matrix.map(row => 
      row.map((value, colIdx) => {
        if (benefitIndices.includes(colIdx)) {
          const colMax = Math.max(...matrix.map(r => r[colIdx]));
          return value / colMax;
        } else {
          const colMin = Math.min(...matrix.map(r => r[colIdx]));
          return colMin / value;
        }
      })
    );

    // Apply weights
    const weighted = normalized.map(row => 
      row.map((value, colIdx) => value * weights[colIdx])
    );

    // Determine ideal and anti-ideal solutions
    const ideal = weighted[0].map((_, colIdx) => 
      benefitIndices.includes(colIdx) 
        ? Math.max(...weighted.map(row => row[colIdx]))
        : Math.min(...weighted.map(row => row[colIdx]))
    );

    const antiIdeal = weighted[0].map((_, colIdx) => 
      benefitIndices.includes(colIdx)
        ? Math.min(...weighted.map(row => row[colIdx]))
        : Math.max(...weighted.map(row => row[colIdx]))
    );

    // Calculate distances
    const posDistances = weighted.map(row => 
      Math.sqrt(row.reduce((sum, val, i) => sum + Math.pow(val - ideal[i], 2), 0))
    );

    const negDistances = weighted.map(row => 
      Math.sqrt(row.reduce((sum, val, i) => sum + Math.pow(val - antiIdeal[i], 2), 0))
    );

    // Calculate closeness coefficients
    const closeness = posDistances.map((dPos, i) => {
      const dNeg = negDistances[i];
      return dNeg / (dPos + dNeg);
    });

    return {
      scores: closeness,
      weights,
      idealSolution: ideal,
      distances: {
        positive: posDistances,
        negative: negDistances
      }
    };
  };

  return (
    <div className="mt-8 border rounded-md p-4">
      <h3 className="text-lg font-medium mb-2">Neutrosophic AHP-TOPSIS Results</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Method:</p>
          <p className="font-medium">{calculationResult.method || "Neutrosophic AHP-TOPSIS"}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Timestamp:</p>
          <p className="font-medium">
            {new Date(calculationResult.timestamp).toLocaleString()}
          </p>
        </div>
      </div>

      {calculationResult.weights && (
        <div className="mt-4">
          <p className="text-sm text-muted-foreground mb-2">Criteria Weights:</p>
          <div className="grid grid-cols-3 gap-2">
            {calculationResult.weights.map((weight, idx) => (
              <div key={`weight-${idx}`} className="bg-muted p-2 rounded-md">
                <span className="text-sm text-muted-foreground">Criterion {idx + 1}:</span>
                <span className="ml-2 font-medium">{weight.toFixed(4)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4">
        <p className="text-sm text-muted-foreground mb-2">Closeness Scores:</p>
        <div className="grid grid-cols-3 gap-2">
          {calculationResult.scores.map((score, idx) => (
            <div key={`score-${idx}`} className={`p-2 rounded-md ${idx === calculationResult.scores.indexOf(Math.max(...calculationResult.scores)) 
              ? 'bg-green-100 dark:bg-green-900' 
              : 'bg-muted'}`}>
              <span className="text-sm text-muted-foreground">Option {idx + 1}:</span>
              <span className="ml-2 font-medium">{score.toFixed(4)}</span>
              {idx === calculationResult.scores.indexOf(Math.max(...calculationResult.scores)) && (
                <span className="ml-2 text-green-600 dark:text-green-400 text-xs">✓ Best</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalculationResults;
export type { NeutrosophicJudgment, DecisionMatrix, CalculationResult };
