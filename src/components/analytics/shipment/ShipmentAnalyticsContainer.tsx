import { useShipmentAnalytics } from './useShipmentAnalytics';
import { ShipmentMetricSystem } from './ShipmentMetricSystem';
import { ShipmentVisualizationHub } from './ShipmentVisualizationHub';
import { InsightsOverlay } from './InsightsOverlay';
import { AnalyticsHeader } from '@/components/ui/analytics-header';
import { CarbonRouting, EthicalAlertMonitor } from '@/features/sustainability';
import { DriftRadarIntegration } from '@/features/risk-detection';

export const ShipmentAnalyticsContainer = () => {
  const { view } = useShipmentAnalytics();
  
  return (
    <div className="shipment-analytics-root bg-gray-50 dark:bg-gray-900 p-6 rounded-xl">
      <AnalyticsHeader 
        title="Global Shipment Intelligence"
        actions={[
          <CarbonRouting key="carbon" />,
          <EthicalAlertMonitor key="ethics" />
        ]}
      />
      
      <div className="main-grid grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-1">
          <ShipmentMetricSystem />
        </div>
        <div className="lg:col-span-2">
          <ShipmentVisualizationHub view={view} />
          <DriftRadarIntegration className="mt-6" />
        </div>
      </div>
      
      <InsightsOverlay />
    </div>
  );
};
