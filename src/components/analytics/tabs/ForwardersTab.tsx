import React from 'react';
import { GlassContainer } from '@/components/ui/glass-effects';
import { calculateForwarderPerformance } from '@/utils/analyticsUtils';

export default function ForwardersTab({ data }) {
  const forwarderStats = calculateForwarderPerformance(data);

  const topPerformer = [...forwarderStats].sort((a, b) => b.on_time_rate - a.on_time_rate)[0];
  const costEfficient = [...forwarderStats].sort((a, b) => a.avg_cost_per_kg - b.avg_cost_per_kg)[0];
  const mostShipments = [...forwarderStats].sort((a, b) => b.shipments.length - a.shipments.length)[0];
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#0A1A2F]/80 text-white rounded-lg p-4 shadow-md border border-[#00FFD1]/30">
          <div className="text-sm text-gray-400">Top Performer</div>
          <div className="text-2xl font-bold text-[#00FFD1]">{topPerformer?.name}</div>
          <div className="text-sm text-gray-300">{(topPerformer?.on_time_rate * 100).toFixed(1)}% on-time rate</div>
        </div>
        <div className="bg-[#0A1A2F]/80 text-white rounded-lg p-4 shadow-md border border-[#00FFD1]/30">
          <div className="text-sm text-gray-400">Most Cost Efficient</div>
          <div className="text-2xl font-bold text-[#00FFD1]">{costEfficient?.freight_carrier}</div>
          <div className="text-sm text-gray-300">${costEfficient?.avg_cost_per_kg.toFixed(2)} per kg</div>
        </div>
        <div className="bg-[#0A1A2F]/80 text-white rounded-lg p-4 shadow-md border border-[#00FFD1]/30">
          <div className="text-sm text-gray-400">Highest Volume</div>
          <div className="text-2xl font-bold text-[#00FFD1]">{mostShipments?.freight_carrier}</div>
          <div className="text-sm text-gray-300">{mostShipments?.shipments.length} shipments</div>
        </div>
      </div>
      
      <GlassContainer className="p-4">
        <h3 className="text-[#00FFD1] text-lg font-semibold mb-4">Forwarder Performance</h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full bg-[#131C2B]/50 rounded-lg">
            <thead>
              <tr className="border-b border-[#00FFD1]/20">
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-400">Forwarder</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-400">Total Shipments</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-400">On-Time Rate</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-400">Avg Cost/kg (USD)</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-400">Avg Transit Days</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-400">Rating</th>
              </tr>
            </thead>
            <tbody>
              {forwarderStats.map((forwarder, idx) => (
                <tr key={idx} className="border-b border-[#00FFD1]/10 hover:bg-[#00FFD1]/5">
                  <td className="py-2 px-4 text-sm">{forwarder.freight_carrier}</td>
                  <td className="py-2 px-4 text-sm">{forwarder.shipments.length}</td>
                  <td className="py-2 px-4 text-sm">{(forwarder.on_time_rate * 100).toFixed(1)}%</td>
                  <td className="py-2 px-4 text-sm">${forwarder.avg_cost_per_kg.toFixed(2)}</td>
                  <td className="py-2 px-4 text-sm">{forwarder.avg_transit_days.toFixed(1)}</td>
                  <td className="py-2 px-4">
                    <div className="flex items-center">
                      {Array.from({ length: Math.round((forwarder.on_time_rate * 100) / 20) }, (_, i) => (
                        <svg key={i} className="w-4 h-4 text-[#00FFD1] fill-current" viewBox="0 0 24 24">
                          <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
                        </svg>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassContainer>
    </div>
  );
}
