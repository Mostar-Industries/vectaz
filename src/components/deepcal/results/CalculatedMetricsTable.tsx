
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ForwarderScore } from '../types';

interface CalculatedMetricsTableProps {
  results: ForwarderScore[];
}

const CalculatedMetricsTable: React.FC<CalculatedMetricsTableProps> = ({ results }) => {
  return (
    <Card className="bg-[#0A1A2F]/70 border border-[#00FFD1]/20">
      <CardHeader>
        <CardTitle className="text-lg text-[#00FFD1]">Calculated Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <table className="w-full border-collapse text-gray-300">
          <thead>
            <tr className="border-b border-[#00FFD1]/20">
              <th className="text-left py-2">Forwarder</th>
              <th className="text-left py-2">DeepScore™</th>
              <th className="text-left py-2">Cost</th>
              <th className="text-left py-2">Time</th>
              <th className="text-left py-2">Reliability</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result, index) => (
              <tr key={index} className="border-b border-[#00FFD1]/10 hover:bg-[#00FFD1]/5">
                <td className="py-2 font-medium text-white">{result.forwarder}</td>
                <td className="py-2">{(result.score * 100).toFixed(1)}%</td>
                <td className="py-2">{(result.costPerformance * 100).toFixed(1)}%</td>
                <td className="py-2">{(result.timePerformance * 100).toFixed(1)}%</td>
                <td className="py-2">{(result.reliabilityPerformance * 100).toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
};

export default CalculatedMetricsTable;
