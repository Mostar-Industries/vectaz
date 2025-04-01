
import React from 'react';

interface CalculationResultProps {
  calculationResult: {
    method: string;
    timestamp: string;
    scores: number[];
  } | null;
}

const CalculationResults: React.FC<CalculationResultProps> = ({ calculationResult }) => {
  if (!calculationResult) return null;

  return (
    <div className="mt-8 border rounded-md p-4">
      <h3 className="text-lg font-medium mb-2">Calculation Results</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Method:</p>
          <p className="font-medium">{calculationResult.method || "Standard"}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Timestamp:</p>
          <p className="font-medium">
            {new Date(calculationResult.timestamp).toLocaleString()}
          </p>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-sm text-muted-foreground mb-2">Scores:</p>
        <div className="grid grid-cols-3 gap-2">
          {calculationResult.scores && calculationResult.scores.map((score: number, idx: number) => (
            <div key={`score-${idx}`} className="bg-muted p-2 rounded-md">
              <span className="text-sm text-muted-foreground">Item {idx + 1}:</span>
              <span className="ml-2 font-medium">{score.toFixed(4)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalculationResults;
