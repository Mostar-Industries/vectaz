import { DynamicMetricCard } from '../../analytics/DynamicMetricCard';
import { ConfidenceIndicator } from '@/components/ui/confidence-indicator';
import { StatusBadge } from '@/components/ui/status-badge';
import { ForwarderPerformanceGrid } from '@/features/forwarders';
import { useShipmentAnalytics } from './useShipmentAnalytics';

export const ShipmentMetricSystem = () => {
  const { metrics } = useShipmentAnalytics();
  
  return (
    <div className="metric-grid grid grid-cols-1 gap-4">
      <DynamicMetricCard
        title="Resilience Score"
        value={metrics.resilience}
        trend={metrics.resilienceTrend}
        visual={<ConfidenceIndicator value={metrics.confidence} />}
        className="bg-gradient-to-br from-emerald-500/10 to-emerald-800/5"
      />
      
      <DynamicMetricCard
        title="On-Time Rate"
        value={metrics.onTime}
        trend={metrics.onTimeTrend}
        visual={<StatusBadge status={metrics.status} />}
        className="bg-gradient-to-br from-blue-500/10 to-blue-800/5"
      />
      
      <div className="mt-4">
        <ForwarderPerformanceGrid 
          data={metrics.forwarders}
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-4"
        />
      </div>
    </div>
  );
};
