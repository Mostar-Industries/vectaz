
import React from 'react';
import { ShipmentMetrics } from '@/types/deeptrack';
import ShipmentMetricsCards from './shipment/ShipmentMetricsCards';
import MonthlyTrendChart from './shipment/MonthlyTrendChart';
import ShipmentStatusChart from './shipment/ShipmentStatusChart';
import ShipmentModeChart from './shipment/ShipmentModeChart';
import OnTimePerformanceChart from './shipment/OnTimePerformanceChart';
import ShipmentInsights from './shipment/ShipmentInsights';

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
        <MonthlyTrendChart monthlyTrend={metrics.monthlyTrend} />
        <ShipmentStatusChart shipmentStatusCounts={metrics.shipmentStatusCounts} />
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ShipmentModeChart shipmentsByMode={metrics.shipmentsByMode} />
        <OnTimePerformanceChart delayedVsOnTimeRate={metrics.delayedVsOnTimeRate} />
      </div>

      {/* Insights card */}
      <ShipmentInsights metrics={metrics} />
    </div>
  );
};

export default ShipmentAnalytics;
