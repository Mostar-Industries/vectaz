import React from 'react';
import { GlassContainer } from '@/components/ui/glass-effects';
import { computeShipmentInsights } from '@/lib/analytics/shipmentTabData';

export default function TrendsTab({ data }) {
  const metrics = computeShipmentInsights(data);
  const monthlyTrends = metrics.monthlyTrend.map(mt => ({
    month: mt.month,
    shipments: mt.count,
  }));

  const shipmentGrowth = monthlyTrends.length > 1 ? (((monthlyTrends[monthlyTrends.length - 1].shipments - monthlyTrends[0].shipments) / monthlyTrends[0].shipments) * 100).toFixed(1) : '0';
  const costReduction = metrics.avgCostPerKg ? '0' : '0';
  const reliabilityImprovement = ((metrics.delayedVsOnTimeRate.onTime / Math.max(metrics.totalShipments,1)) * 100).toFixed(1);
  
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
                </tr>
              </thead>
              <tbody>
                {monthlyTrends.map((month, idx) => (
                  <tr key={idx} className="border-b border-[#00FFD1]/10 hover:bg-[#00FFD1]/5">
                    <td className="py-2 px-4 text-sm">{month.month}</td>
                    <td className="py-2 px-4 text-sm">{month.shipments}</td>
                    <td className="py-2 px-4 text-sm">${metrics.avgCostPerKg.toFixed(2)}</td>
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
