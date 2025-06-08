import React from 'react';
import { GlassContainer } from '@/components/ui/glass-effects';

export default function TrendsTab({ data }) {
  // Sample trend data - in a real implementation this would come from time-series analysis of shipping data
  const monthlyTrends = [
    { month: 'Jan', shipments: 78, avgCost: 4.2, onTimeRate: 92 },
    { month: 'Feb', shipments: 84, avgCost: 4.1, onTimeRate: 93 },
    { month: 'Mar', shipments: 92, avgCost: 3.9, onTimeRate: 94 },
    { month: 'Apr', shipments: 105, avgCost: 3.8, onTimeRate: 95 },
    { month: 'May', shipments: 118, avgCost: 3.7, onTimeRate: 96 },
    { month: 'Jun', shipments: 124, avgCost: 3.6, onTimeRate: 96 },
  ];
  
  // Calculate trend insights
  const shipmentGrowth = (((monthlyTrends[5].shipments - monthlyTrends[0].shipments) / monthlyTrends[0].shipments) * 100).toFixed(1);
  const costReduction = (((monthlyTrends[0].avgCost - monthlyTrends[5].avgCost) / monthlyTrends[0].avgCost) * 100).toFixed(1);
  const reliabilityImprovement = (monthlyTrends[5].onTimeRate - monthlyTrends[0].onTimeRate).toFixed(1);
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#0A1A2F]/80 text-white rounded-lg p-4 shadow-md border border-[#00FFD1]/30">
          <div className="text-sm text-gray-400">Shipment Growth</div>
          <div className="text-3xl font-bold text-[#00FFD1]">+{shipmentGrowth}%</div>
          <div className="text-sm text-gray-300">Last 6 months</div>
        </div>
        <div className="bg-[#0A1A2F]/80 text-white rounded-lg p-4 shadow-md border border-[#00FFD1]/30">
          <div className="text-sm text-gray-400">Cost Reduction</div>
          <div className="text-3xl font-bold text-[#00FFD1]">{costReduction}%</div>
          <div className="text-sm text-gray-300">Avg cost per kg</div>
        </div>
        <div className="bg-[#0A1A2F]/80 text-white rounded-lg p-4 shadow-md border border-[#00FFD1]/30">
          <div className="text-sm text-gray-400">On-Time Improvement</div>
          <div className="text-3xl font-bold text-[#00FFD1]">+{reliabilityImprovement}%</div>
          <div className="text-sm text-gray-300">Reliability rate</div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <GlassContainer className="p-4">
          <h3 className="text-[#00FFD1] text-lg font-semibold mb-4">Monthly Performance Trends</h3>
          
          <div className="mb-8 h-64 flex items-end justify-between px-4">
            {monthlyTrends.map((month, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="relative h-52 w-10 flex flex-col justify-end">
                  <div 
                    className={`w-full bg-[#00FFD1] opacity-70 rounded-t-sm h-[${(month.shipments / 124) * 100}%]`}
                  ></div>
                  <div className="absolute top-0 w-full flex justify-center">
                    <span className="text-xs text-[#00FFD1]">{month.shipments}</span>
                  </div>
                </div>
                <div className="text-xs mt-2 text-gray-400">{month.month}</div>
              </div>
            ))}
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full bg-[#131C2B]/50 rounded-lg">
              <thead>
                <tr className="border-b border-[#00FFD1]/20">
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-400">Month</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-400">Shipments</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-400">Avg Cost/kg</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-400">On-Time %</th>
                </tr>
              </thead>
              <tbody>
                {monthlyTrends.map((month, idx) => (
                  <tr key={idx} className="border-b border-[#00FFD1]/10 hover:bg-[#00FFD1]/5">
                    <td className="py-2 px-4 text-sm">{month.month}</td>
                    <td className="py-2 px-4 text-sm">{month.shipments}</td>
                    <td className="py-2 px-4 text-sm">${month.avgCost.toFixed(2)}</td>
                    <td className="py-2 px-4 text-sm">{month.onTimeRate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassContainer>
      </div>
    </div>
  );
}
