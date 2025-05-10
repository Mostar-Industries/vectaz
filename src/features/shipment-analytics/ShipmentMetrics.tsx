import { DynamicMetricCard } from '../../components/analytics/DynamicMetricCard';

export const ShipmentMetrics = ({ data }) => (
  <div className="space-y-4">
    <DynamicMetricCard 
      title="Resilience Score"
      value={data.resilienceScore}
      trend={data.resilienceTrend}
    />
    <DynamicMetricCard
      title="On-Time Rate"
      value={data.onTimeRate}
      trend={data.onTimeTrend}
    />
    {/* Additional consolidated metrics */}
  </div>
);
