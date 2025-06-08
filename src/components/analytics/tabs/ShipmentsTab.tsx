import React from 'react';
import { GlassContainer } from '@/components/ui/glass-effects';
import { computeShipmentInsights } from '@/lib/analytics/shipmentTabData';

export default function ShipmentsTab({ data }) {
  const metrics = computeShipmentInsights(data);
  const totalActive = metrics.shipmentStatusCounts.active;
  const totalCompleted = metrics.shipmentStatusCounts.completed;
  const avgTransitTime = metrics.avgTransitTime.toFixed(1);
  const onTimeDelivery = ((metrics.shipmentStatusCounts.onTime / Math.max(metrics.totalShipments,1)) * 100).toFixed(1) + '%';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-[#0A1A2F]/80 text-white rounded-lg p-4 shadow-md border border-[#00FFD1]/30">
          <div className="text-sm text-gray-400">Active Shipments</div>
          <div className="text-3xl font-bold text-[#00FFD1]">{totalActive}</div>
        </div>
        <div className="bg-[#0A1A2F]/80 text-white rounded-lg p-4 shadow-md border border-[#00FFD1]/30">
          <div className="text-sm text-gray-400">Completed</div>
          <div className="text-3xl font-bold text-[#00FFD1]">{totalCompleted}</div>
        </div>
        <div className="bg-[#0A1A2F]/80 text-white rounded-lg p-4 shadow-md border border-[#00FFD1]/30">
          <div className="text-sm text-gray-400">Avg Transit Time</div>
          <div className="text-3xl font-bold text-[#00FFD1]">{avgTransitTime} days</div>
        </div>
        <div className="bg-[#0A1A2F]/80 text-white rounded-lg p-4 shadow-md border border-[#00FFD1]/30">
          <div className="text-sm text-gray-400">On-Time Delivery</div>
          <div className="text-3xl font-bold text-[#00FFD1]">{onTimeDelivery}</div>
        </div>
      </div>

      <GlassContainer className="p-4">
        <h3 className="text-[#00FFD1] text-lg font-semibold mb-4">Shipment Analytics</h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full bg-[#131C2B]/50 rounded-lg">
            <thead>
              <tr className="border-b border-[#00FFD1]/20">
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-400">ID</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-400">Origin</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-400">Destination</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-400">Status</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-400">Weight (kg)</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-400">Carrier</th>
              </tr>
            </thead>
            <tbody>
              {data?.slice(0, 10).map((shipment, idx) => (
                <tr key={shipment.id || idx} className="border-b border-[#00FFD1]/10 hover:bg-[#00FFD1]/5">
                  <td className="py-2 px-4 text-sm">{shipment.request_reference || shipment.id || '-'}</td>
                  <td className="py-2 px-4 text-sm">{shipment.origin_country || '-'}</td>
                  <td className="py-2 px-4 text-sm">{shipment.destination_country || '-'}</td>
                  <td className="py-2 px-4 text-sm">
                    <span className={`inline-block px-2 py-1 rounded text-xs ${
                      shipment.delivery_status === 'delivered' ? 'bg-green-500/20 text-green-300' : 
                      shipment.delivery_status === 'in_transit' ? 'bg-blue-500/20 text-blue-300' :
                      'bg-yellow-500/20 text-yellow-300'
                    }`}>
                      {shipment.delivery_status || 'pending'}
                    </span>
                  </td>
                  <td className="py-2 px-4 text-sm">{shipment.weight_kg?.toFixed(1) || '-'}</td>
                  <td className="py-2 px-4 text-sm">{shipment.freight_carrier || shipment.carrier || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassContainer>
    </div>
  );
}
