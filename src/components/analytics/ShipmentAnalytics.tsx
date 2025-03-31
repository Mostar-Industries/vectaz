
import React from 'react';
import { ShipmentMetrics } from '@/types/deeptrack';
import ShipmentMetricsCards from './shipment/ShipmentMetricsCards';
import MonthlyTrendChart from './shipment/MonthlyTrendChart';
import ShipmentStatusChart from './shipment/ShipmentStatusChart';
import ShipmentModeChart from './shipment/ShipmentModeChart';
import OnTimePerformanceChart from './shipment/OnTimePerformanceChart';
import ShipmentInsights from './shipment/ShipmentInsights';
import ShipmentResilienceChart from './shipment/ShipmentResilienceChart';

interface ShipmentAnalyticsProps {
  metrics: ShipmentMetrics;
}

const ShipmentAnalytics: React.FC<ShipmentAnalyticsProps> = ({ metrics }) => {
  return (
    <div className="space-y-6">
      {/* Top KPIs */}
      <ShipmentMetricsCards metrics={metrics} />

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="cyber-panel rounded-md overflow-hidden">
          <MonthlyTrendChart monthlyTrend={metrics.monthlyTrend} />
        </div>
        <div className="cyber-panel rounded-md overflow-hidden">
          <ShipmentStatusChart shipmentStatusCounts={metrics.shipmentStatusCounts} />
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="cyber-panel rounded-md overflow-hidden">
          <ShipmentModeChart shipmentsByMode={metrics.shipmentsByMode} />
        </div>
        <div className="cyber-panel rounded-md overflow-hidden">
          <OnTimePerformanceChart delayedVsOnTimeRate={metrics.delayedVsOnTimeRate} />
        </div>
      </div>
      
      {/* Charts Row 3 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="cyber-panel rounded-md overflow-hidden">
          <ShipmentResilienceChart metrics={metrics} />
        </div>
        <div className="cyber-panel rounded-md overflow-hidden">
          <ShipmentInsights metrics={metrics} />
        </div>
      </div>
    </div>
  );
};

export default ShipmentAnalytics;
