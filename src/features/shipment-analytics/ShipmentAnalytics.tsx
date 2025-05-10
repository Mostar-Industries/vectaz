import { useShipmentAnalytics } from './useShipmentAnalytics';
import { ShipmentMetrics } from './ShipmentMetrics';
import { ShipmentVisualizations } from './ShipmentVisualizations';

export const ShipmentAnalytics = () => {
  const { data, view } = useShipmentAnalytics();
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <ShipmentMetrics data={data} />
      </div>
      <div className="lg:col-span-2">
        <ShipmentVisualizations view={view} data={data} />
      </div>
    </div>
  );
};
