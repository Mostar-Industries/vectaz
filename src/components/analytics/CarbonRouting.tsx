import React from 'react';
import { Shipment } from '@/types/deeptrack';

type RouteComparison = {
  traditional: number;
  optimized: number;
  savings: number;
};

export const CarbonRouting = ({ shipments }: { shipments: Shipment[] }) => {
  // Calculate carbon savings (mock data - replace with real calculation)
  const carbonData: RouteComparison = {
    traditional: shipments.reduce((sum, s) => sum + ((s.distance_km || 0) * 0.21), 0), // 0.21kg CO2/km
    optimized: shipments.reduce((sum, s) => sum + ((s.distance_km || 0) * 0.15), 0), // 0.15kg CO2/km
    savings: shipments.reduce((sum, s) => sum + ((s.distance_km || 0) * 0.21), 0) - shipments.reduce((sum, s) => sum + ((s.distance_km || 0) * 0.15), 0)
  };

  return (
    <div className="bg-gray-900 p-4 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Carbon-Aware Routing</h2>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-800 p-4 rounded">
          <div className="text-sm text-gray-400">Traditional Routing</div>
          <div className="text-2xl font-bold">{carbonData.traditional.toFixed(0)} kg CO₂</div>
        </div>
        <div className="bg-green-900 p-4 rounded">
          <div className="text-sm text-gray-300">Optimized Routing</div>
          <div className="text-2xl font-bold">{carbonData.optimized.toFixed(0)} kg CO₂</div>
        </div>
        <div className="bg-blue-900 p-4 rounded">
          <div className="text-sm text-gray-300">Total Savings</div>
          <div className="text-2xl font-bold">{carbonData.savings.toFixed(0)} kg CO₂</div>
        </div>
      </div>
    </div>
  );
};
