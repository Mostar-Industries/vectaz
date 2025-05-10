import { useQuery } from '@tanstack/react-query';
import { fetchShipmentData } from '@/api/shipment-analytics';
import { transformMetrics, transformChartData, transformGeoData } from './data-transforms';

export const useShipmentAnalytics = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ['shipment-analytics'],
    queryFn: fetchShipmentData,
    staleTime: 5 * 60 * 1000 // 5 minutes
  });

  return {
    metrics: transformMetrics(data),
    charts: transformChartData(data),
    geo: transformGeoData(data),
    error,
    isLoading,
    view: 'resilience' as const
  };
};
