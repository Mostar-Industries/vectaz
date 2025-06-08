import { useEffect, useState } from 'react';
import supabase from '@/lib/supabaseClient';
import { ArrowUp, ArrowDown } from 'lucide-react';

type MetricKey = 'total_shipments' | 'avg_transit_days' | 'disruption_score' | 'resilience_score';

interface DynamicMetricCardProps {
  metricKey: MetricKey;
  title: string;
  precision?: number;
  unit?: string;
  icon?: React.ReactNode;
}

export const DynamicMetricCard = ({
  metricKey,
  title,
  precision = 0,
  unit = '',
  icon
}: DynamicMetricCardProps) => {
  const [value, setValue] = useState<number>(0);
  const [trend, setTrend] = useState<{ value: string; direction: 'up' | 'down' } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial fetch
    fetchMetric();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('realtime-metrics')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'shipment_metrics'
      }, () => fetchMetric())
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [metricKey]);

  const fetchMetric = async () => {
    try {
      setLoading(true);
      const { data } = await supabase
        .from('shipment_metrics')
        .select('*')
        .eq('metric_key', metricKey)
        .single();

      if (data) {
        setValue(data.current_value);
        calculateTrend(data.current_value, data.previous_value);
      }
    } catch (error) {
      console.error('Error fetching metric:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTrend = (current: number, previous: number) => {
    if (previous === 0) return setTrend(null);
    
    const difference = current - previous;
    const percentage = ((difference / previous) * 100).toFixed(1);
    
    setTrend({
      value: `${Math.abs(Number(percentage))}%`,
      direction: difference > 0 ? 'up' : 'down'
    });
  };

  const formatValue = (val: number) => {
    if (isNaN(val)) return '-'; 
    
    return unit === '%' 
      ? (val * 100).toFixed(precision)
      : val.toFixed(precision);
  };

  if (loading) {
    return (
      <div className="border border-emerald-500/20 rounded-xl p-4 bg-gradient-to-b from-gray-900/50 to-slate-900/30 backdrop-blur-sm h-[88px] animate-pulse">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 w-10 h-10"></div>
            <div className="space-y-2">
              <div className="h-4 w-24 bg-gray-700 rounded"></div>
              <div className="h-6 w-16 bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-emerald-500/20 rounded-xl p-4 bg-gradient-to-b from-gray-900/50 to-slate-900/30 backdrop-blur-sm">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
            {icon}
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-400">{title}</h3>
            <p className="text-2xl font-bold text-emerald-400">
              {formatValue(value)}
              <span className="text-sm ml-1 text-gray-400">{unit}</span>
            </p>
          </div>
        </div>
        {trend && (
          <span className={`flex items-center text-sm ${trend.direction === 'up' ? 'text-green-400' : 'text-red-400'}`}>
            {trend.direction === 'up' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
            {trend.value}
          </span>
        )}
      </div>
    </div>
  );
};
