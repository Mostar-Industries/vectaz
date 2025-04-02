
import React from 'react';
import { ForwarderScore } from '../types';

interface DecisionExplanationProps {
  topResult: ForwarderScore;
  source: string;
  destination: string;
  weightFactors: {
    cost: number;
    time: number;
    reliability: number;
  };
}

const DecisionExplanation: React.FC<DecisionExplanationProps> = ({ 
  topResult, 
  source, 
  destination, 
  weightFactors 
}) => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-4 text-[#00FFD1]">Decision Explanation</h3>
      <div className="p-4 bg-[#0A1A2F]/60 border border-[#00FFD1]/10 rounded-lg text-sm space-y-3 text-gray-300">
        <p>
          <strong className="text-white">{topResult?.forwarder}</strong> is recommended as the optimal choice for your shipment based on a comprehensive analysis that considers cost, time efficiency, and reliability factors.
        </p>
        <p>
          This forwarder demonstrates excellent {topResult?.reliabilityPerformance > 0.8 ? "reliability" : "cost-effectiveness"} on the {source}-{destination} route, with historical data showing consistently strong performance across similar shipments.
        </p>
        <p>
          Your preference weight of {Math.round(weightFactors.cost * 100)}% for cost, {Math.round(weightFactors.time * 100)}% for time, and {Math.round(weightFactors.reliability * 100)}% for reliability was applied to the calculation.
        </p>
      </div>
    </div>
  );
};

export default DecisionExplanation;
