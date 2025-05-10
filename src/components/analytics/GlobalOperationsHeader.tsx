import { useShipmentStore } from '@/store/shipmentStore';
import { Shipment } from '@/types/deeptrack';
import { calculateTotalShipments, calculateEmergencyRatio } from '@/utils/analyticsUtils';

export const GlobalOperationsHeader = () => {
  const { shipments } = useShipmentStore();
  
  const metrics = {
    liveShipments: calculateTotalShipments(shipments),
    emergencyRatio: calculateEmergencyRatio(shipments),
    totalCost: shipments.reduce((sum, s) => sum + (s.freight_carrier_cost || 0), 0),
    avgCostPerKg: calculateAvgCostPerKg(shipments)
  };

  return (
    <div className="grid grid-cols-4 gap-4 p-4 bg-gray-900 rounded-lg">
      {Object.entries(metrics).map(([key, value]) => (
        <div key={key} className="p-4 bg-gray-800 rounded-lg animate-pulse">
          <div className="text-sm text-gray-400 uppercase">{key}</div>
          <div className="text-2xl font-bold text-white">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </div>
        </div>
      ))}
    </div>
  );
};
function calculateAvgCostPerKg(shipments: Shipment[]) {
  throw new Error('Function not implemented.');
}

