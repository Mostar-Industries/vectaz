
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MethodologyExplanationProps {
  weightFactors: {
    cost: number;
    time: number;
    reliability: number;
  };
  shipmentCount: number;
}

const MethodologyExplanation: React.FC<MethodologyExplanationProps> = ({ 
  weightFactors, 
  shipmentCount 
}) => {
  return (
    <Card className="bg-[#0A1A2F]/70 border border-[#00FFD1]/20">
      <CardHeader>
        <CardTitle className="text-lg text-[#00FFD1]">Applied Methodology</CardTitle>
      </CardHeader>
      <CardContent className="text-sm space-y-4 text-gray-300">
        <div>
          <h4 className="font-medium text-white">Neutrosophic AHP-TOPSIS</h4>
          <p className="mt-1">
            DeepCAL™ uses a hybrid Neutrosophic AHP-TOPSIS methodology that combines multi-criteria decision-making with neutrosophic logic to handle uncertainty and subjectivity.
          </p>
        </div>
        
        <div>
          <h4 className="font-medium text-white">Weight Derivation</h4>
          <p className="mt-1">
            Your preference weights were processed through a pairwise comparison matrix to derive consistent priority weights: Cost ({Math.round(weightFactors.cost * 100)}%), Time ({Math.round(weightFactors.time * 100)}%), Reliability ({Math.round(weightFactors.reliability * 100)}%).
          </p>
        </div>
        
        <div>
          <h4 className="font-medium text-white">Historical Performance Analysis</h4>
          <p className="mt-1">
            Deep engine analyzed {shipmentCount} historical shipments to evaluate forwarder performance patterns in similar contexts to your current shipment.
          </p>
        </div>
        
        <div>
          <h4 className="font-medium text-white">Forwarder Score Calculation</h4>
          <p className="mt-1">
            DeepScore™ represents the closeness coefficient to the ideal solution, with higher values indicating better overall performance across all weighted criteria.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MethodologyExplanation;
